---
name: sql-query-optimizer
description: |
  Reviews slow SQL queries and suggests optimizations: missing indexes, rewritten
  query structures, EXPLAIN ANALYZE interpretation, and N+1 query detection. Use
  this skill whenever a user says "this SQL query is slow", "optimize this query",
  "explain this query plan", "why is this query taking so long?", "add an index for
  this query", "fix this N+1 query", "rewrite this subquery", "my database is
  slow", or "help me optimize this JOIN". Also activate when someone shares an
  EXPLAIN output and needs help reading it. Works with PostgreSQL, MySQL, and
  SQLite. Do NOT use for schema design (use sql-migration-drafter) or ORM query
  optimization without seeing the generated SQL first.
---

# SQL Query Optimizer

Analyze slow SQL queries, interpret EXPLAIN plans, suggest indexes, and rewrite
queries for optimal performance.

## When to Use

- A specific query is causing slow response times
- A page or API endpoint has unexpectedly high database load
- Reviewing a query before deploying to production
- Interpreting an EXPLAIN ANALYZE output

## When NOT to Use

- Database schema design from scratch (use `sql-migration-drafter`)
- Database server configuration tuning (PostgreSQL `postgresql.conf`)
- Data warehouse query optimization (different engines — BigQuery, Snowflake)

---

## Workflow

### Step 1 — Collect the Query and Context

Ask for:

1. **The slow SQL query** (exact text)
2. **EXPLAIN (ANALYZE)** output if available
3. **Table schemas** — especially column types and existing indexes
4. **Row counts** — approximate size of each table in the query
5. **Database:** PostgreSQL / MySQL / SQLite
6. **Current execution time** and desired target

### Step 2 — Analyze the Query

Check for these common performance problems:

| Problem                        | Symptom in EXPLAIN                          | Fix                        |
| ------------------------------ | ------------------------------------------- | -------------------------- |
| Sequential scan on large table | `Seq Scan` on table with many rows          | Add index                  |
| Missing join index             | `Hash Join` with `Seq Scan` on joined table | Index the FK column        |
| N+1 query                      | Loop of single-row lookups                  | JOIN or `IN (subquery)`    |
| `SELECT *` with unused columns | Fetching wide rows                          | Select only needed columns |
| No covering index              | Index scan + heap fetch                     | Add covering index         |
| Correlated subquery in SELECT  | Subquery per row                            | Rewrite as JOIN or CTE     |
| `LIKE '%value%'`               | Seq scan (can't use B-tree index)           | Use full-text search       |
| Large `OFFSET` pagination      | Sequential scan to skip rows                | Cursor-based pagination    |
| `ORDER BY` without index       | Sort operation                              | Add index on sort column   |
| `DISTINCT` without index       | Expensive dedup                             | Add index or restructure   |

### Step 3 — Interpret the EXPLAIN Plan

Key things to look for in PostgreSQL EXPLAIN:

```
Seq Scan on orders (cost=0.00..24500.00 rows=1000000 width=100)
  Filter: (status = 'pending')
```

- **`cost=X..Y`** — startup cost..total cost in arbitrary units
- **`rows=N`** — estimated rows returned
- **`Seq Scan`** — full table scan ❌ (usually bad for large tables)
- **`Index Scan`** — uses index ✅
- **`Bitmap Index Scan`** — batch index + heap fetch ✅ (for many rows)
- **`Hash Join`** vs **`Nested Loop`** — hash is better for large datasets
- **Actual time= X..Y rows=N loops=Z** — with ANALYZE, shows real numbers

### Step 4 — Recommend Indexes

```sql
-- Slow query: find pending orders for a user
SELECT * FROM orders WHERE user_id = $1 AND status = 'pending' ORDER BY created_at DESC;

-- Missing: composite index on (user_id, status, created_at)
CREATE INDEX CONCURRENTLY idx_orders_user_status_created
    ON orders (user_id, status, created_at DESC);

-- For covering index (avoid heap fetch), include all selected columns:
CREATE INDEX CONCURRENTLY idx_orders_user_status_covering
    ON orders (user_id, status, created_at DESC)
    INCLUDE (id, total_amount, customer_name);
```

**Index naming convention:** `idx_{table}_{columns}` or `idx_{table}_{columns}_{purpose}`

### Step 5 — Rewrite Problem Queries

**Correlated subquery → JOIN:**

```sql
-- Before (slow: subquery runs once per row)
SELECT u.id, u.name,
  (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;

-- After (fast: single JOIN + GROUP BY)
SELECT u.id, u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name;
```

**Large OFFSET pagination → cursor-based:**

```sql
-- Before (slow: PostgreSQL must scan and skip all rows before offset)
SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 10000;

-- After (fast: seek to the cursor position directly)
SELECT * FROM orders
WHERE created_at < $cursor_value  -- last `created_at` from previous page
ORDER BY created_at DESC
LIMIT 20;
```

**Unnecessary DISTINCT:**

```sql
-- Before
SELECT DISTINCT u.id, u.email FROM users u JOIN orders o ON o.user_id = u.id;

-- After (use EXISTS — stops at first match)
SELECT u.id, u.email FROM users u WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

**Rewrite subquery as CTE for readability and planning:**

```sql
-- CTE (WITH clause) — PostgreSQL < 12 materializes; use for complex multi-step logic
WITH recent_orders AS (
  SELECT user_id, SUM(total_amount) AS total_spent
  FROM orders
  WHERE created_at >= NOW() - INTERVAL '30 days'
  GROUP BY user_id
)
SELECT u.id, u.name, COALESCE(ro.total_spent, 0)
FROM users u
LEFT JOIN recent_orders ro ON ro.user_id = u.id;
```

### Step 6 — Produce the Optimization Report

```markdown
## Query Optimization Report

### Identified Issues

1. ❌ Sequential scan on `orders` (1.2M rows) — no index on (user_id, status)
2. ❌ Correlated subquery in SELECT running once per user row
3. ⚠️ OFFSET 50000 in pagination — scans and discards rows

### Recommended Indexes

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_orders_user_status_created
ON orders (user_id, status, created_at DESC);
\`\`\`
Estimated time to create: ~45 seconds on 1.2M rows (CONCURRENTLY is safe for production)

### Rewritten Query

[shows optimized version]

### Expected Improvement

Before: ~3,200ms | After: ~12ms (estimated from index selectivity)
```

---

## Output Format

1. **Issue list** — numbered problems found in the query
2. **Recommended indexes** — with `CREATE INDEX CONCURRENTLY` and naming
3. **Rewritten query** — optimized version with comments
4. **EXPLAIN interpretation** — if an EXPLAIN output was provided
5. **Expected improvement** — rough estimate where possible

---

## Safety & Confirmation

- Always use `CREATE INDEX CONCURRENTLY` in production to avoid table locks.
- Never `DROP INDEX` without verifying nothing else uses it.
- Warn if adding too many indexes — each index slows INSERT/UPDATE/DELETE.
- Recommend testing in a staging environment first for queries that change result sets.
- For rewritten queries, verify they return identical results before replacing.

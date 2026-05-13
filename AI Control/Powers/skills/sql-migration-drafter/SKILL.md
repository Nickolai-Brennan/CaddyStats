---
name: sql-migration-drafter
description: |
  Drafts SQL database migration scripts with corresponding rollback (down) migrations
  and safety checks. Use this skill whenever a user says "write a database migration",
  "create a SQL migration", "draft a schema change", "help me add a column safely",
  "write an up/down migration", "how do I rename this table without downtime?",
  "write a migration to add an index", or "help me migrate this schema". Also activate
  when a user describes a database schema change and needs the SQL to implement it safely.
  Works with PostgreSQL, MySQL, and SQLite. Do NOT use for writing application-level
  ORM models, seeding test data, or backup/restore procedures.
---

# SQL Migration Drafter

Write safe, reversible database migration scripts with up/down pairs, safety checks,
and zero-downtime strategies for production-critical changes.

## When to Use

- Adding, removing, or renaming columns or tables
- Adding indexes or constraints
- Changing column types
- Any schema change that needs to be applied in a managed, reversible way

## When NOT to Use

- Writing ORM model code (Prisma, SQLAlchemy, ActiveRecord)
- Seeding test data (use `data-cleaning-recipe-writer` or a seed script)
- Backup and restore procedures
- Query optimization (separate concern)

---

## Workflow

### Step 1 — Understand the Change

Ask the user:

1. **What change is needed?** (Add column / remove column / add index / rename / change type)
2. **Which database?** (PostgreSQL, MySQL, SQLite — syntax differs)
3. **Is this table live in production?** (Affects zero-downtime strategy)
4. **Expected table size?** (Large tables need special care for index/constraint additions)
5. **Migration framework?** (Flyway, Liquibase, Alembic, raw SQL, custom)

### Step 2 — Plan the Migration

For each change type, apply the appropriate safe pattern:

#### Adding a Column

```sql
-- Safe: Add nullable first, backfill, then add constraint
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
-- Backfill if needed:
UPDATE users SET phone_number = '' WHERE phone_number IS NULL;
-- Then add NOT NULL constraint (separate migration if large table)
ALTER TABLE users ALTER COLUMN phone_number SET NOT NULL;
```

#### Removing a Column

```sql
-- Step 1: Stop writing to the column in app code (deploy first)
-- Step 2 (separate migration): Drop the column
ALTER TABLE users DROP COLUMN legacy_field;
```

#### Adding an Index (Zero-Downtime for PostgreSQL)

```sql
-- PostgreSQL: Use CONCURRENTLY to avoid table lock
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

#### Renaming a Column (Zero-Downtime)

```sql
-- Never rename directly in production with active queries
-- Step 1: Add new column, migrate data
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
UPDATE users SET full_name = first_name || ' ' || last_name;
-- Step 2: After app code reads from full_name, drop old columns
ALTER TABLE users DROP COLUMN first_name;
ALTER TABLE users DROP COLUMN last_name;
```

#### Changing Column Type

```sql
-- Always test with USING clause to handle type conversion
ALTER TABLE events ALTER COLUMN event_date TYPE TIMESTAMP
  USING event_date::TIMESTAMP;
```

### Step 3 — Write Up and Down Migrations

Always write both:

```sql
-- ====================================
-- Migration: [M001]_add_phone_to_users
-- Created: [YYYY-MM-DD]
-- Description: Adds phone_number column to users table
-- ====================================

-- UP migration
BEGIN;

ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);

COMMENT ON COLUMN users.phone_number IS 'User phone number, optional';

COMMIT;

-- ====================================
-- DOWN migration (rollback)
-- ====================================

BEGIN;

ALTER TABLE users DROP COLUMN IF EXISTS phone_number;

COMMIT;
```

### Step 4 — Add Safety Checks

Preconditions to include:

```sql
-- Check that column doesn't already exist (PostgreSQL)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
  END IF;
END $$;
```

### Step 5 — Flag Large Table Warnings

If the table is large (>1M rows) and the migration involves:

- Adding NOT NULL column with default → warn about table rewrite
- Regular index creation → recommend CONCURRENTLY (PostgreSQL)
- Column type change → recommend testing on a copy first

---

## Output Format

````
## Migration: [name]

**Type:** [add column / add index / etc.]
**Database:** [PostgreSQL / MySQL / SQLite]
**Zero-downtime safe:** [Yes / No — explanation]
**Estimated impact:** [Instant / <1s / May lock table for Xs on large tables]

### UP Migration
\```sql
[SQL here]
\```

### DOWN Migration (Rollback)
\```sql
[SQL here]
\```

### Testing Steps
1. [Verify step]
2. [Verify step]
````

---

## Safety & Confirmation

- **Never write irreversible migrations without flagging them** (dropping tables, removing NOT NULL from a primary key).
- Always wrap in a transaction (`BEGIN; ... COMMIT;`) for atomicity.
- Flag any migration that requires app code to be deployed first (column rename, column removal).
- Never include real data values in migration scripts — use constants or environment references.
- Confirm with the user before suggesting destructive operations (DROP COLUMN, DROP TABLE).

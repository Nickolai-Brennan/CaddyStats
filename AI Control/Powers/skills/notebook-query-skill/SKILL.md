---
name: notebook-query-skill
description: |
  Writes SQL queries, data analysis notebooks (Jupyter/Python/R), and analytics workflows
  for data exploration, reporting, and insight generation. Use this skill when a user asks
  for SQL queries, data analysis scripts, notebook cells, analytics code, data exploration
  workflows, or wants to extract insights from a dataset. Common phrasings: "write a SQL
  query for X", "help me analyze this data", "create a Jupyter notebook", "how do I query
  this table?", "give me Python to explore this dataset", "write analytics code", "I need
  a report query", "summarize this data with code". Do NOT use when the user wants to
  clean messy data before analysis (use data-cleaning-skill), design a database schema
  (use database-schema-skill), visualize results with a dashboard UI (use
  dashboard-design-skill), or train/build a machine learning model.
---

# Notebook Query Skill

## Overview

The Notebook Query Skill writes SQL queries, Python/pandas data analysis scripts, and
Jupyter notebook workflows for data exploration, aggregation, and reporting. It produces
runnable, well-commented code with clear explanations of what each query or cell does.
It is oriented toward analysts and engineers who need to extract insights from existing
data structures — tables, DataFrames, or files.

## When to Use / When NOT to Use

**Use this skill when:**

- User has a database schema or dataset and wants query code written
- User wants to explore, aggregate, filter, or pivot data
- User needs a Jupyter notebook structure for a data analysis task
- User wants to generate reports or summary statistics from data
- User asks "how do I get X from my data?"

**Do NOT use this skill when:**

- Data is messy and needs cleaning first (use `data-cleaning-skill`)
- User needs to design the database schema (use `database-schema-skill`)
- User wants a full dashboard or visualization UI designed (use `dashboard-design-skill`)
- User needs a machine learning pipeline built

## Inputs

- **Schema or data description**: Table names, column names, data types, sample rows
- **Analysis goal**: What question the query or notebook should answer
- **SQL dialect or Python library** _(optional)_: PostgreSQL, BigQuery, pandas, polars, etc.
- **Output format** _(optional)_: Table, chart, summary stats, export to CSV

## Outputs

- **SQL queries**: Well-formatted, commented SQL with CTEs for complex logic
- **Python/pandas code**: Analysis scripts or Jupyter notebook cells
- **Result description**: What the output columns mean and how to interpret results
- **Performance notes**: Index hints, query optimization suggestions for large datasets

## Workflow

1. Understand the schema and analysis goal from inputs.
2. Ask about missing context: dialect, relevant tables, time range, filters, if unclear.
3. Draft the query/code; use CTEs for readability over nested subqueries.
4. Add inline comments explaining non-obvious logic.
5. Describe expected output shape and how to interpret it.
6. Add performance notes if the query touches large tables or does expensive operations.

**Stop conditions:**

- Stop and ask if the schema or goal is too ambiguous to write correct code.
- Stop and warn before writing queries that perform DELETE, UPDATE, or DROP.

## Edge Cases

- **No schema provided**: Ask for table names and key columns before writing.
- **Very complex joins**: Break into CTEs; explain the join logic in comments.
- **Large table queries**: Add `LIMIT` for exploration queries; note index dependencies.
- **Time zone handling**: Ask or note the assumed time zone for timestamp comparisons.
- **NULL handling**: Be explicit about how NULLs affect aggregations (COUNT vs. SUM).

## Safety & Secrets

- Never include real connection strings, passwords, or credentials in query code.
- Use placeholder comments (`-- replace with your connection string`) for DSN/config.
- Warn and require confirmation before writing any mutating query (INSERT, UPDATE, DELETE).
- Add a dry-run `SELECT` equivalent or `EXPLAIN` suggestion before destructive operations.
- Do not print or log sample data containing PII in notebook output cells.

## Examples

### Example 1: Cohort retention analysis

**User prompt:** "Write a SQL query to calculate monthly cohort retention for my users
table. I have: user_id, signup_date, and an events table with user_id and event_date."

**Expected output:**

```sql
WITH cohorts AS (
  SELECT
    user_id,
    DATE_TRUNC('month', signup_date) AS cohort_month
  FROM users
),
activity AS (
  SELECT
    c.user_id,
    c.cohort_month,
    DATE_TRUNC('month', e.event_date) AS activity_month,
    DATE_PART('month', AGE(DATE_TRUNC('month', e.event_date), c.cohort_month))
      AS months_since_signup
  FROM cohorts c
  JOIN events e ON c.user_id = e.user_id
)
SELECT
  cohort_month,
  months_since_signup,
  COUNT(DISTINCT user_id) AS retained_users
FROM activity
GROUP BY 1, 2
ORDER BY 1, 2;
```

Explanation of each CTE and how to pivot results for a retention matrix.

### Example 2: Python exploratory data analysis

**User prompt:** "Give me a Jupyter notebook structure to explore a CSV of sales
transactions — I want summary stats, time trends, and top products."

**Expected output:**
Notebook with cells: (1) imports and data load with `pd.read_csv()`, (2) `.info()` and
`.describe()` for schema and stats, (3) null check per column, (4) time trend line chart
with `df.resample()`, (5) top 10 products by revenue with `.groupby().agg().sort_values()`,
(6) correlation heatmap. Each cell has a markdown cell explaining its purpose.

## Testing / Evals

See `evals/evals.json` for test prompts. Run 2–3 prompts and compare outputs against
`expected_output` descriptions.

## References

- [Data Pipeline Guide](../../references/data-pipeline-guide.md)
- [Data Rules](../../instructions/data-rules.md)
- [Model Formula Skill](../model-formula-skill/SKILL.md)
- [Database Designer](../database-designer/SKILL.md)
- [Skill Registry](../skill-registry.md)

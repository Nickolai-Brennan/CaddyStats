---
name: data-cleaning-skill
description: |
  Cleans, normalizes, and validates datasets: fixes formatting inconsistencies, handles
  null/missing values, deduplicates records, standardizes field values, validates data
  types, and prepares data for downstream analysis or import. Use this skill when a user
  has messy data to fix, needs to normalize a CSV or table, wants data preparation before
  analysis or loading, or needs a cleaning plan for a dataset. Common phrasings: "clean
  this data", "fix my CSV", "normalize these fields", "deduplicate this table", "my data
  has inconsistencies", "prepare this for analysis", "standardize these values", "handle
  nulls in my dataset". Do NOT use when the user wants to analyze or visualize already-clean
  data (use notebook-query-skill), design a database schema (use database-schema-skill),
  or build an ETL pipeline (beyond cleaning rules, into full pipeline architecture).
---

# Data Cleaning Skill

## Overview

The Data Cleaning Skill produces structured data cleaning plans, transformation rules, and
ready-to-run code (Python/pandas, SQL, or pseudocode) to fix messy datasets. It addresses
null handling, type coercion, deduplication, value standardization, outlier detection,
and validation. It works from provided sample data or schema descriptions and outputs
cleaning rules, transformation code, and a quality report template.

## When to Use / When NOT to Use

**Use this skill when:**

- User provides a dataset (CSV, table, JSON) with quality issues to resolve
- User needs a systematic cleaning plan before loading data into a database or model
- User wants code to standardize inconsistent values (casing, formats, abbreviations)
- User needs nulls handled: imputation, flagging, or removal strategy
- User wants duplicate detection and deduplication logic

**Do NOT use this skill when:**

- Data is already clean and the user wants analysis (use `notebook-query-skill`)
- User needs full ETL pipeline architecture beyond cleaning rules
- The request is about designing database schema (use `database-schema-skill`)
- User wants to visualize or chart data (use `dashboard-design-skill`)

## Inputs

- **Dataset sample**: First 20–50 rows of the dataset, or a schema description
- **Field definitions** _(optional)_: Expected types, formats, valid value ranges
- **Target system** _(optional)_: Where clean data goes (database, ML model, report)
- **Language preference** _(optional)_: Python/pandas, SQL, R — defaults to Python/pandas

## Outputs

- **Cleaning plan**: Prioritized list of issues and transformation rules per field
- **Transformation code**: Python/pandas or SQL to apply all cleaning steps
- **Validation checks**: Post-cleaning assertions to verify correctness
- **Data quality report template**: Summary of issues found and resolved counts

## Workflow

1. Examine the dataset sample; profile each column (type, nulls %, unique values, min/max).
2. Identify cleaning issues: nulls, type mismatches, inconsistent casing, duplicates,
   outliers, invalid values, format inconsistencies.
3. Propose a cleaning strategy for each issue; ask if resolution is ambiguous (e.g.,
   imputation method choice depends on downstream use).
4. Write transformation code in the preferred language, step by step.
5. Add validation assertions: row counts, null counts post-clean, type checks, range checks.
6. Document assumptions made (e.g., "nulls in `email` field treated as invalid; rows dropped").

**Stop conditions:**

- Stop and ask if the semantics of a field are unclear (e.g., what should null mean?).
- Stop and ask before dropping rows or columns — confirm the user accepts data loss.

## Edge Cases

- **High null percentage (>30%)**: Flag the field; ask whether to impute, flag, or drop.
- **Duplicate primary key candidates**: Surface duplicates; ask user to confirm key fields.
- **Ambiguous date formats**: Ask for canonical format; don't assume MM/DD vs DD/MM.
- **Mixed language/encoding issues**: Detect and flag; recommend UTF-8 normalization.
- **Outliers**: Flag statistical outliers; do not remove without user confirmation.

## Safety & Secrets

- Never log, commit, or print PII (names, emails, phone numbers, SSNs) found in sample
  data beyond what is necessary to describe the issue.
- Warn before any operation that drops rows or columns; require confirmation.
- Do not transmit sample data containing sensitive fields to external systems.
- If sample data appears to contain credentials or tokens, flag immediately and stop.

## Examples

### Example 1: Customer CSV normalization

**User prompt:** "I have a CSV of customer records. The `phone` column has mixed formats
(+1-555-000-1234, 5550001234, (555) 000-1234). The `email` has some nulls. The `state`
field uses both full names and abbreviations. Fix it."

**Expected output:**

- `phone`: Normalize to E.164 format (`+15550001234`) using regex strip + reformat
- `email`: Flag null rows; ask whether to drop or flag with `is_email_missing` boolean
- `state`: Build a mapping dict full-name→abbreviation; apply with `.map()` + fallback
- Python/pandas code for each step with inline comments
- Validation: assert phone matches `^\+1\d{10}$`, assert state in set of 50 abbrevs

### Example 2: Deduplicate order table

**User prompt:** "My orders table has duplicate rows — same order_id appears multiple
times. I want to keep the most recent record for each order_id."

**Expected output:**

- SQL: `DELETE FROM orders WHERE id NOT IN (SELECT MAX(id) FROM orders GROUP BY order_id)`
  or equivalent `ROW_NUMBER()` window function approach
- Python alternative using `.sort_values().drop_duplicates(subset='order_id', keep='last')`
- Warning: confirm before running destructive DELETE; suggest a dry-run SELECT first
- Validation query: `SELECT order_id, COUNT(*) FROM orders GROUP BY order_id HAVING COUNT(*) > 1`

## Testing / Evals

See `evals/evals.json` for test prompts. Run 2–3 prompts and compare outputs against
`expected_output` descriptions.

## References

- [Data Pipeline Guide](../../references/data-pipeline-guide.md)
- [Data Rules](../../instructions/data-rules.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Skill Registry](../skill-registry.md)

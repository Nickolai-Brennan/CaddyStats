---
name: data-cleaning
agent: data-cleanup-agent
phase: PROTOTYPE|MVP|PRODUCTION
---

# Prompt: Data Cleaning

## Objective

Clean, normalize, deduplicate, and validate a raw dataset, producing a cleaned output file and a documented cleaning report.

## Context Requirements

- Raw dataset path or description
- Expected schema (column names, types, constraints)
- Cleaning rules from `instructions/data-rules.md`
- Acceptable null rates and deduplication key columns

## Instructions

You are the data-cleanup-agent. Given the following context:

**Project context**: {{project_context}}
**Dataset description**: {{dataset_description}}
**Expected schema**: {{expected_schema}}
**Cleaning rules**: {{cleaning_rules}}

Complete the following:

1. Identify all null, empty, and invalid values per column; apply imputation or removal per cleaning rules.
2. Standardize formats: dates to ISO 8601, strings to consistent casing, numeric types to specified precision.
3. Detect and remove duplicate records using the defined key columns; log count of duplicates removed.
4. Validate final dataset against expected schema; report pass/fail per column.
5. Produce `cleaning_report.md` documenting every transformation applied.

## Output Format

```yaml
cleaning_report:
  source_rows: 50000
  output_rows: 48312
  transformations:
    - column: created_at
      action: "Converted to ISO 8601"
      rows_affected: 50000
    - column: email
      action: "Lowercased; removed 42 invalid formats"
      rows_affected: 42
  duplicates_removed: 1688
  validation:
    - column: user_id
      type_check: PASS
      null_check: PASS
```

## Quality Checks

- [ ] Null rate < 5% in all key columns after cleaning
- [ ] Zero rows with invalid types in final dataset
- [ ] `cleaning_report.md` documents every transformation

## Safety Rules

- Never remove records without logging the action in cleaning_report
- Flag PII columns (email, name, SSN) before any transformation

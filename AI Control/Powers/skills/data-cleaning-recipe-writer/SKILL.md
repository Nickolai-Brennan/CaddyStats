---
name: data-cleaning-recipe-writer
description: |
  Writes step-by-step data cleaning recipes using Python and pandas (or polars):
  handles missing values, deduplication, type coercion, outlier removal, string
  normalization, and format standardization. Use this skill whenever a user says
  "clean this data", "write pandas code to fix this dataset", "how do I handle
  missing values in this CSV?", "deduplicate this dataframe", "normalize these
  strings", "fix these date formats", "write a data cleaning pipeline", or
  "prepare this data for analysis". Also activate when a user shares a sample
  of messy data and asks how to fix it. Do NOT use for SQL-based data cleaning
  (use sql-migration-drafter) or full ETL pipeline design.
---

# Data Cleaning Recipe Writer

Write clear, reproducible pandas (or polars) data cleaning pipelines that fix
messy data, document assumptions, and preserve data integrity.

## When to Use

- Raw data has inconsistent formats, nulls, duplicates, or outliers
- Preparing data for analysis, ML, or reporting
- Building a reusable cleaning pipeline for a recurring dataset
- Documenting data quality assumptions

## When NOT to Use

- SQL-based cleaning in a database (use `sql-migration-drafter`)
- Large-scale distributed processing (Spark, Dask — different skill)
- Exploratory data analysis (EDA) and visualization

---

## Workflow

### Step 1 — Understand the Data

Ask the user to share:

1. A sample of the raw data (first 5–10 rows, or column names + types)
2. Target format or schema (what should the clean data look like?)
3. Any known data quality issues
4. What the data will be used for (analysis, ML training, reporting)

If no sample is provided, ask for: column names, data types, expected value ranges, and known issues.

### Step 2 — Profile the Data Issues

Identify cleaning tasks needed:

| Issue Type           | Detection                   | Fix approach                    |
| -------------------- | --------------------------- | ------------------------------- |
| Missing values       | `df.isnull().sum()`         | Drop, fill, or flag             |
| Duplicates           | `df.duplicated().sum()`     | `df.drop_duplicates()`          |
| Wrong dtype          | `df.dtypes`                 | `pd.to_datetime()`, `.astype()` |
| String inconsistency | Value counts                | `.str.strip().str.lower()`      |
| Outliers             | `df.describe()`, IQR method | Clip or flag                    |
| Mixed formats        | Sample inspection           | Regex or parsing                |

### Step 3 — Write the Cleaning Recipe

Structure the cleaning code as a pipeline:

```python
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean the input dataframe.

    Assumptions:
    - 'email' column should be lowercase and stripped
    - 'created_at' is a date in mixed formats (ISO and US)
    - 'amount' should be positive float
    - Rows with null 'user_id' are dropped

    Returns: cleaned DataFrame
    """
    original_shape = df.shape

    # 1. Drop rows missing critical identifiers
    df = df.dropna(subset=['user_id'])
    logger.info(f"Dropped {original_shape[0] - len(df)} rows with null user_id")

    # 2. Deduplicate
    before = len(df)
    df = df.drop_duplicates(subset=['user_id', 'event_id'])
    logger.info(f"Removed {before - len(df)} duplicate rows")

    # 3. Normalize strings
    df['email'] = df['email'].str.strip().str.lower()

    # 4. Parse dates
    df['created_at'] = pd.to_datetime(df['created_at'], infer_datetime_format=True, errors='coerce')
    null_dates = df['created_at'].isnull().sum()
    if null_dates > 0:
        logger.warning(f"{null_dates} rows have unparseable dates — set to NaT")

    # 5. Type coercion
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')

    # 6. Outlier flagging (IQR method)
    Q1 = df['amount'].quantile(0.25)
    Q3 = df['amount'].quantile(0.75)
    IQR = Q3 - Q1
    df['amount_is_outlier'] = (df['amount'] < Q1 - 1.5 * IQR) | (df['amount'] > Q3 + 1.5 * IQR)

    logger.info(f"Cleaning complete. Shape: {original_shape} → {df.shape}")
    return df
```

### Step 4 — Document Assumptions

Include a clear docstring or comment block explaining:

- Which columns were changed and how
- What was dropped and why
- What is flagged vs. removed
- Any data that could NOT be cleaned (left as NaN)

### Step 5 — Add Validation

After cleaning, add assertions to verify the result:

```python
def validate_cleaned_data(df: pd.DataFrame) -> None:
    """Assert post-cleaning invariants."""
    assert df['user_id'].notnull().all(), "user_id must not be null"
    assert df['email'].str.contains('@').all(), "All emails must be valid"
    assert (df['amount'] >= 0).all(), "Amounts must be non-negative"
    assert not df.duplicated(subset=['user_id', 'event_id']).any(), "No duplicates"
```

---

## Output Format

A Python code block with:

1. `clean_dataframe(df)` function with docstring listing assumptions
2. `validate_cleaned_data(df)` function
3. A sample usage block showing how to run it on a CSV

---

## Safety & Confirmation

- Never drop data silently — always log what was removed and why.
- Flag (don't delete) outliers by default; only delete on explicit request.
- When overwriting a file, always write to a new file first (e.g., `_cleaned.csv`).
- Document all assumptions explicitly — unexamined assumptions are bugs.

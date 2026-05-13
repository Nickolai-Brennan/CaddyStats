# Workflow: 02-data-cleanup

## Overview

Cleans, normalizes, deduplicates, and validates raw datasets produced by WF-01. Run this workflow before any analysis or model training to ensure downstream agents receive consistent, trustworthy data.

## Phase

PROTOTYPE · MVP · PRODUCTION

## Participants

| Agent              | Role                                                    |
| ------------------ | ------------------------------------------------------- |
| orchestrator-agent | Coordinates cleanup steps and validates outputs         |
| data-cleanup-agent | Executes all cleaning, normalization, and deduplication |

## Inputs

- `ingested_raw_data/` from WF-01
- `data_inventory.md` from WF-01
- Cleaning rules (from `instructions/data-rules.md`)

## Outputs

- `cleaned_dataset/`
- `cleaning_report.md`
- `validation_summary.md`

## Steps

### Step 1: Null and Outlier Handling (Agent: data-cleanup-agent)

**Action**: Impute or remove nulls per strategy; cap/remove statistical outliers.
**Inputs**: `ingested_raw_data/`, cleaning rules.
**Outputs**: Intermediate cleaned files.
**Saves to**: `docs/agent-outputs/data-cleanup-agent/`

### Step 2: Normalization and Type Casting (Agent: data-cleanup-agent)

**Action**: Standardize date formats, string casing, numeric precision, and categorical encodings.
**Inputs**: Intermediate cleaned files.
**Outputs**: Normalized files.
**Saves to**: `docs/agent-outputs/data-cleanup-agent/`

### Step 3: Deduplication (Agent: data-cleanup-agent)

**Action**: Identify and remove duplicate records using defined key columns.
**Inputs**: Normalized files.
**Outputs**: Deduplicated files with duplicate log.
**Saves to**: `docs/agent-outputs/data-cleanup-agent/`

### Step 4: Validation (Agent: data-cleanup-agent)

**Action**: Run schema validation and row-count checks; produce pass/fail summary.
**Inputs**: Deduplicated files.
**Outputs**: `validation_summary.md`
**Saves to**: `docs/agent-outputs/data-cleanup-agent/`

### Step 5: Final Assembly (Agent: data-cleanup-agent)

**Action**: Write `cleaned_dataset/` and produce `cleaning_report.md`.
**Inputs**: Validated files.
**Outputs**: `cleaned_dataset/`, `cleaning_report.md`
**Saves to**: `docs/agent-outputs/data-cleanup-agent/`

## Success Criteria

- [ ] Zero schema validation errors in `validation_summary.md`
- [ ] Null rate < 5% in critical columns
- [ ] `cleaning_report.md` documents all transformations applied

## Error Handling

| Scenario                            | Response                                                        |
| ----------------------------------- | --------------------------------------------------------------- |
| High null rate (>30%) in key column | Halt; escalate to orchestrator for data re-collection           |
| Deduplication removes >20% of rows  | Flag in cleaning_report; require human sign-off                 |
| Type cast failure                   | Log affected rows; skip and continue; report in cleaning_report |

## Safety Gates

- [ ] No secrets in any output files
- [ ] Confirmation required before destructive operations
- [ ] All outputs saved to correct output directory

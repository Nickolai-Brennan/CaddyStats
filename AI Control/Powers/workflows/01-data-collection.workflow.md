# Workflow: 01-data-collection

## Overview

Ingests raw data from source systems (files, APIs, databases) and validates format and completeness. Use this workflow at the start of any data-driven project to establish a clean, inventoried baseline before analysis or modeling.

## Phase

PROTOTYPE · MVP · PRODUCTION

## Participants

| Agent              | Role                                                 |
| ------------------ | ---------------------------------------------------- |
| orchestrator-agent | Coordinates ingestion tasks and validates completion |
| data-cleanup-agent | Prepares and pre-validates incoming raw data         |

## Inputs

- Source definitions (file paths, API endpoints, DB connection specs)
- Expected schema or column manifest
- `project_brief.md` from WF-00

## Outputs

- `ingested_raw_data/` (directory of raw files)
- `data_inventory.md`
- `source_report.md`

## Steps

### Step 1: Source Configuration (Agent: orchestrator-agent)

**Action**: Parse source definitions and confirm all sources are reachable.
**Inputs**: Source definitions, credentials (from secure vault only).
**Outputs**: Validated source list.
**Saves to**: `docs/agent-outputs/orchestrator-agent/`

### Step 2: Raw Ingestion (Agent: data-cleanup-agent)

**Action**: Pull data from each source; write raw files to output directory without modification.
**Inputs**: Validated source list.
**Outputs**: `ingested_raw_data/`
**Saves to**: `docs/agent-outputs/data-cleanup-agent/`

### Step 3: Format and Completeness Check (Agent: data-cleanup-agent)

**Action**: Verify file formats, row counts, null rates, and schema against manifest.
**Inputs**: `ingested_raw_data/`, expected schema.
**Outputs**: `source_report.md` with pass/fail per source.
**Saves to**: `docs/agent-outputs/data-cleanup-agent/`

### Step 4: Data Inventory (Agent: data-cleanup-agent)

**Action**: Catalog all ingested files with metadata (source, rows, columns, date range).
**Inputs**: `ingested_raw_data/`
**Outputs**: `data_inventory.md`
**Saves to**: `docs/agent-outputs/data-cleanup-agent/`

## Success Criteria

- [ ] All expected sources ingested without error
- [ ] `source_report.md` shows no critical failures
- [ ] `data_inventory.md` lists every file with metadata

## Error Handling

| Scenario              | Response                                           |
| --------------------- | -------------------------------------------------- |
| Source unreachable    | Log; flag in source_report.md; skip and continue   |
| Schema mismatch       | Flag in source_report.md; escalate to orchestrator |
| Partial data received | Note row count delta; continue with warning        |

## Safety Gates

- [ ] No secrets in any output files
- [ ] Credentials fetched from vault; never written to disk
- [ ] All outputs saved to correct output directory

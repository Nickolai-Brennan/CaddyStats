---
name: data-refresh-check
schedule: "0 6 * * *"
trigger: schedule
agent: data-cleanup-agent
---

# Automation: Data Refresh Check

## Purpose

Verify that all registered data sources have refreshed on schedule; flag stale, missing, or malformed data before the business day begins.

## Schedule

- **Frequency**: Daily
- **Time**: 06:00 UTC
- **Trigger type**: Schedule

## Steps

1. Load the data source registry from `data_inventory.md`.
2. Check the last-modified timestamp of each ingested file against its expected refresh interval.
3. For API-based sources, send a lightweight health-check request and verify response status.
4. Flag any source where data is older than `expected_interval × 1.5`.
5. Post a status report; create a GitHub issue for any failed source.

## Inputs

- `docs/agent-outputs/data-cleanup-agent/data_inventory.md`
- Data source registry (file paths and API endpoints)

## Outputs / Notifications

- `data-refresh-status-YYYY-MM-DD.md`
- **Notification channel**: GitHub issue (on failure only) titled "Data Refresh Failure — <source-name>"

## Success Criteria

- [ ] All sources checked within 10 minutes of 06:00 UTC
- [ ] Stale sources flagged before 06:30 UTC
- [ ] No false positives (sources flagged that are actually fresh)

## Error Handling

| Scenario                    | Response                                   |
| --------------------------- | ------------------------------------------ |
| Source file not found       | Create failure issue; notify orchestrator  |
| API health check timeout    | Retry twice; then flag as stale            |
| `data_inventory.md` missing | Halt; create issue requesting WF-01 re-run |

## Safety Rules

- Never commit or log secrets found during scan
- API health checks must use read-only credentials stored in vault
- Do not modify source data during check

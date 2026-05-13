---
name: dashboard-quality-check
schedule: "0 7 * * *"
trigger: schedule
agent: stats-visualization-agent
---

# Automation: Dashboard Quality Check

## Purpose

Validate daily that all dashboards load correctly, display fresh data, and have no broken charts or failed data fetches.

## Schedule

- **Frequency**: Daily
- **Time**: 07:00 UTC
- **Trigger type**: Schedule

## Steps

1. Load the dashboard registry from `docs/agent-outputs/stats-visualization-agent/visualization_specs.md`.
2. For each dashboard, send an HTTP request to the dashboard URL and verify HTTP 200 response.
3. Check each data source endpoint referenced in `component_plan.md`; verify response is non-empty and within expected row-count range.
4. Check the last-updated timestamp of each data source; flag if older than the defined refresh interval.
5. Post status report; create a GitHub issue for any failed dashboard or stale data source.

## Inputs

- `docs/agent-outputs/stats-visualization-agent/visualization_specs.md`
- `docs/agent-outputs/frontend-dashboard-agent/component_plan.md`
- Dashboard URL registry

## Outputs / Notifications

- `dashboard-health-YYYY-MM-DD.md`
- **Notification channel**: GitHub issue (on failure) titled "Dashboard Quality Failure — <dashboard-name>"

## Success Criteria

- [ ] All dashboards return HTTP 200
- [ ] No data source stale beyond its refresh interval
- [ ] Report posted before 07:30 UTC

## Error Handling

| Scenario                           | Response                                 |
| ---------------------------------- | ---------------------------------------- |
| Dashboard URL unreachable          | Retry twice; then create failure issue   |
| Data source returns empty response | Flag as stale; create issue              |
| `component_plan.md` missing        | Log warning; check only URL reachability |

## Safety Rules

- Never commit or log secrets found during scan
- Use read-only service account for all HTTP checks
- Do not modify dashboard configuration during check

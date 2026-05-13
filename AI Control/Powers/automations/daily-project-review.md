---
name: daily-project-review
schedule: "0 9 * * *"
trigger: schedule
agent: orchestrator-agent
---

# Automation: Daily Project Review

## Purpose

Scan all active tasks, blocked items, and stale PRs each morning to surface blockers and keep projects on track.

## Schedule

- **Frequency**: Daily
- **Time**: 09:00 UTC
- **Trigger type**: Schedule

## Steps

1. Fetch all open issues and PRs from the repository.
2. Flag any PR open > 3 days without review as stale.
3. Flag any task in `active-tasks.md` not updated in > 2 days as at-risk.
4. Identify blocked tasks in `blocked-tasks.md`; check if blockers have been resolved.
5. Compile summary report and post as a GitHub issue comment or discussion.

## Inputs

- `tasks/active-tasks.md`
- `tasks/blocked-tasks.md`
- GitHub Issues and PR list (via API)

## Outputs / Notifications

- Daily summary report (markdown)
- **Notification channel**: GitHub issue titled "Daily Review — YYYY-MM-DD"

## Success Criteria

- [ ] All active tasks reviewed and status confirmed
- [ ] Stale PRs flagged with owner mentioned
- [ ] Report posted by 09:15 UTC

## Error Handling

| Scenario               | Response                                 |
| ---------------------- | ---------------------------------------- |
| GitHub API unavailable | Retry after 5 min; log failure; skip day |
| No active tasks found  | Post "No active tasks" summary; continue |

## Safety Rules

- Never commit or log secrets found during scan
- Require human review before closing any task automatically
- Read-only access to repo; never push changes

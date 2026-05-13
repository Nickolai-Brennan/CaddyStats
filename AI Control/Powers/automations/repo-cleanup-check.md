---
name: repo-cleanup-check
schedule: "0 12 * * 5"
trigger: schedule
agent: repo-maintenance-agent
---

# Automation: Repo Cleanup Check

## Purpose

Scan the repository weekly for stale branches, unused large files, oversized commits, and potential secrets in history to maintain repo hygiene.

## Schedule

- **Frequency**: Weekly
- **Time**: 12:00 UTC every Friday
- **Trigger type**: Schedule

## Steps

1. List all branches; flag any not merged and with last commit > 30 days ago.
2. Scan for files > 5 MB tracked in git history; list with sizes.
3. Check for commits > 50 MB total diff size; log commit SHAs.
4. Run pattern-based secret scan across all files in HEAD (API keys, tokens, connection strings).
5. Compile `repo_health_report.md`; create a GitHub issue for each category with findings.

## Inputs

- Git branch list and commit history
- All files tracked in HEAD
- Secret patterns from `instructions/security-rules.md`

## Outputs / Notifications

- `repo-health-YYYY-MM-DD.md`
- **Notification channel**: GitHub issues per category (stale branches, large files, secrets)

## Success Criteria

- [ ] All branches reviewed
- [ ] Secrets scan completed with zero false negatives
- [ ] Report posted within 1 hour of start time

## Error Handling

| Scenario                | Response                                                      |
| ----------------------- | ------------------------------------------------------------- |
| Git command timeout     | Retry once; then log partial results                          |
| Secret detected         | Immediately create critical-severity issue; notify repo owner |
| Branch list API failure | Log error; skip branch check; continue with other steps       |

## Safety Rules

- Never commit or log actual secret values found during scan; log only file path and line number
- Require human review and approval before deleting any branch or file
- Never force-push or rewrite history automatically

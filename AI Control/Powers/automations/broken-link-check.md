---
name: broken-link-check
schedule: "0 11 * * 3"
trigger: schedule
agent: documentation-agent
---

# Automation: Broken Link Check

## Purpose

Scan all markdown documentation files weekly for broken internal and external links, and report findings for remediation.

## Schedule

- **Frequency**: Weekly
- **Time**: 11:00 UTC every Wednesday
- **Trigger type**: Schedule

## Steps

1. Enumerate all `*.md` files in the repository recursively.
2. Extract all hyperlinks (internal relative paths and external URLs) from each file.
3. For internal links: verify the target file or heading anchor exists.
4. For external links: send HEAD requests with a 10-second timeout; flag 4xx, 5xx, and timeout responses.
5. Compile broken-link report and create a GitHub issue listing all failures with file and line references.

## Inputs

- All `*.md` files in the repository
- External URL list extracted from markdown

## Outputs / Notifications

- `broken-link-report-YYYY-MM-DD.md`
- **Notification channel**: GitHub issue titled "Broken Link Report — YYYY-MM-DD" (if any failures)

## Success Criteria

- [ ] All markdown files scanned
- [ ] All internal links verified
- [ ] External links checked with at most one retry
- [ ] Report posted within 30 minutes of start time

## Error Handling

| Scenario                                | Response                                                |
| --------------------------------------- | ------------------------------------------------------- |
| Network unavailable for external checks | Skip external links; flag in report; retry next run     |
| File system error reading markdown      | Log error; skip file; continue scan                     |
| > 50 broken links found                 | Create high-priority issue; mention documentation-agent |

## Safety Rules

- Never commit or log secrets found during scan
- Never follow redirects to unknown domains more than twice
- Read-only file system access; do not modify any documentation files

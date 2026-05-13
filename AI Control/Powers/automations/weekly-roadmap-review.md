---
name: weekly-roadmap-review
schedule: "0 10 * * 1"
trigger: schedule
agent: project-planner-agent
---

# Automation: Weekly Roadmap Review

## Purpose

Review roadmap milestones every Monday to track progress, surface risks, and update the risk register.

## Schedule

- **Frequency**: Weekly
- **Time**: 10:00 UTC every Monday
- **Trigger type**: Schedule

## Steps

1. Load `roadmap.md` and `milestones.md` from the project output directory.
2. Compare each milestone target date against today; flag any milestone past due.
3. Check `tasks/completed-tasks.md` for milestones marked done; update milestone status.
4. Review `risk_register.md`; flag any risk with likelihood HIGH or impact HIGH that has no recent mitigation update.
5. Post weekly progress summary as a GitHub discussion or issue.

## Inputs

- `docs/agent-outputs/project-planner-agent/roadmap.md`
- `docs/agent-outputs/project-planner-agent/milestones.md`
- `docs/agent-outputs/project-planner-agent/risk_register.md`
- `tasks/completed-tasks.md`

## Outputs / Notifications

- `weekly-roadmap-summary-YYYY-MM-DD.md`
- **Notification channel**: GitHub issue titled "Weekly Roadmap Review — YYYY-MM-DD"

## Success Criteria

- [ ] All milestones reviewed and status updated
- [ ] Past-due milestones flagged with owner mentioned
- [ ] High-severity risks reviewed

## Error Handling

| Scenario             | Response                                                        |
| -------------------- | --------------------------------------------------------------- |
| `roadmap.md` missing | Post warning issue; request project-planner-agent to regenerate |
| No milestones found  | Log and post "Roadmap not yet defined"                          |

## Safety Rules

- Never commit or log secrets found during scan
- Require human review before modifying roadmap files
- Read-only access to all project documents

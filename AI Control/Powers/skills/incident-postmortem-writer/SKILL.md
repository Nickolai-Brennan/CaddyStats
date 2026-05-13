---
name: incident-postmortem-writer
description: |
  Writes a structured incident postmortem (post-incident review) from raw notes,
  timelines, and team input. Use this skill whenever a user says "write a postmortem",
  "document this incident", "write an incident report", "help us do a blameless
  retrospective on this outage", "turn these incident notes into a PIR",
  "write a post-incident review", or "document what happened during the outage".
  Also activate when someone shares a timeline of events and asks for a structured
  incident document. Do NOT use for live incident response, writing runbooks for
  future incidents, or general meeting retrospectives.
---

# Incident Postmortem Writer

Transform raw incident notes, chat logs, and timelines into a structured,
blameless postmortem that helps teams learn and prevent recurrence.

## When to Use

- An incident, outage, or production issue has been resolved and needs documentation
- A team wants to run a blameless post-incident review
- Stakeholders need a formal incident report
- You want to track action items from an incident for accountability

## When NOT to Use

- During an active incident (this is retrospective documentation)
- Writing runbooks for handling future incidents (use `workflow-documenter`)
- General meeting retrospectives

---

## Workflow

### Step 1 — Gather Raw Material

Collect from the user:

1. **Incident summary:** What broke? What was impacted? How long?
2. **Timeline:** Ordered events with timestamps (approximate is fine)
3. **Root cause:** The underlying reason(s) the incident occurred
4. **Contributing factors:** What made it worse or harder to detect?
5. **Resolution steps:** How was it fixed?
6. **Action items:** What will prevent recurrence?
7. **Team involved:** Who detected, investigated, and resolved it?

If a Slack/PagerDuty/OpsGenie thread is available, offer to extract the timeline.

### Step 2 — Apply Blameless Framing

Postmortems should:

- Focus on **systems and processes**, not individuals
- Ask "why did the system allow this?" not "why did [person] do X?"
- Identify **multiple contributing factors**, not a single root cause
- Avoid "human error" as a root cause — dig deeper to find what made error possible

### Step 3 — Produce the Postmortem Document

```markdown
# Incident Postmortem — [Title]

**Date:** [YYYY-MM-DD]
**Severity:** P[0-3] | **Duration:** [N hours/minutes]
**Status:** [Resolved / Monitoring]
**Authors:** [Names]

---

## Summary

[2–3 sentence summary: what broke, what was impacted, how long, how resolved]

## Impact

- **Users affected:** [N users / % of traffic]
- **Services affected:** [Service names]
- **Duration:** [Start] → [End] ([N] hours total)
- **Business impact:** [Revenue, SLA, customer trust]

## Timeline

| Time (UTC) | Event                        |
| ---------- | ---------------------------- |
| HH:MM      | [Event description]          |
| HH:MM      | [Alert fired / person paged] |
| HH:MM      | [Investigation began]        |
| HH:MM      | [Root cause identified]      |
| HH:MM      | [Fix deployed]               |
| HH:MM      | [Incident resolved]          |

## Root Cause Analysis

### Primary Cause

[What was the direct technical cause?]

### Contributing Factors

- [Factor 1 — e.g., monitoring gap]
- [Factor 2 — e.g., insufficient testing of edge case]
- [Factor 3 — e.g., manual process that was error-prone]

## What Went Well

- [Thing 1 — e.g., quick detection via alerts]
- [Thing 2 — e.g., team communication was clear]

## What Could Be Improved

- [Improvement 1]
- [Improvement 2]

## Action Items

| Action                  | Owner   | Priority | Due Date |
| ----------------------- | ------- | -------- | -------- |
| [Preventive action]     | @person | P[0-3]   | [Date]   |
| [Detection improvement] | @person | P[0-3]   | [Date]   |
| [Process change]        | @person | P[0-3]   | [Date]   |

## Lessons Learned

[2–3 sentences on key takeaways for the team and organization]
```

### Step 4 — Review for Tone

Check that the document:

- Uses neutral, blameless language throughout
- Does not name individuals as causes (names OK in "who investigated" contexts)
- Is specific enough to be useful for prevention
- Has concrete, assigned action items (not vague "we should improve monitoring")

---

## Output Format

A single Markdown document structured as shown above.

Optionally provide a shortened executive summary (5 sentences) for stakeholder communication.

---

## Safety & Confirmation

- Flag any statements that assign blame to individuals and rephrase before finalizing.
- Never share the postmortem externally (customer-facing) without human review — some details may be sensitive.
- If revenue or customer data numbers are involved, confirm with the user before including exact figures.

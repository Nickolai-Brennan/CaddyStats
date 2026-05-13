---
name: weekly-review-summarizer
description: |
  Summarizes a week's worth of work into a structured weekly review: what was
  accomplished, what's in progress, blockers, and the plan for next week. Use this
  skill whenever a user says "write my weekly review", "summarize my week",
  "draft a weekly status update", "what did we ship this week?", "write the
  weekly progress report", or "help me write my Friday update". Also activate when
  someone pastes a week's worth of standup updates, commits, or ticket activity
  and wants a rolled-up summary. Do NOT use for daily standups (use
  daily-standup-drafter) or monthly/quarterly reports.
---

# Weekly Review Summarizer

Roll up a week's activity into a clear, scannable review that helps teams stay
aligned, spot patterns, and plan the next sprint.

## When to Use

- End-of-week status update for a manager or stakeholder
- Team weekly review document (eng, product, growth, etc.)
- Personal weekly reflection for a productivity system
- Sprint retrospective input

## When NOT to Use

- Daily standups (use `daily-standup-drafter`)
- Monthly business reviews or quarterly reports
- Project post-mortems

---

## Workflow

### Step 1 — Gather Input

Accept any of:

1. Five days of standup updates (pasted or described)
2. Git commit history for the week
3. Closed tickets/PRs for the week
4. A freeform brain dump of the week's work
5. Meeting notes or calendar summary

Ask: "What week is this for? What team or project?"

### Step 2 — Extract Themes

Group individual items into themes or workstreams:

- Feature work
- Bug fixes
- Reviews and collaboration
- Planning / stakeholder work
- Infrastructure / tooling
- Learning / research

### Step 3 — Calculate Progress Signal

Where possible, include a quick quantitative summary:

- PRs merged: N
- Issues closed: N
- Deployments: N
- Key metric movement (if shared)

### Step 4 — Draft the Weekly Review

```markdown
## Weekly Review — Week of [Date]

**Team / Individual:** [Name]

### 📦 Shipped This Week

- [Item 1] — brief impact note
- [Item 2]

### 🔄 In Progress

- [Item] — [% complete or next milestone]

### 🚧 Blockers & Risks

- [Blocker] — action needed: [what / who]

### 📈 Metrics (if available)

- PRs merged: N | Issues closed: N | Deploys: N

### 🗓️ Next Week

- [Priority 1]
- [Priority 2]
- [Priority 3]

### 💡 Insights & Learnings

- [Optional: patterns noticed, process improvements, shoutouts]
```

### Step 5 — Tailor for Audience

| Audience          | Adjustments                                       |
| ----------------- | ------------------------------------------------- |
| Manager/exec      | Lead with outcomes and impact, not tasks          |
| Peer team         | More technical detail, mention reviews/collab     |
| Personal journal  | Add reflection, energy levels, lessons learned    |
| Stakeholder email | Convert to prose narrative with bullet highlights |

---

## Output Format

Default: Markdown with emoji section headers, suitable for Notion, Confluence, or GitHub issues.

### Prose Email Format

```
Hi [name],

Here's a quick summary of the week ending [date]:

We shipped [X and Y], completed [Z], and [metric]...

Next week, we're focused on [top priorities].

[Your name]
```

---

## Safety & Confirmation

- Flag any performance-sensitive information (revenue figures, user counts) before including — confirm the user is okay sharing it.
- Never include unconfirmed estimates as facts ("we might hit $1M ARR" → flag and ask).
- If shipping metrics are missing, note "(metrics unavailable)" rather than guessing.

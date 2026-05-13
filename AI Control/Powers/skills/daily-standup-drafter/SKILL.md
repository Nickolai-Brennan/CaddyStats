---
name: daily-standup-drafter
description: |
  Drafts a daily standup update from your recent work activity, commit history,
  calendar events, or bullet notes. Use this skill whenever a user says "write my
  standup", "draft my daily update", "what should I say at standup today?", "help
  me summarize what I worked on yesterday", or "write my async standup post". Also
  activate when someone shares recent commits, tickets, or a quick brain dump and
  asks for a standup-ready summary. Do NOT use for weekly reviews, meeting agendas,
  or project status reports (those are separate skills).
---

# Daily Standup Drafter

Turn your raw activity data — commits, tickets, notes — into a crisp standup update
that fits in under a minute.

## When to Use

- You need to write a daily standup for Slack, Notion, or a live meeting
- You want to turn last night's work into a clear update before the morning call
- You're writing an async standup update and want it to sound professional

## When NOT to Use

- Weekly reviews or sprint summaries (use `weekly-review-summarizer`)
- Writing a full project status report
- Generating meeting agendas

---

## Workflow

### Step 1 — Gather Input

Ask for any combination of:

1. **Yesterday's activity:** commits, PR descriptions, ticket updates, notes, or a free-form brain dump
2. **Today's plan:** what you intend to work on
3. **Blockers:** anything preventing progress
4. **Team format:** standard (yesterday/today/blockers), async Slack post, or custom fields
5. **Tone:** formal, casual, or match the team's existing style

If the user provides a git log or PR list, extract work items automatically.

### Step 2 — Categorize and Condense

Group activities into clear categories:

- Completed / shipped
- In progress
- Starting today
- Blocked / waiting on

Condense multiple related commits into a single line:

- Bad: "Fixed typo, fixed another typo, updated test for typo"
- Good: "Fixed several typos in the onboarding flow and updated tests"

### Step 3 — Draft the Standup

Use the standard three-part format by default:

```markdown
**Yesterday**

- [Completed item 1]
- [Completed item 2]

**Today**

- [Planned item 1]
- [Planned item 2]

**Blockers**

- [Blocker] — waiting on @person / ETA: [date]
- None
```

### Step 4 — Tone Adjustment

| Tone             | Style                                                                        |
| ---------------- | ---------------------------------------------------------------------------- |
| Casual (Slack)   | "Shipped the auth fix 🎉, tackling CSV export today"                         |
| Formal (written) | "Completed implementation of authentication fix. Today: CSV export feature." |
| Async (Notion)   | Full sentences, more context per item                                        |

### Step 5 — Optional: Add Context Links

If ticket numbers or PR links are provided, append them as inline references:
`- Fixed auth redirect loop ([#101](link))`

---

## Output Format

```markdown
**Daily Standup — [Date]**

**Yesterday ✅**

- [Item]

**Today 🔨**

- [Item]

**Blockers 🚧**

- [Blocker or "None"]
```

### Async Slack Format

```
:white_check_mark: *Yesterday:* [item 1] · [item 2]
:hammer: *Today:* [item 1] · [item 2]
:rotating_light: *Blockers:* [blocker or None]
```

---

## Safety & Confirmation

- Never include sensitive information (credentials, PII, unreleased product details) in a standup.
- Flag if any item looks like it might contain confidential info and ask before including it.
- Keep the output under 150 words unless the user asks for more detail.

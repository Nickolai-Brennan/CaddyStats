---
name: repo-triage
description: |
  Triages GitHub issues and pull requests: applies labels, assigns reviewers, drafts
  triage comments, and routes work to the correct team or milestone. Use this skill
  whenever a user says "triage these issues", "label my PRs", "help me route this
  issue", "which team should own this bug?", "tag these tickets", or "help me clean
  up the backlog". Also activate when someone pastes a list of issues/PRs and asks
  for prioritization or categorization. Do NOT use for writing code fixes, closing
  issues without review, or making architectural decisions about issue scope.
---

# Repo Triage

Systematically classify, label, and route GitHub issues and pull requests so nothing
falls through the cracks and every item lands with the right owner.

## When to Use

- Backlog has unlabeled or unassigned issues
- A batch of new issues/PRs just arrived and need routing
- You want to clean up a stale issue queue
- Sprint planning is coming up and you need issues bucketed

## When NOT to Use

- You need to _resolve_ issues (write code, implement features)
- Closing issues without human review
- Deciding product strategy or feature priority (triage categorizes; prioritization is a separate decision)

---

## Workflow

### Step 1 — Gather Input

Ask the user for:

1. The list of issues/PRs (paste raw, share URLs, or describe the batch)
2. The label taxonomy they use (or offer to infer one from context)
3. Available assignees / team names
4. Any escalation rules ("security bugs → @security-team", "P0 → milestone: hotfix")

If the user is connected to a GitHub MCP or has pasted raw data, extract the following fields per item:

- `id` / number
- `title`
- `body` (first 500 chars is enough)
- Current labels and assignee

### Step 2 — Classify Each Item

For each issue/PR apply the following decision tree:

| Dimension    | Questions to ask                                      |
| ------------ | ----------------------------------------------------- |
| **Type**     | Bug / Feature / Chore / Question / Security / Docs    |
| **Priority** | P0 (blocking) / P1 (urgent) / P2 (normal) / P3 (low)  |
| **Team**     | Frontend / Backend / Infra / Data / Security / Design |
| **Status**   | Needs triage / Needs info / Ready / Blocked / Stale   |

Assign labels from the taxonomy. If no taxonomy is provided, use the defaults above.

### Step 3 — Draft Triage Comments

For each item that needs user input, draft a short comment (≤3 sentences):

- What is unclear or missing
- What the author should provide
- Estimated re-triage timeline

### Step 4 — Produce the Triage Table

Output a Markdown table with columns:

```
| # | Title | Type | Priority | Team | Suggested Labels | Assignee | Notes |
```

Follow with any individual triage comments formatted as:

```
---
### Issue #42 — "Login fails on mobile Safari"
**Labels:** `bug`, `P1`, `frontend`
**Assign to:** @frontend-team
**Triage comment:**
> Can you share a console screenshot and the Safari version? Reproduced on iOS 16?
---
```

### Step 5 — Confirm Before Acting

If the user wants to apply labels/assignments via API or CLI:

- Show the full list of proposed changes
- Ask for explicit confirmation: "Apply all of the above? (yes / edit / cancel)"
- Only proceed after affirmative confirmation
- Never bulk-close or bulk-delete without a second confirmation

---

## Output Format

```markdown
## Triage Summary — [Date]

**Total items reviewed:** N
**Labeled:** N | **Assigned:** N | **Needs info:** N | **Stale flagged:** N

| #   | Title     | Type | Priority | Team     | Labels                | Assignee |
| --- | --------- | ---- | -------- | -------- | --------------------- | -------- |
| 12  | Login bug | Bug  | P1       | Frontend | `bug`,`P1`,`frontend` | @alice   |

...

### Items Needing Follow-Up

- #15 — missing reproduction steps (comment drafted below)
```

---

## Safety & Confirmation

- **Never close issues automatically.** Flag stale items; let humans close.
- **Never remove existing labels** without listing them and asking permission.
- **Dry-run mode:** Default to outputting the triage table before any API calls.
- If unsure about team ownership, mark as `needs-triage` and note the ambiguity.

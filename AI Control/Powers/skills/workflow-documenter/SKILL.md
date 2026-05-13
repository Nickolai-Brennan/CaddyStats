---
name: workflow-documenter
description: |
  Documents existing processes and workflows as structured SOPs (Standard Operating
  Procedures), runbooks, or process guides that any team member can follow.
  Use this skill whenever a user says "document this process", "write a runbook for
  this", "create an SOP for this workflow", "document how we do this", "write a
  step-by-step guide for this process", "help me capture this workflow before
  someone leaves", or "turn this into a repeatable process". Also activate when
  a user describes a process verbally and wants it written down. Do NOT use for
  creating new processes from scratch or for documenting code/APIs (use
  documentation-generator or codebase-onboarding-guide).
---

# Workflow Documenter

Capture tribal knowledge and ad-hoc processes as clear, step-by-step SOPs and
runbooks that any team member can follow without the original author.

## When to Use

- Documenting a process before a team member leaves
- Standardizing how a repeated task is done across the team
- Creating an on-call runbook for a system or service
- Capturing a new process that was just figured out
- Turning a verbal description of "how we do things" into a document

## When NOT to Use

- Creating entirely new processes (this documents existing ones)
- Code or API documentation (use `documentation-generator`)
- Meeting notes (use `meeting-notes-to-actions`)

---

## Workflow

### Step 1 — Interview for the Process

Ask the user to walk through the process. Prompt with:

1. **What triggers this process?** (When does it start? What event or request causes it?)
2. **Who performs it?** (Role, not name)
3. **Step by step: what happens?** (Ask "then what?" after each step until complete)
4. **What tools or systems are involved?**
5. **What are the common failure points?** (What can go wrong? What do you do then?)
6. **How do you know it succeeded?** (Verification step)
7. **How often does this happen?** (Frequency)

### Step 2 — Identify the Document Type

| Type             | When to use                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| **SOP**          | Repeatable business process, compliance-relevant, needs formal sign-off  |
| **Runbook**      | Operational task for engineers, especially on-call scenarios             |
| **How-to guide** | Single task, more casual, knowledge-base article style                   |
| **Process map**  | Visual representation (see `architecture-diagram-generator` for Mermaid) |

### Step 3 — Structure the Document

**SOP Template:**

```markdown
# [Process Name] — Standard Operating Procedure

**SOP ID:** SOP-[number]
**Version:** 1.0
**Last Updated:** [Date]
**Owner:** [Team or Role]
**Frequency:** [Daily / Weekly / On demand]
**Estimated time:** [N minutes]

---

## Purpose

[1–2 sentence description of what this process does and why it exists]

## Scope

**Applies to:** [Who does this?]
**Triggers:** [What event causes this process to start?]
**Out of scope:** [What does this NOT cover?]

## Prerequisites

- [ ] [Access/permission needed]
- [ ] [Tool or system required]
- [ ] [Knowledge assumed]

## Procedure

### Step 1 — [Action Name]

**Role:** [Who does this]
**Tool:** [System/application]

[Instructions — imperative, specific, numbered sub-steps if needed]

**Verification:** [How do you know this step succeeded?]

### Step 2 — [Action Name]

...

## Decision Points

| Condition      | Action             |
| -------------- | ------------------ |
| If [X] happens | Do [Y]             |
| If [error Z]   | Escalate to [role] |

## Rollback / Recovery

[What to do if the process fails partway through]

## Completion Criteria

[How do you know the whole process is done?]

## Related Documents

- [Link to related SOP or runbook]
```

**Runbook Template:**

```markdown
# [System/Scenario] Runbook

**Trigger:** [Alert name or situation]
**Severity:** P[0-3]
**On-call contact:** [Role or escalation path]

## Symptoms

- [What the user/monitor reports]

## Quick Triage (5 minutes)

1. [Check command]
2. [Check command]

## Resolution Steps

### Option A — [Most likely fix]

1. [Step]
2. [Step]
   **Verify:** [How to confirm it worked]

### Option B — [Alternative fix]

...

## Escalation

If unresolved after [N] minutes: escalate to [role] via [channel]

## Post-Resolution

- [ ] Update incident log
- [ ] Notify [team]
```

### Step 4 — Fill in Detail

For each step:

- Write in imperative: "Click X", "Run Y", "Open Z" — not "You should click"
- Include exact commands, menu paths, or UI descriptions
- Note expected outputs so the user knows when they've done it right
- Add screenshots or code blocks for technical steps

### Step 5 — Review for Completeness

After drafting, verify:

- Could a new team member follow this without asking questions?
- Are all decision points handled?
- Is there a failure/rollback path?
- Are tool names and access requirements specified?

---

## Output Format

Primary: A structured Markdown document using either the SOP or Runbook template.

Sections should use H2 headers; sub-steps use H3 or numbered lists.

---

## Safety & Confirmation

- Never include credentials, passwords, or tokens in the document — use `<ADD_HERE>` placeholders and note where to find them (e.g., "See 1Password vault: [entry name]").
- For processes with irreversible steps (data deletion, deployments to production), add a ⚠️ warning callout before those steps.
- Confirm the process is complete before finalizing — missing steps in a runbook are worse than no runbook.

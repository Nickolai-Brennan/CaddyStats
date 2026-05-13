---
name: project-intake-skill
description: |
  Gathers and structures project requirements: goals, scope, stakeholders, deliverables,
  constraints, timeline, and success criteria. Use this skill when starting a new project,
  onboarding a client, capturing requirements from a conversation or brief, structuring a
  project proposal, or creating a project charter. Common phrasings: "help me start a new
  project", "capture my requirements", "create a project brief", "I want to kick off a
  project", "define the scope of this project", "write up what we discussed", "structure
  my project plan", "help me onboard this client", "what do I need to define for this
  project?". Do NOT use when the project is already defined and underway — this skill is
  for the intake/discovery phase, not ongoing project management, status reporting, or
  sprint planning (those are execution-phase activities).
---

# Project Intake Skill

## Overview

The Project Intake Skill guides users through defining a new project from scratch. It
produces a structured project brief capturing goals, scope, stakeholders, deliverables,
constraints, timeline, risks, and success criteria. It works interactively — asking
targeted questions — or from an unstructured brief, and outputs a standardized document
ready for review and sign-off.

## When to Use / When NOT to Use

**Use this skill when:**

- User is starting a new project and needs to define it clearly
- User has a rough idea but needs it structured into a proper brief or charter
- User needs to capture requirements from a stakeholder conversation
- User is onboarding a new client and needs a discovery document
- User wants to document scope, goals, and success criteria before work begins

**Do NOT use this skill when:**

- The project is already in execution; use project management tooling instead
- User needs sprint planning, story writing, or task breakdown (different phase)
- User wants a full project plan with Gantt chart (execution-phase planning)
- The request is about a technical design decision, not project definition

## Inputs

- **Project description**: What the user wants to build, deliver, or achieve
- **Stakeholders** _(optional)_: Who is involved, who funds it, who are the users
- **Rough timeline** _(optional)_: Deadlines, key milestones, or launch window
- **Constraints** _(optional)_: Budget, tech stack, team size, regulatory requirements
- **Conversation transcript** _(optional)_: Notes from a discovery call or meeting

## Outputs

- **Project brief**: Structured document with all key fields completed
- **Open questions log**: Items that need stakeholder clarification before proceeding
- **Risk register stub**: Initial risk identification with likelihood/impact ratings
- **Success criteria**: Measurable, time-bound definitions of project success

## Workflow

1. Gather all available input about the project.
2. Identify what is missing from the standard brief template; ask targeted questions.
3. Draft the project brief section by section.
4. Define success criteria in measurable terms (avoid vague outcomes).
5. Identify initial risks and log them with preliminary likelihood/impact.
6. Surface open questions that need stakeholder resolution before work starts.
7. Present the draft brief for user review; iterate based on feedback.

**Stop conditions:**

- Do not proceed past the brief draft if critical inputs (goals, scope, stakeholders)
  are completely absent — ask for them first.
- Flag clearly if stated goals conflict with stated constraints.

## Edge Cases

- **Vague goals**: Ask "how will you know this project succeeded?" to force specificity.
- **Scope creep in the brief**: Flag when new items are being added mid-intake; offer to
  create a separate "Phase 2" section rather than expanding Phase 1 scope.
- **Multiple conflicting stakeholders**: Surface the conflict; note it as a P0 risk.
- **No defined success criteria**: Require at least one measurable success metric before
  finalizing the brief.
- **Very large project**: Recommend phasing; split into workstreams with separate briefs.

## Safety & Secrets

- Never log, commit, or store sensitive business information (financials, contracts,
  personnel data) beyond the immediate session.
- Do not include client credentials, internal system names, or confidential pricing in
  generated documents without user confirmation that sharing is appropriate.
- Warn if scope or deliverables suggest regulated data handling (HIPAA, PCI, GDPR);
  recommend legal/compliance review.

## Project Brief Template

```markdown
# Project Brief: [Project Name]

**Date:** [Date]
**Owner:** [Name/Team]
**Status:** Draft

## Goal

[One or two sentences: what we are building and why.]

## Scope

**In scope:**

- [Item 1]
- [Item 2]

**Out of scope:**

- [Item 1]

## Stakeholders

| Name | Role | Responsibility |
| ---- | ---- | -------------- |
|      |      |                |

## Deliverables

| Deliverable | Description | Due Date |
| ----------- | ----------- | -------- |
|             |             |          |

## Constraints

- Budget: [Amount or TBD]
- Timeline: [Key dates]
- Technical: [Stack requirements, must-use tools]
- Regulatory: [Any compliance requirements]

## Success Criteria

- [ ] [Measurable outcome 1 by date]
- [ ] [Measurable outcome 2 by date]

## Risks

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
|      |            |        |            |

## Open Questions

- [ ] [Question 1 — owner: Name]
- [ ] [Question 2 — owner: Name]
```

## Examples

### Example 1: Client onboarding brief

**User prompt:** "I just got off a call with a new client. They want a customer portal
where their customers can view invoices, download statements, and submit support tickets.
They want it done in 3 months. No budget defined yet."

**Expected output:**
Complete project brief with: goal (customer self-service portal), scope (invoice view,
statement download, ticket submission — out of scope: payment processing, live chat),
stakeholders table with client contact placeholders, 3-month milestone breakdown, risks
(no budget defined as P0 risk, timeline risk for 3 months if scope is large), success
criteria (X% of customers log in within 30d of launch), open questions (budget, auth
method, existing invoice system integration).

### Example 2: Internal tool brief from rough notes

**User prompt:** "I need to build an internal tool for our ops team to track vendor
contracts — expiry dates, renewal status, contact info. Right now it's in spreadsheets."

**Expected output:**
Brief with goal (replace vendor contract spreadsheet with structured tool), scope (CRUD
for contracts, expiry alerts, search/filter — out of scope: e-signature, procurement),
stakeholders (ops team as users, ops manager as owner), success criteria (all contracts
migrated, 0 spreadsheets in use by end of quarter, renewal alerts firing 30d before expiry),
constraints (internal use, no budget noted — ask), risks (data migration from spreadsheets,
adoption/change management).

## Testing / Evals

See `evals/evals.json` for test prompts. Run 2–3 prompts and compare outputs against
`expected_output` descriptions.

## References

- [Workflow Design Guide](../../references/workflow-design-guide.md)
- [Automation Best Practices](../../references/automation-best-practices.md)
- [Project Planning Skill](../project-planning-skill/SKILL.md)
- [Skill Registry](../skill-registry.md)

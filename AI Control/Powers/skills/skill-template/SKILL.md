# Skill Template

> **This is a canonical template for new skills. Copy this file into your skill directory, replace all `[PLACEHOLDER]` sections, remove this notice, and add proper YAML frontmatter.**

---

name: your-skill-name
description: |
[100–150 words: describe what the skill does, when to trigger it, common user phrasings
that should invoke it (e.g., "design an API", "review my code", "clean this data"), and
key exclusions — things that look similar but should NOT trigger this skill. Be explicit
about trigger phrases so the routing system matches reliably. Mention the primary output
format. Include at least 3–5 example phrasings a user might say.]

---

## Overview

[One paragraph describing what this skill does, who it serves, and the primary value it
delivers. Keep it concrete — avoid vague generalities. State the problem it solves and
the type of artifact it produces.]

## When to Use / When NOT to Use

**Use this skill when:**

- [Primary trigger condition with example phrasing]
- [Secondary trigger — varied user language, e.g., "user asks 'can you review this PR?'"]
- [Another trigger condition]

**Do NOT use this skill when:**

- [Exclusion 1 — prevents false triggers]
- [Exclusion 2 — scope boundary; name the better skill if one exists]
- [Exclusion 3]

## Inputs

- **[Input 1]**: Description, expected type/format, required or optional
- **[Input 2]**: Description
- **[Input 3]** _(optional)_: Description

## Outputs

- **[Output 1]**: What the skill produces — format, structure, file path if applicable
- **[Output 2]**: Secondary artifact or summary
- **[Output 3]** _(optional)_: Supplementary output

## Workflow

1. Read all provided inputs; confirm scope and intent with the user if ambiguous.
2. [Second step — imperative style]
3. [Third step]
4. Validate intermediate results; surface issues before proceeding to the next step.
5. [Final step — produce structured output, summarize decisions, list next steps]

**Stop conditions:**

- Stop and ask the user if required inputs are missing or contradictory.
- Stop and warn before any write, destructive, or irreversible operation.

## Edge Cases

- [Tricky situation 1 and how to handle it]
- [Conflicting or ambiguous inputs — clarify before proceeding]
- [Empty/null input — fail gracefully with a clear message]
- [Oversized input — paginate, truncate, or request a scoped subset]

## Safety & Secrets

- Never log, commit, print, or transmit secrets, tokens, API keys, or credentials.
- Warn the user before any write, delete, or destructive operation; require explicit confirmation.
- Do not embed sensitive values in generated files, examples, or documentation.
- [Add skill-specific safety rules here]

## Examples

### Example 1: [Short descriptive title]

**User prompt:** "[Realistic user request]"

**Expected output:**
[Description or abbreviated example of what a correct output looks like — structure, key
sections, quality bar]

### Example 2: [Different scenario or phrasing]

**User prompt:** "[Another realistic request]"

**Expected output:**
[Description or abbreviated example]

## Testing / Evals

See `evals/evals.json` for test prompts. Run 2–3 prompts and compare outputs against
`expected_output` descriptions.

**Manual eval steps:**

1. Copy a prompt from `evals/evals.json`.
2. Run it with this skill active.
3. Compare output to `expected_output` — check completeness, accuracy, format, and safety.

## References

- [Skills Spec](../../references/skills-spec.md)
- [Skill Creator](../skill-creator/SKILL.md) — use to create and iterate on new skills
- [Eval Runner](../eval-runner/SKILL.md)
- [Skill Registry](../skill-registry.md)

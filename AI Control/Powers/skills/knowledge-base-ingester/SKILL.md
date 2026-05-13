---
name: knowledge-base-ingester
description: |
  Converts raw notes, brain dumps, documents, and unstructured text into structured
  knowledge base entries suitable for Notion, Confluence, a wiki, or a personal PKM
  system. Use this skill whenever a user says "turn these notes into a KB article",
  "add this to our knowledge base", "structure these raw notes", "write a wiki page
  from this", "convert this into a how-to guide", "make this searchable", or
  "ingest this into our docs". Also activate when someone pastes a long unstructured
  document and wants it organized. Do NOT use for meeting notes (use
  meeting-notes-to-actions) or code documentation generation.
---

# Knowledge Base Ingester

Transform raw, unstructured content into clean, searchable, consistently formatted
knowledge base entries that teams can actually find and use.

## When to Use

- Converting a Subject Matter Expert's brain dump into a reference article
- Turning Slack thread discussions into permanent KB entries
- Structuring onboarding notes, runbooks, or how-to guides from raw text
- Migrating content from disparate sources into a unified KB

## When NOT to Use

- Meeting notes extraction (use `meeting-notes-to-actions`)
- Code documentation (use `documentation-generator`)
- Full documentation refactoring (use `docs-refactorer`)

---

## Workflow

### Step 1 — Receive and Clarify

Accept the raw content (any format: prose, bullets, transcript, email thread).

Ask:

1. **Target system:** Notion, Confluence, GitHub wiki, static site, or generic Markdown?
2. **Content type:** How-to guide / Reference / FAQ / Runbook / Glossary entry?
3. **Audience:** Internal team, new hires, customers, or public?
4. **Tags / categories:** If the KB has a taxonomy, what category does this belong to?

### Step 2 — Extract Core Knowledge

Read the input and identify:

| Element                      | What to capture                                |
| ---------------------------- | ---------------------------------------------- |
| **Key concept or procedure** | The main thing this entry teaches              |
| **Prerequisites**            | What the reader needs to know first            |
| **Steps or facts**           | The core content in logical order              |
| **Examples**                 | Concrete instances that illustrate the concept |
| **Edge cases / gotchas**     | Things that commonly trip people up            |
| **Related topics**           | Links to other KB entries to add               |

### Step 3 — Structure the Entry

Use this default template:

```markdown
# [Descriptive Title]

> **Summary:** One-sentence description of what this article covers.

**Last updated:** [Date] | **Author:** [Name] | **Category:** [Tag]

---

## Overview

[2–3 sentence context: what this is, when you'd need it, why it matters]

## Prerequisites

- [Prerequisite 1]
- [Prerequisite 2]

## [Main Content Section — How-To / Reference / Explanation]

### Step 1 — [Action]

[Explanation]

`code or example`

### Step 2 — [Action]

[Explanation]

## Common Issues & Gotchas

- **[Issue]:** [How to handle it]

## Related Articles

- [Link placeholder 1]
- [Link placeholder 2]
```

Adapt the template to the content type:

- **FAQ:** Q&A format with bold questions
- **Runbook:** numbered steps with verification checkpoints
- **Glossary:** term, definition, example usage, related terms

### Step 4 — Tag and Categorize

Suggest 3–5 tags based on content. Common categories:
`engineering`, `product`, `onboarding`, `security`, `operations`, `data`, `api`

### Step 5 — Review

Present the draft and ask:

- "Does this capture everything important from the original?"
- "Should I adjust the complexity level for your audience?"
- "Are there related KB articles I should reference?"

---

## Output Format

Default: Markdown suitable for any KB system.

For **Notion**: structure using heading blocks with callout boxes for warnings/tips.
For **Confluence**: use Confluence wiki markup hints where different from standard Markdown.

---

## Safety & Confirmation

- Never include credentials, API keys, passwords, or PII in the KB entry. Replace with `<PLACEHOLDER>`.
- Flag any content that appears sensitive and ask before publishing.
- Mark content that may be outdated with `> ⚠️ This section may be outdated — verify before relying on it.`

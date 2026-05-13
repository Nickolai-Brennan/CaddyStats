---
name: docs-refactorer
description: |
  Rewrites and restructures existing documentation to a consistent standard:
  clearer headings, consistent style, proper Markdown formatting, and logical flow.
  Use this skill whenever a user says "clean up this doc", "rewrite this README",
  "make this documentation consistent", "improve this guide", "refactor these docs",
  "fix the formatting in this Markdown file", or "standardize our documentation
  style". Also activate when someone pastes a messy or outdated doc and asks for it
  to be improved. Do NOT use for writing new documentation from scratch (use
  documentation-generator) or for editing code, only prose docs.
---

# Docs Refactorer

Restructure and rewrite existing documentation so it's clearer, more consistent,
and easier to maintain — without changing what the content actually means.

## When to Use

- A README, guide, or wiki page is messy, inconsistent, or hard to navigate
- Multiple contributors wrote different sections in different styles
- Docs were written for an older version and need cleanup without full rewrite
- You want to apply a house style guide to existing documentation

## When NOT to Use

- Creating new documentation from scratch (use `documentation-generator`)
- Editing code or code comments
- Translating docs to another language
- Making substantive changes to technical content you're not sure about

---

## Workflow

### Step 1 — Receive the Document

Accept the document as:

- Pasted Markdown text
- A file path (if file access is available)
- A description of the document with key sections

Ask: "What style should this follow? (We'll default to standard Markdown best practices if you don't specify.)"

### Step 2 — Audit the Document

Identify issues in these categories:

| Category       | Common issues                                                                         |
| -------------- | ------------------------------------------------------------------------------------- |
| **Structure**  | Missing headings, wrong heading hierarchy (##→####), no TOC for long docs             |
| **Style**      | Passive voice, inconsistent tone (formal vs. casual mixed), jargon without definition |
| **Formatting** | Inconsistent list styles, broken code blocks, raw URLs                                |
| **Content**    | Duplicate sections, orphaned content, outdated examples                               |
| **Length**     | Walls of text (need breaking up), redundant preamble                                  |

Output a brief audit before rewriting: "I found 3 structural issues, 2 style issues, and 1 outdated example. Shall I fix all of these?"

### Step 3 — Apply Fixes

Follow these rules during rewriting:

- **Preserve meaning:** Never change technical facts, only presentation.
- **Heading hierarchy:** H1 for title, H2 for major sections, H3 for subsections.
- **Active voice:** "Run the command" not "The command should be run."
- **Code blocks:** All code, commands, and file paths in backticks or fenced blocks.
- **Lists:** Use bullets for unordered items, numbers for sequential steps.
- **Links:** Format as `[text](url)`, not bare URLs.
- **Intro sentence:** Every major section should start with a one-sentence overview.

### Step 4 — Present Changes

Show the refactored document and a change summary:

```
Changes made:
✓ Restructured heading hierarchy (3 fixes)
✓ Converted passive voice to active (5 instances)
✓ Added code fences to 4 inline code examples
✓ Consolidated duplicate "Installation" section
✓ Removed outdated reference to v1 API
```

Ask: "Should I make any of these changes more or less aggressive?"

### Step 5 — Handle Style Guide

If a custom style guide is provided:

- Apply it systematically
- Flag any conflicts between the existing content and the guide
- Note any rules that couldn't be applied automatically

---

## Output Format

Two outputs:

1. **Refactored document** — the cleaned-up Markdown, ready to replace the original
2. **Change summary** — a bulleted list of what was changed and why

```markdown
---

## Change Summary

**Structural changes:** N
**Style changes:** N
**Formatting fixes:** N
**Content edits:** N

Details:

- [Change description]
```

---

## Safety & Confirmation

- Never delete content without flagging it first: "I'm removing this section because it appears outdated — confirm?"
- Never change technical claims (versions, commands, parameter names) unless clearly wrong.
- If a section is unclear and you're unsure what it means, mark it with `<!-- REVIEW: unclear, please verify -->` rather than guessing.
- Always show the original alongside the refactored version on request.

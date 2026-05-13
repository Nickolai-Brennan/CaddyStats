---
name: markdown-docs-skill
description: |
  Writes, structures, and improves Markdown documentation: READMEs, wikis, API docs,
  guides, tutorials, technical references, and changelogs. Use this skill when a user
  asks to write docs, create a README, document a project, improve existing documentation,
  write a guide or tutorial, create a wiki page, or structure technical reference material.
  Common phrasings: "write a README for this", "document this project", "improve my docs",
  "create a getting started guide", "write API documentation", "help me with my wiki",
  "turn this into a proper doc", "document this function/module", "write a changelog".
  Do NOT use when the user wants to write code (not docs), design a database or API
  (use dedicated skills), or create presentation slides — this skill produces Markdown
  text files only.
---

# Markdown Docs Skill

## Overview

The Markdown Docs Skill writes, structures, and improves Markdown documentation for
software projects. It produces READMEs, contributing guides, API references, tutorials,
how-to guides, changelogs, and wiki pages. It applies documentation best practices:
clear information hierarchy, appropriate heading levels, code blocks with language hints,
badge conventions, and navigation aids (tables of contents, cross-links).

## When to Use / When NOT to Use

**Use this skill when:**

- User needs a README created or significantly improved
- User wants a getting started guide, tutorial, or how-to document written
- User has inline comments or notes to convert into polished documentation
- User wants to add or improve API reference documentation in Markdown
- User asks to "document this" — project, module, function, workflow, etc.

**Do NOT use this skill when:**

- User wants a website or HTML documentation (requires static site tooling)
- User needs OpenAPI/Swagger spec documentation (use `api-design-skill`)
- The request is code writing, not documentation
- User needs presentation slides or PDF output

## Inputs

- **Subject**: What to document — project, function, API, workflow, concept
- **Existing content** _(optional)_: Existing README, code, or notes to improve/expand
- **Audience**: Developers, end users, contributors, etc. — affects depth and tone
- **Doc type**: README, tutorial, how-to, reference, changelog, contributing guide
- **Length/detail level** _(optional)_: Quick overview vs. comprehensive reference

## Outputs

- **Markdown document**: Well-structured, properly formatted `.md` file content
- **Table of contents** _(for longer docs)_: Anchor-linked headings
- **Code examples**: Syntax-highlighted fenced code blocks with language identifiers
- **Badges** _(for READMEs)_: CI status, license, version, coverage as appropriate

## Workflow

1. Identify doc type, subject, and audience from inputs.
2. Outline the document structure (headings and sections) before writing.
3. Write content section by section; use imperative tone for tutorials/how-tos.
4. Add code examples with language-tagged fenced blocks for all technical content.
5. Add a table of contents if the document exceeds ~3 major sections.
6. Review for clarity, completeness, and appropriate heading levels (h1 → h2 → h3).
7. Add navigation cross-links for multi-document sets.

**Stop conditions:**

- Stop and ask if the audience, doc type, or subject is unclear before writing.
- Do not include sensitive data (credentials, internal URLs) in documentation.

## Edge Cases

- **No existing content**: Ask for a description of what to document; don't invent facts.
- **Very large codebase to document**: Start with a high-level README; create a doc plan
  for the full suite.
- **Conflicting tone requirements**: Ask which style guide applies (Google, Microsoft, etc.).
- **Generated docs vs. handwritten**: If generating from code, clearly note auto-generated
  sections for human review.
- **Changelogs**: Follow Keep a Changelog format (keepachangelog.com) by default.

## Safety & Secrets

- Never include real API keys, tokens, passwords, or internal URLs in documentation.
- Use placeholder values: `YOUR_API_KEY`, `https://your-domain.com`, `<your-token>`.
- Flag if provided code examples contain credentials; replace before documenting.
- Warn before overwriting an existing documentation file; require confirmation.

## Examples

### Example 1: Project README

**User prompt:** "Write a README for my open-source Python CLI tool called `csvkit-plus`
that cleans and transforms CSV files."

**Expected output:**

```markdown
# csvkit-plus

> A Python CLI tool for cleaning and transforming CSV files.

[![PyPI](badge)] [![License: MIT](badge)] [![CI](badge)]

## Features

- ...

## Installation

\`\`\`bash
pip install csvkit-plus
\`\`\`

## Quick Start

...

## Usage

...

## Contributing

...

## License

...
```

Full README with badges, features list, installation, quick start, usage examples with
CLI flags, contributing section, and license.

### Example 2: Improving sparse docs

**User prompt:** "My README just says 'This is a web scraper. Run `python main.py`.'
Can you expand it?"

**Expected output:**
Expanded README with: project description, prerequisites, installation steps, configuration
(env vars with placeholders), usage examples with sample output, troubleshooting section,
contributing guidelines, license. Asks user for any details that can't be inferred
(what does it scrape? what are the outputs?).

## Testing / Evals

See `evals/evals.json` for test prompts. Run 2–3 prompts and compare outputs against
`expected_output` descriptions.

## References

- [Docs Rules](../../instructions/docs-rules.md)
- [Markdown Content Creation](../../instructions/markdown-content-creation.instructions.md)
- [Documentation Generator](../documentation-generator/SKILL.md)
- [Skill Registry](../skill-registry.md)

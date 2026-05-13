---
name: prompt-library-curator
description: |
  Organizes, tags, deduplicates, and improves a prompt library. Use this skill
  whenever a user says "organize my prompts", "tag these prompts", "clean up my
  prompt library", "find duplicate prompts", "sort my prompts by category",
  "write better versions of these prompts", "add metadata to my prompts", or
  "build a searchable prompt collection". Also activate when a user pastes a
  list of prompts and wants them structured or improved. Do NOT use for running
  prompts (that's a different operation) or for creating brand-new prompts from
  scratch without existing material to work with.
---

# Prompt Library Curator

Bring order to a growing collection of prompts: tag them, deduplicate, improve
quality, and produce a structured library that's easy to search and reuse.

## When to Use

- You have 10+ saved prompts and can't find the right one when you need it
- Your prompt collection has grown organically and needs structure
- You want to standardize prompts across a team
- You're migrating prompts from one tool to another and want to clean them up first

## When NOT to Use

- Executing prompts (running them against an AI model)
- Writing entirely new prompts from scratch with no existing library
- Evaluating AI output quality (use `eval-set-builder`)

---

## Workflow

### Step 1 — Receive the Library

Accept prompts in any format:

- A numbered list of prompts
- A JSON file with prompt objects
- A Notion/Airtable export
- Pasted text with prompts separated by `---`

Ask:

1. How many prompts are in the collection?
2. What's the main use case? (coding, writing, research, customer support, etc.)
3. Is there an existing tagging system or should I propose one?

### Step 2 — Audit the Collection

For each prompt, assess:

| Dimension        | What to check                                             |
| ---------------- | --------------------------------------------------------- |
| **Clarity**      | Is the prompt unambiguous? Does it specify output format? |
| **Specificity**  | Is it too vague or too narrow?                            |
| **Duplicate**    | Is there a near-identical prompt already in the library?  |
| **Quality**      | Does it follow good prompting practices?                  |
| **Completeness** | Does it include necessary context and constraints?        |

### Step 3 — Tag Each Prompt

Apply tags from these dimensions:

- **Category:** writing / coding / research / data / customer-support / marketing / operations / creative
- **Model affinity:** gpt-4 / claude / general (if known)
- **Output format:** json / markdown / bullet-list / prose / code / table
- **Use frequency:** daily / weekly / occasional (if known)
- **Status:** draft / reviewed / deprecated

### Step 4 — Deduplicate

Group near-duplicate prompts and:

1. Identify the strongest version
2. Show a side-by-side comparison of duplicates
3. Ask the user which to keep (or offer a merged version)

### Step 5 — Improve Quality

For each prompt below a quality threshold, suggest improvements:

- Add output format instructions: "Respond as a JSON array of objects with keys: X, Y, Z"
- Add role/persona: "You are an expert [domain]..."
- Specify length: "In 3 bullet points..." or "In under 200 words..."
- Add examples: "For example: [example]"

### Step 6 — Produce the Curated Library

Output a structured library in the user's preferred format:

```markdown
## Prompt Library — [Category / Name]

_Last curated: [Date] | Total prompts: N_

---

### [Category Name]

#### [Prompt Title]

**Tags:** `category:writing`, `output:prose`, `status:reviewed`
**Use when:** [trigger description]
**Prompt:**
```

[The prompt text]

```
**Notes:** [Any usage tips or model preferences]

---
```

---

## Output Format

Default: Structured Markdown suitable for Notion or a GitHub gist.

Optional outputs:

- **JSON array** with `id`, `title`, `tags`, `prompt`, `notes` fields
- **CSV** with the same columns for Airtable/Google Sheets

---

## Safety & Confirmation

- Never discard prompts without showing the user what's being removed and asking for confirmation.
- If a prompt appears to contain sensitive data (PII, internal credentials), flag it immediately.
- Preserve the user's original intent — improvements should refine, not replace the core purpose.

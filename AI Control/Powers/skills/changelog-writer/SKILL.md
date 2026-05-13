---
name: changelog-writer
description: |
  Writes structured, human-readable changelogs from commit histories, PR lists, or
  raw notes. Use this skill whenever a user says "write a changelog", "generate
  CHANGELOG.md", "summarize what changed in this release", "turn these commits into
  release notes", "write a changelog for v2.3", or "what changed since last version?"
  Also activate when someone pastes a list of commits or PRs and asks what to put in
  a changelog. Follows Keep a Changelog conventions by default. Do NOT use for writing
  new code, creating PR descriptions, or drafting marketing copy for releases.
---

# Changelog Writer

Transform raw commit logs, PR titles, and release notes into clean, structured
changelogs that developers and users can actually read.

## When to Use

- Preparing a release and need a CHANGELOG.md entry
- Backfilling changelog entries for past versions
- Cleaning up auto-generated git logs into readable prose
- Maintaining an ongoing changelog as part of a release workflow

## When NOT to Use

- Writing marketing copy or press releases (use `release-notes-generator` instead)
- Creating PR descriptions from code diffs
- Generating code documentation

---

## Workflow

### Step 1 — Gather Input

Ask the user for:

1. **Source material:** git log output, PR list, Jira/Linear tickets, or raw bullet notes
2. **Version number** and **release date** (or "unreleased")
3. **Audience:** Developer-facing (technical) or user-facing (plain language)?
4. **Convention:** Keep a Changelog (default), Angular commits, or custom format

If git log is provided, run: `git log --oneline --no-merges <from>..<to>`

### Step 2 — Categorize Changes

Sort each change into Keep a Changelog categories:

| Category       | What belongs here                                    |
| -------------- | ---------------------------------------------------- |
| **Added**      | New features, endpoints, config options              |
| **Changed**    | Modified behavior, interface changes, renamed things |
| **Deprecated** | Features scheduled for removal                       |
| **Removed**    | Deleted features, dropped support                    |
| **Fixed**      | Bug fixes                                            |
| **Security**   | Patches for vulnerabilities                          |

- Skip pure chore commits (formatting, typos, dependency bumps with no user impact) unless the user wants them.
- Group related commits into a single entry where possible.
- Write entries in past tense: "Added dark mode toggle" not "Add dark mode toggle".

### Step 3 — Write the Changelog Entry

Format per [Keep a Changelog](https://keepachangelog.com) convention:

```markdown
## [2.3.0] — 2024-11-15

### Added

- Dark mode toggle in user settings (#102)
- Export to CSV for all dashboard tables (#98)

### Fixed

- File uploads over 10 MB no longer crash the app (#101)
- Payment webhooks now fire correctly in staging environments (#104)

### Security

- Closed unauthenticated endpoint that exposed user email addresses
```

### Step 4 — Review & Refine

Present the draft and ask:

- "Does this cover everything? Anything to add or remove?"
- "Should I include dependency version bumps?"
- "Do you want a separate user-facing summary?"

---

## Output Format

Default output is a Markdown block ready to prepend to `CHANGELOG.md`.

For multi-version backfill, output each version as a separate `## [x.y.z]` section,
newest first.

### Template

```markdown
## [VERSION] — YYYY-MM-DD

### Added

- <description> (#PR_or_issue_number)

### Changed

- <description>

### Fixed

- <description>

### Security

- <description>
```

---

## Safety & Confirmation

- Never commit or push a changelog automatically. Output the Markdown for the user to review first.
- If source material is ambiguous (e.g., "fix stuff"), ask for clarification before guessing.
- For Security entries, ask the user to confirm wording — security disclosures require care.

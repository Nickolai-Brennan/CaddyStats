# Skills

This directory contains reusable skill modules for AI agents.

## Structure

- **skill-registry.md**: Registry of all implemented skills (directories + packaged)
- **SKILLS.md**: Conceptual skill taxonomy (capability categories, not an implementation registry)
- **skill-template/**: Template for creating new skills
- Individual skill directories (each contains a `SKILL.md` and optional `evals/`, `references/`, `scripts/`, `templates/`)

## Using Skills

Skills are modular, reusable capabilities that can be shared across agents. To use a skill:

1. Find the skill in `skill-registry.md`
2. Reference the skill's `SKILL.md` for usage instructions, inputs, and outputs
3. Invoke the skill from an agent or workflow by name

## Packaged Skills

Some skills are distributed as `.zip` files (third-party or externally sourced):

| Package                            | Version |
| ---------------------------------- | ------- |
| `auto-updater-1.0.0.zip`           | 1.0.0   |
| `blogwatcher-1.0.0.zip`            | 1.0.0   |
| `clawdbot-filesystem-1.0.2.zip`    | 1.0.2   |
| `firecrawl-search-1.0.0.zip`       | 1.0.0   |
| `frontend-design-3-0.1.0.zip`      | 0.1.0   |
| `market-research-1.0.1.zip`        | 1.0.1   |
| `proactive-agent-skill-1.0.0.zip`  | 1.0.0   |
| `skillscan-1.1.6.zip`              | 1.1.6   |
| `social-media-scheduler-1.0.0.zip` | 1.0.0   |
| `sql-toolkit-1.0.0.zip`            | 1.0.0   |
| `web-search-plus-3.0.1.zip`        | 3.0.1   |

To install a packaged skill, use the [`universal-skills-manager`](./universal-skills-manager/SKILL.md) skill or extract the zip manually and follow the `SKILL.md` inside.

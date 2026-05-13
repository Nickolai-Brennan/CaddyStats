# Commands

This directory contains slash command and CLI command definitions for the AI automation framework.

## Purpose

Commands provide shorthand triggers that invoke agents, run workflows, or execute scripts. They can be used from the Copilot chat interface (slash commands) or from the terminal (CLI commands).

## Planned Command Types

| Type              | Description                                               |
| ----------------- | --------------------------------------------------------- |
| Slash commands    | `/init-project`, `/create-agent`, `/run-workflow`, etc.   |
| CLI commands      | `generate_agent.py`, `generate_skill.py` (see `scripts/`) |
| Agent commands    | Direct agent invocations with pre-set context             |
| Workflow commands | Single-line triggers for numbered workflows               |

## Related

- [`scripts/`](../scripts/) — Executable Python generation and validation scripts
- [`workflows/workflow-registry.md`](../workflows/workflow-registry.md) — Registered workflows
- [`agents/agent-registry.md`](../agents/agent-registry.md) — Registered agents

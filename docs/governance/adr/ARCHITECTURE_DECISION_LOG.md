# Architecture Decision Log

## Purpose

Track the accepted architectural decisions that currently govern Caddy Stats and point readers to the canonical ADR source files.

## Canonical ADR source

Accepted ADR files live under `docs/governance/adr/records/`.

Use this log when you need a quick index. Use the individual ADR files when you need full context, trade-offs, and implementation notes.

## Current accepted ADR set

| ADR     | Title                                            | Status   | Primary concern governed                            | Source file                                                         |
| ------- | ------------------------------------------------ | -------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| ADR-001 | Monorepo Architecture                            | Accepted | repository layout and architectural control model   | `docs/governance/adr/records/ADR-001-monorepo-architecture.md`      |
| ADR-002 | GraphQL Gateway Scope and Boundaries             | Accepted | GraphQL usage limits and API boundary rules         | `docs/governance/adr/records/ADR-002-graphql-gateway.md`            |
| ADR-003 | PostgreSQL Schema Strategy                       | Accepted | schema boundaries and data ownership                | `docs/governance/adr/records/ADR-003-postgres-schema-strategy.md`   |
| ADR-004 | Materialized View Engine for High-Read Analytics | Accepted | read-optimized analytics and refresh posture        | `docs/governance/adr/records/ADR-004-materialized-view-engine.md`   |
| ADR-005 | Worker Orchestration for Asynchronous Workloads  | Accepted | async job model and queue responsibilities          | `docs/governance/adr/records/ADR-005-worker-orchestration.md`       |
| ADR-006 | AI Grounding Layer and Safety Controls           | Accepted | grounded AI, review gates, and safety constraints   | `docs/governance/adr/records/ADR-006-ai-grounding-layer.md`         |
| ADR-007 | Observability Standard                           | Accepted | logs, metrics, traces, and operational visibility   | `docs/governance/adr/records/ADR-007-observability-standard.md`     |
| ADR-008 | Edge Cache Strategy for Public Read Paths        | Accepted | cache behavior and public-read performance posture  | `docs/governance/adr/records/ADR-008-edge-cache-strategy.md`        |
| ADR-009 | Search Index Strategy for Content and Entities   | Accepted | indexing scope, ownership, and sync expectations    | `docs/governance/adr/records/ADR-009-search-index-strategy.md`      |
| ADR-010 | Editorial Rendering Engine                       | Accepted | structured content rendering and sanitization rules | `docs/governance/adr/records/ADR-010-editorial-rendering-engine.md` |

## Operating rule

Use this log together with:

- `docs/governance/adr/README.md`
- `docs/governance/adr/ADR_PROCESS.md`
- `docs/governance/adr/ADR_TEMPLATE.md`

Update all four references when a new accepted ADR is added or an existing one is superseded.

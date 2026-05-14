# Architecture Decision Log

## Purpose

Track the current set of accepted architectural decisions and the canonical process for adding new ones.

## Existing ADR set

| ADR | Title | Status | Notes |
| --- | ----- | ------ | ----- |
| ADR-001 | Monorepo Architecture | Accepted | Defines the current monorepo posture. |
| ADR-002 | GraphQL Gateway Scope and Boundaries | Accepted | Limits GraphQL to selective use cases. |
| ADR-003 | PostgreSQL Schema Strategy | Accepted | Establishes schema separation rules. |
| ADR-004 | Materialized View Engine for High-Read Analytics | Accepted | Governs read-optimized analytics surfaces. |
| ADR-005 | Worker Orchestration for Asynchronous Workloads | Accepted | Defines the async workload model. |
| ADR-006 | AI Grounding Layer and Safety Controls | Accepted | Sets AI audit and grounding expectations. |
| ADR-007 | Observability Standard | Accepted | Establishes logs, metrics, and tracing posture. |
| ADR-008 | Edge Cache Strategy for Public Read Paths | Accepted | Defines cache behavior for public reads. |
| ADR-009 | Search Index Strategy for Content and Entities | Accepted | Governs search indexing behavior. |
| ADR-010 | Editorial Rendering Engine | Accepted | Defines structured editorial rendering and sanitization. |

## Source directory

The current ADR source files live under `Support/docs/architectural-decision-records/` and should be treated as the historical record until they are migrated.

## Operating rule

Use this log together with `docs/governance/adr/ADR_PROCESS.md` and `docs/governance/adr/ADR_TEMPLATE.md` whenever a new architectural change requires durable documentation.

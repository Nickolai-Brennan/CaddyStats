# Architectural Decision Records

## Purpose

Define how Caddy Stats stores, reviews, and maintains architectural decision records.

## Directory layout

- `docs/governance/adr/ADR_TEMPLATE.md` — required ADR template
- `docs/governance/adr/ADR_PROCESS.md` — workflow and approval rules
- `docs/governance/adr/ARCHITECTURE_DECISION_LOG.md` — current accepted-decision index
- `docs/governance/adr/records/` — accepted ADR source files

## ADR format

Every ADR must use this template:

```md
# ADR-###: Short Descriptive Title

Date: YYYY-MM-DD
Status: Draft | Proposed | Accepted | Deprecated | Superseded by ADR-###
Owners: Domain Owner(s)

## Context

What is the background situation, constraint, or problem that requires a decision?

## Decision

What was decided? State the decision clearly.

## Consequences

### Positive

What improves as a result of this decision?

### Negative

What are the trade-offs or added complexity?

### Mitigations

How are the negatives addressed or bounded?

## Alternatives Considered

What other options were evaluated and why were they not chosen?

## Implementation Notes

Where does this land in the codebase? What are the key integration points?
```

## Numbering convention

- ADRs are numbered sequentially: `ADR-001`, `ADR-002`, `ADR-003`, ...
- numbers are never reused, even if an ADR is deprecated or superseded
- the next available number is always one higher than the highest existing ADR number
- file name format: `ADR-###-short-topic-name.md`

## Status lifecycle

| Status         | Meaning                                                |
| -------------- | ------------------------------------------------------ |
| **Draft**      | In progress; not yet ready for review                  |
| **Proposed**   | Ready for team review and feedback                     |
| **Accepted**   | Reviewed and adopted as the governing decision         |
| **Deprecated** | No longer applicable; no replacement required          |
| **Superseded** | Replaced by a later ADR (reference the new ADR number) |

Accepted ADRs remain historical records. If a decision changes, create a new ADR that supersedes the prior one.

## Review process

1. create the new ADR from `docs/governance/adr/ADR_TEMPLATE.md`
2. store it under `docs/governance/adr/records/` once it is ready for repository review
3. request review from the listed owners and affected domain reviewers
4. update status to `Accepted` only after approval
5. update `docs/governance/adr/ARCHITECTURE_DECISION_LOG.md` and `docs/changelog.md` in the same change
6. update `docs/governance/ENGINEERING_STANDARDS_AND_GOVERNANCE.md` if the ADR changes a governance-level rule

## Mandatory triggers

Write an ADR when a change materially affects:

- service boundaries
- platform-wide technology choices
- database strategy or schema ownership
- API scope or versioning policy
- caching, observability, or deployment topology
- AI grounding or safety controls
- rendering and search/indexing strategy
- worker orchestration model
- security architecture
- monetization or entitlement architecture

If uncertain, default to writing the ADR.

## ADR index

| Number                                                     | Title                                                         | Status   | Date       | Owners                                      |
| ---------------------------------------------------------- | ------------------------------------------------------------- | -------- | ---------- | ------------------------------------------- |
| [ADR-001](./records/ADR-001-monorepo-architecture.md)      | Monorepo Architecture                                         | Accepted | 2026-05-12 | System Architect, Platform Engineering      |
| [ADR-002](./records/ADR-002-graphql-gateway.md)            | GraphQL Gateway Scope and Boundaries                          | Accepted | 2026-05-12 | API Engineering, Backend Engineering        |
| [ADR-003](./records/ADR-003-postgres-schema-strategy.md)   | PostgreSQL Schema Strategy (content + stats)                  | Accepted | 2026-05-12 | Database Engineering, Backend Engineering   |
| [ADR-004](./records/ADR-004-materialized-view-engine.md)   | Materialized View Engine for High-Read Analytics              | Accepted | 2026-05-12 | Database Engineering, Analytics Engineering |
| [ADR-005](./records/ADR-005-worker-orchestration.md)       | Worker Orchestration for Asynchronous Workloads               | Accepted | 2026-05-12 | Backend Engineering, Platform Engineering   |
| [ADR-006](./records/ADR-006-ai-grounding-layer.md)         | AI Grounding Layer and Safety Controls                        | Accepted | 2026-05-12 | AI Engineering, Editorial Platform          |
| [ADR-007](./records/ADR-007-observability-standard.md)     | Observability Standard (Logs, Metrics, Traces)                | Accepted | 2026-05-12 | Platform Engineering, SRE                   |
| [ADR-008](./records/ADR-008-edge-cache-strategy.md)        | Edge Cache Strategy for Public Read Paths                     | Accepted | 2026-05-12 | Frontend Engineering, Platform Engineering  |
| [ADR-009](./records/ADR-009-search-index-strategy.md)      | Search Index Strategy for Content and Entities                | Accepted | 2026-05-12 | Search Engineering, Backend Engineering     |
| [ADR-010](./records/ADR-010-editorial-rendering-engine.md) | Editorial Rendering Engine (Structured Blocks + Sanitization) | Accepted | 2026-05-12 | Frontend Engineering, Editorial Platform    |

## Related documents

- `docs/governance/ENGINEERING_STANDARDS_AND_GOVERNANCE.md`
- `docs/changelog.md`
- `docs/architecture/system-blueprint.md`
- `docs/architecture/system-overview.md`

# Architectural Decision Records

This directory contains the Architectural Decision Records (ADRs) for Caddy Stats.

An ADR is a short document that captures a significant architectural decision: the context in which it was made, the decision itself, and the resulting consequences. ADRs are immutable once accepted. They are never edited to reverse a decision; instead, a new ADR supersedes the old one.

---

## ADR Format

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

---

## Numbering Convention

- ADRs are numbered sequentially: `ADR-001`, `ADR-002`, `ADR-003`, ...
- Numbers are never reused, even if an ADR is deprecated or superseded.
- The next available number is always one higher than the highest existing ADR number.
- File name format: `ADR-###-short-topic-name.md`
  - Use `kebab-case` for the topic slug.
  - Example: `ADR-011-release-pipeline-topology.md`

---

## Status Lifecycle

| Status | Meaning |
|---|---|
| **Draft** | In progress; not yet ready for review |
| **Proposed** | Ready for team review and feedback |
| **Accepted** | Reviewed and adopted as the governing decision |
| **Deprecated** | No longer applicable; no replacement required |
| **Superseded** | Replaced by a later ADR (reference the new ADR number) |

Once an ADR is **Accepted**, its content must not be retroactively edited to change the original decision. Write a new ADR if the decision changes.

---

## Review Process

1. **Author opens a PR** with the new ADR file at `Proposed` status.
2. **Owners listed in the ADR** and relevant domain reviewers are required approvers.
3. **Engineering governance reviewers** (system architect, affected domain leads) review for correctness and completeness.
4. If there are no blocking objections after review, the ADR status is updated to `Accepted` and the PR is merged.
5. If the decision is rejected, the ADR is either revised or closed. A rejected ADR is not committed.
6. On merge:
   - Update this README's index table below.
   - Add a `changelog.md` entry under `Support/docs/changelog.md`.
   - Update `Support/docs/00-root/engineering-standards-and-governance.md` if the ADR changes a governance-level rule.

---

## Mandatory Triggers

An ADR **must** be written when a change introduces or materially revises any of the following:

| Trigger Category | Examples |
|---|---|
| Service boundaries | adding a new service, splitting or merging existing services |
| Architectural patterns | adopting a new framework, design pattern, or request model |
| Platform-wide technology choices | language runtime, database engine, message queue, cache layer |
| Database strategy | schema organization, ORM, migration tooling, access patterns |
| API strategy | REST vs. GraphQL scope, versioning policy, gateway changes |
| Caching strategy | edge cache policy, TTL strategy, invalidation model |
| Observability standards | logging format, metric taxonomy, tracing adoption |
| AI grounding or safety controls | prompt engineering rules, review gates, output policy |
| Rendering model | SSR, CSR, static generation, or hybrid changes |
| Search and indexing strategy | search engine choice, index schema, sync model |
| Worker orchestration model | queue technology, retry policy, domain queue segmentation |
| Production deployment topology | hosting provider, deployment method, environment structure |
| Security architecture | auth model, RBAC structure, token strategy |
| Monetization infrastructure | subscription billing integration, entitlement model |

If uncertain whether a decision warrants an ADR, default to writing one. A short ADR is always preferable to an undocumented decision.

---

## ADR Index

| Number | Title | Status | Date | Owners |
|---|---|---|---|---|
| [ADR-001](./ADR-001-monorepo-architecture.md) | Monorepo Architecture | Accepted | 2026-05-12 | System Architect, Platform Engineering |
| [ADR-002](./ADR-002-graphql-gateway.md) | GraphQL Gateway Scope and Boundaries | Accepted | 2026-05-12 | API Engineering, Backend Engineering |
| [ADR-003](./ADR-003-postgres-schema-strategy.md) | PostgreSQL Schema Strategy (content + stats) | Accepted | 2026-05-12 | Database Engineering, Backend Engineering |
| [ADR-004](./ADR-004-materialized-view-engine.md) | Materialized View Engine for High-Read Analytics | Accepted | 2026-05-12 | Database Engineering, Analytics Engineering |
| [ADR-005](./ADR-005-worker-orchestration.md) | Worker Orchestration for Asynchronous Workloads | Accepted | 2026-05-12 | Backend Engineering, Platform Engineering |
| [ADR-006](./ADR-006-ai-grounding-layer.md) | AI Grounding Layer and Safety Controls | Accepted | 2026-05-12 | AI Engineering, Editorial Platform |
| [ADR-007](./ADR-007-observability-standard.md) | Observability Standard (Logs, Metrics, Traces) | Accepted | 2026-05-12 | Platform Engineering, SRE |
| [ADR-008](./ADR-008-edge-cache-strategy.md) | Edge Cache Strategy for Public Read Paths | Accepted | 2026-05-12 | Frontend Engineering, Platform Engineering |
| [ADR-009](./ADR-009-search-index-strategy.md) | Search Index Strategy for Content and Entities | Accepted | 2026-05-12 | Search Engineering, Backend Engineering |
| [ADR-010](./ADR-010-editorial-rendering-engine.md) | Editorial Rendering Engine (Structured Blocks + Sanitization) | Accepted | 2026-05-12 | Frontend Engineering, Editorial Platform |

---

## Related Documents

- `Support/docs/00-root/engineering-standards-and-governance.md` — section 4.4 defines the ADR trigger policy
- `Support/docs/changelog.md` — every merged ADR must add a changelog entry
- `docs/architecture/system-blueprint.md` — system-wide architecture reference that ADRs collectively inform
- `docs/architecture/system-overview.md` — high-level platform summary

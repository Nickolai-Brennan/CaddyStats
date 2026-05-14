# ADR Process

## Purpose

Define when and how Caddy Stats records architectural decisions.

## When an ADR is required

Write an ADR when a change materially affects:

- service boundaries
- platform-wide technology choices
- database strategy or schema ownership
- API scope or versioning policy
- caching, observability, or deployment topology
- AI grounding or safety controls
- rendering and search/indexing strategy
- billing or entitlement architecture

## Workflow

1. Create a new ADR using `docs/governance/adr/ADR_TEMPLATE.md`.
2. Assign the next sequential ADR number.
3. Open the ADR in `Proposed` status for review.
4. Secure review from the affected domain owners and architecture/governance reviewers.
5. Mark it `Accepted` only when the decision is approved.
6. Update `docs/governance/adr/ARCHITECTURE_DECISION_LOG.md` and `docs/changelog.md` when merged.

## Lifecycle rules

- accepted ADRs are historical records and should not be rewritten to hide the original decision
- if a decision changes, create a superseding ADR
- rejected ideas do not need to remain as accepted records

## Review standard

An ADR should be short but complete enough that a later contributor can understand the context, the chosen direction, and the trade-offs without reconstructing them from code history.

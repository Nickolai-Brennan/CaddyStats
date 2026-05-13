# ADR-001: Monorepo Architecture

Date: 2026-05-12
Status: Accepted
Owners: System Architect, Platform Engineering

## Context

Caddy Stats is a full-stack platform that combines frontend, backend, database migrations, API contracts, AI workflows, and documentation. The system must evolve quickly while preserving architectural consistency and enforcing a strict build order.

The project also includes non-runtime assets such as agents, skills, prompts, and workflows that directly influence development and operational quality. Splitting these into multiple repositories would increase coordination overhead and create drift between application code and AI orchestration assets.

## Decision

Adopt a single monorepo as the source of truth for:

- Product application code (frontend, backend, database, API)
- Testing and automation
- Documentation and architecture records
- AI control layer assets (agents, skills, instructions, prompts, workflows)

Canonical root structure:

- .github/
- agents/
- skills/
- instructions/
- workflows/
- prompts/
- templates/
- evals/
- plugins/
- commands/
- frontend/
- backend/
- database/
- api/
- tests/
- scripts/
- docs/
- config/

Ownership and boundaries are enforced by folder-domain responsibility rather than repository separation.

## Consequences

### Positive

- Single change can update code, migrations, tests, and docs atomically.
- Architectural standards are easier to enforce consistently.
- CI pipelines can validate cross-layer dependencies in one run.
- Faster onboarding because all system artifacts live together.

### Negative

- Repository can grow large over time.
- CI execution cost may increase without targeted caching and path-based jobs.

### Mitigations

- Use path-filtered CI jobs and incremental validation.
- Maintain strict folder ownership and review rules.
- Keep build/test scripts deterministic and scoped.

## Alternatives Considered

1. Multi-repo split by layer:
   Rejected due to synchronization overhead and higher contract drift risk.

2. Hybrid repo model (runtime code in one repo, AI/docs in another):
   Rejected because AI/documentation artifacts are first-class architecture controls.

## Implementation Notes

- Enforce pull request checks for architecture/documentation updates when core decisions change.
- Keep ADRs under Support/docs/architectural-decision-records and reference them from architecture docs.

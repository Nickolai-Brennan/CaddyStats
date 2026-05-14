# Versioning Strategy

## Purpose

Define how Caddy Stats versions code, contracts, documentation, and architectural decisions.

## Release classes

### Patch

Used for low-risk fixes, maintenance, documentation-only updates, and non-breaking internal improvements.

### Minor

Used for backward-compatible capability additions or meaningful behavior expansion.

### Major

Used for breaking changes to APIs, schemas, workflows, security expectations, or operating models.

## API versioning

- REST should use explicit versioning when a breaking change cannot be delivered additively
- GraphQL should evolve additively where possible; breaking changes require review, migration planning, and communication
- internal service contracts may evolve with coordinated deployment but should still be documented when risk is material

## Database versioning

- all schema evolution occurs through migrations
- high-risk changes should use expand-contract patterns where practical
- migration risk, rollback posture, and data backfill expectations should be documented

## Documentation versioning

- canonical docs in `docs/` are living documents, not release snapshots by default
- ADRs are immutable historical records once accepted
- major shifts in policy or structure should be reflected in `docs/changelog.md`

## Model and AI versioning

- model runs must retain model version, input window, and execution metadata
- prompt or workflow revisions for AI-assisted features should be traceable through docs and runtime logging

## When to cut a new major boundary

Treat a change as major when it breaks one or more of these:

- public API compatibility
- subscription or entitlement behavior
- schema assumptions used by multiple domains
- deployment or environment promotion expectations
- architectural ownership boundaries already captured in ADRs

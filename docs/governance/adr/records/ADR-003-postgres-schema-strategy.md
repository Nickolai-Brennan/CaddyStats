# ADR-003: PostgreSQL Schema Strategy (content + stats)

Date: 2026-05-12
Status: Accepted
Owners: Database Engineering, Backend Engineering

## Context

The platform combines two distinct data domains:

- Editorial/content workflows
- Golf statistics, projections, events, and markets

Without strict separation, schema growth risks coupling content models to analytics models, causing migration complexity and degraded query performance.

## Decision

Use PostgreSQL as the single source of truth with two primary schemas:

- content schema for editorial/CMS entities, templates, publishing metadata, and block structures.
- stats schema for golfers, tournaments, courses, rounds, markets, projections, and model outputs.

Design rules:

- Prefer normalized relational design for stable entities.
- Use JSONB only for flexible block/template payloads and evolving metrics where appropriate.
- Enforce explicit foreign key boundaries and ownership.
- Version projection/model tables to preserve auditability.
- Use migrations (Alembic) for every schema change.

## Consequences

### Positive

- Clear ownership boundaries and reduced cross-domain drift.
- Better query planning and index strategies per domain.
- Cleaner API and repository-layer mapping.

### Negative

- Cross-schema joins require careful indexing and query design.
- More up-front schema design discipline required.

### Mitigations

- Add indexes for high-read join paths and filter columns.
- Use materialized views for expensive analytical joins.
- Review migrations in CI for backward compatibility.

## Alternatives Considered

1. Single default public schema:
   Rejected due to weak domain boundaries and scaling risks.

2. Separate databases for content and stats:
   Rejected for MVP due to operational complexity and consistency overhead.

## Implementation Notes

- Repository layer maps each aggregate root to schema-qualified tables.
- API contracts must avoid leaking database schema internals to frontend clients.

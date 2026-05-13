# ADR-009: Search Index Strategy for Content and Entities

Date: 2026-05-12
Status: Accepted
Owners: Search Engineering, Backend Engineering

## Context

Users need fast discovery across tournaments, players, courses, and editorial content. Database-only LIKE/ILIKE search does not scale well for relevance and typo tolerance across mixed entity types.

## Decision

Adopt a dedicated search indexing strategy with separate index documents for:

- players
- tournaments
- courses
- editorial articles

Index pipeline rules:

- Source-of-truth remains PostgreSQL.
- Changes are propagated through asynchronous indexing jobs.
- Documents include normalized fields for filters, ranking, and faceting.
- Keep schema versioning for index documents.

Search behavior requirements:

- Prefix and fuzzy matching for user-friendly lookup.
- Weighted ranking by entity type and freshness where relevant.
- Filter facets for market/context-driven discovery.

## Consequences

### Positive

- Faster and more relevant discovery experiences.
- Better support for autocomplete and mixed-entity queries.
- Reduces expensive ad hoc database search queries.

### Negative

- Eventual consistency between database updates and search index.
- Added operational surface for index lifecycle management.

### Mitigations

- Track index lag metrics and retry failed index jobs.
- Provide reindex tooling for backfills and schema migrations.
- Add fallback behavior for degraded index states.

## Alternatives Considered

1. PostgreSQL-only full text for all search:
Partially viable but rejected for richer multi-entity relevance needs.

2. Client-side filtering only:
Rejected due to scalability and relevance limitations.

## Implementation Notes

- Store index job handlers in worker orchestration layer.
- Include publish-state filters so unpublished content is never discoverable publicly.


# ADR-002: GraphQL Gateway Scope and Boundaries

Date: 2026-05-12
Status: Accepted
Owners: API Engineering, Backend Engineering

## Context

Caddy Stats serves both public experiences and internal/admin workflows. Some read-heavy, nested content views benefit from GraphQL flexibility, while operational and security-sensitive workflows require explicit REST contracts.

Unbounded GraphQL usage can lead to complexity, hidden performance costs, and unclear authorization behavior.

## Decision

Adopt a dual API model with explicit boundaries:

- REST for stats endpoints, auth, admin actions, health, and webhooks.
- Strawberry GraphQL for editorial composition and nested content/data retrieval where query flexibility has clear value.

GraphQL is not used as a universal transport layer.

Gateway rules:

- Disable GraphQL playground in production.
- Require explicit auth checks at resolver boundaries.
- Apply query complexity/depth limits.
- Log operation names and latency for observability.
- Avoid business logic in resolvers; resolvers call service layer methods.

## Consequences

### Positive

- Maintains API clarity and predictable security posture.
- Supports flexible admin/editor dashboards without endpoint explosion.
- Limits GraphQL abuse by using scoped use cases.

### Negative

- Requires teams to manage two API paradigms.
- Shared contracts must be documented carefully to prevent duplication.

### Mitigations

- Publish API ownership guidelines and endpoint/resolver catalogs.
- Keep domain logic centralized in services and repositories.
- Add contract tests for both REST and GraphQL paths.

## Alternatives Considered

1. REST-only:
Rejected because nested editorial/dashboard composition becomes cumbersome.

2. GraphQL-only:
Rejected due to operational endpoint clarity and security concerns.

## Implementation Notes

- Backend folder mapping: backend/app/routes for REST, backend/app/graphql for GraphQL.
- Authorization must remain explicit and role-based in both models.


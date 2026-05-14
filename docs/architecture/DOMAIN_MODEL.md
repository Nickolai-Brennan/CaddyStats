# Domain Model

## Purpose

Provide the executive domain map for Caddy Stats so readers can understand the major bounded contexts before moving into entity-level detail.

## Why this document exists

The platform needs a concise bounded-context view and a deeper entity reference. This file defines the high-level domain ownership model, while `docs/architecture/domain-model.md` expands the entities, relationships, and attribute expectations.

## Core bounded contexts

### 1. Stats and competition context

Owns the canonical sports entities that power research, projections, market comparison, and player or tournament pages.

Core entities:

- `Player`
- `Tournament`
- `Course`
- `TournamentEntry`
- `Round`
- `Projection`
- `Market`
- `MarketSelection`
- `ModelRun`
- `ModelMetric`

### 2. Content and publishing context

Owns editorial assets, structured page composition, publishing state, SEO metadata, and reusable templates.

Core entities:

- `Article`
- `ArticleVersion`
- `ArticleBlock`
- `Template`
- `Tag`
- `Author`

### 3. Identity and access context

Owns authenticated accounts, roles, permissions, and the authorization state behind protected experiences.

Core entities:

- `User`
- `Role`
- `Permission`
- `RoleAssignment`

### 4. Subscription and monetization context

Owns billing-linked access control, plan state, and the entitlement rules behind premium features.

Core entities:

- `Subscription`
- `Entitlement`
- `BillingEvent`
- `InvoiceRecord`

### 5. Audit, governance, and AI context

Owns the accountability layer for privileged actions, AI-assisted workflows, provider sync state, and incident visibility.

Core entities:

- `AuditEvent`
- `AIOutputLog`
- `EditorialReviewAction`
- `ProviderSyncBatch`
- `IncidentRecord`

## Modeling rules

- canonical data belongs in PostgreSQL
- stable entities should remain normalized rather than hidden in flexible payloads
- derived outputs must reference the source records, model runs, or calculation metadata behind them
- cross-context read joins are acceptable when ownership remains explicit
- public and premium experiences should consume the same trusted source model with different entitlement and rendering rules

## Related references

- `docs/architecture/domain-model.md`
- `docs/architecture/SERVICE_BOUNDARIES.md`
- `docs/data/stat-grounding-policy.md`
- `docs/governance/adr/records/ADR-003-postgres-schema-strategy.md`

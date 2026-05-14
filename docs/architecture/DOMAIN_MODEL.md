# Domain Model

## Purpose

This document summarizes the primary bounded contexts that shape Caddy Stats.

## Stats and competition context

Owns the canonical sports entities that power research and projections.

### Core entities
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

## Content and publishing context

Owns editorial objects and publication state.

### Core entities
- `Article`
- `ArticleVersion`
- `ArticleBlock`
- `Template`
- `Tag`
- `Author`

## Identity and access context

Owns authentication and permission state.

### Core entities
- `User`
- `Role`
- `Permission`
- `RoleAssignment`

## Subscription and monetization context

Owns billing-linked access control.

### Core entities
- `Subscription`
- `Entitlement`
- `BillingEvent`
- `InvoiceRecord`

## Audit and governance context

Owns the accountability layer for privileged or automated actions.

### Core entities
- `AuditEvent`
- `AIOutputLog`
- `EditorialReviewAction`
- `ProviderSyncBatch`
- `IncidentRecord`

## Modeling rules

- canonical data belongs in PostgreSQL
- stable entities should remain normalized
- derived outputs must reference the source records or model runs behind them
- cross-context joins are acceptable for read paths, but write ownership must remain explicit
- premium and public experiences consume the same trusted source model with different entitlements and rendering rules

## Detailed reference

Use `docs/architecture/domain-model.md` for the more detailed entity-level description and relationship notes.

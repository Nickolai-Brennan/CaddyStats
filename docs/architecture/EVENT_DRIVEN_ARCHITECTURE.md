# Event-Driven Architecture

## Purpose

Caddy Stats uses event-driven workflows to decouple ingestion, projections, publishing, billing, and operational reactions from synchronous user requests.

## Why events matter here

The platform has several domains where downstream actions should not block the user path:

- provider ingestion and normalization
- projection recalculation and derived read-model refreshes
- content publication and cache invalidation
- billing and entitlement synchronization
- audit logging and reliability automation

## Event categories

### Domain events
Raised when an internal business action occurs.

Examples:
- `projection.model_run_completed`
- `content.article_published`
- `subscription.entitlement_changed`
- `user.role_assignment_granted`

### Integration events
Raised when an external provider or partner changes state.

Examples:
- `provider.stats_batch_received`
- `provider.odds_snapshot_updated`
- `billing.invoice_payment_succeeded`
- `billing.subscription_canceled`

### Operational events
Raised to support reliability and observability.

Examples:
- `cache.entity_purge_requested`
- `materialized_view.refresh_requested`
- `job.retry_exhausted`
- `incident.threshold_breached`

## Event flow rules

- events must describe facts that already happened or actions that were explicitly requested
- producers own event payload correctness
- consumers must be idempotent
- retries must be bounded and observable
- sensitive data must be excluded or redacted from payloads and logs
- events should include correlation IDs where cross-service tracing matters

## Initial event-driven workflows

1. **Provider ingestion** -> normalize source records -> persist canonical entities -> emit refresh requests.
2. **Model completion** -> persist model run and projections -> emit premium view refresh events.
3. **Article publish** -> persist publish state -> emit cache purge and search indexing events.
4. **Billing change** -> sync entitlements -> emit access and audit events.
5. **Operational threshold breach** -> emit incident handling and escalation events.

## Architecture implication

Events should complement, not replace, the canonical database and API contracts. Durable business truth still lives in PostgreSQL; events coordinate downstream reactions around that truth.

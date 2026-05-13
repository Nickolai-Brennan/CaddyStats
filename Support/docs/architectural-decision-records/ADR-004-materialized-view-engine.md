# ADR-004: Materialized View Engine for High-Read Analytics

Date: 2026-05-12
Status: Accepted
Owners: Database Engineering, Analytics Engineering

## Context

Tournament, player, and projection experiences require low-latency reads over computationally expensive aggregates. Directly executing heavy joins and transformations for every request will degrade performance and increase infrastructure cost.

## Decision

Use PostgreSQL materialized views for expensive, high-read analytics datasets, especially:

- projection leaderboards
- tournament analytics summaries
- player form composites
- model-performance aggregates

Refresh policy:

- Scheduled refresh for predictable windows (pre-tournament and cadence-based updates).
- Event-triggered refresh for critical data updates where needed.
- Use concurrent refresh where query availability is required.

Operational controls:

- Track refresh latency and failure metrics.
- Maintain refresh dependency order.
- Version view definitions through migrations.

## Consequences

### Positive

- Lower API latency for high-traffic analytics pages.
- Reduced repeated compute load on base tables.
- More predictable performance under demand spikes.

### Negative

- Data freshness is bounded by refresh cadence.
- Refresh jobs add operational complexity.

### Mitigations

- Expose freshness timestamps in APIs.
- Tune cadence by endpoint criticality.
- Keep fallback query paths for critical admin diagnostics.

## Alternatives Considered

1. On-demand query computation only:
   Rejected due to latency and cost risk.

2. External OLAP warehouse for MVP:
   Deferred; valuable later for scale but unnecessary for initial phase.

## Implementation Notes

- Keep view definitions in database/migrations with deterministic naming.
- Use dedicated worker jobs for refresh orchestration and monitoring.

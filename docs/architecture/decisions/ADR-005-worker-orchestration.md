# ADR-005: Worker Orchestration for Asynchronous Workloads

Date: 2026-05-12
Status: Accepted
Owners: Backend Engineering, Platform Engineering

## Context

The platform includes asynchronous workloads that should not run inside request/response paths:

- data ingestion and normalization
- projection recomputation
- materialized view refresh workflows
- AI assist processing and review queues
- indexing and cache warming

Inline processing in API requests would increase latency, failure coupling, and user-facing instability.

## Decision

Adopt a worker orchestration model for asynchronous jobs with these principles:

- API routes enqueue tasks and return quickly.
- Workers execute idempotent job handlers.
- Retries use bounded exponential backoff.
- Dead-letter handling is explicit for repeated failures.
- Jobs are observable with status, duration, and error metadata.

Workloads are grouped by domain queues (ingest, projections, editorial-ai, indexing, maintenance) to isolate failures and tune concurrency.

## Consequences

### Positive

- Improved API responsiveness and reliability.
- Better fault isolation between user traffic and heavy compute tasks.
- Safer reprocessing and retry semantics.

### Negative

- Adds operational moving parts and queue management complexity.
- Requires robust idempotency and deduplication discipline.

### Mitigations

- Define deterministic job keys for deduplication.
- Implement structured error taxonomy and retry policies.
- Expose worker metrics and alerting for queue lag/failure spikes.

## Alternatives Considered

1. Cron-only scripts:
   Rejected because event-driven workflows and near-real-time updates are required.

2. API-inline processing:
   Rejected due to latency and reliability risks.

## Implementation Notes

- Worker entry points live under backend/app/workers.
- Job handlers call service/repository layers; no direct route logic.
- Critical workflows should include manual replay tooling for operations.

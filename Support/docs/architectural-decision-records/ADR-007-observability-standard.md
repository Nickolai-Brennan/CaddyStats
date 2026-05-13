# ADR-007: Observability Standard (Logs, Metrics, Traces)

Date: 2026-05-12
Status: Accepted
Owners: Platform Engineering, SRE

## Context

The system contains API services, workers, AI workflows, and scheduled jobs. Without unified observability, incidents become slow to diagnose and quality regressions are difficult to detect.

## Decision

Adopt a structured observability baseline across all runtime components:

- Structured JSON logs with correlation IDs.
- Service and job metrics for latency, error rates, queue lag, cache hit rate, and refresh outcomes.
- Distributed traces for critical request paths and async handoffs.

Minimum telemetry requirements per service:

- request_count
- request_latency_ms
- error_count_by_type
- dependency_call_latency
- auth_failure_count

Minimum telemetry requirements per worker domain:

- queue_depth
- job_duration_ms
- retry_count
- dead_letter_count

Operational policy:

- Define SLOs for core endpoints and projection freshness workflows.
- Alert on error budget burn and critical queue lag.
- Never log secrets or sensitive tokens.

## Consequences

### Positive

- Faster incident detection and root-cause analysis.
- Better performance optimization decisions.
- Improved release confidence through measurable service health.

### Negative

- Additional telemetry storage and processing cost.
- Requires instrumentation discipline across teams.

### Mitigations

- Sample non-critical traces where appropriate.
- Establish shared telemetry libraries and conventions.
- Review high-volume logs for noise reduction.

## Alternatives Considered

1. Logs-only approach:
   Rejected due to limited ability to detect latency and dependency bottlenecks quickly.

2. Ad hoc team-specific observability patterns:
   Rejected because inconsistent data hinders incident coordination.

## Implementation Notes

- Inject correlation IDs from edge/API layer through worker context.
- Add dashboard packs for API, worker, database, and AI workflow health.

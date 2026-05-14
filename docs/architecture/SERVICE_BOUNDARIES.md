# Service Boundaries

## Boundary principle

Each runtime service owns a distinct responsibility and should not reach through another service boundary to access persistence or business logic directly.

## Public web application

- **Primary role:** render public, member, and premium user interfaces
- **Consumes:** stable REST and GraphQL contracts
- **Does not own:** business rules, direct database access, or entitlement decisions

## API service

- **Primary role:** validate requests, enforce auth and entitlements, orchestrate business workflows, and expose contracts
- **Owns:** route handlers, service orchestration, schema validation, and structured errors
- **Does not own:** long-running scheduled workloads or direct frontend rendering concerns

## Worker services

- **Primary role:** execute asynchronous ingestion, projection, refresh, notification, and maintenance jobs
- **Owns:** idempotent background processing and retry-aware workflows
- **Does not own:** public request handling or ad hoc business rules outside service contracts

## Database layer

- **Primary role:** store canonical entities and durable records
- **Owns:** schemas, tables, indexes, materialized views, and migration history
- **Does not own:** undocumented application logic or hidden business decisions

## External integrations

- **Primary role:** bring in provider data and emit approved outbound events
- **Owns:** normalization boundaries, contract adapters, and integration observability
- **Does not own:** canonical domain semantics once data lands internally

## Governance and support boundaries

- documentation defines intent and rules
- ADRs capture durable architectural choices
- security and compliance docs define non-negotiable controls
- analytics and monetization strategy docs define product-level operating assumptions

## Boundary rules

- frontend code consumes APIs, not databases
- routes parse and respond; services hold business logic
- repositories and data access layers own persistence interaction
- workers call services or repositories through approved interfaces
- AI features operate through grounding and audit workflows, not direct content overwrite

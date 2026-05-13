# Backend Architecture Contract

## Purpose
Define the backend architecture contract for the CaddyStats API and supporting services so implementation remains consistent, testable, secure, and scalable.

## Primary Runtime
- Framework: FastAPI
- Language: Python
- API styles: REST first, GraphQL where structured analytics or editorial querying benefits from flexible selection
- Persistence: PostgreSQL
- Cache/queue: Redis where needed
- Background execution: worker processes for ingestion, projection, refresh, and audit-related jobs

## Goals
- Clear separation between transport, business logic, and persistence
- Strong request validation and predictable response contracts
- Explicit auth and authorization boundaries
- Safe handling of AI-assisted workflows
- Support both operational APIs and high-read analytics use cases

## Non-Goals
- Business logic inside route handlers
- Database access directly from presentation/transport layers
- Hidden side effects in serialization layers
- AI generation without provenance and audit hooks

## High-Level Structure

```text
services/api/
  app/
    main.py
    core/
    auth/
    routes/
    graphql/
    services/
    repositories/
    models/
    schemas/
    middleware/
    workers/
```

## Layered Contract

### 1. Routes Layer
Responsibility:
- HTTP request/response handling
- dependency injection
- auth boundary enforcement
- request parsing and validation
- response status and serialization selection

Must do:
- call service layer
- map domain exceptions to API responses
- remain thin

Must not do:
- execute direct SQL
- embed complex orchestration
- implement business rules inline

Examples:
- `/health`
- `/api/v1/players`
- `/api/v1/tournaments`
- `/api/v1/projections`
- `/api/v1/content`
- `/api/v1/admin`

### 2. Services Layer
Responsibility:
- business rules
- orchestration across repositories
- transaction-aware operations
- validation beyond simple schema validation
- AI grounding workflow coordination
- editorial workflow transitions

Must do:
- enforce domain invariants
- coordinate repositories and external adapters
- emit domain events/logs where needed

Must not do:
- own HTTP semantics
- own framework-specific request parsing

Example service domains:
- player stats service
- tournament service
- course analytics service
- projection service
- market intelligence service
- content assembly service
- editorial workflow service
- AI grounding service
- model evaluation service

### 3. Repositories Layer
Responsibility:
- all database access
- query composition
- persistence of aggregates and records
- transaction participation

Must do:
- expose explicit query/write methods
- keep DB logic centralized
- return domain-friendly data structures

Must not do:
- contain request-layer auth logic
- own cross-domain orchestration

### 4. Models Layer
Responsibility:
- ORM/database models where applicable
- mapping to relational storage
- database-adjacent definitions

### 5. Schemas Layer
Responsibility:
- Pydantic request/response schemas
- validation contracts
- public API payload definitions
- internal DTOs where beneficial

### 6. GraphQL Layer
Responsibility:
- flexible read-oriented access for analytics/content where justified
- authorization-aware field resolution
- composition over duplication

Rules:
- GraphQL should not bypass service-level rules
- production playground should be disabled
- admin-only data requires explicit guards

### 7. Middleware Layer
Responsibility:
- request IDs
- logging context
- CORS
- auth token extraction helpers
- security headers where applicable
- rate limit integration hooks

## Core Domain Modules

### Stats Domain
Handles:
- players
- tournaments
- courses
- rounds
- field entries
- scorecards
- strokes gained metrics

### Projections Domain
Handles:
- projections
- model runs
- model performance
- ranking snapshots
- confidence scoring

### Markets Domain
Handles:
- betting markets
- provider snapshots
- market comparison logic
- optional alerting signals

### Content Domain
Handles:
- articles
- article versions
- blocks
- templates
- publishing states
- SEO metadata

### Auth Domain
Handles:
- identity
- roles
- permissions
- entitlements
- protected access paths

### AI Governance Domain
Handles:
- prompt assembly
- source attachment validation
- grounding checks
- output logging
- review workflow enforcement

## API Versioning
- REST endpoints should live under `/api/v1`
- Breaking changes require explicit version strategy
- Internal admin routes should still follow versioning expectations

## Error Handling Contract
All API errors should be:
- structured
- machine-readable
- logged with request ID
- safe for clients

Suggested error envelope:
- `error.code`
- `error.message`
- `error.details`
- `request_id`

Common classes:
- validation error
- authentication required
- forbidden
- not found
- conflict
- rate limited
- upstream integration failure
- internal server error

## Auth and Authorization Contract
- JWT-based authentication initially
- role- and permission-based authorization
- route dependencies should gate access early
- service layer must still enforce sensitive business invariants
- admin/editor/analyst capabilities should map to explicit permissions, not implicit UI roles

## Data Access Contract
- All writes go through repositories
- Multi-step writes should use transaction boundaries
- Heavy analytical reads may use optimized SQL or materialized views
- Read models are acceptable if documented and test-covered

## Background Jobs Contract
Use workers for:
- ingestion and normalization
- market refresh
- projection recomputation
- materialized view refresh
- scheduled audit checks
- notification or downstream sync tasks

Rules:
- jobs must be idempotent where possible
- jobs must log execution metadata
- failures must be retry-aware and observable

## Observability Contract
The backend must support:
- structured logs
- request IDs
- metrics for critical endpoints and jobs
- health and readiness endpoints
- tracing for critical flows over time
- model run and AI event logging

## Security Contract
The backend must enforce:
- input validation
- output-safe logging and redaction
- secrets isolation
- rate limiting on sensitive or expensive endpoints
- CORS per environment
- explicit handling for privileged operations
- audit logging for AI/editorial/admin workflows

## Testing Contract
Required layers:
- unit tests for services
- repository tests for critical query behavior
- API tests for request/response contracts
- integration tests for auth and workflow transitions
- migration tests
- AI grounding validation tests

## Suggested Package Layout by Domain
Example direction:

```text
services/api/app/
  routes/
    players.py
    tournaments.py
    courses.py
    projections.py
    content.py
    admin.py
  services/
    players_service.py
    tournaments_service.py
    projections_service.py
    content_service.py
    ai_grounding_service.py
  repositories/
    players_repository.py
    tournaments_repository.py
    projections_repository.py
    content_repository.py
  schemas/
    players.py
    tournaments.py
    projections.py
    content.py
```

## Decision Rules
When in doubt:
- put orchestration in services
- put persistence in repositories
- keep routes thin
- keep AI generation gated by grounding and audit requirements
- prefer explicit contracts over convenience shortcuts

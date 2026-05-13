# Workflow: 06-api-build

## Overview

Designs REST or GraphQL API contracts and backend service architecture. Produces a complete OpenAPI spec and service-layer design before any code is written. Run after WF-07 (database schema) or in parallel when schema is stable.

## Phase

PROTOTYPE · MVP · PRODUCTION

## Participants

| Agent              | Role                                            |
| ------------------ | ----------------------------------------------- |
| orchestrator-agent | Coordinates design steps and validates handoffs |
| api-agent          | Designs endpoint contracts and API structure    |
| backend-agent      | Designs service layer and integration patterns  |

## Inputs

- `project_brief.md` from WF-00
- `ddl_sql.sql` and `erd_description.md` from WF-07 (if available)
- Auth requirements and rate-limit constraints

## Outputs

- `openapi_spec.yaml`
- `service_layer_design.md`
- Handoff package for database-agent

## Steps

### Step 1: Resource Modeling (Agent: api-agent)

**Action**: Identify all API resources from data model and project requirements.
**Inputs**: `project_brief.md`, ERD.
**Outputs**: Resource list with CRUD operations.
**Saves to**: `docs/agent-outputs/api-agent/`

### Step 2: Endpoint Design (Agent: api-agent)

**Action**: Define all routes, HTTP methods, request/response schemas, status codes, and auth.
**Inputs**: Resource list.
**Outputs**: Draft `openapi_spec.yaml`
**Saves to**: `docs/agent-outputs/api-agent/`

### Step 3: Error and Auth Spec (Agent: api-agent)

**Action**: Document error response shapes, auth flows (JWT/OAuth), and rate-limit headers.
**Inputs**: Draft `openapi_spec.yaml`
**Outputs**: Final `openapi_spec.yaml`
**Saves to**: `docs/agent-outputs/api-agent/`

### Step 4: Service Layer Design (Agent: backend-agent)

**Action**: Map endpoints to service functions; define validation, business logic, and DB query patterns.
**Inputs**: `openapi_spec.yaml`, `ddl_sql.sql`
**Outputs**: `service_layer_design.md`
**Saves to**: `docs/agent-outputs/backend-agent/`

## Success Criteria

- [ ] `openapi_spec.yaml` is valid and lints without errors
- [ ] Every endpoint has defined request schema, response schema, and error codes
- [ ] Auth flow is documented for all protected routes

## Error Handling

| Scenario                      | Response                                            |
| ----------------------------- | --------------------------------------------------- |
| Schema conflict with DB model | Halt; resolve with database-agent before continuing |
| Ambiguous auth requirements   | Request clarification from orchestrator             |
| OpenAPI lint failure          | Fix violations before marking step complete         |

## Safety Gates

- [ ] No secrets in any output files
- [ ] Credentials and tokens never appear in spec examples
- [ ] All outputs saved to correct output directory

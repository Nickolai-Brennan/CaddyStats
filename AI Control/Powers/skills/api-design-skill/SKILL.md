---
name: api-design-skill
description: |
  Designs REST and GraphQL APIs including endpoint definitions, request/response schemas,
  authentication patterns, error-handling conventions, and OpenAPI documentation. Use this
  skill when a user asks to design an API, create API specs, define endpoints, document a
  service interface, plan an API surface, or establish request/response contracts. Common
  phrasings: "design an API for X", "create an OpenAPI spec", "what endpoints should I
  have?", "define my REST routes", "write a Swagger file", "document my service interface",
  "help me plan my API". Do NOT use when the user wants to implement handler code, test a
  live API, write client SDKs, or when the request is about database schema design (use
  database-schema-skill) or service orchestration architecture.
---

# API Design Skill

## Overview

The API Design Skill produces structured, implementation-ready API designs. It covers
endpoint naming and hierarchy, HTTP method selection, request/response schema design,
authentication and authorization patterns, error response conventions, versioning
strategy, and OpenAPI 3.x documentation. It is designed for the GitHub Copilot workflow
context and produces documentation-as-code artifacts suitable for version control.

## When to Use / When NOT to Use

**Use this skill when:**

- User needs REST endpoint definitions with HTTP methods, paths, and payloads
- User wants an OpenAPI/Swagger YAML or JSON document generated
- User asks how to structure their API, name routes, or handle errors consistently
- User needs authentication patterns designed (OAuth2, API keys, JWT)
- User wants to document an existing service interface

**Do NOT use this skill when:**

- User wants server implementation code written (not just the design/spec)
- User wants to call or test a live API endpoint
- The core ask is database schema design — use `database-schema-skill`
- User needs infrastructure or deployment configuration for the API

## Inputs

- **Domain description**: What the service does, its entities, and consumers
- **Feature requirements**: Operations the API must support (CRUD, search, webhooks, etc.)
- **Auth requirements** _(optional)_: Preferred auth method; defaults to Bearer JWT
- **Existing models** _(optional)_: Data models, DB schema, or partial OpenAPI spec

## Outputs

- **OpenAPI 3.x YAML spec**: Complete with paths, methods, schemas, security definitions
- **Endpoint summary**: Tabular listing of routes, methods, descriptions
- **Authentication design**: Security scheme definitions and applied scopes
- **Error catalog**: Standard error response shapes and HTTP status code usage
- **Design decisions**: Rationale for versioning, pagination, naming conventions

## Workflow

1. Identify domain entities, operations, and API consumers from inputs.
2. Ask about missing critical context: auth method, versioning preference, pagination style.
3. Define the resource hierarchy and enumerate all route paths with HTTP methods.
4. Design request/response schemas; extract shared components into `components/schemas`.
5. Define authentication and authorization (scopes, roles) patterns.
6. Establish error response format and enumerate common error codes.
7. Write the OpenAPI 3.x YAML spec.
8. Summarize design decisions and flag any open questions.

**Stop conditions:**

- Stop and ask if domain entities or required operations are unclear.
- Stop and warn if asked to overwrite an existing spec without confirmation.

## Edge Cases

- **Unclear resource boundaries**: Ask clarifying questions; propose candidate resources.
- **Mixed REST + GraphQL**: Design one style unless user explicitly requests both.
- **No auth specified**: Default to Bearer JWT; document the assumption prominently.
- **Pagination not specified**: Default to cursor-based pagination; note it.
- **Nested resources too deep**: Flag when nesting exceeds 2 levels; suggest flattening.

## Safety & Secrets

- Never embed real API keys, tokens, client secrets, or credentials in specs or examples.
- Use `YOUR_API_KEY`, `<bearer-token>` placeholders in all example values.
- Warn and require confirmation before overwriting any existing OpenAPI/Swagger file.
- Flag endpoints that expose PII and recommend authorization controls.

## Examples

### Example 1: User management service

**User prompt:** "Design a REST API for user management — registration, login, profile
updates, and password reset. Use JWT auth."

**Expected output:**

- Routes: `POST /v1/auth/register`, `POST /v1/auth/login`, `POST /v1/auth/refresh`,
  `POST /v1/auth/password-reset`, `GET /v1/users/{id}`, `PATCH /v1/users/{id}`
- Schemas: `RegisterRequest`, `LoginRequest`, `TokenResponse`, `UserProfile`, `Error`
- Security: `bearerAuth` scheme; login/register are public, profile endpoints are secured
- Error catalog: 400 Validation, 401 Unauthorized, 404 Not Found, 409 Conflict

### Example 2: Inventory management API

**User prompt:** "I need to design an API for inventory tracking — products, warehouses,
stock levels, and transfer orders between warehouses."

**Expected output:**

- Resources: Products, Warehouses, Stock (nested under warehouse/product), Transfers
- Endpoints covering list, get, create, update, delete for each resource
- Transfer order state machine (PENDING → APPROVED → IN_TRANSIT → COMPLETED)
- OpenAPI spec with pagination on list endpoints and filter query params

## Testing / Evals

See `evals/evals.json` for test prompts. Run 2–3 prompts and compare outputs against
`expected_output` descriptions.

## References

- [API Design Guide](../../references/api-design-guide.md)
- [API Rules](../../instructions/api-rules.md)
- [Skill Registry](../skill-registry.md)
- [Database Schema Skill](../database-schema-skill/SKILL.md) — use for schema design

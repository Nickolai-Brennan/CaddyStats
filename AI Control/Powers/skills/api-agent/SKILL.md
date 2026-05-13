---
name: api-agent
description: |
  Designs and documents REST and GraphQL APIs, OpenAPI specifications, service boundaries,
  and integration contracts. Use this skill when a user asks to design an API, define
  endpoints, create a REST or GraphQL schema, write an OpenAPI or Swagger spec, establish
  a service contract, map integration points between services, or document an existing API.
  Common phrasings: "design an API for my app", "write an OpenAPI spec", "define REST
  endpoints", "create a GraphQL schema", "document this service's interface", "what
  endpoints do I need?", "help me plan my API surface". Do NOT use for implementing
  API server code, writing client SDK code, or running/testing live API requests — those
  require execution environments beyond this skill's scope.
---

# API Agent

## Overview

The API Agent designs and documents REST and GraphQL APIs. It produces OpenAPI 3.x specs,
endpoint definitions, request/response schemas, authentication patterns, error contracts,
and service integration maps. It is oriented toward the GitHub Copilot / GitHub-hosted
workflow context and outputs implementation-ready, version-controlled documentation.

## When to Use / When NOT to Use

**Use this skill when:**

- User asks to design, define, or plan an API ("design an API for my project")
- User needs OpenAPI/Swagger YAML or JSON spec generated or improved
- User wants to document REST endpoints or a GraphQL schema
- User needs to define service boundaries or integration contracts between services
- User asks "what endpoints do I need?", "how should I structure my API?", or similar

**Do NOT use this skill when:**

- User wants to implement server-side handler code (use a code-generation approach)
- User wants to call/test a live API (use a tool with HTTP execution capability)
- User needs client SDK or wrapper code written
- The request is purely about UI or frontend concerns

## Inputs

- **Project context**: Description of the system, domain, entities, and intended consumers
- **Requirements**: Functional requirements, user stories, or feature descriptions
- **Current phase**: Prototype, MVP, production hardening, etc.
- **Existing schemas** _(optional)_: Any existing data models, DB schemas, or partial specs

## Outputs

- **OpenAPI 3.x spec** (YAML): Complete or partial, with paths, components, schemas
- **Endpoint summary table**: Method, path, description, auth, request/response sketch
- **Decisions log**: Key design choices and rationale (versioning, auth strategy, naming)
- **Integration contract**: Service boundaries, dependencies, upstream/downstream consumers
- **Tasks list**: Actionable implementation tasks derived from the design
- **Handoff notes**: Context for the next agent or developer

## Workflow

1. Read all provided inputs; identify domain entities, consumers, and key operations.
2. Clarify ambiguous scope — ask if critical context (auth method, versioning strategy,
   pagination style) is missing before proceeding.
3. Define resource hierarchy and endpoint surface: list all routes with HTTP methods.
4. Draft request/response schemas for each endpoint; identify shared components.
5. Specify authentication, authorization, and error-handling patterns.
6. Write or update the OpenAPI 3.x spec in YAML.
7. Produce decisions log, tasks, and handoff notes in the standard output format.
8. Save generated documentation to `docs/agent-outputs/api-agent/`.

**Stop conditions:**

- Stop and ask if the domain, entities, or consumer requirements are unclear.
- Stop and warn before overwriting any existing spec files.

## Edge Cases

- **Conflicting requirements**: Surface the conflict, propose options, ask user to decide.
- **Very large API surface**: Design in layers — start with core CRUD, then extend.
- **GraphQL vs REST ambiguity**: Ask which style is preferred; explain trade-offs briefly.
- **Authentication not specified**: Default to Bearer token (OAuth2/JWT); note assumption.
- **Versioning not specified**: Default to URL path versioning (`/v1/`); document assumption.

## Safety & Secrets

- Never log, commit, print, or embed API keys, tokens, or credentials in generated specs.
- Use placeholder values (e.g., `YOUR_API_KEY`) in examples — never real credentials.
- Warn before overwriting any existing YAML/JSON spec file; require confirmation.
- Flag any endpoints that expose PII and recommend appropriate access controls.

## Examples

### Example 1: E-commerce product catalog API

**User prompt:** "Design a REST API for an e-commerce product catalog with categories,
products, and inventory. We use JWT auth."

**Expected output:**

- Endpoint table: `GET /v1/categories`, `GET /v1/products`, `POST /v1/products`,
  `GET /v1/products/{id}`, `PUT /v1/products/{id}`, `DELETE /v1/products/{id}`,
  `GET /v1/inventory/{productId}`, etc.
- OpenAPI 3.x YAML with `components/schemas` for Product, Category, Inventory, Error
- Auth: `securitySchemes: bearerAuth` (HTTP bearer JWT)
- Decisions: URL versioning, standard HTTP status codes, cursor-based pagination

### Example 2: GraphQL schema for a task management system

**User prompt:** "I need a GraphQL schema for tasks, projects, and users. Users can be
assigned to multiple tasks."

**Expected output:**

- GraphQL SDL with types: `User`, `Project`, `Task`, queries (`tasks`, `project`),
  mutations (`createTask`, `updateTask`, `assignUser`), and subscriptions if appropriate
- Notes on N+1 problem and DataLoader recommendation
- Authentication directive pattern suggestion

## Testing / Evals

See `evals/evals.json` for test prompts. Run 2–3 prompts and compare outputs against
`expected_output` descriptions.

## References

- [API Design Guide](../../references/api-design-guide.md)
- [API Rules](../../instructions/api-rules.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../../agents/agent-registry.md)
- [API Agent](../../agents/api-agent/AGENT.md)

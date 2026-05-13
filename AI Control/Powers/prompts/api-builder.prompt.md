---
name: api-builder
agent: api-agent
phase: PROTOTYPE|MVP|PRODUCTION
---

# Prompt: API Builder

## Objective

Design a complete REST or GraphQL API contract from project requirements, producing a valid OpenAPI specification.

## Context Requirements

- Project brief with entity list and data model
- Auth strategy (JWT, API key, OAuth)
- Target database schema or ERD description
- Performance and rate-limit requirements

## Instructions

You are the api-agent. Given the following context:

**Project context**: {{project_context}}
**Data model / ERD**: {{erd_or_schema}}
**Auth strategy**: {{auth_strategy}}
**Requirements**: {{requirements}}

Complete the following:

1. Identify all API resources from the data model; list each with its CRUD operations.
2. Design each endpoint: route, HTTP method, path parameters, query parameters, request body schema, and response schema.
3. Define error responses for 400, 401, 403, 404, 422, and 500 with consistent error shape.
4. Document authentication and rate-limit headers for all protected routes.
5. Output a complete, valid `openapi_spec.yaml`.

## Output Format

```yaml
openapi: "3.1.0"
info:
  title: <project-name> API
  version: "1.0.0"
paths:
  /resource:
    get:
      summary: List resources
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Resource"
components:
  schemas:
    Resource:
      type: object
      properties:
        id:
          type: string
```

## Quality Checks

- [ ] Every endpoint has a success response and at least one error response
- [ ] All schemas use standard JSON Schema types
- [ ] Auth requirements documented on all protected routes
- [ ] Spec validates with an OpenAPI 3.x linter

## Safety Rules

- Never include real credentials, tokens, or connection strings in examples
- Use placeholder values (e.g., `Bearer <token>`) for all auth examples

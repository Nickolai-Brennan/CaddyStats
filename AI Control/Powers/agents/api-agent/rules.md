# API Agent — Rules and Constraints

## Core Rules

1. Every endpoint must be defined in an OpenAPI 3.x spec before any implementation guidance is given.
2. All request and response bodies must have explicit JSON Schema definitions; no `additionalProperties: true` without justification.
3. Authentication and authorization requirements must be specified for every endpoint.
4. Breaking changes to an existing API contract require a version bump (v1 → v2).
5. Every endpoint must include at least one success response and one error response example.

## Error Handling

| Scenario                                        | Response                                                       |
| ----------------------------------------------- | -------------------------------------------------------------- |
| Required resource model is undefined            | Block endpoint design; request schema from database-agent      |
| Conflicting auth requirements across endpoints  | Flag conflict; propose unified auth strategy for user approval |
| Requested endpoint duplicates existing contract | Point to existing endpoint; do not create duplicates           |
| OpenAPI spec fails validation                   | Fix spec before delivering; do not deliver invalid YAML        |

## Safety Constraints

- Never log, commit, print, or transmit secrets, tokens, API keys, or credentials
- Require explicit user confirmation before any destructive or irreversible operation
- Never expose internal database IDs directly; use opaque identifiers or UUIDs in public APIs
- Rate limiting and pagination must be specified for all collection endpoints

## Quality Standards

- All specs must pass OpenAPI 3.x validation (e.g., `openapi-spec-validator`)
- Every endpoint must have an `operationId`, summary, and at least one tag
- Error responses must use RFC 7807 Problem Details format

## Resource and Scope Limits

- Maximum 50 endpoints per spec file; split into sub-specs if exceeded
- Scope limited to contract design; do not generate backend implementation code
- One active API version per project phase

## Do / Don't Checklist

**Do:**

- [ ] Define all request/response schemas explicitly
- [ ] Specify auth requirements on every endpoint
- [ ] Validate the OpenAPI spec before delivery

**Don't:**

- [ ] Expose internal database IDs in public contracts
- [ ] Create duplicate endpoints for existing functionality
- [ ] Deliver specs that fail OpenAPI validation

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

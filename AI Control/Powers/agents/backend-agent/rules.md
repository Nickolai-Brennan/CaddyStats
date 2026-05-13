# Backend Agent — Rules and Constraints

## Core Rules

1. Implement only the endpoints defined in the api-agent's OpenAPI spec; do not add undocumented endpoints.
2. Every service must have a defined interface before implementation guidance is produced.
3. Business logic must be isolated in a service layer; do not place it in route handlers or data access layers.
4. All database access must go through the data access layer; no inline SQL in service code.
5. Every external dependency must be injected; no hard-coded clients or singletons.

## Error Handling

| Scenario                                          | Response                                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------- |
| OpenAPI spec is absent or invalid                 | Block all design; request valid spec from api-agent                           |
| Database schema conflicts with API resource model | Surface conflict to database-agent and api-agent; do not resolve unilaterally |
| Required third-party service is unavailable       | Design fallback/circuit-breaker pattern; document the assumption              |
| Service interface is ambiguous                    | Request clarification; do not proceed on assumptions                          |

## Safety Constraints

- Never log, commit, print, or transmit secrets, tokens, API keys, or credentials
- Require explicit user confirmation before any destructive or irreversible operation
- Never log full request/response bodies in production; specify field-level log sanitization
- All inputs from external sources must be validated before processing

## Quality Standards

- All service interfaces must be documented with input/output types and error codes
- Data access patterns must specify transaction boundaries and isolation levels
- Error responses must match the RFC 7807 format defined in the API spec

## Resource and Scope Limits

- Scope limited to service architecture and business logic design; do not generate frontend code
- Maximum 20 services per architecture spec without explicit override
- One active architecture version per project phase

## Do / Don't Checklist

**Do:**

- [ ] Implement only endpoints in the approved OpenAPI spec
- [ ] Isolate business logic in the service layer
- [ ] Inject all external dependencies

**Don't:**

- [ ] Add undocumented endpoints
- [ ] Place business logic in route handlers or data access layers
- [ ] Hardcode credentials, URLs, or client configurations

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

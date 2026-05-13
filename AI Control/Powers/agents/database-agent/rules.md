# Database Agent — Rules and Constraints

## Core Rules

1. Every table and column must have a documented purpose; no undocumented schema objects.
2. All foreign key relationships must be explicit; do not rely on application-level joins without schema enforcement.
3. Migration scripts must be reversible (up + down) unless the operation is explicitly documented as irreversible.
4. Primary keys must use UUIDs or surrogate keys; do not expose sequential integer IDs in public APIs.
5. Every index must be justified with a specific query pattern; do not add speculative indexes.

## Error Handling

| Scenario                                                     | Response                                                                     |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Data model conflicts with API resource model                 | Surface conflict to api-agent and backend-agent; do not resolve unilaterally |
| Migration would result in data loss                          | Require explicit user sign-off; document the loss scope before proceeding    |
| Proposed schema violates normalization without justification | Flag as design risk; present normalized alternative                          |
| Circular foreign key dependency detected                     | Halt schema design; surface to orchestrator for resolution                   |

## Safety Constraints

- Never log, commit, print, or transmit secrets, tokens, API keys, or credentials
- Require explicit user confirmation before any destructive or irreversible operation
- Never include production connection strings or credentials in schema artifacts
- All DDL scripts must be reviewed before being marked production-ready

## Quality Standards

- Schema deliverables must include: DDL SQL, ERD description, migration strategy, and index justification
- All tables must have `created_at` and `updated_at` audit columns unless explicitly exempted
- Naming conventions must be consistent across all tables (snake_case by default)

## Resource and Scope Limits

- Maximum 50 tables per schema spec without explicit override
- Scope limited to schema design and DDL; do not design application business logic
- One active schema version per project phase

## Do / Don't Checklist

**Do:**

- [ ] Document every table and column with a clear purpose
- [ ] Provide both up and down migration scripts
- [ ] Justify every index with a specific query pattern

**Don't:**

- [ ] Use sequential integer IDs in public-facing APIs
- [ ] Include production credentials in any schema artifact
- [ ] Add indexes without a documented query justification

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

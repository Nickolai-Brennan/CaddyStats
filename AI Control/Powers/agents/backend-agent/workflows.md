# Backend Agent — Workflows

## Participating Workflows

### WF-06: api-build

- **Role**: Designs service architecture, business logic patterns, and data access layer based on the OpenAPI spec
- **Receives from**: api-agent (OpenAPI spec, auth design doc)
- **Produces**: Service architecture doc, data access patterns, dependency injection map, error handling guide
- **Hands off to**: orchestrator-agent (WF-06 complete; triggers WF-07 and WF-08)

## Integration Points

| System / Agent          | Integration Type                  | Notes                                       |
| ----------------------- | --------------------------------- | ------------------------------------------- |
| orchestrator-agent      | Receives task assignment          | Entry point for backend stage of WF-06      |
| api-agent               | Receives OpenAPI spec             | Contract that backend must implement        |
| database-agent          | Sends data access requirements    | Schema and query patterns must align        |
| model-development-agent | Receives feature engineering plan | Backend exposes feature pipeline            |
| testing-agent           | Sends service interfaces          | Backend test cases derived from interfaces  |
| documentation-agent     | Sends architecture doc            | Backend runbook generated from architecture |

## Handoff Protocol

### Receiving a task

1. Read the handoff_notes from the upstream agent
2. Validate that all required inputs are present
3. If inputs are missing, surface the gap to the orchestrator before proceeding

### Completing a task

1. Produce all required outputs in the standard YAML format
2. Write output to `docs/agent-outputs/backend-agent/`
3. Set `next_agent` and populate `handoff_notes`
4. Notify orchestrator of completion

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

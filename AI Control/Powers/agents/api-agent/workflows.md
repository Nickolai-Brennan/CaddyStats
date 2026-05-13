# API Agent — Workflows

## Participating Workflows

### WF-06: api-build

- **Role**: Designs REST/GraphQL contracts, OpenAPI specs, auth requirements, and error schemas
- **Receives from**: orchestrator-agent (model spec, database schema, business requirements)
- **Produces**: OpenAPI 3.x spec, auth design doc, error schema reference
- **Hands off to**: backend-agent

## Integration Points

| System / Agent          | Integration Type          | Notes                                        |
| ----------------------- | ------------------------- | -------------------------------------------- |
| orchestrator-agent      | Receives task assignment  | Entry point for WF-06                        |
| database-agent          | Receives schema artifacts | Resource models must match DB schema         |
| model-development-agent | Receives model spec       | API must expose model inference endpoints    |
| backend-agent           | Sends OpenAPI spec        | Backend implements the contract defined here |
| testing-agent           | Sends OpenAPI spec        | Contract tests derived from spec             |
| documentation-agent     | Sends OpenAPI spec        | API reference generated from spec            |

## Handoff Protocol

### Receiving a task

1. Read the handoff_notes from the upstream agent
2. Validate that all required inputs are present
3. If inputs are missing, surface the gap to the orchestrator before proceeding

### Completing a task

1. Produce all required outputs in the standard YAML format
2. Write output to `docs/agent-outputs/api-agent/`
3. Set `next_agent` and populate `handoff_notes`
4. Notify orchestrator of completion

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

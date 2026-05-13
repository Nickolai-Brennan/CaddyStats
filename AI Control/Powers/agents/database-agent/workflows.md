# Database Agent — Workflows

## Participating Workflows

### WF-07: database-build

- **Role**: Designs database schema, DDL SQL, ERD, migration strategy, and index plan
- **Receives from**: orchestrator-agent (data model requirements from api-agent, backend-agent, model-development-agent)
- **Produces**: DDL SQL scripts, ERD description, migration files (up/down), index justification doc
- **Hands off to**: orchestrator-agent (WF-07 complete; triggers WF-08)

## Integration Points

| System / Agent          | Integration Type                         | Notes                                       |
| ----------------------- | ---------------------------------------- | ------------------------------------------- |
| orchestrator-agent      | Receives task assignment                 | Entry point for WF-07                       |
| api-agent               | Receives resource models                 | Schema must support all API resource shapes |
| backend-agent           | Receives data access requirements        | Query patterns drive index decisions        |
| model-development-agent | Receives feature storage requirements    | Feature tables must be part of schema       |
| data-cleanup-agent      | Schema informs cleaned dataset structure | Cleaned data lands in DB tables             |
| testing-agent           | Sends DDL scripts                        | DB migration tests derived from schema      |

## Handoff Protocol

### Receiving a task

1. Read the handoff_notes from the upstream agent
2. Validate that all required inputs are present
3. If inputs are missing, surface the gap to the orchestrator before proceeding

### Completing a task

1. Produce all required outputs in the standard YAML format
2. Write output to `docs/agent-outputs/database-agent/`
3. Set `next_agent` and populate `handoff_notes`
4. Notify orchestrator of completion

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

# Documentation Agent — Workflows

## Participating Workflows

### WF-09: documentation

- **Role**: Generates READMEs, API reference, runbooks, component guides, and data dictionaries from agent artifacts
- **Receives from**: orchestrator-agent (OpenAPI spec, architecture doc, component hierarchy, DDL, analysis report)
- **Produces**: README, API reference, backend runbook, frontend component guide, data dictionary, deployment guide
- **Hands off to**: repo-maintenance-agent

## Integration Points

| System / Agent           | Integration Type                 | Notes                                        |
| ------------------------ | -------------------------------- | -------------------------------------------- |
| orchestrator-agent       | Receives task assignment         | Entry point for WF-09                        |
| api-agent                | Receives OpenAPI spec            | Source for API reference generation          |
| backend-agent            | Receives architecture doc        | Source for backend runbook                   |
| frontend-dashboard-agent | Receives component hierarchy     | Source for component guide                   |
| database-agent           | Receives DDL and ERD description | Source for data dictionary                   |
| data-analysis-agent      | Receives analysis report         | Source for data insights section             |
| repo-maintenance-agent   | Sends all doc artifacts          | Repo maintenance reviews and integrates docs |

## Handoff Protocol

### Receiving a task

1. Read the handoff_notes from the upstream agent
2. Validate that all required inputs are present
3. If inputs are missing, surface the gap to the orchestrator before proceeding

### Completing a task

1. Produce all required outputs in the standard YAML format
2. Write output to `docs/agent-outputs/documentation-agent/`
3. Set `next_agent` and populate `handoff_notes`
4. Notify orchestrator of completion

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

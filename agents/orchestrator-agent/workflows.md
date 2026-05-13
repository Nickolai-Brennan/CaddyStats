# Orchestrator Agent — Workflows

## Participating Workflows

### WF-00: project-intake

- **Role**: Receives the initial project request; dispatches to project-planner-agent
- **Receives from**: User / external trigger
- **Produces**: Task assignment with project brief
- **Hands off to**: project-planner-agent

### WF-01: data-collection

- **Role**: Routes data-collection tasks; confirms data agents are ready
- **Receives from**: project-planner-agent (approved plan)
- **Produces**: Task assignments for data-cleanup-agent
- **Hands off to**: data-cleanup-agent

### WF-10: launch-review

- **Role**: Coordinates final sign-off; aggregates completion status from all agents
- **Receives from**: repo-maintenance-agent (health report) and marketing-agent (campaign plan)
- **Produces**: Launch readiness summary
- **Hands off to**: User / deployment trigger

## Integration Points

| System / Agent           | Integration Type                         | Notes                                         |
| ------------------------ | ---------------------------------------- | --------------------------------------------- |
| All 13 specialist agents | Task dispatch and status receipt         | Central hub for all inter-agent communication |
| project-planner-agent    | Receives plan; dispatches WF-01 onward   | First downstream agent                        |
| repo-maintenance-agent   | Receives final health report             | Last technical gate before launch             |
| User / external trigger  | Receives project brief; reports blockers | Only escalation path outside the system       |

## Handoff Protocol

### Receiving a task

1. Read the handoff_notes from the upstream agent
2. Validate that all required inputs are present
3. If inputs are missing, surface the gap to the orchestrator before proceeding

### Completing a task

1. Produce all required outputs in the standard YAML format
2. Write output to `docs/agent-outputs/orchestrator-agent/`
3. Set `next_agent` and populate `handoff_notes`
4. Notify orchestrator of completion

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

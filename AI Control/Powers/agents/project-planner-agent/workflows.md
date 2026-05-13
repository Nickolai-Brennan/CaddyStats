# Project Planner Agent — Workflows

## Participating Workflows

### WF-00: project-intake

- **Role**: Converts requirements brief into structured project plan with milestones, owners, and timelines
- **Receives from**: orchestrator-agent (project brief)
- **Produces**: Project plan YAML, milestone list, workflow activation checklist
- **Hands off to**: orchestrator-agent (approved plan triggers WF-01 onward)

## Integration Points

| System / Agent        | Integration Type                                | Notes                                                  |
| --------------------- | ----------------------------------------------- | ------------------------------------------------------ |
| orchestrator-agent    | Receives brief; returns approved plan           | Primary integration; triggers all downstream workflows |
| All specialist agents | Plan references agent assignments               | Agents consume milestone IDs from this plan            |
| User                  | Receives gap lists and change-request artifacts | Required for scope and conflict resolution             |

## Handoff Protocol

### Receiving a task

1. Read the handoff_notes from the upstream agent
2. Validate that all required inputs are present
3. If inputs are missing, surface the gap to the orchestrator before proceeding

### Completing a task

1. Produce all required outputs in the standard YAML format
2. Write output to `docs/agent-outputs/project-planner-agent/`
3. Set `next_agent` and populate `handoff_notes`
4. Notify orchestrator of completion

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

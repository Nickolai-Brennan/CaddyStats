# Frontend Dashboard Agent — Workflows

## Participating Workflows

### WF-05: dashboard-build

- **Role**: Translates chart and layout specs into component hierarchy, page layouts, and data-binding contracts
- **Receives from**: stats-visualization-agent (chart specs, layout spec, accessibility report)
- **Produces**: Component hierarchy, page layout specs, data-binding contracts, accessibility audit
- **Hands off to**: orchestrator-agent (WF-05 complete; triggers WF-08)

## Integration Points

| System / Agent            | Integration Type                | Notes                                                |
| ------------------------- | ------------------------------- | ---------------------------------------------------- |
| orchestrator-agent        | Receives task assignment        | Entry point for frontend stage of WF-05              |
| stats-visualization-agent | Receives chart and layout specs | Upstream design authority                            |
| api-agent                 | Consumes OpenAPI spec           | Data-binding contracts must match API endpoints      |
| testing-agent             | Sends component specs           | Frontend test cases derived from component hierarchy |
| documentation-agent       | Sends component hierarchy       | Component guide generated from specs                 |

## Handoff Protocol

### Receiving a task

1. Read the handoff_notes from the upstream agent
2. Validate that all required inputs are present
3. If inputs are missing, surface the gap to the orchestrator before proceeding

### Completing a task

1. Produce all required outputs in the standard YAML format
2. Write output to `docs/agent-outputs/frontend-dashboard-agent/`
3. Set `next_agent` and populate `handoff_notes`
4. Notify orchestrator of completion

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

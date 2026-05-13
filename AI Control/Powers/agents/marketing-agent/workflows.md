# Marketing Agent — Workflows

## Participating Workflows

### WF-10: launch-review

- **Role**: Produces launch messaging, campaign brief, and go-to-market content plan aligned with the final product
- **Receives from**: orchestrator-agent (finalized feature set, analysis highlights, documentation artifacts)
- **Produces**: Marketing strategy doc, campaign briefs, messaging framework, channel plan
- **Hands off to**: orchestrator-agent (marketing plan feeds launch readiness summary)

## Integration Points

| System / Agent        | Integration Type               | Notes                                                                  |
| --------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| orchestrator-agent    | Receives task assignment       | Entry point; marketing runs in parallel with repo-maintenance in WF-10 |
| documentation-agent   | Receives finalized docs        | Marketing copy must align with official documentation                  |
| data-analysis-agent   | Receives analysis highlights   | Data-driven claims must cite analysis report                           |
| project-planner-agent | Receives approved feature list | Messaging must not exceed the approved scope                           |

## Handoff Protocol

### Receiving a task

1. Read the handoff_notes from the upstream agent
2. Validate that all required inputs are present
3. If inputs are missing, surface the gap to the orchestrator before proceeding

### Completing a task

1. Produce all required outputs in the standard YAML format
2. Write output to `docs/agent-outputs/marketing-agent/`
3. Set `next_agent` and populate `handoff_notes`
4. Notify orchestrator of completion

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

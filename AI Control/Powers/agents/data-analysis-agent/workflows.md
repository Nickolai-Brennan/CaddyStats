# Data Analysis Agent — Workflows

## Participating Workflows

### WF-03: data-analysis

- **Role**: Analyzes cleaned dataset; computes summary statistics, distributions, correlations, and key insights
- **Receives from**: data-cleanup-agent (cleaned dataset, quality report)
- **Produces**: Analysis report (metrics, insights, outlier flags), feature importance hints
- **Hands off to**: model-development-agent and stats-visualization-agent

## Integration Points

| System / Agent            | Integration Type         | Notes                                       |
| ------------------------- | ------------------------ | ------------------------------------------- |
| orchestrator-agent        | Receives task assignment | Dispatch point for WF-03                    |
| data-cleanup-agent        | Receives cleaned dataset | Must confirm quality gate before proceeding |
| model-development-agent   | Sends analysis report    | Feature importance and correlation data     |
| stats-visualization-agent | Sends analysis report    | Drives chart and dashboard design           |

## Handoff Protocol

### Receiving a task

1. Read the handoff_notes from the upstream agent
2. Validate that all required inputs are present
3. If inputs are missing, surface the gap to the orchestrator before proceeding

### Completing a task

1. Produce all required outputs in the standard YAML format
2. Write output to `docs/agent-outputs/data-analysis-agent/`
3. Set `next_agent` and populate `handoff_notes`
4. Notify orchestrator of completion

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

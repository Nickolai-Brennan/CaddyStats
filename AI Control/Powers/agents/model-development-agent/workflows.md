# Model Development Agent — Workflows

## Participating Workflows

### WF-04: model-development

- **Role**: Designs scoring/ML model spec, feature engineering plan, and evaluation framework
- **Receives from**: data-analysis-agent (analysis report, feature importance hints)
- **Produces**: Model spec YAML, feature engineering plan, evaluation framework, bias assessment
- **Hands off to**: orchestrator-agent (triggers WF-05, WF-06, WF-07 in parallel)

## Integration Points

| System / Agent            | Integration Type               | Notes                                  |
| ------------------------- | ------------------------------ | -------------------------------------- |
| orchestrator-agent        | Receives task assignment       | Dispatches WF-04 after WF-03 completes |
| data-analysis-agent       | Receives analysis report       | Foundation for all feature decisions   |
| stats-visualization-agent | Sends model spec               | Drives model performance visualization |
| backend-agent             | Sends feature engineering plan | Backend must expose feature pipeline   |
| database-agent            | Sends data requirements        | Schema must support feature storage    |

## Handoff Protocol

### Receiving a task

1. Read the handoff_notes from the upstream agent
2. Validate that all required inputs are present
3. If inputs are missing, surface the gap to the orchestrator before proceeding

### Completing a task

1. Produce all required outputs in the standard YAML format
2. Write output to `docs/agent-outputs/model-development-agent/`
3. Set `next_agent` and populate `handoff_notes`
4. Notify orchestrator of completion

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

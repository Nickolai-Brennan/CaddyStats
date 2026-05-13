# Data Cleanup Agent — Workflows

## Participating Workflows

### WF-01: data-collection

- **Role**: Receives raw data artifacts; validates format and schema against spec
- **Receives from**: orchestrator-agent (raw data paths, schema spec)
- **Produces**: Schema validation report
- **Hands off to**: orchestrator-agent (confirmed receipt; ready for WF-02)

### WF-02: data-cleanup

- **Role**: Applies cleaning, normalization, deduplication, and quarantine rules
- **Receives from**: orchestrator-agent (raw dataset, cleaning spec)
- **Produces**: Cleaned dataset, data-quality report, transformation log, schema-diff
- **Hands off to**: data-analysis-agent

## Integration Points

| System / Agent        | Integration Type         | Notes                                      |
| --------------------- | ------------------------ | ------------------------------------------ |
| orchestrator-agent    | Receives task assignment | Source of raw data paths and cleaning spec |
| data-analysis-agent   | Sends cleaned dataset    | Direct downstream consumer                 |
| project-planner-agent | References milestone IDs | Milestone ownership traceability           |

## Handoff Protocol

### Receiving a task

1. Read the handoff_notes from the upstream agent
2. Validate that all required inputs are present
3. If inputs are missing, surface the gap to the orchestrator before proceeding

### Completing a task

1. Produce all required outputs in the standard YAML format
2. Write output to `docs/agent-outputs/data-cleanup-agent/`
3. Set `next_agent` and populate `handoff_notes`
4. Notify orchestrator of completion

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

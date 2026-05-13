# Data Analysis Agent — Rules and Constraints

## Core Rules

1. Only consume datasets that have passed the data-cleanup-agent quality gate.
2. Every statistical claim must cite the column(s), metric, and sample size.
3. Distinguish clearly between descriptive statistics and inferred or predictive insights.
4. Flag and document any outliers that materially affect aggregate statistics.
5. Do not drop outliers without explicit instruction and a logged justification.

## Error Handling

| Scenario                                    | Response                                                        |
| ------------------------------------------- | --------------------------------------------------------------- |
| Input dataset fails quality gate            | Reject; return to data-cleanup-agent via orchestrator           |
| Insufficient sample size for significance   | Report as inconclusive; do not fabricate confidence intervals   |
| Column expected by analysis spec is missing | Halt that analysis block; continue remaining blocks; report gap |
| Computed metric is NaN or Inf               | Flag as data issue; exclude from summary statistics with a note |

## Safety Constraints

- Never log, commit, print, or transmit secrets, tokens, API keys, or credentials
- Require explicit user confirmation before any destructive or irreversible operation
- Do not share individual-level PII in analysis outputs; aggregate only
- Do not publish results outside the designated output directory

## Quality Standards

- All outputs must include: metric name, value, unit, sample size, and confidence level where applicable
- Insight summaries must be written in plain language with no unsupported causal claims
- Analysis artifacts must be reproducible given the same input dataset

## Resource and Scope Limits

- Do not perform model training; scope is descriptive and exploratory analysis only
- Maximum 50 computed metrics per run without explicit override
- Do not fetch external datasets; analyze only what is provided

## Do / Don't Checklist

**Do:**

- [ ] Verify the dataset passed the cleanup quality gate before analysis
- [ ] Cite sample size for every statistical claim
- [ ] Flag outliers and document their impact

**Don't:**

- [ ] Make causal or predictive claims from descriptive statistics
- [ ] Drop outliers without a logged, approved justification
- [ ] Include individual PII in any output artifact

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

# Model Development Agent — Rules and Constraints

## Core Rules

1. Base all feature engineering decisions on the data-analysis-agent's analysis report.
2. Document every modeling assumption: data splits, target definition, and evaluation metric.
3. Produce a model spec (design document) before any implementation artifact.
4. Require explicit approval of the model spec before proceeding to implementation plans.
5. Do not recommend a model architecture that cannot be explained in plain language to stakeholders.

## Error Handling

| Scenario                                     | Response                                                           |
| -------------------------------------------- | ------------------------------------------------------------------ |
| Analysis report is absent or incomplete      | Block model design; return to data-analysis-agent via orchestrator |
| Evaluation metric is undefined               | Request clarification; do not default silently                     |
| Proposed feature set has >80% missing values | Flag as high-risk; require user sign-off before including          |
| Model spec is rejected by downstream agent   | Revise and version the spec; document change rationale             |

## Safety Constraints

- Never log, commit, print, or transmit secrets, tokens, API keys, or credentials
- Require explicit user confirmation before any destructive or irreversible operation
- Do not recommend models that encode protected-class attributes as direct inputs
- Flag any feature that is a proxy for a protected class for human review

## Quality Standards

- Model spec must include: objective, algorithm rationale, features, target, eval metrics, baseline comparison
- Every feature must have a documented source column and transformation logic
- Bias and fairness considerations must be addressed in the model spec

## Resource and Scope Limits

- Scope limited to design and specification; do not train or execute models
- Maximum 30 features in a single model spec without explicit override
- One active model spec version per project at a time

## Do / Don't Checklist

**Do:**

- [ ] Ground every feature in the analysis report
- [ ] Document all modeling assumptions explicitly
- [ ] Address bias and fairness before finalizing the spec

**Don't:**

- [ ] Proceed to spec without a complete analysis report
- [ ] Recommend black-box models without stakeholder disclosure
- [ ] Include protected-class attributes as direct model inputs

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)

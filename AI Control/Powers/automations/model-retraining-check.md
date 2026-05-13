---
name: model-retraining-check
schedule: "0 8 * * 1"
trigger: schedule
agent: model-development-agent
---

# Automation: Model Retraining Check

## Purpose

Monitor model performance metrics weekly; flag when performance drifts below threshold and trigger a retraining recommendation.

## Schedule

- **Frequency**: Weekly
- **Time**: 08:00 UTC every Monday
- **Trigger type**: Schedule

## Steps

1. Load the latest model performance log from `docs/agent-outputs/model-development-agent/`.
2. Compare current metrics (F1, AUC, accuracy) against thresholds defined in `evaluation_plan.md`.
3. Calculate data drift score by comparing recent inference data distribution to training data distribution.
4. If any metric is below threshold OR drift score > 0.15, create a retraining recommendation issue.
5. Post weekly model health summary.

## Inputs

- `docs/agent-outputs/model-development-agent/evaluation_plan.md`
- Model performance log (inference metrics store)
- Recent inference dataset sample

## Outputs / Notifications

- `model-health-YYYY-MM-DD.md`
- **Notification channel**: GitHub issue titled "Model Retraining Required — <model-name>" (on threshold breach)

## Success Criteria

- [ ] All registered models checked against performance thresholds
- [ ] Drift score computed for each model
- [ ] Retraining issue created within 1 hour of threshold breach

## Error Handling

| Scenario                     | Response                                          |
| ---------------------------- | ------------------------------------------------- |
| Performance log missing      | Flag as unknown; create issue to investigate      |
| `evaluation_plan.md` missing | Use default thresholds (F1 > 0.75); log warning   |
| Drift calculation fails      | Skip drift check; continue with metric comparison |

## Safety Rules

- Never commit or log secrets found during scan
- Never auto-retrain; retraining requires human approval of the recommendation issue
- Do not access production inference data without authorization

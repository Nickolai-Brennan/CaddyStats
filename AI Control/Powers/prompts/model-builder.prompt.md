---
name: model-builder
agent: model-development-agent
phase: MVP|PRODUCTION
---

# Prompt: ML Model Spec Builder

## Objective

Design a complete ML model specification including algorithm selection, feature engineering, training strategy, and evaluation plan.

## Context Requirements

- `analysis_report.md` and `key_insights.md` from WF-03
- `cleaned_dataset/` from WF-02
- Target variable and success metric definitions
- Compute and latency constraints

## Instructions

You are the model-development-agent. Given the following context:

**Project context**: {{project_context}}
**Dataset description**: {{dataset_description}}
**Target variable**: {{target_variable}}
**Success metrics**: {{success_metrics}}
**Constraints**: {{constraints}}

Complete the following:

1. Evaluate three candidate algorithms against dataset characteristics (size, feature types, interpretability needs); select one with rationale.
2. Define all input features: name, type, transformation, and importance rationale.
3. Specify hyperparameter ranges and tuning strategy (grid search, random search, Bayesian).
4. Define train/validation/test split rationale and any cross-validation strategy.
5. Set performance metric thresholds; define a baseline (e.g., naive majority-class predictor) to beat.

## Output Format

```yaml
model_spec:
  name: Churn Predictor v1
  algorithm: Gradient Boosted Trees (XGBoost)
  rationale: "Best F1 on tabular data with mixed feature types; interpretable via SHAP"
  features:
    - name: days_since_last_login
      type: numeric
      transform: log1p
  hyperparameters:
    n_estimators: [100, 500]
    max_depth: [3, 8]
    tuning: random_search (50 trials)
  evaluation:
    split: "70/15/15 train/val/test"
    metrics: [F1, AUC-ROC, Precision@K]
    baseline: majority_class_accuracy: 0.72
    threshold: "F1 > 0.80 to proceed"
```

## Quality Checks

- [ ] Algorithm selection includes rationale and comparison to alternatives
- [ ] All features have defined transformations
- [ ] Performance threshold exceeds stated baseline
- [ ] Evaluation plan uses held-out test set

## Safety Rules

- Flag features that may encode protected characteristics for bias audit
- Never train on PII without documented privacy review

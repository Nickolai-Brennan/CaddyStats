# Workflow: 04-model-development

## Overview

Designs scoring or ML model architecture, engineers features, and produces an evaluation plan. Run after WF-03 to translate analytical insights into a concrete, reviewable model specification before any code is written.

## Phase

MVP · PRODUCTION

## Participants

| Agent                     | Role                                                |
| ------------------------- | --------------------------------------------------- |
| orchestrator-agent        | Coordinates workflow and gates spec approval        |
| model-development-agent   | Designs model architecture and feature engineering  |
| stats-visualization-agent | Validates model assumptions with visual diagnostics |

## Inputs

- `analysis_report.md` and `key_insights.md` from WF-03
- Target variable and success metric definitions from `project_brief.md`

## Outputs

- `model_spec.md`
- `feature_definitions.md`
- `evaluation_plan.md`

## Steps

### Step 1: Algorithm Selection (Agent: model-development-agent)

**Action**: Evaluate candidate algorithms against data characteristics and project constraints.
**Inputs**: `analysis_report.md`, target variable.
**Outputs**: Algorithm recommendation with rationale.
**Saves to**: `docs/agent-outputs/model-development-agent/`

### Step 2: Feature Engineering (Agent: model-development-agent)

**Action**: Define derived features, encodings, scaling strategies, and feature importance approach.
**Inputs**: `cleaned_dataset/`, algorithm recommendation.
**Outputs**: `feature_definitions.md`
**Saves to**: `docs/agent-outputs/model-development-agent/`

### Step 3: Visual Assumption Checks (Agent: stats-visualization-agent)

**Action**: Generate distribution plots, correlation heatmaps, and residual diagnostics.
**Inputs**: `cleaned_dataset/`, `feature_definitions.md`
**Outputs**: Diagnostic chart descriptions and pass/fail notes.
**Saves to**: `docs/agent-outputs/stats-visualization-agent/`

### Step 4: Model Spec (Agent: model-development-agent)

**Action**: Write complete model specification including hyperparameters, training strategy, and scoring formula.
**Inputs**: All prior step outputs.
**Outputs**: `model_spec.md`
**Saves to**: `docs/agent-outputs/model-development-agent/`

### Step 5: Evaluation Plan (Agent: model-development-agent)

**Action**: Define train/val/test split strategy, metrics, baseline, and acceptance thresholds.
**Inputs**: `model_spec.md`
**Outputs**: `evaluation_plan.md`
**Saves to**: `docs/agent-outputs/model-development-agent/`

## Success Criteria

- [ ] `model_spec.md` fully describes algorithm, features, and hyperparameters
- [ ] `evaluation_plan.md` includes at least two performance metrics with thresholds
- [ ] Orchestrator has approved the spec before implementation begins

## Error Handling

| Scenario                                      | Response                                                |
| --------------------------------------------- | ------------------------------------------------------- |
| No algorithm meets baseline threshold         | Return to data collection; expand dataset               |
| Feature importance yields zero-value features | Remove features; re-run evaluation plan                 |
| Assumption check failure                      | Document violation; select robust alternative algorithm |

## Safety Gates

- [ ] No secrets in any output files
- [ ] Confirmation required before destructive operations
- [ ] All outputs saved to correct output directory

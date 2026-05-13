# Workflow: 03-data-analysis

## Overview

Analyzes cleaned datasets to extract insights, compute descriptive and inferential statistics, and identify patterns or anomalies. Run after WF-02 to produce evidence-based findings that inform model development, dashboard design, and stakeholder decisions.

## Phase

PROTOTYPE · MVP · PRODUCTION

## Participants

| Agent               | Role                                                    |
| ------------------- | ------------------------------------------------------- |
| orchestrator-agent  | Coordinates analysis tasks and reviews findings         |
| data-analysis-agent | Executes all statistical analysis and pattern detection |

## Inputs

- `cleaned_dataset/` from WF-02
- Analysis goals from `project_brief.md`

## Outputs

- `analysis_report.md`
- `statistical_summary.md`
- `key_insights.md`

## Steps

### Step 1: Exploratory Analysis (Agent: data-analysis-agent)

**Action**: Compute distributions, correlations, and missing-value profiles across all features.
**Inputs**: `cleaned_dataset/`
**Outputs**: EDA tables and charts descriptions.
**Saves to**: `docs/agent-outputs/data-analysis-agent/`

### Step 2: Statistical Testing (Agent: data-analysis-agent)

**Action**: Run hypothesis tests, ANOVA, or chi-square as appropriate; record p-values and effect sizes.
**Inputs**: EDA output, analysis goals.
**Outputs**: `statistical_summary.md`
**Saves to**: `docs/agent-outputs/data-analysis-agent/`

### Step 3: Pattern and Anomaly Detection (Agent: data-analysis-agent)

**Action**: Identify trends, clusters, and anomalies; flag data quality issues.
**Inputs**: `cleaned_dataset/`, `statistical_summary.md`
**Outputs**: Pattern findings section.
**Saves to**: `docs/agent-outputs/data-analysis-agent/`

### Step 4: Key Insights Synthesis (Agent: data-analysis-agent)

**Action**: Summarize top 5–10 actionable insights with supporting evidence.
**Inputs**: All prior analysis outputs.
**Outputs**: `key_insights.md`
**Saves to**: `docs/agent-outputs/data-analysis-agent/`

### Step 5: Report Compilation (Agent: data-analysis-agent)

**Action**: Assemble full `analysis_report.md` combining all findings.
**Inputs**: All outputs from steps 1–4.
**Outputs**: `analysis_report.md`
**Saves to**: `docs/agent-outputs/data-analysis-agent/`

## Success Criteria

- [ ] All target variables analyzed with documented distributions
- [ ] At least one hypothesis tested per analysis goal
- [ ] `key_insights.md` contains actionable, evidence-backed findings

## Error Handling

| Scenario                               | Response                                                  |
| -------------------------------------- | --------------------------------------------------------- |
| Insufficient data for statistical test | Document limitation; use descriptive stats only           |
| Highly skewed distribution             | Apply log transform; document in report                   |
| Analysis goal ambiguous                | Request clarification from orchestrator before proceeding |

## Safety Gates

- [ ] No secrets in any output files
- [ ] Confirmation required before destructive operations
- [ ] All outputs saved to correct output directory

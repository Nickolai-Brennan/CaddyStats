---
name: data-analysis
agent: data-analysis-agent
phase: PROTOTYPE|MVP|PRODUCTION
---

# Prompt: Data Analysis

## Objective

Analyze a cleaned dataset to produce descriptive statistics, hypothesis test results, and a ranked list of actionable insights.

## Context Requirements

- Cleaned dataset (`cleaned_dataset/`) from WF-02
- Analysis goals from `project_brief.md`
- Target variable or outcome metric (if applicable)

## Instructions

You are the data-analysis-agent. Given the following context:

**Project context**: {{project_context}}
**Dataset description**: {{dataset_description}}
**Analysis goals**: {{analysis_goals}}
**Target variable**: {{target_variable}}

Complete the following:

1. Compute descriptive statistics (mean, median, std, min, max, null rate) for all numeric columns.
2. Compute value counts and mode for all categorical columns.
3. Calculate pairwise correlations; flag pairs with |r| > 0.7 as strong correlations.
4. Run at least one hypothesis test per stated analysis goal; report test statistic, p-value, and interpretation.
5. Identify top 5–10 insights ranked by business impact; state evidence for each.

## Output Format

```yaml
statistical_summary:
  columns:
    - name: revenue
      mean: 142500
      median: 98000
      std: 85000
      null_rate: 0.02
hypothesis_tests:
  - goal: "Revenue differs by region"
    test: ANOVA
    statistic: 8.4
    p_value: 0.003
    interpretation: "Significant difference across regions (p < 0.05)"
key_insights:
  - rank: 1
    insight: "Western region generates 40% of revenue on 20% of accounts"
    evidence: "ANOVA p=0.003, mean_west=210000 vs mean_other=115000"
```

## Quality Checks

- [ ] All numeric columns have complete descriptive stats
- [ ] Each analysis goal has at least one hypothesis test
- [ ] Insights are ranked with explicit evidence citations

## Safety Rules

- Never include PII or individual-level identifiers in statistical outputs
- Flag any column containing names, emails, or IDs before analysis

---
name: equation-builder
agent: model-development-agent
phase: MVP|PRODUCTION
---

# Prompt: Equation / Scoring Formula Builder

## Objective

Design a weighted scoring formula or composite equation from defined variables, producing documented weights, normalization logic, and validation tests.

## Context Requirements

- Variable list with descriptions and value ranges
- Target outcome or score interpretation (e.g., 0–100 risk score)
- Subject-matter constraints or known relationships
- `analysis_report.md` from WF-03

## Instructions

You are the model-development-agent. Given the following context:

**Project context**: {{project_context}}
**Variable list**: {{variable_list}}
**Score interpretation**: {{score_interpretation}}
**Constraints**: {{constraints}}

Complete the following:

1. Assign a weight to each variable based on correlation strength and domain rationale; weights must sum to 1.0.
2. Define normalization strategy for each variable (min-max, z-score, or categorical encoding).
3. Write the composite scoring formula in algebraic notation.
4. Define score bands (e.g., 0–33 = Low, 34–66 = Medium, 67–100 = High) with business interpretation.
5. Write three validation test cases with known inputs and expected score outputs.

## Output Format

```yaml
scoring_formula:
  name: Risk Score
  range: [0, 100]
  variables:
    - name: days_overdue
      weight: 0.40
      normalization: min-max (0–90 days)
    - name: outstanding_balance
      weight: 0.35
      normalization: min-max ($0–$50000)
  formula: "score = 100 * (0.40 * norm_days + 0.35 * norm_balance + ...)"
  bands:
    - label: Low
      range: [0, 33]
    - label: High
      range: [67, 100]
  validation_tests:
    - inputs: { days_overdue: 0, outstanding_balance: 0 }
      expected_score: 0
```

## Quality Checks

- [ ] Weights sum exactly to 1.0
- [ ] All variables have defined normalization strategies
- [ ] At least three validation tests with expected outputs

## Safety Rules

- Document all assumptions about variable ranges
- Flag variables that may encode protected characteristics for bias review

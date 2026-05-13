---
name: model-formula-skill
description: |
  Designs scoring models, weighted formulas, ranking systems, evaluation rubrics, and
  calculated metrics for business logic and data evaluation. Use this skill when a user
  needs a scoring formula, ranking algorithm, weighted grading system, evaluation rubric,
  priority score, lead scoring model, health score, risk score, or any calculated metric
  definition. Common phrasings: "design a scoring model for X", "create a ranking formula",
  "how should I weight these factors?", "build a lead score", "create an evaluation rubric",
  "design a risk score", "what's a good formula for scoring Y?", "help me rank these
  items". Do NOT use when the user wants to run or apply the formula to actual data (use
  notebook-query-skill), visualize scored results (use dashboard-design-skill), or train
  a machine learning model — this skill designs formulas and rubrics, not ML pipelines.
---

# Model Formula Skill

## Overview

The Model Formula Skill designs structured scoring models, weighted formulas, and
evaluation rubrics. It produces factor definitions, weight assignments, normalization
approaches, score ranges, thresholds, and interpretations. It applies to lead scoring,
health scores, risk models, priority queues, quality rubrics, and any system where
multiple signals must be combined into a single actionable score.

## When to Use / When NOT to Use

**Use this skill when:**

- User needs to combine multiple signals into a single composite score
- User wants to rank, prioritize, or tier items based on multiple criteria
- User needs an evaluation rubric with weighted criteria
- User wants transparent, explainable scoring logic (not a black-box ML model)
- User asks "how do I score / rank / prioritize X?"

**Do NOT use this skill when:**

- User wants to train a machine learning or statistical model (different capability)
- User wants to run/apply a formula against a dataset (use `notebook-query-skill`)
- User wants to visualize scored results (use `dashboard-design-skill`)
- The ask is purely about writing code to implement a formula (use code generation)

## Inputs

- **Goal**: What the score should predict, evaluate, or rank
- **Factors/signals**: List of input variables to include in the model
- **Output use**: How the score will be used (prioritization, segmentation, gating, etc.)
- **Constraints** _(optional)_: Score range (e.g., 0–100), data availability, update freq.
- **Examples** _(optional)_: Calibration examples — "this case should score high/low"

## Outputs

- **Factor table**: Each factor with description, data type, weight, and rationale
- **Formula definition**: Mathematical formula or weighted sum with normalization
- **Score interpretation**: Tier thresholds (e.g., 0–40 Low, 41–70 Medium, 71–100 High)
- **Calibration examples**: Worked examples showing score calculation for sample cases
- **Implementation notes**: How to compute the score in SQL or Python

## Workflow

1. Clarify the goal and output use — what decision does the score drive?
2. Enumerate all candidate factors; assess each for predictive relevance and data
   availability.
3. Assign weights using either expert judgment, stated priorities, or a scoring matrix.
4. Define normalization for each factor (0–1 range, z-score, percentile, etc.).
5. Write the composite formula; verify weights sum to 100% (or 1.0).
6. Define score tiers and thresholds with interpretations.
7. Validate with calibration examples; adjust weights if outputs seem wrong.
8. Document the formula in a table and provide SQL/Python implementation snippet.

**Stop conditions:**

- Stop and ask if the goal or intended use of the score is ambiguous.
- Stop and flag if proposed factors are likely proxies for protected characteristics
  (race, gender, age) — do not include without explicit bias review.

## Edge Cases

- **Too many factors**: Prune to the 5–10 most impactful; more factors ≠ better model.
- **Highly correlated factors**: Merge or choose one; double-counting inflates a signal.
- **Missing data for a factor**: Define a default or imputation rule; document it.
- **Score gaming risk**: Flag if the formula is transparent enough that users could
  manipulate it; recommend periodic recalibration.
- **Negative factors (penalties)**: Include explicitly; ensure total can't go below 0.

## Safety & Secrets

- Never log or commit data samples containing PII used for formula calibration.
- Flag any factor that could serve as a proxy for a protected characteristic.
- Warn if score thresholds will be used to make decisions affecting people (hiring,
  credit, healthcare) — recommend fairness auditing and human review.
- Document all assumptions transparently; scores without documented assumptions are
  a governance risk.

## Examples

### Example 1: Lead scoring model

**User prompt:** "Design a lead scoring model for a B2B SaaS company. Signals we have:
company size, job title, website visits, email opens, demo requests, industry fit."

**Expected output:**
| Factor | Weight | Normalization | Rationale |
|---|---|---|---|
| Demo request | 30% | Binary (0 or 1 × 30) | Strongest buying signal |
| Job title fit | 25% | Tier (C-suite=1, VP=0.8, Manager=0.5, other=0.2) | Decision authority |
| Company size | 20% | Bracket-based (ICP range = 1.0, adjacent = 0.5, out = 0) | ICP fit |
| Industry fit | 15% | Binary | Target vertical |
| Email engagement | 7% | Opens in last 30d / 10, capped at 1.0 | Intent signal |
| Website visits | 3% | Visits in last 14d / 5, capped at 1.0 | Intent signal |

Score = Σ(factor_value × weight × 100). Tiers: 0–30 Cold, 31–60 Warm, 61–85 Hot, 86–100 Sales-ready.

### Example 2: Content quality rubric

**User prompt:** "I need a rubric to evaluate blog post quality for our content team.
Score from 0–10."

**Expected output:**
Five criteria: Accuracy (25%), Clarity (20%), SEO/keyword coverage (20%), Depth (20%),
Engagement/readability (15%). Each criterion scored 0–10 by reviewer. Composite =
weighted average × 10. Tier: <5 Needs major revision, 5–7 Minor edits, 8–10 Publish.
Scoring guide for each criterion with examples of 1, 5, and 10 scores.

## Testing / Evals

See `evals/evals.json` for test prompts. Run 2–3 prompts and compare outputs against
`expected_output` descriptions.

## References

- [Data Pipeline Guide](../../references/data-pipeline-guide.md)
- [Data Rules](../../instructions/data-rules.md)
- [Notebook Query Skill](../notebook-query-skill/SKILL.md)
- [Skill Registry](../skill-registry.md)

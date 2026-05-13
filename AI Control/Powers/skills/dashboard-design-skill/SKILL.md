---
name: dashboard-design-skill
description: |
  Designs analytics and operational dashboards including layout, chart types, KPI cards,
  filters, drill-downs, and data visualizations. Use this skill when a user asks to design
  a dashboard, create data visualizations, build a metrics view, display charts or graphs,
  plan a reporting interface, or structure an analytics page. Common phrasings: "design a
  dashboard for X", "what charts should I use?", "help me visualize this data", "create a
  metrics view", "build a reporting page", "I need a KPI dashboard", "show me how to
  display this data visually". Do NOT use when the user wants to write the actual frontend
  code for a dashboard (use a code-generation skill), query the underlying data (use
  notebook-query-skill), or set up a BI tool like Tableau or Looker.
---

# Dashboard Design Skill

## Overview

The Dashboard Design Skill produces structured dashboard designs: layout plans, chart-type
recommendations, KPI card definitions, filter/drill-down patterns, and data visualization
specifications. It helps teams decide what to show, how to show it, and how to organize
the information hierarchy before implementation. Output is documentation and design specs,
not frontend code.

## When to Use / When NOT to Use

**Use this skill when:**

- User needs to plan what a dashboard should contain and how to lay it out
- User wants recommendations on chart types for specific data types or questions
- User needs KPI definitions, metric calculations, or target thresholds specified
- User wants to document dashboard requirements for a developer or BI tool config
- User asks "what's the best way to display this data?"

**Do NOT use this skill when:**

- User wants the actual React/HTML/CSS dashboard code written
- User wants to query or transform the underlying data (use `notebook-query-skill`)
- User needs help configuring a specific BI tool (Tableau, Looker, Power BI specifics)
- The request is about alerting or monitoring infrastructure (not visualization design)

## Inputs

- **Purpose/audience**: Who will use the dashboard and what decisions it supports
- **Metrics/data**: The KPIs, metrics, or data fields to display
- **Data source** _(optional)_: Database, API, spreadsheet — affects refresh and filter design
- **Constraints** _(optional)_: Tool (e.g., Grafana, custom React), viewport, refresh rate

## Outputs

- **Layout plan**: Named sections, grid layout description, information hierarchy
- **KPI card specs**: Metric name, formula/definition, display format, target, color coding
- **Chart specs**: Chart type, axes, series, filters, drill-down behavior for each panel
- **Filter & interaction design**: Global filters, cross-filtering, date range pickers
- **Design rationale**: Why each visualization choice was made

## Workflow

1. Clarify the audience and the primary question the dashboard must answer.
2. Inventory all metrics and data fields; categorize as KPIs vs. supporting metrics.
3. Determine the information hierarchy: hero KPIs at top, trends in middle, detail at bottom.
4. Select chart types appropriate to each data type and analytical question.
5. Define filters, time controls, and drill-down paths.
6. Document KPI formulas, thresholds, and color conventions.
7. Produce layout plan and chart specs as structured documentation.

**Stop conditions:**

- Stop and ask if the primary decision the dashboard supports is unclear.
- Stop and ask if data availability for a proposed metric is unknown.

## Edge Cases

- **Too many metrics**: Apply the "3-click rule" — prioritize; move secondary metrics to
  a detail view or separate tab.
- **Real-time vs. batch data**: Clarify refresh rate; real-time changes chart type choices
  (avoid complex animated charts for high-frequency updates).
- **No defined audience**: Ask; a CEO dashboard vs. an ops engineer dashboard differ
  substantially in abstraction level.
- **Mixed data granularities**: Flag and design separate panels or aggregation layers.

## Safety & Secrets

- Never log, commit, or display connection strings, API keys, or database credentials.
- Use placeholder values for any data source connection details in design docs.
- Warn if proposed visualizations may inadvertently expose PII or sensitive business data
  to a broad audience; recommend access controls.

## Examples

### Example 1: SaaS product metrics dashboard

**User prompt:** "Design a dashboard for our SaaS product. I want to track MRR, churn,
active users, and feature usage for our product team."

**Expected output:**

- **Hero KPIs**: MRR (bar/trend), MRR growth %, Churn rate, Active Users (30d)
- **Trends section**: MRR over time (line chart, 12mo), Churn over time, DAU/MAU ratio
- **Feature usage**: Top 10 features by event count (horizontal bar), feature adoption
  funnel (funnel chart)
- **Filters**: Date range, plan tier, cohort
- **KPI definitions**: MRR = sum of active subscription MRR; Churn = churned MRR / prior
  month MRR

### Example 2: DevOps incident response dashboard

**User prompt:** "I need an ops dashboard to monitor system health — latency, error rates,
deployments, and on-call incidents."

**Expected output:**

- **Status row**: Service health indicators (green/yellow/red status cards)
- **SLO tracking**: p50/p95/p99 latency (line charts), error rate % (line), SLO burn rate
- **Incident panel**: Open incidents list, MTTD, MTTR trend
- **Deployment markers**: Overlaid on latency/error charts to correlate deploys with issues
- **Filters**: Service name, environment, time window

## Testing / Evals

See `evals/evals.json` for test prompts. Run 2–3 prompts and compare outputs against
`expected_output` descriptions.

## References

- [Dashboard Design Guide](../../references/dashboard-design-guide.md)
- [Frontend Rules](../../instructions/frontend-rules.md)
- [HTML/CSS Style Guide](../../instructions/html-css-style-color-guide.instructions.md)
- [Skill Registry](../skill-registry.md)

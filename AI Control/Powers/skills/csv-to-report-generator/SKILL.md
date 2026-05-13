---
name: csv-to-report-generator
description: |
  Transforms CSV data into structured, readable reports with summaries, key metrics,
  tables, and narrative insights. Use this skill whenever a user says "turn this CSV
  into a report", "generate a report from this data", "summarize this spreadsheet",
  "create a data report from these numbers", "write a business report from this CSV",
  "analyze this data and produce a report", or "convert this data into something
  readable". Also activate when a user shares tabular data and wants it turned into
  a polished document. Do NOT use for building interactive dashboards (use
  dashboard-design-skill) or writing full data cleaning pipelines.
---

# CSV to Report Generator

Turn raw CSV data into a clear, actionable report — with summary statistics, key
findings, formatted tables, and plain-language narrative.

## When to Use

- You have tabular data and need a readable document for stakeholders
- Generating a one-time report from an export (Stripe, Google Analytics, Airtable, etc.)
- Turning a data dump into a weekly/monthly report
- Creating a summary for an executive who won't look at raw data

## When NOT to Use

- Building interactive dashboards with charts (use `dashboard-design-skill`)
- Ongoing automated reporting pipelines (different engineering task)
- Complex statistical analysis (use a data science tool)

---

## Workflow

### Step 1 — Receive the Data

Accept:

- Pasted CSV text (first 20 rows is usually enough for structure analysis)
- Column names and a description of the dataset
- A file path (if file access is available)

Ask:

1. What does this data represent?
2. Who is the audience? (executive, analyst, customer, internal team)
3. What's the reporting period? (daily, weekly, monthly, ad hoc)
4. Are there specific metrics or questions to highlight?

### Step 2 — Profile the Data

For each column, identify:

- Data type (numeric, categorical, date, text)
- Key statistics for numeric columns: min, max, mean, median, total
- Value distribution for categorical columns: top 5 values and counts
- Completeness: % non-null

### Step 3 — Generate Insights

Look for:

- **Top performers:** Highest values, most frequent categories
- **Outliers:** Values significantly above or below average
- **Trends:** If date column exists, directional change over time
- **Comparisons:** Group-by summaries (e.g., by region, product, or team)

### Step 4 — Structure the Report

```markdown
# [Report Title]

**Period:** [Date range] | **Generated:** [Date] | **Source:** [Dataset name]

---

## Executive Summary

[3–5 sentence narrative summary of the most important findings]

## Key Metrics

| Metric              | Value  | vs. Previous Period |
| ------------------- | ------ | ------------------- |
| Total Revenue       | $X,XXX | +12%                |
| Total Orders        | N      | -3%                 |
| Average Order Value | $XX    | +15%                |

## Top [Category] by [Metric]

| Rank | [Category] | [Metric] | % of Total |
| ---- | ---------- | -------- | ---------- |
| 1    | [name]     | [value]  | XX%        |

...

## [Section — e.g., "Regional Breakdown"]

[Table or narrative]

## Notable Findings

- **[Finding 1]:** [1–2 sentence explanation and implication]
- **[Finding 2]:** [1–2 sentence explanation and implication]

## Data Notes

- Source: [filename / system]
- Records analyzed: N
- Missing data: [Any caveats]
```

### Step 5 — Tailor to Audience

| Audience        | Style adjustments                                                 |
| --------------- | ----------------------------------------------------------------- |
| Executive       | Lead with money/growth metrics, minimize tables, add implications |
| Analyst         | More data tables, include methodology notes                       |
| Customer-facing | Only relevant metrics, no internal identifiers, softer language   |
| Internal team   | More detail, include raw counts alongside percentages             |

---

## Output Format

Primary: Markdown report (copy into Notion, Confluence, or email).

Optional outputs:

- **Email format:** Subject line + 3-paragraph prose + bulleted highlights
- **Slide outline:** Title slide → key metrics → top findings → next steps

---

## Safety & Confirmation

- Never share PII from the dataset (names, emails, phone numbers) in the report output.
- Flag any revenue or user count numbers before including — confirm the user wants them visible.
- Label estimates and inferences clearly: "Based on available data..." vs. confirmed facts.

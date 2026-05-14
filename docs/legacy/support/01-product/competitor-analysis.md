# Competitor Analysis

Last updated: 2026-05-12
Owner: Product
Status: Working draft

## Purpose

Define the competitive landscape for Caddy Stats, identify whitespace, and translate insights into execution priorities that improve subscription conversion, retention, and data differentiation.

## Competitive Set

### Direct Competitors

- Golf betting analysis sites with pick content and rankings
- DFS-focused golf research tools with projections and ownership insights
- Premium golf data dashboards targeting advanced bettors

### Indirect Competitors

- General sportsbook apps with basic golf markets
- Free social-media handicappers and newsletters
- Legacy golf stat sites with broad but shallow data

## Evaluation Framework

Each competitor category is scored from 1 (weak) to 5 (strong) using the same rubric.

| Capability               | Why it matters                 | Typical competitor level | Caddy Stats target |
| ------------------------ | ------------------------------ | ------------------------ | ------------------ |
| Data depth               | Drives trust and repeat usage  | 2-4                      | 5                  |
| Projection transparency  | Increases willingness to pay   | 1-3                      | 5                  |
| Betting workflow quality | Converts research into action  | 2-4                      | 5                  |
| DFS utility              | Captures serious fantasy users | 2-5                      | 4                  |
| Editorial scalability    | Supports SEO growth            | 2-4                      | 5                  |
| Personalization          | Improves retention             | 1-3                      | 4                  |
| Mobile UX                | Impacts weekly active usage    | 2-4                      | 5                  |
| Pricing clarity          | Reduces conversion friction    | 2-4                      | 5                  |

## Category-Level Findings

### 1) Pick-Centric Betting Content Sites

Strengths:

- High publishing frequency
- Simple narratives users can consume quickly

Weaknesses:

- Limited model explainability
- Low signal-to-noise and frequent generic claims
- Weak separation between opinion and data

Opportunity for Caddy Stats:

- Publish recommendation context with explicit model factors
- Show confidence bands and uncertainty ranges
- Make all premium recommendations auditable by data source and model version

### 2) DFS Research Platforms

Strengths:

- Strong data tooling and filters
- Better power-user retention than generic betting blogs

Weaknesses:

- Often optimized for DFS power users, less usable for golf bettors
- Paywalls can be broad, making free discovery weak

Opportunity for Caddy Stats:

- Unify betting and DFS in one player/tournament workflow
- Provide dual views: bettor-first and DFS-first
- Use course-fit + form + market context in one screen

### 3) Sportsbook Native Research Surfaces

Strengths:

- Transaction proximity (users can bet immediately)
- Strong mobile presence

Weaknesses:

- Limited explanatory analytics
- Incentivized to maximize handle, not user decision quality

Opportunity for Caddy Stats:

- Position as independent decision support before users place bets
- Emphasize transparent assumptions and non-promissory language

### 4) Legacy Golf Statistics Portals

Strengths:

- Long historical archives
- Established search presence

Weaknesses:

- Fragmented UX
- Weak workflow for converting stats into actionable betting/DFS decisions

Opportunity for Caddy Stats:

- Build guided workflows from data to actionable rankings
- Package advanced metrics into understandable composites

## Whitespace and Differentiation

Priority whitespace where Caddy Stats can lead:

1. Explainable golf projections:
   Publish model component contributions and confidence ranges, not just a rank.

2. Unified workflow:
   One research path for outrights, placement markets, matchups, and DFS decisions.

3. Editorial + analytics coupling:
   Auto-ground AI/editorial workflows to verified stats and model outputs.

4. Decision velocity:
   Reduce time from page open to shortlist with clear filters, saved presets, and comparison views.

5. Trust instrumentation:
   Track hit quality, calibration, and retrospective performance by model version.

## Strategic Implications

### Product

- Prioritize projection explainability before adding broad feature volume
- Gate high-value features by outcome utility, not by arbitrary UI areas
- Design tournament pages as decision systems, not article pages with tables

### Content

- Create high-intent templates: field preview, outrights, placements, matchups, DFS pivots
- Include structured links across tournament, course, and player entities
- Avoid unsupported claims or fabricated confidence language

### Pricing

- Keep free tier useful but incomplete for final decision confidence
- Reserve premium for model explainability depth, advanced filters, and personalized alerts
- Test annual plan incentives around PGA major cycles and season bundles

## Risks

- Commoditization risk if projections are opaque or generic
- Churn risk if premium users cannot attribute value to specific tools
- SEO risk if content quality is not materially better than commodity betting copy

## Validation Plan

Use these leading indicators to confirm differentiation is working:

- Time-to-shortlist metric decreases for premium users
- Premium pages show higher return session rate than free pages
- Users engaging with explainability modules convert at higher rates than users who do not
- Churn is lower among users with saved player/tournament presets

## Next Actions

1. Build a competitor scorecard worksheet in analytics tooling and update monthly.
2. Add a "Why this projection" module to tournament and player premium views.
3. Define and ship trust metrics dashboard (calibration, performance by model version).
4. Add content QA checks for unsupported claims before publishing.

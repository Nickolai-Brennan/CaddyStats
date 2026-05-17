# Typography System (DS-4)

## Purpose

Define the canonical font stack, scale, and numeric rules for Caddy Stats so every public and dashboard surface renders consistent editorial and analytical typography.

## 1) Font Setup

Required font stacks:

- **Primary sans**: Inter, then system sans fallbacks
- **Mono numeric**: IBM Plex Mono, then system monospace fallbacks

Implementation rules:

- Inter is the default reading and interface font.
- Mono is reserved for metrics, odds, percentages, and dense analytical values.
- Fallback stacks must preserve similar x-height and readability when hosted fonts are unavailable.

## 2) Scale

### Display

- **Display XL**: hero headlines and major landing statements
- **Display LG**: section-leading statements and page intros

### Headings

- **H1–H6**: descending editorial and dashboard section hierarchy

### Body

- **Large**: lead paragraphs and highlighted narrative blocks
- **Standard**: default body copy
- **Small**: metadata, help text, and supporting notes

### Caption

- **Caption MD / SM**: eyebrow labels, table context, and microcopy

Implementation rules:

- Scale must be responsive and preserve readable hierarchy from mobile through desktop.
- Headings use tight tracking with stronger weight than body copy.
- Body copy must remain readable at a 16px-equivalent default minimum.

## 3) Metrics Rules

- Enable **tabular numbers** for analytical values.
- Use mono numeric styling for KPIs, percentages, and odds.
- Keep decimal-heavy values aligned consistently in tables and stat surfaces.
- Positive betting odds render with a `+` prefix; negative odds keep the minus sign.
- Percentages default to one decimal place unless the surface requires different precision.

## 4) Frontend Mapping

DS-4 is implemented with:

- `/apps/web/src/styles/typography.ts`
- `/apps/web/src/index.css`

These provide:

- font stacks and responsive scale tokens
- global typography variable application at app startup
- numeric formatting helpers for percentages and odds
- shared classes for display, body, caption, and metric text

## Validation

- Typography is applied globally through the web entrypoint.
- Responsive typography remains active across mobile, tablet, and desktop breakpoints.
- Numeric surfaces use tabular mono styling for analytics readability.

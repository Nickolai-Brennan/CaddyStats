# Design System Principles

## Purpose

Set implementation-oriented principles for Caddy Stats UI decisions across golf analytics, projections, and betting intelligence surfaces.

## 1) Analytical-First

- Prioritize data interpretation over decorative UI.
- Every primary screen should answer: **what happened, why it matters, and what action is next**.
- Prefer stable, comparable metrics over novelty visual treatment.

Implementation guidance:

- lead with key metrics and deltas before narrative content
- keep units and time windows explicit
- avoid visual patterns that hide uncertainty or sample size

## 2) Premium Dashboard Experience

- Premium feel comes from clarity, speed, and trust, not visual excess.
- Keep interactions responsive and dense without feeling cramped.
- Emphasize composable cards, consistent spacing, and predictable controls.

Implementation guidance:

- use consistent panel structure for summary -> detail -> action flow
- reserve high-emphasis styles for critical status and top-value signals
- avoid one-off component styles that break dashboard rhythm

## 3) Density Rules

- Support high-information views while preserving scanability.
- Default to compact-but-readable patterns for analytics contexts.
- Increase whitespace only when it materially improves comprehension.

Implementation guidance:

- use consistent spacing tiers for metric groups, sections, and page regions
- preserve readable row height in data-heavy tables
- avoid mixing compact and relaxed spacing in the same comparison view

## 4) Mobile-First Rules

- Design for smallest viewport first, then scale up.
- Keep critical metrics and actions visible without deep navigation.
- Preserve analytical meaning across breakpoints.

Implementation guidance:

- stack content by decision priority (core metrics first)
- convert dense controls into progressive disclosure patterns
- ensure touch targets and scroll behavior support quick field-side checks

## 5) Data Readability Rules

- Numbers are product content, not decoration.
- Readability must hold under varying values, signs, and units.
- Comparative context should be obvious at a glance.

Implementation guidance:

- align numeric values for comparison-heavy layouts
- keep labels short and unambiguous
- always show data state (live, stale, projected, historical) when relevant

## 6) Scan Hierarchy Standards

- Users must identify top outcomes within seconds.
- Hierarchy should guide scan path: headline metric -> supporting metrics -> explanatory detail -> actions.
- Avoid equal visual weight across all elements.

Implementation guidance:

- enforce clear typographic and contrast hierarchy
- group related metrics by decision use, not by raw data source
- place primary actions where the user finishes interpretation, not where layout convenience suggests

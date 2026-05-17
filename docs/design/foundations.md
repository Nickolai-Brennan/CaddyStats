# Design Foundations

## Purpose

Define practical UX and layout standards that make Caddy Stats dashboards fast to read, trustworthy, and action-oriented.

## 1) Dashboard Readability Rules

- Every dashboard view should expose a clear top-line summary before deep analysis blocks.
- Related metrics should be grouped by decision intent (form, fit, risk, value), not by database origin.
- Labels, units, and comparative windows must remain visible in dense layouts.

Implementation checklist:

- top summary strip includes key metrics and confidence/risk context
- section headings describe analytical purpose
- metric cards avoid mixed unit formats inside the same group

## 2) Decision Hierarchy

Order content from highest decision value to lowest:

1. **Outcome signal** (what changed / who leads / where edge exists)
2. **Evidence signal** (supporting stats and trend context)
3. **Risk signal** (volatility, uncertainty, missing context)
4. **Action path** (next drill-down, filter, compare, or export action)

Implementation rules:

- place actions near the conclusion of a decision sequence
- avoid forcing users into modal/detail flows before summary context is available
- keep critical decisions visible without horizontal scrolling on core breakpoints

## 3) Interaction Cost Rules

- Minimize clicks/taps needed to answer common analytical questions.
- Each interaction should have a clear value gain (new context, narrower field, or better confidence).
- Avoid interaction patterns that reset or hide user context unexpectedly.

Implementation rules:

- preserve filters/sort states during navigation where possible
- keep defaults opinionated and useful for first view
- require confirmation only for destructive/high-impact actions

## 4) Visual Noise Reduction Standards

- Reduce non-informational decoration in data-heavy views.
- Use contrast and accent color intentionally for status and priority.
- Avoid competing emphasis signals in the same viewport region.

Implementation rules:

- limit simultaneous highlighted states in a single panel
- prefer neutral containers with focused emphasis markers
- remove redundant icons/text when labels already communicate meaning

## 5) Empty State Principles

Empty states must help users recover quickly and maintain trust.

Required elements:

- clear reason for empty result (no data, filters too narrow, source unavailable)
- next action (reset filters, widen time range, connect source, retry)
- preserved context (current filters/time window) when possible

Implementation rules:

- empty states should be specific to analytics context (player/tournament/market)
- avoid generic messaging that looks like system failure unless it is an error
- separate “no data yet” from “data unavailable/error” states

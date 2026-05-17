# Design System ADR Template

Use this template for durable design-system decisions (tokens, component APIs, interaction standards, accessibility baselines, and migration policy).

```md
# DS-ADR-###: Short Decision Title

Date: YYYY-MM-DD
Status: Draft | In Review | Approved | Deprecated | Superseded by DS-ADR-###
Owners: Design System Owner, Frontend Owner, Figma Owner, Documentation Owner, Accessibility Owner

## Context

What product, UX, or implementation problem requires a durable decision?

## Decision

What is being decided now? Be explicit about boundaries and non-goals.

## Impacts

### Affected repository areas

- docs:
- packages:
- apps:

### Consumer impact

Who must migrate or update usage?

## Validation Requirements

- Type/lint checks:
- Accessibility checks:
- Visual/design parity checks:
- Documentation updates:

## Alternatives Considered

What options were evaluated and why were they not selected?

## Consequences

### Positive

What improves because of this decision?

### Trade-offs

What complexity, constraints, or migration cost are introduced?

### Mitigations

How are risks reduced or staged?

## Rollout Plan

1. Step 1:
2. Step 2:
3. Step 3:

## Deprecation or Compatibility Notes

If replacing existing behavior, define coexistence and removal timelines.
```

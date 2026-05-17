# Design System Governance (Caddy Stats)

## Purpose

Define ownership, decision flow, and approval rules for evolving the Caddy Stats design system across `apps/web`, `packages/ui`, and `packages/tokens`.

## Scope

This governance model applies to:

- token architecture in `packages/tokens`
- reusable primitives and UI patterns in `packages/ui`
- frontend adoption in `apps/web`
- design-system documentation in `docs/design/`

## Ownership Roles

| Role | Primary responsibility | Required decisions |
| --- | --- | --- |
| Design System Owner | Sets design-system roadmap and release direction. | Approves component lifecycle transitions to `Approved` or `Deprecated`. |
| Frontend Owner | Ensures React/Tailwind implementation quality across the monorepo. | Approves technical feasibility, API shape, and integration readiness. |
| Figma Owner | Maintains design source-of-truth parity with implementation tokens/components. | Confirms design parity and variant coverage before approval. |
| Documentation Owner | Maintains canonical guidance and examples in `docs/design/`. | Approves documentation completeness and migration notes. |
| Accessibility Owner | Enforces WCAG-focused behavior and accessibility acceptance criteria. | Approves accessibility validation before production release. |

## Lifecycle Statuses

All design-system assets (tokens, primitives, patterns, and component docs) must use one of these statuses:

- **Draft**: Actively being defined or implemented; not available for broad reuse.
- **In Review**: Candidate state after implementation and required validation checks complete.
- **Approved**: Ready for default adoption in `apps/web` and future package consumers.
- **Deprecated**: Kept temporarily for compatibility; replacement path is documented.

## RFC and Change Request Process

Use this process for any material design-system change:

1. **Open RFC/change request**
   - Create a proposal in the active planning/issue workflow.
   - Include problem statement, impacted files, rollout path, and migration impact.
2. **Attach design-system ADR when decision is durable**
   - Use `docs/design/adr-template.md`.
   - Store accepted records in the repository ADR location referenced by governance.
3. **Implementation phase**
   - Land token/component/doc updates in a scoped PR.
   - Keep changes mapped to concrete artifacts (docs, package files, app usage).
4. **Cross-owner review**
   - Frontend Owner + Figma Owner + Accessibility Owner must review.
   - Documentation Owner verifies docs and adoption notes.
5. **Decision and status update**
   - Design System Owner marks status transition (`Draft` -> `In Review` -> `Approved`).
   - If replacing existing assets, mark old assets as `Deprecated` with timeline.

## Component Approval Workflow

Before a component or token set can be marked `Approved`, the PR must include:

1. Clear API and usage definition.
2. Documentation updates under `docs/design/` (or linked package README when applicable).
3. Validation evidence:
   - lint/type checks for changed workspaces
   - tests relevant to changed behavior (if test harness exists)
   - accessibility acceptance notes for interactive components
4. Migration notes if existing consumers are affected.

A component remains `In Review` until all required owners sign off.

## Release and Deprecation Policy

- Approved components/tokens are the only defaults for new implementation work.
- Deprecations must include:
  - replacement reference
  - migration approach
  - removal target milestone or date
- Deprecated assets should not receive new feature work.

## Monorepo Evolution Rules

- Token-first changes: update `packages/tokens` before broad UI restyling.
- Shared primitives next: update `packages/ui` to consume tokens.
- App adoption last: roll into `apps/web` feature-by-feature with minimal churn.
- Keep design system changes incremental and traceable through docs + PR history.

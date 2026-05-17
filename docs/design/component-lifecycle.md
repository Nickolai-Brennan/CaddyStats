# Design System Component Lifecycle

## Purpose

Define how Caddy Stats design-system assets progress from proposal to production use and eventual retirement.

## Applies To

- tokens in `packages/tokens`
- primitives and composites in `packages/ui`
- documented patterns consumed by `apps/web`

## Lifecycle States

| Status     | Entry criteria                                                 | Exit criteria                                                      |
| ---------- | -------------------------------------------------------------- | ------------------------------------------------------------------ |
| Draft      | Initial proposal or implementation in progress.                | Required docs and baseline implementation exist, ready for review. |
| In Review  | Candidate is implemented and submitted for cross-owner review. | Review approvals + validation complete.                            |
| Approved   | Candidate is accepted for production use.                      | Replaced or sunset, then moved to Deprecated.                      |
| Deprecated | Candidate has replacement and migration guidance.              | Fully removed after migration window closes.                       |

## State Transition Rules

### Draft -> In Review

Required:

- defined purpose and usage contract
- initial docs in `docs/design/` or package-level usage docs
- implementation available for review in repository

### In Review -> Approved

Required:

- Design System Owner approval
- Frontend Owner approval
- Accessibility Owner signoff for interactive behavior
- Figma Owner parity confirmation for intended states/variants
- Documentation Owner confirmation of complete guidance

Validation required before approval:

- lint/type checks for touched packages/apps
- tests relevant to changed behavior (where test coverage exists)
- accessibility checks for keyboard/focus/semantics on interactive components
- examples showing expected usage patterns

### Approved -> Deprecated

Required:

- replacement defined and documented
- migration guidance published
- deprecation timeline announced in documentation/changelog

## Documentation Expectations by Status

- **Draft**: problem statement, intended API, early usage constraints
- **In Review**: complete usage docs, validation notes, known limitations
- **Approved**: canonical usage guidance, best practices, anti-patterns, migration notes if relevant
- **Deprecated**: replacement mapping, deadline/timeline, removal plan

## Story and Testing Expectations

- Any reusable component should include at least one usage example in documentation.
- Visual/interaction expectations must be explicit enough to support future story/test coverage.
- For interactive components, include expected keyboard behavior and focus model in docs.
- Test coverage should target component contracts (rendering states, interaction behavior, accessibility signals) where infrastructure exists.

## Deprecation Policy

1. Mark status as `Deprecated` in relevant docs.
2. Document replacement and migration steps.
3. Avoid adding new features to deprecated components.
4. Remove only after:
   - migration window has passed
   - consumers are updated
   - removal is documented in changelog/release notes

This policy keeps design-system evolution predictable while protecting analytics dashboard stability across Caddy Stats surfaces.

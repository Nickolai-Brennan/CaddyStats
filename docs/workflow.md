# Caddy Stats Workflow

Last Updated: 2026-05-12

## 1. Operating Workflow

All work follows an architecture-first and data-first delivery model:

1. Align scope to documented product goals and constraints.
2. Confirm phase ordering against build-order dependencies.
3. Define/update relevant documentation and ADRs first.
4. Implement with clear boundaries (database, backend, frontend, editor, automation).
5. Validate through deterministic checks.
6. Update changelog and decision references.

## 2. Build Order (Mandatory)

1. Documentation
2. Folder Setup
3. Database
4. Backend
5. Frontend
6. Editor
7. Templates
8. SEO
9. AI
10. Hosting
11. Admin
12. Integrations
13. Scale
14. Business

## 3. Documentation Workflow

For every major task:
- verify whether existing docs already cover the decision
- update the closest relevant document first
- add/update ADRs for architectural-level choices
- add a changelog entry with date and summary

Core locations:
- root product docs: `docs/00-root/`
- product strategy docs: `docs/01-product/`
- architecture decisions: `docs/architectural-decision-records/`
- changelog: `docs/changelog.md`

## 4. Delivery Workflow by Phase

Each phase should define:
- objective
- scoped deliverables
- acceptance criteria
- dependencies on previous phases
- validation checks

No dependent phase should proceed without required upstream outputs.

## 5. Quality and Governance Checks

Before considering work complete:
- scope matches product and architecture constraints
- no unsupported data claims are introduced
- security expectations are preserved (auth, RBAC, sanitization, secret handling)
- documentation reflects the current state
- changes are logged in the changelog

## 6. Escalation Rule

If a task appears to violate build order or architecture constraints:
1. stop implementation,
2. document the dependency conflict,
3. resolve ordering or architecture decision first.

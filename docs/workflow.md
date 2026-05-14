# Caddy Stats Workflow

Last Updated: 2026-05-14

## Purpose

Define the repository-wide delivery workflow for documentation, planning, implementation, validation, and change logging.

## 1. Operating Model

All material work follows an architecture-first and data-first sequence:

1. align scope to documented product goals and constraints
2. confirm phase ordering against build-order dependencies
3. update the closest canonical documentation and any required ADRs first
4. implement within approved database, API, frontend, editorial, and operational boundaries
5. validate with deterministic checks where available
6. update the changelog and linked references before closing the work

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

## 3. Documentation Routing Rules

### Canonical documentation

Use canonical docs under `docs/` when the task changes current product, architecture, governance, security, or operating expectations.

Primary canonical locations:

- `docs/core/`
- `docs/product/`
- `docs/architecture/`
- `docs/governance/`
- `docs/security/`
- `docs/data/`
- `docs/compliance/`
- `docs/roadmap/`
- `docs/workflow.md`
- `docs/changelog.md`

### Planning artifacts

Use `docs/planning/` for task sequencing, rollout planning, and phase checklists. Planning docs may describe intended execution order, but they do not replace canonical architecture or governance docs.

### Legacy archive

Use `docs/legacy/support/` only for historical context, migration provenance, or archived source material. If a legacy doc is still needed for current guidance, migrate or merge it into a canonical location and update references.

## 4. Documentation Workflow

For every material task:

- verify whether a canonical doc already covers the change
- update the closest canonical file first
- check nearby docs for contradictions or stale path references
- add or update an ADR for architecture-level changes
- record the change in `docs/changelog.md`
- note any unresolved overlap in `docs/governance/DOCUMENTATION_CONSOLIDATION_AUDIT.md`

## 5. Delivery Expectations by Phase

Each phase should define:

- objective
- scoped deliverables
- acceptance criteria
- upstream dependencies
- validation checks
- documentation updates required for handoff

No dependent phase should proceed while blocking upstream outputs remain unresolved.

## 6. Quality and Governance Checks

Before considering work complete:

- scope still matches product and architecture constraints
- no unsupported data claims are introduced
- security expectations remain intact
- documentation reflects the current repository state
- duplicate or contradictory docs are either resolved or explicitly archived
- changelog and ADR references are current

## 7. Escalation Rule

If a task appears to violate build order or architecture constraints:

1. stop implementation
2. document the dependency conflict
3. resolve the ordering or decision gap first
4. resume only after the governing doc or ADR is updated

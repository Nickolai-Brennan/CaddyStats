# Documentation Index

## Purpose
This `docs/` directory is the canonical home for implementation-facing project documentation for CaddyStats. It translates planning work into repo-native documents that engineering, product, editorial, AI, and operations can execute against.

This directory should answer:
- what exists
- why it exists
- who owns it
- how it connects to code, data, infrastructure, and workflows

## Documentation Principles
- Documentation must be implementation-oriented, not purely aspirational.
- Each major subsystem should have one primary source-of-truth document.
- Architecture decisions that change behavior, structure, security, or operations should be captured in ADRs.
- Documentation should prefer stable contracts over speculative detail.
- Security, auditability, provenance, and editorial integrity are cross-cutting requirements.

## Top-Level Structure
- `docs/README.md` — index and ownership guidance
- `docs/repository-structure.md` — approved root scaffold and ownership boundaries
- `docs/database/` — PostgreSQL design, schema plans, migrations strategy, data contracts
- `docs/backend/` — backend architecture, service boundaries, API contracts, worker responsibilities
- `docs/frontend/` — route map, rendering strategy, state/query patterns, UI contracts
- `docs/cms/` — editorial workflows, content model, publishing rules
- `docs/ai/` — grounding, audit, review, model safety, and output governance
- `docs/security/` — auth, RBAC, secrets handling, logging/redaction, security policies
- `docs/data/` — data provenance, source hierarchy, validation and governance policies
- `docs/adr/` — architectural decision records
- `docs/operations/` — runbooks, deploy, observability, incident and recovery procedures

## Initial Required Documents
This phase establishes the minimum planning baseline for implementation:

- `docs/repository-structure.md`
- `docs/database/postgresql-schema-plan.md`
- `docs/backend/backend-architecture-contract.md`
- `docs/frontend/frontend-route-map.md`
- `docs/cms/editor-content-model.md`
- `docs/ai/grounding-and-audit-requirements.md`

## Ownership Model
| Area | Primary Owners | Secondary Owners |
|---|---|---|
| Repository structure | Engineering | DevOps |
| Database | Backend Engineering, Data | AI, Editorial |
| Backend | Backend Engineering | Platform, Data |
| Frontend | Frontend Engineering | Product, SEO |
| CMS | Editorial Product, Frontend, Backend | SEO |
| AI grounding and audit | AI/ML, Backend, Editorial Governance | Compliance, Product |
| Security | Platform, Backend | All teams |

## Update Rules
- Update docs when structure, contracts, schemas, workflows, or governance expectations materially change.
- Update docs in the same PR as the implementation when feasible.
- If implementation must land first, create a follow-up issue before merge.
- Breaking contract changes must explicitly identify downstream impact.

## Definition of Done for Docs
A document is considered usable when it includes:
- purpose
- scope
- owners
- core entities or boundaries
- operational expectations
- risks or non-goals where relevant
- next implementation steps

## Relationship to Existing Support Docs
The existing `Support/docs/` material remains useful as planning and historical context. The `docs/` tree is intended to become the implementation-facing source of truth for the active monorepo structure and system contracts.

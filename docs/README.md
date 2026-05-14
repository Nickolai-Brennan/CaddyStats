# Documentation Map

## Purpose

Keep every durable project document under a single `docs/` tree, with clear separation between canonical guidance, active planning artifacts, and archived legacy material.

## Documentation tiers

### 1. Canonical docs

These files define the current product, architecture, governance, security, and strategy posture for the repository.

Primary locations:

- `docs/core/`
- `docs/product/`
- `docs/architecture/`
- `docs/governance/`
- `docs/security/`
- `docs/data/`
- `docs/strategy/`
- `docs/compliance/`
- `docs/roadmap/`
- `docs/workflow.md`
- `docs/changelog.md`

### 2. Planning docs

`docs/planning/` contains sequencing plans, phase task lists, and other implementation-planning artifacts. These files are useful for execution, but they do not override canonical product or architecture guidance unless an explicitly linked governance or architecture doc says so.

### 3. Legacy support archive

`docs/legacy/support/` preserves older support and source-material documents that informed the canonical set. Treat this area as historical reference only.

Use it when you need provenance, older planning context, or migration history. Do not treat it as the source of truth for current architecture, governance, or workflow rules.

## Current canonical map

### Foundation

- `docs/core/PROJECT_OVERVIEW.md`
- `docs/product/PRODUCT_BRIEF.md`
- `docs/product/VISION_AND_GOALS.md`
- `docs/architecture/SYSTEM_ARCHITECTURE_OVERVIEW.md`
- `docs/architecture/DOMAIN_MODEL.md`
- `docs/roadmap/build-phases.md`

### Governance and process

- `docs/governance/DOCS_STYLE_GUIDE.md`
- `docs/governance/ENGINEERING_STANDARDS_AND_GOVERNANCE.md`
- `docs/governance/DEPENDENCY_MAPPING.md`
- `docs/governance/adr/README.md`
- `docs/workflow.md`
- `docs/changelog.md`

### Supporting detailed references

- `docs/architecture/system-overview.md`
- `docs/architecture/system-blueprint.md`
- `docs/architecture/domain-model.md`
- `docs/security/auth-rbac.md`
- `docs/data/stat-grounding-policy.md`

## Consolidation rules

- Do not create new top-level documentation roots outside `docs/`.
- Move durable project docs into a canonical `docs/` location before updating references.
- Place active planning material in `docs/planning/`.
- Place archived or superseded support material in `docs/legacy/support/`.
- When two docs cover the same topic, define a clear split between summary and detailed reference or merge them.
- Record meaningful documentation changes in `docs/changelog.md`.

## Audit and maintenance references

- `docs/governance/DOCUMENTATION_CONSOLIDATION_AUDIT.md`
- `docs/governance/DOCS_STYLE_GUIDE.md`
- `docs/workflow.md`

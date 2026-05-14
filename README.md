# Caddy Stats

Caddy Stats is Strik3Zone's production-grade golf analytics, betting intelligence, and editorial publishing platform.

The product combines verified golf data, projection workflows, SEO-ready content systems, premium research tools, and AI-assisted analysis into one auditable platform.

## What the platform is built to do

- turn fragmented golf research into one trusted workflow
- ground public and premium claims in database-backed or provider-backed data
- support editorial publishing without sacrificing statistical integrity
- create differentiated subscription and affiliate value through explainable tools
- preserve clear boundaries across product, data, API, UI, and operations

## Current repository layout

This repository currently contains:

- `apps/web/` for the React + Vite frontend
- `services/api/` for the FastAPI backend
- `database/` for shared database assets and references
- `docs/` for canonical product, architecture, governance, and strategy docs
- `Support/docs/` for legacy source material that informed the canonical docs set
- `tests/`, `scripts/`, `infrastructure/`, and `workers/` for support and runtime concerns

## Canonical documentation map

### Core and product
- `docs/core/PROJECT_OVERVIEW.md`
- `docs/core/TERMINOLOGY_GLOSSARY.md`
- `docs/product/PRODUCT_BRIEF.md`
- `docs/product/PROBLEM_STATEMENT.md`
- `docs/product/VISION_AND_GOALS.md`
- `docs/product/NON_GOALS.md`
- `docs/product/VALUE_PROPOSITION.md`
- `docs/product/TARGET_AUDIENCE.md`

### Architecture and governance
- `docs/architecture/SYSTEM_ARCHITECTURE_OVERVIEW.md`
- `docs/architecture/SERVICE_BOUNDARIES.md`
- `docs/architecture/DOMAIN_MODEL.md`
- `docs/architecture/EVENT_DRIVEN_ARCHITECTURE.md`
- `docs/governance/DOCS_STYLE_GUIDE.md`
- `docs/governance/NAMING_CONVENTIONS.md`
- `docs/governance/VERSIONING_STRATEGY.md`
- `docs/governance/DEPENDENCY_MAPPING.md`
- `docs/governance/adr/ADR_TEMPLATE.md`
- `docs/governance/adr/ADR_PROCESS.md`
- `docs/governance/adr/ARCHITECTURE_DECISION_LOG.md`

### Strategy
- `docs/strategy/DATA_ENGINEERING_STRATEGY.md`
- `docs/strategy/AI_STRATEGY.md`
- `docs/strategy/SEO_STRATEGY.md`
- `docs/strategy/EDITORIAL_INTELLIGENCE_STRATEGY.md`
- `docs/strategy/RELIABILITY_STRATEGY.md`
- `docs/strategy/MONETIZATION_STRATEGY.md`
- `docs/strategy/SCALE_PLANNING.md`

### Detailed supporting docs already in repo
- `docs/architecture/system-blueprint.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/domain-model.md`
- `docs/data/stat-grounding-policy.md`
- `docs/security/auth-rbac.md`
- `docs/roadmap/build-phases.md`
- `docs/compliance/`

## Build and validation entry points

- `make setup` bootstraps local development
- `make dev` starts the local stack with Docker Compose
- `make lint` runs the repository linting entrypoints
- `make test` runs the repository test entrypoints

## Documentation rules

- canonical docs now live under `docs/`
- `Support/docs/` should be treated as legacy reference material unless explicitly migrated
- major architecture or governance changes should update the nearest canonical doc and ADR references
- documentation should stay aligned with real repository structure, contracts, and operating rules

## Product principles

1. Data first.
2. Explainability over hype.
3. Clear system boundaries.
4. Editorial structure over ad hoc publishing.
5. Monetization aligned to real user value.
6. Security and auditability are product requirements.

## Related references

- `docs/product/vision.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/system-blueprint.md`
- `docs/changelog.md`

# System Architecture Overview

## Purpose

Provide the executive architecture map for Caddy Stats and point readers to the deeper documents that define subsystem responsibilities in more detail.

## Why this document exists

Caddy Stats has multiple architecture documents because the platform needs both a concise governing summary and deeper implementation-guiding references. This file is the short-form canonical overview for product, engineering, and planning readers who need the platform shape without reading the full blueprint first.

## Platform layers

### Experience layer

- public SEO pages for player, tournament, course, ranking, and editorial discovery
- authenticated member and subscriber experiences
- internal editor, analyst, and admin surfaces

### API and application layer

- REST endpoints for stats, auth, admin, billing, health, and integrations
- selective GraphQL read patterns where nested editorial or dashboard composition benefits from it
- service-layer validation, authorization, and orchestration

### Data layer

- PostgreSQL as the source of truth
- bounded data ownership across stats, content, auth, billing, and audit concerns
- indexes and materialized views for high-read analytics paths

### Async and event layer

- workers for ingestion, model execution, cache invalidation, notifications, and scheduled refreshes
- event-driven flows for provider sync, publishing, billing, and reliability operations

### Governance layer

- JWT auth and RBAC
- audit logging for privileged and AI-assisted workflows
- documentation and ADR controls for architectural change management

## Architectural goals

- keep verified data at the center of public and premium experiences
- isolate domain responsibilities so services and workflows can scale safely
- support SEO-heavy traffic and premium authenticated usage together
- make AI assistance attributable, reviewable, and constrained by grounded data
- preserve operational safety for content, billing, and integrations

## Primary architecture handoffs

1. providers and internal jobs write normalized data into PostgreSQL
2. API services validate access and compose read models for frontend and internal surfaces
3. workers refresh derived models, projections, and cache invalidation events
4. editorial tools combine structured content with grounded data references
5. monetization and admin workflows rely on stable identity, entitlement, and audit records

## How to use this file with related docs

- use `docs/architecture/system-overview.md` for the broader implementation-guiding architecture narrative
- use `docs/architecture/system-blueprint.md` for subsystem details, pipeline flow, and infrastructure shape
- use `docs/architecture/DOMAIN_MODEL.md` and `docs/architecture/domain-model.md` for entity and context boundaries
- use ADRs under `docs/governance/adr/records/` for architecture decisions that changed the platform shape

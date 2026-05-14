# System Architecture Overview

## Purpose

This document summarizes the canonical architecture shape for Caddy Stats and provides the bridge between product intent and deeper engineering references.

## Platform layers

### Experience layer
- public web pages for SEO discovery
- authenticated member and subscriber experiences
- internal editor, analyst, and admin dashboards

### API and application layer
- REST endpoints for stats, auth, admin, billing, health, and integrations
- GraphQL for selective nested editorial and dashboard read patterns
- service-layer orchestration, validation, and authorization

### Data layer
- PostgreSQL as the source of truth
- schema boundaries across stats, content, auth, billing, and audit concerns
- indexes and materialized views for high-read analytics queries

### Async and event layer
- workers for ingestion, model execution, cache invalidation, and scheduled refreshes
- event flows for billing changes, content publication, provider ingestion, and reliability operations

### Governance layer
- JWT auth and RBAC
- audit logging for privileged and AI-assisted workflows
- documentation and ADRs for architectural change control

## Architectural goals

- keep verified data at the center of public and premium experiences
- isolate domain responsibilities so services can scale safely
- support SEO-heavy traffic and premium authenticated workflows together
- make AI assistance reviewable and attributable
- preserve operational safety for content, billing, and integrations

## Primary data flows

1. providers and internal jobs write normalized data into PostgreSQL
2. API services validate access and compose read models for the frontend
3. workers refresh derived models, projections, and cache invalidation events
4. editorial tooling combines structured content with grounded data references
5. analytics and monetization workflows depend on stable entitlements and audit records

## Detailed references

- `docs/architecture/system-overview.md`
- `docs/architecture/system-blueprint.md`
- `docs/architecture/SERVICE_BOUNDARIES.md`
- `docs/architecture/DOMAIN_MODEL.md`
- `docs/architecture/EVENT_DRIVEN_ARCHITECTURE.md`

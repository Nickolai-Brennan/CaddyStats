# Dependency Mapping

## Purpose

Show how major product and engineering outputs depend on one another so work follows the required build order.

## Build-order map

1. **Documentation** defines product intent, system boundaries, and governance rules.
2. **Folder and ownership setup** stabilizes repository structure and domain responsibilities.
3. **Database design** defines canonical entities, schemas, indexes, and derived read models.
4. **Backend contracts** expose validated APIs and business services around the database.
5. **Frontend delivery** consumes stable contracts for public and premium experiences.
6. **Editor workflows** depend on content models, internal APIs, and protected UI surfaces.
7. **Templates and SEO systems** depend on structured content and stable page contracts.
8. **AI systems** depend on grounded data, auditability, and editorial workflow controls.
9. **Hosting and operations** depend on deployable slices of application and data services.
10. **Admin and integrations** depend on auth, billing, audit, and operational readiness.
11. **Scale planning and business optimization** depend on measurable live behavior.

## Object mapping

Every meaningful capability should map to at least one of these system objects:

- document
- folder or repository domain
- database object
- API endpoint
- UI component or page
- deployment or operational step

## Cross-domain dependency examples

- projections depend on canonical player, tournament, and model-run records
- premium dashboards depend on both projection read models and entitlement checks
- structured editorial pages depend on content blocks, SEO metadata, and verified stat inserts
- AI-assisted publishing depends on grounding policy, prompt governance, review workflows, and audit logs
- monetization depends on billing events, entitlement propagation, and conversion instrumentation

## Governance implication

When a dependency chain changes materially, update the nearest canonical doc and evaluate whether an ADR is required.

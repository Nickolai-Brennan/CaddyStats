# Shared Packages

Shared packages hold reusable UI primitives, typed contracts, config helpers, utilities, analytics helpers, and SEO helpers.

## Package boundaries

- `packages/ui` — shared UI primitives, tokens, layout helpers
- `packages/types` — shared TypeScript contracts and domain models
- `packages/config` — runtime-safe config helpers and environment adapters
- `packages/utils` — cross-domain utility helpers with no app-specific side effects
- `packages/analytics` — reusable analytics formatting and scoring helpers
- `packages/seo` — canonical URL, metadata, and structured-data helpers

## Naming rules

- package names use the `@caddystats/<domain>` pattern
- package exports stay domain-scoped and framework-light where possible
- UI tokens use semantic names so apps can share meaning without hard-coding colors or layout rules

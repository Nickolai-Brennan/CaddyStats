# ADR-010: Editorial Rendering Engine (Structured Blocks + Sanitization)

Date: 2026-05-12
Status: Accepted
Owners: Frontend Engineering, Editorial Platform

## Context

Caddy Stats requires scalable SEO publishing and admin/editor workflows with reusable templates and stat-grounded modules. Free-form HTML-only authoring risks inconsistent layouts, weak reuse, and security concerns.

## Decision

Adopt a structured block-based editorial rendering engine with controlled rich content support.

Core design:

- Store article composition as ordered blocks with typed schemas.
- Render blocks using frontend component mappings.
- Support safe rich text where needed through sanitization.
- Include specialized block types for stats/projection embeds.
- Enforce publish-state workflows (draft, review, published).

Security and quality rules:

- Sanitize all HTML-capable block content.
- Deny unsafe tags/attributes/scripts.
- Validate block payloads at API boundary with typed schemas.
- Keep internal admin metadata separate from public render payloads.

## Consequences

### Positive

- High reuse and consistency across editorial content.
- Faster template-driven publishing.
- Better security posture than unrestricted HTML.
- Enables dynamic stat/projection content injection in a controlled way.

### Negative

- Requires ongoing block schema/version management.
- Initial implementation cost higher than plain markdown-only systems.

### Mitigations

- Define versioned block schemas and migration rules.
- Add rendering tests for each block type.
- Build editorial preview tools to reduce publish-time surprises.

## Alternatives Considered

1. Unstructured WYSIWYG HTML storage:
   Rejected due to security, consistency, and reuse limitations.

2. Markdown-only rendering:
   Rejected because advanced embedded analytics modules require richer structured blocks.

## Implementation Notes

- Content schema stores block JSONB where flexibility is required.
- Frontend renderer maps block type to versioned component implementations.
- SEO metadata is managed alongside, but separate from, block body content.

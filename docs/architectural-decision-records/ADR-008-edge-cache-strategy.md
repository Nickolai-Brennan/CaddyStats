# ADR-008: Edge Cache Strategy for Public Read Paths

Date: 2026-05-12
Status: Accepted
Owners: Frontend Engineering, Platform Engineering

## Context

Public tournament, player, course, and editorial pages are high-read and SEO-critical. Origin-only serving increases latency and infrastructure cost, especially during peak golf event cycles.

## Decision

Use CDN-backed edge caching for cacheable public content and API responses with clear invalidation semantics.

Caching policy by surface:

- Static assets: long TTL with content-hash immutability.
- Public read APIs: short-to-medium TTL with stale-while-revalidate behavior.
- HTML public pages: edge cache where safe, with targeted purge on content updates.
- Authenticated/premium APIs: no shared edge caching of private payloads.

Invalidation strategy:

- Purge by entity key (tournament/player/article) on updates.
- Automated purge hooks from publish and data refresh workflows.
- Freshness metadata exposed where user trust depends on recency.

## Consequences

### Positive

- Reduced global latency and improved Core Web Vitals.
- Lower backend load and better burst handling.
- Better SEO performance due to faster page delivery.

### Negative

- Risk of stale content if invalidation misses occur.
- Increased operational complexity for selective purges.

### Mitigations

- Use deterministic cache keys and invalidation paths.
- Monitor cache hit rate and stale response incidents.
- Provide emergency cache-bypass controls for incident response.

## Alternatives Considered

1. No edge caching:
Rejected due to performance and cost drawbacks.

2. Full-page static generation for all content:
Rejected because some surfaces require dynamic freshness.

## Implementation Notes

- Integrate cache purge events into publishing and projection refresh pipelines.
- Ensure auth headers and role-gated responses bypass shared caching.


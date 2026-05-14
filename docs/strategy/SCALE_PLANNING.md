# Scale Planning

## Objective

Prepare Caddy Stats to grow traffic, data volume, editorial output, and monetized usage without losing architecture clarity or operational control.

## Scale dimensions

### Traffic scale
- more public SEO traffic to entity and editorial pages
- sharper spikes around tournament windows

### Data scale
- more provider records, model runs, and historical comparisons
- heavier refresh and read-model workloads around event cycles

### Workflow scale
- more editorial output and template reuse
- more premium users interacting with projections and filters simultaneously

## Scale plan

### Near term
- keep high-read analytics on indexed tables and materialized views
- separate synchronous request paths from scheduled or heavy compute jobs
- use CDN and cache layers for public read paths

### Mid term
- expand worker specialization by domain
- add stronger queueing, refresh coordination, and search indexing controls
- tune hot-path queries and cache invalidation by entity

### Long term
- segment operational concerns by service domain where justified by load and ownership
- formalize cost, SLO, and incident thresholds for scaling decisions
- grow the data platform and editorial tooling without collapsing boundary rules

## Scale triggers to watch

- sustained latency regressions on read-heavy endpoints
- slow materialized view refreshes or ingestion lag during tournament windows
- rising queue backlogs or retry exhaustion
- subscriber workflow friction tied to performance or freshness issues

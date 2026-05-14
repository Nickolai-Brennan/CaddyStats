# Data Engineering Strategy

## Objective

Make Caddy Stats a data-first platform where golf statistics, projections, and editorial claims all depend on verified, queryable, and auditable data flows.

## Strategic priorities

- preserve canonical entity quality across players, tournaments, courses, markets, and projections
- keep provider data normalization explicit and observable
- support high-read analytics with indexed tables and materialized views
- expose freshness, lineage, and source references wherever downstream users depend on them

## Data flow model

1. ingest provider payloads through controlled workers
2. validate and normalize into canonical PostgreSQL structures
3. derive projections and read models with model-run lineage
4. refresh query-optimized views for API and UI consumption
5. emit operational signals for failures, staleness, and downstream cache invalidation

## Governance rules

- PostgreSQL is the source of truth
- schema changes go through migrations
- stable entities remain normalized whenever possible
- JSONB is reserved for flexible editorial or evolving metric payloads where justified
- no public claim should depend on unverified source data

## Operating metrics

Track at minimum:

- ingestion success and failure rates
- provider latency and freshness drift
- materialized view refresh duration and staleness
- projection pipeline completion and defect rates
- downstream API usage of read-heavy analytics surfaces

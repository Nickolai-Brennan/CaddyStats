# Stat Grounding Policy

## Purpose

This policy defines how Caddy Stats handles statistical provenance, derived claims, AI-assisted output, and conflicting or incomplete sports data.

## Core Rule

No public, premium, editorial, betting, or model-performance claim may be presented as fact unless it is:

1. backed by a verified source record,
2. backed by an explicit derived calculation with known inputs, or
3. clearly labeled as unavailable, stale, estimated, or under review.

## Stat Provenance Rules

Every canonical stat or market record used in product surfaces should be traceable to:

- source provider
- provider entity identifier
- provider timestamp or effective window
- ingestion timestamp
- normalization version or import job reference
- record status such as current, stale, partial, conflicting, or rejected

Minimum provenance expectation:

- raw provider data may be ingested into staging tables or jobs
- only validated, normalized records may feed public or premium experiences
- provenance metadata must remain queryable for review and debugging

## Source and Attribution Requirements

- provider-backed stats must retain provider attribution in internal records
- public-facing attribution should be shown where legally or contractually required
- mixed-source derived metrics must record all input sources, not just the final calculator
- if a provider restricts public attribution, internal lineage still remains mandatory

## Editorial vs. Computed Content Separation

### Editorial content

- human-authored or AI-assisted narrative
- should explain, contextualize, or summarize data
- must not silently introduce new quantitative claims that are absent from sources

### Computed content

- tables, rankings, projections, probabilities, scores, and transformations
- must identify the calculation source, model source, or derivation logic
- should expose freshness and version metadata where relevant

### Separation rules

- editorial blocks may reference computed outputs, but should not overwrite them
- computed modules should be rendered from structured data, not hand-entered copy
- if editorial copy references a computed metric, the metric should be reproducible from stored inputs

## Model Output Audit Rules

Every projection or model-derived claim should preserve:

- model name and version
- run timestamp
- input data window
- feature or source set reference
- reviewer state
- publishability status

Required behaviors:

- model outputs remain distinguishable from verified historical stats
- revisions to models should not erase prior run history needed for evaluation
- premium or editorial surfaces must be able to reference the active published model version

## AI Grounding and Safety Requirements

AI may assist with drafting, summarization, explanation, and internal workflow support only when grounded inputs are provided.

Required controls:

- prompts should include verified context references or structured grounding payloads
- AI output must log prompt version, model identifier, and grounding status
- unsupported sports, betting, injury, withdrawal, or performance claims must be blocked or flagged
- AI must not invent odds, tee times, field changes, model confidence, or source citations
- sensitive betting recommendations require human review before publication

## Handling Stale Data

Data should be marked stale when:

- provider freshness windows are missed
- upstream ingestion has not completed on schedule
- event conditions have changed without confirmed updates

When data is stale:

- display freshness metadata where relevant
- suppress high-risk claims if the stale state materially changes confidence
- prefer “data pending” or “last updated” messaging over silent fallback assumptions

## Handling Partial Data

Partial data occurs when:

- only some entities or rounds are available
- a provider payload is incomplete
- a market feed covers only a subset of offered selections

Rules:

- partial datasets may be used only if the surface clearly tolerates partial coverage
- calculations that require full coverage must be withheld until requirements are met
- internal QA flags should identify the missing scope

## Handling Conflicting Data

When providers disagree:

1. preserve the raw conflicting records for review
2. apply source-priority and validation rules to determine the canonical record
3. mark the entity as conflicting when automated resolution is not reliable
4. block public publication for materially disputed claims until resolved

Conflict resolution policy should be deterministic, documented, and revisitable through ADRs if it materially affects platform behavior.

## Publication Rules for Sports, Betting, and Performance Claims

- historical facts must come from verified historical records
- forward-looking projections must be labeled as model outputs or estimates
- betting value claims must be tied to explicit market data and projection logic
- performance narratives should distinguish observed outcomes from predicted expectations
- any missing or uncertain source context should narrow the claim, not widen it

## Operational Guidance

- ingestion pipelines should fail closed for critical data integrity issues
- internal review tools should expose freshness, lineage, and conflict states
- templates and editorial blocks should prefer structured stat references over pasted numbers
- audits should sample public pages and premium tools for unsupported quantitative claims

## Acceptance Standard

The platform meets this policy when a reviewer can trace any meaningful stat, projection, or betting claim back to a source record, derived calculation, or explicit suppression state without relying on unstored human memory.

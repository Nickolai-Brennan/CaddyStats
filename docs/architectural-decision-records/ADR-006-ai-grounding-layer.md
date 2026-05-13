# ADR-006: AI Grounding Layer and Safety Controls

Date: 2026-05-12
Status: Accepted
Owners: AI Engineering, Editorial Platform

## Context

Caddy Stats uses AI-assisted workflows for editorial drafting and analysis. Unconstrained model outputs risk unsupported claims, fabricated statistics, and trust erosion in betting-related contexts.

## Decision

Introduce a dedicated AI grounding layer between prompt inputs and model outputs.

Grounding requirements:

- Only allow verified structured inputs (database/fetched/injected) into high-trust workflows.
- Distinguish verified facts from generated narrative in output structures.
- Require citation/context references where feasible.
- Log prompt version, data context version, and output metadata.
- Enforce human review gates for critical betting/projection recommendation content.

Safety controls:

- Block unsupported betting guarantee language.
- Reject outputs that introduce non-provided stats/odds.
- Preserve auditable traces for editorial compliance review.

## Consequences

### Positive

- Higher trust and reduced hallucination risk.
- Better explainability and post-hoc quality analysis.
- Stronger editorial governance and compliance posture.

### Negative

- Additional implementation complexity and latency overhead.
- Requires disciplined context engineering and validation.

### Mitigations

- Cache validated context payloads where possible.
- Use tiered review paths by content risk level.
- Continuously evaluate output quality with structured eval sets.

## Alternatives Considered

1. Direct model calls without grounding:
Rejected due to high trust and compliance risk.

2. Manual-only editorial workflow:
Rejected because it limits scale and operational efficiency.

## Implementation Notes

- Grounding services live under backend/app/services/grounding and backend/app/services/ai.
- Prompt templates are versioned and referenced by workflow IDs.

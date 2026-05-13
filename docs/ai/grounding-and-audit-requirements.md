# AI Grounding and Audit Requirements

## Purpose
Define the minimum grounding, validation, and audit requirements for any AI-assisted workflow in CaddyStats.

## Goals
- Prevent unsupported claims
- Ensure every meaningful AI output is traceable
- Keep editorial accountability intact
- Support safe AI assistance for sports analysis and content production
- Create a reviewable audit trail for generated outputs and model-driven summaries

## Scope
This document applies to:
- AI-assisted editorial drafting
- AI-generated summaries of stats or model outputs
- AI-assisted headline, excerpt, and metadata generation
- AI-generated research helpers for internal workflows
- Any future betting or projection explanation workflows

This document does not authorize autonomous publishing.

## Core Principles

### 1. Grounded, Not Freeform
AI outputs must be grounded in:
- verified database records
- approved provider data
- internal model outputs with run references
- explicitly attached editorial source material

### 2. Traceability Required
Every material AI output must be traceable to:
- prompt or prompt template
- instruction set or policy version
- input source references
- model name/version
- actor and timestamp
- review outcome if shown externally or used in publishable content

### 3. Human Accountability
AI is assistive. Humans remain accountable for:
- factual correctness
- editorial judgment
- compliance
- publishing decisions
- betting-related claims and disclosures

### 4. No Unsupported Claims
If a claim cannot be tied to a known source or model run, it must not be presented as fact.

## Approved AI Use Cases
Allowed initial use cases:
- outline generation from approved source packs
- summary generation from structured stats
- rewriting for clarity/tone while preserving factual content
- title/SEO/meta suggestion generation
- article intro or recap draft suggestions using verified inputs
- internal analyst assistance with explicit source attachment

Restricted/high-risk use cases:
- betting recommendation generation
- confidence language around uncertain projections
- player narrative claims without source support
- automated publishing actions
- unsupervised content regeneration after data refresh

## Input Grounding Requirements

### Required Input Classes
An AI request should include, where applicable:
- entity context: player, tournament, course, article, model run
- structured source pack: stats, metrics, rankings, market snapshots
- source provenance metadata
- business/policy instructions
- output type target

### Source Pack Rules
A source pack must:
- contain only approved source records
- identify source type and retrieval time
- identify whether data is raw, transformed, or model-derived
- identify confidence/trust level where relevant

### Prompt Construction Rules
Prompts should:
- clearly distinguish facts from instructions
- forbid fabrication
- require abstention when source support is missing
- require explicit uncertainty language when confidence is limited
- avoid hidden assumptions about freshness or completeness

## Output Requirements

### Every Material AI Output Must Capture
- `request_id`
- `actor_id` or system initiator
- `workflow_context`
- `model_name`
- `model_version`
- `prompt_ref`
- `instruction_ref`
- `input_context_ref`
- `source_attachment_refs`
- `output_text` and/or structured output
- `generated_at`

### Required Output Policies
- The model must not invent player stats, tournament conditions, odds, injuries, or outcomes
- The model must not present estimates as official facts
- The model must not present betting advice as verified edge without source support
- The model must not omit required caveats for model-derived content
- The model should prefer “insufficient support” over guessing

## Review and Approval Requirements

### Human Review Required For
- any publishable article content
- any externally visible stat summary
- any betting-related or market-related narrative
- any AI output attached to premium research products
- any content that synthesizes multiple sources into recommendations or judgments

### Review Capture
Review events should log:
- reviewer
- review type
- decision
- notes
- timestamp
- linked article/version/output

### Review Decisions
Suggested values:
- `approved`
- `approved_with_edits`
- `rejected`
- `needs_escalation`

## Audit Logging Requirements

### Log Categories
1. generation logs
2. source attachment logs
3. review logs
4. model execution logs
5. policy/guardrail version logs

### Minimum Audit Retention Expectations
- Persist all publish-impacting AI logs
- Persist review logs for published or scheduled content
- Retain enough context to reconstruct why an output was accepted
- Avoid silent mutation of prior logs

### Immutable or Near-Immutable Records
The following should be treated as immutable once written:
- generated output snapshot
- model identity/version
- prompt/instruction references
- source attachment set
- review decision records

## Grounding Validation Rules

### Pre-Generation Checks
Before generation:
- confirm required entities exist
- confirm source pack is non-empty for factual workflows
- confirm source freshness where required
- confirm model run references exist for projection-based workflows
- confirm disallowed source types are excluded

### Post-Generation Checks
After generation:
- detect unsupported numerical claims where possible
- detect entity mismatches
- detect prohibited language patterns for certainty/guarantees
- require citation/source attachment completeness
- require review routing when risk category is elevated

## Risk Categories

### Low Risk
Examples:
- internal outline suggestions
- headline variants based on approved article content

Controls:
- basic logging
- optional human review depending on use context

### Medium Risk
Examples:
- stat-based summaries
- article intro drafts
- player performance recap summaries

Controls:
- grounding required
- source attachments required
- human review before external exposure

### High Risk
Examples:
- betting analysis
- model interpretation that may influence money decisions
- premium advisory content
- content with compliance sensitivity

Controls:
- strict grounding
- explicit source provenance
- mandatory human review
- mandatory disclosure checks
- stronger logging and escalation paths

## Disclosure Requirements
When content includes:
- betting markets
- affiliate relationships
- model-derived recommendations
- AI-assisted narrative generation

the system must enforce appropriate disclosure blocks or metadata before publication.

## Failure Handling
If grounding fails:
- do not generate externally usable output
- return structured failure reason
- log failure event
- allow operator/editor remediation where appropriate

If review fails:
- content remains unpublished
- rejection reason is preserved
- regeneration or revision should produce a new auditable event

## Operational Requirements
- AI services must be feature-flag capable
- policy versions must be referenceable
- prompts/instructions should be versioned artifacts
- outputs used in content workflows must be linkable to article/version records
- admin tools should expose review queue and audit lookup

## Non-Negotiable Rules
- No autonomous publishing
- No ungrounded factual claims
- No deletion of critical audit records without privileged, explicit process
- No betting or model-confidence claims without clear source context
- No AI pathway that bypasses editorial review for publishable output

## Open Questions
- Exact retention windows for different audit classes
- Whether to store full prompt bodies or prompt references plus rendered snapshots
- Which automated validators should block generation versus only flag review risk
- How deeply citation extraction should be automated for structured stats outputs

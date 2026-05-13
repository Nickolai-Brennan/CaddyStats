# Phase 8 — AI Implementation

## Phase Objective

Build the AI layer for Caddy Stats, including prompt systems, grounding, validation, editorial assist, projection explanation, observability, audit logging, and model-safe content workflows.

AI must support automation without compromising statistical integrity.

---

## 8.1 AI Architecture

### Core Domains

```text
ai/
├── prompts/
├── grounding/
├── injections/
├── validators/
├── evaluations/
├── pipelines/
├── observability/
└── policies/
```

### Backend Location

backend/app/services/ai/

### Frontend/Editor Location

frontend/editor/src/features/ai-assist/

---

## 8.2 AI System Responsibilities

### Primary Responsibilities

editorial draft assistance

article outline generation

stat-grounded summaries

projection explanations

betting edge explanations

SEO metadata suggestions

model performance summaries

internal analyst support

### Non-Responsibilities

publishing content directly

inventing statistics

bypassing editorial review

creating unverified betting claims

replacing computed projection models

---

## 8.3 AI Folder Structure

```text
ai/
│
├── prompts/
│   ├── editorial/
│   ├── seo/
│   ├── projections/
│   ├── betting/
│   ├── summaries/
│   └── admin/
│
├── grounding/
│   ├── source_registry.ts
│   ├── stat_context_builder.ts
│   ├── article_context_builder.ts
│   ├── validation_rules.ts
│   └── source_trace.ts
│
├── injections/
│   ├── system_prompts/
│   ├── task_prompts/
│   ├── guardrails/
│   └── templates/
│
├── validators/
│   ├── stat_validator.ts
│   ├── source_validator.ts
│   ├── claim_validator.ts
│   ├── hallucination_validator.ts
│   └── betting_disclaimer_validator.ts
│
├── evaluations/
│   ├── editorial_quality_eval.ts
│   ├── grounding_eval.ts
│   ├── seo_eval.ts
│   └── betting_safety_eval.ts
│
├── pipelines/
│   ├── editorial_assist_pipeline.ts
│   ├── seo_generation_pipeline.ts
│   ├── projection_summary_pipeline.ts
│   └── betting_edge_summary_pipeline.ts
│
└── observability/
    ├── ai_generation_logger.ts
    ├── token_usage_tracker.ts
    ├── validation_logger.ts
    └── model_performance_logger.ts
```

---

## 8.4 AI Database Tables

### Required Tables

- ai.ai_prompts
- ai.ai_generations
- ai.grounding_sources
- ai.ai_validations
- ai.hallucination_flags
- ai.model_usage_logs
- ai.prompt_versions

---

ai.ai_prompts

CREATE TABLE ai.ai_prompts (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT NOT NULL,
version TEXT NOT NULL,
domain TEXT NOT NULL,
prompt_body TEXT NOT NULL,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),

CONSTRAINT uq_ai_prompts_name_version UNIQUE (name, version)
);

---

ai.ai_generations

CREATE TABLE ai.ai_generations (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
prompt_id UUID NOT NULL REFERENCES ai.ai_prompts(id),
user_id UUID REFERENCES auth.users(id),
model_name TEXT NOT NULL,
input_context JSONB NOT NULL,
output_text TEXT NOT NULL,
grounding_source_ids UUID[] DEFAULT '{}',
validation_status TEXT NOT NULL DEFAULT 'pending',
created_at TIMESTAMPTZ DEFAULT NOW()
);

---

ai.grounding_sources

CREATE TABLE ai.grounding_sources (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
source_type TEXT NOT NULL,
source_table TEXT,
source_record_id UUID,
source_payload JSONB NOT NULL,
source_hash TEXT NOT NULL,
freshness_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW()
);

---

ai.ai_validations

CREATE TABLE ai.ai_validations (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
generation_id UUID NOT NULL REFERENCES ai.ai_generations(id),
validator_name TEXT NOT NULL,
status TEXT NOT NULL,
issues JSONB DEFAULT '[]',
created_at TIMESTAMPTZ DEFAULT NOW()
);

---

ai.hallucination_flags

CREATE TABLE ai.hallucination_flags (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
generation_id UUID NOT NULL REFERENCES ai.ai_generations(id),
severity TEXT NOT NULL,
claim_text TEXT NOT NULL,
reason TEXT NOT NULL,
source_check JSONB DEFAULT '{}',
created_at TIMESTAMPTZ DEFAULT NOW()
);

---

## 8.5 Prompt Versioning

### Rules

- every prompt must have a version

- prompt changes require changelog entries

- historical generations store prompt ID

- deprecated prompts remain queryable

- production prompt changes require review

- Prompt Metadata

```ts
export type PromptDefinition = {
  name: string;
  version: string;
  domain: "editorial" | "seo" | "projection" | "betting" | "admin";
  body: string;
  requiredSources: string[];
  outputFormat: "markdown" | "json" | "blocks";
  riskLevel: "low" | "medium" | "high";
};
```

---

## 8.6 Grounding Architecture

Grounding Flow

User request
→ select prompt
→ resolve required data
→ build source bundle
→ inject context
→ generate draft
→ validate claims
→ log generation
→ return draft + validation status

Grounding Requirements

every stat claim must map to source data

generated content must expose source IDs

stale data must be flagged

computed values must include calculation metadata

unsupported claims must be blocked or flagged

---

## 8.7 Source Registry

### Purpose

Define which data sources AI can reference.

```ts
export type GroundingSourceDefinition = {
  id: string;
  domain: "stats" | "analytics" | "content" | "seo" | "betting";
  table: string;
  allowedFields: string[];
  freshnessWindowHours: number;
  requiresPremiumAccess: boolean;
};
```

Required Sources

stats.players

stats.rounds

stats.tournaments

analytics.projections

analytics.betting_edges

analytics.model_versions

content.articles

content.seo_metadata

---

## 8.8 AI Editorial Assist

Capabilities

generate article outline

rewrite intro

summarize player form

explain projections

generate SEO title variants

generate meta descriptions

suggest internal links

create draft disclaimer blocks

Output Rule

AI output enters the editor as draft blocks only.

---

## 8.9 AI Output Block Mapping

Supported Output Blocks

text
heading
stat_table
player_card
projection
betting_edge
chart_summary
disclaimer
seo_suggestion

### Rule

AI cannot create unknown block types.

---

## 8.10 AI Validation Layer

Validators

StatValidator
SourceValidator
ClaimValidator
FreshnessValidator
BettingDisclaimerValidator
PremiumLeakValidator
UnsafeContentValidator

Validation Result Shape

```ts
export type AiValidationResult = {
  status: "passed" | "warning" | "failed";
  issues: {
    code: string;
    message: string;
    severity: "low" | "medium" | "high";
    sourceId?: string;
    claimText?: string;
  }[];
};
```

---

## 8.11 Claim Validation Rules

Must Flag

unsupported numerical claims

stale rankings

missing projection source

betting claim without disclaimer

premium-only data exposed in public output

contradiction with source data

Must Block

invented statistics

unverified betting guarantees

user-facing claims without source mapping

direct publish actions

unsupported injury/status claims

---

## 8.12 Projection Explanation Pipeline

### Purpose

Generate readable explanations for computed projections.

Required Inputs

player ID

tournament ID

model version

projection value

confidence score

top contributing factors

historical comparison

timestamp

Output

plain-language summary

factor breakdown

confidence explanation

source references

validation status

---

## 8.13 Betting Edge Summary Pipeline

### Purpose

Explain detected betting edges without promotional tout language.

Required Inputs

market type

sportsbook odds

model probability

implied probability

calculated edge

timestamp

responsible gambling disclaimer

Hard Rule

Never guarantee outcomes.

---

## 8.14 SEO AI Pipeline

Capabilities

title variants

meta description variants

internal link suggestions

FAQ candidates

schema recommendations

content gap suggestions

Guardrails

no keyword stuffing

no fabricated FAQ answers

no duplicate meta titles

no misleading betting claims

---

## 8.15 AI API Endpoints

POST /api/v1/ai/editorial-assist
POST /api/v1/ai/seo-suggestions
POST /api/v1/ai/projection-summary
POST /api/v1/ai/betting-edge-summary
POST /api/v1/ai/validate-generation
GET  /api/v1/ai/generations/{generation_id}
GET  /api/v1/ai/generations/{generation_id}/validations

---

## 8.16 Backend Service Structure

```text
backend/app/services/ai/
├── ai_client.py
├── prompt_service.py
├── grounding_service.py
├── validation_service.py
├── editorial_assist_service.py
├── seo_ai_service.py
├── projection_summary_service.py
├── betting_summary_service.py
├── audit_service.py
└── model_router.py
```

---

## 8.17 AI Client Rules

### Requirements

- provider abstraction

- timeout handling

- retries with backoff

- token usage logging

- model fallback rules

- request ID tracing

- no secrets in logs

---

## 8.18 Model Router

Routing Strategy

low-risk SEO variants → fast/low-cost model
editorial summaries → balanced model
stat-heavy projections → higher-reliability model
betting summaries → strict validation + reliable model
admin analysis → context-dependent

---

## 8.19 Observability

Required Metrics

generations per domain

validation failure rate

hallucination flag rate

average token cost

latency by model

retry rate

grounding source freshness

editor acceptance rate

---

## 8.20 AI Audit Trail

Must Log

user ID

prompt ID

prompt version

model name

input context hash

output text

grounding source IDs

validation result

token usage

latency

inserted block IDs

---

## 8.21 Editor UI Integration

```text
frontend/editor/src/features/ai-assist/
├── AiAssistPanel.tsx
├── PromptSelector.tsx
├── GroundingSourcePicker.tsx
├── GenerationPreview.tsx
├── ValidationResultPanel.tsx
├── InsertDraftBlockButton.tsx
└── AiAuditTrail.tsx
```

UX Requirements

show grounding sources

show validation status

show warnings before insert

insert as draft block

disable publish if failed AI blocks exist

---

## 8.22 Security Controls

### Required

- RBAC on AI endpoints

- rate limiting

- prompt injection filtering

- source allowlist

- premium data leakage checks

- logging redaction

- model output sanitization

---

## 8.23 Prompt Injection Protection

Defense Layers

system prompt boundaries

source allowlist

user input isolation

no instruction execution from source text

output validation

audit logging

---

## 8.24 Testing Strategy

```text
tests/ai/
├── test_prompt_service.py
├── test_grounding_service.py
├── test_validation_service.py
├── test_editorial_assist.py
├── test_projection_summary.py
├── test_betting_summary.py
└── test_prompt_injection.py
```

Required Tests

stat grounding validation

unsupported claim detection

stale source flagging

premium leak prevention

betting disclaimer enforcement

prompt version lookup

audit log persistence

---

## 8.25 AI Documentation

```text
docs/ai/
├── grounding-architecture.md
├── prompt-versioning.md
├── validation-rules.md
├── editorial-assist.md
├── projection-explanations.md
├── betting-summaries.md
├── prompt-injection-defense.md
└── observability.md
```

---

## 8.17 Additional Required Tasks Identified

### Tasks

- Add a prompt and model version registry with evaluation dataset ownership.
- Add prompt-injection, hallucination, and unsafe-claim red-team testing tasks for grounded AI flows.
- Add source citation and evidence-surface requirements for AI-assisted outputs presented to editors or users.
- Add moderation queues, review actions, and retention policies for AI generation logs.

## Phase 8 Validation Checklist

### Architecture

[ ] AI folder structure created

[ ] Backend AI services scaffolded

[ ] Model router implemented

[ ] Provider abstraction created

Grounding

[ ] Source registry defined

[ ] Context builder implemented

[ ] Source tracing active

[ ] Freshness validation added

Validation

[ ] Stat validator implemented

[ ] Claim validator implemented

[ ] Betting disclaimer validator implemented

[ ] Premium leak validator implemented

Editor

[ ] AI assist panel implemented

[ ] Prompt selector created

[ ] Grounding sources visible

[ ] Draft block insertion enforced

Observability

[ ] AI generation logs persisted

[ ] Token usage tracked

[ ] Validation results logged

[ ] Hallucination flags stored

Security

[ ] RBAC enforced on AI endpoints

[ ] Rate limiting applied

[ ] Prompt injection tests created

[ ] Model outputs sanitized

---

## Phase 8 Exit Condition

Phase 8 is complete only when:

AI generation is fully grounded

Prompt versions are tracked

Sources are traceable

Unsupported claims are flagged

High-risk claims are blocked

AI outputs enter editor as draft blocks only

Token usage and validation results are logged

Prompt injection defenses are tested

Premium data leakage checks are active

Editor can review, validate, and insert AI content safely

Only after completion may Phase 9 Hosting & Infrastructure Deployment begin.
---

# Phase 2 — Database Architecture & Implementation

## Phase Objective

Implement the production-grade PostgreSQL architecture for Caddy Stats, including schemas, migrations, indexing strategy, analytics infrastructure, materialized views, security boundaries, and performance optimization.

Phase 2 establishes the platform’s data foundation.

---

## 2.1 Database Architecture Overview

### Core Objectives

- High-performance analytical workloads

- Scalable historical statistics storage

- AI-grounded editorial data access

- Betting intelligence computation

- Optimized projection generation

- Multi-schema isolation

- Production-safe migrations

- Horizontal scalability readiness

---

## 2.2 PostgreSQL Standards

### Required PostgreSQL Features

PostgreSQL 16+

UUID primary keys

JSONB support

Materialized views

Partitioning

GIN indexing

Full-text search

Generated columns

Row-level security

### Extensions

- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
- CREATE EXTENSION IF NOT EXISTS pg_trgm;
- CREATE EXTENSION IF NOT EXISTS btree_gin;
- CREATE EXTENSION IF NOT EXISTS pgcrypto;

---

## 2.3 Schema Architecture

### Multi-Schema Structure

```text
database/schemas/
│
├── auth/
├── content/
├── stats/
├── analytics/
├── ai/
├── system/
└── ingestion/
```

---

## 2.4 Schema Responsibilities

auth

Authentication and authorization domain.

### Tables

- users

- roles

- permissions

- refresh_tokens

- api_keys

- audit_logs

---

content

Editorial and CMS domain.

### Tables

- articles

- article_blocks

- authors

- tags

- categories

- seo_metadata

- article_versions

---

stats

Core golf statistical infrastructure.

### Tables

- players

- tournaments

- rounds

- hole_stats

- strokes_gained

- player_rankings

- course_history

- betting_lines

---

analytics

Projection and simulation systems.

### Tables

- projections

- simulations

- model_versions

- betting_edges

- ownership_projections

- trend_analysis

---

ai

AI grounding and observability.

### Tables

- ai_prompts

- ai_generations

- grounding_sources

- ai_validations

- hallucination_flags

---

system

Operational platform services.

### Tables

- feature_flags

- jobs

- webhooks

- notifications

- system_metrics

---

ingestion

External data ingestion layer.

### Tables

- ingestion_jobs

- source_payloads

- source_mappings

- ingestion_failures

---

## 2.5 Folder Structure

```text
database/
│
├── migrations/
├── schemas/
├── functions/
├── triggers/
├── views/
├── materialized/
├── seeds/
├── backups/
└── policies/
```

---

## 2.6 Migration Architecture

Migration Strategy

Alembic-based migrations

Immutable migration history

Environment-safe migrations

Transactional migrations

Rollback support

Migration Organization

```text
database/migrations/
│
├── auth/
├── content/
├── stats/
├── analytics/
├── ai/
└── shared/
```

---

## 2.7 Naming Standards

### Tables

- snake_case
- pluralized

### Examples

players
player_rankings
betting_lines

---

Columns

snake_case

### Examples

created_at
updated_at
player_id
tournament_id

---

Constraints

pk_<table>
fk_<table>_<reference>
idx_<table>_<field>
uq_<table>_<field>

---

## 2.8 Primary Key Standards

UUID Standard

id UUID PRIMARY KEY DEFAULT uuid_generate_v4()

Required Audit Columns

created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

---

## 2.9 Core Stats Tables

players

CREATE TABLE stats.players (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
first_name TEXT NOT NULL,
last_name TEXT NOT NULL,
country TEXT,
birth_date DATE,
handedness TEXT,
active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

---

tournaments

CREATE TABLE stats.tournaments (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT NOT NULL,
course_name TEXT,
start_date DATE,
end_date DATE,
purse NUMERIC(12,2),
season INTEGER,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

---

rounds

CREATE TABLE stats.rounds (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
player_id UUID NOT NULL,
tournament_id UUID NOT NULL,
round_number INTEGER NOT NULL,
score INTEGER,
tee_time TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW(),

CONSTRAINT fk_rounds_player
FOREIGN KEY (player_id)
REFERENCES stats.players(id),

CONSTRAINT fk_rounds_tournament
FOREIGN KEY (tournament_id)
REFERENCES stats.tournaments(id)
);

---

## 2.10 JSONB Standards

Approved Use Cases

Flexible AI metadata

Editorial block content

Model configuration

External source payloads

Avoid JSONB For

High-read relational data

Join-heavy queries

Frequently filtered dimensions

---

## 2.11 Indexing Strategy

Required Index Types

B-Tree

CREATE INDEX idx_rounds_player_id
ON stats.rounds(player_id);

Composite Index

CREATE INDEX idx_rounds_player_tournament
ON stats.rounds(player_id, tournament_id);

GIN JSONB Index

CREATE INDEX idx_article_blocks_content
ON content.article_blocks
USING GIN(content jsonb_path_ops);

Full Text Search

CREATE INDEX idx_articles_search
ON content.articles
USING GIN(to_tsvector('english', title || ' ' || body));

---

## 2.12 Partitioning Strategy

Partition Candidates

hole_stats

strokes_gained

betting_lines

simulations

historical_rankings

Partition Method

Time-based partitioning by:

season

event_date

created_at

---

## 2.13 Materialized Views

### Purpose

Fast leaderboard queries

Projection aggregation

Betting edge calculations

Course history summaries

### Folder

database/materialized/

Example

CREATE MATERIALIZED VIEW analytics.player_recent_form AS
SELECT
player_id,
AVG(score) AS avg_score,
COUNT(*) AS rounds_played
FROM stats.rounds
GROUP BY player_id;

---

## 2.14 Database Functions

### Folder

database/functions/

Function Types

projection calculations

betting edge calculations

rolling averages

AI validation helpers

---

## 2.15 Trigger Standards

Allowed Triggers

updated_at automation

audit logging

cache invalidation

search vector updates

### Folder

database/triggers/

---

## 2.16 Row-Level Security

### Required Domains

admin access

editor access

premium subscriptions

internal analytics

Example

ALTER TABLE content.articles ENABLE ROW LEVEL SECURITY;

---

## 2.17 Audit Logging

Audit Requirements

Track:

authentication events

article edits

model recalculations

admin actions

API key usage

Table

auth.audit_logs

---

## 2.18 AI Grounding Database Layer

Objectives

Source traceability

Hallucination prevention

Editorial validation

Prompt observability

### Tables

- ai.grounding_sources

- ai.ai_validations

- ai.hallucination_flags

---

## 2.19 Analytics Infrastructure

Core Systems

player projections

betting simulations

ownership modeling

trend analysis

lineup optimization

Data Flow

ingestion → stats → analytics → API → frontend

---

## 2.20 Caching Strategy

Cache Layers

PostgreSQL materialized views

Redis query cache

API response cache

High Cache Priority

leaderboard data

projections

player trends

rankings

---

## 2.21 Backup & Recovery

Backup Standards

nightly full backups

WAL archiving

point-in-time recovery

encrypted storage

Retention

daily: 30 days

weekly: 12 weeks

monthly: 12 months

---

## 2.22 Security Standards

Required Protections

encrypted connections

restricted DB roles

secret rotation

migration approval workflow

read-only analytics roles

---

## 2.23 Performance Targets

Query Targets

standard API query <150ms

cached response <100ms

materialized query <50ms

Database Targets

zero sequential scans on hot tables

indexed joins only

explain analyze validation required

---

## 2.24 Database Roles

Roles

app_read
app_write
analytics_read
admin
migration_role
readonly_reporting

---

## 2.25 Seed Strategy

Seed Categories

development seeds

staging seeds

test fixtures

production-safe baseline data

### Folder

database/seeds/

---

## 2.26 Observability

Database Monitoring

slow queries

lock contention

replication lag

index usage

dead tuples

Required Dashboards

PostgreSQL metrics

query latency

connection pools

cache hit ratios

---

## 2.27 Reliability Standards

Required Systems

migration rollback plans

failover procedures

connection retry handling

replication monitoring

---

## 2.28 Data Ingestion Standards

Sources

PGA Tour feeds

sportsbook APIs

historical archives

weather APIs

### Requirements

- retry logic

- source validation

- schema normalization

- ingestion audit logs

---

## 2.29 Database Documentation Requirements

Required Docs

```text
/docs/database/
│
├── schema-strategy.md
├── indexing-standards.md
├── partitioning.md
├── migrations.md
├── backup-strategy.md
├── rls-policies.md
└── analytics-architecture.md
```

---

## 2.30 Build Readiness Gates

Must Pass Before Phase 3

### Schema

[ ] All schemas created

[ ] Naming standards enforced

[ ] UUID strategy implemented

Performance

[ ] Core indexes created

[ ] Materialized views planned

[ ] Partitioning strategy finalized

Security

[ ] Roles defined

[ ] RLS configured

[ ] Audit logging enabled

### Reliability

[ ] Backup strategy documented

[ ] Migration rollback process tested

### AI

[ ] Grounding tables implemented

[ ] Validation infrastructure created

---

## 2.18 Additional Required Tasks Identified

### Tasks

- Add source-provenance tables and validation rules for imported golf, odds, and model data.
- Add partition retention, archive strategy, and materialized-view refresh ownership for high-volume analytics tables.
- Add migration rollback testing, backup restore validation, and seed-data provenance requirements.
- Add subscription or entitlement schema boundaries needed by later billing and premium-access phases.

## Phase 2 Exit Condition

Phase 2 is complete only when:

PostgreSQL schemas are production-ready

Migration infrastructure is operational

Indexing standards are enforced

Materialized views are implemented

Analytics infrastructure is defined

Security boundaries are active

Backup/recovery systems are documented

AI grounding tables are operational

Observability standards are configured

Only after completion may Phase 3 Backend/API Implementation begin.
---

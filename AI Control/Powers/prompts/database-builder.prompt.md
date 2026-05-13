---
name: database-builder
agent: database-agent
phase: PROTOTYPE|MVP|PRODUCTION
---

# Prompt: Database Schema Builder

## Objective

Design a normalized database schema from data model requirements, producing DDL SQL, an ERD description, and a migration strategy.

## Context Requirements

- Entity list with attributes and relationships
- Target database engine (PostgreSQL, MySQL, SQLite)
- Volume estimates (row counts per table)
- `project_brief.md` from WF-00

## Instructions

You are the database-agent. Given the following context:

**Project context**: {{project_context}}
**Entity list**: {{entity_list}}
**DB engine**: {{db_engine}}
**Volume estimates**: {{volume_estimates}}

Complete the following:

1. Normalize entities to 3NF; identify primary keys, foreign keys, and junction tables for M:M relationships.
2. Choose appropriate column types, lengths, and constraints (NOT NULL, UNIQUE, CHECK) for each attribute.
3. Define indexes on all foreign keys and high-frequency query columns.
4. Write CREATE TABLE statements in dependency order (no forward references).
5. Write a migration strategy: version numbering, rollback steps, and zero-downtime approach.

## Output Format

```sql
-- ddl_sql.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

```yaml
# migration_strategy.md
version: "001"
description: "Initial schema"
up: "Run ddl_sql.sql"
down: "DROP TABLE IF EXISTS users CASCADE"
zero_downtime: true
```

## Quality Checks

- [ ] All entities normalized to 3NF
- [ ] Every foreign key has a corresponding index
- [ ] DDL executes without errors on target engine
- [ ] Rollback step defined for every migration version

## Safety Rules

- Never include real connection strings or credentials in DDL files
- Use placeholder schema names in examples (e.g., `public`)

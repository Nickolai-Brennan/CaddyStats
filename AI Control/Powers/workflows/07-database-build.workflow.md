# Workflow: 07-database-build

## Overview

Designs the database schema, generates DDL SQL, produces an ERD description, and defines the migration strategy. Run early in the project; outputs feed WF-06 (API) and WF-04 (model). Can run in parallel with WF-05.

## Phase

PROTOTYPE · MVP · PRODUCTION

## Participants

| Agent              | Role                                             |
| ------------------ | ------------------------------------------------ |
| orchestrator-agent | Coordinates design steps and validates outputs   |
| database-agent     | Designs schema, DDL, ERD, and migration strategy |
| backend-agent      | Receives schema for service-layer integration    |

## Inputs

- `project_brief.md` from WF-00
- `data_inventory.md` from WF-01 (if available)
- Data model requirements and entity list

## Outputs

- `ddl_sql.sql`
- `erd_description.md`
- `migration_strategy.md`

## Steps

### Step 1: Entity and Relationship Mapping (Agent: database-agent)

**Action**: Identify all entities, attributes, and relationships from requirements.
**Inputs**: `project_brief.md`, entity list.
**Outputs**: Entity-relationship map.
**Saves to**: `docs/agent-outputs/database-agent/`

### Step 2: Schema Design (Agent: database-agent)

**Action**: Define tables, columns, data types, constraints, and foreign keys.
**Inputs**: Entity-relationship map.
**Outputs**: Draft schema.
**Saves to**: `docs/agent-outputs/database-agent/`

### Step 3: DDL SQL Generation (Agent: database-agent)

**Action**: Write CREATE TABLE, INDEX, and CONSTRAINT statements; include seed data where needed.
**Inputs**: Draft schema.
**Outputs**: `ddl_sql.sql`
**Saves to**: `docs/agent-outputs/database-agent/`

### Step 4: ERD Description (Agent: database-agent)

**Action**: Write prose ERD describing all entities, cardinalities, and key relationships.
**Inputs**: `ddl_sql.sql`
**Outputs**: `erd_description.md`
**Saves to**: `docs/agent-outputs/database-agent/`

### Step 5: Migration Strategy (Agent: database-agent)

**Action**: Define versioned migration plan, rollback steps, and zero-downtime approach.
**Inputs**: `ddl_sql.sql`, deployment environment info.
**Outputs**: `migration_strategy.md`
**Saves to**: `docs/agent-outputs/database-agent/`

## Success Criteria

- [ ] `ddl_sql.sql` executes without errors on target DB engine
- [ ] All foreign key relationships documented in `erd_description.md`
- [ ] `migration_strategy.md` includes rollback instructions

## Error Handling

| Scenario                        | Response                                       |
| ------------------------------- | ---------------------------------------------- |
| Circular foreign key dependency | Redesign affected tables; re-run step 2        |
| DB engine version conflict      | Note compatibility; add conditional DDL        |
| Missing entity requirements     | Halt; request clarification from project owner |

## Safety Gates

- [ ] No real credentials or connection strings in DDL files
- [ ] Confirmation required before destructive migrations
- [ ] All outputs saved to correct output directory

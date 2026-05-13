---
name: database-schema-skill
description: |
  Designs relational and NoSQL database schemas: tables, fields, data types, relationships,
  foreign keys, constraints, indexes, and naming conventions. Use this skill when a user
  asks to design a database, create tables, define a schema, model entities and their
  relationships, map ERDs, or plan database structure. Common phrasings: "design a database
  for X", "create the tables for my app", "define a schema", "model these entities",
  "what tables do I need?", "design my data model", "create an ERD", "how should I
  structure my database?". Do NOT use when the user wants to write queries against an
  existing database (use notebook-query-skill), clean/transform data (use
  data-cleaning-skill), or design an API (use api-design-skill). Schema design is the
  focus — not query writing or data migration.
---

# Database Schema Skill

## Overview

The Database Schema Skill designs relational (SQL) and document/NoSQL database schemas.
It produces table definitions, field types, constraints, indexes, relationship diagrams
(ERD text descriptions), and naming conventions. It works from domain descriptions,
entity lists, or requirements and outputs DDL SQL statements, migration file stubs, and
schema documentation suitable for version control.

## When to Use / When NOT to Use

**Use this skill when:**

- User needs to model domain entities as database tables or collections
- User wants DDL SQL (CREATE TABLE statements) generated
- User needs relationship design: one-to-one, one-to-many, many-to-many (junction tables)
- User wants index recommendations based on anticipated query patterns
- User needs to document an existing schema or improve a draft schema

**Do NOT use this skill when:**

- User wants to write queries against an existing schema (use `notebook-query-skill`)
- User needs data migration or ETL logic (beyond schema definition)
- User wants API design layered on top of the schema (use `api-design-skill`)
- The request is purely about ORM configuration or code-level models

## Inputs

- **Domain description**: The business domain, key entities, and their attributes
- **Relationships**: How entities relate to each other (stated or implied)
- **Database type**: PostgreSQL, MySQL, SQLite, MongoDB, etc. — defaults to PostgreSQL
- **Query patterns** _(optional)_: Anticipated queries to inform index design
- **Existing schema** _(optional)_: Draft DDL or ER diagram to review/improve

## Outputs

- **DDL SQL**: `CREATE TABLE` statements with types, constraints, and comments
- **ERD description**: Text-based entity-relationship diagram or Mermaid ERD
- **Index recommendations**: Which columns to index and why
- **Naming conventions**: Applied conventions documented (snake_case, plural tables, etc.)
- **Design decisions**: Normalization level, soft delete pattern, audit fields, etc.

## Workflow

1. Identify all entities from the domain description; list their attributes.
2. Determine relationships between entities; choose cardinality and FK placement.
3. Normalize to appropriate level (3NF by default); note any intentional denormalization.
4. Select appropriate data types for each field for the target database.
5. Define constraints: NOT NULL, UNIQUE, CHECK, DEFAULT values.
6. Recommend indexes based on relationships and stated query patterns.
7. Write DDL SQL statements with inline comments.
8. Produce ERD (Mermaid syntax preferred) and decisions log.

**Stop conditions:**

- Stop and ask if entity attributes or relationships are ambiguous.
- Stop and ask before suggesting schema changes that drop or rename columns in production.

## Edge Cases

- **Many-to-many relationships**: Always create a junction table; name it `entity_a_entity_b`.
- **Soft delete vs. hard delete**: Ask user preference; recommend soft delete with
  `deleted_at TIMESTAMP NULL`.
- **UUID vs. auto-increment IDs**: Note trade-offs; default to `SERIAL`/`BIGSERIAL` for
  simplicity, UUID for distributed systems.
- **Audit fields**: Recommend `created_at`, `updated_at` on all tables by default.
- **Very large tables**: Recommend partitioning strategy if row count projections are huge.
- **Polymorphic associations**: Flag complexity; suggest concrete table-per-type pattern.

## Safety & Secrets

- Never log, commit, or include connection strings, passwords, or database credentials
  in DDL or schema documentation.
- Warn before any `DROP TABLE` or destructive schema change; require confirmation.
- Flag if schema design exposes PII without appropriate masking or access controls.
- Do not include seed data with real personal information in examples.

## Examples

### Example 1: E-commerce schema

**User prompt:** "Design a database schema for an e-commerce store with products,
categories, orders, and customers. PostgreSQL."

**Expected output:**

```sql
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE categories ( ... );
CREATE TABLE products ( ... );
CREATE TABLE orders ( ... );
CREATE TABLE order_items ( ... ); -- junction: orders ↔ products
```

- Indexes on `orders.customer_id`, `products.category_id`, `order_items.order_id`
- Mermaid ERD showing all relationships

### Example 2: Multi-tenant SaaS schema

**User prompt:** "I'm building a multi-tenant SaaS app. How should I structure the
database to support multiple organizations, each with their own users and data?"

**Expected output:**

- `organizations` table as the tenant root
- `users` with `organization_id FK` — row-level tenancy
- Application data tables all reference `organization_id`
- Discussion of schema-per-tenant vs. row-level isolation trade-offs
- Row-level security (RLS) policy examples for PostgreSQL

## Testing / Evals

See `evals/evals.json` for test prompts. Run 2–3 prompts and compare outputs against
`expected_output` descriptions.

## References

- [Database Design Guide](../../references/database-design-guide.md)
- [Database Rules](../../instructions/database-rules.md)
- [Database Designer](../database-designer/SKILL.md)
- [API Design Skill](../api-design-skill/SKILL.md) — pair with for full service design
- [Skill Registry](../skill-registry.md)

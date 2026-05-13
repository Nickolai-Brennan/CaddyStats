---
name: seed-data-generator
description: |
  Generates realistic seed, fixture, and test data for databases and APIs: SQL
  INSERT statements, JSON fixtures, factory functions, and fake data scripts. Use
  this skill whenever a user says "generate seed data", "write database fixtures",
  "create test data for this schema", "fill my database with fake data", "write a
  data factory", "seed this table with realistic values", "generate fake users/orders/
  products", or "create mock data for testing". Also activate when someone needs
  a populated development database or test fixtures for unit tests. Supports SQL
  (PostgreSQL, MySQL), JSON fixtures, and TypeScript/Python factory functions with
  Faker.js / Faker (Python). Do NOT use for production data migration (use
  data-pipeline-designer) or generating test assertions (use eval-set-builder).
---

# Seed Data Generator

Generate realistic, consistent seed data for databases, APIs, and tests — SQL
inserts, JSON fixtures, and type-safe factory functions.

## When to Use

- Setting up a local development database with realistic data
- Writing unit/integration test fixtures
- Creating demo data for a product demo or staging environment
- Generating performance test datasets

## When NOT to Use

- Production data migration (use `data-pipeline-designer`)
- Generating ML training datasets (different domain)
- Creating test assertions (use `eval-set-builder`)

---

## Workflow

### Step 1 — Understand the Data Requirements

Ask for:

1. **Schema:** Table/model definitions with field names and types
2. **Volume:** How many rows per table?
3. **Realism level:** Completely fake / realistic names and addresses / domain-specific
4. **Relationships:** Are there foreign key relationships to maintain?
5. **Output format:** SQL INSERTs / JSON fixtures / TypeScript factories / Python factories
6. **Deterministic?** Same seed should generate same data (useful for test stability)

### Step 2 — Analyze Relationships and Dependencies

For tables with foreign keys, generate in dependency order:

1. Independent tables first (users, products, categories)
2. Dependent tables second (orders → users, order_items → orders + products)

### Step 3 — Generate SQL Seed Data

**PostgreSQL INSERTs:**

```sql
-- seed/users.sql
-- Generated seed data — 10 users

BEGIN;

INSERT INTO users (id, email, name, role, created_at) VALUES
  ('usr_01', 'alice.smith@example.com',   'Alice Smith',   'admin', NOW() - INTERVAL '90 days'),
  ('usr_02', 'bob.jones@example.com',     'Bob Jones',     'user',  NOW() - INTERVAL '60 days'),
  ('usr_03', 'carol.white@example.com',   'Carol White',   'user',  NOW() - INTERVAL '45 days'),
  ('usr_04', 'dave.brown@example.com',    'Dave Brown',    'user',  NOW() - INTERVAL '30 days'),
  ('usr_05', 'eve.davis@example.com',     'Eve Davis',     'user',  NOW() - INTERVAL '20 days'),
  ('usr_06', 'frank.miller@example.com',  'Frank Miller',  'user',  NOW() - INTERVAL '15 days'),
  ('usr_07', 'grace.wilson@example.com',  'Grace Wilson',  'user',  NOW() - INTERVAL '10 days'),
  ('usr_08', 'henry.moore@example.com',   'Henry Moore',   'user',  NOW() - INTERVAL '7 days'),
  ('usr_09', 'iris.taylor@example.com',   'Iris Taylor',   'user',  NOW() - INTERVAL '3 days'),
  ('usr_10', 'james.anderson@example.com','James Anderson','user',  NOW() - INTERVAL '1 day');

INSERT INTO products (id, name, sku, price_cents, category, in_stock) VALUES
  ('prd_01', 'Wireless Headphones',    'WH-1000XM4', 34900, 'electronics',  true),
  ('prd_02', 'Mechanical Keyboard',    'MK-TKL-BLU', 12900, 'electronics',  true),
  ('prd_03', 'USB-C Hub 7-in-1',       'UCH-7IN1-BK', 4900, 'electronics',  true),
  ('prd_04', 'Standing Desk Mat',      'SDM-48X24-GY', 7900, 'accessories', false),
  ('prd_05', 'Laptop Stand Adjustable','LSA-ALU-SV',  8900, 'accessories',  true);

INSERT INTO orders (id, user_id, status, total_cents, created_at) VALUES
  ('ord_01', 'usr_01', 'completed', 34900, NOW() - INTERVAL '80 days'),
  ('ord_02', 'usr_02', 'completed', 17800, NOW() - INTERVAL '55 days'),
  ('ord_03', 'usr_03', 'pending',   12900, NOW() - INTERVAL '2 days'),
  ('ord_04', 'usr_01', 'completed', 4900,  NOW() - INTERVAL '30 days'),
  ('ord_05', 'usr_05', 'cancelled', 8900,  NOW() - INTERVAL '18 days');

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price_cents) VALUES
  ('oi_01', 'ord_01', 'prd_01', 1, 34900),
  ('oi_02', 'ord_02', 'prd_02', 1, 12900),
  ('oi_03', 'ord_02', 'prd_03', 1, 4900),
  ('oi_04', 'ord_03', 'prd_02', 1, 12900),
  ('oi_05', 'ord_04', 'prd_03', 1, 4900),
  ('oi_06', 'ord_05', 'prd_05', 1, 8900);

COMMIT;
```

### Step 4 — TypeScript Factories with Faker.js

```typescript
// test/factories/userFactory.ts
import { faker } from "@faker-js/faker";
import { User, UserRole } from "../../src/types";

// Set seed for deterministic output
faker.seed(42);

export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: `usr_${faker.string.nanoid(8)}`,
    email: faker.internet.email().toLowerCase(),
    name: faker.person.fullName(),
    role: "user" as UserRole,
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    ...overrides,
  };
}

export function createUsers(
  count: number,
  overrides: Partial<User> = {},
): User[] {
  return Array.from({ length: count }, () => createUser(overrides));
}

// test/factories/orderFactory.ts
export function createOrder(overrides: Partial<Order> = {}): Order {
  const createdAt = faker.date.past({ years: 1 });
  return {
    id: `ord_${faker.string.nanoid(8)}`,
    userId: `usr_${faker.string.nanoid(8)}`,
    status: faker.helpers.arrayElement(["pending", "completed", "cancelled"]),
    totalCents: faker.number.int({ min: 999, max: 99999 }),
    createdAt: createdAt.toISOString(),
    updatedAt: faker.date
      .between({ from: createdAt, to: new Date() })
      .toISOString(),
    ...overrides,
  };
}
```

**Usage in tests:**

```typescript
// tests/orderService.test.ts
import { createUser, createOrder } from "./factories";

describe("OrderService", () => {
  it("calculates total correctly", () => {
    const user = createUser({ id: "usr_test_123" });
    const order = createOrder({ userId: user.id, totalCents: 4900 });
    expect(order.totalCents).toBe(4900);
  });
});
```

### Step 5 — Python Factories with Faker

```python
# tests/factories/user_factory.py
from faker import Faker
from typing import Optional
import uuid

fake = Faker()
fake.seed_instance(42)  # deterministic

def make_user(overrides: Optional[dict] = None) -> dict:
    user = {
        'id':         f'usr_{uuid.uuid4().hex[:8]}',
        'email':      fake.email().lower(),
        'name':       fake.name(),
        'role':       'user',
        'created_at': fake.date_time_this_year().isoformat(),
    }
    return {**user, **(overrides or {})}

def make_users(count: int, overrides: Optional[dict] = None) -> list[dict]:
    return [make_user(overrides) for _ in range(count)]
```

### Step 6 — JSON Fixtures

```json
// test/fixtures/users.json
[
  {
    "id": "usr_fixture_01",
    "email": "alice@example.com",
    "name": "Alice Smith",
    "role": "admin",
    "createdAt": "2023-01-15T10:00:00.000Z"
  },
  {
    "id": "usr_fixture_02",
    "email": "bob@example.com",
    "name": "Bob Jones",
    "role": "user",
    "createdAt": "2023-03-20T14:30:00.000Z"
  }
]
```

---

## Output Format

1. **SQL seed file** — `BEGIN/COMMIT` transaction with all inserts in dependency order
2. **TypeScript factories** — one factory file per entity with `create()` and `createMany()`
3. **Python factories** — equivalent with Faker
4. **JSON fixtures** — static fixture files for predictable tests
5. **Usage example** — how to load in tests or dev setup scripts

---

## Safety & Confirmation

- Never use real email addresses, phone numbers, or personal data — always use `@example.com` or Faker-generated values.
- Make factories deterministic (seed Faker) for test stability.
- Maintain referential integrity — always generate parent records before child records.
- Flag any foreign key constraints that require specific IDs to be matched.

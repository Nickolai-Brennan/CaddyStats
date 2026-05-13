---
name: type-definition-generator
description: |
  Generates TypeScript type and interface definitions from JSON samples, API
  responses, database schemas, or plain-language descriptions. Use this skill
  whenever a user says "generate types from this JSON", "write TypeScript interfaces
  for this API response", "create types for this object", "type this data structure",
  "convert this JSON to TypeScript", "write a Zod schema for this", or "add types
  to this JavaScript code". Also activate when someone shares an API response payload
  and wants typed access in TypeScript. Do NOT use for writing runtime validation
  logic beyond types (use Zod/Yup manually) or generating database ORM models.
---

# Type Definition Generator

Generate precise TypeScript types, interfaces, and optional Zod/Yup schemas from
JSON samples, API specs, or prose descriptions.

## When to Use

- Integrating with a third-party API and need TypeScript types for the response
- Converting a JavaScript codebase to TypeScript
- Typing a database query result or ORM model
- Generating a Zod schema for runtime + compile-time validation

## When NOT to Use

- Generating full ORM models (Prisma, TypeORM schema)
- Writing runtime validation logic from scratch (this generates the types; validation is separate)
- Generating types for GraphQL (use graphql-codegen instead)

---

## Workflow

### Step 1 — Receive the Input

Accept any of:

- A JSON object or array (sample data)
- An API endpoint response (curl output, Postman export)
- A plain-language description of a data structure
- An existing JavaScript object to type

Ask: "Should I generate plain TypeScript interfaces, or also a Zod schema for runtime validation?"

### Step 2 — Infer Types

For each value in the JSON sample, infer the TypeScript type:

| JSON value         | TypeScript type                                 |
| ------------------ | ----------------------------------------------- |
| `"string"`         | `string`                                        |
| `123`, `1.5`       | `number`                                        |
| `true`, `false`    | `boolean`                                       |
| `null`             | `null` (mark field as optional: `field?: Type`) |
| `[]` empty array   | `unknown[]` (ask for element type)              |
| `[1, 2, 3]`        | `number[]`                                      |
| `[{...}]`          | `TypeName[]` (define nested interface)          |
| `{}` nested object | New interface (extract and name separately)     |
| ISO date string    | `string` — add JSDoc `/** ISO 8601 date */`     |
| UUID string        | `string` — add JSDoc `/** UUID */`              |

Rules:

- If a field is `null` in the sample, mark it `field: Type | null`
- If a field is missing in some samples, mark it `field?: Type`
- Prefer `interface` over `type` for object shapes (more extensible)
- Use `type` for unions and primitives

### Step 3 — Name the Types

Follow these conventions:

- **PascalCase** for all type/interface names: `UserProfile`, `OrderItem`
- **Suffix by layer:** `UserResponse` (API), `UserRecord` (DB), `UserDto` (DTO)
- **Arrays:** `User[]` not `Users` — avoid pluralizing type names
- Extract nested objects into their own named interfaces

### Step 4 — Generate the Output

**From this JSON sample:**

```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "name": "Alice Smith",
  "createdAt": "2024-01-15T10:00:00Z",
  "role": "admin",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "country": "US"
  },
  "tags": ["beta", "premium"],
  "lastLoginAt": null
}
```

**Generated TypeScript:**

```typescript
export interface Address {
  street: string;
  city: string;
  country: string;
}

export type UserRole = "admin" | "user" | "viewer";

export interface User {
  /** UUID */
  id: string;
  email: string;
  name: string;
  /** ISO 8601 date */
  createdAt: string;
  role: UserRole;
  address: Address;
  tags: string[];
  /** ISO 8601 date, null if never logged in */
  lastLoginAt: string | null;
}
```

**Optional Zod schema:**

```typescript
import { z } from "zod";

export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  country: z.string().length(2),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.string().datetime(),
  role: z.enum(["admin", "user", "viewer"]),
  address: AddressSchema,
  tags: z.array(z.string()),
  lastLoginAt: z.string().datetime().nullable(),
});

export type User = z.infer<typeof UserSchema>;
```

### Step 5 — Handle Arrays and Pagination

For API responses that wrap data in pagination:

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    hasNextPage: boolean;
  };
}

// Usage:
type UsersResponse = PaginatedResponse<User>;
```

---

## Output Format

1. **TypeScript interfaces/types** — complete, ready to paste into a `.d.ts` or `.ts` file
2. **Optional Zod schema** — if requested
3. **Notes** — any assumptions made about union types or optional fields

---

## Safety & Confirmation

- Note that types inferred from a single JSON sample may miss optional fields — recommend testing with multiple real examples.
- Flag if a string field looks like an enum but only one value was in the sample (add `// TODO: verify all possible values`).
- For sensitive fields (password, token, secret), add a JSDoc comment: `/** Never log or expose this field */`.

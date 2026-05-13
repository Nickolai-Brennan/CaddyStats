---
name: api-client-scaffolder
description: |
  Scaffolds API client code from an OpenAPI/Swagger spec, a list of endpoints, or
  a description of an API. Generates typed client functions, error handling, retry
  logic, and authentication setup. Use this skill whenever a user says "write an
  API client for this", "scaffold a client from this OpenAPI spec", "generate API
  wrapper functions", "help me integrate with this API", "write the fetch calls for
  these endpoints", "create an SDK wrapper", or "give me typed API functions for
  this service". Also activate when a user shares an API spec or endpoint list and
  needs code to call it. Supports Python, TypeScript, and JavaScript. Do NOT use
  for designing new APIs (use api-design-skill) or writing backend route handlers.
---

# API Client Scaffolder

Generate typed, production-ready API client code from an API spec or endpoint list,
complete with authentication, error handling, retry logic, and TypeScript types.

## When to Use

- Integrating with a third-party REST API
- Wrapping an internal API in a typed client for frontend or another service
- Generating a starting point SDK from an OpenAPI spec
- Standardizing how multiple services call a shared API

## When NOT to Use

- Designing a new API (use `api-design-skill`)
- Writing backend route handlers
- GraphQL clients (different patterns)

---

## Workflow

### Step 1 — Receive the API Definition

Accept any of:

1. An OpenAPI / Swagger YAML or JSON spec (or file path)
2. A list of endpoints with method, path, params, and response shape
3. A prose description of the API and its endpoints
4. A link to API documentation (if web access available)

Ask:

1. **Target language:** TypeScript, JavaScript, or Python?
2. **Auth method:** API key (header/query), Bearer token, OAuth, Basic auth?
3. **Base URL:** Production and/or staging?
4. **Special requirements:** Retry logic? Rate limit handling? Pagination helpers?

### Step 2 — Generate the Client Structure

For **TypeScript / JavaScript**, generate:

```
api-client/
├── client.ts          — base HTTP client with auth and error handling
├── types.ts           — TypeScript interfaces for all request/response shapes
├── endpoints/
│   ├── users.ts       — user-related endpoint functions
│   └── orders.ts      — order-related endpoint functions
└── index.ts           — barrel export
```

For **Python**, generate:

```
api_client/
├── client.py          — base client class with auth and error handling
├── models.py          — dataclasses/Pydantic models for request/response
├── endpoints/
│   ├── users.py
│   └── orders.py
└── __init__.py
```

### Step 3 — Generate Base Client

**TypeScript base client:**

```typescript
// client.ts
const API_BASE_URL = process.env.API_BASE_URL ?? "https://api.example.com/v1";
const API_KEY = process.env.API_KEY;

async function apiRequest<T>(
  method: string,
  path: string,
  options: { body?: unknown; params?: Record<string, string> } = {},
): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) =>
      url.searchParams.set(k, v),
    );
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return response.json() as T;
}
```

**Python base client:**

```python
# client.py
import os
import time
import requests
from typing import Any, TypeVar, Type

T = TypeVar('T')
API_BASE_URL = os.environ.get('API_BASE_URL', 'https://api.example.com/v1')
API_KEY = os.environ['API_KEY']

class APIClient:
    def __init__(self, base_url: str = API_BASE_URL, api_key: str = API_KEY):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        })

    def request(self, method: str, path: str, **kwargs: Any) -> Any:
        response = self.session.request(method, f'{self.base_url}{path}', **kwargs, timeout=30)
        response.raise_for_status()
        return response.json()
```

### Step 4 — Generate Endpoint Functions

For each endpoint, generate a typed function:

```typescript
// endpoints/users.ts
import { apiRequest } from "../client";
import { User, CreateUserRequest } from "../types";

export async function getUser(userId: string): Promise<User> {
  return apiRequest<User>("GET", `/users/${userId}`);
}

export async function createUser(data: CreateUserRequest): Promise<User> {
  return apiRequest<User>("POST", "/users", { body: data });
}
```

### Step 5 — Add Retry Logic (Optional)

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  backoffMs = 1000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      if (err instanceof ApiError && err.status >= 400 && err.status < 500)
        throw err; // Don't retry 4xx
      await new Promise((resolve) => setTimeout(resolve, backoffMs * attempt));
    }
  }
  throw new Error("unreachable");
}
```

---

## Output Format

Complete, runnable code files (not pseudo-code). Each file in its own code block with filename as a comment.

Include:

- A README snippet showing how to install and use the client
- Environment variable names required (as a list)
- Example usage for the most common endpoint

---

## Safety & Confirmation

- Never hardcode API keys or secrets — always use `process.env` or `os.environ`.
- Flag any endpoint that performs destructive actions (delete, overwrite) with a comment.
- Use `timeout` on all HTTP requests to prevent hanging.
- Validate response shapes before parsing — add error messages for unexpected response formats.

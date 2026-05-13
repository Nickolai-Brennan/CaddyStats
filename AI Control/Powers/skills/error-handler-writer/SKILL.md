---
name: error-handler-writer
description: |
  Writes consistent, production-ready error handling patterns for a given language
  and framework: custom error classes, try/catch blocks, centralized error middleware,
  and structured error responses. Use this skill whenever a user says "write error
  handling for this", "add try/catch here", "create a custom error class",
  "how should I handle errors in this API?", "write an error middleware",
  "standardize my error responses", or "add proper error handling to this function".
  Also activate when code is missing error handling or has inconsistent error patterns.
  Supports Node.js/Express, Python/FastAPI, Go, and Java/Spring. Do NOT use for
  logging infrastructure setup (separate concern) or writing retry logic (use
  background-job-designer).
---

# Error Handler Writer

Design and write consistent, informative error handling patterns that make
failures visible, debuggable, and user-friendly.

## When to Use

- Adding error handling to a function, route, or service for the first time
- Standardizing inconsistent error patterns across a codebase
- Creating a centralized error middleware for an API
- Defining a custom error hierarchy for a domain

## When NOT to Use

- Setting up structured logging (separate infrastructure concern)
- Writing retry/circuit-breaker logic (use `background-job-designer`)
- Frontend error boundaries (different pattern — see `react-component-generator`)

---

## Workflow

### Step 1 — Understand the Context

Ask for:

1. **Language and framework:** Node.js/Express, Python/FastAPI, Go, Java/Spring, other
2. **What to handle:** A specific function, a whole API layer, or a service boundary
3. **Error types to cover:** Validation, auth, not-found, DB errors, external API errors
4. **API response format:** JSON REST, GraphQL, internal service

### Step 2 — Design the Error Hierarchy

Before writing handlers, define the error classes:

**Node.js / TypeScript:**

```typescript
// Base class
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Domain-specific subclasses
export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly fields?: Record<string, string>,
  ) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN");
  }
}
```

**Python:**

```python
class AppError(Exception):
    def __init__(self, message: str, status_code: int, code: str):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(message)

class ValidationError(AppError):
    def __init__(self, message: str, fields: dict = None):
        self.fields = fields or {}
        super().__init__(message, 400, 'VALIDATION_ERROR')

class NotFoundError(AppError):
    def __init__(self, resource: str):
        super().__init__(f'{resource} not found', 404, 'NOT_FOUND')
```

### Step 3 — Write the Centralized Error Handler

**Express middleware:**

```typescript
import { Request, Response, NextFunction } from "express";
import { AppError } from "./errors";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Known operational error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err instanceof ValidationError && { fields: err.fields }),
      },
    });
    return;
  }

  // Unknown / programming error — log fully, return generic message
  console.error("Unexpected error:", err);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred. Please try again.",
    },
  });
}

// Catch async errors — wrap route handlers
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

**FastAPI exception handler:**

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "message": exc.message}},
    )

@app.exception_handler(Exception)
async def unhandled_error_handler(request: Request, exc: Exception):
    # Log exc here
    return JSONResponse(
        status_code=500,
        content={"error": {"code": "INTERNAL_ERROR", "message": "An unexpected error occurred."}},
    )
```

### Step 4 — Write Usage in Route Handlers

```typescript
// Express route using asyncHandler + custom errors
router.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await userService.findById(req.params.id);
    if (!user) throw new NotFoundError("User");
    res.json(user);
  }),
);

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    const { email, name } = req.body;
    if (!email)
      throw new ValidationError("Missing fields", { email: "required" });
    const user = await userService.create({ email, name });
    res.status(201).json(user);
  }),
);
```

### Step 5 — Standardize Error Response Shape

All API errors should use a consistent JSON envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required fields",
    "fields": {
      "email": "required",
      "name": "must be at least 2 characters"
    }
  }
}
```

---

## Output Format

1. **Error class hierarchy** — base + domain subclasses
2. **Centralized error handler** — middleware or exception handler
3. **Async wrapper utility** — if applicable for the framework
4. **Usage examples** — 2–3 route handler examples using the pattern
5. **Error response shape** — JSON schema for API consumers

---

## Safety & Confirmation

- Never expose stack traces or internal details in production API responses.
- Distinguish `isOperational` (expected, safe to show user) from programming errors (log fully, show generic message).
- Always log unexpected errors server-side before returning a 500.
- Confirm the error response format before building — it becomes a client contract.

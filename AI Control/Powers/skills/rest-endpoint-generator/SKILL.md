---
name: rest-endpoint-generator
description: |
  Generates REST API endpoint handlers with input validation, authentication checks,
  error handling, and OpenAPI documentation stubs. Use this skill whenever a user
  says "write a REST endpoint for...", "create an API route for...", "generate a
  CRUD API", "scaffold a POST endpoint", "write a REST handler for this resource",
  "generate Express routes", "write a FastAPI endpoint", or "build the API layer
  for this feature". Also activate when someone describes a resource and needs API
  endpoints to manage it. Supports Express/Node.js, FastAPI/Python, and Go net/http.
  Do NOT use for GraphQL resolvers (use graphql-schema-writer) or frontend API
  client code (use api-client-scaffolder).
---

# REST Endpoint Generator

Scaffold production-ready REST API handlers with validation, authentication,
error responses, and OpenAPI documentation comments.

## When to Use

- Adding new API endpoints for a resource (CRUD or custom actions)
- Standardizing the request/response shape across routes
- Scaffolding a new API controller/router for a service
- Adding validation and auth to existing bare-bones routes

## When NOT to Use

- GraphQL resolvers (use `graphql-schema-writer`)
- Frontend API client code (use `api-client-scaffolder`)
- Full backend service architecture design

---

## Workflow

### Step 1 — Define the Resource

Ask for:

1. **Resource name:** (e.g., `User`, `Post`, `Order`)
2. **Operations needed:** GET (list), GET (single), POST (create), PUT/PATCH (update), DELETE
3. **Fields:** What data does the resource have?
4. **Authentication:** Public / bearer token / API key / role-based?
5. **Framework:** Express/Node.js, FastAPI, Go, or other
6. **Validation library:** Zod, Joi, class-validator, Pydantic?

### Step 2 — Design the API Contract

```
Resource: User

Endpoints:
  GET    /users              List users (paginated)
  GET    /users/:id          Get user by ID
  POST   /users              Create user
  PATCH  /users/:id          Update user (partial)
  DELETE /users/:id          Delete user

Request bodies:
  POST /users:   { email: string, name: string, role?: 'admin'|'user' }
  PATCH /users/:id: { name?: string, role?: 'admin'|'user' }

Auth:
  GET /users       — authenticated, any role
  GET /users/:id   — authenticated, any role
  POST /users      — authenticated, admin only
  PATCH /users/:id — authenticated, admin or self
  DELETE /users/:id— authenticated, admin only
```

### Step 3 — Generate the Endpoint Handlers

**Express + TypeScript + Zod:**

```typescript
// routes/users.ts
import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import { userService } from "../services/userService";
import { NotFoundError, ValidationError } from "../errors";

const router = Router();

// ── Validation Schemas ──
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(["admin", "user"]).default("user"),
});

const UpdateUserSchema = CreateUserSchema.partial().omit({ email: true });

const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

// ── GET /users ──
/**
 * @openapi
 * /users:
 *   get:
 *     summary: List users
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 */
router.get(
  "/",
  requireAuth(),
  asyncHandler(async (req, res) => {
    const { page, perPage } = PaginationSchema.parse(req.query);
    const result = await userService.list({ page, perPage });
    res.json(result);
  }),
);

// ── GET /users/:id ──
router.get(
  "/:id",
  requireAuth(),
  asyncHandler(async (req, res) => {
    const user = await userService.findById(req.params.id);
    if (!user) throw new NotFoundError("User");
    res.json(user);
  }),
);

// ── POST /users ──
router.post(
  "/",
  requireAuth(),
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const body = CreateUserSchema.parse(req.body);
    const user = await userService.create(body);
    res.status(201).json(user);
  }),
);

// ── PATCH /users/:id ──
router.patch(
  "/:id",
  requireAuth(),
  asyncHandler(async (req, res) => {
    const existing = await userService.findById(req.params.id);
    if (!existing) throw new NotFoundError("User");

    // Allow admin or self
    const isSelf = req.user!.id === req.params.id;
    if (!isSelf && req.user!.role !== "admin") throw new ForbiddenError();

    const body = UpdateUserSchema.parse(req.body);
    const updated = await userService.update(req.params.id, body);
    res.json(updated);
  }),
);

// ── DELETE /users/:id ──
router.delete(
  "/:id",
  requireAuth(),
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const existing = await userService.findById(req.params.id);
    if (!existing) throw new NotFoundError("User");
    await userService.delete(req.params.id);
    res.status(204).send();
  }),
);

export { router as usersRouter };
```

**FastAPI + Pydantic:**

```python
# routers/users.py
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, EmailStr
from typing import Literal, Optional
from ..auth import require_auth, require_role, CurrentUser
from ..services.user_service import user_service

router = APIRouter(prefix="/users", tags=["users"])

class CreateUserRequest(BaseModel):
    email: EmailStr
    name: str
    role: Literal['admin', 'user'] = 'user'

class UpdateUserRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[Literal['admin', 'user']] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    created_at: str

@router.get("/", response_model=list[UserResponse])
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(require_auth),
):
    return await user_service.list(page=page, per_page=per_page)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, current_user = Depends(require_auth)):
    user = await user_service.find_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    body: CreateUserRequest,
    current_user = Depends(require_role('admin')),
):
    return await user_service.create(body.model_dump())

@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    body: UpdateUserRequest,
    current_user = Depends(require_auth),
):
    user = await user_service.find_by_id(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    if current_user.id != user_id and current_user.role != 'admin':
        raise HTTPException(403, "Forbidden")
    return await user_service.update(user_id, body.model_dump(exclude_unset=True))

@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: str,
    current_user = Depends(require_role('admin')),
):
    user = await user_service.find_by_id(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    await user_service.delete(user_id)
```

---

## Standard Response Shapes

```json
// List response
{
  "data": [...],
  "pagination": { "total": 100, "page": 1, "perPage": 20, "hasNextPage": true }
}

// Single resource
{ "id": "...", "email": "...", "name": "...", "createdAt": "..." }

// Error response (all error types)
{ "error": { "code": "NOT_FOUND", "message": "User not found" } }
```

---

## Output Format

1. **API contract** — table of endpoints with method, path, auth, and request/response shape
2. **Route file** — complete handler code for all endpoints
3. **Validation schemas** — Zod/Pydantic models
4. **Service interface stub** — what methods the service layer needs to implement
5. **OpenAPI/JSDoc stubs** — for each endpoint

---

## Safety & Confirmation

- Always validate input before any database operation.
- Always check authorization at the resource level (not just at the route level).
- Never return a 200 for a create — use 201.
- Never return a body for a DELETE — use 204 No Content.
- Confirm the authentication strategy before generating — it must match the existing auth middleware.

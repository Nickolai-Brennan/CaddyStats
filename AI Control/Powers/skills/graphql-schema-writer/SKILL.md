---
name: graphql-schema-writer
description: |
  Writes GraphQL schemas (SDL), resolvers, mutations, subscriptions, and input
  type definitions. Use this skill whenever a user says "write a GraphQL schema",
  "add a GraphQL mutation for...", "create a GraphQL type for...", "write a
  resolver for this query", "scaffold a GraphQL API", "add a subscription to this
  schema", "define GraphQL input types for...", or "convert my REST API to
  GraphQL". Also activate when someone describes a data model and wants it
  expressed as GraphQL types. Works with Apollo Server, graphql-js, and Pothos
  (code-first). Do NOT use for REST API endpoints (use rest-endpoint-generator)
  or full schema federation architecture (too complex for one skill).
---

# GraphQL Schema Writer

Design and write GraphQL schemas, resolvers, mutations, and subscriptions with
proper typing, error handling, and authorization patterns.

## When to Use

- Scaffolding a new GraphQL API or adding types to an existing schema
- Writing resolvers for new query or mutation fields
- Adding subscriptions for real-time features
- Converting a REST resource into GraphQL types

## When NOT to Use

- REST API routes (use `rest-endpoint-generator`)
- Federation/subgraph architecture (complex distributed GraphQL)
- GraphQL client code (use Relay, Apollo Client, or `api-client-scaffolder`)

---

## Workflow

### Step 1 — Understand the Data Model

Ask for:

1. **Entities:** What are the main types? (User, Post, Comment, Order)
2. **Relationships:** How are types connected?
3. **Operations:** Which queries, mutations, subscriptions are needed?
4. **Auth:** Public vs. authenticated fields/operations?
5. **Framework:** Apollo Server / graphql-js / Pothos (code-first)?

### Step 2 — Write the SDL Schema

```graphql
# schema.graphql

# ── Scalars ──
scalar DateTime
scalar Upload
scalar JSON

# ── Enums ──
enum UserRole {
  ADMIN
  USER
  GUEST
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

# ── Types ──
type User {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  posts(status: PostStatus, limit: Int = 10, offset: Int = 0): PostConnection!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  body: String!
  status: PostStatus!
  author: User!
  tags: [String!]!
  publishedAt: DateTime
  createdAt: DateTime!
}

# ── Pagination ──
type PostConnection {
  nodes: [Post!]!
  totalCount: Int!
  pageInfo: PageInfo!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# ── Errors ──
interface Error {
  message: String!
}

type ValidationError implements Error {
  message: String!
  field: String!
}

type NotFoundError implements Error {
  message: String!
}

# ── Input Types ──
input CreatePostInput {
  title: String!
  body: String!
  tags: [String!]
  status: PostStatus = DRAFT
}

input UpdatePostInput {
  title: String
  body: String
  tags: [String!]
  status: PostStatus
}

# ── Union Result Types (for errors) ──
union CreatePostResult = Post | ValidationError
union UpdatePostResult = Post | ValidationError | NotFoundError

# ── Root Types ──
type Query {
  me: User
  user(id: ID!): User
  users(limit: Int = 20, offset: Int = 0): [User!]!
  post(id: ID!): Post
  posts(authorId: ID, status: PostStatus, limit: Int = 20, offset: Int = 0): PostConnection!
}

type Mutation {
  createPost(input: CreatePostInput!): CreatePostResult!
  updatePost(id: ID!, input: UpdatePostInput!): UpdatePostResult!
  deletePost(id: ID!): Boolean!
  publishPost(id: ID!): Post!
}

type Subscription {
  postPublished: Post!
  postUpdated(authorId: ID): Post!
}
```

### Step 3 — Write Resolvers

**Apollo Server resolver map:**

```typescript
// resolvers/index.ts
import { Resolvers } from "../generated/graphql";
import { AuthenticationError, ForbiddenError, UserInputError } from "apollo-server-core";

export const resolvers: Resolvers = {
  Query: {
    me: (_parent, _args, ctx) => {
      if (!ctx.user) return null;
      return ctx.userService.findById(ctx.user.id);
    },

    post: async (_parent, { id }, ctx) => {
      const post = await ctx.postService.findById(id);
      return post ?? null;
    },

    posts: (_parent, args, ctx) => {
      return ctx.postService.list(args);
    },
  },

  Mutation: {
    createPost: async (_parent, { input }, ctx) => {
      if (!ctx.user) throw new AuthenticationError("Login required");

      const errors = validateCreatePost(input);
      if (errors.length > 0) {
        return {
          __typename: "ValidationError",
          message: errors[0].message,
          field: errors[0].field,
        };
      }

      const post = await ctx.postService.create({
        ...input,
        authorId: ctx.user.id,
      });
      return { __typename: "Post", ...post };
    },

    deletePost: async (_parent, { id }, ctx) => {
      if (!ctx.user) throw new AuthenticationError("Login required");

      const post = await ctx.postService.findById(id);
      if (!post) throw new Error("Post not found");
      if (post.authorId !== ctx.user.id && ctx.user.role !== "ADMIN") {
        throw new ForbiddenError("Not authorized");
      }

      await ctx.postService.delete(id);
      return true;
    },
  },

  Subscription: {
    postPublished: {
      subscribe: (_parent, _args, ctx) => ctx.pubsub.asyncIterator("POST_PUBLISHED"),
    },
  },

  // Field resolvers — resolve relationships lazily
  User: {
    posts: (user, args, ctx) => ctx.postService.listByAuthor(user.id, args),
  },

  Post: {
    author: (post, _args, ctx) => ctx.userService.findById(post.authorId),
  },
};
```

### Step 4 — Context and Auth

```typescript
// context.ts
export interface Context {
  user: AuthUser | null;
  userService: UserService;
  postService: PostService;
  pubsub: PubSub;
}

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }): Promise<Context> => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const user = token ? await verifyToken(token) : null;
    return { user, userService, postService, pubsub };
  },
});
```

---

## Output Format

1. **SDL schema file** — complete `.graphql` type definitions
2. **Resolver map** — typed resolvers for queries and mutations
3. **Context type** — what goes in `ctx`
4. **Input type definitions** — for create/update operations
5. **Error union types** — for proper error handling without exceptions

---

## Safety & Confirmation

- Never expose sensitive fields (password hash, internal IDs) in the schema without explicit authorization.
- Use union result types (`Post | ValidationError`) for mutations — not exceptions for expected errors.
- Always check authorization in resolvers, not just at the route level.
- For subscriptions, confirm the pubsub implementation (Redis vs. in-memory) before scaffolding.
- Add depth limiting and query complexity analysis before shipping to production.

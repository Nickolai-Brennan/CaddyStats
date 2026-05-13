---
name: architecture-diagram-generator
description: |
  Generates architecture diagrams as Mermaid code from system descriptions,
  service lists, or existing documentation. Supports flowcharts, sequence diagrams,
  entity-relationship diagrams, and C4 context diagrams. Use this skill whenever
  a user says "draw an architecture diagram", "create a Mermaid diagram for this",
  "diagram this system", "show me a sequence diagram for this flow", "generate an
  ERD for these tables", "visualize this API flow", "draw the data flow for this",
  or "make a diagram of how these services connect". Also activate when a user
  describes a system and wants it visualized. Do NOT use for creating actual
  architecture (use system-design approaches), generating image files directly,
  or creating UI wireframes.
---

# Architecture Diagram Generator

Generate clear, readable Mermaid diagrams for system architectures, service
dependencies, API flows, and data models — ready to paste into Notion, GitHub,
or any Markdown renderer.

## When to Use

- Documenting how services connect in a system
- Visualizing API request/response flows
- Drawing ERDs for database schemas
- Creating C4 context diagrams for documentation
- Showing data pipelines or workflow sequences

## When NOT to Use

- Designing the architecture itself (this is a visualization skill)
- Generating image files (.png, .svg) — Mermaid renders in Markdown viewers
- UI wireframes or screen mockups

---

## Workflow

### Step 1 — Understand the Diagram Need

Ask the user:

1. **What to diagram:** System overview / API flow / Data model / Workflow / Service map
2. **Diagram type:** Flowchart / Sequence / ERD / C4 / Class / State machine / Gantt
3. **Level of detail:** High-level overview vs. detailed with all fields/methods
4. **Components involved:** List of services, tables, actors, or steps

### Step 2 — Select the Right Diagram Type

| Use case                           | Mermaid type                     |
| ---------------------------------- | -------------------------------- |
| Service topology / system overview | `flowchart LR` or `flowchart TD` |
| API or event sequence              | `sequenceDiagram`                |
| Database tables and relationships  | `erDiagram`                      |
| System context / C4                | `C4Context`                      |
| Deployment / infrastructure        | `flowchart` with styled nodes    |
| State machine                      | `stateDiagram-v2`                |
| Process / workflow steps           | `flowchart TD`                   |
| Project timeline                   | `gantt`                          |

### Step 3 — Generate the Mermaid Code

#### System Architecture (Flowchart)

```mermaid
flowchart LR
    Client["🖥️ Web Client"]
    LB["Load Balancer"]
    API["API Server\n(Node.js)"]
    Auth["Auth Service"]
    DB[("PostgreSQL")]
    Cache[("Redis Cache")]
    Queue["Message Queue\n(RabbitMQ)"]
    Worker["Background Worker"]

    Client --> LB
    LB --> API
    API --> Auth
    API --> DB
    API --> Cache
    API --> Queue
    Queue --> Worker
    Worker --> DB
```

#### API Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant App
    participant AuthService
    participant Database

    User->>App: POST /login {email, password}
    App->>AuthService: ValidateCredentials(email, password)
    AuthService->>Database: SELECT user WHERE email=?
    Database-->>AuthService: User record
    AuthService-->>App: JWT token
    App-->>User: 200 OK {token, expiresAt}
```

#### Entity-Relationship Diagram

```mermaid
erDiagram
    USER {
        uuid id PK
        string email UK
        string full_name
        timestamp created_at
    }
    ORDER {
        uuid id PK
        uuid user_id FK
        decimal amount
        string status
        timestamp created_at
    }
    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        decimal unit_price
    }

    USER ||--o{ ORDER : "places"
    ORDER ||--|{ ORDER_ITEM : "contains"
```

### Step 4 — Apply Styling (Optional)

For flowcharts, add node styles for visual clarity:

```mermaid
flowchart TD
    API["API Server"]
    DB[("Database")]

    style API fill:#4A90D9,color:#fff
    style DB fill:#7B7B7B,color:#fff
```

### Step 5 — Present and Iterate

Show the diagram code and note:

- "This renders in GitHub Markdown, Notion, GitLab, and most Markdown editors."
- "Tip: Use [Mermaid Live Editor](https://mermaid.live) to preview."

Ask: "Should I add more detail, change the direction, or adjust any components?"

---

## Output Format

A Mermaid code block with:

1. The diagram type declaration on the first line
2. Clean, readable node IDs (not random letters)
3. Descriptive labels using quotes for multi-word/special character names
4. Grouping related nodes with `subgraph` where helpful

Include a brief explanation of what the diagram shows and any key relationships to note.

---

## Safety & Confirmation

- Don't include real hostnames, IP addresses, or internal service names unless the user explicitly provides them for documentation.
- For sequence diagrams showing auth flows, note any security concerns you observe (e.g., token passed in query string).
- Verify the diagram is syntactically valid Mermaid before presenting (review brackets, arrows, quoting).

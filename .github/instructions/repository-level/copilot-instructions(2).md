# Copilot Instructions

This repository is a **Startup** scaffold — a structured workspace for AI-assisted project development. Use the directory map below to understand where to place and find every asset type.

---

## Repository Map

```
Startup/
├── .github/
│   └── copilot-instructions.md     ← this file
├── Actions/
│   └── Doc Creation/               ← document metadata templates
├── Automations/
│   ├── Agents/                     ← .agent.md files defining AI agent roles
│   ├── Instructions/               ← reference guides (e.g., how-to create custom instructions)
│   ├── Prompts/                    ← reusable prompt templates
│   ├── Skills/                     ← reusable, deterministic capability definitions
│   ├── Information/                ← knowledge/context retrieval sources
│   └── master-list.md              ← index of all automation assets
├── Docs/
│   ├── KBD/                        ← knowledge-base documents
│   ├── PRD/                        ← product requirement documents
│   └── Technical/                  ← technical specs
├── System/
│   ├── architecture.md             ← high-level architecture (in progress)
│   └── changelog.md                ← repo changelog (in progress)
├── Workflow/
│   ├── AI Execution Methods.md     ← AI orchestration meta-prompt & decision framework
│   └── Guide.md                    ← execution process system (9-step lifecycle)
├── In Action.md                    ← active project tracker
└── Master Stack.txt                ← full technology stack reference
```

---

## Directory Conventions

### `.github/`

- `copilot-instructions.md` — This file. Defines repo conventions for GitHub Copilot and all AI agents working in this repo.

### `Actions/`

- **`Doc Creation/`** — Templates that define the metadata shape of a new document (title, type, owner, status, tags). Copy a template, fill in the front-matter, and move the finished doc to `Docs/`.

### `Automations/`

All reusable AI automation assets live here.

| Sub-folder       | Purpose                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `Agents/`        | `.agent.md` files that define an AI agent's persona, goals, and tool access.                      |
| `Instructions/`  | Reference guides explaining _how_ to author each asset type (agents, prompts, skills, etc.).      |
| `Prompts/`       | Standalone, reusable prompt templates. Use `{{placeholders}}` for variable inputs.                |
| `Skills/`        | Deterministic, single-responsibility capability definitions. Skills are composed into agents.     |
| `Information/`   | Knowledge files and data sources injected as context at runtime.                                  |
| `master-list.md` | The canonical index of every file in `Automations/`. Update it whenever you add or remove a file. |

### `Docs/`

Human-readable project documentation.

| Sub-folder   | Purpose                                                                           |
| ------------ | --------------------------------------------------------------------------------- |
| `KBD/`       | Knowledge-base documents — reference material, FAQs, glossaries.                  |
| `PRD/`       | Product requirement documents — feature specs, user stories, acceptance criteria. |
| `Technical/` | Technical specs — architecture decisions, API contracts, data models.             |

### `System/`

Meta-information about the repository itself.

- `architecture.md` — High-level system architecture diagram and narrative.
- `changelog.md` — Human-readable log of significant changes to the repo structure or major decisions.

### `Workflow/`

Process documents that govern _how_ work is done in this repo.

- `AI Execution Methods.md` — The master AI orchestration meta-prompt and decision framework.
- `Guide.md` — The 9-step execution lifecycle for shipping any feature or document.

### Root files

- `In Action.md` — Live tracker of active tasks, owners, and status.
- `Master Stack.txt` — The full technology stack reference for this project.

---

## Authoring Guidelines

1. **Front-matter** — Every Markdown file should start with YAML front-matter:
   ```yaml
   ---
   title: ""
   type: "" # agent | prompt | skill | doc | spec | guide
   status: draft # draft | review | active | archived
   owner: ""
   updated: YYYY-MM-DD
   ---
   ```
2. **Naming** — Use `kebab-case` for file names in `Automations/`. Use `Title Case` for files in `Docs/` and `Workflow/`.
3. **Master list** — After adding any file to `Automations/`, add an entry to `Automations/master-list.md`.
4. **In Action tracker** — Move tasks through `Backlog → In Progress → Review → Done` columns in `In Action.md`.
5. **Changelog** — Record every structural change or major decision in `System/changelog.md`.

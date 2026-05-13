---
name: codebase-onboarding-guide
description: |
  Generates a developer onboarding guide for a codebase: explains architecture,
  key directories, setup steps, coding conventions, and how to make a first
  contribution. Use this skill whenever a user says "write an onboarding guide for
  this repo", "help new devs get started with this codebase", "create a developer
  README", "write a contributing guide", "explain how this project is structured",
  or "help me document how to set up this project". Also activate when a new
  engineer is starting and needs a structured introduction to a codebase. Do NOT
  use for writing API reference docs or full system architecture documents.
---

# Codebase Onboarding Guide

Create a structured guide that helps new developers understand a codebase, set up
their environment, and make their first contribution with confidence.

## When to Use

- A new engineer is joining the team and the existing docs are sparse
- The project README exists but doesn't explain the architecture or conventions
- You're open-sourcing a project and need a CONTRIBUTING.md
- You want to reduce time-to-first-PR for new team members

## When NOT to Use

- Full API reference documentation (use `documentation-generator`)
- System architecture deep-dives (scoped separately)
- Writing onboarding for non-developers (product, marketing, etc.)

---

## Workflow

### Step 1 — Gather Information

Ask for or infer from available files:

1. **Repo name, tech stack, and primary language**
2. **Project structure:** directory layout (tree output or description)
3. **Setup requirements:** OS, tools, env vars, DB setup, test commands
4. **Architecture overview:** key services/modules and how they fit together
5. **Conventions:** branch naming, PR process, code style, test requirements
6. **First task suggestion:** what's a good starter issue for a new contributor?

### Step 2 — Structure the Guide

Produce a guide with these sections:

```markdown
# Onboarding Guide — [Project Name]

## Welcome

[1–2 sentence project summary and purpose]

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Architecture Overview](#architecture-overview)
5. [Development Workflow](#development-workflow)
6. [Testing](#testing)
7. [Conventions & Standards](#conventions--standards)
8. [Making Your First PR](#making-your-first-pr)
9. [Getting Help](#getting-help)
```

### Step 3 — Prerequisites Section

List:

- Required tools with minimum versions (Node 18+, Python 3.11+, Docker 24+)
- OS requirements if any
- Access/permissions needed (GitHub, AWS, internal tools)

### Step 4 — Getting Started Section

Numbered setup steps with copy-pasteable commands:

```bash
# 1. Clone the repo
git clone https://github.com/org/repo && cd repo

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env with your local values (see Secrets section below)

# 4. Start the dev server
npm run dev
```

Include: how to verify the setup is working ("you should see X at localhost:Y").

### Step 5 — Project Structure Section

```
src/
├── api/          # Express route handlers
├── services/     # Business logic layer
├── models/       # Database models (Prisma)
├── utils/        # Shared utilities
└── __tests__/    # Test files
```

Brief (1-sentence) description of each key directory.

### Step 6 — Development Workflow Section

Cover:

- Branching strategy (feature/[ticket-id]-description)
- Commit message format (Conventional Commits, etc.)
- PR process (draft PRs, review requirements)
- How to run linting and tests before pushing

### Step 7 — Making Your First PR

A checklist new contributors can follow:

```markdown
## First PR Checklist

- [ ] Branch from `main` using `feature/[description]`
- [ ] Code passes `npm run lint` and `npm run test`
- [ ] PR description explains what and why
- [ ] Linked to an issue (if applicable)
- [ ] Requested review from [team/person]
```

---

## Output Format

A single Markdown document structured as shown above.

Optionally split into:

- `README.md` — project summary and quick start
- `CONTRIBUTING.md` — conventions, workflow, PR process
- `docs/onboarding.md` — full developer guide

---

## Safety & Confirmation

- Never include real secrets, tokens, or passwords in the guide. Use `<YOUR_VALUE_HERE>` placeholders.
- Flag any `.env.example` values that appear to be real credentials.
- Confirm the stack and architecture details with the user before finalizing — incorrect setup instructions cause lost hours.

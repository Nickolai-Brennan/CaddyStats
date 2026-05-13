---
name: dependency-audit-assistant
description: |
  Audits project dependencies for outdated versions, known vulnerabilities, license
  conflicts, and unused packages. Use this skill whenever a user says "audit my
  dependencies", "check for vulnerable packages", "find outdated npm packages",
  "which dependencies should I update?", "are there any security issues in my
  package.json?", "check my requirements.txt for CVEs", or "help me clean up
  unused dependencies". Also activate when a user shares a package.json,
  requirements.txt, go.mod, or similar file and asks what to do with it. Do NOT
  use for writing new features, refactoring code, or general security audits of
  application logic.
---

# Dependency Audit Assistant

Review a project's dependencies for security vulnerabilities, outdated versions,
license issues, and unnecessary bloat — then produce a prioritized action plan.

## When to Use

- Pre-release security check
- Quarterly dependency hygiene review
- After inheriting a codebase
- After a CVE is disclosed that might affect your stack

## When NOT to Use

- Auditing application code logic for security flaws (use `security-review-checklist-runner`)
- Performance profiling
- Choosing a tech stack from scratch

---

## Workflow

### Step 1 — Receive the Dependency Manifest

Accept any of:

- `package.json` / `package-lock.json`
- `requirements.txt` / `pyproject.toml` / `Pipfile`
- `go.mod`
- `Gemfile` / `Gemfile.lock`
- `pom.xml` / `build.gradle`
- Plain text list of package names and versions

Ask: "Which ecosystem is this? (npm, pip, go, rubygems, maven, etc.)"

### Step 2 — Run Audit Analysis

For each dependency, check across four risk dimensions:

#### Security (Highest Priority)

- Known CVEs (reference NVD, GitHub Advisory DB, Snyk OSS index)
- Severity: Critical / High / Medium / Low
- Available patch version

#### Freshness

- Current version vs latest stable
- Packages more than 2 major versions behind flagged as high risk
- End-of-life packages flagged

#### License Compliance

- Identify license for each package
- Flag: GPL (copyleft risk for proprietary apps), AGPL, unlicensed
- Note: MIT, Apache 2.0, BSD = generally safe

#### Bloat / Unused

- Packages declared but not imported in any source file (if codebase accessible)
- Packages with a narrower-scope alternative

### Step 3 — Produce the Audit Report

```markdown
## Dependency Audit Report — [Project Name]

_Date: [YYYY-MM-DD] | Ecosystem: [npm/pip/go/etc.] | Total packages: N_

### 🚨 Critical / High Severity Issues

| Package | Current | Fixed   | CVE            | Severity | Action     |
| ------- | ------- | ------- | -------------- | -------- | ---------- |
| lodash  | 4.17.4  | 4.17.21 | CVE-2021-23337 | High     | Update now |

### ⚠️ Outdated Packages (2+ major versions behind)

| Package | Current | Latest | Notes                                      |
| ------- | ------- | ------ | ------------------------------------------ |
| express | 3.x     | 5.x    | Major API changes — review migration guide |

### 📋 License Flags

| Package  | License    | Risk   | Notes                |
| -------- | ---------- | ------ | -------------------- |
| left-pad | Unlicensed | Medium | Consider alternative |

### 🧹 Cleanup Candidates

- `moment` — consider replacing with `date-fns` or `dayjs` (smaller bundle)
- `lodash` — if only using `_.get`, import directly from `lodash/get`

### ✅ Summary

- Critical/High CVEs: N (patch immediately)
- Outdated packages: N
- License flags: N
- Cleanup suggestions: N

### 📋 Recommended Action Order

1. Patch critical/high CVEs (packages: X, Y, Z)
2. Update packages that are EOL
3. Review license flags with legal if needed
4. Schedule cleanup for low-priority items
```

### Step 4 — Generate Update Commands

If the ecosystem supports it, provide copy-pasteable update commands:

```bash
# npm — update critical packages
npm install lodash@4.17.21 express@4.21.0

# pip — update
pip install --upgrade django==4.2.14 pillow==10.3.0
```

---

## Output Format

Primary: Audit report Markdown table (as shown above).
Secondary: Copy-pasteable update commands.

---

## Safety & Confirmation

- Never auto-run install commands. Always present them for review first.
- Major version updates may have breaking changes — flag these and link to migration guides.
- Confirm before recommending removal of any package (it may be an indirect dependency).
- Note: This skill reports known issues based on shared data; it is not a substitute for running `npm audit` or `pip-audit` directly in the project.

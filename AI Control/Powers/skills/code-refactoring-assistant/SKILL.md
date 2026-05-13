---
name: code-refactoring-assistant
description: |
  Analyzes code and applies structured refactoring improvements: extracts functions,
  reduces complexity, eliminates duplication, improves naming, and modernizes syntax.
  Use this skill whenever a user says "refactor this code", "clean up this function",
  "this function is too long", "reduce complexity here", "extract this into a helper",
  "make this more readable", "improve this code structure", or "simplify this logic".
  Also activate when someone shares code they feel is messy or hard to maintain.
  Supports JavaScript, TypeScript, Python, Go, Java, and Ruby. Do NOT use for
  fixing bugs (the code's logic must stay correct), writing new features, or
  performance optimization (use sql-query-optimizer or a profiling tool instead).
---

# Code Refactoring Assistant

Apply proven refactoring patterns to make code cleaner, more readable, and easier
to maintain — without changing what the code does.

## When to Use

- A function is too long (>40 lines) or does too many things
- Code has deep nesting (>3 levels) or complex boolean chains
- Similar logic is duplicated across multiple places
- Variable/function names are unclear or misleading
- Code was written quickly and needs a cleanup pass before code review

## When NOT to Use

- Fixing bugs or changing behavior (refactoring must be behavior-preserving)
- Performance optimization (separate concern)
- Architectural redesign of an entire module
- Rewriting code in a different language

---

## Workflow

### Step 1 — Receive and Analyze the Code

Accept:

- A code snippet or file
- A description of the refactoring goal ("too long", "duplicated", "hard to test")

Identify which refactoring opportunities apply:

| Smell                 | Refactoring pattern               |
| --------------------- | --------------------------------- |
| Long function         | Extract Function / Extract Method |
| Deep nesting          | Early Return / Guard Clauses      |
| Duplicated logic      | Extract Helper / DRY              |
| Magic numbers/strings | Named Constants                   |
| Long parameter list   | Parameter Object / Config Object  |
| Complex boolean       | Named Predicate Function          |
| Switch on type        | Polymorphism / Strategy Pattern   |
| Unclear naming        | Rename Variable / Function        |
| Dead code             | Remove Dead Code                  |

### Step 2 — Plan Refactoring Steps

List the changes to make, in order (smallest first):

1. Rename variables for clarity
2. Extract helpers / sub-functions
3. Flatten nesting with early returns
4. Replace magic values with constants
5. Apply structural patterns if warranted

Show the plan and confirm: "I'm going to make N changes. Want me to do all at once, or step-by-step?"

### Step 3 — Apply Refactoring

For each change, show **before → after** side by side where possible.

Rules to follow:

- **One refactoring at a time** for complex changes — don't mix rename + extract + restructure in one pass
- **Preserve behavior** — no new logic, no changed conditionals (unless simplifying equivalent boolean)
- **Keep tests green** — note if any test names or imports may need updating
- **Language idioms** — use the idiomatic style for the target language

### Step 4 — Highlight Risks

Flag any change that:

- Renames a public function/method (callers need updating)
- Changes a function signature
- Moves code to a new file (imports need updating)
- Could affect memoization, closures, or side-effect ordering

Format risk flags as:

> ⚠️ `calculateTotal` is exported — update all call sites after renaming.

### Step 5 — Present the Final Result

Show the complete refactored code followed by a change summary:

```
Refactoring Summary:
✓ Extracted `calculateDiscount()` helper from `processOrder()` (lines 12–28)
✓ Replaced nested if/else with guard clauses — reduced nesting from 4 to 2 levels
✓ Named magic number 0.15 → TAX_RATE constant
✓ Renamed `data` → `userProfile` for clarity
⚠️  `processOrder` signature unchanged — no call sites affected
```

---

## Output Format

1. **Refactored code block** — complete, ready to copy
2. **Change summary** — bulleted list of each change made and why
3. **Risk flags** — any callers, imports, or tests to update

---

## Safety & Confirmation

- Never change logic, conditionals, or data flow without explicitly flagging it.
- If the refactoring changes observable behavior (even if unintentionally), stop and confirm.
- For large files, refactor one section at a time and ask before proceeding to the next.
- Always note if tests should be re-run after the refactoring.

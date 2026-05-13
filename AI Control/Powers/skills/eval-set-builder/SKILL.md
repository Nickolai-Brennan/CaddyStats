---
name: eval-set-builder
description: |
  Builds evaluation (eval) sets for AI skills and prompts: generates realistic test
  prompts, defines expected outputs, and structures them into evals.json files.
  Use this skill whenever a user says "create evals for this skill", "build test
  cases for my prompt", "write an eval set", "how do I test this skill?",
  "generate prompts to test my AI feature", or "help me create a benchmark for
  this workflow". Also activate when a user has a skill or prompt and wants to know
  if it works correctly. Do NOT use for running evals (use eval-runner) or for
  creating the skills themselves (use skill-creator).
---

# Eval Set Builder

Design and write realistic evaluation sets that reveal whether a skill or prompt
actually does what it's supposed to do.

## When to Use

- You've written a skill and need test cases before shipping it
- You want to measure whether a prompt change improved or degraded quality
- You're building a regression test suite for an AI workflow
- You want to stress-test edge cases for a specific skill

## When NOT to Use

- Running evals (use `eval-runner`)
- Creating the skill itself (use `skill-creator`)
- General QA testing of software (not AI-specific)

---

## Workflow

### Step 1 — Understand the Skill or Prompt

Ask the user for:

1. **The skill or prompt:** What does it do? What's the expected behavior?
2. **Inputs:** What kinds of inputs will it receive?
3. **Outputs:** What does a good output look like?
4. **Edge cases:** What are the tricky or borderline inputs?
5. **Failure modes:** What would a bad output look like?

### Step 2 — Design Eval Coverage

Plan eval coverage across these dimensions:

| Dimension           | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| **Happy path**      | Normal, well-formed input → correct output                    |
| **Edge cases**      | Unusual but valid inputs the skill should handle              |
| **Failure modes**   | Inputs the skill should gracefully decline or flag            |
| **Adversarial**     | Inputs designed to confuse or misuse the skill                |
| **Format variants** | Different input formats that should produce consistent output |

Aim for 3–7 evals. More is better for high-stakes skills; fewer for simple ones.

### Step 3 — Write Each Eval

For each test case:

1. **Prompt:** A realistic user message that would trigger this skill. Write it as a real user would phrase it — natural language, not a test fixture.
2. **Expected output:** A description of what a correct response looks like. Be specific about:
   - Format (Markdown table, JSON, bullet list, prose)
   - Key content that must be present
   - Key content that must NOT be present
   - Length constraints if relevant
3. **Files:** Leave empty unless the test genuinely requires a file (e.g., a CSV upload skill)

### Step 4 — Identify Edge Cases

Suggest at least 2 edge cases per skill:

- What if the input is empty or malformed?
- What if the user asks for something outside the skill's scope?
- What if there's ambiguity about what the user wants?

### Step 5 — Produce the evals.json

```json
{
  "skill_name": "your-skill-name",
  "evals": [
    {
      "id": 1,
      "prompt": "Realistic user message here",
      "expected_output": "Description of what correct output looks like. Include format, key content, exclusions.",
      "files": []
    }
  ]
}
```

### Step 6 — Recommend Assertion Strategy (Optional)

If the user wants to automate eval checking, suggest assertion types:

- **Exact match:** For deterministic outputs (JSON schemas, fixed templates)
- **Contains:** For outputs that must include specific phrases or sections
- **LLM judge:** For subjective quality assessments ("Does this sound professional?")
- **Format check:** For outputs that must be valid JSON, Markdown, etc.

Note: Per skill-creator guidance, don't add assertions in the initial evals.json — add them after manual review.

---

## Output Format

Primary output: `evals.json` as a code block ready to copy.

Secondary output: A brief explanation of each eval's purpose and what it's testing.

---

## Safety & Confirmation

- Never include real PII or sensitive data in eval prompts. Use plausible fictional data.
- Flag if any suggested eval prompt could be misused to generate harmful content.
- Confirm the eval set with the user before finalizing.

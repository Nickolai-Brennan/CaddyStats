---
name: prompt-optimizer
description: |
  Improves existing prompts for better AI output quality: clearer instructions,
  better output format specification, role/persona addition, few-shot examples,
  and chain-of-thought encouragement. Use this skill whenever a user says
  "improve this prompt", "why is this prompt not working well?", "make this
  prompt better", "optimize this prompt for Claude/GPT", "my prompt gives bad
  results", "rewrite this prompt", "add examples to this prompt", or "help me
  get better outputs from this prompt". Also activate when a user shares a prompt
  and seems frustrated with the AI's outputs. Do NOT use for building full prompt
  libraries (use prompt-library-curator) or creating skills (use skill-creator).
---

# Prompt Optimizer

Diagnose why a prompt produces poor outputs and rewrite it for clarity, specificity,
and consistent high-quality results.

## When to Use

- An existing prompt gives inconsistent, vague, or off-target outputs
- A prompt works sometimes but not reliably
- You want to improve a prompt before scaling its use
- You want to adapt a prompt for a different model (GPT → Claude, etc.)

## When NOT to Use

- Organizing a prompt library (use `prompt-library-curator`)
- Building a new skill from scratch (use `skill-creator`)
- Running or evaluating prompts (use `eval-runner`)

---

## Workflow

### Step 1 — Receive the Prompt and Context

Ask the user for:

1. **The current prompt** (copy-paste)
2. **Example of a bad output** (what did the AI produce that was wrong?)
3. **What a good output looks like** (describe or show an example)
4. **Target model:** Claude / GPT-4 / Other
5. **Constraints:** Max tokens, format requirements, domain restrictions

### Step 2 — Diagnose the Problem

Evaluate the prompt against common failure patterns:

| Problem                  | Signals                          | Fix                                                  |
| ------------------------ | -------------------------------- | ---------------------------------------------------- |
| **Too vague**            | Outputs are generic or off-topic | Add specificity, context, and constraints            |
| **No output format**     | Format varies wildly             | Specify exact format (JSON, bullet list, table)      |
| **No role/persona**      | Wrong expertise level            | Add "You are an expert [domain]..." opener           |
| **No examples**          | Misunderstands task              | Add 1–2 few-shot examples                            |
| **Prompt too long**      | AI ignores later instructions    | Move critical instructions to the beginning          |
| **Passive/hedging**      | AI adds disclaimers everywhere   | Add "Be direct. Do not add disclaimers."             |
| **Wrong scope**          | Too broad or too narrow          | Define explicit scope with "Include:" and "Exclude:" |
| **No negative examples** | AI does the thing you don't want | Add "Do NOT..." instructions                         |

### Step 3 — Apply Improvement Patterns

#### Pattern 1: Role + Task + Format

```
[Before]
"Summarize this article."

[After]
"You are a research analyst. Summarize the following article in exactly 3 bullet points,
each under 15 words. Focus on: the main argument, key evidence, and conclusion.
Do not include your own opinions."
```

#### Pattern 2: Add Output Schema

```
[Before]
"Extract the key information from this email."

[After]
"Extract the key information from the following email and return it as a JSON object
with these exact keys: sender, subject, action_required (true/false), deadline (ISO date or null),
priority (low/medium/high). Return ONLY the JSON, no explanation."
```

#### Pattern 3: Few-Shot Examples

```
[Before]
"Classify the sentiment of this review."

[After]
"Classify the sentiment of customer reviews. Return only: positive, negative, or neutral.

Examples:
Review: 'The product broke after a week.' → negative
Review: 'Great quality, fast shipping!' → positive
Review: 'It works as described.' → neutral

Now classify this review:
{review}"
```

#### Pattern 4: Chain-of-Thought (for reasoning tasks)

```
[Before]
"Is this email a phishing attempt?"

[After]
"Analyze whether the following email is a phishing attempt. Think step by step:
1. Check the sender domain
2. Look for urgency or fear language
3. Check links for domain mismatches
4. Look for requests for credentials or payment
Then give your verdict: phishing / likely phishing / legitimate. Explain your reasoning in 2 sentences."
```

### Step 4 — Present Before/After

Show:

1. The original prompt
2. The improved prompt with annotations explaining each change
3. Why each change should improve output quality

### Step 5 — Suggest Variants

Offer 2 alternatives:

- One with minimal changes (conservative)
- One with more aggressive restructuring

---

## Output Format

```markdown
## Prompt Optimization Report

### Original Prompt
```

[original]

```

### Diagnosis
- [Issue 1]: [Explanation]
- [Issue 2]: [Explanation]

### Improved Prompt
```

[improved]

```

### Changes Made
1. Added role: "[role]" — to anchor expertise and tone
2. Specified output format: "[format]" — to eliminate variability
3. Added constraint: "[constraint]" — to prevent [specific bad output]

### Alternative Variant (minimal changes)
```

[alternative]

```

```

---

## Safety & Confirmation

- Never change the fundamental intent of a prompt without confirming with the user.
- Flag if an improved prompt is longer than the original — longer isn't always better.
- For prompts used in automated pipelines, note that changes should be A/B tested before full rollout.

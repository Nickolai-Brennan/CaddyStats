---
name: regex-builder
description: |
  Builds, explains, and debugs regular expressions from natural language descriptions.
  Use this skill whenever a user says "write a regex for...", "build a regular expression
  that matches...", "explain what this regex does", "why isn't my regex matching?",
  "help me write a pattern for...", "validate this format with regex", or "match
  these strings but not those". Also activate when someone shares a regex they don't
  understand or one that isn't working. Works for all major flavors: JavaScript,
  Python (re), PCRE, Go, Ruby. Do NOT use for full text parsing of structured formats
  like JSON/XML (use a proper parser instead) or for fuzzy text matching.
---

# Regex Builder

Build precise regular expressions from plain-language descriptions, explain what
existing patterns do, and debug non-matching regexes with examples.

## When to Use

- Validating input formats (email, phone number, URL, date, postal code)
- Extracting specific parts of a string (log parsing, URL routing, text extraction)
- Find-and-replace patterns in an editor or script
- Explaining a cryptic regex someone inherited
- Debugging a regex that matches too much or too little

## When NOT to Use

- Parsing HTML or XML (use a proper DOM/XML parser)
- Parsing JSON (use `JSON.parse()`)
- Full-text semantic search (use a search index)
- Complex grammar parsing (use a parser generator)

---

## Workflow

### Step 1 — Understand the Pattern Need

Collect:

1. **What to match:** Describe the strings that should match
2. **What NOT to match:** Describe similar strings that must NOT match
3. **Examples:** At least 3 positive and 2 negative examples
4. **Language/flavor:** JavaScript, Python, Go, PCRE, Ruby, Rust
5. **Context:** Validation (full-string match) vs. extraction (find in larger string)

### Step 2 — Build the Regex

Construct the pattern with this priority order:

1. Start with the simplest pattern that matches the examples
2. Add boundary anchors (`^`, `$`, `\b`) as appropriate
3. Add character classes for flexibility
4. Add quantifiers for variable-length parts
5. Add capture groups if extraction is needed

Annotate complex patterns with inline comments using verbose mode where supported:

**Python verbose mode:**

```python
import re
pattern = re.compile(r"""
    ^                   # start of string
    [a-zA-Z0-9._%+-]+   # username: alphanumeric + allowed special chars
    @                   # literal @
    [a-zA-Z0-9.-]+      # domain name
    \.                  # literal dot
    [a-zA-Z]{2,}        # TLD: 2+ letters
    $                   # end of string
""", re.VERBOSE)
```

### Step 3 — Verify Against Examples

Test the pattern against all provided examples and show results:

```
Testing: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

✓ MATCH:   user@example.com
✓ MATCH:   alice.bob+tag@company.co.uk
✗ NO MATCH: not-an-email
✗ NO MATCH: @nodomain.com
✗ NO MATCH: user@.com
```

### Step 4 — Explain the Pattern

Break down every component:

| Part                | Meaning                                  |
| ------------------- | ---------------------------------------- |
| `^`                 | Anchors to start of string               |
| `[a-zA-Z0-9._%+-]+` | One or more: letters, digits, or `._%+-` |
| `@`                 | Literal @ symbol                         |
| `[a-zA-Z0-9.-]+`    | Domain: letters, digits, dots, hyphens   |
| `\.`                | Literal dot (escaped)                    |
| `[a-zA-Z]{2,}`      | TLD: 2 or more letters                   |
| `$`                 | Anchors to end of string                 |

### Step 5 — Provide Usage Code

Show a ready-to-use snippet in the requested language:

**JavaScript:**

```javascript
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}
```

**Python:**

```python
import re
EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
def is_valid_email(email: str) -> bool:
    return bool(EMAIL_PATTERN.match(email))
```

---

## Common Regex Patterns Reference

| Pattern       | Use case                 | Regex                                                                   |
| ------------- | ------------------------ | ----------------------------------------------------------------------- | ----------------- | ------ | -------- |
| Email (basic) | Input validation         | `^[^\s@]+@[^\s@]+\.[^\s@]+$`                                            |
| US phone      | 10-digit with separators | `^\+?1?\s?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})$`                       |
| ISO date      | YYYY-MM-DD               | `^\d{4}-(0[1-9]                                                         | 1[0-2])-(0[1-9]   | [12]\d | 3[01])$` |
| URL (simple)  | http/https URLs          | `^https?://[^\s/$.?#].[^\s]*$`                                          |
| UUID v4       | Identifier validation    | `^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$` |
| Hex color     | CSS colors               | `^#([0-9a-fA-F]{3}                                                      | [0-9a-fA-F]{6})$` |
| IPv4 address  | Network validation       | `^(\d{1,3}\.){3}\d{1,3}$`                                               |

---

## Output Format

1. The regex pattern in a code block
2. Test results table (✓/✗) against provided examples
3. Component-by-component explanation table
4. Usage snippet in the requested language
5. Caveats: known edge cases the pattern doesn't handle

---

## Safety & Confirmation

- Warn if a regex has catastrophic backtracking potential (nested quantifiers).
- Note that email regex cannot fully validate deliverability — only format.
- Flag when a simpler built-in library function exists (e.g., `URL()` constructor vs. regex for URLs).
- For security-critical validation (passwords, tokens), recommend pairing regex with additional checks.

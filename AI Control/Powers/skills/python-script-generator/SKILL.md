---
name: python-script-generator
description: |
  Generates small, focused Python scripts for automation tasks: file processing,
  data transformation, API calls, CLI utilities, and task automation. Use this
  skill whenever a user says "write a Python script to...", "create a Python
  utility for...", "automate this with Python", "write me a script that...",
  "generate a Python CLI for...", or "help me write a Python program to...".
  Also activate when a user describes a repetitive task and wants it automated
  with Python. Always includes error handling, logging, and confirmation prompts
  for destructive actions. Do NOT use for full application development,
  data science notebooks, or machine learning model training scripts.
---

# Python Script Generator

Generate clean, safe, well-structured Python scripts for automation tasks with
proper error handling, logging, and safeguards for destructive operations.

## When to Use

- Automating a repetitive file, data, or API task
- Creating a one-off utility script
- Building a simple CLI tool
- Automating data transformation between formats

## When NOT to Use

- Full application development (use a proper framework)
- Machine learning / deep learning training scripts
- Jupyter notebook creation (different workflow)
- Scripts requiring large library ecosystems

---

## Workflow

### Step 1 — Understand the Task

Ask the user:

1. **What should the script do?** (Be specific: input → process → output)
2. **Input:** File(s), stdin, API, database, or command-line args?
3. **Output:** File, stdout, database write, API call?
4. **Error handling:** What should happen on failure? (abort / skip / retry)
5. **Destructive?** Does the script delete, overwrite, or modify existing data?

### Step 2 — Plan the Script Structure

For scripts under 100 lines, use a simple flat structure:

```python
#!/usr/bin/env python3
"""
Script name: [name].py
Purpose: [one-sentence description]
Usage: python [name].py [args]
"""

import sys
import logging
import argparse
# [other imports]

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def main():
    args = parse_args()
    # [main logic]

def parse_args():
    parser = argparse.ArgumentParser(description='[description]')
    # [arguments]
    return parser.parse_args()

if __name__ == '__main__':
    main()
```

For larger scripts (100+ lines), use functions and a `if __name__ == '__main__':` guard.

### Step 3 — Write the Script

Follow these conventions:

- **Type hints** on all function signatures
- **Docstrings** for all functions (one-line minimum)
- **Logging** instead of print statements (except for intentional user output)
- **argparse** for CLI arguments (not sys.argv directly)
- **pathlib.Path** for file paths (not os.path string concatenation)
- **Context managers** for file I/O (`with open(...) as f:`)
- **Try/except** around all external operations (file I/O, HTTP, DB)

### Step 4 — Add Safety Checks for Destructive Actions

If the script modifies, deletes, or overwrites files or data:

```python
def confirm_action(message: str) -> bool:
    """Ask for explicit user confirmation before a destructive action."""
    response = input(f"{message} [y/N]: ").strip().lower()
    return response == 'y'

# Before any destructive operation:
if not confirm_action(f"This will delete {len(files)} files. Continue?"):
    logger.info("Aborted by user.")
    sys.exit(0)
```

Always add a `--dry-run` flag for scripts that modify files:

```python
parser.add_argument('--dry-run', action='store_true',
                    help='Preview changes without making them')
```

### Step 5 — Add Requirements Info

Include at the top as a comment:

```python
# Requirements: pip install requests pandas  (or: stdlib only)
# Python: 3.10+
```

---

## Output Format

A complete Python script with:

1. Module docstring (purpose, usage, author placeholder)
2. Imports
3. Logging setup
4. Main function
5. Helper functions
6. `if __name__ == '__main__':` guard

For scripts longer than 50 lines, include a brief explanation of how to run it.

---

## Safety & Confirmation

- **Always** include `--dry-run` for scripts that write, delete, or overwrite.
- **Always** ask for confirmation (via input() or --confirm flag) before destructive batch operations.
- Never hardcode credentials — use environment variables and note the required env vars in the script header.
- Avoid `shell=True` in subprocess calls — use argument lists.
- Never use `eval()` or `exec()` on user-provided input.
- For scripts accessing external APIs, include timeout parameters on all requests.

---
name: cli-tool-generator
description: |
  Scaffolds command-line interface (CLI) tools with subcommands, flags, help text,
  input validation, and colored output. Use this skill whenever a user says "build
  a CLI for...", "create a command-line tool that...", "write a CLI with subcommands",
  "scaffold a Node CLI", "make a Python CLI with argparse or Click", "write a Go
  CLI tool", or "create a dev tool I can run from the terminal". Also activate when
  someone describes a workflow they run manually and wants it wrapped in a nice CLI.
  Supports Node.js (Commander.js / Yargs), Python (Click / argparse), and Go
  (cobra). Do NOT use for shell scripts (use python-script-generator instead) or
  full TUI (terminal UI) applications.
---

# CLI Tool Generator

Scaffold polished, production-ready CLI tools with subcommands, flags, validation,
help text, and colored output — ready to install globally or distribute.

## When to Use

- Building a developer tool that needs a CLI interface
- Wrapping a script in a discoverable, documented CLI
- Creating a project management or automation tool for a team
- Building a CLI companion for a service or API

## When NOT to Use

- Simple one-off scripts (use `python-script-generator`)
- Full terminal UI applications (ncurses/Ink — different scope)
- Shell scripts / bash one-liners

---

## Workflow

### Step 1 — Understand the CLI Requirements

Collect:

1. **Tool name** and one-sentence description
2. **Commands:** What actions does it perform? (e.g., `create`, `list`, `delete`, `deploy`)
3. **Flags/options:** Required and optional flags for each command
4. **Output format:** Plain text, JSON, colored status output
5. **Language:** Node.js, Python, or Go
6. **Distribution:** npx-runnable, pip-installable, go-installable binary

### Step 2 — Design the Command Structure

Produce a CLI design overview:

```
mytool <command> [options]

Commands:
  create <name>      Create a new resource
  list               List all resources
  delete <id>        Delete a resource by ID
  config set <key>   Set a config value

Global options:
  --verbose, -v      Show verbose output
  --json             Output results as JSON
  --help, -h         Show help
```

### Step 3 — Scaffold the CLI

#### Node.js with Commander.js

```typescript
#!/usr/bin/env node
// bin/mytool.ts

import { Command } from "commander";
import chalk from "chalk";
import { createResource } from "./commands/create";
import { listResources } from "./commands/list";

const program = new Command();

program.name("mytool").description("My automation CLI tool").version("1.0.0");

program
  .command("create <name>")
  .description("Create a new resource")
  .option("-t, --type <type>", "Resource type", "default")
  .option("--dry-run", "Preview without making changes")
  .action(async (name, options) => {
    try {
      await createResource(name, options);
      console.log(chalk.green(`✓ Created resource: ${name}`));
    } catch (err) {
      console.error(chalk.red(`✗ Error: ${(err as Error).message}`));
      process.exit(1);
    }
  });

program
  .command("list")
  .description("List all resources")
  .option("--json", "Output as JSON")
  .action(async (options) => {
    const items = await listResources();
    if (options.json) {
      console.log(JSON.stringify(items, null, 2));
    } else {
      items.forEach((item) =>
        console.log(`  ${chalk.cyan(item.id)}  ${item.name}`),
      );
    }
  });

program.parseAsync(process.argv);
```

#### Python with Click

```python
#!/usr/bin/env python3
# mytool/cli.py

import click
import json
import sys

@click.group()
@click.version_option()
@click.option('--verbose', '-v', is_flag=True, help='Show verbose output')
@click.pass_context
def cli(ctx, verbose):
    """My automation CLI tool."""
    ctx.ensure_object(dict)
    ctx.obj['verbose'] = verbose

@cli.command()
@click.argument('name')
@click.option('--type', '-t', 'resource_type', default='default', help='Resource type')
@click.option('--dry-run', is_flag=True, help='Preview without making changes')
@click.pass_context
def create(ctx, name, resource_type, dry_run):
    """Create a new resource."""
    if dry_run:
        click.echo(f'[dry-run] Would create: {name} (type={resource_type})')
        return
    try:
        # call your business logic here
        click.echo(click.style(f'✓ Created: {name}', fg='green'))
    except Exception as e:
        click.echo(click.style(f'✗ Error: {e}', fg='red'), err=True)
        sys.exit(1)

@cli.command('list')
@click.option('--output-json', 'as_json', is_flag=True, help='Output as JSON')
def list_resources(as_json):
    """List all resources."""
    items = []  # fetch your data here
    if as_json:
        click.echo(json.dumps(items, indent=2))
    else:
        for item in items:
            click.echo(f'  {item["id"]}  {item["name"]}')

if __name__ == '__main__':
    cli()
```

#### package.json / setup.py / go.mod configuration

**Node.js — package.json:**

```json
{
  "name": "mytool",
  "bin": { "mytool": "./dist/bin/mytool.js" },
  "scripts": {
    "build": "tsc",
    "start": "ts-node src/bin/mytool.ts"
  },
  "dependencies": { "commander": "^12.0.0", "chalk": "^5.3.0" }
}
```

**Python — pyproject.toml:**

```toml
[project.scripts]
mytool = "mytool.cli:cli"
```

### Step 4 — Add Error Handling and Exit Codes

Standard exit codes:

- `0` — success
- `1` — general error
- `2` — usage error (wrong args)
- `130` — interrupted (Ctrl+C)

Always catch errors at the top level and exit with the correct code.

### Step 5 — Write the README usage section

```markdown
## Usage

\`\`\`bash
mytool create my-resource --type premium
mytool list --json
mytool delete abc-123
\`\`\`
```

---

## Output Format

1. **CLI design overview** — command tree with flags
2. **Scaffolded source files** — main entry point + at least one command module
3. **Package config** — `package.json`, `pyproject.toml`, or `go.mod` snippet
4. **README usage section** — copy-pasteable examples

---

## Safety & Confirmation

- Always include `--dry-run` for commands that write, delete, or deploy.
- Exit with non-zero code on errors — never silently succeed after a failure.
- Never hardcode credentials — use environment variables and `--config` flags.
- Add `--yes / -y` confirmation flags for destructive commands instead of prompting interactively in CI.

# Instructions

This directory contains global instructions, domain rules, and coding standards for AI agents and developers.

## Instruction Priority (cascade)

When multiple instruction files apply, they are evaluated in this order (higher entries take precedence):

```
global-ai-instructions.md        ← system-wide defaults
  └── copilot-instructions.md    ← Copilot-specific behavior
        └── coding-standards.md  ← language-agnostic code quality
              └── [domain].md    ← domain-specific rules
                    └── agent instruction
                          └── skill instruction
                                └── user prompt
```

## Domain Rule Files

| File                                                     | Scope                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| [global-ai-instructions.md](./global-ai-instructions.md) | System-wide agent defaults (clarity, accuracy, completeness) |
| [copilot-instructions.md](./copilot-instructions.md)     | GitHub Copilot-specific behavior                             |
| [coding-standards.md](./coding-standards.md)             | Language-agnostic code quality standards                     |
| [repo-rules.md](./repo-rules.md)                         | Repository structure and contribution rules                  |
| [docs-rules.md](./docs-rules.md)                         | Documentation standards                                      |
| [docs.md](./docs.md)                                     | Documentation workflow rules                                 |
| [api-rules.md](./api-rules.md)                           | REST and GraphQL API rules                                   |
| [data-rules.md](./data-rules.md)                         | Data handling and privacy rules                              |
| [database-rules.md](./database-rules.md)                 | Database schema and query rules                              |
| [frontend-rules.md](./frontend-rules.md)                 | Frontend (React/Vite/TypeScript/Tailwind) rules              |
| [testing-rules.md](./testing-rules.md)                   | Testing and QA standards                                     |
| [security-rules.md](./security-rules.md)                 | Security policies and constraints                            |
| [system.md](./system.md)                                 | System-wide agent behavior                                   |

## Specialised Instruction Files

These files provide domain-specific guidance for particular technologies or workflows:

| File                                                                                                         | Topic                            |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| [agents.instructions.md](./agents.instructions.md)                                                           | Agent authoring guidelines       |
| [agent-skills.instructions.md](./agent-skills.instructions.md)                                               | Skill authoring guidelines       |
| [instructions.instructions.md](./instructions.instructions.md)                                               | How to write instruction files   |
| [prompt.instructions.md](./prompt.instructions.md)                                                           | Prompt writing guidelines        |
| [task-implementation.instructions.md](./task-implementation.instructions.md)                                 | Task planning and implementation |
| [docs-update.instructions.md](./docs-update.instructions.md)                                                 | Documentation update workflow    |
| [code-review-generic.instructions.md](./code-review-generic.instructions.md)                                 | Generic code review guidelines   |
| [context-engineering.instructions.md](./context-engineering.instructions.md)                                 | Context window engineering       |
| [devops-core-principles.instructions.md](./devops-core-principles.instructions.md)                           | DevOps principles                |
| [github-actions-ci-cd-best-practices.instructions.md](./github-actions-ci-cd-best-practices.instructions.md) | GitHub Actions / CI-CD           |
| [html-css-style-color-guide.instructions.md](./html-css-style-color-guide.instructions.md)                   | HTML/CSS style guide             |
| [markdown-content-creation.instructions.md](./markdown-content-creation.instructions.md)                     | Markdown writing standards       |
| [nodejs-javascript-vitest.instructions.md](./nodejs-javascript-vitest.instructions.md)                       | Node.js / Vitest testing         |
| [performance-optimization.instructions.md](./performance-optimization.instructions.md)                       | Performance guidelines           |
| [powershell.instructions.md](./powershell.instructions.md)                                                   | PowerShell scripting             |

## Dataverse / Python SDK Files

| File                                                                                                                     | Topic                 |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| [dataverse-python-sdk.instructions.md](./dataverse-python-sdk.instructions.md)                                           | SDK overview          |
| [dataverse-python-api-reference.instructions.md](./dataverse-python-api-reference.instructions.md)                       | API reference         |
| [dataverse-python-best-practices.instructions.md](./dataverse-python-best-practices.instructions.md)                     | Best practices        |
| [dataverse-python-advanced-features.instructions.md](./dataverse-python-advanced-features.instructions.md)               | Advanced features     |
| [dataverse-python-agentic-workflows.instructions.md](./dataverse-python-agentic-workflows.instructions.md)               | Agentic workflows     |
| [dataverse-python-error-handling.instructions.md](./dataverse-python-error-handling.instructions.md)                     | Error handling        |
| [dataverse-python-file-operations.instructions.md](./dataverse-python-file-operations.instructions.md)                   | File operations       |
| [dataverse-python-pandas-integration.instructions.md](./dataverse-python-pandas-integration.instructions.md)             | Pandas integration    |
| [dataverse-python-performance-optimization.instructions.md](./dataverse-python-performance-optimization.instructions.md) | Performance           |
| [dataverse-python-real-world-usecases.instructions.md](./dataverse-python-real-world-usecases.instructions.md)           | Real-world use cases  |
| [dataverse-python-testing-debugging.instructions.md](./dataverse-python-testing-debugging.instructions.md)               | Testing and debugging |

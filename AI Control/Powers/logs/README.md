# Logs

This directory contains append-only run logs and audit trails. These files **start empty** on a fresh clone and accumulate entries as agents execute, workflows run, and errors occur. Do not expect pre-filled data.

## Log Files

| File                 | Contents                                      |
| -------------------- | --------------------------------------------- |
| agent-run-log.md     | Timestamped record of each agent invocation   |
| workflow-run-log.md  | Timestamped record of each workflow execution |
| prompt-change-log.md | History of prompt edits and version changes   |
| automation-log.md    | Automation execution history                  |
| error-log.md         | Errors, warnings, and exception records       |
| release-log.md       | Release history and version notes             |

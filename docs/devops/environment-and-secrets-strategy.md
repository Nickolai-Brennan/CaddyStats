# Environment and Secrets Strategy

## Purpose

Define how CaddyStats separates configuration and secrets across local, development, test, staging, and production environments.

## Environment model

| Environment | Primary use                   | Config source                                                                 | Secret source                              |
| ----------- | ----------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------ |
| local       | contributor workstations      | `.env.example` + `.env.local`                                                 | local uncommitted files only               |
| development | shared internal environment   | platform env config + `config/environments/.env.development.example` guidance | managed platform secrets                   |
| test        | CI and integration validation | CI environment variables + `config/environments/.env.test.example`            | GitHub Actions secrets or CI-safe defaults |
| staging     | pre-production validation     | platform env config + staged deploy workflow                                  | managed secret store                       |
| production  | live platform runtime         | platform env config only                                                      | managed secret store with least privilege  |

## Required files

- `.env.example` — shared variable contract
- `config/environments/.env.local.example`
- `config/environments/.env.development.example`
- `config/environments/.env.test.example`
- `config/environments/.env.staging.example`
- `config/environments/.env.production.example`

## Rules

- Never commit real secrets.
- Keep frontend-safe variables clearly prefixed (`VITE_`).
- Store production and staging secrets outside the repository.
- Validate any new variable in both `.env.example` and the relevant overlay example.
- Default production posture disables GraphQL playground, enables security headers, and requires explicit review for AI-assisted output.

## Validation baseline

- `scripts/verify/validate-env.sh` is the repository entrypoint for environment-file validation.
- Pull requests that add or change variables must update both docs and templates.
- CI should inject secrets at runtime only.

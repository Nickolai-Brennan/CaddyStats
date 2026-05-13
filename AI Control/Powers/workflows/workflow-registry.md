# Workflow Registry

All registered workflows in the mods system.

| ID    | Name            | Phase | Primary Agent         | Output                                            |
| ----- | --------------- | ----- | --------------------- | ------------------------------------------------- |
| WF-00 | project-intake  | ALL   | project-planner-agent | project_brief, roadmap, milestones, risk_register |
| WF-01 | data-collection | ALL   | orchestrator-agent    | ingested_raw_data, data_inventory, source_report  |

<!-- WF-01 primary agent corrected from data-cleanup-agent to orchestrator-agent.
     The orchestrator coordinates all ingestion tasks in WF-01; data-cleanup-agent plays a
     secondary pre-validation role. See 01-data-collection.workflow.md for the full participant list. -->

| WF-02 | data-cleanup | ALL | data-cleanup-agent | cleaned_dataset, cleaning_report, validation_summary |
| WF-03 | data-analysis | ALL | data-analysis-agent | analysis_report, statistical_summary, key_insights |
| WF-04 | model-development | MVP, PROD | model-development-agent | model_spec, feature_definitions, evaluation_plan |
| WF-05 | dashboard-build | PROTO, MVP | stats-visualization-agent | visualization_specs, component_plan, page_layout |
| WF-06 | api-build | ALL | api-agent | openapi_spec, service_layer_design |
| WF-07 | database-build | ALL | database-agent | ddl_sql, erd_description, migration_strategy |
| WF-08 | testing-validation | MVP, PROD | testing-agent | test_plan, test_cases, qa_checklist |
| WF-09 | documentation | MVP, PROD | documentation-agent | readme, api_reference, runbook, architecture_doc |
| WF-10 | launch-review | MVP, PROD | repo-maintenance-agent | launch_checklist, changelog, repo_health_report, go_no_go |

## Execution Order (typical project)

```
WF-00 → WF-01 → WF-02 → WF-03
                              ↓
                    WF-07 ←→ WF-04
                    WF-07 → WF-06 → WF-05
                                         ↓
                                   WF-08 → WF-09 → WF-10
```

## Phase Legend

- **PROTO**: PROTOTYPE
- **MVP**: Minimum Viable Product
- **PROD**: PRODUCTION

---

## Additional Workflows

These workflow files exist alongside the numbered lifecycle workflows and cover specific build or operational patterns.

| File                                                                                       | Owner                 | Description                                                                          |
| ------------------------------------------------------------------------------------------ | --------------------- | ------------------------------------------------------------------------------------ |
| [agent-loop.md](./agent-loop.md)                                                           | orchestrator-agent    | Automates multi-step development using chained agents                                |
| [agent-performance-optimization-workflow.md](./agent-performance-optimization-workflow.md) | orchestrator-agent    | Systematic improvement of agents through performance analysis and prompt engineering |
| [api-build.md](./api-build.md)                                                             | api-agent             | Detailed API build steps using the api-agent skill                                   |
| [backend-build.md](./backend-build.md)                                                     | backend-agent         | Detailed backend build steps using the backend-agent skill                           |
| [content-publishing-workflow.md](./content-publishing-workflow.md)                         | orchestrator-agent    | Content Agent → SEO Agent → Content Calendar Agent → Social Agent → Analytics Agent  |
| [context-manager.md](./context-manager.md)                                                 | orchestrator-agent    | Manages agent context window — what to include, compress, or drop                    |
| [database-build.md](./database-build.md)                                                   | database-agent        | Detailed database build steps using the database-agent skill                         |
| [deployment.md](./deployment.md)                                                           | deployment-agent      | Deployment workflow steps and checklist                                              |
| [project-startup.md](./project-startup.md)                                                 | project-planner-agent | End-to-end project startup sequence                                                  |
| [skill-lifecycle.md](./skill-lifecycle.md)                                                 | skill-creator         | Full skill lifecycle: create → eval → package → publish                              |

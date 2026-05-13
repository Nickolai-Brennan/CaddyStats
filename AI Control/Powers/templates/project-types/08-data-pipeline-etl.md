# Project Template — Data Pipeline / ETL

Use this template when initializing a **Data Pipeline / ETL** project (ingest, transform, load). Answer every question and save the completed file as `PROJECT.md` at the root of your repository.

---

## Section 1: Project Type

**Primary Type**: Data Pipeline / ETL  
**Secondary Types**: <!-- e.g. Database, Dashboard -->

---

## Section 2: Basic Identity

| Field                      | Value                              |
| -------------------------- | ---------------------------------- |
| **Project Name**           |                                    |
| **Tagline** (one sentence) |                                    |
| **Version / Phase**        | `prototype` · `mvp` · `production` |
| **Status**                 | `active` · `on-hold` · `archived`  |
| **Owner / Team**           |                                    |
| **Created**                | YYYY-MM-DD                         |
| **Last Updated**           | YYYY-MM-DD                         |

---

## Section 3: Purpose

**3.1 — What specific problem does this pipeline solve?**

> **Answer**:

**3.2 — What is the single most important outcome this pipeline must deliver?**

> **Answer**:

**3.3 — List up to three secondary goals.**

1.
2.
3.

---

## Section 4: Audience

**4.1 — Who are the primary consumers of the data produced by this pipeline?**
_(e.g. data scientists, BI tools, downstream services, data warehouse)_

> **Answer**:

**4.2 — Who are secondary beneficiaries?**

> **Answer**:

**4.3 — Who are the stakeholders?**

> **Answer**:

**4.4 — What is the expected data volume and velocity?**
_(e.g. "10M records/day", "500 MB/hour", "event stream at 10k events/sec")_

> **Answer**:

---

## Section 5: Technical Stack

**5.1 — What programming language(s) does this pipeline use?**

> **Answer**:

**5.2 — What orchestration or workflow engine is used?**
_(e.g. Apache Airflow, Prefect, Dagster, dbt, AWS Glue, Azure Data Factory, Luigi, cron)_

> **Answer**:

**5.3 — What data processing framework is used?**
_(e.g. Apache Spark, Flink, dbt, pandas, Beam, plain SQL)_

> **Answer**:

**5.4 — What source systems does this pipeline read from?**
_(e.g. REST APIs, databases, S3/GCS, Kafka, Salesforce, flat files)_

> **Answer**:

**5.5 — What destination systems does this pipeline write to?**
_(e.g. data warehouse, data lake, database, API, S3)_

> **Answer**:

**5.6 — What AI/ML models are involved, if any?**

> **Answer**:

**5.7 — What cloud or infrastructure platforms are used?**

> **Answer**:

**5.8 — What CI/CD tooling is used?**

> **Answer**:

**5.9 — How is access and secret management handled?**

> **Answer**:

---

## Section 6: Pipeline Design

**6.1 — What is the pipeline trigger type?**
_(e.g. scheduled cron, event-driven, streaming, manual, API-triggered)_

> **Answer**:

**6.2 — Describe the pipeline stages (Extract → Transform → Load).**

| Stage         | Description                                          |
| ------------- | ---------------------------------------------------- |
| **Extract**   | Where data comes from and how it is ingested         |
| **Transform** | What cleaning, enrichment, or aggregation is applied |
| **Load**      | Where and how data is written to the destination     |

**6.3 — What data quality checks or validation rules are applied?**

> **Answer**:

**6.4 — What is the error handling and retry strategy?**
_(e.g. dead-letter queue, exponential backoff, alerting on failure)_

> **Answer**:

**6.5 — What idempotency or deduplication strategy is used?**

> **Answer**:

**6.6 — What monitoring and alerting is in place?**
_(e.g. data freshness checks, row-count SLAs, anomaly detection)_

> **Answer**:

---

## Section 7: Data Profile

**7.1 — What data enters the pipeline (inputs)?**

> **Answer**:

**7.2 — What data does the pipeline produce (outputs)?**

> **Answer**:

**7.3 — What is the data sensitivity level?**
Choose one: `public` · `internal` · `confidential` · `restricted`

> **Answer**:

**7.4 — Does the pipeline handle PII or PHI?**
Choose one: `true` · `false`

> **Answer**:

**7.5 — What is the data retention and lineage policy?**

> **Answer**:

---

## Section 8: Architecture

**8.1 — Describe the high-level pipeline architecture in 2–5 sentences.**

> **Answer**:

**8.2 — What architectural pattern does this pipeline follow?**
_(e.g. batch ETL, micro-batch, streaming, Lambda architecture, ELT)_

> **Answer**:

**8.3 — Is there a pipeline / data-flow diagram? Provide a link or file path.**

> **Answer**:

---

## Section 9: Constraints

**9.1 — What is the budget or cost target?**

> **Answer**:

**9.2 — What is the target delivery date or sprint length?**

> **Answer**:

**9.3 — What compliance or regulatory requirements apply?**
_(e.g. GDPR data residency, HIPAA audit logs, SOC 2)_

> **Answer**:

**9.4 — What is the pipeline latency SLA?**
_(e.g. "Data available within 15 min of source event", "Daily batch complete by 06:00 UTC")_

> **Answer**:

**9.5 — What is the data completeness / accuracy SLA?**
_(e.g. "≥ 99.9% of records land without error")_

> **Answer**:

---

## Section 10: Success Criteria

- [ ]
- [ ]
- [ ]

---

## Section 11: Related Files

| File / URL          | Purpose              |
| ------------------- | -------------------- |
| `README.md`         | Project overview     |
| `dags/` or `flows/` | Pipeline definitions |
|                     |                      |
|                     |                      |

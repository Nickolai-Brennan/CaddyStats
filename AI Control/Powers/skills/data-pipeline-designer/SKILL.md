---
name: data-pipeline-designer
description: |
  Designs and scaffolds ETL/ELT data pipeline architectures: data flow diagrams,
  extraction scripts, transformation steps, load patterns, and orchestration
  configuration. Use this skill whenever a user says "design a data pipeline",
  "build an ETL pipeline", "move data from X to Y", "extract data from this source
  and load into my warehouse", "schedule a data sync", "build a data ingestion
  pipeline", "design an ELT workflow", or "how do I automate data movement between
  systems". Also activate when someone describes a manual data movement process
  they want to automate. Supports Python (pandas, dbt, Airflow), and SQL-based
  patterns. Do NOT use for real-time streaming pipelines (Kafka, Flink) or for
  single data cleaning tasks (use data-cleaning-recipe-writer).
---

# Data Pipeline Designer

Design and scaffold ETL/ELT data pipelines with extraction, transformation,
loading stages, error handling, and orchestration configuration.

## When to Use

- Moving data from a source system (API, DB, CSV) into a data warehouse
- Building a scheduled data sync between two systems
- Designing a transformation layer with dbt or custom SQL
- Automating a manual data movement process

## When NOT to Use

- Real-time streaming (Kafka, Flink, Spark Streaming)
- One-off data cleaning (use `data-cleaning-recipe-writer`)
- BI dashboard building (separate from pipeline design)

---

## Workflow

### Step 1 — Gather Pipeline Requirements

Ask for:

1. **Source:** Where does the data come from? (PostgreSQL, API, CSV, S3, Salesforce)
2. **Destination:** Where does it land? (BigQuery, Snowflake, Redshift, PostgreSQL, S3)
3. **Transform:** Any business logic, aggregations, or joins needed?
4. **Schedule:** One-time migration / hourly / daily / event-triggered?
5. **Volume:** Rows per run? GB per day?
6. **Tools available:** Python, dbt, Airflow, Prefect, or plain SQL?

### Step 2 — Produce the Pipeline Architecture

```
[Source]          [Extract]         [Transform]       [Load]          [Destination]
PostgreSQL  ──→   Python/SQL  ──→   dbt / pandas ──→  COPY/INSERT ──→ BigQuery
REST API    ──→   HTTP client  ──→  normalize JSON ──→ bulk load   ──→ Snowflake
CSV on S3   ──→   boto3 read   ──→  pandas clean  ──→ bq load     ──→ BigQuery
```

### Step 3 — Scaffold the Extraction Layer

**Database extraction (incremental):**

```python
# pipeline/extract/postgres.py
import psycopg2
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional

def extract_orders(
    conn_str: str,
    since: Optional[datetime] = None,
    batch_size: int = 10_000
) -> pd.DataFrame:
    """
    Extract orders incrementally from source database.
    Uses `updated_at` for incremental detection.
    """
    since = since or (datetime.utcnow() - timedelta(days=1))

    query = """
        SELECT
            id, customer_id, status, total_amount,
            created_at, updated_at
        FROM orders
        WHERE updated_at >= %(since)s
        ORDER BY updated_at
    """

    with psycopg2.connect(conn_str) as conn:
        chunks = []
        for chunk in pd.read_sql(
            query,
            conn,
            params={'since': since},
            chunksize=batch_size
        ):
            chunks.append(chunk)

    return pd.concat(chunks, ignore_index=True) if chunks else pd.DataFrame()
```

**REST API extraction (paginated):**

```python
# pipeline/extract/api.py
import httpx
import pandas as pd
from typing import Iterator

def extract_from_api(
    base_url: str,
    endpoint: str,
    api_key: str,
    page_size: int = 100
) -> pd.DataFrame:
    """Extract all records from a paginated REST API."""
    records = []
    page = 1

    with httpx.Client(headers={'Authorization': f'Bearer {api_key}'}, timeout=30) as client:
        while True:
            resp = client.get(
                f'{base_url}{endpoint}',
                params={'page': page, 'per_page': page_size}
            )
            resp.raise_for_status()
            data = resp.json()

            batch = data.get('data', data)
            if not batch:
                break

            records.extend(batch)
            page += 1

            if not data.get('has_next_page', len(batch) == page_size):
                break

    return pd.DataFrame(records)
```

### Step 4 — Scaffold the Transformation Layer

```python
# pipeline/transform/orders.py
import pandas as pd
import numpy as np

def transform_orders(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and enrich orders for the data warehouse.
    Returns a transformed DataFrame ready for loading.
    """
    if df.empty:
        return df

    result = df.copy()

    # Normalize types
    result['id'] = result['id'].astype(str)
    result['customer_id'] = result['customer_id'].astype(str)
    result['total_amount'] = pd.to_numeric(result['total_amount'], errors='coerce')
    result['created_at'] = pd.to_datetime(result['created_at'], utc=True)
    result['updated_at'] = pd.to_datetime(result['updated_at'], utc=True)

    # Standardize status values
    STATUS_MAP = {'completed': 'complete', 'cancelled': 'canceled'}
    result['status'] = result['status'].str.lower().map(
        lambda s: STATUS_MAP.get(s, s)
    )

    # Drop rows missing critical fields
    critical_fields = ['id', 'customer_id', 'total_amount']
    before = len(result)
    result = result.dropna(subset=critical_fields)
    dropped = before - len(result)
    if dropped > 0:
        print(f'[transform] Dropped {dropped} rows with null critical fields')

    # Add pipeline metadata
    result['_loaded_at'] = pd.Timestamp.utcnow()

    return result
```

### Step 5 — Scaffold the Load Layer

```python
# pipeline/load/bigquery.py
from google.cloud import bigquery
import pandas as pd

def load_to_bigquery(
    df: pd.DataFrame,
    project: str,
    dataset: str,
    table: str,
    write_mode: str = 'WRITE_APPEND'
) -> int:
    """Load DataFrame to BigQuery. Returns rows written."""
    if df.empty:
        print('[load] Nothing to load')
        return 0

    client = bigquery.Client(project=project)
    table_id = f'{project}.{dataset}.{table}'

    job_config = bigquery.LoadJobConfig(
        write_disposition=write_mode,
        schema_update_options=[
            bigquery.SchemaUpdateOption.ALLOW_FIELD_ADDITION
        ],
    )

    job = client.load_table_from_dataframe(df, table_id, job_config=job_config)
    job.result()  # Wait for completion

    print(f'[load] Loaded {len(df)} rows into {table_id}')
    return len(df)
```

### Step 6 — Orchestrate the Pipeline

```python
# pipeline/run.py
import logging
from datetime import datetime, timedelta
from .extract.postgres import extract_orders
from .transform.orders import transform_orders
from .load.bigquery import load_to_bigquery
from .state import get_last_run, save_last_run

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger(__name__)

def run_orders_pipeline():
    start = datetime.utcnow()
    logger.info('Starting orders pipeline')

    # 1. Get watermark for incremental extraction
    last_run = get_last_run('orders')
    logger.info(f'Extracting changes since {last_run}')

    # 2. Extract
    raw = extract_orders(conn_str=os.environ['SOURCE_DB_URL'], since=last_run)
    logger.info(f'Extracted {len(raw)} rows')

    if raw.empty:
        logger.info('No new data — done')
        return

    # 3. Transform
    transformed = transform_orders(raw)
    logger.info(f'Transformed {len(transformed)} rows')

    # 4. Load
    rows_loaded = load_to_bigquery(
        transformed,
        project=os.environ['BQ_PROJECT'],
        dataset='raw',
        table='orders'
    )

    # 5. Update watermark
    save_last_run('orders', start)

    elapsed = (datetime.utcnow() - start).total_seconds()
    logger.info(f'Pipeline complete: {rows_loaded} rows in {elapsed:.1f}s')

if __name__ == '__main__':
    run_orders_pipeline()
```

---

## Output Format

1. **Architecture diagram** — source → extract → transform → load → destination
2. **Extract script** — incremental or full extraction with pagination
3. **Transform script** — type coercion, null handling, field mapping
4. **Load script** — bulk insert/append for the target destination
5. **Orchestration runner** — glues all steps with watermark state management

---

## Safety & Confirmation

- Always implement incremental extraction with a watermark — avoid full table scans.
- Validate row counts between each stage and log discrepancies.
- Never load directly from source to destination without a staging/transform step.
- Confirm the target table schema before generating load code — schema mismatches cause silent truncation.
- For production pipelines, implement idempotent loads (upsert by primary key, not just append).

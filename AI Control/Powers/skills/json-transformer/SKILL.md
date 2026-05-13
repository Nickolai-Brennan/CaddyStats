---
name: json-transformer
description: |
  Writes data transformation scripts to reshape JSON from one schema to another:
  field mapping, renaming, flattening nested objects, aggregating arrays, and
  producing clean output structures. Use this skill whenever a user says "transform
  this JSON", "reshape this data", "map these fields to a new format", "flatten
  this nested JSON", "convert this API response to my data model", "write a JSON
  transformer", "reformat this data structure", or "extract and remap these fields".
  Also activate when someone shows two JSON structures (source and target) and
  wants the mapping code. Works with JavaScript/TypeScript, Python, and jq. Do NOT
  use for parsing JSON from strings (use JSON.parse / json.loads) or for schema
  validation (use type-definition-generator + Zod).
---

# JSON Transformer

Write clean, typed transformation functions that reshape JSON data from a source
schema into a target schema — with field mapping, renaming, and normalization.

## When to Use

- Adapting a third-party API response to your internal data model
- Transforming data between two database schemas during migration
- Normalizing inconsistent field names across multiple sources
- Flattening deeply nested JSON for tabular storage

## When NOT to Use

- Parsing raw JSON strings (use `JSON.parse()` / `json.loads()`)
- Schema validation (use `type-definition-generator` + Zod)
- Large-scale ETL (use `data-pipeline-designer`)

---

## Workflow

### Step 1 — Receive Source and Target

Collect both JSON structures:

**Source:**

```json
{
  "user_id": 123,
  "full_name": "Alice Smith",
  "contact": {
    "email_address": "alice@example.com",
    "phone_number": "+1-555-0100"
  },
  "account_status": "active_user",
  "created_timestamp": 1700000000,
  "preferences": {
    "notifications_enabled": true,
    "theme": "dark_mode"
  }
}
```

**Target:**

```json
{
  "id": "123",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "phone": "+15550100",
  "status": "active",
  "createdAt": "2023-11-14T22:13:20.000Z",
  "settings": {
    "notifications": true,
    "theme": "dark"
  }
}
```

### Step 2 — Build the Field Mapping

Produce a mapping table:

| Source field                        | Target field             | Transformation            |
| ----------------------------------- | ------------------------ | ------------------------- |
| `user_id`                           | `id`                     | `.toString()`             |
| `full_name`                         | `name`                   | None                      |
| `contact.email_address`             | `email`                  | None                      |
| `contact.phone_number`              | `phone`                  | Remove dashes/spaces      |
| `account_status`                    | `status`                 | Replace `_user` suffix    |
| `created_timestamp`                 | `createdAt`              | Unix timestamp → ISO 8601 |
| `preferences.notifications_enabled` | `settings.notifications` | None                      |
| `preferences.theme`                 | `settings.theme`         | `dark_mode` → `dark`      |

### Step 3 — Generate the Transformer

**TypeScript:**

```typescript
// transforms/userTransform.ts

interface SourceUser {
  user_id: number;
  full_name: string;
  contact: { email_address: string; phone_number: string };
  account_status: string;
  created_timestamp: number;
  preferences: { notifications_enabled: boolean; theme: string };
}

interface TargetUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  settings: { notifications: boolean; theme: string };
}

export function transformUser(source: SourceUser): TargetUser {
  return {
    id: source.user_id.toString(),
    name: source.full_name,
    email: source.contact.email_address,
    phone: normalizePhone(source.contact.phone_number),
    status: normalizeStatus(source.account_status),
    createdAt: new Date(source.created_timestamp * 1000).toISOString(),
    settings: {
      notifications: source.preferences.notifications_enabled,
      theme: normalizeTheme(source.preferences.theme),
    },
  };
}

// Transform arrays
export function transformUsers(sources: SourceUser[]): TargetUser[] {
  return sources.map(transformUser);
}

// Helper functions
function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, "");
}

function normalizeStatus(status: string): string {
  return status.replace(/_user$/, "").replace(/_/g, "-");
}

function normalizeTheme(theme: string): string {
  return theme.replace(/_mode$/, "");
}
```

**Python:**

```python
# transforms/user_transform.py
from datetime import datetime, timezone
from typing import Any

def transform_user(source: dict) -> dict:
    """Transform a source user dict to the target schema."""
    return {
        'id':        str(source['user_id']),
        'name':      source['full_name'],
        'email':     source['contact']['email_address'],
        'phone':     normalize_phone(source['contact']['phone_number']),
        'status':    normalize_status(source['account_status']),
        'createdAt': unix_to_iso(source['created_timestamp']),
        'settings': {
            'notifications': source['preferences']['notifications_enabled'],
            'theme':         normalize_theme(source['preferences']['theme']),
        },
    }

def transform_users(sources: list[dict]) -> list[dict]:
    return [transform_user(s) for s in sources]

def normalize_phone(phone: str) -> str:
    import re
    return re.sub(r'[\s\-\(\)]', '', phone)

def normalize_status(status: str) -> str:
    return status.removesuffix('_user').replace('_', '-')

def normalize_theme(theme: str) -> str:
    return theme.removesuffix('_mode')

def unix_to_iso(timestamp: int) -> str:
    return datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat().replace('+00:00', 'Z')
```

**jq (for shell pipelines / one-liners):**

```bash
# jq transform
cat source.json | jq '{
  id: (.user_id | tostring),
  name: .full_name,
  email: .contact.email_address,
  phone: (.contact.phone_number | gsub("[- ()]"; "")),
  status: (.account_status | sub("_user$"; "") | gsub("_"; "-")),
  createdAt: (.created_timestamp | . * 1000 | todate),
  settings: {
    notifications: .preferences.notifications_enabled,
    theme: (.preferences.theme | sub("_mode$"; ""))
  }
}'
```

### Step 4 — Handle Nested Arrays

When the source has arrays of nested objects:

```typescript
// Flattening nested array
interface SourceOrder {
  order_id: string;
  line_items: Array<{
    product: { sku: string; name: string };
    qty: number;
    unit_price: number;
  }>;
}

interface FlatOrderRow {
  orderId: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export function flattenOrderItems(source: SourceOrder): FlatOrderRow[] {
  return source.line_items.map((item) => ({
    orderId: source.order_id,
    sku: item.product.sku,
    productName: item.product.name,
    quantity: item.qty,
    unitPrice: item.unit_price,
    lineTotal: item.qty * item.unit_price,
  }));
}
```

---

## Output Format

1. **Field mapping table** — source → target with transformation notes
2. **TypeScript transformer** — typed function with helper utilities
3. **Python transformer** — equivalent for Python stacks
4. **jq snippet** — for shell/command-line use
5. **Array/nesting patterns** — if the source has nested arrays to flatten

---

## Safety & Confirmation

- Always test with at least 3 sample inputs including edge cases (nulls, empty strings, missing optional fields).
- Use optional chaining (`?.`) and nullish coalescing (`??`) to handle missing nested fields gracefully.
- Never silently drop fields — log or flag unexpected source fields not in the mapping.
- Preserve data types exactly — don't coerce numbers to strings without explicit intent.

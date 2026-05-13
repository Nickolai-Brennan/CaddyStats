---
name: webhook-handler-builder
description: |
  Builds webhook receiver endpoints with signature verification, idempotency
  handling, event routing, and retry-safe processing. Use this skill whenever a
  user says "build a webhook handler", "receive webhooks from Stripe/GitHub/etc.",
  "write a webhook endpoint", "verify webhook signatures", "handle webhook
  retries", "process incoming webhooks", or "make my webhook endpoint reliable".
  Also activate when someone is integrating with a third-party service that sends
  webhooks and needs a secure receiver endpoint. Supports Node.js/Express,
  Python/FastAPI, and Go. Do NOT use for sending outbound webhooks to other
  services (use background-job-designer for outbound delivery with retries).
---

# Webhook Handler Builder

Build secure, reliable webhook receiver endpoints with signature verification,
idempotency, event routing, and proper error responses.

## When to Use

- Receiving webhooks from Stripe, GitHub, Shopify, Twilio, or any SaaS
- Building a webhook relay or aggregator
- Making an existing webhook endpoint production-grade (add sig verification, idempotency)
- Handling webhook retries without double-processing

## When NOT to Use

- Sending outbound webhooks (use `background-job-designer` for retry delivery)
- Building an event bus between internal services
- Real-time data streams (use WebSocket or SSE instead)

---

## Workflow

### Step 1 — Gather Requirements

Ask for:

1. **Webhook source:** Stripe, GitHub, Shopify, custom, etc.
2. **Signature type:** HMAC-SHA256, HMAC-SHA1, RSA, or none
3. **Event types to handle:** (e.g., `payment.completed`, `pull_request.opened`)
4. **Idempotency need:** Can the same event be delivered twice? (usually yes — must handle)
5. **Framework:** Express/Node.js, FastAPI/Python, Go

### Step 2 — Signature Verification

Always verify signatures before processing:

**Stripe (HMAC-SHA256 with timestamp):**

```typescript
// webhooks/stripe.ts
import crypto from "crypto";

export function verifyStripeSignature(payload: Buffer, signature: string, secret: string): boolean {
  const [, timestampPart, signaturePart] = signature.split(",");
  const timestamp = timestampPart?.split("=")[1];
  const expectedSig = signaturePart?.split("=")[1];

  if (!timestamp || !expectedSig) return false;

  // Replay protection — reject webhooks older than 5 minutes
  const webhookAge = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (webhookAge > 300) return false;

  const signedPayload = `${timestamp}.${payload.toString()}`;
  const expectedHash = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(expectedHash, "hex"), Buffer.from(expectedSig, "hex"));
}
```

**GitHub (HMAC-SHA256):**

```typescript
export function verifyGitHubSignature(payload: Buffer, signature: string, secret: string): boolean {
  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
```

### Step 3 — Build the Endpoint

**Express webhook receiver:**

```typescript
// routes/webhooks.ts
import { Router, Request, Response } from "express";
import { verifyStripeSignature } from "../webhooks/stripe";
import { handleStripeEvent } from "../webhooks/handlers";

const router = Router();

router.post(
  "/stripe",
  express.raw({ type: "application/json" }), // IMPORTANT: raw body for sig verification
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    const secret = process.env.STRIPE_WEBHOOK_SECRET!;

    // 1. Verify signature
    const isValid = verifyStripeSignature(req.body, signature, secret);
    if (!isValid) {
      console.warn("[webhook] Invalid signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // 2. Parse event
    let event;
    try {
      event = JSON.parse(req.body.toString());
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }

    // 3. Acknowledge immediately (before processing)
    //    Stripe retries if no 2xx within 30 seconds
    res.status(200).json({ received: true });

    // 4. Process asynchronously
    handleStripeEvent(event).catch((err) => {
      console.error("[webhook] Processing error:", err);
    });
  }
);
```

### Step 4 — Idempotency Handling

```typescript
// webhooks/idempotency.ts
import { redis } from "../redis";

export async function isAlreadyProcessed(eventId: string): Promise<boolean> {
  const key = `webhook:processed:${eventId}`;
  const wasSet = await redis.set(key, "1", "EX", 86400, "NX"); // 24h TTL, set if not exists
  return wasSet === null; // null means key already existed
}

// Usage in handler:
async function handleStripeEvent(event: StripeEvent) {
  if (await isAlreadyProcessed(event.id)) {
    console.log(`[webhook] Skipping already-processed event: ${event.id}`);
    return;
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentSucceeded(event.data.object);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionCancelled(event.data.object);
      break;
    default:
      console.log(`[webhook] Unhandled event type: ${event.type}`);
  }
}
```

### Step 5 — Event Router Pattern

For services with many event types:

```typescript
type EventHandler<T = unknown> = (data: T) => Promise<void>;

const eventHandlers: Record<string, EventHandler> = {
  "payment_intent.succeeded": handlePaymentSucceeded,
  "payment_intent.payment_failed": handlePaymentFailed,
  "customer.subscription.created": handleSubscriptionCreated,
  "customer.subscription.deleted": handleSubscriptionCancelled,
  "invoice.payment_succeeded": handleInvoicePaid,
};

async function routeEvent(event: WebhookEvent) {
  const handler = eventHandlers[event.type];
  if (!handler) {
    console.log(`[webhook] No handler for event type: ${event.type}`);
    return;
  }
  await handler(event.data.object);
}
```

### Step 6 — FastAPI Implementation

```python
# routers/webhooks.py
import hashlib, hmac, time
from fastapi import APIRouter, Request, HTTPException, Header
from typing import Optional

router = APIRouter()

def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = 'sha256=' + hmac.new(
        secret.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)

@router.post("/webhooks/github")
async def github_webhook(
    request: Request,
    x_hub_signature_256: Optional[str] = Header(None),
):
    payload = await request.body()
    secret = os.environ['GITHUB_WEBHOOK_SECRET']

    if not x_hub_signature_256 or not verify_signature(payload, x_hub_signature_256, secret):
        raise HTTPException(status_code=400, detail="Invalid signature")

    event = await request.json()
    event_type = request.headers.get('X-GitHub-Event', 'unknown')

    # Acknowledge immediately
    # Then process — use background task
    from fastapi import BackgroundTasks
    # background_tasks.add_task(handle_event, event_type, event)

    return {"received": True}
```

---

## Output Format

1. **Signature verification function** — specific to the webhook provider
2. **Receiver endpoint** — with raw body parsing and immediate 200 ACK
3. **Idempotency helper** — Redis-based deduplication
4. **Event router** — handler dispatch map
5. **Event handler stubs** — for each event type specified

---

## Safety & Confirmation

- Always use `crypto.timingSafeEqual()` (not `===`) for signature comparison — prevents timing attacks.
- Always parse the raw request body for signature verification before any middleware transforms it.
- Respond with 200 immediately — never make the webhook provider wait for your processing.
- Add replay protection — reject events with timestamps older than 5 minutes (Stripe's recommendation).
- Log all unhandled event types so you know what's arriving but not being processed.

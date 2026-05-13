---
name: background-job-designer
description: |
  Designs and scaffolds background job, queue worker, and task scheduling patterns:
  job definitions, queue configuration, retry policies, dead-letter handling, and
  monitoring hooks. Use this skill whenever a user says "add a background job for...",
  "process this asynchronously", "schedule this task", "write a queue worker",
  "set up a job queue", "add retry logic for this operation", "process emails in
  the background", "implement a job system", or "how do I run this without
  blocking the request". Also activate when a user has a slow or unreliable
  operation that shouldn't block an API response. Supports BullMQ/Node, Celery/Python,
  and Go goroutine patterns. Do NOT use for real-time event streaming (use
  Kafka/event-sourcing patterns) or scheduled cron infrastructure setup.
---

# Background Job Designer

Design and scaffold background job queues, workers, retry policies, and
monitoring — for operations that shouldn't block the request/response cycle.

## When to Use

- Sending emails, notifications, or webhooks asynchronously
- Processing file uploads in the background (resize, convert, analyze)
- Running heavy computations or reports without blocking an API
- Implementing retry-with-backoff for unreliable external API calls
- Scheduling recurring tasks (daily digest, cleanup jobs, billing)

## When NOT to Use

- Real-time event streaming between services (Kafka, NATS)
- Simple cron jobs (use a system cron or a hosted scheduler)
- Synchronous workflows where the user needs an immediate result

---

## Workflow

### Step 1 — Analyze the Job Requirements

Ask for:

1. **What the job does:** Description and estimated duration
2. **Triggers:** On-demand (API call) / Scheduled (cron) / Event-driven
3. **Reliability needs:** At-least-once vs. exactly-once delivery
4. **Failure handling:** How many retries? Exponential backoff? Dead-letter queue?
5. **Stack:** Node.js (BullMQ), Python (Celery), Go (async workers)
6. **Infrastructure:** Redis available for BullMQ/Celery? Or use a hosted queue (SQS, Cloud Tasks)?

### Step 2 — Design the Job Architecture

```
API Request → Enqueue Job → Queue (Redis/SQS) → Worker → Process → Success/Failure
                                                          ↓
                                                    Retry (exponential backoff)
                                                          ↓ (after maxRetries)
                                                    Dead-Letter Queue → Alert
```

### Step 3 — Scaffold with BullMQ (Node.js)

**Job definitions:**

```typescript
// jobs/types.ts
export interface SendEmailJobData {
  to: string;
  subject: string;
  template: string;
  variables: Record<string, string>;
}

export interface ProcessUploadJobData {
  uploadId: string;
  fileKey: string;
  userId: string;
}
```

**Queue configuration:**

```typescript
// jobs/queues.ts
import { Queue, QueueOptions } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

const defaultQueueOpts: QueueOptions = { connection };

export const emailQueue = new Queue<SendEmailJobData>("email", {
  ...defaultQueueOpts,
  defaultJobOptions: {
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 200 },
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  },
});

export const uploadQueue = new Queue<ProcessUploadJobData>(
  "upload-processing",
  {
    ...defaultQueueOpts,
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: "exponential", delay: 5000 },
    },
  },
);
```

**Worker:**

```typescript
// jobs/workers/emailWorker.ts
import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { sendEmail } from "../../services/email";
import type { SendEmailJobData } from "../types";

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

const emailWorker = new Worker<SendEmailJobData>(
  "email",
  async (job: Job<SendEmailJobData>) => {
    const { to, subject, template, variables } = job.data;
    console.log(`[email-worker] Processing job ${job.id} — sending to ${to}`);

    await job.updateProgress(10);
    await sendEmail({ to, subject, template, variables });
    await job.updateProgress(100);
  },
  {
    connection,
    concurrency: 5, // process 5 jobs concurrently
  },
);

emailWorker.on("completed", (job) => {
  console.log(`[email-worker] Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`[email-worker] Job ${job?.id} failed:`, err.message);
});
```

**Enqueue from API route:**

```typescript
// routes/users.ts
import { emailQueue } from "../jobs/queues";

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    const user = await userService.create(req.body);

    // Enqueue welcome email asynchronously — don't await
    await emailQueue.add("welcome-email", {
      to: user.email,
      subject: "Welcome to the platform",
      template: "welcome",
      variables: { name: user.name },
    });

    res.status(201).json(user);
  }),
);
```

**Dead-letter queue handling:**

```typescript
// jobs/deadLetterHandler.ts
import { QueueEvents } from "bullmq";

const emailQueueEvents = new QueueEvents("email", { connection });

emailQueueEvents.on("failed", async ({ jobId, failedReason, prev }) => {
  // After all retries exhausted
  const job = await emailQueue.getJob(jobId);
  if (job && job.attemptsMade >= job.opts.attempts!) {
    await alertingService.notify({
      type: "job_dead_lettered",
      queue: "email",
      jobId,
      data: job.data,
      error: failedReason,
    });
  }
});
```

### Step 4 — Celery Pattern (Python)

```python
# tasks/email.py
from celery import Celery
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)
app = Celery('tasks', broker=os.environ['REDIS_URL'])
app.conf.task_default_retry_delay = 60  # seconds

@app.task(
    bind=True,
    max_retries=3,
    autoretry_for=(Exception,),
    retry_backoff=True,         # exponential backoff
    retry_jitter=True,
)
def send_welcome_email(self, user_id: str):
    logger.info(f'Sending welcome email for user {user_id}')
    try:
        user = User.objects.get(pk=user_id)
        email_service.send_welcome(user)
    except TemporaryEmailError as exc:
        raise self.retry(exc=exc)
    except Exception as exc:
        logger.error(f'Failed permanently: {exc}')
        raise  # goes to dead-letter / FAILURE state
```

### Step 5 — Monitoring Checklist

Configure:

- [ ] Queue depth monitoring (alert if > N jobs pending for > X minutes)
- [ ] Failed job alerts (dead-letter queue drain)
- [ ] Worker health checks (heartbeat endpoint)
- [ ] Job duration p50/p99 metrics

---

## Output Format

1. **Architecture diagram** (text) — request → queue → worker flow
2. **Job type definitions** — TypeScript interfaces or Python dataclasses
3. **Queue configuration** — with default retry policy and backoff
4. **Worker file** — complete with error handling and logging
5. **Enqueue example** — how to trigger the job from an API route
6. **Dead-letter handler** — alerting when jobs exhaust retries

---

## Safety & Confirmation

- Never enqueue jobs that modify data without idempotency — use a job ID to prevent double-processing.
- Use exponential backoff by default (2s, 4s, 8s) — not fixed retry intervals.
- For exactly-once requirements, note that most queues guarantee at-least-once; idempotency must be handled in the job itself.
- Never put large payloads in a job — put the ID and fetch the data inside the worker.

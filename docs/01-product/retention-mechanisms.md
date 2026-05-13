# Retention Mechanisms

Last updated: 2026-05-12
Owner: Product Growth
Status: Working draft

## Objective

Increase subscriber lifetime value by building recurring weekly habits tied to measurable decision utility.

## Retention Principles

1. Utility retention beats novelty retention.
2. Repeatable workflows matter more than one-time wins.
3. Personalization should reduce effort, not add complexity.
4. Trust and transparency are retention levers.

## Core Retention Loops

### Loop A: Weekly Tournament Prep Loop

Trigger:
New tournament data/projections are available.

User actions:
- Review updated projections
- Use filters/comparison tools
- Save shortlist/watchlist

Reinforcement:
- Alert when tracked players materially move
- Pre-event reminder with saved context

### Loop B: Model Trust Loop

Trigger:
User interacts with explainability and retrospective model performance.

User actions:
- Validate assumptions
- Compare model outputs to outcomes

Reinforcement:
- Confidence in process increases willingness to return weekly

### Loop C: Personalization Loop

Trigger:
User saves preferences (markets, player types, risk profiles).

User actions:
- Return to tailored views
- Adjust preferences over time

Reinforcement:
- Faster research and reduced decision fatigue

## Lifecycle Retention Strategy

### Day 0-7 (Activation Window)

Goals:
- Reach first high-value action quickly
- Demonstrate clear premium value

Mechanisms:
- Guided first-use checklist
- Starter watchlist creation flow
- Contextual prompts to explainability module

### Day 8-30 (Habit Formation)

Goals:
- Establish weekly usage pattern
- Increase depth of feature adoption

Mechanisms:
- Weekly tournament prep reminders
- Personalized "what changed" summaries
- Saved filters and one-click comparison shortcuts

### Day 31+ (Mature Retention)

Goals:
- Prevent boredom/churn
- Expand feature surface usage

Mechanisms:
- Retrospective performance snapshots
- Seasonal insights and milestone recaps
- Power-user workflows (advanced comparisons, multi-market views)

## Product Mechanisms by Type

### In-Product

- Saved presets and one-click return states
- Watchlists with movement alerts
- "Continue where you left off" cards
- Weekly summary modules

### Messaging

- Triggered emails based on intent signals
- Optional push/notification reminders
- Win-back sequences for dormant users

### Trust and Transparency

- Projection explainability access
- Model version context visibility
- Historical calibration/performance visibility

## Churn Risk Signals

High-risk patterns:

- No premium feature interaction for 14+ days
- No watchlist or saved preset after first week
- Repeated paywall views without deeper engagement after subscribe
- Cancellation page visits without support interactions

## Intervention Playbooks

### At-Risk Subscriber Playbook

1. Detect low-engagement threshold breach.
2. Send personalized recovery prompt with relevant workflow entry point.
3. Offer guided reactivation flow (for example "build your weekly card in 3 steps").
4. Monitor for resumed high-value actions within 7 days.

### Pre-Cancel Playbook

1. Ask structured cancellation reason.
2. Offer plan alternatives (monthly/annual pause option where supported).
3. Surface underused high-value features tied to user behavior.
4. Log reason taxonomy for product roadmap input.

## Retention Metrics

Primary:

- Week-4 premium retention
- Monthly subscriber churn
- WAU/MAU for subscribers
- High-value action frequency per subscriber

Secondary:

- Watchlist adoption rate
- Saved preset adoption rate
- Explainability engagement rate
- Reactivation success rate

## Ownership Map

- Product: mechanism design and prioritization
- Frontend/Backend: implementation
- Analytics: instrumentation and cohort analysis
- Lifecycle marketing: messaging orchestration

## 60-Day Execution Plan

1. Ship watchlists + saved presets with analytics events.
2. Ship weekly tournament reminder sequence tied to user preferences.
3. Add churn-risk scoring from behavior signals.
4. Launch at-risk intervention experiments and track retention lift.

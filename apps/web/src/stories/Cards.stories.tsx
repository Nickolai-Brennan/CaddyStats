import type { Meta, StoryObj } from "@storybook/react";
import {
  MetricCard,
  TrendCard,
  ProjectionCard,
  InsightCard,
  ConfidenceCard,
  AlertCard,
  ComparisonCard,
} from "@/components/ui";

// ---------------------------------------------------------------------------
// MetricCard
// ---------------------------------------------------------------------------
const MetricCardMeta: Meta<typeof MetricCard> = {
  title: "Cards/MetricCard",
  component: MetricCard,
  tags: ["autodocs"],
  args: {
    label: "Strokes Gained: Total",
    value: "+2.41",
    detail: "Season average · Top 5%",
  },
};
export default MetricCardMeta;
type MetricStory = StoryObj<typeof MetricCard>;
export const Default: MetricStory = {};
export const Highlighted: MetricStory = { args: { highlighted: true } };

// ---------------------------------------------------------------------------
// TrendCard
// ---------------------------------------------------------------------------
export const TrendUp: StoryObj<typeof TrendCard> = {
  name: "TrendCard / Up",
  render: () => (
    <TrendCard
      label="SG: Approach"
      value="+1.08"
      change={0.22}
      changeLabel="vs last 3 events"
      detail="Iron play rank: #4"
    />
  ),
};

// ---------------------------------------------------------------------------
// ProjectionCard
// ---------------------------------------------------------------------------
export const Projection: StoryObj<typeof ProjectionCard> = {
  name: "ProjectionCard",
  render: () => (
    <ProjectionCard
      playerName="Rory McIlroy"
      projection={267.5}
      confidence={82}
      position="T3"
      detail="Augusta National · Masters 2026"
    />
  ),
};

// ---------------------------------------------------------------------------
// InsightCard
// ---------------------------------------------------------------------------
export const Insight: StoryObj<typeof InsightCard> = {
  name: "InsightCard",
  render: () => (
    <InsightCard
      title="Key Trend"
      insight="McIlroy has gained 1.2 strokes per round on approach over the last 6 events, driven by a 3.8-yard distance increase."
      source="ShotLink 2026"
      tone="default"
    />
  ),
};

// ---------------------------------------------------------------------------
// ConfidenceCard
// ---------------------------------------------------------------------------
export const Confidence: StoryObj<typeof ConfidenceCard> = {
  name: "ConfidenceCard",
  render: () => (
    <ConfidenceCard label="Model Confidence" score={78} detail="Based on 24 data points" />
  ),
};

// ---------------------------------------------------------------------------
// AlertCard
// ---------------------------------------------------------------------------
export const Alert: StoryObj<typeof AlertCard> = {
  name: "AlertCard / Warning",
  render: () => (
    <AlertCard
      title="Weather Risk"
      message="Thunderstorm delays expected Saturday 14:00–17:00 EST."
      tone="warning"
    />
  ),
};

// ---------------------------------------------------------------------------
// ComparisonCard
// ---------------------------------------------------------------------------
export const Comparison: StoryObj<typeof ComparisonCard> = {
  name: "ComparisonCard",
  render: () => (
    <ComparisonCard
      label="SG: Putting vs Field"
      max={3}
      items={[
        { name: "McIlroy", value: 0.82 },
        { name: "Scheffler", value: 1.21 },
        { name: "Rahm", value: -0.14 },
        { name: "Field avg", value: 0 },
      ]}
    />
  ),
};

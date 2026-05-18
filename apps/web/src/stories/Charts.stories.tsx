import type { Meta, StoryObj } from "@storybook/react";
import { BarChart, Sparkline, LineChart, ConfidenceBands, RadarChart } from "@/components/ui";

// ---------------------------------------------------------------------------
// BarChart
// ---------------------------------------------------------------------------
const barData = [
  { label: "Rory McIlroy", value: 68.4 },
  { label: "Scottie Scheffler", value: 67.9 },
  { label: "Jon Rahm", value: 67.2 },
  { label: "Xander Schauffele", value: 66.8 },
  { label: "Viktor Hovland", value: 66.1 },
];

const BarMeta: Meta<typeof BarChart> = {
  title: "Charts/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  args: { title: "Average Score", data: barData },
};
export default BarMeta;
type BarStory = StoryObj<typeof BarChart>;
export const Default: BarStory = {};
export const NoTitle: BarStory = { args: { title: undefined } };

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------
export const SparklineStory: StoryObj<typeof Sparkline> = {
  name: "Sparkline",
  render: () => (
    <Sparkline
      points={[68.1, 67.8, 69.2, 66.5, 67.0, 65.9, 68.3]}
      label="Rory McIlroy — Scoring Trend"
    />
  ),
};

// ---------------------------------------------------------------------------
// LineChart
// ---------------------------------------------------------------------------
const lineSeries = [
  {
    name: "McIlroy",
    data: [
      { label: "Rd1", value: 68 },
      { label: "Rd2", value: 65 },
      { label: "Rd3", value: 67 },
      { label: "Rd4", value: 63 },
    ],
  },
  {
    name: "Scheffler",
    data: [
      { label: "Rd1", value: 70 },
      { label: "Rd2", value: 66 },
      { label: "Rd3", value: 65 },
      { label: "Rd4", value: 64 },
    ],
  },
];

export const LineChartStory: StoryObj<typeof LineChart> = {
  name: "LineChart",
  render: () => (
    <div className="w-[480px]">
      <LineChart title="Round-by-Round Scoring" series={lineSeries} />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// ConfidenceBands
// ---------------------------------------------------------------------------
const bandsData = [
  { label: "Rd1", median: 68, low: 66, high: 70 },
  { label: "Rd2", median: 66, low: 63, high: 69 },
  { label: "Rd3", median: 65, low: 62, high: 68 },
  { label: "Rd4", median: 64, low: 61, high: 67 },
];

export const ConfidenceBandsStory: StoryObj<typeof ConfidenceBands> = {
  name: "ConfidenceBands",
  render: () => (
    <div className="w-[480px]">
      <ConfidenceBands title="Projected Score Range" data={bandsData} />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// RadarChart
// ---------------------------------------------------------------------------
const radarData = [
  { axis: "Driving", value: 87 },
  { axis: "Iron Play", value: 91 },
  { axis: "Short Game", value: 78 },
  { axis: "Putting", value: 85 },
  { axis: "Scrambling", value: 73 },
  { axis: "Par 5 Scoring", value: 94 },
];

export const RadarChartStory: StoryObj<typeof RadarChart> = {
  name: "RadarChart",
  render: () => <RadarChart title="Player Profile — McIlroy" data={radarData} />,
};

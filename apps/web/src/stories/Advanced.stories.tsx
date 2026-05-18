import type { Meta, StoryObj } from "@storybook/react";
import {
  WidgetShell,
  DeltaCard,
  ExposureMetric,
  AISummaryCard,
  AnomalyDetectorWidget,
  ChartWrapper,
  ChartDateSelector,
  CompareSelector,
  NetworkGraph,
  ConfidenceNetwork,
  NumericCell,
  PercentageCell,
  OddsCell,
  ConfidenceBadgeCell,
  TrendIndicatorCell,
} from "@/components/ui";
import { useState } from "react";

const meta: Meta = { title: "Advanced", tags: ["autodocs"] };
export default meta;

// WidgetShell
export const WidgetShellDefault: StoryObj = {
  name: "DS-11A / WidgetShell",
  render: () => (
    <WidgetShell title="SG: Total" subtitle="Season average — Top 50">
      <p className="text-sm text-slate-300">Widget content here.</p>
    </WidgetShell>
  ),
};
export const WidgetShellLoading: StoryObj = {
  name: "DS-11A / WidgetShell Loading",
  render: () => <WidgetShell title="Loading..." loading />,
};
export const WidgetShellError: StoryObj = {
  name: "DS-11A / WidgetShell Error",
  render: () => <WidgetShell title="SG: Total" error="Failed to load projection data" />,
};

// DeltaCard
export const DeltaCardUp: StoryObj = {
  name: "DS-11A / DeltaCard +",
  render: () => (
    <DeltaCard label="SG: Total" value="+2.41" delta={0.18} deltaLabel="vs last 5 events" />
  ),
};
export const DeltaCardDown: StoryObj = {
  name: "DS-11A / DeltaCard -",
  render: () => (
    <DeltaCard label="SG: Putting" value="-0.22" delta={-0.08} deltaLabel="this week" />
  ),
};

// ExposureMetric
export const ExposureOk: StoryObj = {
  name: "DS-11A / ExposureMetric OK",
  render: () => <ExposureMetric label="McIlroy Exposure" value={18} capacity={100} />,
};
export const ExposureHigh: StoryObj = {
  name: "DS-11A / ExposureMetric High",
  render: () => <ExposureMetric label="Scheffler Exposure" value={82} capacity={100} />,
};

// AISummaryCard
export const AISummary: StoryObj = {
  name: "DS-11A / AISummaryCard",
  render: () => (
    <AISummaryCard
      title="Tournament Outlook"
      summary="McIlroy enters Augusta with a career-best ball-striking season. His approach metrics rank #1 in the field and course history shows above-average performance on Bermuda greens."
      confidence={78}
      modelVersion="CaddyStats v2.1"
      generatedAt="2026-04-07"
      disclaimer="AI output is grounded in ShotLink data but should not be used as sole betting basis."
    />
  ),
};

// AnomalyDetectorWidget
export const AnomalyDetector: StoryObj = {
  name: "DS-11A / AnomalyDetector",
  render: () => (
    <AnomalyDetectorWidget
      anomalies={[
        {
          player: "McIlroy",
          stat: "SG: Putt",
          value: 1.42,
          expected: 0.21,
          zScore: 2.8,
          direction: "above",
        },
        {
          player: "Rahm",
          stat: "GIR%",
          value: 42.1,
          expected: 70.3,
          zScore: -3.1,
          direction: "below",
        },
      ]}
    />
  ),
};

// ChartWrapper + ChartDateSelector
function ChartWrapperDemo() {
  const [tf, setTf] = useState<"1W" | "1M" | "3M" | "6M" | "1Y" | "All">("3M");
  return (
    <div className="w-[480px]">
      <ChartWrapper
        title="SG: Total Trend"
        subtitle="Rolling 12-event average"
        controls={<ChartDateSelector value={tf} onChange={setTf} />}
        onExport={() => alert("Export triggered")}
      >
        <p className="text-sm text-slate-500">Chart content for {tf} timeframe</p>
      </ChartWrapper>
    </div>
  );
}

export const ChartWrapperStory: StoryObj = {
  name: "DS-11B / ChartWrapper",
  render: () => <ChartWrapperDemo />,
};

// CompareSelector
function CompareSelectorDemo() {
  const [sel, setSel] = useState<string[]>(["rory"]);
  const options = [
    { id: "rory", label: "McIlroy" },
    { id: "scottie", label: "Scheffler" },
    { id: "rahm", label: "Rahm" },
    { id: "viktor", label: "Hovland" },
    { id: "xander", label: "Schauffele" },
  ];
  return <CompareSelector options={options} selected={sel} onChange={setSel} max={3} />;
}

export const CompareSelectorStory: StoryObj = {
  name: "DS-11B / CompareSelector",
  render: () => <CompareSelectorDemo />,
};

// NetworkGraph
export const NetworkGraphStory: StoryObj = {
  name: "DS-11D / NetworkGraph",
  render: () => (
    <NetworkGraph
      title="Player Similarity Network — Bermuda Putting"
      nodes={[
        { id: "rory", label: "McIlroy", group: "Bermuda Strong", weight: 0.6 },
        { id: "scottie", label: "Scheffler", group: "Bermuda Strong", weight: 0.8 },
        { id: "rahm", label: "Rahm", group: "Bermuda Avg", weight: 0.4 },
        { id: "viktor", label: "Hovland", group: "Bermuda Avg", weight: 0.3 },
        { id: "xander", label: "Schauffele", group: "Bermuda Weak", weight: 0.2 },
      ]}
      edges={[
        { source: "rory", target: "scottie", weight: 0.8 },
        { source: "rahm", target: "viktor", weight: 0.6 },
        { source: "scottie", target: "rahm", weight: 0.4 },
        { source: "xander", target: "rory", weight: 0.3 },
      ]}
    />
  ),
};

// ConfidenceNetwork
export const ConfidenceNetworkStory: StoryObj = {
  name: "DS-11D / ConfidenceNetwork",
  render: () => (
    <ConfidenceNetwork
      title="Model Confidence Network"
      nodes={[
        { id: "a", label: "McIlroy", confidence: 85 },
        { id: "b", label: "Scheffler", confidence: 78 },
        { id: "c", label: "Rahm", confidence: 62 },
        { id: "d", label: "Hovland", confidence: 45 },
        { id: "e", label: "Schauffele", confidence: 38 },
      ]}
      edges={[
        { source: "a", target: "b", weight: 0.8 },
        { source: "b", target: "c", weight: 0.6 },
        { source: "c", target: "d", weight: 0.5 },
        { source: "d", target: "e", weight: 0.4 },
        { source: "a", target: "e", weight: 0.3 },
      ]}
    />
  ),
};

// Cell renderers
export const CellRenderers: StoryObj = {
  name: "DS-10A / Cell Renderers",
  render: () => (
    <div className="flex flex-wrap gap-6 p-4">
      <div>
        <p className="mb-2 text-xs text-slate-500">NumericCell</p>
        <NumericCell value={2.41} />
      </div>
      <div>
        <p className="mb-2 text-xs text-slate-500">NumericCell (neg)</p>
        <NumericCell value={-0.72} />
      </div>
      <div>
        <p className="mb-2 text-xs text-slate-500">PercentageCell</p>
        <PercentageCell value={68.3} />
      </div>
      <div>
        <p className="mb-2 text-xs text-slate-500">OddsCell (+)</p>
        <OddsCell american={350} />
      </div>
      <div>
        <p className="mb-2 text-xs text-slate-500">OddsCell (-)</p>
        <OddsCell american={-180} />
      </div>
      <div>
        <p className="mb-2 text-xs text-slate-500">ConfidenceBadge High</p>
        <ConfidenceBadgeCell score={84} />
      </div>
      <div>
        <p className="mb-2 text-xs text-slate-500">ConfidenceBadge Low</p>
        <ConfidenceBadgeCell score={34} />
      </div>
      <div>
        <p className="mb-2 text-xs text-slate-500">TrendIndicator</p>
        <TrendIndicatorCell direction="up" magnitude="strong" />
      </div>
    </div>
  ),
};

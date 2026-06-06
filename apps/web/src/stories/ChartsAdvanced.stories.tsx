import type { Meta, StoryObj } from "@storybook/react";
import { StackedBarChart, ScatterPlot, HeatMap, Timeline } from "@/components/ui";

const meta: Meta = { title: "Charts/Advanced", tags: ["autodocs"] };
export default meta;

// StackedBarChart
export const StackedBar: StoryObj = {
  name: "StackedBarChart",
  render: () => (
    <div className="w-[480px]">
      <StackedBarChart
        title="SG Components — Top 5 Players"
        data={[
          {
            label: "McIlroy",
            segments: [
              { name: "OTT", value: 0.8 },
              { name: "App", value: 1.1 },
              { name: "Putt", value: 0.5 },
            ],
          },
          {
            label: "Scheffler",
            segments: [
              { name: "OTT", value: 0.6 },
              { name: "App", value: 1.3 },
              { name: "Putt", value: 0.4 },
            ],
          },
          {
            label: "Rahm",
            segments: [
              { name: "OTT", value: 0.7 },
              { name: "App", value: 0.9 },
              { name: "Putt", value: 0.3 },
            ],
          },
        ]}
      />
    </div>
  ),
};

// ScatterPlot
export const Scatter: StoryObj = {
  name: "ScatterPlot",
  render: () => (
    <div className="w-[400px]">
      <ScatterPlot
        title="SG: Putting vs SG: Approach"
        xLabel="SG: Approach"
        yLabel="SG: Putting"
        data={[
          { x: 0.8, y: 0.5, label: "McIlroy", highlight: true },
          { x: 1.3, y: 0.4 },
          { x: 0.9, y: 0.3 },
          { x: 0.4, y: 1.2 },
          { x: 1.1, y: -0.2 },
          { x: 0.2, y: 0.7 },
          { x: 0.6, y: 0.1 },
          { x: -0.1, y: 0.9 },
          { x: 1.5, y: 0.6 },
          { x: 0.7, y: -0.4 },
        ]}
      />
    </div>
  ),
};

// HeatMap
export const HeatMapStory: StoryObj = {
  name: "HeatMap",
  render: () => (
    <HeatMap
      title="SG: Total by Round × Player"
      rows={["McIlroy", "Scheffler", "Rahm", "Hovland"]}
      cols={["Rd 1", "Rd 2", "Rd 3", "Rd 4"]}
      data={[
        { row: "McIlroy", col: "Rd 1", value: 0.8 },
        { row: "McIlroy", col: "Rd 2", value: 2.1 },
        { row: "McIlroy", col: "Rd 3", value: 1.4 },
        { row: "McIlroy", col: "Rd 4", value: 3.2 },
        { row: "Scheffler", col: "Rd 1", value: 1.9 },
        { row: "Scheffler", col: "Rd 2", value: 0.5 },
        { row: "Scheffler", col: "Rd 3", value: 2.3 },
        { row: "Scheffler", col: "Rd 4", value: 1.1 },
        { row: "Rahm", col: "Rd 1", value: -0.3 },
        { row: "Rahm", col: "Rd 2", value: 1.8 },
        { row: "Rahm", col: "Rd 3", value: 0.9 },
        { row: "Rahm", col: "Rd 4", value: 2.6 },
        { row: "Hovland", col: "Rd 1", value: 0.2 },
        { row: "Hovland", col: "Rd 2", value: -0.8 },
        { row: "Hovland", col: "Rd 3", value: 1.5 },
        { row: "Hovland", col: "Rd 4", value: 0.7 },
      ]}
    />
  ),
};

// Timeline
export const TimelineStory: StoryObj = {
  name: "Timeline",
  render: () => (
    <div className="w-80">
      <Timeline
        title="Masters 2026 — Event Timeline"
        events={[
          { date: "Apr 7, 2026", label: "Field announced", tone: "info" },
          {
            date: "Apr 10, 2026",
            label: "Round 1 complete",
            detail: "McIlroy leads at -7",
            tone: "success",
          },
          {
            date: "Apr 11, 2026",
            label: "Round 2 complete",
            detail: "Weather delay — 2hr",
            tone: "warning",
          },
          {
            date: "Apr 12, 2026",
            label: "Round 3 complete",
            detail: "McIlroy -19, Scheffler -17",
            tone: "success",
          },
          { date: "Apr 13, 2026", label: "Final round", tone: "default" },
        ]}
      />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { PredictiveSearch, SearchResultsPanel } from "@/components/ui";
import { useState } from "react";

const meta: Meta = { title: "Search/Advanced", tags: ["autodocs"] };
export default meta;

const allSuggestions = [
  { id: "rory", label: "Rory McIlroy", sublabel: "#2 World Ranking", category: "Player" },
  { id: "scottie", label: "Scottie Scheffler", sublabel: "#1 World Ranking", category: "Player" },
  {
    id: "masters",
    label: "The Masters 2026",
    sublabel: "Augusta National · Apr 2026",
    category: "Tournament",
  },
  { id: "augusta", label: "Augusta National", sublabel: "Augusta, GA", category: "Course" },
];

function PredictiveSearchDemo() {
  const [query, setQuery] = useState("");
  const filtered = allSuggestions.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="w-80">
      <PredictiveSearch
        suggestions={query.length > 0 ? filtered : []}
        onQueryChange={setQuery}
        onSelect={(s) => alert(`Selected: ${s.label}`)}
      />
    </div>
  );
}

export const PredictiveSearchStory: StoryObj = {
  name: "PredictiveSearch",
  render: () => <PredictiveSearchDemo />,
};

export const PredictiveSearchLoading: StoryObj = {
  name: "PredictiveSearch / Loading",
  render: () => (
    <div className="w-80">
      <PredictiveSearch suggestions={[]} defaultValue="Rory" loading onQueryChange={() => {}} />
    </div>
  ),
};

export const SearchResultsPanelStory: StoryObj = {
  name: "SearchResultsPanel",
  render: () => (
    <div className="w-96">
      <SearchResultsPanel
        query="rory"
        groups={[
          {
            group: "Players",
            items: [
              {
                id: "rory",
                title: "Rory McIlroy",
                subtitle: "#2 World Ranking · FDP: $11,800",
                meta: "T2",
              },
              { id: "rory-jr", title: "Rory J. (Web.com)", subtitle: "Korn Ferry Tour", meta: "" },
            ],
          },
          {
            group: "Tournaments",
            items: [
              {
                id: "masters",
                title: "The Masters 2026",
                subtitle: "Apr 10–13, Augusta National",
                meta: "Upcoming",
              },
            ],
          },
        ]}
      />
    </div>
  ),
};

export const SearchResultsPanelEmpty: StoryObj = {
  name: "SearchResultsPanel / Empty",
  render: () => (
    <div className="w-96">
      <SearchResultsPanel query="zzz" groups={[]} />
    </div>
  ),
};

export const SearchResultsPanelLoading: StoryObj = {
  name: "SearchResultsPanel / Loading",
  render: () => (
    <div className="w-96">
      <SearchResultsPanel query="rory" groups={[]} loading />
    </div>
  ),
};

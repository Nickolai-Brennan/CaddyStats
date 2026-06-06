import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput, FilterChips, DateRangeSelector, RangeControl } from "@/components/ui";

// ---------------------------------------------------------------------------
// SearchInput
// ---------------------------------------------------------------------------
const SearchMeta: Meta<typeof SearchInput> = {
  title: "Search/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  args: { placeholder: "Search players…" },
};
export default SearchMeta;
type SearchStory = StoryObj<typeof SearchInput>;
export const Empty: SearchStory = {};
export const WithValue: SearchStory = { args: { defaultValue: "Rory" } };
export const AutoFocus: SearchStory = { args: { autoFocus: true } };

// ---------------------------------------------------------------------------
// FilterChips
// ---------------------------------------------------------------------------
const chips = [
  { id: "sg-total", label: "SG: Total" },
  { id: "sg-app", label: "SG: App" },
  { id: "sg-ott", label: "SG: OTT" },
  { id: "sg-putt", label: "SG: Putt" },
];

export const ChipsSingle: StoryObj<typeof FilterChips> = {
  name: "FilterChips / Single",
  render: () => <FilterChips chips={chips} />,
};
export const ChipsMulti: StoryObj<typeof FilterChips> = {
  name: "FilterChips / Multi",
  render: () => <FilterChips chips={chips} multiple />,
};

// ---------------------------------------------------------------------------
// DateRangeSelector
// ---------------------------------------------------------------------------
export const DateRange: StoryObj<typeof DateRangeSelector> = {
  name: "DateRangeSelector",
  render: () => <DateRangeSelector label="Event date range" />,
};

// ---------------------------------------------------------------------------
// RangeControl
// ---------------------------------------------------------------------------
export const Range: StoryObj<typeof RangeControl> = {
  name: "RangeControl",
  render: () => (
    <div className="w-64">
      <RangeControl
        label="Strokes Gained range"
        min={-3}
        max={3}
        step={0.1}
        format={(v) => v.toFixed(1)}
      />
    </div>
  ),
};

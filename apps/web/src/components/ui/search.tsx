/**
 * DS-13 Search + Filter Components
 *
 * SearchInput      — text search field with icon and clear button
 * FilterChips      — horizontal pill-chip filter group (single or multi select)
 * DateRangeSelector — start/end date range inputs
 * RangeControl     — numeric min/max slider + inputs
 */

import { useState, type ChangeEvent } from "react";
import { cx } from "./utils";

// ---------------------------------------------------------------------------
// SearchInput (DS-13)
// ---------------------------------------------------------------------------
interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  autoFocus?: boolean;
  className?: string;
  id?: string;
}

export function SearchInput({
  value,
  defaultValue,
  placeholder = "Search…",
  onChange,
  onSearch,
  autoFocus,
  className,
  id,
}: SearchInputProps) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (!controlled) setInternal(v);
    onChange?.(v);
  }

  function handleClear() {
    if (!controlled) setInternal("");
    onChange?.("");
  }

  return (
    <div className={cx("relative", className)}>
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
      >
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        id={id}
        type="search"
        value={current}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && onSearch?.(current)}
        className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 pl-9 pr-9 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
      />
      {current && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-500 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Clear search"
        >
          <svg viewBox="0 0 12 12" fill="none" className="h-3.5 w-3.5" aria-hidden>
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FilterChips (DS-13)
// ---------------------------------------------------------------------------
interface FilterChip {
  id: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  chips: FilterChip[];
  selected?: string | string[];
  onSelect?: (id: string | string[]) => void;
  multiple?: boolean;
  allLabel?: string;
  className?: string;
}

export function FilterChips({
  chips,
  selected,
  onSelect,
  multiple = false,
  allLabel = "All",
  className,
}: FilterChipsProps) {
  const [internal, setInternal] = useState<string[]>([]);

  const isControlled = selected !== undefined;
  const activeIds: string[] = isControlled
    ? Array.isArray(selected)
      ? selected
      : selected === "" ? [] : [selected]
    : internal;

  function handleSelect(id: string) {
    let next: string[];
    if (id === "__all__") {
      next = [];
    } else if (multiple) {
      next = activeIds.includes(id)
        ? activeIds.filter((i) => i !== id)
        : [...activeIds, id];
    } else {
      next = activeIds[0] === id ? [] : [id];
    }
    if (!isControlled) setInternal(next);
    onSelect?.(multiple ? next : next[0] ?? "");
  }

  const isAll = activeIds.length === 0;

  return (
    <div
      role="group"
      aria-label="Filter options"
      className={cx("flex flex-wrap gap-1.5", className)}
    >
      <button
        type="button"
        onClick={() => handleSelect("__all__")}
        className={cx(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
          isAll
            ? "bg-amber-500 text-slate-950"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        )}
      >
        {allLabel}
      </button>
      {chips.map((chip) => {
        const active = activeIds.includes(chip.id);
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => handleSelect(chip.id)}
            aria-pressed={active}
            className={cx(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
              active
                ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            )}
          >
            {chip.label}
            {chip.count !== undefined && (
              <span className={cx("rounded-full px-1.5 text-[10px]", active ? "bg-amber-500/30" : "bg-slate-700")}>
                {chip.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DateRangeSelector (DS-13)
// ---------------------------------------------------------------------------
interface DateRangeValue {
  start: string;
  end: string;
}

interface DateRangeSelectorProps {
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  className?: string;
  label?: string;
}

export function DateRangeSelector({ value, onChange, className, label }: DateRangeSelectorProps) {
  const [internal, setInternal] = useState<DateRangeValue>({ start: "", end: "" });
  const current = value ?? internal;

  function update(field: "start" | "end", v: string) {
    const next = { ...current, [field]: v };
    if (!value) setInternal(next);
    onChange?.(next);
  }

  return (
    <fieldset className={cx("space-y-1", className)}>
      {label && <legend className="text-xs font-medium text-slate-400">{label}</legend>}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={current.start}
          onChange={(e) => update("start", e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 [color-scheme:dark] focus:border-amber-500 focus:outline-none"
          aria-label="Start date"
        />
        <span className="text-xs text-slate-500">to</span>
        <input
          type="date"
          value={current.end}
          min={current.start}
          onChange={(e) => update("end", e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 [color-scheme:dark] focus:border-amber-500 focus:outline-none"
          aria-label="End date"
        />
      </div>
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// RangeControl (DS-13)
// ---------------------------------------------------------------------------
interface RangeControlProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
  format?: (v: number) => string;
  className?: string;
}

export function RangeControl({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  format = (v) => String(v),
  className,
}: RangeControlProps) {
  const [internal, setInternal] = useState<[number, number]>([min, max]);
  const current = value ?? internal;

  function update(index: 0 | 1, v: number) {
    const next: [number, number] = [...current] as [number, number];
    next[index] = v;
    if (index === 0 && v > next[1]) next[1] = v;
    if (index === 1 && v < next[0]) next[0] = v;
    if (!value) setInternal(next);
    onChange?.(next);
  }

  const leftPct = ((current[0] - min) / (max - min)) * 100;
  const rightPct = ((current[1] - min) / (max - min)) * 100;

  return (
    <fieldset className={cx("space-y-3", className)}>
      <legend className="text-xs font-medium text-slate-400">{label}</legend>
      <div className="relative h-1.5 rounded-full bg-slate-800">
        <div
          className="absolute h-1.5 rounded-full bg-amber-500"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />
        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current[0]}
          onChange={(e) => update(0, Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:shadow"
          aria-label={`${label} minimum`}
        />
        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current[1]}
          onChange={(e) => update(1, Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:shadow"
          aria-label={`${label} maximum`}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{format(current[0])}</span>
        <span>{format(current[1])}</span>
      </div>
    </fieldset>
  );
}

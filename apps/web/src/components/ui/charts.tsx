interface BarChartDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  title?: string;
  data: BarChartDatum[];
  max?: number;
}

export function BarChart({ title, data, max }: BarChartProps) {
  const maxValue = max ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <figure className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      {title && (
        <figcaption className="mb-4 text-sm font-medium text-slate-300">{title}</figcaption>
      )}
      <div className="space-y-3">
        {data.map((point) => (
          <div key={point.label} className="grid grid-cols-[120px_1fr_auto] items-center gap-3">
            <span className="truncate text-xs text-slate-400">{point.label}</span>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                style={{ width: `${Math.max(0, Math.min(100, (point.value / maxValue) * 100))}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-300">{point.value.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

interface SparklineProps {
  points: number[];
  label: string;
}

export function Sparkline({ points, label }: SparklineProps) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const span = Math.max(max - min, 1);
  const width = 240;
  const height = 60;

  const path = points
    .map((value, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - ((value - min) / span) * height;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <figure className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <figcaption className="mb-3 text-sm text-slate-300">{label}</figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-16 w-full" role="img" aria-label={label}>
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          className="text-amber-400"
          strokeWidth="2"
        />
      </svg>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// LineChart (DS-11)
// ---------------------------------------------------------------------------
interface LineChartDatum {
  label: string;
  value: number;
}

interface LineChartSeries {
  name: string;
  data: LineChartDatum[];
  color?: string;
}

interface LineChartProps {
  title?: string;
  series: LineChartSeries[];
  height?: number;
}

export function LineChart({ title, series, height = 160 }: LineChartProps) {
  const width = 480;
  const allValues = series.flatMap((s) => s.data.map((d) => d.value));
  const maxVal = Math.max(...allValues, 1);
  const minVal = Math.min(...allValues, 0);
  const span = Math.max(maxVal - minVal, 1);
  const defaultColors = ["#f59e0b", "#38bdf8", "#a78bfa", "#34d399", "#fb7185"];

  function toPath(data: LineChartDatum[]): string {
    return data
      .map((d, i) => {
        const x = (i / Math.max(data.length - 1, 1)) * width;
        const y = height - ((d.value - minVal) / span) * height;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }

  function toAreaPath(data: LineChartDatum[]): string {
    const linePts = data.map((d, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * width;
      const y = height - ((d.value - minVal) / span) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });
    if (linePts.length === 0) return "";
    const firstX = linePts[0].split(",")[0];
    const lastX = linePts[linePts.length - 1].split(",")[0];
    return `M${linePts[0]} L${linePts.slice(1).join(" L")} L${lastX},${height} L${firstX},${height} Z`;
  }

  const labels = series[0]?.data.map((d) => d.label) ?? [];

  return (
    <figure className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      {title && (
        <figcaption className="mb-3 text-sm font-medium text-slate-300">{title}</figcaption>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={title ?? "Line chart"}
        style={{ height }}
      >
        {series.map((s, si) => {
          const color = s.color ?? defaultColors[si % defaultColors.length];
          return (
            <g key={s.name}>
              <path d={toAreaPath(s.data)} fill={color} fillOpacity="0.06" />
              <path
                d={toPath(s.data)}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>
      {/* X-axis labels */}
      {labels.length > 0 && (
        <div className="mt-1 flex justify-between text-[10px] text-slate-600">
          {labels.map(
            (l, i) =>
              (i === 0 || i === labels.length - 1 || i === Math.floor(labels.length / 2)) && (
                <span key={i}>{l}</span>
              )
          )}
        </div>
      )}
      {/* Legend */}
      {series.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {series.map((s, si) => (
            <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: s.color ?? defaultColors[si % defaultColors.length] }}
                aria-hidden
              />
              {s.name}
            </div>
          ))}
        </div>
      )}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// ConfidenceBands (DS-11)
// ---------------------------------------------------------------------------
interface ConfidenceBandsDatum {
  label: string;
  median: number;
  low: number;
  high: number;
}

interface ConfidenceBandsProps {
  title?: string;
  data: ConfidenceBandsDatum[];
  height?: number;
}

export function ConfidenceBands({ title, data, height = 160 }: ConfidenceBandsProps) {
  const width = 480;
  const allValues = data.flatMap((d) => [d.low, d.high]);
  const maxVal = Math.max(...allValues, 1);
  const minVal = Math.min(...allValues, 0);
  const span = Math.max(maxVal - minVal, 1);

  function toY(val: number) {
    return height - ((val - minVal) / span) * height;
  }

  const bandPath = [
    ...data.map((d, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * width;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${toY(d.high).toFixed(2)}`;
    }),
    ...data
      .slice()
      .reverse()
      .map((d, i) => {
        const origI = data.length - 1 - i;
        const x = (origI / Math.max(data.length - 1, 1)) * width;
        return `L${x.toFixed(2)},${toY(d.low).toFixed(2)}`;
      }),
    "Z",
  ].join(" ");

  const medianPath = data
    .map((d, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * width;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${toY(d.median).toFixed(2)}`;
    })
    .join(" ");

  return (
    <figure className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      {title && (
        <figcaption className="mb-3 text-sm font-medium text-slate-300">{title}</figcaption>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={title ?? "Confidence bands chart"}
        style={{ height }}
      >
        <path d={bandPath} fill="#38bdf8" fillOpacity="0.10" />
        <path
          d={medianPath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden />
          Median
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded bg-sky-400/30" aria-hidden />
          Confidence band
        </span>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// RadarChart (DS-11)
// ---------------------------------------------------------------------------
interface RadarChartDatum {
  axis: string;
  value: number;
}

interface RadarChartProps {
  title?: string;
  data: RadarChartDatum[];
  max?: number;
  size?: number;
}

export function RadarChart({ title, data, max = 100, size = 200 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const n = data.length;

  function getPoint(index: number, value: number): [number, number] {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = (value / max) * radius;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function getAxisEnd(index: number): [number, number] {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  }

  const polygon = data
    .map((d, i) => getPoint(i, d.value))
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  return (
    <figure className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      {title && (
        <figcaption className="mb-3 text-center text-sm font-medium text-slate-300">
          {title}
        </figcaption>
      )}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto"
        width={size}
        height={size}
        role="img"
        aria-label={title ?? "Radar chart"}
      >
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <polygon
            key={ratio}
            points={data
              .map((_, i) => {
                const [x, y] = getPoint(i, max * ratio);
                return `${x.toFixed(2)},${y.toFixed(2)}`;
              })
              .join(" ")}
            fill="none"
            stroke="rgba(148,163,184,0.12)"
            strokeWidth="1"
          />
        ))}
        {/* Axis lines */}
        {data.map((_, i) => {
          const [ex, ey] = getAxisEnd(i);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={ex.toFixed(2)}
              y2={ey.toFixed(2)}
              stroke="rgba(148,163,184,0.12)"
              strokeWidth="1"
            />
          );
        })}
        {/* Data polygon */}
        <polygon
          points={polygon}
          fill="rgba(245,158,11,0.20)"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Axis labels */}
        {data.map((d, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const lr = radius + 16;
          const lx = cx + lr * Math.cos(angle);
          const ly = cy + lr * Math.sin(angle);
          const anchor = Math.abs(lx - cx) < 5 ? "middle" : lx > cx ? "start" : "end";
          return (
            <text
              key={i}
              x={lx.toFixed(2)}
              y={(ly + 4).toFixed(2)}
              textAnchor={anchor}
              className="fill-slate-400"
              fontSize="9"
            >
              {d.axis}
            </text>
          );
        })}
      </svg>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// StackedBarChart (DS-11)
// ---------------------------------------------------------------------------
interface StackedBarDatum {
  label: string;
  segments: { name: string; value: number }[];
}

interface StackedBarChartProps {
  title?: string;
  data: StackedBarDatum[];
  colors?: string[];
  showLegend?: boolean;
}

export function StackedBarChart({
  title,
  data,
  colors = ["#f59e0b", "#38bdf8", "#a78bfa", "#34d399", "#fb7185"],
  showLegend = true,
}: StackedBarChartProps) {
  const segmentNames = data[0]?.segments.map((s) => s.name) ?? [];
  const maxTotal = Math.max(...data.map((d) => d.segments.reduce((sum, s) => sum + s.value, 0)), 1);

  return (
    <figure className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      {title && (
        <figcaption className="mb-4 text-sm font-medium text-slate-300">{title}</figcaption>
      )}
      <div className="space-y-3" role="list" aria-label={title ?? "Stacked bar chart"}>
        {data.map((row) => {
          const total = row.segments.reduce((sum, s) => sum + s.value, 0);
          const widthPct = (total / maxTotal) * 100;
          let accumulated = 0;
          return (
            <div
              key={row.label}
              role="listitem"
              className="grid grid-cols-[120px_1fr_auto] items-center gap-3"
            >
              <span className="truncate text-xs text-slate-400">{row.label}</span>
              <div
                className="relative h-5 overflow-hidden rounded-full bg-slate-800"
                style={{ width: `${widthPct}%` }}
              >
                {row.segments.map((seg, si) => {
                  const segPct = total > 0 ? (seg.value / total) * 100 : 0;
                  const left = accumulated;
                  accumulated += segPct;
                  return (
                    <div
                      key={seg.name}
                      className="absolute top-0 h-full"
                      style={{
                        left: `${left}%`,
                        width: `${segPct}%`,
                        background: colors[si % colors.length],
                      }}
                      title={`${seg.name}: ${seg.value}`}
                    />
                  );
                })}
              </div>
              <span className="text-xs font-medium text-slate-300">{total.toFixed(1)}</span>
            </div>
          );
        })}
      </div>
      {showLegend && segmentNames.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {segmentNames.map((name, i) => (
            <div key={name} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: colors[i % colors.length] }}
                aria-hidden
              />
              {name}
            </div>
          ))}
        </div>
      )}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// ScatterPlot (DS-11)
// ---------------------------------------------------------------------------
interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
  highlight?: boolean;
}

interface ScatterPlotProps {
  title?: string;
  data: ScatterPoint[];
  xLabel?: string;
  yLabel?: string;
  width?: number;
  height?: number;
}

export function ScatterPlot({
  title,
  data,
  xLabel,
  yLabel,
  width = 400,
  height = 240,
}: ScatterPlotProps) {
  const pad = { top: 16, right: 16, bottom: 32, left: 36 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs, minX + 1);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys, minY + 1);

  function toSvg(d: ScatterPoint): [number, number] {
    const sx = pad.left + ((d.x - minX) / (maxX - minX)) * plotW;
    const sy = pad.top + plotH - ((d.y - minY) / (maxY - minY)) * plotH;
    return [sx, sy];
  }

  return (
    <figure className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      {title && (
        <figcaption className="mb-3 text-sm font-medium text-slate-300">{title}</figcaption>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        role="img"
        aria-label={title ?? "Scatter plot"}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = pad.top + plotH - ratio * plotH;
          return (
            <line
              key={ratio}
              x1={pad.left}
              y1={y}
              x2={pad.left + plotW}
              y2={y}
              stroke="rgba(148,163,184,0.08)"
              strokeWidth="1"
            />
          );
        })}
        {/* Axes */}
        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={pad.top + plotH}
          stroke="rgba(148,163,184,0.18)"
          strokeWidth="1"
        />
        <line
          x1={pad.left}
          y1={pad.top + plotH}
          x2={pad.left + plotW}
          y2={pad.top + plotH}
          stroke="rgba(148,163,184,0.18)"
          strokeWidth="1"
        />
        {/* Points */}
        {data.map((d, i) => {
          const [sx, sy] = toSvg(d);
          return (
            <g key={i}>
              <circle
                cx={sx.toFixed(2)}
                cy={sy.toFixed(2)}
                r={d.highlight ? 5 : 3.5}
                fill={d.highlight ? "#f59e0b" : "#38bdf8"}
                fillOpacity={d.highlight ? 1 : 0.7}
                stroke={d.highlight ? "#fbbf24" : "none"}
                strokeWidth="1.5"
              />
              {d.label && d.highlight && (
                <text
                  x={(sx + 7).toFixed(2)}
                  y={(sy + 4).toFixed(2)}
                  fontSize="9"
                  className="fill-slate-300"
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
        {/* Axis labels */}
        {xLabel && (
          <text
            x={(pad.left + plotW / 2).toFixed(2)}
            y={(height - 4).toFixed(2)}
            textAnchor="middle"
            fontSize="9"
            className="fill-slate-500"
          >
            {xLabel}
          </text>
        )}
        {yLabel && (
          <text
            x="10"
            y={(pad.top + plotH / 2).toFixed(2)}
            textAnchor="middle"
            fontSize="9"
            className="fill-slate-500"
            transform={`rotate(-90, 10, ${pad.top + plotH / 2})`}
          >
            {yLabel}
          </text>
        )}
      </svg>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// HeatMap (DS-11)
// ---------------------------------------------------------------------------
interface HeatMapDatum {
  row: string;
  col: string;
  value: number;
}

interface HeatMapProps {
  title?: string;
  data: HeatMapDatum[];
  rows: string[];
  cols: string[];
  colorLow?: string;
  colorHigh?: string;
  format?: (v: number) => string;
}

export function HeatMap({
  title,
  data,
  rows,
  cols,
  colorLow = "#1e3a5f",
  colorHigh = "#f59e0b",
  format = (v) => v.toFixed(1),
}: HeatMapProps) {
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values, min + 0.001);

  function lookup(row: string, col: string): number | null {
    return data.find((d) => d.row === row && d.col === col)?.value ?? null;
  }

  function interpolateColor(ratio: number): string {
    // Simple low→high interpolation using inline style hex blend
    const r1 = parseInt(colorLow.slice(1, 3), 16);
    const g1 = parseInt(colorLow.slice(3, 5), 16);
    const b1 = parseInt(colorLow.slice(5, 7), 16);
    const r2 = parseInt(colorHigh.slice(1, 3), 16);
    const g2 = parseInt(colorHigh.slice(3, 5), 16);
    const b2 = parseInt(colorHigh.slice(5, 7), 16);
    const r = Math.round(r1 + (r2 - r1) * ratio)
      .toString(16)
      .padStart(2, "0");
    const g = Math.round(g1 + (g2 - g1) * ratio)
      .toString(16)
      .padStart(2, "0");
    const b = Math.round(b1 + (b2 - b1) * ratio)
      .toString(16)
      .padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  return (
    <figure className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-4">
      {title && (
        <figcaption className="mb-3 text-sm font-medium text-slate-300">{title}</figcaption>
      )}
      <table
        className="border-separate border-spacing-1 text-xs"
        role="grid"
        aria-label={title ?? "Heat map"}
      >
        <thead>
          <tr>
            <th className="text-left font-normal text-slate-500" />
            {cols.map((col) => (
              <th key={col} className="px-1 text-center font-medium text-slate-400">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td className="pr-2 text-left text-slate-400">{row}</td>
              {cols.map((col) => {
                const val = lookup(row, col);
                const ratio = val !== null ? (val - min) / (max - min) : 0;
                return (
                  <td
                    key={col}
                    className="h-8 w-12 rounded text-center font-medium text-slate-100"
                    style={{
                      backgroundColor: val !== null ? interpolateColor(ratio) : "transparent",
                      color: ratio > 0.6 ? "#0f172a" : "#f1f5f9",
                    }}
                    title={val !== null ? `${row} × ${col}: ${format(val)}` : "—"}
                  >
                    {val !== null ? format(val) : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Timeline (DS-11)
// ---------------------------------------------------------------------------
interface TimelineEvent {
  date: string;
  label: string;
  detail?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}

interface TimelineProps {
  title?: string;
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ title, events, className }: TimelineProps) {
  const toneStyles: Record<NonNullable<TimelineEvent["tone"]>, string> = {
    default: "bg-slate-700 ring-slate-600",
    success: "bg-emerald-500 ring-emerald-400/40",
    warning: "bg-amber-500 ring-amber-400/40",
    danger: "bg-red-500 ring-red-400/40",
    info: "bg-sky-500 ring-sky-400/40",
  };

  return (
    <figure className={`rounded-2xl border border-slate-800 bg-slate-900 p-4 ${className ?? ""}`}>
      {title && (
        <figcaption className="mb-4 text-sm font-medium text-slate-300">{title}</figcaption>
      )}
      <ol className="relative space-y-0" aria-label={title ?? "Timeline"}>
        {events.map((ev, i) => {
          const tone = ev.tone ?? "default";
          const isLast = i === events.length - 1;
          return (
            <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Connector line */}
              {!isLast && (
                <div className="absolute left-[7px] top-4 h-full w-px bg-slate-700" aria-hidden />
              )}
              {/* Dot */}
              <div
                className={`relative mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full ring-2 ${toneStyles[tone]}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <time className="text-[11px] text-slate-500">{ev.date}</time>
                <p className="text-sm font-medium text-slate-200">{ev.label}</p>
                {ev.detail && <p className="mt-0.5 text-xs text-slate-400">{ev.detail}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

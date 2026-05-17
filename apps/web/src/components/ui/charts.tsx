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
      {title && <figcaption className="mb-3 text-sm font-medium text-slate-300">{title}</figcaption>}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={title ?? "Line chart"} style={{ height }}>
        {series.map((s, si) => {
          const color = s.color ?? defaultColors[si % defaultColors.length];
          return (
            <g key={s.name}>
              <path d={toAreaPath(s.data)} fill={color} fillOpacity="0.06" />
              <path d={toPath(s.data)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
      </svg>
      {/* X-axis labels */}
      {labels.length > 0 && (
        <div className="mt-1 flex justify-between text-[10px] text-slate-600">
          {labels.map((l, i) => (i === 0 || i === labels.length - 1 || i === Math.floor(labels.length / 2)) && (
            <span key={i}>{l}</span>
          ))}
        </div>
      )}
      {/* Legend */}
      {series.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {series.map((s, si) => (
            <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color ?? defaultColors[si % defaultColors.length] }} aria-hidden />
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
    ...data.slice().reverse().map((d, i) => {
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
      {title && <figcaption className="mb-3 text-sm font-medium text-slate-300">{title}</figcaption>}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={title ?? "Confidence bands chart"} style={{ height }}>
        <path d={bandPath} fill="#38bdf8" fillOpacity="0.10" />
        <path d={medianPath} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden />Median</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded bg-sky-400/30" aria-hidden />Confidence band</span>
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

  const polygon = data.map((d, i) => getPoint(i, d.value)).map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

  return (
    <figure className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      {title && <figcaption className="mb-3 text-center text-sm font-medium text-slate-300">{title}</figcaption>}
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto" width={size} height={size} role="img" aria-label={title ?? "Radar chart"}>
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <polygon
            key={ratio}
            points={data.map((_, i) => {
              const [x, y] = getPoint(i, max * ratio);
              return `${x.toFixed(2)},${y.toFixed(2)}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(148,163,184,0.12)"
            strokeWidth="1"
          />
        ))}
        {/* Axis lines */}
        {data.map((_, i) => {
          const [ex, ey] = getAxisEnd(i);
          return <line key={i} x1={cx} y1={cy} x2={ex.toFixed(2)} y2={ey.toFixed(2)} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />;
        })}
        {/* Data polygon */}
        <polygon points={polygon} fill="rgba(245,158,11,0.20)" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
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

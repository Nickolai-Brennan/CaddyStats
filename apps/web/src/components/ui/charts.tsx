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

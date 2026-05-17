/**
 * StatCard — displays a single numeric stat with label and optional trend/description
 */

interface StatCardProps {
  label: string;
  value: string | number | null | undefined;
  description?: string;
  highlight?: boolean;
}

export function StatCard({ label, value, description, highlight = false }: StatCardProps) {
  const isEmpty = value === null || value === undefined;

  return (
    <div
      className={`rounded-xl border p-6 ${
        highlight ? "border-amber-500/30 bg-amber-500/5" : "border-slate-800 bg-slate-900"
      }`}
    >
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p
        className={`mt-2 text-3xl font-bold ${
          highlight ? "text-amber-400" : "text-slate-50"
        } ${isEmpty ? "text-slate-600" : ""}`}
      >
        {isEmpty ? "—" : value.toLocaleString()}
      </p>
      {description && <p className="mt-1.5 text-xs text-slate-500">{description}</p>}
    </div>
  );
}

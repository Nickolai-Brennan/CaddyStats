/**
 * StatCard — displays a single numeric stat with label and optional trend/description
 */

import { typographyClasses } from "@/styles/typography";

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
      <p className={`text-caption ${typographyClasses.caption}`}>{label}</p>
      <p
        className={`text-metric mt-2 text-3xl ${
          highlight ? "text-amber-400" : "text-slate-50"
        } ${isEmpty ? "text-slate-600" : ""}`}
      >
        {isEmpty ? "—" : value.toLocaleString()}
      </p>
      {description && <p className="mt-1.5 text-body-sm">{description}</p>}
    </div>
  );
}

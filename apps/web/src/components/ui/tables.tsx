import type { ReactNode } from "react";

export interface TableColumn<T extends object> {
  key: keyof T & string;
  header: string;
  align?: "left" | "right" | "center";
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface DataTableProps<T extends object> {
  columns: Array<TableColumn<T>>;
  rows: T[];
  rowKey: (row: T, index: number) => string;
  caption?: string;
  emptyMessage?: string;
}

export function DataTable<T extends object>({
  columns,
  rows,
  rowKey,
  caption,
  emptyMessage = "No rows available.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-slate-900/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 ${alignmentClass(column.align)}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={rowKey(row, index)} className="hover:bg-slate-800/40">
                  {columns.map((column) => {
                    const raw = row[column.key as keyof T];
                    return (
                      <td
                        key={String(column.key)}
                        className={`px-4 py-3 text-slate-200 ${alignmentClass(column.align)}`}
                      >
                        {column.render ? column.render(raw, row) : String(raw ?? "—")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function alignmentClass(align: "left" | "right" | "center" | undefined): string {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

import { useState, useMemo, type ReactNode } from "react";
import { cx } from "./utils";

export interface TableColumn<T extends object> {
  key: keyof T & string;
  header: string;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface DataTableProps<T extends object> {
  columns: Array<TableColumn<T>>;
  rows: T[];
  rowKey: (row: T, index: number) => string;
  caption?: string;
  emptyMessage?: string;
  /** Enable built-in global filter */
  filterable?: boolean;
  /** Enable column-level sorting */
  sortable?: boolean;
  /** Actions rendered per row (receives row) */
  rowActions?: (row: T) => ReactNode;
  /** Toolbar slot (rendered above the table) */
  toolbar?: ReactNode;
  /** Show column-visibility toggle */
  columnToggle?: boolean;
}

type SortDir = "asc" | "desc";

export function DataTable<T extends object>({
  columns,
  rows,
  rowKey,
  caption,
  emptyMessage = "No rows available.",
  filterable,
  sortable,
  rowActions,
  toolbar,
  columnToggle,
}: DataTableProps<T>) {
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [visibleCols, setVisibleCols] = useState<Set<string>>(
    () => new Set(columns.map((c) => c.key))
  );

  const visibleColumns = columns.filter((c) => visibleCols.has(c.key));

  const filtered = useMemo(() => {
    if (!filter) return rows;
    const q = filter.toLowerCase();
    return rows.filter((row) =>
      visibleColumns.some((col) => {
        const raw = row[col.key as keyof T];
        return String(raw ?? "").toLowerCase().includes(q);
      })
    );
  }, [rows, filter, visibleColumns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof T];
      const bv = b[sortKey as keyof T];
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av ?? "").localeCompare(String(bv ?? ""));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleCol(key: string) {
    setVisibleCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const allCols = rowActions ? [...visibleColumns, { key: "__actions__", header: "Actions" }] : visibleColumns;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      {/* Toolbar */}
      {(filterable || columnToggle || toolbar) && (
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 px-4 py-3">
          {filterable && (
            <div className="relative flex-1 min-w-[200px]">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" viewBox="0 0 16 16" fill="none" aria-hidden>
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Filter rows…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 py-1.5 pl-8 pr-3 text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}
          {columnToggle && (
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-600 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M2 8h12M5 4h6M8 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Columns
              </button>
              <div className="invisible absolute right-0 top-full z-10 mt-1 min-w-[160px] rounded-xl border border-slate-700 bg-slate-800 p-2 shadow-lg group-focus-within:visible group-hover:visible">
                {columns.map((col) => (
                  <label key={col.key} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-700">
                    <input
                      type="checkbox"
                      checked={visibleCols.has(col.key)}
                      onChange={() => toggleCol(col.key)}
                      className="accent-amber-500"
                    />
                    {col.header}
                  </label>
                ))}
              </div>
            </div>
          )}
          {toolbar}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-slate-900/80">
            <tr>
              {allCols.map((column) => {
                const isSortable = sortable && (column as TableColumn<T>).sortable !== false && column.key !== "__actions__";
                const isActive = sortKey === column.key;
                return (
                  <th
                    key={String(column.key)}
                    scope="col"
                    className={cx(
                      "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400",
                      alignmentClass((column as TableColumn<T>).align),
                      isSortable && "cursor-pointer select-none hover:text-slate-200"
                    )}
                    onClick={isSortable ? () => handleSort(column.key) : undefined}
                    aria-sort={isActive ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {column.header}
                      {isSortable && (
                        <svg viewBox="0 0 12 14" fill="none" className={cx("h-2.5 w-2.5 transition-colors", isActive ? "text-amber-400" : "text-slate-700")} aria-hidden>
                          <path d="M6 1v12M2 4l4-4 4 4M2 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            opacity={!isActive ? "1" : sortDir === "asc" ? "0.4" : "1"}
                          />
                        </svg>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={allCols.length} className="px-4 py-8 text-center text-slate-500">
                  {filter ? `No rows match "${filter}"` : emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((row, index) => (
                <tr key={rowKey(row, index)} className="hover:bg-slate-800/40">
                  {visibleColumns.map((column) => {
                    const raw = row[column.key as keyof T];
                    return (
                      <td
                        key={String(column.key)}
                        className={cx("px-4 py-3 text-slate-200", alignmentClass(column.align))}
                      >
                        {column.render ? column.render(raw, row) : String(raw ?? "—")}
                      </td>
                    );
                  })}
                  {rowActions && (
                    <td className="px-4 py-3 text-right">{rowActions(row)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination slot — summary row */}
      {sorted.length > 0 && (
        <div className="border-t border-slate-800 px-4 py-2 text-xs text-slate-500">
          {filter
            ? `${sorted.length} of ${rows.length} rows`
            : `${rows.length} row${rows.length === 1 ? "" : "s"}`}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TablePagination (DS-10)
// ---------------------------------------------------------------------------
interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function TablePagination({ page, pageSize, total, onPageChange, className }: TablePaginationProps) {
  const pageCount = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className={cx("flex items-center justify-between gap-4 text-sm text-slate-400", className)}>
      <span>{total > 0 ? `${start}–${end} of ${total}` : "0 rows"}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg px-2 py-1 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Previous page"
        >
          ←
        </button>
        <span className="px-2 text-slate-300">
          {page} / {pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg px-2 py-1 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
}

function alignmentClass(align: "left" | "right" | "center" | undefined): string {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

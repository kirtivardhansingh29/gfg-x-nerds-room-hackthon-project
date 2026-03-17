import { formatCellValue } from "../lib/formatters";

export default function DataTable({ columns, rows, maxRows = 12 }) {
  const visibleColumns = columns?.length ? columns : Object.keys(rows?.[0] || {});
  const visibleRows = (rows || []).slice(0, maxRows);

  if (!visibleColumns.length || !visibleRows.length) {
    return (
      <div className="flex h-full items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-white text-sm text-slate-500">
        No rows available for tabular display.
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto rounded-[20px] border border-slate-200 bg-white">
      <table className="min-w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
          <tr>
            {visibleColumns.map((column) => (
              <th
                key={column}
                className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {visibleRows.map((row, rowIndex) => (
            <tr key={`table-row-${rowIndex}`} className="hover:bg-slate-50/80">
              {visibleColumns.map((column) => (
                <td key={`${column}-${rowIndex}`} className="px-3 py-2.5 text-slate-700">
                  {formatCellValue(row[column], column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

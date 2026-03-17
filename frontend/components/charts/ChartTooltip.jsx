import { formatCellValue, humanizeLabel } from "../../lib/formatters";

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[180px] rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-card backdrop-blur">
      {label !== undefined ? (
        <div className="border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {formatCellValue(label)}
        </div>
      ) : null}

      <div className="mt-2 space-y-2">
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color || item.payload?.fill || "#0F766E" }}
              />
              <span>{humanizeLabel(item.name || item.dataKey)}</span>
            </div>
            <span className="font-semibold text-slate-950">
              {formatCellValue(item.value, item.name || item.dataKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

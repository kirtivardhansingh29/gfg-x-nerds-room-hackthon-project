import { formatMetricValue, humanizeLabel } from "../lib/formatters";

export default function MetricCard({ chart }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-[22px] bg-[linear-gradient(145deg,rgba(15,118,110,0.1),rgba(29,78,216,0.08),rgba(255,255,255,0.9))] p-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Primary KPI</p>
        <h4 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">
          {humanizeLabel(chart.metric_label)}
        </h4>
        <p className="max-w-xl text-sm leading-6 text-slate-600">{chart.description}</p>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <p className="font-heading text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
          {formatMetricValue(chart.metric_value, chart.metric_label)}
        </p>
        <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-soft">
          Single-value result highlighted for fast review.
        </div>
      </div>
    </div>
  );
}

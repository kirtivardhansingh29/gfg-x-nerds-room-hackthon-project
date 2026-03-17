export default function MetricCard({ chart }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-[20px] bg-[linear-gradient(135deg,rgba(15,157,141,0.1),rgba(255,122,89,0.12))] p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">KPI Metric</p>
        <h4 className="mt-3 font-heading text-2xl font-bold text-ink">{humanizeLabel(chart.metric_label)}</h4>
        <p className="mt-2 text-sm text-slate-600">{chart.description}</p>
      </div>
      <div className="mt-6">
        <p className="font-heading text-5xl font-bold tracking-tight text-ink">
          {formatMetricValue(chart.metric_value, chart.metric_label)}
        </p>
      </div>
    </div>
  );
}

function humanizeLabel(label) {
  if (!label) {
    return "Metric";
  }

  return String(label)
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatMetricValue(value, label) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value !== "number") {
    return String(value);
  }

  return new Intl.NumberFormat("en-US", {
    notation: Math.abs(value) >= 100000 ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(value);
}

import BarChartCard from "./BarChartCard";
import DataTable from "./DataTable";
import LineChartCard from "./LineChartCard";
import MetricCard from "./MetricCard";
import PieChartCard from "./PieChartCard";
import ScatterChartCard from "./ScatterChartCard";
import SurfaceCard from "./ui/SurfaceCard";
import { classNames } from "../lib/classNames";
import { formatCompactNumber, formatTimestamp, humanizeLabel } from "../lib/formatters";

export default function ChartCard({ card, featured = false }) {
  const { chart, results } = card;

  return (
    <SurfaceCard as="article" className={classNames("overflow-hidden p-0", featured && "xl:col-span-2")}>
      <div className="border-b border-slate-100 bg-[linear-gradient(145deg,rgba(248,250,252,0.96),rgba(237,246,255,0.92))] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <InfoPill label={formatTimestamp(card.createdAt)} />
              <InfoPill label={humanizeLabel(chart.chart_type)} />
              <InfoPill label={`${formatCompactNumber(results.row_count)} rows`} />
            </div>
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {card.title}
            </h3>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              {card.summary || chart.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
            <SnapshotMetric label="Columns" value={results.columns.length} />
            <SnapshotMetric label="X Axis" value={chart.x_axis || "N/A"} />
            <SnapshotMetric label="Series" value={chart.series?.length || 1} />
            <SnapshotMetric label="Y Axis" value={chart.y_axis || "N/A"} />
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-white/80 bg-white/80 px-4 py-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Question</p>
          <p className="mt-2 text-sm text-slate-700">{card.question}</p>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div
          className={classNames(
            "rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,252,0.94))] p-4",
            chart.chart_type === "metric" ? "min-h-[240px]" : "min-h-[340px]"
          )}
        >
          <VisualizationRenderer chart={chart} results={results} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[24px] bg-slate-950 p-5 text-slate-100 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Generated SQL
            </p>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-slate-200">
              {card.sql}
            </pre>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Result Snapshot
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <SnapshotMetric label="Rows" value={results.row_count} />
                <SnapshotMetric label="Columns" value={results.columns.length} />
                <SnapshotMetric label="Chart" value={humanizeLabel(chart.chart_type)} />
                <SnapshotMetric label="Primary Metric" value={chart.metric_label || chart.y_axis || "N/A"} />
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Preview Rows
              </p>
              <div className="mt-4 max-h-44 overflow-auto">
                <DataTable columns={results.columns} rows={results.rows} maxRows={5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}

function VisualizationRenderer({ chart, results }) {
  if (!results.rows?.length) {
    return (
      <div className="flex h-full items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-white text-sm text-slate-500">
        The query returned no rows for visualization.
      </div>
    );
  }

  if (chart.chart_type === "metric") {
    return <MetricCard chart={chart} />;
  }

  if (chart.chart_type === "bar") {
    return <BarChartCard chart={chart} />;
  }

  if (chart.chart_type === "line") {
    return <LineChartCard chart={chart} />;
  }

  if (chart.chart_type === "pie") {
    return <PieChartCard chart={chart} />;
  }

  if (chart.chart_type === "scatter") {
    return <ScatterChartCard chart={chart} />;
  }

  return <DataTable columns={results.columns} rows={results.rows} maxRows={12} />;
}

function SnapshotMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-slate-900">{String(value)}</div>
    </div>
  );
}

function InfoPill({ label }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
      {label}
    </span>
  );
}

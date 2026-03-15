import BarChartCard from "./BarChartCard";
import DataTable from "./DataTable";
import LineChartCard from "./LineChartCard";
import MetricCard from "./MetricCard";
import PieChartCard from "./PieChartCard";
import ScatterChartCard from "./ScatterChartCard";

export default function ChartCard({ card }) {
  const { chart, results } = card;

  return (
    <article className="overflow-hidden rounded-[30px] border border-white/70 bg-white/90 shadow-soft backdrop-blur">
      <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,157,141,0.08),rgba(255,122,89,0.12))] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {new Date(card.createdAt).toLocaleString()}
            </p>
            <h3 className="font-heading text-2xl font-bold text-ink">{card.title}</h3>
            <p className="text-sm text-slate-600">{card.summary}</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-right text-xs text-slate-600">
            <div className="font-semibold uppercase tracking-[0.14em] text-slate-500">Visualization</div>
            <div className="mt-1 text-sm font-semibold capitalize text-ink">{chart.chart_type}</div>
          </div>
        </div>
        <p className="mt-4 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700">
          <span className="font-semibold text-ink">Question:</span> {card.question}
        </p>
      </div>

      <div className="p-5">
        <div className="h-80 rounded-[24px] border border-slate-100 bg-slate-50 p-3">
          <VisualizationRenderer chart={chart} results={results} />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Generated SQL
            </p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-sm text-slate-700">
              {card.sql}
            </pre>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Result Snapshot
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <SnapshotMetric label="Rows" value={results.row_count} />
                <SnapshotMetric label="Columns" value={results.columns.length} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <SnapshotMetric label="X Axis" value={chart.x_axis || "-"} />
                <SnapshotMetric label="Y Axis" value={chart.y_axis || "-"} />
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Preview Rows
              </p>
              <div className="mt-3 max-h-40 overflow-auto rounded-2xl border border-slate-100">
                <DataTable columns={results.columns} rows={results.rows} maxRows={5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
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
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

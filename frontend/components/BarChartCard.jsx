import { useId } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartTooltip from "./charts/ChartTooltip";
import { AXIS_TICK, CHART_COLORS, CHART_GRID, formatChartTick, getSeriesKeys } from "../lib/chartTheme";
import { humanizeLabel } from "../lib/formatters";

export default function BarChartCard({ chart }) {
  const chartId = useId().replace(/:/g, "");
  const series = getSeriesKeys(chart);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chart.data} margin={{ top: 12, right: 8, left: 0, bottom: 12 }}>
        <defs>
          {series.map((key, index) => (
            <linearGradient key={key} id={`${chartId}-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS[index % CHART_COLORS.length]} stopOpacity="0.95" />
              <stop offset="100%" stopColor={CHART_COLORS[index % CHART_COLORS.length]} stopOpacity="0.55" />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid vertical={false} stroke={CHART_GRID} strokeDasharray="3 3" />
        <XAxis
          dataKey={chart.x_axis}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          minTickGap={18}
          tickFormatter={formatChartTick}
        />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} tickFormatter={formatChartTick} />
        <Tooltip cursor={{ fill: "rgba(15, 118, 110, 0.06)" }} content={<ChartTooltip />} />
        <Legend wrapperStyle={{ paddingTop: 12 }} formatter={(value) => humanizeLabel(value)} />
        {series.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={`url(#${chartId}-${index})`}
            radius={[10, 10, 2, 2]}
            maxBarSize={40}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

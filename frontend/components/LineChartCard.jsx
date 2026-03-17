import { useId } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartTooltip from "./charts/ChartTooltip";
import { AXIS_TICK, CHART_COLORS, CHART_GRID, formatChartTick, getSeriesKeys } from "../lib/chartTheme";
import { humanizeLabel } from "../lib/formatters";

export default function LineChartCard({ chart }) {
  const chartId = useId().replace(/:/g, "");
  const series = getSeriesKeys(chart);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chart.data} margin={{ top: 12, right: 8, left: 0, bottom: 12 }}>
        <defs>
          {series.map((key, index) => (
            <linearGradient key={key} id={`${chartId}-${index}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={CHART_COLORS[index % CHART_COLORS.length]} />
              <stop offset="100%" stopColor={CHART_COLORS[(index + 1) % CHART_COLORS.length]} />
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
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ paddingTop: 12 }} formatter={(value) => humanizeLabel(value)} />
        {series.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={`url(#${chartId}-${index})`}
            strokeWidth={3}
            dot={{ r: 3, strokeWidth: 0, fill: CHART_COLORS[index % CHART_COLORS.length] }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

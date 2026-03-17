import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartTooltip from "./charts/ChartTooltip";
import { AXIS_TICK, CHART_GRID, formatChartTick } from "../lib/chartTheme";

export default function ScatterChartCard({ chart }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 12, right: 12, left: 0, bottom: 12 }}>
        <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey={chart.x_axis}
          name={chart.x_axis}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatChartTick}
        />
        <YAxis
          type="number"
          dataKey={chart.y_axis}
          name={chart.y_axis}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatChartTick}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltip />} />
        <Scatter data={chart.data} fill="#0F766E" fillOpacity={0.78} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

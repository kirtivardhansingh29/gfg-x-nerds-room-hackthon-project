import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import ChartTooltip from "./charts/ChartTooltip";
import { CHART_COLORS } from "../lib/chartTheme";
import { humanizeLabel } from "../lib/formatters";

export default function PieChartCard({ chart }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chart.data}
          dataKey={chart.y_axis}
          nameKey={chart.x_axis}
          innerRadius={72}
          outerRadius={108}
          paddingAngle={3}
          stroke="#F8FAFC"
          strokeWidth={2}
        >
          {(chart.data || []).map((entry, index) => (
            <Cell
              key={`${entry[chart.x_axis]}-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ paddingTop: 12 }} formatter={(value) => humanizeLabel(value)} />
      </PieChart>
    </ResponsiveContainer>
  );
}

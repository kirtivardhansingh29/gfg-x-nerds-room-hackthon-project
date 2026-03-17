import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const SERIES_COLORS = ["#0F9D8D", "#FF7A59", "#F4B740", "#3B82F6", "#22C55E", "#8B5CF6"];

export default function PieChartCard({ chart }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chart.data}
          dataKey={chart.y_axis}
          nameKey={chart.x_axis}
          innerRadius={60}
          outerRadius={100}
          paddingAngle={4}
        >
          {chart.data.map((entry, index) => (
            <Cell key={`${entry[chart.x_axis]}-${index}`} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

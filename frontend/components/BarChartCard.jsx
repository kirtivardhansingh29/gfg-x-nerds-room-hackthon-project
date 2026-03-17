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

const SERIES_COLORS = ["#0F9D8D", "#FF7A59", "#F4B740", "#3B82F6"];

export default function BarChartCard({ chart }) {
  const series = chart.series?.length ? chart.series : [chart.y_axis].filter(Boolean);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chart.data} margin={{ top: 12, right: 12, left: 0, bottom: 18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey={chart.x_axis} tick={{ fill: "#475569", fontSize: 12 }} />
        <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
        <Tooltip />
        <Legend />
        {series.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={SERIES_COLORS[index % SERIES_COLORS.length]}
            radius={[8, 8, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

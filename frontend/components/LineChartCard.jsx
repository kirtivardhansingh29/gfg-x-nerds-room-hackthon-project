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

const SERIES_COLORS = ["#0F9D8D", "#FF7A59", "#F4B740", "#3B82F6"];

export default function LineChartCard({ chart }) {
  const series = chart.series?.length ? chart.series : [chart.y_axis].filter(Boolean);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chart.data} margin={{ top: 12, right: 12, left: 0, bottom: 18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey={chart.x_axis} tick={{ fill: "#475569", fontSize: 12 }} />
        <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
        <Tooltip />
        <Legend />
        {series.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

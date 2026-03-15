import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ScatterChartCard({ chart }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 12, right: 12, left: 0, bottom: 18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis type="number" dataKey={chart.x_axis} name={chart.x_axis} tick={{ fill: "#475569", fontSize: 12 }} />
        <YAxis type="number" dataKey={chart.y_axis} name={chart.y_axis} tick={{ fill: "#475569", fontSize: 12 }} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={chart.data} fill="#0F9D8D" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

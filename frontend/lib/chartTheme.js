import { formatCompactNumber } from "./formatters";

export const CHART_COLORS = ["#0F766E", "#1D4ED8", "#F59E0B", "#EA580C", "#059669", "#DC2626"];
export const CHART_GRID = "#D9E4F1";
export const AXIS_TICK = { fill: "#52637A", fontSize: 12 };

export function getSeriesKeys(chart) {
  return chart.series?.length ? chart.series : [chart.y_axis].filter(Boolean);
}

export function formatChartTick(value) {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  if (typeof value === "number") {
    return formatCompactNumber(value);
  }

  const stringValue = String(value);
  if (stringValue.length > 16) {
    return `${stringValue.slice(0, 16)}…`;
  }

  return stringValue;
}

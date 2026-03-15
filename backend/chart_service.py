from datetime import datetime
from typing import Any


def _is_number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def _column_is_numeric(rows: list[dict[str, Any]], column: str) -> bool:
    values = [row.get(column) for row in rows if row.get(column) is not None]
    if not values:
        return False

    numeric_count = sum(1 for value in values if _is_number(value))
    return numeric_count / len(values) >= 0.7


def _looks_temporal(column: str, rows: list[dict[str, Any]]) -> bool:
    lowered = column.lower()
    if any(token in lowered for token in {"date", "day", "month", "year", "week"}):
        return True

    values = [row.get(column) for row in rows if row.get(column) is not None][:5]
    for value in values:
        if isinstance(value, str):
            try:
                datetime.fromisoformat(value.replace("Z", "+00:00"))
                return True
            except ValueError:
                continue
    return False


def _build_visualization(
    chart_type: str,
    rows: list[dict[str, Any]],
    title: str,
    description: str,
    x_axis: str | None = None,
    y_axis: str | None = None,
    series: list[str] | None = None,
    metric_label: str | None = None,
    metric_value: Any = None,
) -> dict[str, Any]:
    return {
        "chart_type": chart_type,
        "title": title,
        "description": description,
        "x_axis": x_axis,
        "y_axis": y_axis,
        "series": series or ([y_axis] if y_axis else []),
        "metric_label": metric_label,
        "metric_value": metric_value,
        "data": rows,
    }


def suggest_chart(question: str, columns: list[str], rows: list[dict[str, Any]]) -> dict[str, Any]:
    if not columns or not rows:
        return _build_visualization(
            chart_type="table",
            rows=rows,
            title="Query Results",
            description="The query returned data best shown in a table.",
        )

    numeric_columns = [column for column in columns if _column_is_numeric(rows, column)]
    temporal_columns = [column for column in columns if _looks_temporal(column, rows)]
    categorical_columns = [column for column in columns if column not in numeric_columns]
    question_lower = question.lower()
    first_row = rows[0]

    if len(rows) == 1 and len(columns) == 1 and len(numeric_columns) == 1:
        metric_column = numeric_columns[0]
        return _build_visualization(
            chart_type="metric",
            rows=rows,
            title="Key Metric",
            description="A single numeric result is best highlighted as a KPI.",
            y_axis=metric_column,
            metric_label=metric_column,
            metric_value=first_row.get(metric_column),
        )

    if len(columns) == 2:
        first_column, second_column = columns

        if first_column in temporal_columns and second_column in numeric_columns:
            return _build_visualization(
                chart_type="line",
                rows=rows,
                title="Trend Over Time",
                description="A line chart highlights how the metric changes across time.",
                x_axis=first_column,
                y_axis=second_column,
            )

        if first_column in numeric_columns and second_column in numeric_columns:
            return _build_visualization(
                chart_type="scatter",
                rows=rows,
                title="Correlation View",
                description="A scatter plot helps spot relationships between two numeric variables.",
                x_axis=first_column,
                y_axis=second_column,
            )

        if second_column in numeric_columns:
            if any(token in question_lower for token in {"share", "distribution", "split", "composition", "percentage"}):
                return _build_visualization(
                    chart_type="pie",
                    rows=rows,
                    title="Distribution Snapshot",
                    description="A pie chart is useful for quick categorical distribution views.",
                    x_axis=first_column,
                    y_axis=second_column,
                )

            return _build_visualization(
                chart_type="bar",
                rows=rows,
                title="Category Comparison",
                description="A bar chart makes differences across categories easy to scan.",
                x_axis=first_column,
                y_axis=second_column,
            )

    if len(columns) >= 3:
        first_column = columns[0]
        numeric_series = [column for column in columns[1:] if column in numeric_columns][:3]

        if len(rows) > 20 and len(columns) > 3:
            return _build_visualization(
                chart_type="table",
                rows=rows,
                title="Detailed Table View",
                description="A larger multi-column result is easier to inspect in a table.",
            )

        if first_column in temporal_columns and numeric_series:
            return _build_visualization(
                chart_type="line",
                rows=rows,
                title="Multi-Series Trend",
                description="Multiple numeric series are plotted against the time axis.",
                x_axis=first_column,
                y_axis=numeric_series[0],
                series=numeric_series,
            )

        if categorical_columns and numeric_series:
            return _build_visualization(
                chart_type="bar",
                rows=rows,
                title="Grouped Comparison",
                description="Grouped bars work well for comparing several metrics across categories.",
                x_axis=first_column,
                y_axis=numeric_series[0],
                series=numeric_series,
            )

    if len(rows) > 25 or len(columns) > 4:
        return _build_visualization(
            chart_type="table",
            rows=rows,
            title="Detailed Table View",
            description="A large or wide result is best explored in a table.",
        )

    if numeric_columns:
        x_axis = categorical_columns[0] if categorical_columns else columns[0]
        y_axis = numeric_columns[0]
        return _build_visualization(
            chart_type="bar",
            rows=rows,
            title="Query Results",
            description="The result is rendered as a bar chart for fast comparison.",
            x_axis=x_axis,
            y_axis=y_axis,
        )

    return _build_visualization(
        chart_type="table",
        rows=rows,
        title="Query Results",
        description="The structure of this result is better suited to a table.",
    )

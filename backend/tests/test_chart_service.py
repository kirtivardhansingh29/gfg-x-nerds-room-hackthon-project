import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from chart_service import suggest_chart


class VisualizationEngineTests(unittest.TestCase):
    def test_single_numeric_value_returns_metric(self):
        chart = suggest_chart(
            question="What is the average online spending?",
            columns=["avg_online_spend"],
            rows=[{"avg_online_spend": 45000.25}],
        )

        self.assertEqual(chart["chart_type"], "metric")
        self.assertEqual(chart["metric_label"], "avg_online_spend")
        self.assertEqual(chart["metric_value"], 45000.25)
        self.assertEqual(chart["data"], [{"avg_online_spend": 45000.25}])

    def test_category_and_numeric_returns_bar_chart(self):
        rows = [
            {"city_tier": "Tier 1", "avg_online_spend": 45000},
            {"city_tier": "Tier 2", "avg_online_spend": 30000},
            {"city_tier": "Tier 3", "avg_online_spend": 18000},
        ]

        chart = suggest_chart(
            question="Average online spending by city tier",
            columns=["city_tier", "avg_online_spend"],
            rows=rows,
        )

        self.assertEqual(chart["chart_type"], "bar")
        self.assertEqual(chart["x_axis"], "city_tier")
        self.assertEqual(chart["y_axis"], "avg_online_spend")
        self.assertEqual(chart["data"], rows)

    def test_time_series_returns_line_chart(self):
        rows = [
            {"month": "2025-01-01", "monthly_online_orders": 120},
            {"month": "2025-02-01", "monthly_online_orders": 140},
            {"month": "2025-03-01", "monthly_online_orders": 160},
        ]

        chart = suggest_chart(
            question="Monthly online orders over time",
            columns=["month", "monthly_online_orders"],
            rows=rows,
        )

        self.assertEqual(chart["chart_type"], "line")
        self.assertEqual(chart["x_axis"], "month")
        self.assertEqual(chart["y_axis"], "monthly_online_orders")

    def test_two_numeric_columns_return_scatter_plot(self):
        rows = [
            {"daily_internet_hours": 2.5, "monthly_online_orders": 3},
            {"daily_internet_hours": 4.0, "monthly_online_orders": 6},
            {"daily_internet_hours": 6.0, "monthly_online_orders": 9},
        ]

        chart = suggest_chart(
            question="Internet usage vs online orders",
            columns=["daily_internet_hours", "monthly_online_orders"],
            rows=rows,
        )

        self.assertEqual(chart["chart_type"], "scatter")
        self.assertEqual(chart["x_axis"], "daily_internet_hours")
        self.assertEqual(chart["y_axis"], "monthly_online_orders")

    def test_categorical_distribution_returns_pie_chart(self):
        rows = [
            {"shopping_preference": "Online", "total_customers": 60},
            {"shopping_preference": "Offline", "total_customers": 40},
        ]

        chart = suggest_chart(
            question="Shopping preference distribution",
            columns=["shopping_preference", "total_customers"],
            rows=rows,
        )

        self.assertEqual(chart["chart_type"], "pie")
        self.assertEqual(chart["x_axis"], "shopping_preference")
        self.assertEqual(chart["y_axis"], "total_customers")

    def test_large_tabular_result_returns_table_view(self):
        rows = [
            {
                "age_group": f"group_{index}",
                "avg_online_spend": index * 100,
                "avg_store_spend": index * 90,
                "monthly_online_orders": index,
                "monthly_store_visits": index + 1,
            }
            for index in range(30)
        ]

        chart = suggest_chart(
            question="Show detailed customer behavior breakdown",
            columns=[
                "age_group",
                "avg_online_spend",
                "avg_store_spend",
                "monthly_online_orders",
                "monthly_store_visits",
            ],
            rows=rows,
        )

        self.assertEqual(chart["chart_type"], "table")
        self.assertIsNone(chart["x_axis"])
        self.assertIsNone(chart["y_axis"])


if __name__ == "__main__":
    unittest.main()

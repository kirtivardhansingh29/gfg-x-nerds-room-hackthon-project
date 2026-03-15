import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import database
import main
from fastapi.testclient import TestClient


class ApiFlowTests(unittest.TestCase):
    def setUp(self):
        self.test_root = Path(__file__).resolve().parents[1] / "data" / "test-runtime"
        self.test_root.mkdir(parents=True, exist_ok=True)
        self.test_db_path = self.test_root / f"{self._testMethodName}.db"
        if self.test_db_path.exists():
            self.test_db_path.unlink()
        self.original_data_dir = database.DATA_DIR
        self.original_db_path = database.DB_PATH
        database.DATA_DIR = self.test_root
        database.DB_PATH = self.test_db_path
        main.request_log.clear()
        self.client = TestClient(main.app)

    def tearDown(self):
        self.client.close()
        database.DATA_DIR = self.original_data_dir
        database.DB_PATH = self.original_db_path
        if self.test_db_path.exists():
            try:
                self.test_db_path.unlink()
            except PermissionError:
                pass

    def test_schema_returns_404_before_upload(self):
        response = self.client.get("/schema")
        self.assertEqual(response.status_code, 404)
        self.assertIn("No dataset", response.json()["detail"])

    def test_upload_rejects_non_csv_file(self):
        response = self.client.post(
            "/upload",
            files={"file": ("customers.txt", b"not,csv", "text/plain")},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "Only CSV files are supported.")

    def test_upload_and_query_pipeline_returns_chart_metadata(self):
        csv_content = (
            "city_tier,avg_online_spend,monthly_online_orders,shopping_preference\n"
            "Tier 1,45000,8,Online\n"
            "Tier 2,30000,5,Offline\n"
            "Tier 3,18000,3,Offline\n"
        )

        upload_response = self.client.post(
            "/upload",
            files={"file": ("customers.csv", csv_content.encode("utf-8"), "text/csv")},
        )

        self.assertEqual(upload_response.status_code, 200)
        self.assertEqual(upload_response.json()["dataset"]["table_name"], "customers")

        with patch.object(
            main.gemini_service,
            "generate_sql",
            return_value={
                "sql": (
                    "SELECT city_tier, AVG(avg_online_spend) AS avg_online_spend "
                    "FROM customers GROUP BY city_tier"
                ),
                "title": "Average Online Spend by City Tier",
                "summary": "Tier 1 customers spend the most online on average.",
            },
        ):
            query_response = self.client.post(
                "/query",
                json={
                    "question": "Average online spending by city tier",
                    "history": [],
                },
            )

        self.assertEqual(query_response.status_code, 200)
        payload = query_response.json()
        self.assertEqual(payload["chart"]["chart_type"], "bar")
        self.assertEqual(payload["chart"]["x_axis"], "city_tier")
        self.assertEqual(payload["chart"]["y_axis"], "avg_online_spend")
        self.assertEqual(payload["results"]["row_count"], 3)
        self.assertIn("LIMIT 200", payload["sql"])


if __name__ == "__main__":
    unittest.main()

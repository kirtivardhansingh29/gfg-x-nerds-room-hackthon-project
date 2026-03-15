import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sql_validator import SQLValidationError, apply_result_limit, validate_select_query


class SQLValidatorTests(unittest.TestCase):
    def test_rejects_non_select_query(self):
        with self.assertRaises(SQLValidationError):
            validate_select_query("DELETE FROM customers", ["customers"])

    def test_allows_read_only_cte_query(self):
        sql = """
        WITH spend_summary AS (
            SELECT city_tier, AVG(avg_online_spend) AS avg_online_spend
            FROM customers
            GROUP BY city_tier
        )
        SELECT city_tier, avg_online_spend
        FROM spend_summary
        """

        validated = validate_select_query(sql, ["customers"])
        self.assertIn("WITH spend_summary AS", validated)
        self.assertIn("FROM spend_summary", validated)

    def test_adds_limit_when_missing(self):
        sql = "SELECT city_tier, AVG(avg_online_spend) AS avg_online_spend FROM customers GROUP BY city_tier"
        self.assertTrue(apply_result_limit(sql).endswith("LIMIT 200"))


if __name__ == "__main__":
    unittest.main()

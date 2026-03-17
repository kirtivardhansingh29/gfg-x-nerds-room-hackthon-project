import json
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "baniya-dost.db"
LEGACY_DB_PATH = DATA_DIR / "baniyabhai.db"
DEFAULT_TABLE_NAME = "customers"
META_TABLE_NAME = "dataset_meta"


def sanitize_identifier(value: str) -> str:
    sanitized = re.sub(r"[^a-zA-Z0-9_]+", "_", value.strip().lower()).strip("_")
    if not sanitized:
        sanitized = "column"
    if sanitized[0].isdigit():
        sanitized = f"col_{sanitized}"
    return sanitized


def ensure_unique_column_names(columns: list[str]) -> list[str]:
    unique_columns: list[str] = []
    used: set[str] = set()

    for column in columns:
        base_name = sanitize_identifier(column)
        candidate = base_name
        suffix = 2

        while candidate in used:
            candidate = f"{base_name}_{suffix}"
            suffix += 1

        used.add(candidate)
        unique_columns.append(candidate)

    return unique_columns


def ensure_data_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def migrate_legacy_database() -> None:
    if DB_PATH.name != "baniya-dost.db":
        return

    if DB_PATH.exists() or not LEGACY_DB_PATH.exists():
        return

    LEGACY_DB_PATH.replace(DB_PATH)


def get_connection() -> sqlite3.Connection:
    ensure_data_dir()
    migrate_legacy_database()
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def _serialize_value(value: Any) -> Any:
    if pd.isna(value):
        return None
    if hasattr(value, "isoformat"):
        try:
            return value.isoformat()
        except TypeError:
            return str(value)
    if isinstance(value, (pd.Timestamp,)):
        return value.isoformat()
    return value


def _build_schema(original_frame: pd.DataFrame, sanitized_columns: list[str]) -> list[dict[str, Any]]:
    schema: list[dict[str, Any]] = []

    for original_name, sanitized_name in zip(original_frame.columns, sanitized_columns):
        series = original_frame[original_name]
        sample_values = [_serialize_value(item) for item in series.dropna().head(5).tolist()]
        schema.append(
            {
                "name": sanitized_name,
                "original_name": str(original_name),
                "dtype": str(series.dtype),
                "nullable": bool(series.isnull().any()),
                "sample_values": sample_values,
            }
        )

    return schema


def persist_dataframe(dataframe: pd.DataFrame, table_name: str = DEFAULT_TABLE_NAME) -> dict[str, Any]:
    clean_frame = dataframe.copy()
    clean_frame.columns = [str(column).strip() or f"column_{index + 1}" for index, column in enumerate(clean_frame.columns)]
    sanitized_columns = ensure_unique_column_names([str(column) for column in clean_frame.columns])
    schema = _build_schema(clean_frame, sanitized_columns)
    uploaded_at = datetime.now(timezone.utc).isoformat()

    storage_frame = clean_frame.copy()
    storage_frame.columns = sanitized_columns

    with get_connection() as connection:
        storage_frame.to_sql(table_name, connection, if_exists="replace", index=False)
        connection.execute(
            f"""
            CREATE TABLE IF NOT EXISTS {META_TABLE_NAME} (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                table_name TEXT NOT NULL,
                row_count INTEGER NOT NULL,
                uploaded_at TEXT NOT NULL,
                schema_json TEXT NOT NULL
            )
            """
        )
        connection.execute(
            f"""
            INSERT OR REPLACE INTO {META_TABLE_NAME} (id, table_name, row_count, uploaded_at, schema_json)
            VALUES (1, ?, ?, ?, ?)
            """,
            (
                table_name,
                int(len(storage_frame.index)),
                uploaded_at,
                json.dumps(schema),
            ),
        )
        connection.commit()

    preview_frame = storage_frame.head(5).copy()
    preview_frame = preview_frame.where(pd.notna(preview_frame), None)

    return {
        "table_name": table_name,
        "row_count": int(len(storage_frame.index)),
        "uploaded_at": uploaded_at,
        "columns": schema,
        "preview": preview_frame.to_dict(orient="records"),
    }


def get_dataset_schema() -> dict[str, Any] | None:
    with get_connection() as connection:
        table_exists = connection.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
            (META_TABLE_NAME,),
        ).fetchone()

        if not table_exists:
            return None

        metadata = connection.execute(
            f"SELECT table_name, row_count, uploaded_at, schema_json FROM {META_TABLE_NAME} WHERE id = 1"
        ).fetchone()

    if not metadata:
        return None

    return {
        "table_name": metadata["table_name"],
        "row_count": metadata["row_count"],
        "uploaded_at": metadata["uploaded_at"],
        "columns": json.loads(metadata["schema_json"]),
    }


def has_dataset() -> bool:
    return get_dataset_schema() is not None


def execute_query(sql: str) -> dict[str, Any]:
    with get_connection() as connection:
        cursor = connection.execute(sql)
        column_names = [column[0] for column in cursor.description or []]
        rows = []

        for row in cursor.fetchall():
            rows.append({column: _serialize_value(row[column]) for column in column_names})

    return {
        "columns": column_names,
        "rows": rows,
        "row_count": len(rows),
    }

import codecs
import io
import os
import re
import time
from collections import defaultdict, deque
from pathlib import Path
from typing import Any

import pandas as pd
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ai_service import GeminiService
from chart_service import suggest_chart
from database import execute_query, get_dataset_schema, persist_dataframe
from sql_validator import SQLValidationError, apply_result_limit, validate_select_query

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "25"))
MAX_UPLOAD_ROWS = int(os.getenv("MAX_UPLOAD_ROWS", "200000"))
MAX_UPLOAD_COLUMNS = int(os.getenv("MAX_UPLOAD_COLUMNS", "100"))
RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))
RATE_LIMIT_MAX_REQUESTS = int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "30"))
DEFAULT_ALLOWED_ORIGINS = "http://localhost:3000"
CSV_ENCODING_CANDIDATES = (
    "utf-8",
    "utf-8-sig",
    "cp1252",
    "latin-1",
    "utf-16",
    "utf-16-le",
    "utf-16-be",
)

request_log: dict[str, deque[float]] = defaultdict(deque)
app = FastAPI(title="Baniya Dost API", version="1.0.0")
gemini_service = GeminiService()


def get_allowed_origins() -> list[str]:
    raw_value = os.getenv("BACKEND_CORS_ORIGINS", DEFAULT_ALLOWED_ORIGINS)
    return [origin.strip() for origin in raw_value.split(",") if origin.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConversationTurn(BaseModel):
    question: str = Field(..., min_length=1, max_length=500)
    sql: str | None = Field(default=None, max_length=5000)
    summary: str | None = Field(default=None, max_length=1000)


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=500)
    history: list[ConversationTurn] = Field(default_factory=list)


def sanitize_text(value: str) -> str:
    sanitized = re.sub(r"[\x00-\x1F\x7F]+", " ", value)
    sanitized = re.sub(r"\s+", " ", sanitized)
    return sanitized.strip()


def enforce_rate_limit(request: Request) -> None:
    client_ip = request.client.host if request.client else "anonymous"
    current_time = time.time()
    timestamps = request_log[client_ip]

    while timestamps and current_time - timestamps[0] > RATE_LIMIT_WINDOW_SECONDS:
        timestamps.popleft()

    if len(timestamps) >= RATE_LIMIT_MAX_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please wait a moment before sending more requests.",
        )

    timestamps.append(current_time)


def validate_dataframe(dataframe: pd.DataFrame) -> pd.DataFrame:
    if dataframe.empty:
        raise HTTPException(status_code=400, detail="The uploaded CSV is empty.")

    cleaned = dataframe.dropna(how="all").copy()
    if cleaned.empty:
        raise HTTPException(status_code=400, detail="The uploaded CSV contains no usable rows.")

    if len(cleaned.index) > MAX_UPLOAD_ROWS:
        raise HTTPException(
            status_code=400,
            detail=f"CSV is too large. The limit is {MAX_UPLOAD_ROWS} rows.",
        )

    if len(cleaned.columns) > MAX_UPLOAD_COLUMNS:
        raise HTTPException(
            status_code=400,
            detail=f"CSV has too many columns. The limit is {MAX_UPLOAD_COLUMNS} columns.",
        )

    normalized_columns = []
    for index, column in enumerate(cleaned.columns):
        normalized_columns.append(str(column).strip() or f"column_{index + 1}")
    cleaned.columns = normalized_columns
    return cleaned


def build_fallback_summary(results: dict[str, Any]) -> str:
    row_count = results["row_count"]
    if row_count == 0:
        return "No rows matched the question, so there is no chartable result yet."
    if row_count == 1:
        return "The query returned a single consolidated record."
    return f"The query returned {row_count} rows ready for visual exploration."


def get_csv_encodings(raw_bytes: bytes) -> list[str]:
    preferred_encodings: list[str] = []

    if raw_bytes.startswith(codecs.BOM_UTF8):
        preferred_encodings.append("utf-8-sig")
    elif raw_bytes.startswith((codecs.BOM_UTF16_LE, codecs.BOM_UTF16_BE)):
        preferred_encodings.append("utf-16")
    elif raw_bytes.startswith((codecs.BOM_UTF32_LE, codecs.BOM_UTF32_BE)):
        preferred_encodings.append("utf-32")

    preferred_encodings.extend(CSV_ENCODING_CANDIDATES)

    seen: set[str] = set()
    ordered_encodings: list[str] = []
    for encoding in preferred_encodings:
        if encoding not in seen:
            seen.add(encoding)
            ordered_encodings.append(encoding)
    return ordered_encodings


def read_uploaded_csv(raw_bytes: bytes) -> pd.DataFrame:
    parse_failures: list[str] = []

    for encoding in get_csv_encodings(raw_bytes):
        try:
            return pd.read_csv(io.BytesIO(raw_bytes), encoding=encoding)
        except UnicodeDecodeError as error:
            parse_failures.append(f"{encoding}: {error}")
            continue
        except pd.errors.ParserError:
            try:
                return pd.read_csv(io.BytesIO(raw_bytes), encoding=encoding, sep=None, engine="python")
            except (UnicodeDecodeError, pd.errors.ParserError, ValueError) as error:
                parse_failures.append(f"{encoding}: {error}")
                continue
        except ValueError as error:
            parse_failures.append(f"{encoding}: {error}")
            continue

    if parse_failures:
        last_failure = parse_failures[-1]
        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to read CSV file. Supported encodings include UTF-8, UTF-8 with BOM, Windows-1252, "
                f"Latin-1, and UTF-16. Last parser error: {last_failure}"
            ),
        )

    raise HTTPException(status_code=400, detail="Unable to read CSV file.")


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Baniya Dost backend is running."}


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/schema")
def get_schema(_: None = Depends(enforce_rate_limit)) -> dict[str, Any]:
    schema = get_dataset_schema()
    if not schema:
        raise HTTPException(status_code=404, detail="No dataset has been uploaded yet.")
    return schema


@app.post("/upload")
async def upload_dataset(
    request: Request,
    file: UploadFile = File(...),
    _: None = Depends(enforce_rate_limit),
) -> dict[str, Any]:
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    raw_bytes = await file.read()
    file_size_limit = MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(raw_bytes) > file_size_limit:
        raise HTTPException(
            status_code=400,
            detail=f"File is too large. The limit is {MAX_UPLOAD_SIZE_MB} MB.",
        )

    dataframe = read_uploaded_csv(raw_bytes)
    cleaned_frame = validate_dataframe(dataframe)
    stored_schema = persist_dataframe(cleaned_frame)

    return {
        "message": "Dataset uploaded successfully.",
        "client_ip": request.client.host if request.client else "anonymous",
        "dataset": stored_schema,
    }


@app.post("/query")
def run_query(payload: QueryRequest, _: None = Depends(enforce_rate_limit)) -> dict[str, Any]:
    schema = get_dataset_schema()
    if not schema:
        raise HTTPException(status_code=400, detail="Upload a CSV dataset before running a query.")

    question = sanitize_text(payload.question)
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    safe_history = [
        {
            "question": sanitize_text(turn.question),
            "sql": sanitize_text(turn.sql or ""),
            "summary": sanitize_text(turn.summary or ""),
        }
        for turn in payload.history[-5:]
    ]

    try:
        generated = gemini_service.generate_sql(
            question=question,
            table_name=schema["table_name"],
            schema=schema["columns"],
            history=safe_history,
        )
    except Exception as error:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {error}") from error

    try:
        validated_sql = validate_select_query(generated["sql"], [schema["table_name"]])
        limited_sql = apply_result_limit(validated_sql)
    except SQLValidationError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    try:
        results = execute_query(limited_sql)
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"SQL execution failed: {error}") from error

    chart = suggest_chart(question=question, columns=results["columns"], rows=results["rows"])
    summary = generated["summary"] or build_fallback_summary(results)

    if results["row_count"] == 0:
        chart = {
            "chart_type": "table",
            "title": "No Matching Rows",
            "description": "The query ran successfully but did not return any rows.",
            "x_axis": None,
            "y_axis": None,
            "series": [],
            "metric_label": None,
            "metric_value": None,
            "data": [],
        }

    return {
        "question": question,
        "title": generated["title"] or "Generated Insight",
        "summary": summary,
        "sql": limited_sql,
        "chart": chart,
        "results": results,
        "schema": schema,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

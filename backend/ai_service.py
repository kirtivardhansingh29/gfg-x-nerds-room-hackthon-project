import json
import os
import re
from typing import Any

import requests


class GeminiService:
    def __init__(self) -> None:
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
        self.timeout_seconds = int(os.getenv("GEMINI_TIMEOUT_SECONDS", "30"))

    def _build_prompt(
        self,
        question: str,
        table_name: str,
        schema: list[dict[str, Any]],
        history: list[dict[str, str]],
    ) -> str:
        schema_description = json.dumps(schema, indent=2)
        history_description = json.dumps(history[-5:], indent=2) if history else "[]"

        return f"""
You are a senior analytics engineer writing SQLite SQL for a conversational business intelligence app.

Dataset table: {table_name}
Schema:
{schema_description}

Conversation history:
{history_description}

User question:
{question}

Rules:
1. Return valid JSON only.
2. Output shape must be:
   {{
     "sql": "SELECT ...",
     "title": "short dashboard title",
     "summary": "one short business insight sentence"
   }}
3. Generate a single SQLite SELECT statement only.
4. Use only the provided table and columns.
5. Never mutate data. No INSERT, UPDATE, DELETE, DROP, ALTER, PRAGMA, ATTACH, or multiple statements.
6. Prefer readable aliases for aggregated columns.
7. When the question is ambiguous, use the conversation history to infer the intended follow-up.
8. Keep SQL compatible with SQLite.
""".strip()

    def _extract_json(self, raw_text: str) -> dict[str, Any]:
        try:
            return json.loads(raw_text)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", raw_text, flags=re.DOTALL)
            if not match:
                raise RuntimeError("Gemini returned a response that could not be parsed as JSON.")
            return json.loads(match.group(0))

    def _raise_api_error(self, response: requests.Response) -> None:
        status_code = response.status_code

        try:
            error_payload = response.json()
        except ValueError:
            error_payload = {}

        error_message = ""
        if isinstance(error_payload, dict):
            error_message = str(error_payload.get("error", {}).get("message", "")).strip()

        if status_code == 404:
            raise RuntimeError(
                f"Gemini model '{self.model}' was not found. Update GEMINI_MODEL to a current model such as 'gemini-2.5-flash'."
            )

        if status_code in {401, 403}:
            raise RuntimeError("Gemini API authentication failed. Check GEMINI_API_KEY and API access settings.")

        if status_code == 429:
            raise RuntimeError("Gemini API rate limit reached. Please retry in a moment.")

        if error_message:
            raise RuntimeError(f"Gemini API request failed ({status_code}): {error_message}")

        raise RuntimeError(f"Gemini API request failed with status {status_code}.")

    def generate_sql(
        self,
        question: str,
        table_name: str,
        schema: list[dict[str, Any]],
        history: list[dict[str, str]],
    ) -> dict[str, str]:
        if not self.api_key:
            raise RuntimeError("Missing GEMINI_API_KEY environment variable.")

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": self._build_prompt(
                                question=question,
                                table_name=table_name,
                                schema=schema,
                                history=history,
                            )
                        }
                    ],
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "responseMimeType": "application/json",
            },
        }

        try:
            response = requests.post(url, json=payload, timeout=self.timeout_seconds)
        except requests.RequestException as error:
            raise RuntimeError("Gemini API request could not be completed. Check network access and API availability.") from error

        if not response.ok:
            self._raise_api_error(response)

        payload = response.json()

        try:
            response_text = payload["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError) as error:
            raise RuntimeError("Gemini returned an unexpected response format.") from error

        parsed = self._extract_json(response_text)
        return {
            "sql": str(parsed.get("sql", "")).strip(),
            "title": str(parsed.get("title", "")).strip() or "Generated Insight",
            "summary": str(parsed.get("summary", "")).strip() or "Insight generated from the uploaded dataset.",
        }

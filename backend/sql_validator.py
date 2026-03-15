import re

import sqlparse

BANNED_KEYWORDS = {
    "ALTER",
    "ATTACH",
    "CREATE",
    "DELETE",
    "DETACH",
    "DROP",
    "INSERT",
    "MERGE",
    "PRAGMA",
    "REINDEX",
    "REPLACE",
    "TRUNCATE",
    "UPDATE",
    "UPSERT",
    "VACUUM",
}


class SQLValidationError(ValueError):
    pass


def _strip_comments(sql: str) -> str:
    without_block_comments = re.sub(r"/\*.*?\*/", " ", sql, flags=re.DOTALL)
    return re.sub(r"--.*?$", " ", without_block_comments, flags=re.MULTILINE)


def _extract_table_names(sql: str) -> set[str]:
    matches = re.findall(
        r'\b(?:FROM|JOIN)\s+(?:"([^"]+)"|`([^`]+)`|([a-zA-Z_][a-zA-Z0-9_]*))',
        sql,
        flags=re.IGNORECASE,
    )
    identifiers = set()

    for quoted_identifier, backtick_identifier, plain_identifier in matches:
        identifier = quoted_identifier or backtick_identifier or plain_identifier
        if identifier:
            identifiers.add(identifier.lower())

    return identifiers


def _extract_cte_names(sql: str) -> set[str]:
    matches = re.findall(r"\bWITH\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+AS\b|\),\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+AS\b", sql, flags=re.IGNORECASE)
    identifiers = set()

    for first_match, second_match in matches:
        identifier = first_match or second_match
        if identifier:
            identifiers.add(identifier.lower())

    return identifiers


def validate_select_query(sql: str, allowed_tables: list[str]) -> str:
    cleaned_sql = _strip_comments(sql).strip().rstrip(";")
    if not cleaned_sql:
        raise SQLValidationError("The generated SQL query was empty.")

    parsed_statements = [statement for statement in sqlparse.split(cleaned_sql) if statement.strip()]
    if len(parsed_statements) != 1:
        raise SQLValidationError("Only a single SELECT statement is allowed.")

    normalized_sql = re.sub(r"\s+", " ", cleaned_sql).strip()
    upper_sql = normalized_sql.upper()

    if not (upper_sql.startswith("SELECT") or upper_sql.startswith("WITH")):
        raise SQLValidationError("Only SELECT queries are allowed.")

    if any(re.search(rf"\b{keyword}\b", upper_sql) for keyword in BANNED_KEYWORDS):
        raise SQLValidationError("Only read-only SQL statements are allowed.")

    parsed = sqlparse.parse(normalized_sql)
    if not parsed:
        raise SQLValidationError("Unable to parse SQL.")

    statement_type = parsed[0].get_type()
    if statement_type not in {"SELECT", "UNKNOWN"}:
        raise SQLValidationError("The SQL statement must be a SELECT query.")

    referenced_tables = _extract_table_names(normalized_sql)
    cte_names = _extract_cte_names(normalized_sql)
    allowed_table_set = {table.lower() for table in allowed_tables}
    disallowed_tables = referenced_tables.difference(allowed_table_set.union(cte_names))
    if disallowed_tables:
        disallowed = ", ".join(sorted(disallowed_tables))
        raise SQLValidationError(f"Query referenced unsupported tables: {disallowed}.")

    return normalized_sql


def apply_result_limit(sql: str, default_limit: int = 200) -> str:
    if re.search(r"\bLIMIT\b", sql, flags=re.IGNORECASE):
        return sql
    return f"{sql} LIMIT {default_limit}"

# Baniyabhai AI

Baniyabhai AI is a full-stack conversational business intelligence MVP for exploring CSV datasets with natural language or voice. Users upload a dataset, Gemini converts questions into SQLite `SELECT` queries, the backend validates and executes those queries, and the frontend renders insight cards with automatically selected charts.

## Project Structure

```text
.
|-- backend/
|   |-- ai_service.py
|   |-- chart_service.py
|   |-- database.py
|   |-- main.py
|   |-- requirements.txt
|   |-- render.yaml
|   |-- sql_validator.py
|   `-- data/
|-- frontend/
|   |-- components/
|   |   |-- ChartCard.jsx
|   |   |-- Dashboard.jsx
|   |   |-- QueryInput.jsx
|   |   `-- UploadDataset.jsx
|   |-- pages/
|   |   |-- _app.js
|   |   `-- index.js
|   |-- services/
|   |   `-- api.js
|   |-- styles/
|   |   `-- globals.css
|   |-- next.config.js
|   |-- package.json
|   |-- postcss.config.js
|   `-- tailwind.config.js
|-- .env.example
|-- .gitignore
`-- README.md
```

## Architecture

- Frontend: Next.js with Tailwind CSS and Recharts for a modern analytics dashboard UI.
- Backend: FastAPI with pandas for CSV handling, SQLite for storage, and a Gemini REST integration for SQL generation.
- Data flow: CSV uploads are sanitized and loaded into a `customers` SQLite table, schema metadata is stored separately, and every natural-language question is resolved into a validated `SELECT` query.
- Security: API keys live in environment variables, CSV uploads are size-limited and validated, questions are sanitized, SQL is restricted to read-only access, and endpoints are guarded with a basic in-memory rate limiter.

## Workflow

1. Upload a CSV from the frontend.
2. FastAPI reads the file with pandas, validates row and column limits, sanitizes column names, and stores the dataset in SQLite.
3. The backend extracts schema metadata and exposes it through `/schema`.
4. The user asks a question by typing or using the browser Speech Recognition API.
5. The frontend sends the question and recent history to `/query`.
6. Gemini generates a SQLite query plus a short title and summary.
7. The backend validates that the SQL is `SELECT`-only and only touches the allowed table.
8. SQLite executes the query and the backend infers a chart type from the returned result shape.
9. The frontend renders the result as an interactive dashboard card with SQL, preview rows, and a chart.

## API

### `POST /upload`

- Purpose: Upload and index a CSV dataset.
- Request: `multipart/form-data` with `file`.
- Response: Upload status, table name, row count, inferred schema, and preview rows.

### `GET /schema`

- Purpose: Return the currently active dataset schema.
- Response: Table metadata, row count, upload time, and column definitions.

### `POST /query`

- Purpose: Convert a natural-language question into SQL and return insight data.
- Request body:

```json
{
  "question": "Compare average online spend and store spend by city tier.",
  "history": [
    {
      "question": "Show shopping preference by gender.",
      "sql": "SELECT gender, shopping_preference, COUNT(*) AS total FROM customers GROUP BY gender, shopping_preference",
      "summary": "Shopping preference varies across genders."
    }
  ]
}
```

- Response: Generated SQL, title, summary, chart config, result columns, and result rows.

## Local Development

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend runs on `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

## Testing

### Backend tests

```bash
cd backend
..\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
..\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

### Frontend build check

```bash
cd frontend
npm install
npm run build
```

## Environment Variables

Copy `.env.example` and provide the values in your local environment or deployment platform:

- `GEMINI_API_KEY`: required Gemini API key.
- `GEMINI_MODEL`: optional model name, defaults to `gemini-2.5-flash`.
- `BACKEND_CORS_ORIGINS`: comma-separated allowed frontend origins.
- `NEXT_PUBLIC_API_BASE_URL`: frontend base URL for the backend API.

## Deployment

### Frontend on Vercel

1. Set the project root to `frontend`.
2. Add `NEXT_PUBLIC_API_BASE_URL` pointing to your deployed backend.
3. Run the default Vercel flow:
   - `npm install`
   - `npm run build`
4. Deploy.

### Backend on Render

1. Set the service root directory to `backend`, or use the included `backend/render.yaml`.
2. Configure environment variables:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL`
   - `BACKEND_CORS_ORIGINS`
3. Build command:
   - `pip install -r requirements.txt`
4. Start command:
   - `uvicorn main:app --host 0.0.0.0 --port $PORT`

## GitHub Ready

- Local-only artifacts such as virtual environments, build output, logs, SQLite files, and test runtime data are ignored through `.gitignore`.
- A GitHub Actions workflow is included to run backend tests and a frontend production build on pushes and pull requests.
- The repo can be pushed with the usual flow:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Notes

- The default dashboard prompts align well with the example "Customer Behaviour Online vs Offline" dataset.
- The SQL validator intentionally blocks all non-read-only operations.
- The included rate limiter is intentionally simple and suitable for an MVP; for production, replace it with a shared store-backed limiter.

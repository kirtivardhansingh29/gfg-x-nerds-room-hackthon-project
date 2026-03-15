<div align="center">

# 🤖 Baniyabhai AI

### Conversational Business Intelligence Dashboard

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[Features](#-key-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [How It Works](#-how-it-works)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## 🎯 Overview

**Baniyabhai AI** transforms the traditional analytics workflow into an intuitive conversational experience. Upload your data, ask questions in natural language or via voice, and instantly receive SQL-backed insights with intelligent visualizations.

### The Problem

Traditional analytics workflows are fragmented and complex:
- Switching between spreadsheets, SQL tools, and BI software
- Writing complex queries for simple questions
- Manual chart selection and configuration
- Steep learning curve for non-technical users

### Our Solution

A unified conversational interface that:
1. **Accepts** CSV datasets via drag-and-drop
2. **Understands** natural language questions
3. **Generates** validated SQL queries automatically
4. **Visualizes** results with context-aware charts
5. **Maintains** conversation context for follow-up queries

### Perfect For

- 📊 **Business Analysts** seeking rapid insights
- 🚀 **Startups** building internal analytics tools
- 🎓 **Hackathon Projects** requiring quick MVPs
- 🔬 **Data Exploration** and prototyping
- 💼 **Executive Dashboards** with natural language queries

---

## ✨ Key Features

### Core Capabilities

<table>
<tr>
<td width="50%">

#### 📤 Smart Data Upload
- Drag-and-drop CSV support
- Automatic encoding detection (UTF-8, CP1252, Latin-1, UTF-16)
- Schema extraction and validation
- Preview with row/column counts
- Intelligent column name sanitization

</td>
<td width="50%">

#### 🗣️ Natural Language Queries
- Text-based question input
- Voice recognition support (Web Speech API)
- Conversational context retention
- Follow-up question handling
- Multi-turn conversations

</td>
</tr>
<tr>
<td width="50%">

#### 🤖 AI-Powered SQL Generation
- Google Gemini 2.5 Flash integration
- Schema-aware query generation
- Automatic error correction
- Query result caching (10-min TTL)
- Retry logic with exponential backoff

</td>
<td width="50%">

#### 📊 Intelligent Visualizations
- Automatic chart type selection
- Support for 6 visualization types
- Responsive chart rendering
- Interactive legends and tooltips
- Table view for complex results

</td>
</tr>
<tr>
<td width="50%">

#### 🔒 Security & Validation
- Read-only SQL enforcement
- Dangerous keyword blocking
- Sanitized column names
- Rate limiting (30 req/min per IP)
- File size and dimension limits

</td>
<td width="50%">

#### ⚡ Performance Optimized
- In-memory response caching
- Connection pooling
- Lazy loading components
- Optimized SQLite queries
- Minimal frontend bundle size

</td>
</tr>
</table>

### Supported Visualizations

| Chart Type | Use Case | Trigger Condition |
|------------|----------|-------------------|
| **Metric Card** | Single KPI values | 1 row, 1 numeric column |
| **Bar Chart** | Category comparisons | Categorical + numeric columns |
| **Line Chart** | Trends over time | Date/time + numeric columns |
| **Scatter Plot** | Correlations | 2 numeric columns |
| **Pie Chart** | Distribution analysis | Keywords: "distribution", "share", "percentage" |
| **Table View** | Detailed data | >10 rows or >5 columns |

---

## 🛠️ Tech Stack

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│          Next.js 14 (React 18)          │
├─────────────────────────────────────────┤
│  • App Router with SSR                  │
│  • React Hooks (useState, useEffect)    │
│  • Custom API client service            │
│  • Component-based architecture         │
└─────────────────────────────────────────┘
          │                    │
          ▼                    ▼
┌──────────────────┐  ┌──────────────────┐
│  Tailwind CSS    │  │    Recharts      │
├──────────────────┤  ├──────────────────┤
│ • Utility-first  │  │ • Bar/Line/Pie   │
│ • Responsive     │  │ • Scatter Plot   │
│ • Dark mode      │  │ • Tooltips       │
└──────────────────┘  └──────────────────┘
```

### Backend Architecture

```
┌─────────────────────────────────────────┐
│            FastAPI Server               │
├─────────────────────────────────────────┤
│  • Async/await support                  │
│  • CORS middleware                      │
│  • Rate limiting                        │
│  • File upload handling                 │
└─────────────────────────────────────────┘
     │              │              │
     ▼              ▼              ▼
┌─────────┐  ┌──────────┐  ┌─────────────┐
│ SQLite  │  │  Pandas  │  │   Gemini    │
├─────────┤  ├──────────┤  ├─────────────┤
│ Storage │  │ CSV I/O  │  │ NL → SQL    │
│ Queries │  │ Transform│  │ JSON Output │
└─────────┘  └──────────┘  └─────────────┘
```

### Complete Technology Matrix

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend Framework** | Next.js 14 | Server-side rendering, routing, React framework |
| **UI Library** | React 18 | Component-based UI, hooks, state management |
| **Styling** | Tailwind CSS | Utility-first styling, responsive design |
| **Charts** | Recharts | Declarative chart components |
| **Backend Framework** | FastAPI | High-performance async API server |
| **Data Processing** | pandas | CSV parsing, data transformation |
| **Database** | SQLite | Lightweight SQL storage |
| **AI Engine** | Google Gemini 2.5 Flash | Natural language to SQL conversion |
| **SQL Parsing** | sqlparse | Query validation and sanitization |
| **HTTP Client** | fetch API | Frontend-backend communication |
| **Testing** | unittest + TestClient | Backend unit and integration tests |
| **Deployment** | Vercel + Render | Frontend and backend hosting |

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                         │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Upload   │  │ Voice/Text   │  │   Dashboard      │   │
│  │   Widget   │  │    Input     │  │   Grid View      │   │
│  └────────────┘  └──────────────┘  └──────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/JSON
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  main.py: Routes, CORS, Rate Limiting, Validation    │  │
│  └──────────────────────────────────────────────────────┘  │
│         │              │              │              │      │
│         ▼              ▼              ▼              ▼      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   AI     │  │ Database │  │   SQL    │  │  Chart   │  │
│  │ Service  │  │ Service  │  │Validator │  │ Service  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└────────┬──────────────┬───────────────────────────┬────────┘
         │              │                           │
         ▼              ▼                           ▼
┌─────────────┐  ┌─────────────┐         ┌──────────────────┐
│   Gemini    │  │   SQLite    │         │  Chart Selection │
│     API     │  │   Database  │         │      Logic       │
│             │  │             │         │                  │
│ • Prompt    │  │ • customers │         │ • Metric Card    │
│ • Response  │  │ • metadata  │         │ • Bar/Line/Pie   │
│ • Caching   │  │ • schema    │         │ • Scatter/Table  │
└─────────────┘  └─────────────┘         └──────────────────┘
```

### Request Flow Diagram

```
User Action                  Frontend                Backend                    AI/Database
    │                           │                       │                            │
    ├─ Upload CSV              │                       │                            │
    │  ──────────────────────> │                       │                            │
    │                           ├─ POST /upload        │                            │
    │                           │  ──────────────────> │                            │
    │                           │                       ├─ Validate file            │
    │                           │                       ├─ Parse with pandas        │
    │                           │                       │  ────────────────────────> │
    │                           │                       │  <──────────────────────── │
    │                           │                       ├─ Store in SQLite          │
    │                           │  <────────────────── │                            │
    │  <──────────────────────  │                       │                            │
    │                           │                       │                            │
    ├─ Ask Question            │                       │                            │
    │  ──────────────────────> │                       │                            │
    │                           ├─ POST /query         │                            │
    │                           │  ──────────────────> │                            │
    │                           │                       ├─ Build prompt             │
    │                           │                       ├─ Call Gemini API          │
    │                           │                       │  ────────────────────────> │
    │                           │                       │  <──────────────────────── │
    │                           │                       ├─ Validate SQL             │
    │                           │                       ├─ Execute query            │
    │                           │                       │  ────────────────────────> │
    │                           │                       │  <──────────────────────── │
    │                           │                       ├─ Select chart type        │
    │                           │  <────────────────── │                            │
    │  <──────────────────────  │                       │                            │
    │                           │                       │                            │
    └─ View Results            │                       │                            │
```

### Module Breakdown

#### Backend Modules

| Module | Responsibility | Key Functions |
|--------|----------------|---------------|
| `main.py` | API endpoints, request handling, CORS | `upload_dataset()`, `query()`, `get_schema()` |
| `ai_service.py` | Gemini integration, caching, retries | `generate_sql()`, `_build_prompt()`, `_cache_get/set()` |
| `database.py` | SQLite operations, schema management | `save_dataset()`, `execute_query()`, `get_schema()` |
| `sql_validator.py` | Security validation, query sanitization | `validate_sql()`, `is_read_only()` |
| `chart_service.py` | Visualization selection logic | `select_chart_type()`, `_analyze_columns()` |

#### Frontend Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `pages/index.js` | Main app orchestration | State management, API calls |
| `UploadDataset.jsx` | File upload interface | Drag-drop, validation, preview |
| `QueryInput.jsx` | Question input | Text/voice input, history |
| `Dashboard.jsx` | Results display | Grid layout, empty states |
| `ChartCard.jsx` | Individual insight cards | SQL display, charts, summaries |
| `services/api.js` | API client | Centralized fetch logic |

---

## 🔄 How It Works

### 1️⃣ Upload Flow

```
User selects CSV file
        ↓
Frontend validates file type and size
        ↓
POST /upload with multipart/form-data
        ↓
Backend receives file
        ↓
Attempts encoding detection:
  • UTF-8
  • UTF-8-sig
  • CP1252
  • Latin-1
  • UTF-16
        ↓
Pandas parses CSV
        ↓
Sanitize column names:
  • Remove special characters
  • Replace spaces with underscores
  • Ensure SQL-safe identifiers
        ↓
Store in SQLite as "customers" table
        ↓
Extract and save metadata:
  • Table name
  • Column names and types
  • Row count
  • Sample values
        ↓
Return schema to frontend
        ↓
Display preview with stats
```

### 2️⃣ Query Flow

```
User asks question (text or voice)
        ↓
Frontend sends to POST /query:
  • User question
  • Conversation history (last 3 exchanges)
  • Current timestamp
        ↓
Backend receives request
        ↓
Check cache for identical prompt
        ↓
        ├─ Cache hit → Return cached response
        │
        └─ Cache miss → Continue
                ↓
        Retrieve schema from database
                ↓
        Build Gemini prompt:
          • System instructions
          • Schema with types
          • Example queries
          • Conversation history
          • Strict JSON format requirements
                ↓
        Call Gemini API with retry logic:
          • Max 2 retries
          • Exponential backoff (1.5s base)
          • 30s timeout per request
                ↓
        Parse JSON response:
          • sql: Generated query
          • title: Insight title
          • summary: Natural language explanation
                ↓
        Validate SQL:
          • Ensure SELECT only
          • Block dangerous keywords (DROP, DELETE, etc.)
          • Verify table name matches
          • Add LIMIT 200 if missing
                ↓
        Execute query on SQLite
                ↓
        Analyze result shape and content
                ↓
        Select appropriate chart type:
          • 1 row + 1 number → Metric
          • Category + number → Bar
          • Date + number → Line
          • 2 numbers → Scatter
          • Distribution keywords → Pie
          • Large result → Table
                ↓
        Cache response (10 min TTL)
                ↓
        Return to frontend:
          • sql
          • title
          • summary
          • data (rows)
          • chart_type
                ↓
Frontend renders ChartCard component
```

### 3️⃣ Visualization Selection Logic

```python
def select_chart_type(data, user_question):
    rows = len(data)
    cols = len(data[0]) if rows > 0 else 0
    
    # Single metric
    if rows == 1 and cols == 1:
        return "metric"
    
    # Analyze column types
    has_date = detect_date_column(data)
    numeric_cols = count_numeric_columns(data)
    
    # Distribution queries
    if any(keyword in user_question.lower() 
           for keyword in ["distribution", "share", "percentage", "breakdown"]):
        return "pie"
    
    # Time series
    if has_date and numeric_cols >= 1:
        return "line"
    
    # Correlation
    if numeric_cols == 2 and rows < 100:
        return "scatter"
    
    # Category comparison
    if numeric_cols >= 1 and rows <= 20:
        return "bar"
    
    # Default to table for complex results
    return "table"
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Python**: 3.11 or higher ([Download](https://www.python.org/downloads/))
- **Node.js**: 18 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Git**: For cloning the repository
- **Gemini API Key**: [Get one here](https://makersuite.google.com/app/apikey)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/baniyabhai-ai.git
cd baniyabhai-ai
```

#### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
# AI Configuration
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Backend Configuration
BACKEND_CORS_ORIGINS=http://localhost:3000
MAX_UPLOAD_SIZE_MB=25

# Frontend Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

#### 3. Start the Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**

API documentation: **http://localhost:8000/docs**

#### 4. Start the Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

#### 5. Verify Installation

1. Open **http://localhost:3000** in your browser
2. You should see the Baniyabhai AI dashboard
3. Backend health check: **http://localhost:8000/health**

### First Steps

1. **Upload a CSV**: Drag and drop a sample CSV file (or use one from `sample_data/`)
2. **Wait for schema**: The preview will show column names and types
3. **Ask a question**: Try "What are the total sales by region?"
4. **View results**: See the SQL query, summary, and visualization

---

## ⚙️ Configuration

### Backend Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| **AI Configuration** |
| `GEMINI_API_KEY` | string | *required* | Your Google Gemini API key |
| `GEMINI_MODEL` | string | `gemini-2.5-flash` | Model version to use |
| `GEMINI_TIMEOUT_SECONDS` | integer | `30` | API request timeout |
| `GEMINI_MAX_RETRIES` | integer | `2` | Retry attempts for failed requests |
| `GEMINI_RETRY_BACKOFF_SECONDS` | float | `1.5` | Base delay between retries |
| `GEMINI_CACHE_TTL_SECONDS` | integer | `600` | Cache duration (10 minutes) |
| `GEMINI_CACHE_MAX_ENTRIES` | integer | `128` | Maximum cached responses |
| **CORS & Security** |
| `BACKEND_CORS_ORIGINS` | string | `http://localhost:3000` | Allowed frontend origins (comma-separated) |
| **Upload Limits** |
| `MAX_UPLOAD_SIZE_MB` | integer | `25` | Maximum file size in megabytes |
| `MAX_UPLOAD_ROWS` | integer | `200000` | Maximum rows per dataset |
| `MAX_UPLOAD_COLUMNS` | integer | `100` | Maximum columns per dataset |
| **Rate Limiting** |
| `RATE_LIMIT_WINDOW_SECONDS` | integer | `60` | Time window for rate limiting |
| `RATE_LIMIT_MAX_REQUESTS` | integer | `30` | Max requests per IP per window |

### Frontend Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | string | `http://localhost:8000` | Backend API base URL |

> **Note**: Frontend variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

### Advanced Configuration

#### Custom Dataset Table Name

By default, datasets are stored as the "customers" table. To use a different name, modify `backend/database.py`:

```python
DEFAULT_TABLE_NAME = "your_table_name"
```

#### Adjust Rate Limiting

For development, you may want to disable or increase rate limits in `backend/main.py`:

```python
# Disable rate limiting
# rate_limiter.check_rate_limit(request.client.host)

# Or increase limits
RATE_LIMIT_MAX_REQUESTS = 100
```

#### Chart Selection Customization

Modify chart selection logic in `backend/chart_service.py`:

```python
def select_chart_type(data, question):
    # Add custom logic
    if "trend" in question.lower():
        return "line"
    # ... existing logic
```

---

## 📡 API Documentation

### Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://your-backend.onrender.com`

### Endpoints

#### `GET /`

**Description**: Root endpoint, returns API status

**Response**:
```json
{
  "message": "Baniyabhai AI Backend is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

---

#### `GET /health`

**Description**: Health check endpoint for monitoring

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Use Cases**:
- Render.com health checks
- Load balancer health probes
- Monitoring systems

---

#### `GET /schema`

**Description**: Retrieve metadata for the currently active dataset

**Response**:
```json
{
  "table_name": "customers",
  "columns": [
    {"name": "customer_id", "type": "INTEGER"},
    {"name": "name", "type": "TEXT"},
    {"name": "purchase_amount", "type": "REAL"},
    {"name": "purchase_date", "type": "TEXT"}
  ],
  "row_count": 1500,
  "sample_data": [
    {"customer_id": 1, "name": "John Doe", "purchase_amount": 125.50, "purchase_date": "2024-01-10"},
    {"customer_id": 2, "name": "Jane Smith", "purchase_amount": 89.99, "purchase_date": "2024-01-11"}
  ]
}
```

**Error Responses**:

```json
{
  "error": "No dataset has been uploaded yet"
}
```

---

#### `POST /upload`

**Description**: Upload and index a CSV file

**Request**:
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: CSV file (required)

**Example** (curl):
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@/path/to/your/data.csv"
```

**Success Response**:
```json
{
  "message": "Dataset uploaded successfully",
  "table_name": "customers",
  "rows": 1500,
  "columns": ["customer_id", "name", "purchase_amount", "purchase_date"],
  "schema": [
    {"name": "customer_id", "type": "INTEGER"},
    {"name": "name", "type": "TEXT"},
    {"name": "purchase_amount", "type": "REAL"},
    {"name": "purchase_date", "type": "TEXT"}
  ]
}
```

**Error Responses**:

```json
// File too large
{
  "error": "File size exceeds maximum allowed size of 25MB"
}

// Too many rows
{
  "error": "Dataset has too many rows (maximum: 200000)"
}

// Invalid file type
{
  "error": "Only CSV files are supported"
}

// Encoding error
{
  "error": "Unable to read CSV file. Please ensure it's properly encoded."
}
```

---

#### `POST /query`

**Description**: Generate SQL from natural language and return results with visualization

**Request**:
```json
{
  "question": "What are the top 5 customers by total purchase amount?",
  "history": [
    {
      "question": "How many customers do we have?",
      "sql": "SELECT COUNT(*) as total FROM customers",
      "title": "Total Customers"
    }
  ]
}
```

**Parameters**:
- `question` (string, required): User's natural language query
- `history` (array, optional): Previous conversation context (last 3 exchanges recommended)

**Success Response**:
```json
{
  "sql": "SELECT name, SUM(purchase_amount) as total_amount FROM customers GROUP BY name ORDER BY total_amount DESC LIMIT 5",
  "title": "Top 5 Customers by Purchase Amount",
  "summary": "Here are the five customers with the highest total purchase amounts. John Doe leads with $12,450 in total purchases.",
  "data": [
    {"name": "John Doe", "total_amount": 12450.00},
    {"name": "Jane Smith", "total_amount": 9800.50},
    {"name": "Bob Johnson", "total_amount": 8750.25},
    {"name": "Alice Williams", "total_amount": 7200.00},
    {"name": "Charlie Brown", "total_amount": 6890.75}
  ],
  "chart_type": "bar"
}
```

**Error Responses**:

```json
// No dataset uploaded
{
  "error": "No dataset available. Please upload a CSV first."
}

// Invalid SQL generated
{
  "error": "Generated SQL contains forbidden operations. Only SELECT queries are allowed."
}

// Gemini API error
{
  "error": "AI service temporarily unavailable. Please try again."
}

// Rate limit exceeded
{
  "error": "Rate limit exceeded. Please wait before making more requests."
}
```

---

### Rate Limiting

All endpoints are subject to rate limiting:
- **Limit**: 30 requests per minute per IP address
- **Window**: 60 seconds
- **Response Code**: `429 Too Many Requests`

**Rate Limit Headers**:
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1705320600
```

---

## 🔒 Security

### Security Features

#### 1. SQL Injection Prevention

✅ **Read-Only Queries**: Only `SELECT` statements are permitted
```python
ALLOWED_KEYWORDS = {"SELECT"}
FORBIDDEN_KEYWORDS = {
    "INSERT", "UPDATE", "DELETE", "DROP", "CREATE", 
    "ALTER", "TRUNCATE", "EXEC", "EXECUTE"
}
```

✅ **Keyword Blacklist**: Dangerous operations are blocked

✅ **Table Validation**: Queries restricted to the active dataset table

✅ **Automatic LIMIT**: Default `LIMIT 200` applied to unbounded queries

#### 2. File Upload Security

✅ **File Type Validation**: Only `.csv` extensions accepted

✅ **Size Limits**: Configurable maximum file size (default: 25MB)

✅ **Row/Column Limits**: Prevent resource exhaustion
- Max rows: 200,000
- Max columns: 100

✅ **Encoding Detection**: Multiple encoding attempts with fallback

✅ **Column Sanitization**: Special characters removed from column names

#### 3. API Security

✅ **CORS Configuration**: Whitelist of allowed origins

✅ **Rate Limiting**: IP-based request throttling

✅ **API Key Protection**: Gemini key never exposed to frontend

✅ **Environment Variables**: Sensitive data stored securely

✅ **No Credential Storage**: No user authentication data persisted

#### 4. Data Privacy

✅ **Ephemeral Storage**: SQLite data cleared on redeploy (unless persistent disk attached)

✅ **No Telemetry**: No user data sent to third parties except Gemini API

✅ **Local Processing**: CSV parsing and SQL execution happen server-side

### Security Best Practices

#### For Development

```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use strong API keys
GEMINI_API_KEY=AIza...your-actual-key...xyz

# Restrict CORS to specific domains
BACKEND_CORS_ORIGINS=http://localhost:3000
```

#### For Production

```bash
# Use HTTPS only
BACKEND_CORS_ORIGINS=https://yourdomain.com

# Enable strict rate limiting
RATE_LIMIT_MAX_REQUESTS=20
RATE_LIMIT_WINDOW_SECONDS=60

# Reduce upload limits
MAX_UPLOAD_SIZE_MB=10
MAX_UPLOAD_ROWS=50000
```

#### Recommended Environment Setup

1. **Use environment-specific `.env` files**:
   - `.env.development`
   - `.env.production`

2. **Rotate API keys regularly**

3. **Monitor rate limit violations**

4. **Review SQL validator logs**

5. **Keep dependencies updated**:
```bash
pip list --outdated
npm outdated
```

### Known Limitations

⚠️ **SQLite Concurrency**: Not suitable for high-concurrency production use

⚠️ **In-Memory Rate Limiter**: Resets on server restart

⚠️ **No Authentication**: No built-in user management system

⚠️ **Single Dataset**: Only one active dataset at a time

⚠️ **Client-Side API Exposure**: Frontend includes backend URL

---

## 🧪 Testing

### Backend Tests

The backend includes comprehensive unit and integration tests.

#### Running All Tests

```bash
cd backend

# Install dev dependencies
pip install -r requirements-dev.txt

# Run all tests with verbose output
python -m unittest discover -s tests -v
```

#### Running Specific Test Modules

```bash
# Test AI service
python -m unittest tests.test_ai_service -v

# Test API endpoints
python -m unittest tests.test_api -v

# Test chart selection
python -m unittest tests.test_chart_service -v

# Test SQL validation
python -m unittest tests.test_sql_validator -v
```

#### Test Coverage

| Module | Test File | Coverage |
|--------|-----------|----------|
| `ai_service.py` | `test_ai_service.py` | Prompt generation, caching, retries |
| `main.py` | `test_api.py` | All API endpoints, error handling |
| `chart_service.py` | `test_chart_service.py` | Chart type selection logic |
| `sql_validator.py` | `test_sql_validator.py` | SQL security validation |

#### Example Test Output

```
test_generate_sql_success (tests.test_ai_service.TestAIService) ... ok
test_cache_hit (tests.test_ai_service.TestAIService) ... ok
test_upload_valid_csv (tests.test_api.TestAPI) ... ok
test_query_without_dataset (tests.test_api.TestAPI) ... ok
test_select_metric_chart (tests.test_chart_service.TestChartService) ... ok
test_validate_safe_sql (tests.test_sql_validator.TestSQLValidator) ... ok
test_validate_dangerous_sql (tests.test_sql_validator.TestSQLValidator) ... ok

----------------------------------------------------------------------
Ran 24 tests in 3.456s

OK
```

### Frontend Testing

#### Build Verification

```bash
cd frontend

# Install dependencies
npm install

# Run production build
npm run build

# Test the build
npm start
```

#### Manual Testing Checklist

- [ ] Upload CSV with various encodings
- [ ] Test drag-and-drop upload
- [ ] Verify schema preview displays correctly
- [ ] Test text-based queries
- [ ] Test voice input (Chrome/Edge)
- [ ] Verify all chart types render
- [ ] Test follow-up conversational queries
- [ ] Check responsive design on mobile
- [ ] Test error handling (invalid files, network errors)
- [ ] Verify CORS with production backend

### Integration Testing

#### End-to-End Workflow

1. Start both backend and frontend
2. Upload `sample_data/sales.csv`
3. Run these test queries:
   - "How many rows are in the dataset?"
   - "What are the top 5 products by revenue?"
   - "Show me sales trends over time"
   - "What's the average order value?"
   - "Which region has the most customers?"

4. Verify:
   - All queries return valid responses
   - Correct chart types are selected
   - SQL queries are displayed accurately
   - Follow-up questions maintain context

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

#### Step 1: Prepare Repository

Ensure your repository is pushed to GitHub, GitLab, or Bitbucket.

#### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your repository
4. Configure project settings:

**Root Directory**: `frontend`

**Framework Preset**: Next.js

**Build Command** (auto-detected):
```bash
npm run build
```

**Output Directory**: `.next`

#### Step 3: Environment Variables

Add in Vercel dashboard:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com
```

#### Step 4: Deploy

Click **"Deploy"** and wait for build completion.

**Your frontend will be live at**: `https://your-app.vercel.app`

#### Vercel Best Practices

- Enable **Analytics** to monitor performance
- Set up **custom domain** for production
- Use **preview deployments** for testing
- Configure **build caching** for faster deploys

---

### Backend Deployment (Render)

#### Step 1: Prepare Repository

Ensure `backend/render.yaml` exists with:

```yaml
services:
  - type: web
    name: baniyabhai-backend
    env: python
    region: oregon
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    healthCheckPath: /health
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

#### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your repository
4. Configure:

**Name**: `baniyabhai-backend`

**Root Directory**: `backend`

**Environment**: `Python 3`

**Build Command**:
```bash
pip install -r requirements.txt
```

**Start Command**:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Health Check Path**: `/health`

#### Step 3: Environment Variables

Add in Render dashboard:

```env
GEMINI_API_KEY=your_actual_gemini_key
GEMINI_MODEL=gemini-2.5-flash
BACKEND_CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
MAX_UPLOAD_SIZE_MB=25
RATE_LIMIT_MAX_REQUESTS=30
```

> **Important**: Replace `your-frontend.vercel.app` with your actual Vercel domain

#### Step 4: Deploy

Click **"Create Web Service"** and monitor deployment logs.

**Your backend will be live at**: `https://baniyabhai-backend.onrender.com`

#### Render Best Practices

- Use **paid plan** for production (free tier sleeps after inactivity)
- Attach **persistent disk** at `/backend/data` to preserve uploads
- Monitor **health checks** in Render dashboard
- Set up **auto-deploy** from main branch

---

### Post-Deployment Verification

#### 1. Test Backend Health

```bash
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{"status": "healthy", "timestamp": "2024-01-15T10:30:00Z"}
```

#### 2. Test CORS

Open browser console on your Vercel frontend and check for CORS errors.

#### 3. Test Full Workflow

1. Visit your Vercel URL
2. Upload a test CSV
3. Ask a query
4. Verify results display correctly

#### 4. Monitor Logs

- **Vercel**: Check deployment logs for build errors
- **Render**: Monitor application logs for runtime errors

---

### Environment-Specific Considerations

#### Development
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
BACKEND_CORS_ORIGINS=http://localhost:3000
```

#### Staging
```env
NEXT_PUBLIC_API_BASE_URL=https://staging-backend.onrender.com
BACKEND_CORS_ORIGINS=https://staging-frontend.vercel.app
```

#### Production
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
BACKEND_CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

### Persistent Storage on Render

By default, Render's filesystem is ephemeral. To persist uploaded datasets:

#### Option 1: Render Persistent Disk

1. In Render dashboard, go to your service
2. Navigate to **"Disks"** tab
3. Click **"Add Disk"**
4. Configure:
   - **Name**: `baniyabhai-data`
   - **Mount Path**: `/backend/data`
   - **Size**: 1 GB (adjust as needed)

#### Option 2: External Database

For production, consider migrating from SQLite to PostgreSQL:

1. Add Render PostgreSQL database
2. Update `database.py` to use SQLAlchemy
3. Store connection string in environment variables

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. CSV Upload Fails with Encoding Error

**Symptom**:
```
Error: Unable to read CSV file. Please ensure it's properly encoded.
```

**Causes**:
- File is not actually a CSV (e.g., Excel file renamed to `.csv`)
- Unusual character encoding
- Corrupted file

**Solutions**:

```bash
# Option 1: Re-save as UTF-8 CSV in Excel
# File → Save As → CSV UTF-8 (Comma delimited)

# Option 2: Convert using Python
import pandas as pd
df = pd.read_excel('your_file.xlsx')
df.to_csv('your_file.csv', index=False, encoding='utf-8')

# Option 3: Use iconv (Linux/Mac)
iconv -f ISO-8859-1 -t UTF-8 input.csv > output.csv
```

---

#### 2. Frontend Shows "Failed to Fetch"

**Symptom**:
```
Error: Failed to fetch
TypeError: NetworkError when attempting to fetch resource
```

**Causes**:
- Backend is not running
- Incorrect `NEXT_PUBLIC_API_BASE_URL`
- CORS misconfiguration
- Backend is sleeping (Render free tier)

**Solutions**:

```bash
# Check 1: Verify backend is running
curl http://localhost:8000/health

# Check 2: Verify environment variable
# In frontend/.env.local
echo $NEXT_PUBLIC_API_BASE_URL

# Check 3: Verify CORS origins
# In backend/.env
echo $BACKEND_CORS_ORIGINS
# Should include: http://localhost:3000

# Check 4: Wake up Render backend
curl https://your-backend.onrender.com/health
```

**Frontend Console Debug**:
```javascript
// Add to frontend/services/api.js
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
```

---

#### 3. Gemini API Errors

##### Error: `404 models/gemini-pro not found`

**Solution**:
```env
# Update to current model
GEMINI_MODEL=gemini-2.5-flash
```

##### Error: `429 Resource has been exhausted (e.g. check quota)`

**Causes**:
- API quota exceeded
- Too many concurrent requests
- Rate limiting

**Solutions**:

```bash
# Check 1: Verify API key is valid
# Visit https://makersuite.google.com/app/apikey

# Check 2: Review quota usage
# Visit Google Cloud Console → APIs & Services → Quotas

# Check 3: Reduce request rate
# In backend/.env
GEMINI_CACHE_TTL_SECONDS=1800  # Increase cache duration
RATE_LIMIT_MAX_REQUESTS=10      # Reduce allowed requests
```

**Implement Backoff**:
The backend already includes retry logic, but you can adjust:
```env
GEMINI_MAX_RETRIES=3
GEMINI_RETRY_BACKOFF_SECONDS=2.0
```

##### Error: `500 Internal Server Error` from Gemini

**Causes**:
- Gemini service outage
- Invalid prompt format
- Prompt too long

**Solutions**:

```python
# Check prompt length in ai_service.py
def _build_prompt(self, question, schema, history):
    prompt = f"..."  # Your prompt
    print(f"Prompt length: {len(prompt)} characters")  # Add debug
    return prompt
```

**Reduce history**:
```javascript
// In frontend/pages/index.js
const recentHistory = conversationHistory.slice(-2);  // Reduced from 3
```

---

#### 4. Charts Not Rendering

**Symptom**:
- SQL and summary display correctly
- Chart area is blank or shows error

**Causes**:
- Data format mismatch
- Missing required columns
- Recharts compatibility issue

**Solutions**:

```javascript
// Debug in frontend/components/ChartCard.jsx
console.log('Chart Type:', chartType);
console.log('Chart Data:', data);
console.log('Data Keys:', Object.keys(data[0] || {}));
```

**Check data format**:
```json
// Bar chart expects:
[
  {"category": "A", "value": 100},
  {"category": "B", "value": 150}
]

// Line chart expects:
[
  {"date": "2024-01", "value": 100},
  {"date": "2024-02", "value": 150}
]
```

---

#### 5. Voice Input Not Working

**Symptom**:
- Microphone button does nothing
- Browser permission denied

**Causes**:
- HTTPS required (doesn't work on HTTP in production)
- Browser doesn't support Web Speech API
- Microphone permission not granted

**Solutions**:

```bash
# Check 1: Verify browser support
# Chrome/Edge: ✅ Supported
# Firefox: ❌ Limited support
# Safari: ⚠️ Partial support

# Check 2: Use HTTPS in production
# Voice API requires secure context
```

**Browser Permissions**:
1. Click the lock icon in address bar
2. Enable microphone permissions
3. Refresh the page

**Fallback**:
```javascript
// In frontend/components/QueryInput.jsx
if (!('webkitSpeechRecognition' in window)) {
  console.warn('Speech recognition not supported');
  // Hide microphone button
}
```

---

#### 6. Slow Query Performance

**Symptom**:
- Queries take >10 seconds
- Timeout errors

**Causes**:
- Large dataset (>100k rows)
- Complex aggregations
- Gemini API latency
- No LIMIT clause

**Solutions**:

```python
# Option 1: Optimize SQL validation to always add LIMIT
# In backend/sql_validator.py
if "LIMIT" not in sql_upper:
    sql += " LIMIT 100"  # Reduced from 200

# Option 2: Add timeout to Gemini calls
# Already implemented:
GEMINI_TIMEOUT_SECONDS=15  # Reduce from 30

# Option 3: Sample large datasets
# In backend/database.py
def save_dataset(self, df, table_name):
    if len(df) > 50000:
        df = df.sample(n=50000, random_state=42)
    # ... existing code
```

---

#### 7. Render Deployment Issues

##### Error: `App failed to bind to $PORT`

**Solution**:
```bash
# Ensure start command uses $PORT variable
uvicorn main:app --host 0.0.0.0 --port $PORT
```

##### Error: `Health check failed`

**Causes**:
- `/health` endpoint not working
- App not starting
- Wrong health check path

**Solutions**:

```bash
# Check 1: Verify health endpoint locally
curl http://localhost:8000/health

# Check 2: Update Render health check path
# In Render dashboard: /health (not full URL)

# Check 3: Check startup logs
# Render Dashboard → Logs tab
```

##### Database Resets on Redeploy

**Solution**:
```bash
# Attach persistent disk to /backend/data
# Or migrate to PostgreSQL for production
```

---

### Debug Mode

Enable verbose logging:

#### Backend

```python
# In backend/main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

#### Frontend

```javascript
// In frontend/services/api.js
const DEBUG = true;

if (DEBUG) {
  console.log('Request:', method, endpoint, data);
  console.log('Response:', responseData);
}
```

---

### Getting Help

If issues persist:

1. **Check Logs**:
   - Backend: `uvicorn` console output or Render logs
   - Frontend: Browser console (F12)

2. **Review Configuration**:
   - Verify all environment variables are set
   - Check CORS origins match exactly

3. **Test Individually**:
   - Test backend API with curl/Postman
   - Test frontend against working backend

4. **Search Issues**: Check existing GitHub issues

5. **Create Issue**: Include:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Python version, Node version)
   - Relevant logs

---

## 🗺️ Roadmap

### Short-term (v1.1)

- [ ] Multi-dataset support (switch between uploaded files)
- [ ] Export results as CSV/Excel
- [ ] Query history with saved searches
- [ ] Dark mode toggle
- [ ] Frontend unit tests with Jest
- [ ] PostgreSQL database option
- [ ] Improved error messages with suggestions

### Medium-term (v1.2)

- [ ] User authentication and workspace management
- [ ] Collaborative sharing (share dashboard with link)
- [ ] Scheduled queries and email reports
- [ ] Custom chart configuration (colors, labels)
- [ ] Data source connectors (Google Sheets, Airtable)
- [ ] Natural language data transformations
- [ ] Query templates and saved prompts

### Long-term (v2.0)

- [ ] Multi-table JOIN support
- [ ] Real-time data streaming
- [ ] Advanced analytics (forecasting, anomaly detection)
- [ ] Embedded dashboard widgets
- [ ] Mobile app (React Native)
- [ ] On-premise deployment option
- [ ] Enterprise SSO integration
- [ ] Audit logs and compliance features

### Community Requests

Vote on features or propose new ones in [GitHub Discussions](https://github.com/yourusername/baniyabhai-ai/discussions)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs**: Open an issue with reproduction steps
- 💡 **Suggest Features**: Share ideas in GitHub Discussions
- 📖 **Improve Documentation**: Fix typos, add examples
- 🔧 **Submit Pull Requests**: Fix bugs or add features
- ⭐ **Star the Repo**: Show your support

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/yourusername/baniyabhai-ai.git
   ```
3. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make changes** and test thoroughly
5. **Run tests**:
   ```bash
   cd backend && python -m unittest discover -s tests
   cd frontend && npm run build
   ```
6. **Commit** with clear messages:
   ```bash
   git commit -m "Add: Feature description"
   ```
7. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request** with description of changes

### Code Style

- **Python**: Follow PEP 8, use `black` formatter
- **JavaScript**: Use ESLint with Airbnb config
- **Commits**: Use conventional commit messages

### Pull Request Guidelines

- Include tests for new features
- Update documentation as needed
- Keep PRs focused (one feature/fix per PR)
- Respond to review feedback promptly

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What This Means

✅ Commercial use  
✅ Modification  
✅ Distribution  
✅ Private use  

⚠️ Warranty and liability limitations apply

---

## 🙏 Acknowledgments

- **Google Gemini** for powerful natural language understanding
- **FastAPI** for the excellent Python web framework
- **Next.js** and **Vercel** for seamless frontend development
- **Recharts** for beautiful React charting
- **Tailwind CSS** for utility-first styling
- The open-source community for inspiration and tools

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/baniyabhai-ai/issues)
- **Discussions**: [Ask questions or share ideas](https://github.com/yourusername/baniyabhai-ai/discussions)
- **Email**: your.email@example.com
- **Twitter**: [@yourusername](https://twitter.com/yourusername)

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/baniyabhai-ai&type=Date)](https://star-history.com/#yourusername/baniyabhai-ai&Date)

---

<div align="center">

**Built with ❤️ by [Your Name](https://github.com/yourusername)**

Made in India 🇮🇳

[⬆ Back to Top](#-baniyabhai-ai)

</div>

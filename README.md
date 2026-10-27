# AI Executive Email Assistant

A full-stack email analysis assistant that turns an incoming email into structured insight, action items, deadline detection, risk flags, and a ready-to-edit draft reply.

The application uses a FastAPI backend, a React/Vite frontend, and Google Gemini for AI-powered analysis. It is designed for executive-style inbox workflows where speed, accuracy, and clear follow-up matter.

## Features

- Analyze pasted emails and extract the main request, intent, urgency, and sentiment.
- Generate professional draft replies with `[CONFIRM: ...]` placeholders for missing information.
- Identify action items, owners, deadlines, and ambiguity.
- Resolve relative deadlines against the email received timestamp.
- Flag risks such as phishing, escalation, missing information, legal/financial concerns, and sensitive personal matters.
- Validate AI output against a strict Pydantic schema.
- Rotate through multiple Gemini API keys when quota limits are reached.
- Browse built-in sample emails for quick testing.
- View formatted analysis results or raw JSON output.

## Tech Stack, Frameworks & Libraries

| Category | Component / Tool | Version | Role & Specific Responsibility |
| --- | --- | --- | --- |
| **Frontend Framework** | **React** | `^18.3.1` | Manages component state, dynamic UI rendering, and user interactions. |
| **Build & Tooling** | **Vite** | `^6.0.7` | Provides high-speed dev server with HMR and builds optimized production bundles. |
| **UI Icons** | **Lucide React** | `^0.469.0` | Modern SVG iconography for metrics, urgency tags, sentiments, and action states. |
| **Styling** | **Vanilla CSS** | Modern CSS3 | Custom responsive layout, dark/light theme styling, and glassmorphic dashboards. |
| **API Client** | **Fetch API** | Native | Asynchronous HTTP requests between client and backend (`api.js`). |
| **Backend Framework** | **FastAPI** | `0.115.8` | REST API routing, CORS handling, request parsing, and error orchestration. |
| **ASGI Server** | **Uvicorn** | `0.34.0` | Asynchronous web server hosting the FastAPI application. |
| **Data Validation** | **Pydantic** | `2.10.6` | Strict schema validation, type enforcement, data coercion, and field validators. |
| **AI Client SDK** | **google-genai** | `1.5.0` | Official Google GenAI SDK communicating with Gemini in structured JSON mode. |
| **AI Model** | **Gemini 3.1 Flash Lite** | `gemini-3.1-flash-lite` | LLM for intent extraction, deadline resolution, sentiment scoring, and reply generation. |
| **Configuration** | **python-dotenv** | `1.0.1` | Secure environment variable loading and multi-key pool management from `.env`. |
| **Evaluation Suite** | **evaluator.py** | Built-in | Benchmarks model quality against 28 ground-truth test cases across 5 metrics. |

## System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Layer (React + Vite)"]
        UI["User Interface (App.jsx)"]
        Auth["Auth Check (LoginPage.jsx)"]
        Input["Email Input & Context Form"]
        Samples["Sample Selector (28 Emails)"]
        Dashboard["Analysis View & Benchmark Dashboard"]
    end

    subgraph Server["Backend Layer (FastAPI)"]
        Router["FastAPI Application (main.py)"]
        CORS["CORS Middleware"]
        Analyzer["Analysis Pipeline (analyzer.py)"]
        KeyPool["11-Key Gemini Rotation Manager"]
        Normalizer["JSON Normalizer & Cleaner"]
        Schema["Pydantic Schema Validator (schemas.py)"]
        Evaluator["Benchmark Evaluation Suite (evaluator.py)"]
    end

    subgraph AI["AI Layer (Google Gemini)"]
        Gemini["Google Gemini Model (gemini-3.1-flash-lite)"]
    end

    UI --> Auth
    Auth --> Input
    Samples --> Input
    Input -->|POST /api/analyze| Router
    Router --> CORS
    CORS --> Analyzer
    Analyzer --> KeyPool
    KeyPool -->|google-genai SDK| Gemini
    Gemini -->|Raw JSON / Markdown| Analyzer
    Analyzer --> Normalizer
    Normalizer --> Schema
    Schema -- "Validation Fails" -->|Self-Correction Retry| Gemini
    Schema -- "Validated Object" --> Router
    Router -->|JSON Response| Dashboard
```


## Project Structure

```text
.
|-- backend/
|   |-- app/
|   |   |-- analyzer.py       # Gemini prompt, key rotation, validation, normalization
|   |   |-- evaluator.py      # Benchmark evaluation helpers
|   |   |-- main.py           # FastAPI application and API routes
|   |   |-- sample_data.py    # Sample email dataset
|   |   `-- schemas.py        # Request and response models
|   |-- requirements.txt
|   `-- run.py
|-- frontend/
|   |-- src/
|   |   |-- components/       # UI components
|   |   |-- api.js            # API client helpers
|   |   |-- App.jsx
|   |   `-- main.jsx
|   `-- package.json
|-- start.sh                  # Starts backend and frontend together
`-- README.md
```

## Requirements

- Python 3.10+
- Node.js 18+
- npm
- At least one Gemini API key

## Environment Setup

Create `backend/.env` and add at least one Gemini API key:

```env
GEMINI_API_KEY_1=your_key_here
GEMINI_MODEL=gemini-3.1-flash-lite
```

You can configure up to 11 keys:

```env
GEMINI_API_KEY_1=your_first_key
GEMINI_API_KEY_2=your_second_key
...
GEMINI_API_KEY_11=your_eleventh_key
```

The backend tries keys in order and rotates to the next key when Gemini returns a quota-related error.

## Run Locally

### Option 1: Start Everything

```bash
chmod +x start.sh
./start.sh
```

This starts:

- Backend API: `http://localhost:8000`
- Frontend app: `http://localhost:3000`

### Option 2: Start Services Manually

Start the backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

Start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Open the app at:

```text
http://localhost:3000
```

Default demo login:

```text
Username: admin
Password: admin
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Returns service status and version. |
| `GET` | `/api/samples` | Returns the built-in sample email dataset. |
| `POST` | `/api/analyze` | Analyzes one email and returns structured AI output. |

### Analyze Request

```json
{
  "user_name": "Alex Morgan",
  "user_role": "Executive Director",
  "tone": "professional but warm",
  "signoff": "Best regards,\nAlex",
  "received_at": "2026-09-29 10:15 IST",
  "sender": "Taylor Lee <taylor@example.com>",
  "recipients": "Alex Morgan <alex@company.com>",
  "subject": "Follow-up on proposal",
  "body": "Hi Alex, can you review the proposal and send feedback by Friday?"
}
```

### Analyze Response

```json
{
  "success": true,
  "execution_source": "Gemini (gemini-3.1-flash-lite) - key #1",
  "data": {
    "summary": "...",
    "intent": {
      "primary": "request_action",
      "secondary": [],
      "explanation": "..."
    },
    "action_items": [],
    "deadlines": [],
    "sentiment": {
      "label": "neutral",
      "reason": "..."
    },
    "urgency": {
      "level": "medium",
      "reason": "..."
    },
    "flags": [],
    "reply_needed": true,
    "suggested_response": {
      "subject": null,
      "body": "...",
      "reason_if_none": null
    },
    "needs_user_input": [],
    "confidence": 0.9
  }
}
```

## End-to-End Workflow Stages

The application executes each analysis through six distinct pipeline stages:

### Stage 1: User Authentication & Context Ingestion (Frontend)
- **Components & Tools:** `LoginPage.jsx`, `EmailAnalyzer.jsx`, `SampleSelector.jsx`, React 18, Lucide React.
- **Workflow:**
  1. The user logs in via `LoginPage.jsx` (demo authentication session).
  2. The user sets their executive context: `user_name`, `user_role`, `tone` (e.g., *professional but warm*), and `signoff` (e.g., *Best regards, Alex*).
  3. The user inputs email details (`received_at`, `sender`, `recipients`, `subject`, `body`) or loads one of the 28 benchmark emails.
  4. The client dispatches an HTTP POST request to `/api/analyze` using the native Fetch API (`api.js`).

### Stage 2: Request Parsing & Schema Validation (Backend Gateway)
- **Components & Tools:** `main.py`, `schemas.py`, FastAPI, Pydantic v2.
- **Workflow:**
  1. FastAPI receives the request payload and validates it against the `AnalyzeEmailRequest` Pydantic model.
  2. CORS middleware ensures secure cross-origin communication between the Vite frontend (`:3000`) and FastAPI backend (`:8000`).
  3. The validated request object is passed to `analyze_email()` in `analyzer.py`.

### Stage 3: Prompt Engineering & Injection Defense
- **Components & Tools:** `analyzer.py` (`format_prompt`, `SYSTEM_PROMPT`).
- **Workflow:**
  1. Constructs an immutable system prompt combining executive instructions with the user's personal context and incoming email data.
  2. **Prompt Injection Defense:** Strict constraints instruct the model to treat email text purely as **DATA**, blocking prompt injection attempts.
  3. **Temporal Grounding:** Uses `RECEIVED_AT` and timezone to anchor relative time expressions (`"tomorrow"`, `"EOD Friday"`) into exact calendar dates.
  4. **Hallucination Prevention:** Enforces `[CONFIRM: ...]` placeholder generation for missing information rather than fabricating facts.

### Stage 4: LLM Inference & Dynamic Key Rotation
- **Components & Tools:** `analyzer.py` (`_call_gemini`, `_rotate_key`), `google-genai` SDK, Google Gemini (`gemini-3.1-flash-lite`).
- **Workflow:**
  1. Initializes `genai.Client` with the active key from an 11-key pool loaded via `python-dotenv`.
  2. Invokes Gemini with low temperature (`0.1`), token ceiling (`900`), and `response_mime_type="application/json"`.
  3. **Automated Key Failover:** Intercepts HTTP `429`, `RESOURCE_EXHAUSTED`, and quota errors; immediately rotates to the next available API key in the pool and retries without user-visible failures.

### Stage 5: JSON Cleansing, Schema Normalization & Self-Correction
- **Components & Tools:** `analyzer.py` (`clean_json`, `normalize`, `_ensure_body`), `schemas.py`, Pydantic v2.
- **Workflow:**
  1. `clean_json()` strips any extraneous markdown enclosures (````json ... ````).
  2. `normalize()` canonicalizes schema variations, repairs nested intent/urgency/sentiment blocks, and maps synonymous keys.
  3. Validates the normalized dictionary against `EmailAnalysisResult`.
  4. **Self-Correction Retry Loop:** If validation fails, the backend captures the `ValidationError` details, builds a targeted repair prompt, queries Gemini for corrected JSON, and re-validates.
  5. `_ensure_body()` guarantees that a draft reply is present whenever `reply_needed` is `true`.

### Stage 6: Dashboard Visualization & User Review (Frontend)
- **Components & Tools:** `AnalysisView.jsx`, `BenchmarkView.jsx`, Lucide React, Custom CSS.
- **Workflow:**
  1. Receives the validated `EmailAnalysisResult` alongside execution metadata (e.g., active key number and model identifier).
  2. Renders structured executive intelligence: summary cards, intent badges, urgency/sentiment ratings, risk warning chips, action items with ownership tags, and resolved deadlines.
  3. Displays an interactive draft reply editor with one-click copy and raw JSON view for auditing.

## Response Schema

The model returns these main fields:

| Field | Purpose |
| --- | --- |
| `summary` | Short explanation of who wants what and why it matters. |
| `intent` | Primary intent, secondary intents, and explanation. |
| `action_items` | Tasks, owners, deadlines, and whether each item is explicit. |
| `deadlines` | Original date text, resolved date, deadline type, and ambiguity notes. |
| `sentiment` | Sentiment label and reasoning. |
| `urgency` | Urgency level and reasoning. |
| `flags` | Risk and workflow flags. |
| `reply_needed` | Whether a reply should be drafted. |
| `suggested_response` | Draft subject/body or reason no response is needed. |
| `needs_user_input` | Decisions or missing facts the user must provide. |
| `confidence` | Confidence score from 0.0 to 1.0. |

## Frontend Screens

- `LoginPage.jsx`: Demo login screen.
- `EmailAnalyzer.jsx`: Email input and analysis trigger.
- `SampleSelector.jsx`: Built-in sample email browser.
- `AnalysisView.jsx`: Formatted result view and raw JSON view.
- `BenchmarkView.jsx`: Benchmark UI placeholder that expects a backend benchmark route.
- `PromptDocView.jsx`: Prompt design documentation.

## Current Limitations

- Demo login is handled in the browser only and should not be used as production authentication.
- CORS is currently open to all origins.
- The frontend includes a benchmark view, but the backend does not currently expose `/api/benchmark`.
- Backend exceptions are wrapped by the API route, so some original HTTP status codes may be returned as `500`.
- API keys are rotated through a global index and are not protected by a lock.

## Production Recommendations

- Add server-side authentication and authorization.
- Restrict CORS to trusted frontend origins.
- Store API keys in a managed secrets service.
- Add request logging, rate limiting, and monitoring.
- Add automated tests for the API contract and schema normalization.
- Implement `/api/benchmark` or remove the benchmark UI until the route is available.

## License

No license file is currently included. Add a license before publishing or distributing this project.

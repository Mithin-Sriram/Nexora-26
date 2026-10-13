# Nexora-26 backend

FastAPI service for extracting text from PDFs and TXT files and returning an
AI-generated accessible rewrite. The OpenRouter API key stays on the server.

## Setup

Requires Python 3.10 or newer.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Replace the `your_openrouter_api_key_here` placeholder with a valid OpenRouter
API key in `.env` before using either simplification endpoint. A placeholder is
detected and reported as a configuration error rather than sent to the provider.
Do not commit `.env`. Edit `OPENROUTER_MODEL` if a different model is preferred.

## Run

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or run `python main.py`; both use the configured `HOST` and `PORT`. The health
endpoint does not require an AI key.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | unset | Required server-side key for simplification |
| `OPENROUTER_MODEL` | `openai/gpt-4o-mini` | OpenRouter model identifier |
| `HOST` | `0.0.0.0` | Bind address |
| `PORT` | `8000` | Bind port |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed browser origins |

The API accepts at most 10 MB per upload and 50,000 characters of extracted
or pasted text. It supports UTF-8 TXT and text-based PDFs; scanned PDFs are not
OCR-processed.

## Offline read aloud

Read-aloud audio is synthesized locally by the bundled eSpeak NG engine and
English voice data. It does not call a cloud TTS service, download voices, or
depend on browser speech voices. The included runtime targets x86-64 Linux;
the host still needs its standard Linux shared libraries. See
[`vendor/espeak/README.md`](vendor/espeak/README.md) for version and license
notices.

## API

### `GET /health`

Returns `{"success": true, "message": "Backend is healthy"}`.

### `POST /api/simplify/text`

JSON request:

```json
{"text": "The document content", "reading_level": "simple"}
```

`reading_level` is `simple`, `very_simple`, or `detailed` and defaults to
`simple`.

### `POST /api/simplify/file`

Multipart form fields: `file` (PDF or TXT) and optional `reading_level` (same
values and default as above).

Both simplification routes return:

```json
{
  "success": true,
  "data": {
    "document_name": "Pasted text",
    "original_text": "The document content",
    "simplified_text": "A plain-language rewrite.",
    "summary": "The document's main idea.",
    "key_points": [],
    "action_items": [],
    "deadlines": [],
    "difficult_terms": [],
    "reading_level": "simple",
    "warnings": []
  },
  "message": "Document simplified successfully."
}
```

Errors use `{"success": false, "data": null, "message": "..."}` and an
appropriate 4xx or 5xx status.

### `POST /api/speech/synthesize`

Accepts JSON `{"text": "Text to read aloud"}` (up to 50,000 characters) and
returns locally generated WAV audio (`audio/wav`). No third-party speech
service is used.

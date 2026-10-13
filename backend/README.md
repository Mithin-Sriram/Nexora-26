# Backend Service

This directory is reserved for the backend API server.

## 🚀 Quick Recommendations

Depending on your team's stack preference:

### Option A: Python (FastAPI)
```bash
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn
# Run dev server on port 8000:
# uvicorn main:app --reload --port 8000
```

### Option B: Node.js (Express / Fastify)
```bash
npm init -y
npm install express cors dotenv
# Run dev server on port 8000
```

---

## 🔗 Frontend Integration
- Frontend default origin: `http://localhost:5173`
- Ensure CORS is configured to allow `http://localhost:5173`
- Pre-configured frontend API client expects backend at `http://localhost:8000`


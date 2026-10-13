# Frontend Service

React 19 + TypeScript + Vite 6 + Tailwind CSS v4 SaaS starter.

## 🚀 Run Frontend
```bash
./dev.sh
```
Runs at: [http://localhost:5173](http://localhost:5173)

## 🔗 Connect to Backend
In `.env` (copy from `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:8000
```
Use `api` from `src/services/api.ts` to make HTTP requests with automatic auth headers.


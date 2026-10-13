# Nexora-26 ⚡ Fullstack Monorepo

Split monorepo structure designed to prevent merge conflicts between frontend and backend work.

```text
Nexora-26/
├── frontend/             # React 19 + TypeScript + Vite 6 + Tailwind CSS v4
│   ├── src/
│   │   ├── components/   # UI components (Button, Navbar, etc.)
│   │   ├── services/     # Axios API client pointing to backend
│   │   ├── types/        # TypeScript models
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── dev.sh            # Run frontend dev server
│   └── package.json
│
├── backend/              # Dedicated space for backend API service
│   ├── .env.example      # Backend environment variables
│   └── README.md         # Backend setup instructions (FastAPI / Express / etc.)
│
├── dev.sh                # Root shortcut: launches frontend dev server
└── .gitignore            # Clean git ignore for both Node & Python/backend
```

---

## 🚀 Quick Start

### 1. Frontend
```bash
./dev.sh
# or: cd frontend && ./dev.sh
```
Runs at: [http://localhost:5173](http://localhost:5173)

### 2. Backend
See [`backend/README.md`](file:///home/yasar/Documents/Hacakthons/Nexora-26/backend/README.md) for setup with FastAPI or Node.js.
Default port expected: `http://localhost:8000`

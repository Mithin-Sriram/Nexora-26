# Nexora-26 ⚡ SaaS Frontend Boilerplate

Clean, lightweight, and modern SaaS frontend boilerplate designed for rapid hackathon prototyping.

## 🚀 Quick Start

Run the dev script:
```bash
./dev.sh
```
Or manually:
```bash
export PATH="/home/yasar/.cache/nodejs/bin:$PATH"
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173).

---

## 📂 Project Structure

```text
Nexora-26/
├── src/
│   ├── components/       # Reusable UI elements (Button, Navbar, etc.)
│   │   ├── Button.tsx
│   │   └── Navbar.tsx
│   ├── services/         # API integration with backend
│   │   └── api.ts        # Preconfigured Axios instance with auth interceptor
│   ├── types/            # Shared TypeScript data models
│   │   └── index.ts
│   ├── App.tsx           # Starter landing / dashboard UI
│   ├── main.tsx          # Application entrypoint
│   └── index.css         # Tailwind CSS v4 styling & dark theme defaults
├── dev.sh                # Instant 1-click startup script
├── vite.config.ts        # Vite 6 config with Tailwind & '@/' alias
├── package.json          # Pre-installed dependencies
└── .env.example          # Environment variable template
```

---

## 🛠️ Pre-installed Stack

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React (1,000+ icons)
- **API Client**: Axios (configured with baseURL and token interceptor)
- **Routing Ready**: React Router DOM
- **Interactions**: canvas-confetti, clsx, tailwind-merge

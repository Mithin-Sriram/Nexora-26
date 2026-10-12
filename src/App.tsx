import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Button } from './components/Button';
import { 
  Rocket, 
  Code2, 
  Palette, 
  Workflow, 
  Database, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [count, setCount] = useState(0);

  const handleConfetti = () => {
    setCount((c) => c + 1);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const stackItems = [
    {
      icon: <Rocket className="w-5 h-5 text-indigo-400" />,
      title: 'Vite 6 + React 19',
      desc: 'Instant HMR, fast builds, and clean TypeScript environment.',
    },
    {
      icon: <Palette className="w-5 h-5 text-cyan-400" />,
      title: 'Tailwind CSS v4',
      desc: 'Modern zero-config styling with dark theme support.',
    },
    {
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      title: 'Axios API Client',
      desc: 'Configured in src/services/api.ts with baseURL & token headers.',
    },
    {
      icon: <Workflow className="w-5 h-5 text-amber-400" />,
      title: 'Lucide Icons & Confetti',
      desc: '1,000+ modern SVG icons and micro-interactions ready.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Hackathon Frontend Boilerplate Ready
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Build your SaaS product{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              without wasting a minute.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400">
            Pre-configured with modern dependencies, path aliases, clean components, and API integration.
            Jump straight into building tomorrow.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button variant="primary" size="lg" onClick={handleConfetti}>
              Test Interaction ({count})
            </Button>
            <a
              href="#stack"
              className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white px-4 py-2.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
            >
              Explore Boilerplate <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="stack" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {stackItems.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all"
            >
              <div className="p-2 rounded-lg bg-slate-800/80 w-fit mb-3">
                {item.icon}
              </div>
              <h3 className="font-semibold text-white text-base mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Folder Guide */}
        <div className="mt-12 p-6 rounded-2xl border border-slate-800 bg-slate-900/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-4">
            <Code2 className="w-4 h-4 text-indigo-400" />
            Quick File Overview
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="font-mono text-indigo-400 font-medium">src/components/</span>
              <p className="text-slate-400 mt-1">Place UI primitives (buttons, modals, cards, navbars).</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="font-mono text-cyan-400 font-medium">src/services/api.ts</span>
              <p className="text-slate-400 mt-1">Axios client ready to connect to your team's backend.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="font-mono text-emerald-400 font-medium">src/types/index.ts</span>
              <p className="text-slate-400 mt-1">Shared data models and TypeScript interfaces.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Nexora-26 Hackathon Starter • Ready for fast development
      </footer>
    </div>
  );
};

export default App;

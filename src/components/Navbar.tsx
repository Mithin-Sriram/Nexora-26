import React from 'react';
import { Layers, Sparkles } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">Nexora</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
            Hackathon Starter
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Docs
          </Button>
          <Button variant="primary" size="sm">
            <Sparkles className="w-4 h-4" />
            Launch App
          </Button>
        </div>
      </div>
    </header>
  );
};


import React, { useState, useEffect, useCallback } from 'react';
import { Type, Volume2, VolumeX, Copy, Download, Check, Minus, Plus } from 'lucide-react';

interface AccessibilityToolbarProps {
  textToRead: string;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  documentName?: string;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  textToRead,
  fontSize,
  onFontSizeChange,
  documentName = 'simplified-document',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechAvailable] = useState(() => 'speechSynthesis' in window);
  const [copied, setCopied] = useState(false);

  const stopSpeech = useCallback(() => {
    if (speechAvailable) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [speechAvailable]);

  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  const toggleSpeech = () => {
    if (!speechAvailable) return;
    if (isSpeaking) {
      stopSpeech();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToRead);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silent fail
    }
  };

  const handleDownload = () => {
    const blob = new Blob([textToRead], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = documentName.replace(/\.[^.]+$/, '') + '-simplified.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const MIN_FONT = 14;
  const MAX_FONT = 26;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label="Accessibility controls"
    >
      {/* Font size */}
      <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-2 py-1 shadow-2xs">
        <Type className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        <button
          onClick={() => onFontSizeChange(Math.max(MIN_FONT, fontSize - 2))}
          disabled={fontSize <= MIN_FONT}
          aria-label="Decrease text size"
          className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95 transition-all cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 w-8 text-center" aria-live="polite">
          {fontSize}px
        </span>
        <button
          onClick={() => onFontSizeChange(Math.min(MAX_FONT, fontSize + 2))}
          disabled={fontSize >= MAX_FONT}
          aria-label="Increase text size"
          className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Read aloud */}
      {speechAvailable && (
        <button
          onClick={toggleSpeech}
          aria-label={isSpeaking ? 'Stop reading aloud' : 'Read simplified text aloud'}
          aria-pressed={isSpeaking}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer shadow-2xs ${
            isSpeaking
              ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 animate-pulse'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          {isSpeaking ? (
            <VolumeX className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          )}
          <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
        </button>
      )}

      {/* Copy */}
      <button
        onClick={handleCopy}
        aria-label="Copy simplified text to clipboard"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition-all duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer shadow-2xs"
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        ) : (
          <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        )}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>

      {/* Download */}
      <button
        onClick={handleDownload}
        aria-label="Download simplified text as a .txt file"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold transition-all duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer shadow-2xs"
      >
        <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        <span>Download .txt</span>
      </button>
    </div>
  );
};

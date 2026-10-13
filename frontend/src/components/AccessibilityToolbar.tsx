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
      <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1">
        <Type className="w-4 h-4 text-slate-500" aria-hidden="true" />
        <button
          onClick={() => onFontSizeChange(Math.max(MIN_FONT, fontSize - 2))}
          disabled={fontSize <= MIN_FONT}
          aria-label="Decrease text size"
          className="p-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-blue-600 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        <span className="text-xs font-mono text-slate-600 w-8 text-center" aria-live="polite">
          {fontSize}px
        </span>
        <button
          onClick={() => onFontSizeChange(Math.min(MAX_FONT, fontSize + 2))}
          disabled={fontSize >= MAX_FONT}
          aria-label="Increase text size"
          className="p-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-blue-600 transition-colors"
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
            isSpeaking
              ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {isSpeaking ? (
            <VolumeX className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Volume2 className="w-4 h-4" aria-hidden="true" />
          )}
          <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
        </button>
      )}

      {/* Copy */}
      <button
        onClick={handleCopy}
        aria-label="Copy simplified text to clipboard"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
        ) : (
          <Copy className="w-4 h-4" aria-hidden="true" />
        )}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>

      {/* Download */}
      <button
        onClick={handleDownload}
        aria-label="Download simplified text as a .txt file"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span>Download .txt</span>
      </button>
    </div>
  );
};

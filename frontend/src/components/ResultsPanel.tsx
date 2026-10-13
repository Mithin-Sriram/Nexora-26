import React, { useState } from 'react';
import {
  FileText,
  ListChecks,
  Zap,
  Calendar,
  BookOpen,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import type { SimplifiedDocument } from '../types/document';
import { AccessibilityToolbar } from './AccessibilityToolbar';

const LEVEL_LABELS: Record<string, string> = {
  simple: 'Simple',
  very_simple: 'Very Simple',
  detailed: 'Detailed',
};

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  const id = `section-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
          {icon}
          {title}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
        )}
      </button>
      {open && (
        <div id={id} className="px-5 py-4 border-t border-slate-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

interface ResultsPanelProps {
  result: SimplifiedDocument;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onReset: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  fontSize,
  onFontSizeChange,
  onReset,
}) => {
  const [showOriginal, setShowOriginal] = useState(false);

  const displayText = showOriginal ? result.original_text : result.simplified_text;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{result.document_name}</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Reading level:{' '}
            <span className="font-medium text-slate-700">
              {LEVEL_LABELS[result.reading_level] ?? result.reading_level}
            </span>
          </p>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Process another document
        </button>
      </div>

      {/* Summary */}
      {result.summary && (
        <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1.5">Summary</p>
          <p className="text-slate-800 leading-relaxed">{result.summary}</p>
        </div>
      )}

      {/* Accessibility toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <AccessibilityToolbar
          textToRead={result.simplified_text}
          fontSize={fontSize}
          onFontSizeChange={onFontSizeChange}
          documentName={result.document_name}
        />
        {/* Toggle original/simplified */}
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          aria-label={showOriginal ? 'Show simplified text' : 'Show original text'}
          aria-pressed={showOriginal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          {showOriginal ? (
            <ToggleRight className="w-4 h-4 text-blue-600" aria-hidden="true" />
          ) : (
            <ToggleLeft className="w-4 h-4" aria-hidden="true" />
          )}
          {showOriginal ? 'Showing Original' : 'Show Original'}
        </button>
      </div>

      {/* Main document text */}
      <Section
        title={showOriginal ? 'Original Document' : 'Simplified Document'}
        icon={<FileText className="w-4 h-4 text-blue-600" aria-hidden="true" />}
      >
        <div
          className="text-slate-700 leading-relaxed whitespace-pre-wrap"
          style={{ fontSize: `${fontSize}px` }}
          aria-live="polite"
        >
          {displayText}
        </div>
      </Section>

      {/* Key points */}
      {result.key_points.length > 0 && (
        <Section
          title="Key Points"
          icon={<ListChecks className="w-4 h-4 text-emerald-600" aria-hidden="true" />}
        >
          <ul className="space-y-2">
            {result.key_points.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-slate-700 text-sm">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Action items */}
      {result.action_items.length > 0 && (
        <Section
          title="Action Items"
          icon={<Zap className="w-4 h-4 text-amber-500" aria-hidden="true" />}
        >
          <ul className="space-y-2">
            {result.action_items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-slate-700 text-sm">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Deadlines */}
      {result.deadlines.length > 0 && (
        <Section
          title="Deadlines & Important Dates"
          icon={<Calendar className="w-4 h-4 text-red-500" aria-hidden="true" />}
        >
          <div className="space-y-2">
            {result.deadlines.map((d, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="shrink-0">
                  <time className="text-xs font-bold text-red-600">{d.date}</time>
                </div>
                <p className="text-sm text-slate-700">{d.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Difficult terms */}
      {result.difficult_terms.length > 0 && (
        <Section
          title="Glossary — Difficult Terms"
          icon={<BookOpen className="w-4 h-4 text-purple-600" aria-hidden="true" />}
          defaultOpen={false}
        >
          <dl className="space-y-3">
            {result.difficult_terms.map((t, i) => (
              <div key={i}>
                <dt className="text-sm font-semibold text-purple-700">{t.term}</dt>
                <dd className="text-sm text-slate-600 mt-0.5 ml-0">{t.explanation}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <Section
          title="Warnings & Limitations"
          icon={<AlertTriangle className="w-4 h-4 text-orange-500" aria-hidden="true" />}
        >
          <ul className="space-y-2">
            {result.warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" aria-hidden="true" />
                {w}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
};

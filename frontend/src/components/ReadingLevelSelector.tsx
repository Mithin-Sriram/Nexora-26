import React from 'react';
import type { ReadingLevel } from '../types/document';

const OPTIONS: { value: ReadingLevel; label: string; description: string }[] = [
  {
    value: 'very_simple',
    label: 'Very Simple',
    description: 'Plain everyday language for everyone',
  },
  {
    value: 'simple',
    label: 'Simple',
    description: 'Clear language, some common terms',
  },
  {
    value: 'detailed',
    label: 'Detailed',
    description: 'Thorough explanation, preserves nuance',
  },
];

interface ReadingLevelSelectorProps {
  value: ReadingLevel;
  onChange: (level: ReadingLevel) => void;
  disabled?: boolean;
}

export const ReadingLevelSelector: React.FC<ReadingLevelSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-slate-700 mb-3">
        Reading level
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`relative flex flex-col gap-0.5 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
              value === opt.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            } ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <input
              type="radio"
              name="reading-level"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              disabled={disabled}
              className="sr-only"
            />
            <span className={`text-sm font-semibold ${
              value === opt.value ? 'text-blue-700' : 'text-slate-800'
            }`}>
              {opt.label}
            </span>
            <span className="text-xs text-slate-500 leading-snug">{opt.description}</span>
            {value === opt.value && (
              <span className="sr-only"> (selected)</span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
};

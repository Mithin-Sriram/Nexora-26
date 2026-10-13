import React from 'react';
import { Check } from 'lucide-react';
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
      <legend className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
        Reading level
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup">
        {OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`relative flex flex-col justify-between gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 shadow-xs scale-[1.01]'
                  : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-2xs'
              } ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <input
                type="radio"
                name="reading-level"
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                disabled={disabled}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${
                  isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-100'
                }`}>
                  {opt.label}
                </span>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-slate-300 dark:border-slate-600'
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-1">{opt.description}</span>
              {isSelected && (
                <span className="sr-only"> (selected)</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

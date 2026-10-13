import React, { useState, useEffect, useCallback } from 'react';
import { FileSearch2, Wifi, WifiOff } from 'lucide-react';
import { DocumentInput } from './components/DocumentInput';
import { ReadingLevelSelector } from './components/ReadingLevelSelector';
import { ResultsPanel } from './components/ResultsPanel';
import { simplifyText, simplifyFile, checkHealth } from './services/documentApi';
import type { ReadingLevel, AppState, SimplifiedDocument } from './types/document';

type BackendStatus = 'checking' | 'online' | 'offline';

export const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>('simple');
  const [appState, setAppState] = useState<AppState>({ stage: 'idle' });
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);

  // Check backend health on mount
  useEffect(() => {
    checkHealth().then((ok) => setBackendStatus(ok ? 'online' : 'offline'));
  }, []);

  const hasInput = selectedFile !== null || pastedText.trim().length > 0;
  const isLoading = appState.stage === 'loading';

  const handleSubmit = useCallback(async () => {
    setValidationError(null);

    if (!hasInput) {
      setValidationError('Please upload a file or paste some text before submitting.');
      return;
    }

    setAppState({ stage: 'loading' });

    try {
      let response;
      if (selectedFile) {
        response = await simplifyFile(selectedFile, readingLevel);
      } else {
        response = await simplifyText(pastedText.trim(), readingLevel);
      }

      if (response.success && response.data) {
        setAppState({ stage: 'success', result: response.data as SimplifiedDocument });
      } else {
        setAppState({
          stage: 'error',
          message: response.message ?? 'The AI service returned an unexpected response.',
          detail: 'Please try again or use different input.',
        });
      }
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; detail?: string }; status?: number };
        request?: unknown;
        message?: string;
      };

      if (axiosErr.response) {
        const status = axiosErr.response.status;
        const msg = axiosErr.response.data?.message ?? 'The server returned an error.';
        const detail = axiosErr.response.data?.detail;
        if (status === 422) {
          setAppState({
            stage: 'error',
            message: 'The document could not be read or processed.',
            detail: detail ?? msg,
          });
        } else {
          setAppState({ stage: 'error', message: msg, detail: detail });
        }
      } else if (axiosErr.request) {
        setAppState({
          stage: 'error',
          message: 'Cannot reach the backend server.',
          detail:
            'Make sure the backend is running at http://localhost:8000.',
        });
        setBackendStatus('offline');
      } else {
        setAppState({
          stage: 'error',
          message: axiosErr.message ?? 'An unexpected error occurred.',
        });
      }
    }
  }, [hasInput, selectedFile, pastedText, readingLevel]);

  const handleReset = () => {
    setAppState({ stage: 'idle' });
    setSelectedFile(null);
    setPastedText('');
    setValidationError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200" role="banner">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <FileSearch2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg leading-none">
              AccessibleDoc AI
            </span>
          </div>

          {/* Backend status indicator */}
          <div aria-live="polite" aria-atomic="true">
            {backendStatus === 'online' && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <Wifi className="w-3.5 h-3.5" aria-hidden="true" />
                Backend online
              </span>
            )}
            {backendStatus === 'offline' && (
              <span className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                <WifiOff className="w-3.5 h-3.5" aria-hidden="true" />
                Backend offline
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {appState.stage !== 'success' && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Understand any document,{' '}
                <span className="text-blue-600">in plain language</span>
              </h1>
              <p className="mt-2 text-slate-500 text-base max-w-2xl">
                Upload a PDF or TXT, or paste text. Our AI rewrites it in clear, simple language and
                highlights key points, action items, and deadlines.
              </p>
            </div>

            {/* Offline banner */}
            {backendStatus === 'offline' && (
              <div
                role="alert"
                className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200"
              >
                <WifiOff className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-orange-800">Backend not reachable</p>
                  <p className="text-sm text-orange-700">
                    Make sure the backend server is running at{' '}
                    <code className="font-mono bg-orange-100 px-1 rounded">http://localhost:8000</code>.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm">
              {/* Document input */}
              <div>
                <h2 className="text-base font-semibold text-slate-800 mb-4">1. Add your document</h2>
                <DocumentInput
                  selectedFile={selectedFile}
                  pastedText={pastedText}
                  onFileChange={setSelectedFile}
                  onTextChange={setPastedText}
                  disabled={isLoading}
                />
              </div>

              {/* Reading level */}
              <div>
                <h2 className="text-base font-semibold text-slate-800 mb-4">2. Choose reading level</h2>
                <ReadingLevelSelector
                  value={readingLevel}
                  onChange={setReadingLevel}
                  disabled={isLoading}
                />
              </div>

              {/* Validation error */}
              {validationError && (
                <div
                  role="alert"
                  className="flex items-center gap-2 text-red-600 text-sm"
                >
                  <span className="font-medium">{validationError}</span>
                </div>
              )}

              {/* Error state */}
              {appState.stage === 'error' && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-50 border border-red-200"
                >
                  <p className="text-sm font-semibold text-red-800">{appState.message}</p>
                  {appState.detail && (
                    <p className="text-sm text-red-700 mt-1">{appState.detail}</p>
                  )}
                  <button
                    onClick={() => setAppState({ stage: 'idle' })}
                    className="mt-3 text-xs text-red-600 underline focus-visible:outline-2 focus-visible:outline-red-600 rounded"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading || !hasInput}
                aria-busy={isLoading}
                aria-disabled={isLoading || !hasInput}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
              >
                {isLoading ? (
                  <>
                    <span
                      className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin motion-reduce:animate-none"
                      role="status"
                      aria-label="Processing…"
                    />
                    Processing document…
                  </>
                ) : (
                  <>
                    <FileSearch2 className="w-5 h-5" aria-hidden="true" />
                    Simplify Document
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Results */}
        {appState.stage === 'success' && (
          <ResultsPanel
            result={appState.result}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-400">
          AccessibleDoc AI &mdash; Making documents accessible for everyone.
        </div>
      </footer>
    </div>
  );
};

export default App;

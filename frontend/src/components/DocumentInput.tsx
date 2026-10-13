import React, { useRef, useState, useCallback } from 'react';
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  File as FileIcon,
} from 'lucide-react';

const ACCEPTED_TYPES = ['.pdf', '.txt'];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocumentInputProps {
  selectedFile: File | null;
  pastedText: string;
  onFileChange: (file: File | null) => void;
  onTextChange: (text: string) => void;
  disabled?: boolean;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({
  selectedFile,
  pastedText,
  onFileChange,
  onTextChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'file' | 'text'>(
    selectedFile ? 'file' : 'text'
  );
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSet = useCallback(
    (file: File) => {
      setFileError(null);
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ACCEPTED_TYPES.includes(ext)) {
        setFileError('Only PDF and TXT files are supported.');
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        setFileError('File exceeds the 10 MB limit.');
        return;
      }
      onFileChange(file);
    },
    [onFileChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSet(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemoveFile = () => {
    onFileChange(null);
    setFileError(null);
  };

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div role="tablist" aria-label="Input method" className="flex border border-slate-200 rounded-lg overflow-hidden">
        <button
          role="tab"
          aria-selected={activeTab === 'file'}
          aria-controls="panel-file"
          id="tab-file"
          onClick={() => setActiveTab('file')}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
            activeTab === 'file'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Upload className="w-4 h-4" aria-hidden="true" />
          Upload File
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'text'}
          aria-controls="panel-text"
          id="tab-text"
          onClick={() => setActiveTab('text')}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
            activeTab === 'text'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" aria-hidden="true" />
          Paste Text
        </button>
      </div>

      {/* File upload panel */}
      {activeTab === 'file' && (
        <div
          id="panel-file"
          role="tabpanel"
          aria-labelledby="tab-file"
        >
          {!selectedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
              }`}
              onClick={() => !disabled && fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && !disabled && fileInputRef.current?.click()}
              tabIndex={disabled ? -1 : 0}
              role="button"
              aria-label="Upload a PDF or TXT file. Click or drag and drop."
            >
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" aria-hidden="true" />
              <p className="text-slate-700 font-medium text-sm">Drag &amp; drop or click to upload</p>
              <p className="text-slate-500 text-xs mt-1">Supported: PDF, TXT &bull; Max size: 10 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileInput}
                className="sr-only"
                aria-label="Choose a PDF or TXT file"
                disabled={disabled}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl bg-white">
              <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                <FileIcon className="w-5 h-5 text-blue-600" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{formatBytes(selectedFile.size)}</p>
              </div>
              <button
                onClick={handleRemoveFile}
                disabled={disabled}
                aria-label={`Remove ${selectedFile.name}`}
                className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Replace file */}
          {selectedFile && (
            <button
              onClick={() => { handleRemoveFile(); fileInputRef.current?.click(); }}
              disabled={disabled}
              className="mt-2 text-xs text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600 rounded"
            >
              Replace file
            </button>
          )}

          {fileError && (
            <div role="alert" className="flex items-center gap-2 mt-3 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{fileError}</span>
            </div>
          )}
        </div>
      )}

      {/* Paste text panel */}
      {activeTab === 'text' && (
        <div
          id="panel-text"
          role="tabpanel"
          aria-labelledby="tab-text"
        >
          <label htmlFor="paste-textarea" className="block text-sm font-medium text-slate-700 mb-1.5">
            Paste your document content
          </label>
          <textarea
            id="paste-textarea"
            value={pastedText}
            onChange={(e) => onTextChange(e.target.value)}
            disabled={disabled}
            placeholder="Paste the document text here — legal contracts, medical forms, government documents…"
            rows={10}
            className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400 transition"
          />
          <p className="mt-1 text-xs text-slate-500">
            {pastedText.length.toLocaleString()} characters
          </p>
        </div>
      )}
    </div>
  );
};

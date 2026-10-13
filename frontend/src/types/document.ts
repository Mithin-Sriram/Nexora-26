// Document types for AccessibleDoc AI
// These must match the backend API contract exactly — do not rename fields.

export type ReadingLevel = 'simple' | 'very_simple' | 'detailed';

export interface Deadline {
  date: string;
  description: string;
}

export interface DifficultTerm {
  term: string;
  explanation: string;
}

export interface SimplifiedDocument {
  document_name: string;
  original_text: string;
  simplified_text: string;
  summary: string;
  key_points: string[];
  action_items: string[];
  deadlines: Deadline[];
  difficult_terms: DifficultTerm[];
  reading_level: ReadingLevel;
  warnings: string[];
}

export interface SimplifyApiResponse {
  success: boolean;
  data: SimplifiedDocument;
  message: string;
}

export interface TextSimplifyRequest {
  text: string;
  reading_level: ReadingLevel;
}

export type AppState =
  | { stage: 'idle' }
  | { stage: 'input' }
  | { stage: 'loading' }
  | { stage: 'success'; result: SimplifiedDocument }
  | { stage: 'error'; message: string; detail?: string };

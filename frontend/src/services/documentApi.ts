import { api } from './api';
import type { SimplifyApiResponse, ReadingLevel } from '../types/document';

/**
 * Simplify pasted text via POST /api/simplify/text
 */
export async function simplifyText(
  text: string,
  reading_level: ReadingLevel
): Promise<SimplifyApiResponse> {
  const response = await api.post<SimplifyApiResponse>('/api/simplify/text', {
    text,
    reading_level,
  });
  return response.data;
}

/**
 * Simplify uploaded file via POST /api/simplify/file
 * NOTE: Do NOT set Content-Type manually — let browser/Axios handle multipart boundary.
 */
export async function simplifyFile(
  file: File,
  reading_level: ReadingLevel
): Promise<SimplifyApiResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('reading_level', reading_level);

  const response = await api.post<SimplifyApiResponse>('/api/simplify/file', formData, {
    headers: { 'Content-Type': undefined } as Record<string, string | undefined>,
    timeout: 60000, // files may take longer
  });
  return response.data;
}

/**
 * Health check via GET /health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    await api.get('/health', { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

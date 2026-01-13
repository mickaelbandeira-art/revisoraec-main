
export interface Correction {
  originalText: string;
  correctedText: string;
  reason: string;
  type: 'spelling' | 'grammar' | 'punctuation' | 'style' | 'context';
  severity: 'low' | 'medium' | 'high';
}

export interface AnalysisResponse {
  hasErrors: boolean;
  summary: string;
  corrections: Correction[];
  overallConfidence: number;
}

export interface AnalysisFile {
  file: File;
  preview: string;
  mimeType: string;
}

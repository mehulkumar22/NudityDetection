export enum AnalysisStatus {
  SAFE = 'SAFE',
  UNSAFE = 'UNSAFE',
  ERROR = 'ERROR'
}

export interface ImageAnalysisResult {
  status: AnalysisStatus;
  safeScore: number;
  unsafeScore: number;
  processTime?: number;
  modelConfidence?: number;
  error?: string;
}

export interface ImageAnalysisHistory {
  id: string;
  timestamp: Date;
  imageUrl: string;
  result: ImageAnalysisResult;
}

export interface ImageInfo {
  source: 'file' | 'url';
  url: string;
  isBlurred: boolean;
  file?: File;
}
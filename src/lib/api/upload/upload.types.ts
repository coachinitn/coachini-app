/**
 * Upload API Types
 *
 * TypeScript interfaces for file upload operations
 */

export interface FileMetadata {
  fileType: string;
  uploadedAt: string;
  tags?: string[];
  customMetadata?: Record<string, any>;
}

export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  storageStrategy: 'local' | 'mongodb' | 's3';
  uploadedBy: string;
  uploadedAt: string;
  isPublic: boolean;
  isDeleted: boolean;
  metadata: FileMetadata;
  accessToken?: string;
  expiresAt?: string;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  fileType: string;
  storageStrategy: 'local' | 'mongodb' | 's3';
  status: 'pending' | 'completed' | 'failed';
  url?: string;
  uploadedAt: string;
  tags?: string[];
  customMetadata?: Record<string, any>;
}

export interface UploadProgress {
  sessionId: string;
  filename: string;
  totalSize: number;
  uploadedSize: number;
  percentage: number;
  speed: number;
  estimatedTimeRemaining: number;
  status: 'uploading' | 'completed' | 'failed';
  lastUpdated: string;
}

export interface ChunkedUploadSession {
  sessionId: string;
  uploadUrl: string;
  chunkSize: number;
  totalChunks: number;
  expiresAt: string;
}

export interface FileSearchResult {
  files: FileUploadResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

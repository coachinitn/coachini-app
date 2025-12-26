/**
 * Upload React Query Layer
 *
 * React Query mutations and queries for file operations
 */

import { UploadService } from './upload-service';
import type { FileUploadResponse } from './upload.types';

export const uploadQueries = {
  /**
   * Mutation for single file upload
   */
  uploadSingle: () => ({
    mutationFn: (params: {
      file: File;
      options?: {
        description?: string;
        tags?: string[];
        isPublic?: boolean;
        customMetadata?: Record<string, any>;
      };
    }) => UploadService.uploadSingle(params.file, params.options)
  }),

  /**
   * Mutation for multiple file upload
   */
  uploadMultiple: () => ({
    mutationFn: (params: {
      files: File[];
      options?: { tags?: string[]; isPublic?: boolean };
    }) => UploadService.uploadMultiple(params.files, params.options)
  }),

  /**
   * Mutation for profile photo upload
   */
  uploadProfilePhoto: () => ({
    mutationFn: (params: { file: File; isPrimary?: boolean }) =>
      UploadService.uploadProfilePhoto(params.file, params.isPrimary)
  }),

  /**
   * Mutation for theme image upload
   */
  uploadThemeImage: () => ({
    mutationFn: (params: {
      file: File;
      themeId: string;
      category?: 'banner' | 'thumbnail' | 'gallery';
      isPrimary?: boolean;
    }) =>
      UploadService.uploadThemeImage(
        params.file,
        params.themeId,
        params.category,
        params.isPrimary
      )
  }),

  /**
   * Mutation for user document upload
   */
  uploadUserDocument: () => ({
    mutationFn: (params: {
      file: File;
      documentType: 'certificate' | 'resume' | 'id_document' | 'other';
      isRequired?: boolean;
      expiresAt?: Date;
    }) =>
      UploadService.uploadUserDocument(
        params.file,
        params.documentType,
        params.isRequired,
        params.expiresAt
      )
  }),

  /**
   * Mutation for session material upload
   */
  uploadSessionMaterial: () => ({
    mutationFn: (params: {
      file: File;
      sessionId: string;
      materialType: 'presentation' | 'handout' | 'resource' | 'assignment';
      accessLevel?: 'private' | 'shared' | 'public';
      displayOrder?: number;
    }) =>
      UploadService.uploadSessionMaterial(
        params.file,
        params.sessionId,
        params.materialType,
        params.accessLevel,
        params.displayOrder
      )
  }),

  /**
   * Mutation for initiating chunked upload
   */
  initiateChunkedUpload: () => ({
    mutationFn: (params: { fileName: string; fileSize: number; mimeType: string }) =>
      UploadService.initiateChunkedUpload(params.fileName, params.fileSize, params.mimeType)
  }),

  /**
   * Mutation for uploading chunk
   */
  uploadChunk: () => ({
    mutationFn: (params: { sessionId: string; chunkNumber: number; chunk: Blob }) =>
      UploadService.uploadChunk(params.sessionId, params.chunkNumber, params.chunk)
  }),

  /**
   * Mutation for completing chunked upload
   */
  completeChunkedUpload: () => ({
    mutationFn: (params: {
      sessionId: string;
      options?: {
        tags?: string[];
        isPublic?: boolean;
        customMetadata?: Record<string, any>;
      };
    }) => UploadService.completeChunkedUpload(params.sessionId, params.options)
  }),

  /**
   * Mutation for updating file metadata
   */
  updateFile: () => ({
    mutationFn: (params: {
      id: string;
      data: {
        description?: string;
        tags?: string[];
        isPublic?: boolean;
        customMetadata?: Record<string, any>;
      };
    }) => UploadService.updateFile(params.id, params.data)
  }),

  /**
   * Mutation for deleting file
   */
  deleteFile: () => ({
    mutationFn: (id: string) => UploadService.deleteFile(id)
  }),

  /**
   * Mutation for creating external reference
   */
  createExternalReference: () => ({
    mutationFn: (params: {
      externalUrl: string;
      metadata: {
        originalName: string;
        mimeType: string;
        customMetadata?: Record<string, any>;
        tags?: string[];
        isPublic?: boolean;
      };
    }) =>
      UploadService.createExternalReference(params.externalUrl, params.metadata)
  }),

  /**
   * Mutation for triggering optimization
   */
  triggerOptimization: () => ({
    mutationFn: (params: {
      id: string;
      options?: {
        uploadType?: 'profile' | 'theme' | 'general';
        customConfig?: any;
      };
    }) => UploadService.triggerOptimization(params.id, params.options)
  }),

  /**
   * Query for getting upload progress
   */
  getUploadProgress: (sessionId: string) => ({
    queryKey: ['upload', 'progress', sessionId],
    queryFn: () => UploadService.getUploadProgress(sessionId)
  }),

  /**
   * Query for searching files
   */
  searchFiles: (query?: string, page: number = 1, limit: number = 20, filters?: any) => ({
    queryKey: ['upload', 'search', { query, page, limit, ...filters }],
    queryFn: () => UploadService.searchFiles(query, page, limit, filters)
  }),

  /**
   * Query for getting file by ID
   */
  getFileById: (id: string) => ({
    queryKey: ['upload', 'file', id],
    queryFn: () => UploadService.getFileById(id)
  }),

  /**
   * Query for getting file metadata
   */
  getFileMetadata: (id: string) => ({
    queryKey: ['upload', 'metadata', id],
    queryFn: () => UploadService.getFileMetadata(id)
  }),

  /**
   * Query for getting user profile photos
   */
  getUserProfilePhotos: () => ({
    queryKey: ['upload', 'profile-photos'],
    queryFn: () => UploadService.getUserProfilePhotos()
  }),

  /**
   * Query for getting optimization status
   */
  getOptimizationStatus: (id: string) => ({
    queryKey: ['upload', 'optimization', id],
    queryFn: () => UploadService.getOptimizationStatus(id)
  })
};

/**
 * Error handling utilities
 */
export const getUploadErrorMessage = (error: any): string => {
  return UploadService.handleUploadError(error);
};

export const getUploadErrorKey = (error: any): string => {
  return UploadService.handleUploadError(error);
};

/**
 * File validation utilities
 */
export const uploadValidation = {
  validateFileSize: (
    file: File,
    maxSizeMB: number = 50
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      errors.push(`File size must not exceed ${maxSizeMB}MB`);
    }

    return { isValid: errors.length === 0, errors };
  },

  validateFileType: (
    file: File,
    allowedTypes: string[]
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors };
  },

  validateFileName: (fileName: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!fileName || fileName.trim().length === 0) {
      errors.push('File name is required');
    } else if (fileName.length > 255) {
      errors.push('File name must not exceed 255 characters');
    }

    return { isValid: errors.length === 0, errors };
  }
};

/**
 * Query keys for React Query cache management
 */
export const uploadQueryKeys = {
  all: ['upload'] as const,
  files: () => [...uploadQueryKeys.all, 'files'] as const,
  file: (id: string) => [...uploadQueryKeys.files(), id] as const,
  metadata: (id: string) => [...uploadQueryKeys.file(id), 'metadata'] as const,
  search: () => [...uploadQueryKeys.all, 'search'] as const,
  profilePhotos: () => [...uploadQueryKeys.all, 'profile-photos'] as const,
  optimization: (id: string) => [...uploadQueryKeys.file(id), 'optimization'] as const,
  progress: (sessionId: string) => [...uploadQueryKeys.all, 'progress', sessionId] as const
} as const;

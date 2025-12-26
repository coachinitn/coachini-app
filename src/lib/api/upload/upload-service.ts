/**
 * Upload API Service
 *
 * Handles file upload operations including single/multiple uploads,
 * chunked uploads, file management, and serving
 */

import { apiRequest } from '@/lib/api-client';
import { UPLOAD_ERROR_CODE_TO_I18N_MAP } from '@/lib/api/upload/error-codes';
import type {
  FileUpload,
  FileUploadResponse,
  UploadProgress,
  ChunkedUploadSession,
  FileSearchResult
} from './upload.types';

export class UploadService {
  private static readonly BASE_PATH = '/upload';

  /**
   * Upload a single file
   */
  static async uploadSingle(
    file: File,
    options?: {
      description?: string;
      tags?: string[];
      isPublic?: boolean;
      customMetadata?: Record<string, any>;
    }
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    if (options?.description) {
      formData.append('description', options.description);
    }
    if (options?.tags) {
      formData.append('tags', JSON.stringify(options.tags));
    }
    if (options?.isPublic !== undefined) {
      formData.append('isPublic', options.isPublic.toString());
    }
    if (options?.customMetadata) {
      formData.append('customMetadata', JSON.stringify(options.customMetadata));
    }

    return apiRequest<FileUploadResponse>(`${this.BASE_PATH}/single`, {
      method: 'POST',
      body: formData,
      requireAuth: true,
      isFormData: true
    });
  }

  /**
   * Upload multiple files
   */
  static async uploadMultiple(
    files: File[],
    options?: {
      tags?: string[];
      isPublic?: boolean;
    }
  ): Promise<FileUploadResponse[]> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    if (options?.tags) {
      formData.append('tags', JSON.stringify(options.tags));
    }
    if (options?.isPublic !== undefined) {
      formData.append('isPublic', options.isPublic.toString());
    }

    return apiRequest<FileUploadResponse[]>(`${this.BASE_PATH}/multiple`, {
      method: 'POST',
      body: formData,
      requireAuth: true,
      isFormData: true
    });
  }

  /**
   * Upload profile photo
   */
  static async uploadProfilePhoto(
    file: File,
    isPrimary: boolean = true
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPrimary', isPrimary.toString());

    return apiRequest<FileUploadResponse>(`${this.BASE_PATH}/profile-photo`, {
      method: 'POST',
      body: formData,
      requireAuth: true,
      isFormData: true
    });
  }

  /**
   * Upload theme image
   */
  static async uploadThemeImage(
    file: File,
    themeId: string,
    category: 'banner' | 'thumbnail' | 'gallery' = 'banner',
    isPrimary: boolean = false
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('isPrimary', isPrimary.toString());

    return apiRequest<FileUploadResponse>(`${this.BASE_PATH}/theme/${themeId}/image`, {
      method: 'POST',
      body: formData,
      requireAuth: true,
      isFormData: true
    });
  }

  /**
   * Upload user document
   */
  static async uploadUserDocument(
    file: File,
    documentType: 'certificate' | 'resume' | 'id_document' | 'other',
    isRequired: boolean = false,
    expiresAt?: Date
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('isRequired', isRequired.toString());

    if (expiresAt) {
      formData.append('expiresAt', expiresAt.toISOString());
    }

    return apiRequest<FileUploadResponse>(`${this.BASE_PATH}/user-document`, {
      method: 'POST',
      body: formData,
      requireAuth: true,
      isFormData: true
    });
  }

  /**
   * Upload session material
   */
  static async uploadSessionMaterial(
    file: File,
    sessionId: string,
    materialType: 'presentation' | 'handout' | 'resource' | 'assignment',
    accessLevel: 'private' | 'shared' | 'public' = 'shared',
    displayOrder: number = 0
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('materialType', materialType);
    formData.append('accessLevel', accessLevel);
    formData.append('displayOrder', displayOrder.toString());

    return apiRequest<FileUploadResponse>(
      `${this.BASE_PATH}/session/${sessionId}/material`,
      {
        method: 'POST',
        body: formData,
        requireAuth: true,
        isFormData: true
      }
    );
  }

  /**
   * Initiate chunked upload
   */
  static async initiateChunkedUpload(
    fileName: string,
    fileSize: number,
    mimeType: string
  ): Promise<ChunkedUploadSession> {
    return apiRequest<ChunkedUploadSession>(`${this.BASE_PATH}/chunked/initiate`, {
      method: 'POST',
      body: JSON.stringify({
        fileName,
        fileSize,
        mimeType
      }),
      requireAuth: true
    });
  }

  /**
   * Upload a chunk
   */
  static async uploadChunk(
    sessionId: string,
    chunkNumber: number,
    chunk: Blob
  ): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('sessionId', sessionId);
    formData.append('chunkNumber', chunkNumber.toString());

    return apiRequest<{ message: string }>(`${this.BASE_PATH}/chunked/upload`, {
      method: 'POST',
      body: formData,
      requireAuth: true,
      isFormData: true
    });
  }

  /**
   * Complete chunked upload
   */
  static async completeChunkedUpload(
    sessionId: string,
    options?: {
      tags?: string[];
      isPublic?: boolean;
      customMetadata?: Record<string, any>;
    }
  ): Promise<FileUploadResponse> {
    return apiRequest<FileUploadResponse>(`${this.BASE_PATH}/chunked/complete`, {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        ...options
      }),
      requireAuth: true
    });
  }

  /**
   * Get upload progress
   */
  static async getUploadProgress(sessionId: string): Promise<UploadProgress> {
    return apiRequest<UploadProgress>(`${this.BASE_PATH}/progress/${sessionId}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Search files
   */
  static async searchFiles(
    query?: string,
    page: number = 1,
    limit: number = 20,
    filters?: {
      mimeType?: string;
      fileType?: string;
      tags?: string[];
      isPublic?: boolean;
    }
  ): Promise<FileSearchResult> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(query && { search: query }),
      ...(filters?.mimeType && { mimeType: filters.mimeType }),
      ...(filters?.fileType && { fileType: filters.fileType }),
      ...(filters?.isPublic !== undefined && { isPublic: filters.isPublic.toString() })
    });

    if (filters?.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','));
    }

    return apiRequest<FileSearchResult>(`${this.BASE_PATH}/search?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Get file by ID
   */
  static async getFileById(id: string): Promise<FileUpload> {
    return apiRequest<FileUpload>(`${this.BASE_PATH}/${id}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Update file metadata
   */
  static async updateFile(
    id: string,
    data: {
      description?: string;
      tags?: string[];
      isPublic?: boolean;
      customMetadata?: Record<string, any>;
    }
  ): Promise<FileUploadResponse> {
    return apiRequest<FileUploadResponse>(`${this.BASE_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Delete file
   */
  static async deleteFile(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`${this.BASE_PATH}/${id}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }

  /**
   * Download file
   */
  static async downloadFile(id: string): Promise<Blob> {
    const response = await fetch(`/api${this.BASE_PATH}/download/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    return response.blob();
  }

  /**
   * Get user profile photos
   */
  static async getUserProfilePhotos(): Promise<FileUploadResponse[]> {
    return apiRequest<FileUploadResponse[]>(`${this.BASE_PATH}/profile-photos`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Create external URL reference
   */
  static async createExternalReference(
    externalUrl: string,
    metadata: {
      originalName: string;
      mimeType: string;
      customMetadata?: Record<string, any>;
      tags?: string[];
      isPublic?: boolean;
    }
  ): Promise<FileUploadResponse> {
    return apiRequest<FileUploadResponse>(`${this.BASE_PATH}/external`, {
      method: 'POST',
      body: JSON.stringify({
        externalUrl,
        ...metadata
      }),
      requireAuth: true
    });
  }

  /**
   * Get file metadata
   */
  static async getFileMetadata(id: string): Promise<any> {
    return apiRequest<any>(`${this.BASE_PATH}/files/${id}/metadata`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Get optimization status
   */
  static async getOptimizationStatus(id: string): Promise<any> {
    return apiRequest<any>(`${this.BASE_PATH}/${id}/optimization/status`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Trigger optimization
   */
  static async triggerOptimization(
    id: string,
    options?: {
      uploadType?: 'profile' | 'theme' | 'general';
      customConfig?: any;
    }
  ): Promise<any> {
    return apiRequest<any>(`${this.BASE_PATH}/${id}/optimization/trigger`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
      requireAuth: true
    });
  }

  /**
   * Handle API errors
   */
  static handleUploadError(error: any): string {
    if (!error.statusCode) {
      return 'errors.network';
    }

    if (error.errorCode) {
      const i18nKey = this.mapErrorCodeToI18n(error.errorCode);
      if (i18nKey) return i18nKey;
    }

    const messageMapping = this.mapErrorMessage(error.message);
    if (messageMapping) return messageMapping;

    switch (error.statusCode) {
      case 400:
        return 'errors.invalidFileData';
      case 401:
        return 'errors.unauthorized';
      case 403:
        return 'errors.forbidden';
      case 404:
        return 'errors.fileNotFound';
      case 413:
        return 'errors.fileTooLarge';
      case 422:
        return 'errors.validationFailed';
      case 500:
        return 'errors.uploadFailed';
      default:
        return 'errors.unexpected';
    }
  }

  private static mapErrorCodeToI18n(errorCode: string): string | null {
    return UPLOAD_ERROR_CODE_TO_I18N_MAP[errorCode] || null;
  }

  private static mapErrorMessage(message: string): string | null {
    if (!message || typeof message !== 'string') return null;

    const messageLower = message.toLowerCase();

    if (messageLower.includes('file size') || messageLower.includes('too large')) {
      return 'errors.fileTooLarge';
    }

    if (messageLower.includes('invalid file type') || messageLower.includes('file format')) {
      return 'errors.invalidFileType';
    }

    if (messageLower.includes('not found')) {
      return 'errors.fileNotFound';
    }

    if (messageLower.includes('quota') || messageLower.includes('storage')) {
      return 'errors.storageQuotaExceeded';
    }

    if (messageLower.includes('session') && messageLower.includes('expired')) {
      return 'errors.uploadSessionExpired';
    }

    if (messageLower.includes('chunk')) {
      return 'errors.chunkUploadFailed';
    }

    return null;
  }
}

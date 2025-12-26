/**
 * Forms API Service
 *
 * Handles all form-related API calls including CRUD operations,
 * publishing, duplication, and form submission management
 */

import { apiRequest } from '@/lib/api-client';
import { FORMS_ERROR_CODE_TO_I18N_MAP } from '@/lib/api/forms/error-codes';
import type {
  Form,
  FormCreateDto,
  FormUpdateDto,
  FormResponse,
  FormResponseSubmitDto,
  FormAnalyticsDto
} from './forms.types';

export class FormsService {
  private static readonly BASE_PATH = '/forms';

  /**
   * Create a new form
   */
  static async createForm(data: FormCreateDto): Promise<Form> {
    return apiRequest<Form>(`${this.BASE_PATH}`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Get all forms with pagination and filtering
   */
  static async getAllForms(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
      isPublic?: boolean;
      search?: string;
      createdBy?: string;
    }
  ): Promise<{
    data: Form[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.isPublic !== undefined && { isPublic: filters.isPublic.toString() }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.createdBy && { createdBy: filters.createdBy })
    });

    return apiRequest(`${this.BASE_PATH}?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Get a specific form by ID
   */
  static async getFormById(id: string): Promise<Form> {
    return apiRequest<Form>(`${this.BASE_PATH}/${id}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Get a public form without authentication
   */
  static async getPublicForm(id: string): Promise<Form> {
    return apiRequest<Form>(`${this.BASE_PATH}/public/${id}`, {
      method: 'GET',
      requireAuth: false
    });
  }

  /**
   * Update a form
   */
  static async updateForm(id: string, data: FormUpdateDto): Promise<Form> {
    return apiRequest<Form>(`${this.BASE_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Delete a form
   */
  static async deleteForm(id: string): Promise<void> {
    return apiRequest<void>(`${this.BASE_PATH}/${id}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }

  /**
   * Duplicate a form
   */
  static async duplicateForm(
    id: string,
    options?: {
      title?: string;
      includeResponses?: boolean;
      resetAnalytics?: boolean;
    }
  ): Promise<Form> {
    return apiRequest<Form>(`${this.BASE_PATH}/${id}/duplicate`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
      requireAuth: true
    });
  }

  /**
   * Publish a form
   */
  static async publishForm(id: string): Promise<Form> {
    return apiRequest<Form>(`${this.BASE_PATH}/${id}/publish`, {
      method: 'POST',
      requireAuth: true
    });
  }

  /**
   * Unpublish a form
   */
  static async unpublishForm(id: string): Promise<Form> {
    return apiRequest<Form>(`${this.BASE_PATH}/${id}/unpublish`, {
      method: 'POST',
      requireAuth: true
    });
  }

  /**
   * Submit a form response
   */
  static async submitFormResponse(
    formId: string,
    data: FormResponseSubmitDto
  ): Promise<FormResponse> {
    return apiRequest<FormResponse>(`${this.BASE_PATH}/${formId}/responses`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: false
    });
  }

  /**
   * Get form responses
   */
  static async getFormResponses(
    formId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: FormResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    return apiRequest(
      `${this.BASE_PATH}/${formId}/responses?${params.toString()}`,
      {
        method: 'GET',
        requireAuth: true
      }
    );
  }

  /**
   * Get form analytics
   */
  static async getFormAnalytics(formId: string): Promise<FormAnalyticsDto> {
    return apiRequest<FormAnalyticsDto>(
      `${this.BASE_PATH}/${formId}/analytics`,
      {
        method: 'GET',
        requireAuth: true
      }
    );
  }

  /**
   * Handle API errors
   */
  static handleFormError(error: any): string {
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
        return 'errors.invalidFormData';
      case 401:
        return 'errors.unauthorized';
      case 403:
        return 'errors.forbidden';
      case 404:
        return 'errors.formNotFound';
      case 409:
        return 'errors.formConflict';
      case 422:
        return 'errors.validationFailed';
      case 500:
        return 'errors.formProcessingFailed';
      default:
        return 'errors.unexpected';
    }
  }

  private static mapErrorCodeToI18n(errorCode: string): string | null {
    return FORMS_ERROR_CODE_TO_I18N_MAP[errorCode] || null;
  }

  private static mapErrorMessage(message: string): string | null {
    if (!message || typeof message !== 'string') return null;

    const messageLower = message.toLowerCase();

    if (messageLower.includes('not found') || messageLower.includes('does not exist')) {
      return 'errors.formNotFound';
    }

    if (messageLower.includes('already published')) {
      return 'errors.formAlreadyPublished';
    }

    if (messageLower.includes('not published')) {
      return 'errors.formNotPublished';
    }

    if (messageLower.includes('expired')) {
      return 'errors.formExpired';
    }

    if (messageLower.includes('permission') || messageLower.includes('denied') || messageLower.includes('unauthorized')) {
      return 'errors.formPermissionDenied';
    }

    if (messageLower.includes('max') && messageLower.includes('responses')) {
      return 'errors.formMaxResponsesReached';
    }

    return null;
  }
}

/**
 * Themes API Service
 *
 * Handles theme management and customization operations
 */

import { apiRequest } from '@/lib/api-client';
import { THEMES_ERROR_CODE_TO_I18N_MAP } from '@/lib/api/themes/error-codes';
import type {
  Theme,
  ThemeCreateDto,
  ThemeUpdateDto,
  ThemeSettings
} from './themes.types';

export class ThemesService {
  private static readonly BASE_PATH = '/themes';

  /**
   * Create a new theme
   */
  static async createTheme(data: ThemeCreateDto): Promise<Theme> {
    return apiRequest<Theme>(`${this.BASE_PATH}`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Get all themes
   */
  static async getAllThemes(
    page: number = 1,
    limit: number = 20,
    filters?: {
      search?: string;
      status?: string;
      createdBy?: string;
      isPublic?: boolean;
    }
  ): Promise<{
    data: Theme[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.createdBy && { createdBy: filters.createdBy }),
      ...(filters?.isPublic !== undefined && { isPublic: filters.isPublic.toString() })
    });

    return apiRequest(`${this.BASE_PATH}?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Get a specific theme by ID
   */
  static async getThemeById(id: string): Promise<Theme> {
    return apiRequest<Theme>(`${this.BASE_PATH}/${id}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Get a public theme
   */
  static async getPublicTheme(id: string): Promise<Theme> {
    return apiRequest<Theme>(`${this.BASE_PATH}/public/${id}`, {
      method: 'GET',
      requireAuth: false
    });
  }

  /**
   * Update a theme
   */
  static async updateTheme(id: string, data: ThemeUpdateDto): Promise<Theme> {
    return apiRequest<Theme>(`${this.BASE_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Delete a theme
   */
  static async deleteTheme(id: string): Promise<void> {
    return apiRequest<void>(`${this.BASE_PATH}/${id}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }

  /**
   * Duplicate a theme
   */
  static async duplicateTheme(
    id: string,
    options?: {
      name?: string;
      includeImages?: boolean;
    }
  ): Promise<Theme> {
    return apiRequest<Theme>(`${this.BASE_PATH}/${id}/duplicate`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
      requireAuth: true
    });
  }

  /**
   * Publish a theme
   */
  static async publishTheme(id: string): Promise<Theme> {
    return apiRequest<Theme>(`${this.BASE_PATH}/${id}/publish`, {
      method: 'POST',
      requireAuth: true
    });
  }

  /**
   * Unpublish a theme
   */
  static async unpublishTheme(id: string): Promise<Theme> {
    return apiRequest<Theme>(`${this.BASE_PATH}/${id}/unpublish`, {
      method: 'POST',
      requireAuth: true
    });
  }

  /**
   * Apply theme settings
   */
  static async applyThemeSettings(
    id: string,
    settings: Partial<ThemeSettings>
  ): Promise<Theme> {
    return apiRequest<Theme>(`${this.BASE_PATH}/${id}/settings`, {
      method: 'PATCH',
      body: JSON.stringify(settings),
      requireAuth: true
    });
  }

  /**
   * Get theme preview
   */
  static async getThemePreview(id: string): Promise<any> {
    return apiRequest<any>(`${this.BASE_PATH}/${id}/preview`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Handle API errors
   */
  static handleThemeError(error: any): string {
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
        return 'errors.invalidThemeData';
      case 401:
        return 'errors.unauthorized';
      case 403:
        return 'errors.forbidden';
      case 404:
        return 'errors.themeNotFound';
      case 409:
        return 'errors.themeConflict';
      case 422:
        return 'errors.validationFailed';
      case 500:
        return 'errors.themeProcessingFailed';
      default:
        return 'errors.unexpected';
    }
  }

  private static mapErrorCodeToI18n(errorCode: string): string | null {
    return THEMES_ERROR_CODE_TO_I18N_MAP[errorCode] || null;
  }

  private static mapErrorMessage(message: string): string | null {
    if (!message || typeof message !== 'string') return null;

    const messageLower = message.toLowerCase();

    if (messageLower.includes('not found') || messageLower.includes('does not exist')) {
      return 'errors.themeNotFound';
    }

    if (messageLower.includes('already published')) {
      return 'errors.themeAlreadyPublished';
    }

    if (messageLower.includes('not published')) {
      return 'errors.themeNotPublished';
    }

    if (messageLower.includes('permission') || messageLower.includes('denied')) {
      return 'errors.themePermissionDenied';
    }

    if (messageLower.includes('color') || messageLower.includes('invalid')) {
      return 'errors.invalidColorValue';
    }

    return null;
  }
}

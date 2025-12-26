/**
 * Themes React Query Layer
 *
 * React Query mutations and queries for theme operations
 */

import { ThemesService } from './themes-service';
import type {
  ThemeCreateDto,
  ThemeUpdateDto,
  ThemeSettings
} from './themes.types';

export const themesQueries = {
  /**
   * Mutation for creating a new theme
   */
  createTheme: () => ({
    mutationFn: (data: ThemeCreateDto) => ThemesService.createTheme(data)
  }),

  /**
   * Mutation for updating a theme
   */
  updateTheme: () => ({
    mutationFn: (params: { id: string; data: ThemeUpdateDto }) =>
      ThemesService.updateTheme(params.id, params.data)
  }),

  /**
   * Mutation for deleting a theme
   */
  deleteTheme: () => ({
    mutationFn: (id: string) => ThemesService.deleteTheme(id)
  }),

  /**
   * Mutation for duplicating a theme
   */
  duplicateTheme: () => ({
    mutationFn: (params: {
      id: string;
      options?: { name?: string; includeImages?: boolean };
    }) => ThemesService.duplicateTheme(params.id, params.options)
  }),

  /**
   * Mutation for publishing a theme
   */
  publishTheme: () => ({
    mutationFn: (id: string) => ThemesService.publishTheme(id)
  }),

  /**
   * Mutation for unpublishing a theme
   */
  unpublishTheme: () => ({
    mutationFn: (id: string) => ThemesService.unpublishTheme(id)
  }),

  /**
   * Mutation for applying theme settings
   */
  applyThemeSettings: () => ({
    mutationFn: (params: { id: string; settings: Partial<ThemeSettings> }) =>
      ThemesService.applyThemeSettings(params.id, params.settings)
  }),

  /**
   * Query for getting all themes
   */
  getAllThemes: (page: number = 1, limit: number = 20, filters?: any) => ({
    queryKey: ['themes', 'list', { page, limit, ...filters }],
    queryFn: () => ThemesService.getAllThemes(page, limit, filters)
  }),

  /**
   * Query for getting a specific theme
   */
  getThemeById: (id: string) => ({
    queryKey: ['themes', id],
    queryFn: () => ThemesService.getThemeById(id)
  }),

  /**
   * Query for getting a public theme
   */
  getPublicTheme: (id: string) => ({
    queryKey: ['themes', 'public', id],
    queryFn: () => ThemesService.getPublicTheme(id)
  }),

  /**
   * Query for getting theme preview
   */
  getThemePreview: (id: string) => ({
    queryKey: ['themes', id, 'preview'],
    queryFn: () => ThemesService.getThemePreview(id)
  })
};

/**
 * Error handling utilities
 */
export const getThemeErrorMessage = (error: any): string => {
  return ThemesService.handleThemeError(error);
};

export const getThemeErrorKey = (error: any): string => {
  return ThemesService.handleThemeError(error);
};

/**
 * Theme validation utilities
 */
export const themesValidation = {
  validateThemeName: (name: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Theme name is required');
    } else if (name.trim().length < 2) {
      errors.push('Theme name must be at least 2 characters');
    } else if (name.trim().length > 100) {
      errors.push('Theme name must not exceed 100 characters');
    }

    return { isValid: errors.length === 0, errors };
  },

  validateColorValue: (color: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!color || color.trim().length === 0) {
      errors.push('Color value is required');
    } else if (!/^#[0-9A-F]{6}$/i.test(color)) {
      errors.push('Color must be a valid hex value (e.g., #FFFFFF)');
    }

    return { isValid: errors.length === 0, errors };
  }
};

/**
 * Query keys for React Query cache management
 */
export const themesQueryKeys = {
  all: ['themes'] as const,
  lists: () => [...themesQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...themesQueryKeys.lists(), { filters }] as const,
  details: () => [...themesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...themesQueryKeys.details(), id] as const,
  public: () => [...themesQueryKeys.all, 'public'] as const,
  publicDetail: (id: string) => [...themesQueryKeys.public(), id] as const,
  preview: (id: string) => [...themesQueryKeys.detail(id), 'preview'] as const
} as const;

/**
 * Themes Error Codes
 *
 * Shared error codes between backend and frontend for consistent i18n mapping
 */

export const THEMES_ERROR_CODES = {
  THEME_NOT_FOUND: 'THEME_NOT_FOUND',
  THEME_INVALID: 'THEME_INVALID',
  THEME_ARCHIVED: 'THEME_ARCHIVED',
  THEME_ALREADY_PUBLISHED: 'THEME_ALREADY_PUBLISHED',
  DUPLICATE_THEME: 'DUPLICATE_THEME',
  INVALID_COLOR: 'INVALID_COLOR',
  INVALID_THEME_DATA: 'INVALID_THEME_DATA',
  THEME_IN_USE: 'THEME_IN_USE',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
} as const;

export const THEMES_ERROR_CODE_TO_I18N_MAP: Record<string, string> = {
  [THEMES_ERROR_CODES.THEME_NOT_FOUND]: 'errors.themeNotFound',
  [THEMES_ERROR_CODES.THEME_INVALID]: 'errors.invalidThemeData',
  [THEMES_ERROR_CODES.THEME_ARCHIVED]: 'errors.themeArchived',
  [THEMES_ERROR_CODES.THEME_ALREADY_PUBLISHED]: 'errors.themeAlreadyPublished',
  [THEMES_ERROR_CODES.DUPLICATE_THEME]: 'errors.duplicateTheme',
  [THEMES_ERROR_CODES.INVALID_COLOR]: 'errors.invalidColor',
  [THEMES_ERROR_CODES.INVALID_THEME_DATA]: 'errors.invalidThemeData',
  [THEMES_ERROR_CODES.THEME_IN_USE]: 'errors.themeInUse',
  [THEMES_ERROR_CODES.PERMISSION_DENIED]: 'errors.permissionDenied',
};

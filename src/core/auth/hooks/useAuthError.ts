/**
 * 🌐 Auth Error Hook with i18n Support
 *
 * Provides translated error messages for authentication errors
 */

import { useTranslations } from 'next-intl';
import { getAuthErrorKey } from '@/lib/api/auth';

/**
 * Hook for handling auth errors with i18n translation
 */
export function useAuthError() {
  const t = useTranslations('common.auth');

  /**
   * Get translated error message from error object
   */
  const getErrorMessage = (error: any): string => {
    if (!error) return '';

    // Get the i18n key for the error
    const errorKey = getAuthErrorKey(error);

    // Try to translate the error key
    const translatedMessage = t(errorKey);

    // If translation key is the same as the result, it means no translation was found
    // Fall back to the original error message or a generic message
    if (translatedMessage === errorKey) {
      return error.message || t('errors.unexpected');
    }

    return translatedMessage;
  };

  /**
   * Get translated success message
   */
  const getSuccessMessage = (key: string): string => {
    return t(`success.${key}`);
  };

  /**
   * Check if error indicates user should be redirected
   */
  const shouldRedirect = (error: any): { redirect: boolean; path?: string } => {
    if (!error) return { redirect: false };

    const errorKey = getAuthErrorKey(error);

    switch (errorKey) {
      case 'errors.noActiveResetRequest':
        return { redirect: true, path: '/auth/forgot-password' };
      case 'errors.sessionExpired':
      case 'errors.unauthorized':
        return { redirect: true, path: '/auth/login' };
      case 'errors.emailNotVerified':
        return { redirect: true, path: '/auth/verify-email' };
      default:
        return { redirect: false };
    }
  };

  return {
    getErrorMessage,
    getSuccessMessage,
    shouldRedirect,
  };
}
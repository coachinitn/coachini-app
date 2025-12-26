/**
 * 🔐 Authentication React Query Layer
 *
 * React Query mutations for password reset functionality
 * Follows the demo-requests pattern for consistency
 */

import { AuthService } from './auth-service';
import type {
  ResetPasswordDto,
  ChangePasswordDto
} from './auth.types';

/**
 * React Query mutation objects for authentication
 * Following the pattern established in demo-requests.ts
 */
export const authQueries = {
  /**
   * Mutation for requesting password reset email
   */
  forgotPassword: () => ({
    mutationFn: (email: string) => AuthService.forgotPassword(email),
  }),

  /**
   * Mutation for resending password reset email
   * Rate limited to 2 minutes between attempts
   */
  resendPasswordReset: () => ({
    mutationFn: (email: string) => AuthService.resendPasswordReset(email),
  }),

  /**
   * Mutation for resetting password with token
   */
  resetPassword: () => ({
    mutationFn: (data: ResetPasswordDto) => AuthService.resetPassword(data),
  }),

  /**
   * Mutation for changing password (authenticated users)
   */
  changePassword: () => ({
    mutationFn: (data: ChangePasswordDto) => AuthService.changePassword(data),
  }),
};

/**
 * Utility functions for error handling
 */
export const getAuthErrorMessage = (error: any): string => {
  return AuthService.handleAuthError(error);
};

/**
 * Get i18n key for auth error
 * Use this with useTranslation hook for proper i18n support
 */
export const getAuthErrorKey = (error: any): string => {
  return AuthService.handleAuthError(error);
};

/**
 * Validation utilities
 */
export const authValidation = {
  validateEmail: AuthService.validateEmail,
  validatePassword: AuthService.validatePassword,
  validateResetToken: AuthService.validateResetToken,
};

/**
 * Query keys for React Query cache management
 * Following React Query best practices
 */
export const authQueryKeys = {
  all: ['auth'] as const,
  passwordReset: () => [...authQueryKeys.all, 'password-reset'] as const,
  resetToken: (token: string) => [...authQueryKeys.passwordReset(), token] as const,
} as const;
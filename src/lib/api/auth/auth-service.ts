/**
 * 🔐 Authentication API Service
 *
 * Handles password reset and authentication-related API calls
 * Uses existing apiClient with requireAuth: false for public endpoints
 */

import { apiRequest } from '@/lib/api-client';
import { ERROR_CODE_TO_I18N_MAP } from '@/lib/api/auth/error-codes';
import type {
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  MessageResponse
} from './auth.types';

/**
 * Authentication Service
 * Provides methods for password reset functionality
 */
export class AuthService {
  private static readonly BASE_PATH = '/auth';

  /**
   * Request password reset email
   * Public endpoint - no authentication required
   */
  static async forgotPassword(email: string): Promise<MessageResponse> {
    const requestData: ForgotPasswordDto = { email };

    return apiRequest<MessageResponse>(`${this.BASE_PATH}/forgot-password`, {
      method: 'POST',
      body: JSON.stringify(requestData),
      requireAuth: false // Key: use existing client without authentication
    });
  }

  /**
   * Resend password reset email
   * Public endpoint with rate limiting (2 minutes between attempts)
   */
  static async resendPasswordReset(email: string): Promise<MessageResponse> {
    const requestData: ForgotPasswordDto = { email };

    return apiRequest<MessageResponse>(`${this.BASE_PATH}/resend-password-reset`, {
      method: 'POST',
      body: JSON.stringify(requestData),
      requireAuth: false
    });
  }

  /**
   * Reset password using token from email
   * Public endpoint - token validation handled by backend
   */
  static async resetPassword(data: ResetPasswordDto): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`${this.BASE_PATH}/reset-password`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: false
    });
  }

  /**
   * Change password for authenticated user
   * Requires authentication
   */
  static async changePassword(data: ChangePasswordDto): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`${this.BASE_PATH}/change-password`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true // This endpoint requires authentication
    });
  }

  /**
   * Validate reset token format (client-side validation)
   * Basic validation before making API call
   */
  static validateResetToken(token: string | null): boolean {
    if (!token) return false;

    // Basic token format validation
    // Backend tokens are typically UUIDs or long random strings
    return token.length >= 32 && /^[a-zA-Z0-9-_]+$/.test(token);
  }

  /**
   * Validate email format (client-side validation)
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength (client-side validation)
   * Simple validation matching backend: only length constraints
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (password.length > 128) {
      errors.push('Password must not exceed 128 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Handle API errors and provide user-friendly messages
   * Returns error key for i18n translation
   */
  static handleAuthError(error: any): string {
    // Handle network errors
    if (!error.statusCode) {
      return 'errors.network';
    }

    // First try to use the backend error code if available
    if (error.errorCode) {
      const i18nKey = this.mapErrorCodeToI18n(error.errorCode);
      if (i18nKey) return i18nKey;
    }

    // Fallback to message mapping
    const messageMapping = this.mapErrorMessage(error.message);
    if (messageMapping) return messageMapping;

    // Fallback to status code mapping
    switch (error.statusCode) {
      case 400:
        return 'errors.invalidCredentials';
      case 401:
        return 'errors.unauthorized';
      case 403:
        return 'errors.forbidden';
      case 404:
        return 'errors.notFound';
      case 429:
        return 'errors.tooManyRequests';
      case 500:
        return 'errors.server';
      default:
        return 'errors.unexpected';
    }
  }

  /**
   * Map backend error codes to i18n keys using centralized mapping
   */
  private static mapErrorCodeToI18n(errorCode: string): string | null {
    return ERROR_CODE_TO_I18N_MAP[errorCode] || null;
  }

  /**
   * Map backend error messages to i18n keys
   */
  private static mapErrorMessage(message: string): string | null {
    if (!message) return null;

    const messageLower = message.toLowerCase();

    // Password reset specific errors
    if (messageLower.includes('invalid or expired reset token') ||
        messageLower.includes('invalid reset token')) {
      return 'errors.invalidToken';
    }

    if (messageLower.includes('expired') && messageLower.includes('token')) {
      return 'errors.tokenExpired';
    }

    if (messageLower.includes('passwords do not match') ||
        messageLower.includes('password mismatch')) {
      return 'errors.passwordsDoNotMatch';
    }

    if (messageLower.includes('password must be at least') ||
        messageLower.includes('too short')) {
      return 'errors.passwordTooShort';
    }

    if (messageLower.includes('password must not exceed') ||
        messageLower.includes('too long')) {
      return 'errors.passwordTooLong';
    }

    if (messageLower.includes('active reset request') ||
        messageLower.includes('no active request')) {
      return 'errors.noActiveResetRequest';
    }

    if (messageLower.includes('too many') && messageLower.includes('reset')) {
      return 'errors.rateLimitExceeded';
    }

    // Login specific errors
    if (messageLower.includes('invalid credentials') ||
        messageLower.includes('invalid email or password') ||
        messageLower.includes('authentication failed')) {
      return 'errors.invalidCredentials';
    }

    if (messageLower.includes('account locked') ||
        messageLower.includes('temporarily locked')) {
      return 'errors.accountLocked';
    }

    if (messageLower.includes('email not verified') ||
        messageLower.includes('verify your email')) {
      return 'errors.emailNotVerified';
    }

    if (messageLower.includes('two-factor') || messageLower.includes('2fa')) {
      if (messageLower.includes('required')) {
        return 'errors.twoFactorRequired';
      }
      if (messageLower.includes('invalid')) {
        return 'errors.invalidTwoFactorCode';
      }
    }

    if (messageLower.includes('session expired') ||
        messageLower.includes('token expired')) {
      return 'errors.sessionExpired';
    }

    // Validation errors
    if (messageLower.includes('valid email') ||
        messageLower.includes('invalid email')) {
      return 'errors.invalidEmail';
    }

    if (messageLower.includes('email') && messageLower.includes('required')) {
      return 'errors.emailRequired';
    }

    if (messageLower.includes('password') && messageLower.includes('required')) {
      return 'errors.passwordRequired';
    }

    // Return null if no mapping found - will use fallback
    return null;
  }
}
/**
 * 🌐 Auth Error Codes - Frontend Types
 * 
 * Shared error codes between backend and frontend for consistent i18n mapping
 * These should match the error codes defined in the backend auth.http.ts
 */

/**
 * Auth Error Codes returned by the backend
 * Used for mapping to i18n translation keys
 */
export const AUTH_ERROR_CODES = {
  // Authentication Errors (401)
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  SESSION_EXPIRED: 'SESSION_EXPIRED',

  // Password Reset Errors (400/401)
  RESET_TOKEN_INVALID: 'RESET_TOKEN_INVALID',
  RESET_TOKEN_EXPIRED: 'RESET_TOKEN_EXPIRED',
  NO_ACTIVE_RESET_REQUEST: 'NO_ACTIVE_RESET_REQUEST',

  // Validation Errors (400)
  PASSWORDS_DO_NOT_MATCH: 'PASSWORDS_DO_NOT_MATCH',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  PASSWORD_TOO_LONG: 'PASSWORD_TOO_LONG',
  INVALID_EMAIL: 'INVALID_EMAIL',
  EMAIL_REQUIRED: 'EMAIL_REQUIRED',
  PASSWORD_REQUIRED: 'PASSWORD_REQUIRED',

  // Account Status Errors (403/400)
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',

  // Rate Limiting (429)
  RATE_LIMIT_PASSWORD_RESET: 'RATE_LIMIT_PASSWORD_RESET',
  RATE_LIMIT_LOGIN: 'RATE_LIMIT_LOGIN',

  // Two-Factor Authentication
  TWO_FACTOR_REQUIRED: 'TWO_FACTOR_REQUIRED',
  TWO_FACTOR_INVALID: 'TWO_FACTOR_INVALID',

  // User Not Found (handled carefully to prevent enumeration)
  USER_NOT_FOUND: 'USER_NOT_FOUND',
} as const;

/**
 * Auth Success Codes returned by the backend
 */
export const AUTH_SUCCESS_CODES = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  PASSWORD_RESET_SENT: 'PASSWORD_RESET_SENT',
  PASSWORD_RESET_SUCCESS: 'PASSWORD_RESET_SUCCESS',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  EMAIL_VERIFIED: 'EMAIL_VERIFIED',
  REGISTRATION_SUCCESS: 'REGISTRATION_SUCCESS',
} as const;

/**
 * Type definitions
 */
export type AuthErrorCode = keyof typeof AUTH_ERROR_CODES;
export type AuthSuccessCode = keyof typeof AUTH_SUCCESS_CODES;

/**
 * Error code to i18n key mapping
 * Maps backend error codes to frontend translation keys
 */
export const ERROR_CODE_TO_I18N_MAP: Record<string, string> = {
  // Authentication errors
  [AUTH_ERROR_CODES.INVALID_CREDENTIALS]: 'errors.invalidCredentials',
  [AUTH_ERROR_CODES.AUTHENTICATION_REQUIRED]: 'errors.unauthorized',
  [AUTH_ERROR_CODES.TOKEN_EXPIRED]: 'errors.tokenExpired',
  [AUTH_ERROR_CODES.TOKEN_INVALID]: 'errors.invalidToken',
  [AUTH_ERROR_CODES.SESSION_EXPIRED]: 'errors.sessionExpired',

  // Password reset errors
  [AUTH_ERROR_CODES.RESET_TOKEN_INVALID]: 'errors.invalidToken',
  [AUTH_ERROR_CODES.RESET_TOKEN_EXPIRED]: 'errors.tokenExpired',
  [AUTH_ERROR_CODES.NO_ACTIVE_RESET_REQUEST]: 'errors.noActiveResetRequest',

  // Validation errors
  [AUTH_ERROR_CODES.PASSWORDS_DO_NOT_MATCH]: 'errors.passwordsDoNotMatch',
  [AUTH_ERROR_CODES.PASSWORD_TOO_SHORT]: 'errors.passwordTooShort',
  [AUTH_ERROR_CODES.PASSWORD_TOO_LONG]: 'errors.passwordTooLong',
  [AUTH_ERROR_CODES.INVALID_EMAIL]: 'errors.invalidEmail',
  [AUTH_ERROR_CODES.EMAIL_REQUIRED]: 'errors.emailRequired',
  [AUTH_ERROR_CODES.PASSWORD_REQUIRED]: 'errors.passwordRequired',

  // Account status errors
  [AUTH_ERROR_CODES.ACCOUNT_LOCKED]: 'errors.accountLocked',
  [AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED]: 'errors.emailNotVerified',

  // Rate limiting
  [AUTH_ERROR_CODES.RATE_LIMIT_PASSWORD_RESET]: 'errors.rateLimitExceeded',
  [AUTH_ERROR_CODES.RATE_LIMIT_LOGIN]: 'errors.tooManyRequests',

  // Two-factor authentication
  [AUTH_ERROR_CODES.TWO_FACTOR_REQUIRED]: 'errors.twoFactorRequired',
  [AUTH_ERROR_CODES.TWO_FACTOR_INVALID]: 'errors.invalidTwoFactorCode',

  // User not found
  [AUTH_ERROR_CODES.USER_NOT_FOUND]: 'errors.userNotFound',
};

/**
 * Success code to i18n key mapping
 */
export const SUCCESS_CODE_TO_I18N_MAP: Record<string, string> = {
  [AUTH_SUCCESS_CODES.LOGIN_SUCCESS]: 'success.loginSuccess',
  [AUTH_SUCCESS_CODES.LOGOUT_SUCCESS]: 'success.logoutSuccess',
  [AUTH_SUCCESS_CODES.PASSWORD_RESET_SENT]: 'success.passwordResetSent',
  [AUTH_SUCCESS_CODES.PASSWORD_RESET_SUCCESS]: 'success.passwordResetSuccess',
  [AUTH_SUCCESS_CODES.PASSWORD_CHANGED]: 'success.passwordChanged',
  [AUTH_SUCCESS_CODES.EMAIL_VERIFIED]: 'success.emailVerified',
  [AUTH_SUCCESS_CODES.REGISTRATION_SUCCESS]: 'success.registrationSuccess',
};

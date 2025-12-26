/**
 * 🔐 Authentication API Types
 *
 * TypeScript interfaces for authentication-related API calls
 */

// ============================================================================
// 🔑 PASSWORD MANAGEMENT TYPES
// ============================================================================

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================================
// 📧 API RESPONSE TYPES
// ============================================================================

export interface MessageResponse {
  message: string;
  success: boolean;
}

export interface AuthError {
  message: string;
  statusCode: number;
  error: string;
  details?: {
    field?: string;
    code?: string;
  };
}

// ============================================================================
// 🔄 PASSWORD RESET FLOW TYPES
// ============================================================================

export interface PasswordResetFormState {
  email: string;
  loading: boolean;
  success: boolean;
  error: string | null;
  canResend: boolean;
  resendCooldown: number;
}

export interface ResetPasswordFormState {
  password: string;
  confirmPassword: string;
  loading: boolean;
  success: boolean;
  error: string | null;
  token: string | null;
  isValidToken: boolean;
}

// ============================================================================
// 🕒 RETRY LOGIC TYPES
// ============================================================================

export interface RetryState {
  lastAttemptTime: number;
  attemptCount: number;
  canRetry: boolean;
  remainingTime: number;
}

export interface RetryConfig {
  maxAttempts: number;
  cooldownMs: number;
  storageKey: string;
}

// ============================================================================
// 🎯 HOOK RETURN TYPES
// ============================================================================

export interface UseForgotPasswordReturn {
  // State
  formState: PasswordResetFormState;

  // Actions
  sendResetEmail: (email: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;

  // Loading states
  isSending: boolean;
}

export interface UseCheckEmailReturn {
  // State
  email: string | null;
  canResend: boolean;
  remainingTime: number;

  // Actions
  resendEmail: () => Promise<void>;

  // Loading states
  isResending: boolean;
  error: string | null;
}

export interface UseResetPasswordReturn {
  // State
  token: string | null;
  isValidToken: boolean;

  // Actions
  resetPassword: (password: string, confirmPassword: string) => Promise<void>;

  // Loading states
  isResetting: boolean;
  error: string | null;
  success: boolean;
}
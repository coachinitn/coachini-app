/**
 * 🔐 Authentication API Module
 *
 * Clean exports for authentication functionality
 */

// Service layer
export { AuthService } from './auth-service';

// React Query layer
export {
  authQueries,
  getAuthErrorMessage,
  getAuthErrorKey,
  authValidation,
  authQueryKeys
} from './auth-queries';

// Types
export type {
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  MessageResponse,
  AuthError,
  PasswordResetFormState,
  ResetPasswordFormState,
  RetryState,
  RetryConfig,
  UseForgotPasswordReturn,
  UseCheckEmailReturn,
  UseResetPasswordReturn
} from './auth.types';
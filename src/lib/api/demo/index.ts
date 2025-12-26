/**
 * 🎯 Demo Request API Module
 *
 * Clean exports for demo request functionality
 * Follows the same pattern as the auth API module
 */

// Service layer
export { DemoRequestService } from './demo-requests';

// React Query layer
export {
  demoRequestQueries,
  getDemoRequestErrorMessage,
  getDemoRequestErrorKey,
  demoRequestValidation,
  demoRequestQueryKeys
} from './demo-requests';

// Types
export type {
  DemoRequest,
  DemoRequestType,
  DemoRequestStatus,
  BusinessDemoRequestFormData,
  CoachDemoRequestFormData,
  CreateBusinessDemoRequestDto,
  CreateCoachDemoRequestDto,
  COMPANY_SIZE_OPTIONS,
  BUSINESS_TYPE_OPTIONS
} from './demo-request.types';

// Error codes and mapping
export {
  DEMO_REQUEST_ERROR_CODES,
  DEMO_REQUEST_SUCCESS_CODES,
  DEMO_REQUEST_ERROR_CODE_TO_I18N_MAP,
  DEMO_REQUEST_SUCCESS_CODE_TO_I18N_MAP,
  type DemoRequestErrorCode,
  type DemoRequestSuccessCode
} from './error-codes';
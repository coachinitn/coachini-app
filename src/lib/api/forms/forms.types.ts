/**
 * Forms API Types
 *
 * TypeScript interfaces for form-related API operations
 */

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'checkbox' | 'radio' | 'select' | 'textarea' | 'file' | 'date';
  required: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: Record<string, any>;
  order: number;
}

export interface FormSettings {
  showProgressBar?: boolean;
  allowSaveAndContinue?: boolean;
  shuffleFields?: boolean;
  showFieldNumbers?: boolean;
  customCss?: string;
  customJs?: string;
  redirectUrl?: string;
  confirmationMessage?: string;
  emailNotifications?: {
    notifyOnSubmission?: boolean;
    notifyEmail?: string;
  };
  submissionLimits?: {
    maxSubmissions?: number;
    maxSubmissionsPerUser?: number;
  };
  styling?: {
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
  };
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived' | 'closed';
  isPublic: boolean;
  allowAnonymous: boolean;
  allowMultipleSubmissions: boolean;
  requireAuthentication: boolean;
  expiresAt?: string;
  fields: FormField[];
  settings?: FormSettings;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  responseCount: number;
  totalViews: number;
}

export interface FormCreateDto {
  title: string;
  description?: string;
  status?: 'draft' | 'published';
  isPublic?: boolean;
  allowAnonymous?: boolean;
  allowMultipleSubmissions?: boolean;
  requireAuthentication?: boolean;
  expiresAt?: string;
  fields?: FormField[];
  settings?: Partial<FormSettings>;
}

export interface FormUpdateDto {
  title?: string;
  description?: string;
  isPublic?: boolean;
  allowAnonymous?: boolean;
  allowMultipleSubmissions?: boolean;
  requireAuthentication?: boolean;
  expiresAt?: string;
  fields?: FormField[];
  settings?: Partial<FormSettings>;
}

export interface FormFieldResponse {
  fieldId: string;
  value: any;
  fileIds?: string[];
}

export interface FormResponse {
  id: string;
  formId: string;
  respondentId?: string;
  respondentEmail?: string;
  fieldResponses: FormFieldResponse[];
  isComplete: boolean;
  submittedAt: string;
  metadata?: Record<string, any>;
}

export interface FormResponseSubmitDto {
  respondentEmail?: string;
  fieldResponses: FormFieldResponse[];
  isComplete?: boolean;
  metadata?: Record<string, any>;
}

export interface FormAnalyticsDto {
  formId: string;
  totalResponses: number;
  completedResponses: number;
  incompleteResponses: number;
  averageCompletionTime: number;
  completionRate: number;
  fieldAnalytics: Array<{
    fieldId: string;
    fieldLabel: string;
    responseCount: number;
    responseData: Record<string, any>;
  }>;
  startDate: string;
  endDate: string;
}

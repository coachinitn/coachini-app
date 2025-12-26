/**
 * Forms React Query Layer
 *
 * React Query mutations and queries for form operations
 * Follows the established pattern from auth and demo modules
 */

import { FormsService } from './forms-service';
import type {
  FormCreateDto,
  FormUpdateDto,
  FormResponseSubmitDto
} from './forms.types';

export const formsQueries = {
  /**
   * Mutation for creating a new form
   */
  createForm: () => ({
    mutationFn: (data: FormCreateDto) => FormsService.createForm(data)
  }),

  /**
   * Mutation for updating a form
   */
  updateForm: () => ({
    mutationFn: (params: { id: string; data: FormUpdateDto }) =>
      FormsService.updateForm(params.id, params.data)
  }),

  /**
   * Mutation for deleting a form
   */
  deleteForm: () => ({
    mutationFn: (id: string) => FormsService.deleteForm(id)
  }),

  /**
   * Mutation for duplicating a form
   */
  duplicateForm: () => ({
    mutationFn: (params: {
      id: string;
      options?: { title?: string; includeResponses?: boolean; resetAnalytics?: boolean };
    }) => FormsService.duplicateForm(params.id, params.options)
  }),

  /**
   * Mutation for publishing a form
   */
  publishForm: () => ({
    mutationFn: (id: string) => FormsService.publishForm(id)
  }),

  /**
   * Mutation for unpublishing a form
   */
  unpublishForm: () => ({
    mutationFn: (id: string) => FormsService.unpublishForm(id)
  }),

  /**
   * Mutation for submitting a form response
   */
  submitFormResponse: () => ({
    mutationFn: (params: { formId: string; data: FormResponseSubmitDto }) =>
      FormsService.submitFormResponse(params.formId, params.data)
  }),

  /**
   * Query for fetching all forms
   */
  getAllForms: (page: number = 1, limit: number = 20, filters?: any) => ({
    queryKey: ['forms', 'list', { page, limit, ...filters }],
    queryFn: () => FormsService.getAllForms(page, limit, filters)
  }),

  /**
   * Query for fetching a specific form
   */
  getFormById: (id: string) => ({
    queryKey: ['forms', id],
    queryFn: () => FormsService.getFormById(id)
  }),

  /**
   * Query for fetching a public form
   */
  getPublicForm: (id: string) => ({
    queryKey: ['forms', 'public', id],
    queryFn: () => FormsService.getPublicForm(id)
  }),

  /**
   * Query for fetching form responses
   */
  getFormResponses: (formId: string, page: number = 1, limit: number = 20) => ({
    queryKey: ['forms', formId, 'responses', { page, limit }],
    queryFn: () => FormsService.getFormResponses(formId, page, limit)
  }),

  /**
   * Query for fetching form analytics
   */
  getFormAnalytics: (formId: string) => ({
    queryKey: ['forms', formId, 'analytics'],
    queryFn: () => FormsService.getFormAnalytics(formId)
  })
};

/**
 * Error handling utilities for forms
 */
export const getFormErrorMessage = (error: any): string => {
  return FormsService.handleFormError(error);
};

export const getFormErrorKey = (error: any): string => {
  return FormsService.handleFormError(error);
};

/**
 * Form validation utilities
 */
export const formsValidation = {
  validateFormTitle: (title: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push('Form title is required');
    } else if (title.trim().length < 3) {
      errors.push('Form title must be at least 3 characters');
    } else if (title.trim().length > 255) {
      errors.push('Form title must not exceed 255 characters');
    }

    return { isValid: errors.length === 0, errors };
  },

  validateFormDescription: (description?: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (description && description.trim().length > 1000) {
      errors.push('Form description must not exceed 1000 characters');
    }

    return { isValid: errors.length === 0, errors };
  }
};

/**
 * Query keys for React Query cache management
 */
export const formsQueryKeys = {
  all: ['forms'] as const,
  lists: () => [...formsQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...formsQueryKeys.lists(), { filters }] as const,
  details: () => [...formsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...formsQueryKeys.details(), id] as const,
  public: () => [...formsQueryKeys.all, 'public'] as const,
  publicDetail: (id: string) => [...formsQueryKeys.public(), id] as const,
  responses: (formId: string) => [...formsQueryKeys.detail(formId), 'responses'] as const,
  analytics: (formId: string) => [...formsQueryKeys.detail(formId), 'analytics'] as const
} as const;

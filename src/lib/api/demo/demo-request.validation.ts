import { z } from 'zod';
import { 
  businessDemoRequestSchema, 
  coachDemoRequestSchema,
  BusinessDemoRequestFormData,
  CoachDemoRequestFormData 
} from './demo-request.types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates business demo request form data using Zod schema
 */
export function validateBusinessDemoForm(data: Partial<BusinessDemoRequestFormData>): ValidationResult {
  try {
    // Ensure data is not null/undefined
    const safeData = data || {};
    businessDemoRequestSchema.parse(safeData);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

/**
 * Validates coach demo request form data using Zod schema
 */
export function validateCoachDemoForm(data: Partial<CoachDemoRequestFormData>): ValidationResult {
  try {
    // Ensure data is not null/undefined
    const safeData = data || {};
    coachDemoRequestSchema.parse(safeData);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

/**
 * Validates specific fields of business demo request form
 */
export function validateBusinessDemoFormFields(
  data: Partial<BusinessDemoRequestFormData>, 
  fields: (keyof BusinessDemoRequestFormData)[]
): ValidationResult {
  try {
    // Create a partial schema with only the specified fields
    const fieldSchema = businessDemoRequestSchema.pick(
      fields.reduce((acc, field) => ({ ...acc, [field]: true }), {} as Record<keyof BusinessDemoRequestFormData, true>)
    );
    
    fieldSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

/**
 * Validates specific fields of coach demo request form
 */
export function validateCoachDemoFormFields(
  data: Partial<CoachDemoRequestFormData>, 
  fields: (keyof CoachDemoRequestFormData)[]
): ValidationResult {
  try {
    // Create a partial schema with only the specified fields
    const fieldSchema = coachDemoRequestSchema.pick(
      fields.reduce((acc, field) => ({ ...acc, [field]: true }), {} as Record<keyof CoachDemoRequestFormData, true>)
    );
    
    fieldSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

/**
 * Real-time validation for individual fields
 */
export function validateSingleField<T>(
  schema: z.ZodSchema<T>,
  fieldName: keyof T,
  value: any
): { isValid: boolean; error?: string } {
  try {
    // Extract the field schema and validate just that field
    const fieldSchema = (schema as any).shape[fieldName];
    if (fieldSchema) {
      fieldSchema.parse(value);
      return { isValid: true };
    }
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0]?.message || 'Invalid value' };
    }
    return { isValid: false, error: 'Validation failed' };
  }
}

/**
 * Real-time validation for business demo form fields
 */
export function validateBusinessField(fieldName: keyof BusinessDemoRequestFormData, value: any) {
  return validateSingleField(businessDemoRequestSchema, fieldName, value);
}

/**
 * Real-time validation for coach demo form fields
 */
export function validateCoachField(fieldName: keyof CoachDemoRequestFormData, value: any) {
  return validateSingleField(coachDemoRequestSchema, fieldName, value);
}

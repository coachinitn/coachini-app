// Demo Request Types - Frontend
// Based on backend API structure from demo-requests module

import { z } from 'zod';

export enum DemoRequestType {
  BUSINESS = 'business',
  COACH = 'coach'
}

export enum BusinessType {
  BUSINESS = 'business',
  STARTUP = 'startup',
  JEUNES_DIPLOMES = 'jeunes_diplomes',
  RESEARCHER = 'researcher'
}

export enum DemoRequestStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DECLINED = 'declined',
  ACCOUNT_CREATED = 'account_created',
  DEMO_COMPLETED = 'demo_completed',
  ACCOUNT_DELETED = 'account_deleted',
  FILES_REQUESTED = 'files_requested'
}

// Business Demo Request Form Data
export interface BusinessDemoRequestFormData {
  // Step 1: Personal Information
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  
  // Step 2: Business Details
  jobTitle: string;
  companySize: string;
  industry?: string;
  businessType: BusinessType;
  comment?: string;
}

// Coach Demo Request Form Data (for future implementation)
export interface CoachDemoRequestFormData {
  fullName: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  areaOfExpertise: string;
  resumeFilePath: string;
  linkedinProfile?: string;
  portfolioWebsite?: string;
  comment?: string;
}

// Zod Validation Schemas
export const businessDemoRequestSchema = z.object({
  // Step 1: Personal Information
  fullName: z.string()
    .optional()
    .refine(val => val && val.trim().length >= 2, 'Full name must be at least 2 characters')
    .refine(val => !val || val.trim().length <= 100, 'Full name must not exceed 100 characters'),
  email: z.string()
    .optional()
    .refine(val => val && val.trim().length > 0, 'Email is required')
    .refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Please enter a valid email address'),
  phone: z.string()
    .optional()
    .refine(val => val && val.trim().length > 0, 'Phone number is required')
    .refine(val => {
      if (!val) return true;
      const cleaned = val.replace(/[\s\-\(\)]/g, '');
      return /^[\+]?[1-9][\d]{0,15}$/.test(cleaned);
    }, 'Please enter a valid phone number'),
  companyName: z.string()
    .optional()
    .refine(val => val && val.trim().length >= 2, 'Company name must be at least 2 characters')
    .refine(val => !val || val.trim().length <= 100, 'Company name must not exceed 100 characters'),

  // Step 2: Business Details
  jobTitle: z.string()
    .optional()
    .refine(val => val && val.trim().length >= 2, 'Job title must be at least 2 characters')
    .refine(val => !val || val.trim().length <= 100, 'Job title must not exceed 100 characters'),
  companySize: z.string()
    .optional()
    .refine(val => val && val.trim().length > 0, 'Company size is required'),
  businessType: z.nativeEnum(BusinessType).optional()
    .refine(val => val !== undefined, 'Business type is required'),
  industry: z.string()
    .optional()
    .refine(val => !val || val.trim().length <= 50, 'Industry must not exceed 50 characters'),
  comment: z.string()
    .optional()
    .refine(val => !val || val.trim().length <= 1000, 'Comment must not exceed 1000 characters')
});

export const coachDemoRequestSchema = z.object({
    // Step 1: Personal Information
    fullName: z
        .string()
        .optional()
        .refine((val) => val && val.trim().length >= 2, 'Full name must be at least 2 characters')
        .refine((val) => !val || val.trim().length <= 100, 'Full name must not exceed 100 characters'),
    email: z
        .string()
        .optional()
        .refine((val) => val && val.trim().length > 0, 'Email is required')
        .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Please enter a valid email address'),
    phone: z
        .string()
        .optional()
        .refine((val) => val && val.trim().length > 0, 'Phone number is required'),

    // Step 2: Professional Information
    yearsOfExperience: z
        .number()
        .optional()
        .refine((val) => val !== undefined && val >= 0, 'Years of experience is required')
        .refine((val) => val === undefined || val <= 50, 'Years of experience seems too high'),
    areaOfExpertise: z
        .string()
        .optional()
        .refine((val) => val && val.trim().length > 0, 'Area of expertise is required'),
    resumeFilePath: z
        .string()
        .optional()
        .refine((val) => val && val.trim().length > 0, 'Resume file is required'),
    linkedinProfile: z
        .string()
        .optional()
        .refine((val) => !val || val === '' || /^https?:\/\/.+/.test(val), {
            message: 'Please enter a valid LinkedIn URL'
        }),
    portfolioWebsite: z
        .string()
        .optional()
        .refine((val) => !val || val === '' || /^https?:\/\/.+/.test(val), {
            message: 'Please enter a valid website URL'
        }),
    comment: z
        .string()
        .optional()
        .refine((val) => !val || val.trim().length <= 1000, 'Comment must not exceed 1000 characters')
});

// API Request DTOs
export interface CreateBusinessDemoRequestDto {
  requestType: DemoRequestType.BUSINESS;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  companySize: string;
  businessType: BusinessType;
  industry?: string;
  comment?: string;
}

export interface CreateCoachDemoRequestDto {
  requestType: DemoRequestType.COACH;
  fullName: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  areaOfExpertise: string;
  resumeFilePath: string;
  linkedinProfile?: string;
  portfolioWebsite?: string;
  comment?: string;
}

// API Response Types
export interface DemoRequest {
  id: string;
  requestType: DemoRequestType;
  status: DemoRequestStatus;
  fullName?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  jobTitle?: string;
  companySize?: string;
  industry?: string;
  businessType?: BusinessType;
  yearsOfExperience?: number;
  areaOfExpertise?: string;
  resumeFilePath?: string;
  linkedinProfile?: string;
  portfolioWebsite?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined;
}

// Company size options
export const COMPANY_SIZE_OPTIONS = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' }
];

// Business type options
export const BUSINESS_TYPE_OPTIONS = [
  { value: BusinessType.BUSINESS, label: 'Business' },
  { value: BusinessType.STARTUP, label: 'Startup' },
  { value: BusinessType.JEUNES_DIPLOMES, label: 'Jeunes Diplômés' },
  { value: BusinessType.RESEARCHER, label: 'Entrepreneurial Researchers' }
];

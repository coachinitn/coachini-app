// Demo Request API Service²
import { api, apiRequest } from '@/lib/api-client';
import { DEMO_REQUEST_ERROR_CODE_TO_I18N_MAP } from '@/lib/api/demo/error-codes';
import {
    CreateBusinessDemoRequestDto,
    CreateCoachDemoRequestDto,
    DemoRequest,
    DemoRequestType,
    BusinessDemoRequestFormData,
    CoachDemoRequestFormData
} from '@/lib/api/demo/demo-request.types';

/**
 * Demo Request API Service
 * Handles all demo request related API calls
 */
export class DemoRequestService {
    private static readonly BASE_PATH = '/demo-requests';

    /**
     * Submit a business demo request
     */
    static async submitBusinessDemoRequest(formData: BusinessDemoRequestFormData): Promise<DemoRequest> {
        // Log the incoming form data
        // console.log('📋 Business Demo Form Data:', {
        //     formData,
        //     formDataKeys: Object.keys(formData),
        //     formDataTypes: Object.entries(formData).reduce((acc, [key, value]) => {
        //         acc[key] = {
        //             type: typeof value,
        //             value: value,
        //             isUndefined: value === undefined,
        //             isNull: value === null,
        //             isEmpty: value === '',
        //             stringLength: typeof value === 'string' ? value.length : 'N/A'
        //         };
        //         return acc;
        //     }, {} as any)
        // });

        // Use fullName as the primary field - backend will handle name splitting
        const requestData: CreateBusinessDemoRequestDto = {
            requestType: DemoRequestType.BUSINESS,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            companyName: formData.companyName,
            jobTitle: formData.jobTitle,
            companySize: formData.companySize,
            businessType: formData.businessType,
            industry: formData.industry,
            comment: formData.comment
        };

        // Log the transformed request data
        // console.log('🚀 API Request Data:', {
        //     requestData,
        //     requestDataKeys: Object.keys(requestData),
        //     requestDataTypes: Object.entries(requestData).reduce((acc, [key, value]) => {
        //         acc[key] = {
        //             type: typeof value,
        //             value: value,
        //             isUndefined: value === undefined,
        //             isNull: value === null,
        //             isEmpty: value === '',
        //             stringLength: typeof value === 'string' ? value.length : 'N/A'
        //         };
        //         return acc;
        //     }, {} as any)
        // });

        // Log the JSON payload
        const jsonPayload = JSON.stringify(requestData);

        try {
            const result = await apiRequest<DemoRequest>(`${this.BASE_PATH}/business`, {
                method: 'POST',
                body: jsonPayload,
                requireAuth: false // Public endpoint
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Submit a coach demo request
     */
    static async submitCoachDemoRequest(formData: CoachDemoRequestFormData): Promise<DemoRequest> {
        const requestData: CreateCoachDemoRequestDto = {
            requestType: DemoRequestType.COACH,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            yearsOfExperience: formData.yearsOfExperience,
            areaOfExpertise: formData.areaOfExpertise,
            resumeFilePath: formData.resumeFilePath,
            // Only include optional fields if they have actual content
            ...(formData.linkedinProfile && formData.linkedinProfile.trim() && { linkedinProfile: formData.linkedinProfile.trim() }),
            ...(formData.portfolioWebsite && formData.portfolioWebsite.trim() && { portfolioWebsite: formData.portfolioWebsite.trim() }),
            ...(formData.comment && formData.comment.trim() && { comment: formData.comment.trim() })
        };

        return apiRequest<DemoRequest>(`${this.BASE_PATH}/coach`, {
            method: 'POST',
            body: JSON.stringify(requestData),
            requireAuth: false // Public endpoint
        });
    }

    /**
     * Get all demo requests (admin only)
     */
    static async getAllDemoRequests(): Promise<DemoRequest[]> {
        return apiRequest<DemoRequest[]>(this.BASE_PATH, {
            method: 'GET',
            requireAuth: true
        });
    }

    /**
     * Get a specific demo request by ID (admin only)
     */
    static async getDemoRequestById(id: string): Promise<DemoRequest> {
        return apiRequest<DemoRequest>(`${this.BASE_PATH}/${id}`, {
            method: 'GET',
            requireAuth: true
        });
    }

    /**
     * Handle API errors and provide user-friendly messages
     * Returns error key for i18n translation
     */
    static handleDemoRequestError(error: any): string {
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
                return 'errors.validationFailed';
            case 401:
                return 'errors.unauthorized';
            case 403:
                return 'errors.forbidden';
            case 404:
                return 'errors.demoRequestNotFound';
            case 409:
                return 'errors.duplicateRequest';
            case 429:
                return 'errors.rateLimitExceeded';
            case 500:
                return 'errors.processingFailed';
            default:
                return 'errors.unexpected';
        }
    }

    /**
     * Map backend error codes to i18n keys using centralized mapping
     */
    private static mapErrorCodeToI18n(errorCode: string): string | null {
        return DEMO_REQUEST_ERROR_CODE_TO_I18N_MAP[errorCode] || null;
    }

    /**
     * Map backend error messages to i18n keys
     */
    private static mapErrorMessage(message: string): string | null {
        if (!message || typeof message !== 'string') return null;

        const messageLower = message.toLowerCase();

        // Phone number specific errors
        if (messageLower.includes('phone number') && messageLower.includes('country code')) {
            return 'errors.invalidPhone';
        }

        if (messageLower.includes('valid phone number')) {
            return 'errors.invalidPhone';
        }

        // Email specific errors
        if (messageLower.includes('valid email') || messageLower.includes('invalid email')) {
            return 'errors.invalidEmail';
        }

        // Required field errors
        if (messageLower.includes('full name') && messageLower.includes('required')) {
            return 'errors.fullNameRequired';
        }

        if (messageLower.includes('email') && messageLower.includes('required')) {
            return 'errors.emailRequired';
        }

        if (messageLower.includes('phone') && messageLower.includes('required')) {
            return 'errors.phoneRequired';
        }

        if (messageLower.includes('company name') && messageLower.includes('required')) {
            return 'errors.companyNameRequired';
        }

        if (messageLower.includes('job title') && messageLower.includes('required')) {
            return 'errors.jobTitleRequired';
        }

        if (messageLower.includes('company size') && messageLower.includes('required')) {
            return 'errors.companySizeRequired';
        }

        if (messageLower.includes('business type') && messageLower.includes('required')) {
            return 'errors.businessTypeRequired';
        }

        if (messageLower.includes('years of experience') && messageLower.includes('required')) {
            return 'errors.yearsOfExperienceRequired';
        }

        if (messageLower.includes('area of expertise') && messageLower.includes('required')) {
            return 'errors.areaOfExpertiseRequired';
        }

        if (messageLower.includes('resume') && messageLower.includes('required')) {
            return 'errors.resumeFileRequired';
        }

        // Length validation errors
        if (messageLower.includes('at least') && messageLower.includes('characters')) {
            if (messageLower.includes('full name')) return 'errors.fullNameTooShort';
            if (messageLower.includes('company name')) return 'errors.companyNameTooShort';
            if (messageLower.includes('area of expertise')) return 'errors.areaOfExpertiseTooShort';
        }

        if (messageLower.includes('not exceed') && messageLower.includes('characters')) {
            if (messageLower.includes('full name')) return 'errors.fullNameTooLong';
            if (messageLower.includes('company name')) return 'errors.companyNameTooLong';
            if (messageLower.includes('area of expertise')) return 'errors.areaOfExpertiseTooLong';
            if (messageLower.includes('comment')) return 'errors.commentTooLong';
        }

        // File upload errors
        if (messageLower.includes('file upload') && messageLower.includes('failed')) {
            return 'errors.fileUploadFailed';
        }

        if (messageLower.includes('file size') && messageLower.includes('exceed')) {
            return 'errors.fileTooLarge';
        }

        if (messageLower.includes('invalid file type') || messageLower.includes('file format')) {
            return 'errors.invalidFileType';
        }

        // Duplicate request errors
        if (messageLower.includes('already exists') || messageLower.includes('duplicate')) {
            return 'errors.duplicateRequest';
        }

        // Rate limiting errors
        if (messageLower.includes('too many') && messageLower.includes('requests')) {
            return 'errors.rateLimitExceeded';
        }

        // URL validation errors
        if (messageLower.includes('valid url') || messageLower.includes('invalid url')) {
            return 'errors.invalidUrl';
        }

        if (messageLower.includes('linkedin') && (messageLower.includes('valid') || messageLower.includes('url'))) {
            return 'errors.invalidLinkedInUrl';
        }

        if (messageLower.includes('portfolio') && (messageLower.includes('valid') || messageLower.includes('url'))) {
            return 'errors.invalidPortfolioUrl';
        }

        // Email send errors
        if (messageLower.includes('email') && messageLower.includes('failed')) {
            return 'errors.emailSendFailed';
        }

        // Number validation errors
        if (messageLower.includes('years of experience') && messageLower.includes('number')) {
            return 'errors.yearsOfExperienceInvalid';
        }

        if (messageLower.includes('years of experience') && messageLower.includes('exceed')) {
            return 'errors.yearsOfExperienceTooHigh';
        }

        // Return null if no mapping found - will use fallback
        return null;
    }
}

/**
 * React Query hooks for demo requests
 */
export const demoRequestQueries = {
    // Mutation for submitting business demo request
    submitBusinessDemo: () => ({
        mutationFn: (data: BusinessDemoRequestFormData) => DemoRequestService.submitBusinessDemoRequest(data)
    }),

    // Mutation for submitting coach demo request
    submitCoachDemo: () => ({
        mutationFn: (data: CoachDemoRequestFormData) => DemoRequestService.submitCoachDemoRequest(data)
    }),

    // Query for getting all demo requests (admin)
    getAllDemoRequests: () => ({
        queryKey: ['demo-requests'],
        queryFn: () => DemoRequestService.getAllDemoRequests()
    }),

    // Query for getting specific demo request (admin)
    getDemoRequestById: (id: string) => ({
        queryKey: ['demo-requests', id],
        queryFn: () => DemoRequestService.getDemoRequestById(id)
    })
};

/**
 * Utility functions for demo request error handling
 */
export const getDemoRequestErrorMessage = (error: any): string => {
    return DemoRequestService.handleDemoRequestError(error);
};

/**
 * Get i18n key for demo request error
 * Use this with useTranslation hook for proper i18n support
 */
export const getDemoRequestErrorKey = (error: any): string => {
    return DemoRequestService.handleDemoRequestError(error);
};

/**
 * Validation utilities for demo requests
 */
export const demoRequestValidation = {
    validateEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validatePhone: (phone: string): boolean => {
        // Basic phone validation - should start with + for international format
        return phone.length >= 10 && /^\+?[0-9\s\-\(\)]+$/.test(phone);
    },

    validateFullName: (name: string): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (!name || name.trim().length === 0) {
            errors.push('Full name is required');
        } else if (name.trim().length < 2) {
            errors.push('Full name must be at least 2 characters long');
        } else if (name.trim().length > 100) {
            errors.push('Full name must not exceed 100 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    validateYearsOfExperience: (years: number): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (isNaN(years) || years < 0) {
            errors.push('Years of experience must be a valid number');
        } else if (years > 50) {
            errors.push('Years of experience must not exceed 50');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    validateUrl: (url: string): boolean => {
        if (!url) return true; // Optional field
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

/**
 * Query keys for React Query cache management
 */
export const demoRequestQueryKeys = {
    all: ['demo-requests'] as const,
    lists: () => [...demoRequestQueryKeys.all, 'list'] as const,
    list: (filters: any) => [...demoRequestQueryKeys.lists(), { filters }] as const,
    details: () => [...demoRequestQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...demoRequestQueryKeys.details(), id] as const
};

// Form validation utilities have been moved to demo-request.validation.ts
// This file now only contains API request functions

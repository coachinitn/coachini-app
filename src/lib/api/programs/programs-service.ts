/**
 * Programs API Service
 *
 * Handles coaching programs, curriculum, and program management
 */

import { apiRequest } from '@/lib/api-client';
import { PROGRAMS_ERROR_CODE_TO_I18N_MAP } from '@/lib/api/programs/error-codes';
import type {
  Program,
  ProgramModule,
  ProgramLesson,
  ProgramCreateDto,
  ProgramUpdateDto,
  ProgramEnrollment
} from './programs.types';

export class ProgramsService {
  private static readonly BASE_PATH = '/programs';

  /**
   * Create a new program
   */
  static async createProgram(data: ProgramCreateDto): Promise<Program> {
    return apiRequest<Program>(`${this.BASE_PATH}`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Get all programs
   */
  static async getAllPrograms(
    page: number = 1,
    limit: number = 20,
    filters?: {
      search?: string;
      status?: string;
      category?: string;
      createdBy?: string;
    }
  ): Promise<{
    data: Program[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.createdBy && { createdBy: filters.createdBy })
    });

    return apiRequest(`${this.BASE_PATH}?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Get a specific program by ID
   */
  static async getProgramById(id: string): Promise<Program> {
    return apiRequest<Program>(`${this.BASE_PATH}/${id}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Get a public program
   */
  static async getPublicProgram(id: string): Promise<Program> {
    return apiRequest<Program>(`${this.BASE_PATH}/public/${id}`, {
      method: 'GET',
      requireAuth: false
    });
  }

  /**
   * Update a program
   */
  static async updateProgram(id: string, data: ProgramUpdateDto): Promise<Program> {
    return apiRequest<Program>(`${this.BASE_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Delete a program
   */
  static async deleteProgram(id: string): Promise<void> {
    return apiRequest<void>(`${this.BASE_PATH}/${id}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }

  /**
   * Publish a program
   */
  static async publishProgram(id: string): Promise<Program> {
    return apiRequest<Program>(`${this.BASE_PATH}/${id}/publish`, {
      method: 'POST',
      requireAuth: true
    });
  }

  /**
   * Unpublish a program
   */
  static async unpublishProgram(id: string): Promise<Program> {
    return apiRequest<Program>(`${this.BASE_PATH}/${id}/unpublish`, {
      method: 'POST',
      requireAuth: true
    });
  }

  /**
   * Get program modules
   */
  static async getProgramModules(programId: string): Promise<ProgramModule[]> {
    return apiRequest<ProgramModule[]>(`${this.BASE_PATH}/${programId}/modules`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Create a program module
   */
  static async createProgramModule(
    programId: string,
    data: {
      title: string;
      description?: string;
      order: number;
      duration?: number;
    }
  ): Promise<ProgramModule> {
    return apiRequest<ProgramModule>(`${this.BASE_PATH}/${programId}/modules`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Update a program module
   */
  static async updateProgramModule(
    programId: string,
    moduleId: string,
    data: Partial<ProgramModule>
  ): Promise<ProgramModule> {
    return apiRequest<ProgramModule>(
      `${this.BASE_PATH}/${programId}/modules/${moduleId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
        requireAuth: true
      }
    );
  }

  /**
   * Delete a program module
   */
  static async deleteProgramModule(programId: string, moduleId: string): Promise<void> {
    return apiRequest<void>(`${this.BASE_PATH}/${programId}/modules/${moduleId}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }

  /**
   * Get program lessons
   */
  static async getProgramLessons(
    programId: string,
    moduleId?: string
  ): Promise<ProgramLesson[]> {
    const url = moduleId
      ? `${this.BASE_PATH}/${programId}/modules/${moduleId}/lessons`
      : `${this.BASE_PATH}/${programId}/lessons`;

    return apiRequest<ProgramLesson[]>(url, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Create a program lesson
   */
  static async createProgramLesson(
    programId: string,
    moduleId: string,
    data: {
      title: string;
      description?: string;
      content?: string;
      duration?: number;
      order: number;
      attachmentIds?: string[];
    }
  ): Promise<ProgramLesson> {
    return apiRequest<ProgramLesson>(
      `${this.BASE_PATH}/${programId}/modules/${moduleId}/lessons`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        requireAuth: true
      }
    );
  }

  /**
   * Update a program lesson
   */
  static async updateProgramLesson(
    programId: string,
    moduleId: string,
    lessonId: string,
    data: Partial<ProgramLesson>
  ): Promise<ProgramLesson> {
    return apiRequest<ProgramLesson>(
      `${this.BASE_PATH}/${programId}/modules/${moduleId}/lessons/${lessonId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
        requireAuth: true
      }
    );
  }

  /**
   * Delete a program lesson
   */
  static async deleteProgramLesson(
    programId: string,
    moduleId: string,
    lessonId: string
  ): Promise<void> {
    return apiRequest<void>(
      `${this.BASE_PATH}/${programId}/modules/${moduleId}/lessons/${lessonId}`,
      {
        method: 'DELETE',
        requireAuth: true
      }
    );
  }

  /**
   * Enroll in a program
   */
  static async enrollProgram(programId: string): Promise<ProgramEnrollment> {
    return apiRequest<ProgramEnrollment>(`${this.BASE_PATH}/${programId}/enroll`, {
      method: 'POST',
      requireAuth: true
    });
  }

  /**
   * Get program enrollments
   */
  static async getProgramEnrollments(
    programId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: ProgramEnrollment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    return apiRequest(
      `${this.BASE_PATH}/${programId}/enrollments?${params.toString()}`,
      {
        method: 'GET',
        requireAuth: true
      }
    );
  }

  /**
   * Get user's enrolled programs
   */
  static async getEnrolledPrograms(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: Program[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    return apiRequest(`${this.BASE_PATH}/enrolled?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Handle API errors
   */
  static handleProgramError(error: any): string {
    if (!error.statusCode) {
      return 'errors.network';
    }

    if (error.errorCode) {
      const i18nKey = this.mapErrorCodeToI18n(error.errorCode);
      if (i18nKey) return i18nKey;
    }

    const messageMapping = this.mapErrorMessage(error.message);
    if (messageMapping) return messageMapping;

    switch (error.statusCode) {
      case 400:
        return 'errors.invalidProgramData';
      case 401:
        return 'errors.unauthorized';
      case 403:
        return 'errors.forbidden';
      case 404:
        return 'errors.programNotFound';
      case 409:
        return 'errors.programConflict';
      case 422:
        return 'errors.validationFailed';
      case 500:
        return 'errors.programProcessingFailed';
      default:
        return 'errors.unexpected';
    }
  }

  private static mapErrorCodeToI18n(errorCode: string): string | null {
    return PROGRAMS_ERROR_CODE_TO_I18N_MAP[errorCode] || null;
  }

  private static mapErrorMessage(message: string): string | null {
    if (!message || typeof message !== 'string') return null;

    const messageLower = message.toLowerCase();

    if (messageLower.includes('not found') || messageLower.includes('does not exist')) {
      if (messageLower.includes('program')) {
        return 'errors.programNotFound';
      }
      if (messageLower.includes('module')) {
        return 'errors.moduleNotFound';
      }
      if (messageLower.includes('lesson')) {
        return 'errors.lessonNotFound';
      }
    }

    if (messageLower.includes('already enrolled') || messageLower.includes('already enrolled')) {
      return 'errors.alreadyEnrolled';
    }

    if (messageLower.includes('already published')) {
      return 'errors.programAlreadyPublished';
    }

    if (messageLower.includes('permission') || messageLower.includes('denied')) {
      return 'errors.programPermissionDenied';
    }

    return null;
  }
}

/**
 * Programs React Query Layer
 *
 * React Query mutations and queries for program operations
 */

import { ProgramsService } from './programs-service';
import type {
  ProgramCreateDto,
  ProgramUpdateDto
} from './programs.types';

export const programsQueries = {
  /**
   * Mutation for creating a new program
   */
  createProgram: () => ({
    mutationFn: (data: ProgramCreateDto) => ProgramsService.createProgram(data)
  }),

  /**
   * Mutation for updating a program
   */
  updateProgram: () => ({
    mutationFn: (params: { id: string; data: ProgramUpdateDto }) =>
      ProgramsService.updateProgram(params.id, params.data)
  }),

  /**
   * Mutation for deleting a program
   */
  deleteProgram: () => ({
    mutationFn: (id: string) => ProgramsService.deleteProgram(id)
  }),

  /**
   * Mutation for publishing a program
   */
  publishProgram: () => ({
    mutationFn: (id: string) => ProgramsService.publishProgram(id)
  }),

  /**
   * Mutation for unpublishing a program
   */
  unpublishProgram: () => ({
    mutationFn: (id: string) => ProgramsService.unpublishProgram(id)
  }),

  /**
   * Mutation for creating a program module
   */
  createProgramModule: () => ({
    mutationFn: (params: {
      programId: string;
      data: { title: string; description?: string; order: number; duration?: number };
    }) => ProgramsService.createProgramModule(params.programId, params.data)
  }),

  /**
   * Mutation for updating a program module
   */
  updateProgramModule: () => ({
    mutationFn: (params: {
      programId: string;
      moduleId: string;
      data: any;
    }) => ProgramsService.updateProgramModule(params.programId, params.moduleId, params.data)
  }),

  /**
   * Mutation for deleting a program module
   */
  deleteProgramModule: () => ({
    mutationFn: (params: { programId: string; moduleId: string }) =>
      ProgramsService.deleteProgramModule(params.programId, params.moduleId)
  }),

  /**
   * Mutation for creating a program lesson
   */
  createProgramLesson: () => ({
    mutationFn: (params: {
      programId: string;
      moduleId: string;
      data: any;
    }) => ProgramsService.createProgramLesson(params.programId, params.moduleId, params.data)
  }),

  /**
   * Mutation for updating a program lesson
   */
  updateProgramLesson: () => ({
    mutationFn: (params: {
      programId: string;
      moduleId: string;
      lessonId: string;
      data: any;
    }) =>
      ProgramsService.updateProgramLesson(
        params.programId,
        params.moduleId,
        params.lessonId,
        params.data
      )
  }),

  /**
   * Mutation for deleting a program lesson
   */
  deleteProgramLesson: () => ({
    mutationFn: (params: { programId: string; moduleId: string; lessonId: string }) =>
      ProgramsService.deleteProgramLesson(
        params.programId,
        params.moduleId,
        params.lessonId
      )
  }),

  /**
   * Mutation for enrolling in a program
   */
  enrollProgram: () => ({
    mutationFn: (programId: string) => ProgramsService.enrollProgram(programId)
  }),

  /**
   * Query for getting all programs
   */
  getAllPrograms: (page: number = 1, limit: number = 20, filters?: any) => ({
    queryKey: ['programs', 'list', { page, limit, ...filters }],
    queryFn: () => ProgramsService.getAllPrograms(page, limit, filters)
  }),

  /**
   * Query for getting a specific program
   */
  getProgramById: (id: string) => ({
    queryKey: ['programs', id],
    queryFn: () => ProgramsService.getProgramById(id)
  }),

  /**
   * Query for getting a public program
   */
  getPublicProgram: (id: string) => ({
    queryKey: ['programs', 'public', id],
    queryFn: () => ProgramsService.getPublicProgram(id)
  }),

  /**
   * Query for getting program modules
   */
  getProgramModules: (programId: string) => ({
    queryKey: ['programs', programId, 'modules'],
    queryFn: () => ProgramsService.getProgramModules(programId)
  }),

  /**
   * Query for getting program lessons
   */
  getProgramLessons: (programId: string, moduleId?: string) => ({
    queryKey: ['programs', programId, 'lessons', { moduleId }],
    queryFn: () => ProgramsService.getProgramLessons(programId, moduleId)
  }),

  /**
   * Query for getting program enrollments
   */
  getProgramEnrollments: (programId: string, page: number = 1, limit: number = 20) => ({
    queryKey: ['programs', programId, 'enrollments', { page, limit }],
    queryFn: () => ProgramsService.getProgramEnrollments(programId, page, limit)
  }),

  /**
   * Query for getting user's enrolled programs
   */
  getEnrolledPrograms: (page: number = 1, limit: number = 20) => ({
    queryKey: ['programs', 'enrolled', { page, limit }],
    queryFn: () => ProgramsService.getEnrolledPrograms(page, limit)
  })
};

/**
 * Error handling utilities
 */
export const getProgramErrorMessage = (error: any): string => {
  return ProgramsService.handleProgramError(error);
};

export const getProgramErrorKey = (error: any): string => {
  return ProgramsService.handleProgramError(error);
};

/**
 * Program validation utilities
 */
export const programsValidation = {
  validateProgramTitle: (title: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push('Program title is required');
    } else if (title.trim().length < 3) {
      errors.push('Program title must be at least 3 characters');
    } else if (title.trim().length > 200) {
      errors.push('Program title must not exceed 200 characters');
    }

    return { isValid: errors.length === 0, errors };
  },

  validateModuleTitle: (title: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push('Module title is required');
    } else if (title.trim().length < 3) {
      errors.push('Module title must be at least 3 characters');
    } else if (title.trim().length > 200) {
      errors.push('Module title must not exceed 200 characters');
    }

    return { isValid: errors.length === 0, errors };
  },

  validateLessonTitle: (title: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push('Lesson title is required');
    } else if (title.trim().length < 3) {
      errors.push('Lesson title must be at least 3 characters');
    } else if (title.trim().length > 200) {
      errors.push('Lesson title must not exceed 200 characters');
    }

    return { isValid: errors.length === 0, errors };
  }
};

/**
 * Query keys for React Query cache management
 */
export const programsQueryKeys = {
  all: ['programs'] as const,
  lists: () => [...programsQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...programsQueryKeys.lists(), { filters }] as const,
  details: () => [...programsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...programsQueryKeys.details(), id] as const,
  public: () => [...programsQueryKeys.all, 'public'] as const,
  publicDetail: (id: string) => [...programsQueryKeys.public(), id] as const,
  modules: (programId: string) => [...programsQueryKeys.detail(programId), 'modules'] as const,
  lessons: (programId: string, moduleId?: string) => [...programsQueryKeys.detail(programId), 'lessons', { moduleId }] as const,
  enrollments: (programId: string) => [...programsQueryKeys.detail(programId), 'enrollments'] as const,
  enrolled: () => [...programsQueryKeys.all, 'enrolled'] as const
} as const;

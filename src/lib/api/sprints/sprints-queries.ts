/**
 * Sprints React Query Layer
 *
 * React Query mutations and queries for sprint operations
 */

import { SprintsService } from './sprints-service';
import type {
  SprintCreateDto,
  SprintUpdateDto
} from './sprints.types';

export const sprintsQueries = {
  /**
   * Mutation for creating a sprint
   */
  createSprint: () => ({
    mutationFn: (data: SprintCreateDto) => SprintsService.createSprint(data)
  }),

  /**
   * Mutation for updating a sprint
   */
  updateSprint: () => ({
    mutationFn: (params: { id: string; data: SprintUpdateDto }) =>
      SprintsService.updateSprint(params.id, params.data)
  }),

  /**
   * Mutation for deleting a sprint
   */
  deleteSprint: () => ({
    mutationFn: (id: string) => SprintsService.deleteSprint(id)
  }),

  /**
   * Mutation for starting a sprint
   */
  startSprint: () => ({
    mutationFn: (id: string) => SprintsService.startSprint(id)
  }),

  /**
   * Mutation for completing a sprint
   */
  completeSprint: () => ({
    mutationFn: (id: string) => SprintsService.completeSprint(id)
  }),

  /**
   * Mutation for adding sprint goal
   */
  addSprintGoal: () => ({
    mutationFn: (params: {
      sprintId: string;
      data: {
        title: string;
        description?: string;
        targetValue: number;
        metric: string;
        priority?: 'low' | 'medium' | 'high';
      };
    }) => SprintsService.addSprintGoal(params.sprintId, params.data)
  }),

  /**
   * Mutation for updating sprint goal
   */
  updateSprintGoal: () => ({
    mutationFn: (params: {
      sprintId: string;
      goalId: string;
      data: any;
    }) =>
      SprintsService.updateSprintGoal(
        params.sprintId,
        params.goalId,
        params.data
      )
  }),

  /**
   * Mutation for removing sprint goal
   */
  removeSprintGoal: () => ({
    mutationFn: (params: { sprintId: string; goalId: string }) =>
      SprintsService.removeSprintGoal(params.sprintId, params.goalId)
  }),

  /**
   * Mutation for updating sprint progress
   */
  updateSprintProgress: () => ({
    mutationFn: (params: { sprintId: string; progress: number }) =>
      SprintsService.updateSprintProgress(params.sprintId, params.progress)
  }),

  /**
   * Query for getting all sprints
   */
  getAllSprints: (page: number = 1, limit: number = 20, filters?: any) => ({
    queryKey: ['sprints', 'list', { page, limit, ...filters }],
    queryFn: () => SprintsService.getAllSprints(page, limit, filters)
  }),

  /**
   * Query for getting sprint by ID
   */
  getSprintById: (id: string) => ({
    queryKey: ['sprints', id],
    queryFn: () => SprintsService.getSprintById(id)
  }),

  /**
   * Query for getting sprint goals
   */
  getSprintGoals: (sprintId: string) => ({
    queryKey: ['sprints', sprintId, 'goals'],
    queryFn: () => SprintsService.getSprintGoals(sprintId)
  }),

  /**
   * Query for getting sprint metrics
   */
  getSprintMetrics: (sprintId: string) => ({
    queryKey: ['sprints', sprintId, 'metrics'],
    queryFn: () => SprintsService.getSprintMetrics(sprintId)
  }),

  /**
   * Query for getting user's active sprint
   */
  getUserActiveSprint: () => ({
    queryKey: ['sprints', 'user', 'active'],
    queryFn: () => SprintsService.getUserActiveSprint()
  })
};

/**
 * Error handling utilities
 */
export const getSprintErrorMessage = (error: any): string => {
  return SprintsService.handleSprintError(error);
};

export const getSprintErrorKey = (error: any): string => {
  return SprintsService.handleSprintError(error);
};

/**
 * Sprint validation utilities
 */
export const sprintsValidation = {
  validateSprintName: (name: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Sprint name is required');
    } else if (name.trim().length < 3) {
      errors.push('Sprint name must be at least 3 characters');
    } else if (name.trim().length > 100) {
      errors.push('Sprint name must not exceed 100 characters');
    }

    return { isValid: errors.length === 0, errors };
  },

  validateSprintDuration: (
    startDate: string,
    endDate: string
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      errors.push('End date must be after start date');
    }

    const durationDays = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (durationDays < 1) {
      errors.push('Sprint must be at least 1 day long');
    } else if (durationDays > 365) {
      errors.push('Sprint cannot exceed 365 days');
    }

    return { isValid: errors.length === 0, errors };
  }
};

/**
 * Query keys for React Query cache management
 */
export const sprintsQueryKeys = {
  all: ['sprints'] as const,
  lists: () => [...sprintsQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...sprintsQueryKeys.lists(), { filters }] as const,
  details: () => [...sprintsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...sprintsQueryKeys.details(), id] as const,
  goals: (sprintId: string) => [...sprintsQueryKeys.detail(sprintId), 'goals'] as const,
  metrics: (sprintId: string) => [...sprintsQueryKeys.detail(sprintId), 'metrics'] as const,
  active: () => [...sprintsQueryKeys.all, 'user', 'active'] as const
} as const;

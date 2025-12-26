/**
 * Sprints API Service
 *
 * Handles sprint management, goals, and tracking
 */

import { apiRequest } from '@/lib/api-client';
import { SPRINTS_ERROR_CODE_TO_I18N_MAP } from '@/lib/api/sprints/error-codes';
import type {
  Sprint,
  SprintCreateDto,
  SprintUpdateDto,
  SprintGoal,
  SprintMetrics
} from './sprints.types';

export class SprintsService {
  private static readonly BASE_PATH = '/sprints';

  /**
   * Create a new sprint
   */
  static async createSprint(data: SprintCreateDto): Promise<Sprint> {
    return apiRequest<Sprint>(`${this.BASE_PATH}`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Get all sprints
   */
  static async getAllSprints(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
      search?: string;
    }
  ): Promise<{
    data: Sprint[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && { search: filters.search })
    });

    return apiRequest(`${this.BASE_PATH}?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Get a specific sprint by ID
   */
  static async getSprintById(id: string): Promise<Sprint> {
    return apiRequest<Sprint>(`${this.BASE_PATH}/${id}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Update a sprint
   */
  static async updateSprint(id: string, data: SprintUpdateDto): Promise<Sprint> {
    return apiRequest<Sprint>(`${this.BASE_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Delete a sprint
   */
  static async deleteSprint(id: string): Promise<void> {
    return apiRequest<void>(`${this.BASE_PATH}/${id}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }

  /**
   * Start a sprint
   */
  static async startSprint(id: string): Promise<Sprint> {
    return apiRequest<Sprint>(`${this.BASE_PATH}/${id}/start`, {
      method: 'PATCH',
      requireAuth: true
    });
  }

  /**
   * Complete a sprint
   */
  static async completeSprint(id: string): Promise<Sprint> {
    return apiRequest<Sprint>(`${this.BASE_PATH}/${id}/complete`, {
      method: 'PATCH',
      requireAuth: true
    });
  }

  /**
   * Get sprint goals
   */
  static async getSprintGoals(sprintId: string): Promise<SprintGoal[]> {
    return apiRequest<SprintGoal[]>(`${this.BASE_PATH}/${sprintId}/goals`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Add goal to sprint
   */
  static async addSprintGoal(
    sprintId: string,
    data: {
      title: string;
      description?: string;
      targetValue: number;
      metric: string;
      priority?: 'low' | 'medium' | 'high';
    }
  ): Promise<SprintGoal> {
    return apiRequest<SprintGoal>(`${this.BASE_PATH}/${sprintId}/goals`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Update sprint goal
   */
  static async updateSprintGoal(
    sprintId: string,
    goalId: string,
    data: Partial<SprintGoal>
  ): Promise<SprintGoal> {
    return apiRequest<SprintGoal>(`${this.BASE_PATH}/${sprintId}/goals/${goalId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Remove goal from sprint
   */
  static async removeSprintGoal(sprintId: string, goalId: string): Promise<void> {
    return apiRequest<void>(`${this.BASE_PATH}/${sprintId}/goals/${goalId}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }

  /**
   * Get sprint metrics
   */
  static async getSprintMetrics(sprintId: string): Promise<SprintMetrics> {
    return apiRequest<SprintMetrics>(`${this.BASE_PATH}/${sprintId}/metrics`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Update sprint progress
   */
  static async updateSprintProgress(
    sprintId: string,
    progress: number
  ): Promise<Sprint> {
    return apiRequest<Sprint>(`${this.BASE_PATH}/${sprintId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progress }),
      requireAuth: true
    });
  }

  /**
   * Get sprint by user
   */
  static async getUserActiveSprint(): Promise<Sprint | null> {
    return apiRequest<Sprint | null>(`${this.BASE_PATH}/user/active`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Handle API errors
   */
  static handleSprintError(error: any): string {
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
        return 'errors.invalidSprintData';
      case 401:
        return 'errors.unauthorized';
      case 403:
        return 'errors.forbidden';
      case 404:
        return 'errors.sprintNotFound';
      case 409:
        return 'errors.sprintConflict';
      case 422:
        return 'errors.validationFailed';
      case 500:
        return 'errors.sprintProcessingFailed';
      default:
        return 'errors.unexpected';
    }
  }

  private static mapErrorCodeToI18n(errorCode: string): string | null {
    return SPRINTS_ERROR_CODE_TO_I18N_MAP[errorCode] || null;
  }

  private static mapErrorMessage(message: string): string | null {
    if (!message || typeof message !== 'string') return null;

    const messageLower = message.toLowerCase();

    if (messageLower.includes('not found')) {
      if (messageLower.includes('goal')) {
        return 'errors.goalNotFound';
      }
      return 'errors.sprintNotFound';
    }

    if (messageLower.includes('already started')) {
      return 'errors.sprintAlreadyStarted';
    }

    if (messageLower.includes('already completed')) {
      return 'errors.sprintAlreadyCompleted';
    }

    if (messageLower.includes('cannot modify')) {
      return 'errors.cannotModifyCompletedSprint';
    }

    return null;
  }
}

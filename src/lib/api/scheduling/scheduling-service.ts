/**
 * Scheduling API Service
 *
 * Handles session scheduling, availability, session requests, and reminders
 */

import { apiRequest } from '@/lib/api-client';
import { SCHEDULING_ERROR_CODE_TO_I18N_MAP } from '@/lib/api/scheduling/error-codes';
import type {
  ScheduledSession,
  SessionRequest,
  Availability,
  SessionStatistics,
  CreateSessionDto,
  UpdateSessionDto
} from './scheduling.types';

export class SchedulingService {
  private static readonly BASE_PATH = '/scheduling';

  /**
   * Create a scheduled session
   */
  static async createSession(data: CreateSessionDto): Promise<ScheduledSession> {
    return apiRequest<ScheduledSession>(`${this.BASE_PATH}/sessions`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Create session from request
   */
  static async createSessionFromRequest(
    requestId: string,
    additionalData?: Partial<CreateSessionDto>
  ): Promise<ScheduledSession> {
    return apiRequest<ScheduledSession>(
      `${this.BASE_PATH}/sessions/from-request/${requestId}`,
      {
        method: 'POST',
        body: JSON.stringify(additionalData || {}),
        requireAuth: true
      }
    );
  }

  /**
   * Get all scheduled sessions with optional filtering
   */
  static async getAllSessions(filters?: {
    coachId?: string;
    participantId?: string;
    supervisorId?: string;
    themeId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    locationType?: string;
  }): Promise<ScheduledSession[]> {
    const params = new URLSearchParams();

    if (filters?.coachId) params.append('coachId', filters.coachId);
    if (filters?.participantId) params.append('participantId', filters.participantId);
    if (filters?.supervisorId) params.append('supervisorId', filters.supervisorId);
    if (filters?.themeId) params.append('themeId', filters.themeId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.locationType) params.append('locationType', filters.locationType);

    return apiRequest<ScheduledSession[]>(
      `${this.BASE_PATH}/sessions${params.toString() ? '?' + params.toString() : ''}`,
      {
        method: 'GET',
        requireAuth: true
      }
    );
  }

  /**
   * Get current user's sessions
   */
  static async getMySessions(
    role: 'coach' | 'participant' | 'supervisor' = 'participant'
  ): Promise<ScheduledSession[]> {
    return apiRequest<ScheduledSession[]>(
      `${this.BASE_PATH}/sessions/my-sessions?role=${role}`,
      {
        method: 'GET',
        requireAuth: true
      }
    );
  }

  /**
   * Get upcoming sessions for current user
   */
  static async getUpcomingSessions(
    role: 'coach' | 'participant' | 'supervisor' = 'participant',
    days: number = 7
  ): Promise<ScheduledSession[]> {
    return apiRequest<ScheduledSession[]>(
      `${this.BASE_PATH}/sessions/upcoming?role=${role}&days=${days}`,
      {
        method: 'GET',
        requireAuth: true
      }
    );
  }

  /**
   * Get session statistics for current user
   */
  static async getSessionStatistics(
    role: 'coach' | 'participant' | 'supervisor' = 'participant'
  ): Promise<SessionStatistics> {
    return apiRequest<SessionStatistics>(
      `${this.BASE_PATH}/sessions/statistics?role=${role}`,
      {
        method: 'GET',
        requireAuth: true
      }
    );
  }

  /**
   * Get a scheduled session by ID
   */
  static async getSessionById(id: string): Promise<ScheduledSession> {
    return apiRequest<ScheduledSession>(`${this.BASE_PATH}/sessions/${id}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Update a scheduled session
   */
  static async updateSession(id: string, data: UpdateSessionDto): Promise<ScheduledSession> {
    return apiRequest<ScheduledSession>(`${this.BASE_PATH}/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Start a session
   */
  static async startSession(id: string): Promise<ScheduledSession> {
    return apiRequest<ScheduledSession>(`${this.BASE_PATH}/sessions/${id}/start`, {
      method: 'PATCH',
      requireAuth: true
    });
  }

  /**
   * Complete a session
   */
  static async completeSession(id: string, data?: any): Promise<ScheduledSession> {
    return apiRequest<ScheduledSession>(`${this.BASE_PATH}/sessions/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify(data || {}),
      requireAuth: true
    });
  }

  /**
   * Cancel a session
   */
  static async cancelSession(id: string, reason?: string): Promise<ScheduledSession> {
    return apiRequest<ScheduledSession>(`${this.BASE_PATH}/sessions/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
      requireAuth: true
    });
  }

  /**
   * Reschedule a session
   */
  static async rescheduleSession(id: string, newDate: string, newTime: string): Promise<ScheduledSession> {
    return apiRequest<ScheduledSession>(`${this.BASE_PATH}/sessions/${id}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify({ newDate, newTime }),
      requireAuth: true
    });
  }

  /**
   * Delete a session
   */
  static async deleteSession(id: string): Promise<void> {
    return apiRequest<void>(`${this.BASE_PATH}/sessions/${id}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }

  /**
   * Get user availability
   */
  static async getUserAvailability(userId: string): Promise<Availability[]> {
    return apiRequest<Availability[]>(`${this.BASE_PATH}/availability/${userId}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Set user availability
   */
  static async setUserAvailability(
    data: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }[]
  ): Promise<Availability[]> {
    return apiRequest<Availability[]>(`${this.BASE_PATH}/availability`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Get session requests
   */
  static async getSessionRequests(
    status?: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  ): Promise<SessionRequest[]> {
    const params = status ? `?status=${status}` : '';
    return apiRequest<SessionRequest[]>(`${this.BASE_PATH}/session-requests${params}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Create a session request
   */
  static async createSessionRequest(data: any): Promise<SessionRequest> {
    return apiRequest<SessionRequest>(`${this.BASE_PATH}/session-requests`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Accept a session request
   */
  static async acceptSessionRequest(id: string): Promise<SessionRequest> {
    return apiRequest<SessionRequest>(`${this.BASE_PATH}/session-requests/${id}/accept`, {
      method: 'PATCH',
      requireAuth: true
    });
  }

  /**
   * Reject a session request
   */
  static async rejectSessionRequest(id: string, reason?: string): Promise<SessionRequest> {
    return apiRequest<SessionRequest>(`${this.BASE_PATH}/session-requests/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
      requireAuth: true
    });
  }

  /**
   * Handle API errors
   */
  static handleSchedulingError(error: any): string {
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
        return 'errors.invalidSessionData';
      case 401:
        return 'errors.unauthorized';
      case 403:
        return 'errors.forbidden';
      case 404:
        return 'errors.sessionNotFound';
      case 409:
        return 'errors.sessionConflict';
      case 422:
        return 'errors.validationFailed';
      case 500:
        return 'errors.sessionProcessingFailed';
      default:
        return 'errors.unexpected';
    }
  }

  private static mapErrorCodeToI18n(errorCode: string): string | null {
    return SCHEDULING_ERROR_CODE_TO_I18N_MAP[errorCode] || null;
  }

  private static mapErrorMessage(message: string): string | null {
    if (!message || typeof message !== 'string') return null;

    const messageLower = message.toLowerCase();

    if (messageLower.includes('not found')) {
      return 'errors.sessionNotFound';
    }

    if (messageLower.includes('unavailable') || messageLower.includes('conflict')) {
      return 'errors.sessionConflict';
    }

    if (messageLower.includes('cannot reschedule') || messageLower.includes('already')) {
      return 'errors.cannotRescheduleSession';
    }

    return null;
  }
}

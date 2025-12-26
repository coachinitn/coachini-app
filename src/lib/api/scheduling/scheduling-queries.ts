/**
 * Scheduling React Query Layer
 *
 * React Query mutations and queries for session and scheduling operations
 */

import { SchedulingService } from './scheduling-service';
import type {
  CreateSessionDto,
  UpdateSessionDto
} from './scheduling.types';

/**
 * React Query mutation objects for scheduling
 */
export const schedulingQueries = {
  /**
   * Mutation for creating a session
   */
  createSession: () => ({
    mutationFn: (data: CreateSessionDto) => SchedulingService.createSession(data)
  }),

  /**
   * Mutation for creating session from request
   */
  createSessionFromRequest: () => ({
    mutationFn: (params: {
      requestId: string;
      additionalData?: Partial<CreateSessionDto>;
    }) =>
      SchedulingService.createSessionFromRequest(params.requestId, params.additionalData)
  }),

  /**
   * Mutation for updating a session
   */
  updateSession: () => ({
    mutationFn: (params: { id: string; data: UpdateSessionDto }) =>
      SchedulingService.updateSession(params.id, params.data)
  }),

  /**
   * Mutation for starting a session
   */
  startSession: () => ({
    mutationFn: (id: string) => SchedulingService.startSession(id)
  }),

  /**
   * Mutation for completing a session
   */
  completeSession: () => ({
    mutationFn: (params: { id: string; data?: any }) =>
      SchedulingService.completeSession(params.id, params.data)
  }),

  /**
   * Mutation for canceling a session
   */
  cancelSession: () => ({
    mutationFn: (params: { id: string; reason?: string }) =>
      SchedulingService.cancelSession(params.id, params.reason)
  }),

  /**
   * Mutation for rescheduling a session
   */
  rescheduleSession: () => ({
    mutationFn: (params: { id: string; newDate: string; newTime: string }) =>
      SchedulingService.rescheduleSession(params.id, params.newDate, params.newTime)
  }),

  /**
   * Mutation for deleting a session
   */
  deleteSession: () => ({
    mutationFn: (id: string) => SchedulingService.deleteSession(id)
  }),

  /**
   * Mutation for setting user availability
   */
  setUserAvailability: () => ({
    mutationFn: (data: any[]) => SchedulingService.setUserAvailability(data)
  }),

  /**
   * Mutation for creating session request
   */
  createSessionRequest: () => ({
    mutationFn: (data: any) => SchedulingService.createSessionRequest(data)
  }),

  /**
   * Mutation for accepting session request
   */
  acceptSessionRequest: () => ({
    mutationFn: (id: string) => SchedulingService.acceptSessionRequest(id)
  }),

  /**
   * Mutation for rejecting session request
   */
  rejectSessionRequest: () => ({
    mutationFn: (params: { id: string; reason?: string }) =>
      SchedulingService.rejectSessionRequest(params.id, params.reason)
  }),

  /**
   * Query for getting all sessions
   */
  getAllSessions: (filters?: any) => ({
    queryKey: ['scheduling', 'sessions', { ...filters }],
    queryFn: () => SchedulingService.getAllSessions(filters)
  }),

  /**
   * Query for getting user's sessions
   */
  getMySessions: (role: 'coach' | 'participant' | 'supervisor' = 'participant') => ({
    queryKey: ['scheduling', 'my-sessions', role],
    queryFn: () => SchedulingService.getMySessions(role)
  }),

  /**
   * Query for getting upcoming sessions
   */
  getUpcomingSessions: (
    role: 'coach' | 'participant' | 'supervisor' = 'participant',
    days: number = 7
  ) => ({
    queryKey: ['scheduling', 'upcoming', { role, days }],
    queryFn: () => SchedulingService.getUpcomingSessions(role, days)
  }),

  /**
   * Query for getting session statistics
   */
  getSessionStatistics: (role: 'coach' | 'participant' | 'supervisor' = 'participant') => ({
    queryKey: ['scheduling', 'statistics', role],
    queryFn: () => SchedulingService.getSessionStatistics(role)
  }),

  /**
   * Query for getting session by ID
   */
  getSessionById: (id: string) => ({
    queryKey: ['scheduling', 'session', id],
    queryFn: () => SchedulingService.getSessionById(id)
  }),

  /**
   * Query for getting user availability
   */
  getUserAvailability: (userId: string) => ({
    queryKey: ['scheduling', 'availability', userId],
    queryFn: () => SchedulingService.getUserAvailability(userId)
  }),

  /**
   * Query for getting session requests
   */
  getSessionRequests: (status?: string) => ({
    queryKey: ['scheduling', 'requests', { status }],
    queryFn: () => SchedulingService.getSessionRequests(status as any)
  })
};

/**
 * Error handling utilities
 */
export const getSchedulingErrorMessage = (error: any): string => {
  return SchedulingService.handleSchedulingError(error);
};

export const getSchedulingErrorKey = (error: any): string => {
  return SchedulingService.handleSchedulingError(error);
};

/**
 * Validation utilities
 */
export const schedulingValidation = {
  validateTimeRange: (startTime: string, endTime: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!startTime || !endTime) {
      errors.push('Start and end times are required');
    } else {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);

      if (start >= end) {
        errors.push('Start time must be before end time');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateDateRange: (startDate: string, endDate: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!startDate || !endDate) {
      errors.push('Start and end dates are required');
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        errors.push('Start date must be before or equal to end date');
      }

      if (start < new Date()) {
        errors.push('Start date cannot be in the past');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateSessionTitle: (title: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push('Session title is required');
    } else if (title.trim().length < 3) {
      errors.push('Session title must be at least 3 characters long');
    } else if (title.trim().length > 200) {
      errors.push('Session title must not exceed 200 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

/**
 * Query keys for React Query cache management
 */
export const schedulingQueryKeys = {
  all: ['scheduling'] as const,
  sessions: () => [...schedulingQueryKeys.all, 'sessions'] as const,
  session: (id: string) => [...schedulingQueryKeys.sessions(), id] as const,
  mySessions: (role: string) => [...schedulingQueryKeys.sessions(), 'my-sessions', role] as const,
  upcoming: (role: string) => [...schedulingQueryKeys.sessions(), 'upcoming', role] as const,
  statistics: (role: string) => [...schedulingQueryKeys.sessions(), 'statistics', role] as const,
  availability: (userId: string) => [...schedulingQueryKeys.all, 'availability', userId] as const,
  requests: () => [...schedulingQueryKeys.all, 'requests'] as const,
  request: (id: string) => [...schedulingQueryKeys.requests(), id] as const
} as const;

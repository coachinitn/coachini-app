/**
 * Scheduling API Types
 *
 * TypeScript interfaces for scheduling operations
 */

export interface ScheduledSession {
  id: string;
  coachId: string;
  participantId: string;
  supervisorId?: string;
  themeId?: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  locationType: 'in_person' | 'virtual' | 'hybrid';
  location?: string;
  meetingLink?: string;
  notes?: string;
  feedbackSubmitted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRequest {
  id: string;
  requesterId: string;
  coachId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  preferredDate?: string;
  preferredTime?: string;
  reason?: string;
  message?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionStatistics {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  upcomingSessions: number;
  averageDuration: number;
  completionRate: number;
  noShowRate: number;
}

export interface CreateSessionDto {
  coachId: string;
  participantId: string;
  supervisorId?: string;
  themeId?: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  locationType: 'in_person' | 'virtual' | 'hybrid';
  location?: string;
  meetingLink?: string;
  notes?: string;
}

export interface UpdateSessionDto {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  locationType?: 'in_person' | 'virtual' | 'hybrid';
  location?: string;
  meetingLink?: string;
  notes?: string;
}

/**
 * Scheduling API Module
 *
 * Clean exports for scheduling and session management
 */

export { SchedulingService } from './scheduling-service';

export {
  schedulingQueries,
  getSchedulingErrorMessage,
  getSchedulingErrorKey,
  schedulingQueryKeys
} from './scheduling-queries';

export type {
  ScheduledSession,
  SessionRequest,
  Availability,
  SessionStatistics,
  CreateSessionDto,
  UpdateSessionDto
} from './scheduling.types';

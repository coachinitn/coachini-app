/**
 * Audit & Analytics API Module
 *
 * Clean exports for audit logging and analytics functionality
 */

export { AuditService } from './audit-service';

export {
  auditQueries,
  getAuditErrorMessage,
  getAuditErrorKey,
  auditQueryKeys
} from './audit-queries';

export type {
  AuditLog,
  AuditTrends,
  AuditAnomaly,
  AuditPattern,
  AuditDashboard,
  AuditReport,
  AnalyticsMetrics
} from './audit.types';

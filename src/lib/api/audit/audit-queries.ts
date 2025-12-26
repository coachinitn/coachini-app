/**
 * Audit & Analytics React Query Layer
 *
 * React Query queries for audit and analytics operations
 */

import { AuditService } from './audit-service';

export const auditQueries = {
  /**
   * Mutation for generating audit report
   */
  generateAuditReport: () => ({
    mutationFn: (options?: any) => AuditService.generateAuditReport(options)
  }),

  /**
   * Mutation for exporting audit logs
   */
  exportAuditLogs: () => ({
    mutationFn: (params: { format: 'csv' | 'json' | 'pdf'; filters?: any }) =>
      AuditService.exportAuditLogs(params.format, params.filters)
  }),

  /**
   * Query for getting audit logs
   */
  getAuditLogs: (page: number = 1, limit: number = 50, filters?: any) => ({
    queryKey: ['audit', 'logs', { page, limit, ...filters }],
    queryFn: () => AuditService.getAuditLogs(page, limit, filters)
  }),

  /**
   * Query for getting audit trends
   */
  getAuditTrends: (query?: any) => ({
    queryKey: ['audit', 'trends', { ...query }],
    queryFn: () => AuditService.getAuditTrends(query)
  }),

  /**
   * Query for detecting anomalies
   */
  detectAnomalies: (query?: any) => ({
    queryKey: ['audit', 'anomalies', { ...query }],
    queryFn: () => AuditService.detectAnomalies(query)
  }),

  /**
   * Query for analyzing patterns
   */
  analyzePatterns: (query?: any) => ({
    queryKey: ['audit', 'patterns', { ...query }],
    queryFn: () => AuditService.analyzePatterns(query)
  }),

  /**
   * Query for dashboard data
   */
  getAnalyticsDashboard: () => ({
    queryKey: ['audit', 'dashboard'],
    queryFn: () => AuditService.getAnalyticsDashboard()
  }),

  /**
   * Query for analytics metrics
   */
  getAnalyticsMetrics: (timeframe?: string) => ({
    queryKey: ['audit', 'metrics', { timeframe }],
    queryFn: () => AuditService.getAnalyticsMetrics(timeframe)
  }),

  /**
   * Query for compliance report
   */
  getComplianceReport: () => ({
    queryKey: ['audit', 'compliance'],
    queryFn: () => AuditService.getComplianceReport()
  })
};

/**
 * Error handling utilities
 */
export const getAuditErrorMessage = (error: any): string => {
  return AuditService.handleAuditError(error);
};

export const getAuditErrorKey = (error: any): string => {
  return AuditService.handleAuditError(error);
};

/**
 * Query keys for React Query cache management
 */
export const auditQueryKeys = {
  all: ['audit'] as const,
  logs: () => [...auditQueryKeys.all, 'logs'] as const,
  log: (page: number, limit: number) => [...auditQueryKeys.logs(), { page, limit }] as const,
  trends: () => [...auditQueryKeys.all, 'trends'] as const,
  anomalies: () => [...auditQueryKeys.all, 'anomalies'] as const,
  patterns: () => [...auditQueryKeys.all, 'patterns'] as const,
  dashboard: () => [...auditQueryKeys.all, 'dashboard'] as const,
  metrics: (timeframe?: string) => [...auditQueryKeys.all, 'metrics', { timeframe }] as const,
  compliance: () => [...auditQueryKeys.all, 'compliance'] as const,
  reports: () => [...auditQueryKeys.all, 'reports'] as const
} as const;

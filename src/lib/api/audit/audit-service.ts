/**
 * Audit & Analytics API Service
 *
 * Handles audit logging, analytics, trends, and compliance reporting
 */

import { apiRequest } from '@/lib/api-client';
import { AUDIT_ERROR_CODE_TO_I18N_MAP } from '@/lib/api/audit/error-codes';
import type {
  AuditLog,
  AuditTrends,
  AuditAnomaly,
  AuditPattern,
  AuditDashboard,
  AuditReport,
  AnalyticsMetrics
} from './audit.types';

export class AuditService {
  private static readonly BASE_PATH = '/audit';

  /**
   * Get audit logs
   */
  static async getAuditLogs(
    page: number = 1,
    limit: number = 50,
    filters?: {
      userId?: string;
      action?: string;
      resourceType?: string;
      startDate?: string;
      endDate?: string;
      severity?: string;
    }
  ): Promise<{
    data: AuditLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.userId && { userId: filters.userId }),
      ...(filters?.action && { action: filters.action }),
      ...(filters?.resourceType && { resourceType: filters.resourceType }),
      ...(filters?.startDate && { startDate: filters.startDate }),
      ...(filters?.endDate && { endDate: filters.endDate }),
      ...(filters?.severity && { severity: filters.severity })
    });

    return apiRequest(
      `${this.BASE_PATH}${params.toString() ? '?' + params.toString() : ''}`,
      {
        method: 'GET',
        requireAuth: true
      }
    );
  }

  /**
   * Get audit trends
   */
  static async getAuditTrends(query?: {
    timeframe?: string;
    groupBy?: string;
    eventTypes?: string[];
  }): Promise<AuditTrends> {
    const params = new URLSearchParams();

    if (query?.timeframe) params.append('timeframe', query.timeframe);
    if (query?.groupBy) params.append('groupBy', query.groupBy);
    if (query?.eventTypes) params.append('eventTypes', query.eventTypes.join(','));

    return apiRequest<AuditTrends>(
      `${this.BASE_PATH}/analytics/trends${params.toString() ? '?' + params.toString() : ''}`,
      {
        method: 'GET',
        requireAuth: true
      }
    );
  }

  /**
   * Detect anomalies in audit data
   */
  static async detectAnomalies(query?: {
    timeframe?: string;
    sensitivity?: number;
  }): Promise<AuditAnomaly[]> {
    const params = new URLSearchParams();

    if (query?.timeframe) params.append('timeframe', query.timeframe);
    if (query?.sensitivity) params.append('sensitivity', query.sensitivity.toString());

    return apiRequest<AuditAnomaly[]>(
      `${this.BASE_PATH}/analytics/anomalies${params.toString() ? '?' + params.toString() : ''}`,
      {
        method: 'GET',
        requireAuth: true
      }
    );
  }

  /**
   * Analyze audit patterns
   */
  static async analyzePatterns(query?: {
    timeframe?: string;
    groupBy?: string;
    eventTypes?: string[];
  }): Promise<{
    patterns: AuditPattern[];
    insights: string[];
    generatedAt: string;
  }> {
    const params = new URLSearchParams();

    if (query?.timeframe) params.append('timeframe', query.timeframe);
    if (query?.groupBy) params.append('groupBy', query.groupBy);
    if (query?.eventTypes) params.append('eventTypes', query.eventTypes.join(','));

    return apiRequest(
      `${this.BASE_PATH}/analytics/patterns${params.toString() ? '?' + params.toString() : ''}`,
      {
        method: 'GET',
        requireAuth: true
      }
    );
  }

  /**
   * Get analytics dashboard
   */
  static async getAnalyticsDashboard(): Promise<AuditDashboard> {
    return apiRequest<AuditDashboard>(`${this.BASE_PATH}/analytics/dashboard`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Get detailed analytics metrics
   */
  static async getAnalyticsMetrics(
    timeframe?: string
  ): Promise<AnalyticsMetrics> {
    const params = timeframe ? `?timeframe=${timeframe}` : '';
    return apiRequest<AnalyticsMetrics>(`${this.BASE_PATH}/analytics/metrics${params}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Generate audit report
   */
  static async generateAuditReport(options?: {
    format?: 'pdf' | 'csv' | 'json';
    includeAnalytics?: boolean;
    dateRange?: {
      startDate: string;
      endDate: string;
    };
  }): Promise<{
    reportId: string;
    downloadUrl: string;
    generatedAt: string;
    expiresAt: string;
  }> {
    return apiRequest(
      `${this.BASE_PATH}/reports/generate`,
      {
        method: 'POST',
        body: JSON.stringify(options || {}),
        requireAuth: true
      }
    );
  }

  /**
   * Get compliance report
   */
  static async getComplianceReport(): Promise<{
    complianceStatus: string;
    violations: any[];
    recommendations: string[];
    lastChecked: string;
  }> {
    return apiRequest(
      `${this.BASE_PATH}/reports/compliance`,
      {
        method: 'GET',
        requireAuth: true
      }
    );
  }

  /**
   * Export audit logs
   */
  static async exportAuditLogs(
    format: 'csv' | 'json' | 'pdf' = 'csv',
    filters?: any
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...filters
    });

    const response = await fetch(
      `/api${this.BASE_PATH}/export?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export audit logs');
    }

    return response.blob();
  }

  /**
   * Handle API errors
   */
  static handleAuditError(error: any): string {
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
        return 'errors.invalidAuditQuery';
      case 401:
        return 'errors.unauthorized';
      case 403:
        return 'errors.forbidden';
      case 404:
        return 'errors.auditNotFound';
      case 500:
        return 'errors.auditProcessingFailed';
      default:
        return 'errors.unexpected';
    }
  }

  private static mapErrorCodeToI18n(errorCode: string): string | null {
    return AUDIT_ERROR_CODE_TO_I18N_MAP[errorCode] || null;
  }

  private static mapErrorMessage(message: string): string | null {
    if (!message || typeof message !== 'string') return null;

    const messageLower = message.toLowerCase();

    if (messageLower.includes('not found')) {
      return 'errors.auditNotFound';
    }

    if (messageLower.includes('export') && messageLower.includes('failed')) {
      return 'errors.exportFailed';
    }

    if (messageLower.includes('report') && messageLower.includes('failed')) {
      return 'errors.reportGenerationFailed';
    }

    if (messageLower.includes('permission')) {
      return 'errors.insufficientPermissions';
    }

    return null;
  }
}

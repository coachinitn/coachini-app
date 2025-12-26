/**
 * Audit & Analytics API Types
 *
 * TypeScript interfaces for audit and analytics operations
 */

export interface AuditLog {
  id: string;
  userId: string;
  userEmail?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AuditTrends {
  timeframe: string;
  groupBy: string;
  totalEvents: number;
  data: Array<{
    period: string;
    eventCount: number;
    eventTypes: Record<string, number>;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercentage: number;
}

export interface AuditAnomaly {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  affectedUsers?: string[];
  recommendedAction?: string;
  confidence: number;
}

export interface AuditPattern {
  type: string;
  description: string;
  confidence: number;
  frequency: string;
}

export interface AuditDashboard {
  summary: {
    totalEvents: number;
    eventsToday: number;
    uniqueUsers: number;
    errorRate: number;
  };
  charts: {
    eventsByHour: Array<{ hour: number; count: number }>;
    eventsByType: Array<{ type: string; count: number }>;
    topUsers: Array<{ userId: string; count: number }>;
    severity: Array<{ level: string; count: number }>;
  };
  recentEvents: AuditLog[];
  alerts: Array<{
    type: string;
    message: string;
    severity: string;
    timestamp: string;
  }>;
}

export interface AuditReport {
  id: string;
  title: string;
  format: 'pdf' | 'csv' | 'json';
  generatedAt: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalEvents: number;
    uniqueUsers: number;
    criticalEvents: number;
  };
  sections: Array<{
    title: string;
    content: any;
  }>;
}

export interface AnalyticsMetrics {
  timestamp: string;
  period: string;
  metrics: {
    activeUsers: number;
    totalRequests: number;
    successRate: number;
    averageResponseTime: number;
    errorRate: number;
    topEndpoints: Array<{
      endpoint: string;
      requestCount: number;
      errorCount: number;
    }>;
    topUsers: Array<{
      userId: string;
      requestCount: number;
    }>;
  };
}

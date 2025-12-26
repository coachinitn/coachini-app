/**
 * RBAC Audit & Logging System
 * 
 * Comprehensive audit trail for permission checks and access control
 */

import { Role, Permission } from '../redux/features/user/slice';

// ==================== AUDIT TYPES ====================

export enum AuditEventType {
  PERMISSION_CHECK = 'permission_check',
  PAGE_ACCESS = 'page_access',
  NAVIGATION_FILTER = 'navigation_filter',
  ROLE_SWITCH = 'role_switch',
  PERMISSION_DENIED = 'permission_denied',
  CACHE_HIT = 'cache_hit',
  CACHE_MISS = 'cache_miss',
}

export interface AuditEvent {
  id: string;
  timestamp: number;
  type: AuditEventType;
  userId?: string;
  sessionId?: string;
  userRoles: Role[];
  currentRole: Role | null;
  
  // Event-specific data
  permission?: Permission;
  permissions?: Permission[];
  path?: string;
  result: boolean;
  context?: Record<string, any>;
  
  // Performance data
  duration?: number;
  cacheHit?: boolean;
  
  // Request context
  userAgent?: string;
  ipAddress?: string;
  referer?: string;
}

export interface AuditSummary {
  totalEvents: number;
  eventsByType: Record<AuditEventType, number>;
  permissionDenials: number;
  cacheHitRate: number;
  averageResponseTime: number;
  topDeniedPermissions: Array<{ permission: Permission; count: number }>;
  topAccessedPages: Array<{ path: string; count: number }>;
  userActivity: Record<string, number>;
}

// ==================== AUDIT LOGGER ====================

class AuditLogger {
  private events: AuditEvent[] = [];
  private maxEvents: number = 10000;
  private enabled: boolean = true;

  /**
   * Log an audit event
   */
  log(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    if (!this.enabled) return;

    const auditEvent: AuditEvent = {
      ...event,
      id: this.generateId(),
      timestamp: Date.now(),
    };

    this.events.push(auditEvent);

    // Maintain max events limit
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(auditEvent);
    }

    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(auditEvent);
    }
  }

  /**
   * Log permission check
   */
  logPermissionCheck(
    userId: string | undefined,
    userRoles: Role[],
    currentRole: Role | null,
    permission: Permission,
    result: boolean,
    duration?: number,
    cacheHit?: boolean,
    context?: Record<string, any>
  ): void {
    this.log({
      type: AuditEventType.PERMISSION_CHECK,
      userId,
      userRoles,
      currentRole,
      permission,
      result,
      duration,
      cacheHit,
      context,
    });
  }

  /**
   * Log page access attempt
   */
  logPageAccess(
    userId: string | undefined,
    userRoles: Role[],
    currentRole: Role | null,
    path: string,
    result: boolean,
    duration?: number,
    context?: Record<string, any>
  ): void {
    this.log({
      type: AuditEventType.PAGE_ACCESS,
      userId,
      userRoles,
      currentRole,
      path,
      result,
      duration,
      context,
    });
  }

  /**
   * Log navigation filtering
   */
  logNavigationFilter(
    userId: string | undefined,
    userRoles: Role[],
    currentRole: Role | null,
    totalItems: number,
    filteredItems: number,
    duration?: number,
    cacheHit?: boolean
  ): void {
    this.log({
      type: AuditEventType.NAVIGATION_FILTER,
      userId,
      userRoles,
      currentRole,
      result: true,
      duration,
      cacheHit,
      context: {
        totalItems,
        filteredItems,
        filterRatio: filteredItems / totalItems,
      },
    });
  }

  /**
   * Log role switch
   */
  logRoleSwitch(
    userId: string | undefined,
    userRoles: Role[],
    fromRole: Role | null,
    toRole: Role | null,
    context?: Record<string, any>
  ): void {
    this.log({
      type: AuditEventType.ROLE_SWITCH,
      userId,
      userRoles,
      currentRole: toRole,
      result: true,
      context: {
        fromRole,
        toRole,
        ...context,
      },
    });
  }

  /**
   * Get audit summary
   */
  getSummary(timeRange?: { from: number; to: number }): AuditSummary {
    let events = this.events;
    
    if (timeRange) {
      events = events.filter(
        event => event.timestamp >= timeRange.from && event.timestamp <= timeRange.to
      );
    }

    const eventsByType = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<AuditEventType, number>);

    const permissionDenials = events.filter(
      event => event.type === AuditEventType.PERMISSION_CHECK && !event.result
    ).length;

    const cacheEvents = events.filter(event => event.cacheHit !== undefined);
    const cacheHits = cacheEvents.filter(event => event.cacheHit).length;
    const cacheHitRate = cacheEvents.length > 0 ? cacheHits / cacheEvents.length : 0;

    const eventsWithDuration = events.filter(event => event.duration !== undefined);
    const averageResponseTime = eventsWithDuration.length > 0
      ? eventsWithDuration.reduce((sum, event) => sum + (event.duration || 0), 0) / eventsWithDuration.length
      : 0;

    const deniedPermissions = events
      .filter(event => event.type === AuditEventType.PERMISSION_CHECK && !event.result && event.permission)
      .reduce((acc, event) => {
        const permission = event.permission!;
        acc[permission] = (acc[permission] || 0) + 1;
        return acc;
      }, {} as Record<Permission, number>);

    const topDeniedPermissions = Object.entries(deniedPermissions)
      .map(([permission, count]) => ({ permission: permission as Permission, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const accessedPages = events
      .filter(event => event.type === AuditEventType.PAGE_ACCESS && event.path)
      .reduce((acc, event) => {
        const path = event.path!;
        acc[path] = (acc[path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topAccessedPages = Object.entries(accessedPages)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const userActivity = events
      .filter(event => event.userId)
      .reduce((acc, event) => {
        const userId = event.userId!;
        acc[userId] = (acc[userId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalEvents: events.length,
      eventsByType,
      permissionDenials,
      cacheHitRate,
      averageResponseTime,
      topDeniedPermissions,
      topAccessedPages,
      userActivity,
    };
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 100): AuditEvent[] {
    return this.events.slice(-limit).reverse();
  }

  /**
   * Clear audit log
   */
  clear(): void {
    this.events = [];
  }

  /**
   * Configure audit logger
   */
  configure(options: { maxEvents?: number; enabled?: boolean }): void {
    if (options.maxEvents) this.maxEvents = options.maxEvents;
    if (options.enabled !== undefined) this.enabled = options.enabled;
  }

  /**
   * Export audit log
   */
  export(): AuditEvent[] {
    return [...this.events];
  }

  // ==================== PRIVATE METHODS ====================

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logToConsole(event: AuditEvent): void {
    const color = event.result ? 'green' : 'red';
    console.log(
      `%c[RBAC Audit] ${event.type}`,
      `color: ${color}`,
      {
        user: event.userId,
        roles: event.userRoles,
        permission: event.permission,
        path: event.path,
        result: event.result,
        duration: event.duration,
        cacheHit: event.cacheHit,
      }
    );
  }

  private async sendToExternalService(event: AuditEvent): Promise<void> {
    // Implementation for external logging service
    // This could be sent to services like DataDog, LogRocket, etc.
    try {
      // Example: await fetch('/api/audit', { method: 'POST', body: JSON.stringify(event) });
    } catch (error) {
      console.error('Failed to send audit event to external service:', error);
    }
  }
}

// ==================== SINGLETON INSTANCE ====================

export const auditLogger = new AuditLogger();

// ==================== UTILITY FUNCTIONS ====================

/**
 * Quick permission check with audit
 */
export const auditPermissionCheck = (
  userId: string | undefined,
  userRoles: Role[],
  currentRole: Role | null,
  permission: Permission,
  result: boolean,
  context?: Record<string, any>
): void => {
  auditLogger.logPermissionCheck(userId, userRoles, currentRole, permission, result, undefined, undefined, context);
};

/**
 * Quick page access audit
 */
export const auditPageAccess = (
  userId: string | undefined,
  userRoles: Role[],
  currentRole: Role | null,
  path: string,
  result: boolean,
  context?: Record<string, any>
): void => {
  auditLogger.logPageAccess(userId, userRoles, currentRole, path, result, undefined, context);
};

export default auditLogger;

/**
 * Shared Types between Frontend and Backend
 * 
 * These types are shared between the frontend SyncBase client and the backend API
 * to ensure consistency and type safety across the entire system.
 */

import { 
  WebSocketEventType, 
  DomainEventType, 
  SubscriptionType, 
  AuthEventType 
} from '../constants';

// ========================================
// 🎯 SYNCBASE RESPONSE TYPES
// ========================================

/**
 * Standard SyncBase response format
 */
export interface SyncBaseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    version?: string;
  };
}

/**
 * Event response wrapper
 */
export interface EventResponse<T = any> extends SyncBaseResponse<T> {
  event: WebSocketEventType;
  acknowledged: boolean;
}

// ========================================
// 🔐 AUTHENTICATION TYPES
// ========================================

/**
 * Authentication token data
 */
export interface AuthTokenData {
  token: string;
  expiresAt: string;
  refreshToken?: string;
  userId: string;
  permissions: string[];
  roles: string[];
}

/**
 * Token expiration warning data
 */
export interface TokenExpirationData {
  expiresAt: string;
  warningLevel: 'soon' | 'urgent' | 'expired';
  timeRemaining: number; // milliseconds
  refreshRequired: boolean;
}

// ========================================
// 📡 SUBSCRIPTION TYPES
// ========================================

/**
 * Subscription request data
 */
export interface SubscriptionRequest {
  type: SubscriptionType;
  target: string;
  filters?: Record<string, any>;
  options?: SubscriptionOptions;
  metadata?: Record<string, any>;
}

/**
 * Subscription options
 */
export interface SubscriptionOptions {
  autoReconnect?: boolean;
  bufferSize?: number;
  priority?: 'low' | 'normal' | 'high';
  throttle?: number; // milliseconds
}

/**
 * Active subscription data
 */
export interface ActiveSubscription {
  id: string;
  socketId: string;
  userId: string;
  type: SubscriptionType;
  target: string;
  filters: Record<string, any>;
  options: SubscriptionOptions;
  createdAt: Date;
  lastActivity: Date;
}

/**
 * Subscription response data
 */
export interface SubscriptionResponseData {
  subscriptionId: string;
  type: SubscriptionType;
  target: string;
  subscribedAt: string;
  options: SubscriptionOptions;
}

// ========================================
// 🔄 CONNECTION TYPES
// ========================================

/**
 * Connection state
 */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

/**
 * Connection state data
 */
export interface ConnectionState {
  status: ConnectionStatus;
  connectedAt?: Date;
  lastActivity?: Date;
  reconnectAttempts: number;
  latency?: number;
  error?: string;
}

/**
 * Client state data
 */
export interface ClientState {
  isConnected: boolean;
  isAuthenticated: boolean;
  connectionState: ConnectionState;
  activeSubscriptions: Map<string, ActiveSubscription>;
  queuedOperations: QueuedOperation[];
  lastActivity: Date;
}

// ========================================
// 📊 OPERATION QUEUE TYPES
// ========================================

/**
 * Queued operation for offline support
 */
export interface QueuedOperation {
  id: string;
  event: WebSocketEventType;
  data: any;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
  priority: 'low' | 'normal' | 'high';
}

// ========================================
// 📈 METRICS TYPES
// ========================================

/**
 * SyncBase metrics data
 */
export interface SyncBaseMetrics {
  connections: {
    total: number;
    active: number;
    authenticated: number;
  };
  subscriptions: {
    total: number;
    byType: Record<SubscriptionType, number>;
  };
  events: {
    sent: number;
    received: number;
    failed: number;
    queued: number;
  };
  performance: {
    averageLatency: number;
    messageRate: number;
    errorRate: number;
  };
  timestamp: string;
}

/**
 * Health check data
 */
export interface HealthCheckData {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  version: string;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
    websocket: 'up' | 'down';
  };
  timestamp: string;
}

// ========================================
// 🎯 EVENT DATA TYPES
// ========================================

/**
 * Generic event data wrapper
 */
export interface EventData<T = any> {
  type: WebSocketEventType | DomainEventType;
  payload: T;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Broadcast event data
 */
export interface BroadcastEventData<T = any> extends EventData<T> {
  targets: string[]; // subscription targets
  priority: 'low' | 'normal' | 'high';
  persistent?: boolean; // should be stored for offline users
}

// ========================================
// 🔧 UTILITY TYPES
// ========================================

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    nextCursor?: string;
    prevCursor?: string;
  };
  meta?: Record<string, any>;
}

/**
 * Filter options for queries
 */
export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dateRange?: {
    from: string;
    to: string;
  };
  status?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}

// ========================================
// 🎯 TYPE GUARDS
// ========================================

/**
 * Type guard for SyncBase response
 */
export function isSyncBaseResponse<T>(obj: any): obj is SyncBaseResponse<T> {
  return obj && typeof obj === 'object' && typeof obj.success === 'boolean';
}

/**
 * Type guard for event response
 */
export function isEventResponse<T>(obj: any): obj is EventResponse<T> {
  return isSyncBaseResponse(obj) &&
         typeof (obj as any).event === 'string' &&
         typeof (obj as any).acknowledged === 'boolean';
}

/**
 * Type guard for subscription request
 */
export function isSubscriptionRequest(obj: any): obj is SubscriptionRequest {
  return obj && typeof obj === 'object' && 
         typeof obj.type === 'string' && 
         typeof obj.target === 'string';
}

// ========================================
// 🎯 EXPORT TYPES FOR CONVENIENCE
// ========================================

export type {
  WebSocketEventType,
  DomainEventType,
  SubscriptionType,
  AuthEventType,
} from '../constants';

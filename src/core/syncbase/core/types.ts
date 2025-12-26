/**
 * Core types for SyncBase Client SDK
 */

export interface SyncBaseConfig {
  url: string;
  auth: AuthConfig;
  options?: ConnectionOptions;
}

export interface AuthConfig {
  getToken: () => string | null | Promise<string | null>;
  refreshToken?: () => Promise<string>;
  onTokenExpired?: () => void;
  onTokenRefresh?: (token: string) => void;
}

export interface ConnectionOptions {
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  timeout?: number;
  offlineSupport?: boolean;
  debug?: boolean;
  transports?: string[];
  path?: string;
}

export interface ConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastConnected?: Date;
  reconnectAttempts: number;
  error?: string;
}

export interface EventResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginationOptions {
  limit?: number;
  cursor?: string;
  direction?: 'before' | 'after';
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    hasMore: boolean;
    nextCursor?: string;
    prevCursor?: string;
    limit: number;
  };
  meta?: any;
}

export interface SubscriptionOptions {
  type: string;
  target: string;
  filters?: Record<string, any>;
  options?: Record<string, any>;
}

export interface StorageConfig {
  dbName: string;
  version: number;
  stores: Record<string, {
    keyPath: string;
    indexes: string[];
  }>;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
  strategy?: 'lru' | 'fifo'; // Cache eviction strategy
}

// Event types
export type SyncBaseEvent =
  | 'connection:status'
  | 'connection:connected'    // ✅ NEW: Specific connected event (like HTML test)
  | 'connection:disconnected' // ✅ NEW: Specific disconnected event (like HTML test)
  | 'connection:error'
  | 'connection:reconnect'
  | 'auth:token_refresh'
  | 'auth:token_expired'
  | 'subscription:data'
  | 'subscription:error'
  | 'offline:queue_updated'
  | 'offline:sync_completed';

export interface EventListener<T = any> {
  (data: T): void;
}

export interface QueuedOperation {
  id: string;
  event: string;
  payload: any;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
}

// Error types
export interface SyncBaseError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface ConnectionError extends SyncBaseError {
  code: 'CONNECTION_FAILED' | 'CONNECTION_TIMEOUT' | 'CONNECTION_LOST';
}

export interface AuthError extends SyncBaseError {
  code: 'AUTH_FAILED' | 'TOKEN_EXPIRED' | 'TOKEN_INVALID';
}

export interface ValidationError extends SyncBaseError {
  code: 'VALIDATION_FAILED';
  details: {
    field: string;
    message: string;
  }[];
}

// Storage interfaces
export interface StorageAdapter {
  get<T>(store: string, key: string): Promise<T | null>;
  set<T>(store: string, key: string, value: T): Promise<void>;
  delete(store: string, key: string): Promise<void>;
  getMany<T>(store: string, options?: {
    limit?: number;
    indexName?: string;
    range?: IDBKeyRange;
  }): Promise<T[]>;
  clear(store: string): Promise<void>;
  count(store: string): Promise<number>;
}

// Event manager interfaces
export interface EventManagerConfig {
  debug?: boolean;
  maxListeners?: number;
}

export interface EventSubscription {
  event: string;
  callback: EventListener;
  once?: boolean;
}

// Connection manager interfaces
export interface ConnectionManagerConfig extends ConnectionOptions {
  url: string;
  auth: AuthConfig;
}

export interface ReconnectStrategy {
  attempt: number;
  delay: number;
  maxAttempts: number;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Response wrapper types
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  metadata?: {
    timestamp: Date;
    executionTime?: number;
    correlationId?: string;
  };
}

export interface ErrorResponse {
  success: false;
  error: SyncBaseError;
  metadata?: {
    timestamp: Date;
    executionTime?: number;
    correlationId?: string;
  };
}

export type SyncBaseResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// WebSocket event types
export interface WebSocketEventData {
  type: string;
  payload: any;
  metadata?: {
    timestamp: Date;
    correlationId?: string;
    userId?: string;
  };
}

// Subscription management types
export interface ActiveSubscription {
  id: string;
  type: string;
  target: string;
  filters: Record<string, any>;
  options: Record<string, any>;
  createdAt: Date;
  lastActivity: Date;
}

export interface SubscriptionManager {
  subscribe(options: SubscriptionOptions): Promise<string>;
  unsubscribe(subscriptionId: string): Promise<void>;
  getActiveSubscriptions(): ActiveSubscription[];
  isSubscribed(type: string, target: string): boolean;
}

// Client state management
export interface ClientState {
  isInitialized: boolean;
  isConnected: boolean;
  isAuthenticated: boolean;
  connectionState: ConnectionState;
  activeSubscriptions: Map<string, ActiveSubscription>;
  queuedOperations: QueuedOperation[];
  lastActivity: Date;
}

// Module interfaces
export interface SyncBaseModule {
  name: string;
  initialize(client: any): Promise<void>;
  cleanup(): Promise<void>;
  isInitialized(): boolean;
}

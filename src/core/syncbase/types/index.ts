/**
 * SyncBase Types
 * Centralized type definitions for the SyncBase client
 */

// Export shared types
export * from './shared';

// Core types
export interface SyncBaseConfig {
  url: string;
  options?: {
    autoReconnect?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    timeout?: number;
    offlineSupport?: boolean;
    debug?: boolean;
    transports?: string[];
    path?: string;
  };
  auth?: {
    token?: string;
    refreshToken?: string;
  };
  storage?: {
    prefix?: string;
    driver?: 'localStorage' | 'sessionStorage' | 'indexedDB';
  };
}

// Event types
export interface EventResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  acknowledged: boolean;
}

// Pagination types
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

// Storage types
export interface StorageConfig {
  prefix: string;
  driver: 'localStorage' | 'sessionStorage' | 'indexedDB';
  encryption?: boolean;
  compression?: boolean;
}

// Connection types
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface ConnectionState {
  status: ConnectionStatus;
  connectedAt?: Date;
  lastActivity?: Date;
  reconnectAttempts: number;
  latency?: number;
  error?: string;
}

// Client state types
export interface ClientState {
  isConnected: boolean;
  isAuthenticated: boolean;
  connectionState: ConnectionState;
  activeSubscriptions: Map<string, any>;
  queuedOperations: any[];
  lastActivity: Date;
}

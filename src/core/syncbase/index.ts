/**
 * SyncBase Client SDK
 * Main entry point for the SyncBase client library
 * Replicated from api.coachini syncbase-client for Next.js integration
 */

// Core exports
export { SyncBaseClient } from './core/SyncBaseClient';
export { EventManager } from './core/EventManager';
export { ConnectionManager } from './core/ConnectionManager';
export { StorageManager } from './core/StorageManager';

// Constants exports
export {
  WEBSOCKET_EVENTS,
  DOMAIN_EVENTS,
  SUBSCRIPTION_TYPES,
  AUTH_EVENTS,
  EVENT_CATEGORIES,
  Events,
  type WebSocketEventType,
  type DomainEventType,
  type SubscriptionType,
  type AuthEventType,
} from './constants';

// Core types
export type {
  SyncBaseConfig,
  AuthConfig,
  ConnectionOptions,
  ConnectionState,
  EventResponse,
  PaginationOptions,
  PaginatedResponse,
  SubscriptionOptions,
  StorageConfig,
  CacheOptions,
  SyncBaseEvent,
  EventListener,
  QueuedOperation,
  SyncBaseError,
  ConnectionError,
  AuthError,
  ValidationError
} from './core/types';

// Shared type exports
export type {
  SyncBaseResponse,
  AuthTokenData,
  TokenExpirationData,
  SubscriptionRequest as SharedSubscriptionRequest,
  SubscriptionOptions as SharedSubscriptionOptions,
  ActiveSubscription,
  SubscriptionResponseData,
  QueuedOperation as SharedQueuedOperation,
  SyncBaseMetrics,
  HealthCheckData,
  EventData,
  BroadcastEventData,
  FilterOptions,
  isSyncBaseResponse,
  isEventResponse,
  isSubscriptionRequest
} from './types/shared';

// Notification exports
export { NotificationClient } from './modules/notifications/NotificationClient';
export { useNotifications } from './modules/notifications/useNotifications';

export type {
  Notification,
  NotificationCategory,
  NotificationPriority,
  NotificationType,
  NotificationMetadata,
  NotificationFilters,
  NotificationOptions,
  NotificationStats,
  CreateNotificationData,
  NotificationSubscriptionData,
  NotificationUpdateData,
  UseNotificationsOptions,
  UseNotificationsReturn
} from './modules/notifications/types';

// Messenger exports
export { MessengerClient } from './modules/messenger/MessengerClient';
export { useConversations } from './modules/messenger/useConversations';
export { useMessenger } from './modules/messenger/useMessenger';

export type {
  Conversation,
  Message,
  User,
  MessageReaction,
  MessageAttachment,
  ConversationType,
  MessageType,
  ConversationFilters,
  MessageFilters,
  ConversationOptions,
  MessageOptions,
  CreateConversationData,
  SendMessageData,
  EditMessageData,
  UseConversationsOptions,
  UseConversationsReturn,
  UseMessengerOptions,
  UseMessengerReturn
} from './modules/messenger/types';

// Provider exports
export { SyncBaseProvider } from './providers/SyncBaseProvider';
export { useSyncBase } from './providers/SyncBaseProvider';

// Enhanced hooks
export {
  useSyncBaseEnhanced,
  type UseSyncBaseEnhancedReturn,
  type HealthCheckResult,
  type ConnectionQuality
} from './hooks/useSyncBaseEnhanced';

// Component exports
export { SyncBaseDebugPanel, useSyncBaseDebug } from './components/SyncBaseDebugPanel';

// Utility exports
export {
  createPaginationOptions,
  mergePaginatedResults,
  sortByCursor,
  extractNextCursor,
  createCursorQuery,
  hasMoreItems,
  calculatePaginationMeta,
  validatePaginationOptions,
  PaginationManager
} from './utils/pagination';

export {
  isIndexedDBAvailable,
  isLocalStorageAvailable,
  isSessionStorageAvailable,
  safeLocalStorage,
  safeSessionStorage,
  jsonLocalStorage,
  jsonSessionStorage,
  getStorageSize,
  getLocalStorageSize,
  getSessionStorageSize,
  formatBytes,
  getStorageQuota,
  clearSyncBaseStorage,
  checkStorageHealth
} from './utils/storage';

export {
  TokenManager,
  parseJWT,
  getTokenExpiration,
  getUserInfoFromToken,
  createTokenInfoFromJWT,
  defaultTokenManager,
  authHelpers
} from './utils/auth';

export type { TokenInfo } from './utils/auth';

// Version
export const VERSION = '1.0.0';

// Default configurations
export const DEFAULT_CONFIG = {
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
  timeout: 20000,
  offlineSupport: true,
  debug: false,
  transports: ['websocket', 'polling'],
  path: '/syncbase/socket.io'
};

export const DEFAULT_PAGINATION = {
  limit: 20,
  direction: 'before' as const,
  sortBy: 'cursor',
  sortOrder: 'DESC' as const
};

export const DEFAULT_STORAGE_CONFIG = {
  dbName: 'syncbase-cache',
  version: 1,
  stores: {
    notifications: {
      keyPath: 'id',
      indexes: ['cursor', 'isRead', 'createdAt', 'recipientId']
    },
    conversations: {
      keyPath: 'id',
      indexes: ['cursor', 'lastMessageAt', 'createdAt']
    },
    messages: {
      keyPath: 'id',
      indexes: ['cursor', 'conversationId', 'createdAt', 'senderId']
    },
    operations: {
      keyPath: 'id',
      indexes: ['timestamp', 'event']
    }
  }
};

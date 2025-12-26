/**
 * Notification types for SyncBase Client
 */

import { PaginationOptions, PaginatedResponse } from '../../core/types';

// Core notification interfaces
export interface Notification {
  id: string;
  templateKey?: string;
  recipientId: string;
  senderId?: string;
  title: string;
  message: string;
  content: string; // Alias for message for browser notifications
  category: NotificationCategory;
  priority: NotificationPriority;
  type: NotificationType;
  isRead: boolean;
  readAt?: string;
  metadata?: NotificationMetadata;
  actionUrl?: string;
  actionLabel?: string;
  imageUrl?: string;
  path?: string; // Navigation path for click actions
  isActionNotification?: boolean; // Flag for action notifications (from HTML test)
  scheduledFor?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  cursor: string;
}

// Backend-compatible types (match exactly with api.coachini)
export type NotificationCategory =
  | 'session'
  | 'theme'
  | 'program'
  | 'profile'
  | 'rating'
  | 'system'
  | 'reminder'
  | 'alert'
  | 'message';

export type NotificationPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type NotificationType =
  | 'info'
  | 'action';

export interface NotificationMetadata {
  source?: string;
  tags?: string[];
  icon?: string; // Icon URL for browser notifications
  isActionNotification?: boolean; // Flag for action notifications
  data?: Record<string, any>;
  tracking?: {
    campaignId?: string;
    segmentId?: string;
    experimentId?: string;
  };
  delivery?: {
    channels?: string[];
    retryCount?: number;
    lastAttempt?: string;
  };
}

// Filtering and options
export interface NotificationFilters {
  isRead?: boolean;
  category?: NotificationCategory | NotificationCategory[];
  priority?: NotificationPriority | NotificationPriority[];
  type?: NotificationType | NotificationType[];
  senderId?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  search?: string;
}

export interface NotificationOptions extends PaginationOptions {
  filters?: NotificationFilters;
  includeRead?: boolean;
  includeExpired?: boolean;
  search?: string; // Add search support like HTML test
}

// Statistics
export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: Record<NotificationCategory, number>;
  byPriority: Record<NotificationPriority, number>;
  byType: Record<NotificationType, number>;
  recent: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

// Creation and updates
export interface CreateNotificationData {
  templateKey?: string;
  recipientId?: string;
  senderId?: string;
  title: string;
  message?: string; // For frontend compatibility
  content?: string; // For backend compatibility
  category: NotificationCategory;
  priority?: NotificationPriority;
  type?: NotificationType;
  metadata?: NotificationMetadata;
  actionUrl?: string;
  actionLabel?: string;
  imageUrl?: string;
  scheduledFor?: string;
  expiresAt?: string;
}

export interface NotificationUpdateData {
  id: string;
  isRead?: boolean;
  readAt?: string;
  metadata?: Partial<NotificationMetadata>;
}

export interface NotificationSubscriptionData {
  subscriptionId: string;
  userId: string;
  subscribedAt: string;
  preferences: {
    categories: NotificationCategory[];
    priorities: NotificationPriority[];
    channels: string[];
  };
}

// React hook types
export interface UseNotificationsOptions {
  limit?: number;
  filters?: NotificationFilters;
  autoRefresh?: boolean;
  refreshInterval?: number;
  markAsRead?: boolean;
  enableSounds?: boolean;
  onNotificationReceived?: (notification: Notification) => void;
  onNotificationRead?: (notificationId: string) => void;
  onError?: (error: Error) => void;
}

export interface UseNotificationsReturn {
  // Data
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats | null;
  
  // State
  isLoading: boolean;
  isSubscribed: boolean;
  hasMore: boolean;
  error: Error | null;
  
  // Actions
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  markAsRead: (notificationIds: string[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  createNotification: (data: CreateNotificationData) => Promise<Notification>;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;

  // Template Management (Admin Only)
  getTemplates: () => Promise<any[]>;
  createTemplate: (templateData: any) => Promise<any>;
  updateTemplate: (templateId: string, templateData: any) => Promise<any>;

  // Browser Notifications
  showBrowserNotification: (notification: Notification) => Promise<void>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  
  // Filters
  setFilters: (filters: NotificationFilters) => void;
  clearFilters: () => void;
  
  // Utils
  getNotificationById: (id: string) => Notification | undefined;
  getUnreadNotifications: () => Notification[];
  getNotificationsByCategory: (category: NotificationCategory) => Notification[];
}

// Template types (for admin/system use)
export interface NotificationTemplate {
  id: string;
  key: string;
  name: string;
  description?: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  type: NotificationType;
  titleTemplate: string;
  messageTemplate: string;
  variables: string[];
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationTemplateData {
  key: string;
  name: string;
  description?: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  type: NotificationType;
  titleTemplate: string;
  messageTemplate: string;
  variables: string[];
  metadata?: Record<string, any>;
}

export interface UpdateNotificationTemplateData {
  name?: string;
  description?: string;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  type?: NotificationType;
  titleTemplate?: string;
  messageTemplate?: string;
  variables?: string[];
  metadata?: Record<string, any>;
  isActive?: boolean;
}

// Bulk operations
export interface BulkNotificationOperation {
  action: 'mark_read' | 'mark_unread' | 'delete';
  notificationIds: string[];
  filters?: NotificationFilters;
}

export interface BulkNotificationResult {
  success: boolean;
  processedCount: number;
  failedCount: number;
  errors?: Array<{
    notificationId: string;
    error: string;
  }>;
}

// Real-time events
export interface NotificationEvent {
  type: 'notification:new' | 'notification:updated' | 'notification:deleted';
  notification: Notification;
  timestamp: string;
}

export interface NotificationCountEvent {
  type: 'notifications:unread_count';
  count: number;
  userId: string;
  timestamp: string;
}

// Delivery and channels
export interface NotificationDelivery {
  id: string;
  notificationId: string;
  channel: 'websocket' | 'email' | 'sms' | 'push';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  attempts: number;
  lastAttempt?: string;
  deliveredAt?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  userId: string;
  categories: Record<NotificationCategory, boolean>;
  priorities: Record<NotificationPriority, boolean>;
  channels: Record<string, boolean>;
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;   // HH:mm format
    timezone: string;
  };
  frequency?: {
    immediate: boolean;
    digest: 'none' | 'daily' | 'weekly';
    digestTime?: string; // HH:mm format
  };
}

// Error types
export interface NotificationError {
  code: string;
  message: string;
  notificationId?: string;
  details?: any;
}

// Pagination response for notifications
export type NotificationListResponse = PaginatedResponse<Notification>;

// Export utility types
export type NotificationSortField = 'createdAt' | 'priority' | 'category' | 'isRead';
export type NotificationSortOrder = 'ASC' | 'DESC';

export interface NotificationQuery extends NotificationOptions {
  sortBy?: NotificationSortField;
  sortOrder?: NotificationSortOrder;
  includeStats?: boolean;
  includeTemplates?: boolean;
}

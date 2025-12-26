/**
 * Notification Client for SyncBase
 * Handles notification-specific operations and caching
 */

import { SyncBaseClient } from '../../core/SyncBaseClient';
import { EventResponse, PaginatedResponse } from '../../core/types';
import { WEBSOCKET_EVENTS } from '../../constants';
import { SyncBaseResponse } from '../../types/shared';
import {
  type Notification,
  NotificationOptions,
  NotificationStats,
  CreateNotificationData,
  NotificationSubscriptionData,
  NotificationUpdateData,
  NotificationListResponse
} from './types';

export class NotificationClient {
  private client: SyncBaseClient;
  private isSubscribed: boolean = false;
  private subscriptions: (() => void)[] = [];

  constructor(client: SyncBaseClient) {
    this.client = client;
  }

  /**
   * Subscribe to notification events
   */
  async subscribe(): Promise<NotificationSubscriptionData> {
    if (this.isSubscribed) {
      console.log('[NotificationClient] Already subscribed to notifications');
      return {
        subscriptionId: 'existing',
        userId: '',
        subscribedAt: new Date().toISOString(),
        preferences: {
          categories: ['system'],
          priorities: ['normal'],
          channels: ['in_app']
        }
      };
    }

    console.log('[NotificationClient] Sending subscription request...');

    try {
      // Use the correct sendEvent method with longer timeout
      const response = await this.client.sendEvent<NotificationSubscriptionData>(
        WEBSOCKET_EVENTS.NOTIFICATIONS_SUBSCRIBE,
        {}
      );

      console.log('[NotificationClient] Subscription response:', response);

      if (response.success) {
        this.isSubscribed = true;
        this.setupEventListeners();
        console.log('[NotificationClient] Successfully subscribed and set up event listeners');
        return response.data || {
          subscriptionId: 'default',
          userId: '',
          subscribedAt: new Date().toISOString(),
          preferences: {
            categories: ['system'],
            priorities: ['normal'],
            channels: ['in_app']
          }
        };
      } else {
        console.error('[NotificationClient] Subscription failed:', response.error);
        const errorMsg = typeof response.error === 'string' ? response.error : response.error?.message || 'Subscription failed';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('[NotificationClient] Subscription error:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from notification events
   */
  async unsubscribe(): Promise<void> {
    if (!this.isSubscribed) {
      return;
    }

    // Clean up event listeners
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions = [];
    this.isSubscribed = false;

    // Note: We don't send an unsubscribe event to the server as the connection
    // manager handles subscription cleanup on disconnect
  }

  /**
   * Get notifications with pagination
   */
  async getNotifications(options: NotificationOptions = {}): Promise<NotificationListResponse> {
    const payload = {
      limit: options.limit || 10,
      direction: options.direction || 'before',
      sortBy: options.sortBy || 'cursor',
      sortOrder: options.sortOrder || 'DESC',
      cursor: options.cursor,
      search: options.search, // Add search support like HTML test
      ...options.filters
    };

    console.log('[NotificationClient] Getting notifications with payload:', payload);

    const response = await this.client.sendEvent<{
      notifications: Notification[];
      pagination: any;
      meta: any;
      unreadCount?: number;
    }>(WEBSOCKET_EVENTS.NOTIFICATIONS_GET, payload);

    if (response.success && response.data) {
      const { notifications, pagination, meta, unreadCount } = response.data;

      // Cache notifications if storage is available
      const storage = this.client.getStorage();
      if (storage) {
        for (const notification of notifications) {
          await storage.set('notifications', notification.id, notification);
        }
      }

      return {
        items: notifications,
        pagination: {
          hasMore: pagination.hasMore || false,
          nextCursor: pagination.nextCursor,
          prevCursor: pagination.prevCursor,
          limit: payload.limit
        },
        meta: {
          ...meta,
          unreadCount
        }
      };
    }

    throw new Error(response.error?.message || 'Failed to get notifications');
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.NOTIFICATIONS_MARK_READ, {
      notificationId
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to mark notification as read');
    }

    // Update cached notification if storage is available
    const storage = this.client.getStorage();
    if (storage) {
      const cached = await storage.get<Notification>('notifications', notificationId);
      if (cached) {
        cached.isRead = true;
        cached.readAt = new Date().toISOString();
        await storage.set('notifications', notificationId, cached);
      }
    }
  }

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.NOTIFICATIONS_MARK_READ, {
      notificationIds
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to mark notifications as read');
    }

    // Update cached notifications if storage is available
    const storage = this.client.getStorage();
    if (storage) {
      for (const notificationId of notificationIds) {
        const cached = await storage.get<Notification>('notifications', notificationId);
        if (cached) {
          cached.isRead = true;
          cached.readAt = new Date().toISOString();
          await storage.set('notifications', notificationId, cached);
        }
      }
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ updated: number; unreadCount: number }> {
    console.log('[NotificationClient] Marking all notifications as read...');

    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.NOTIFICATIONS_MARK_ALL_READ, {});

    console.log('[NotificationClient] Mark all as read response:', response);

    if (response.success) {
      // Update all cached notifications if storage is available
      const storage = this.client.getStorage();
      if (storage) {
        try {
          const notifications = await storage.getMany<Notification>('notifications');
          for (const notification of notifications) {
            if (!notification.isRead) {
              notification.isRead = true;
              notification.readAt = new Date().toISOString();
              await storage.set('notifications', notification.id, notification);
            }
          }
        } catch (error) {
          console.warn('[NotificationClient] Failed to update cached notifications:', error);
        }
      }

      return {
        updated: response.data?.updated || 0,
        unreadCount: response.data?.unreadCount || 0
      };
    }

    throw new Error(response.error?.message || 'Failed to mark all notifications as read');
  }

  /**
   * Create a new notification
   */
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const response = await this.client.sendEvent<{ notification: Notification }>(
      WEBSOCKET_EVENTS.NOTIFICATIONS_CREATE,
      data
    );

    if (response.success && response.data) {
      const notification = response.data.notification;

      // Cache the new notification if storage is available
      const storage = this.client.getStorage();
      if (storage) {
        await storage.set('notifications', notification.id, notification);
      }

      return notification;
    }

    throw new Error(response.error?.message || 'Failed to create notification');
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    // Note: Backend doesn't support delete, this is client-side only
    console.warn('[NotificationClient] Delete not supported by backend, removing from cache only');

    // Remove from cache if storage is available
    const storage = this.client.getStorage();
    if (storage) {
      await storage.delete('notifications', notificationId);
    }

    // Emit client event for UI updates
    this.client.emit('notifications:deleted', { id: notificationId });
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<number> {
    const response = await this.client.sendEvent<{ count: number }>(
      WEBSOCKET_EVENTS.NOTIFICATIONS_GET_UNREAD_COUNT,
      {}
    );

    if (response.success && response.data) {
      return response.data.count;
    }

    throw new Error(response.error?.message || 'Failed to get unread count');
  }

  /**
   * Get notification statistics
   */
  async getStats(): Promise<NotificationStats> {
    // Note: Backend doesn't have dedicated stats endpoint, calculate from notifications
    console.warn('[NotificationClient] Stats endpoint not available, calculating from notifications');

    try {
      const notifications = await this.getNotifications({ limit: 1000 });
      const unreadCount = await this.getUnreadCount();

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats: NotificationStats = {
        total: notifications.items.length,
        unread: unreadCount,
        byType: {} as any,
        byPriority: {} as any,
        byCategory: {} as any,
        recent: {
          today: 0,
          thisWeek: 0,
          thisMonth: 0
        }
      };

      // Calculate stats from notifications
      notifications.items.forEach(notification => {
        const createdAt = new Date(notification.createdAt);

        // By type
        stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;

        // By priority
        stats.byPriority[notification.priority] = (stats.byPriority[notification.priority] || 0) + 1;

        // By category
        stats.byCategory[notification.category] = (stats.byCategory[notification.category] || 0) + 1;

        // Recent stats
        if (createdAt >= today) {
          stats.recent.today++;
        }
        if (createdAt >= thisWeek) {
          stats.recent.thisWeek++;
        }
        if (createdAt >= thisMonth) {
          stats.recent.thisMonth++;
        }
      });

      return stats;
    } catch (error) {
      throw new Error('Failed to calculate notification stats');
    }
  }

  // ========================================
  // 📋 TEMPLATE MANAGEMENT (Admin Only)
  // ========================================

  /**
   * Get notification templates (admin only)
   */
  async getTemplates(): Promise<any[]> {
    const response = await this.client.sendEvent<{ templates: any[] }>(
      WEBSOCKET_EVENTS.NOTIFICATIONS_GET_TEMPLATES,
      {}
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to get notification templates');
    }

    return response.data?.templates || [];
  }

  /**
   * Create notification template (admin only)
   */
  async createTemplate(templateData: any): Promise<any> {
    const response = await this.client.sendEvent<{ template: any }>(
      WEBSOCKET_EVENTS.NOTIFICATIONS_CREATE_TEMPLATE,
      templateData
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to create notification template');
    }

    return response.data?.template;
  }

  /**
   * Update notification template (admin only)
   */
  async updateTemplate(templateId: string, templateData: any): Promise<any> {
    const response = await this.client.sendEvent<{ template: any }>(
      WEBSOCKET_EVENTS.NOTIFICATIONS_UPDATE_TEMPLATE,
      { templateId, ...templateData }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to update notification template');
    }

    return response.data?.template;
  }

  // ========================================
  // 🔧 UTILITY METHODS
  // ========================================

  /**
   * Show browser notification (if permission granted)
   */
  async showBrowserNotification(notification: Notification): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('Browser notifications not supported');
      return;
    }

    if (Notification.permission === 'granted') {
      const browserNotification = new window.Notification(notification.title, {
        body: notification.content,
        icon: notification.metadata?.icon || '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'critical'
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();

        // Navigate to path if provided
        if (notification.path && typeof window !== 'undefined') {
          // In a React app, you might want to use router navigation here
          console.log(`Would navigate to: ${notification.path}`);
        }
      };

      // Auto-close after 5 seconds unless it's critical
      if (notification.priority !== 'critical') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    } else if (Notification.permission !== 'denied') {
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.showBrowserNotification(notification);
      }
    }
  }

  /**
   * Request browser notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Browser notifications not supported');
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  }

  /**
   * Get cached notifications (offline support)
   */
  async getCachedNotifications(options: NotificationOptions = {}): Promise<Notification[]> {
    const storage = this.client.getStorage();
    if (!storage) {
      return [];
    }

    try {
      const notifications = await storage.getMany<Notification>('notifications', {
        limit: options.limit || 50,
        indexName: options.sortBy === 'cursor' ? 'cursor' : 'createdAt'
      });

      // Apply filters if specified
      return this.applyNotificationFilters(notifications, options.filters);
    } catch (error) {
      console.warn('[NotificationClient] Failed to get cached notifications:', error);
      return [];
    }
  }

  /**
   * Check if subscribed to notifications
   */
  isSubscribedToNotifications(): boolean {
    return this.isSubscribed;
  }

  /**
   * Get a specific notification by ID
   */
  async getNotificationById(notificationId: string): Promise<Notification | null> {
    // Try cache first
    const storage = this.client.getStorage();
    if (storage) {
      const cached = await storage.get<Notification>('notifications', notificationId);
      if (cached) {
        return cached;
      }
    }

    // Fallback to server request using general get with filter
    try {
      const response = await this.client.sendEvent<NotificationListResponse>(
        WEBSOCKET_EVENTS.NOTIFICATIONS_GET,
        {
          filters: { id: notificationId },
          limit: 1
        }
      );

      if (response.success && response.data && response.data.items.length > 0) {
        const notification = response.data.items[0];

        // Cache the notification
        if (storage) {
          await storage.set('notifications', notification.id, notification);
        }

        return notification;
      }
    } catch (error) {
      console.warn('[NotificationClient] Failed to get notification by ID:', error);
    }

    return null;
  }

  /**
   * Clear all cached notifications
   */
  async clearCache(): Promise<void> {
    const storage = this.client.getStorage();
    if (storage) {
      await storage.clear('notifications');
    }
  }

  // Private methods

  /**
   * Setup event listeners for real-time updates
   */
  private setupEventListeners(): void {
    // Get the connection manager to listen to actual socket events (like HTML test)
    const connectionManager = this.client.getConnectionManager();
    if (!connectionManager) {
      console.error('[NotificationClient] No connection manager available');
      return;
    }

    // Listen to BROADCAST events that match the backend exactly (like HTML test)
    const unsubscribeCreated = connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_CREATED, (data: any) => {
      console.log('[NotificationClient] Notification created broadcast:', data);
      // Backend sends { notification: {...}, unreadCount: number }
      if (data.notification) {
        this.handleNewNotification(data.notification);
      }
      if (data.unreadCount !== undefined) {
        this.handleUnreadCountChange({ count: data.unreadCount });
      }
    });

    const unsubscribeUpdated = connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_UPDATED, (data: any) => {
      console.log('[NotificationClient] Notification updated broadcast:', data);
      // Backend sends { notification: {...} }
      if (data.notification) {
        this.handleNotificationUpdate(data.notification);
      }
    });

    const unsubscribeDeleted = connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_DELETED, (data: any) => {
      console.log('[NotificationClient] Notification deleted broadcast:', data);
      this.handleNotificationDeleted(data);
    });

    const unsubscribeRead = connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_READ, (data: any) => {
      console.log('[NotificationClient] Notification read broadcast:', data);
      // Backend sends { notification: {...}, unreadCount: number }
      if (data.notification) {
        this.handleNotificationRead(data.notification);
      }
      if (data.unreadCount !== undefined) {
        this.handleUnreadCountChange({ count: data.unreadCount });
      }
    });

    const unsubscribeUnreadCount = connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_UNREAD_COUNT_UPDATED, (data: any) => {
      console.log('[NotificationClient] Unread count updated broadcast:', data);
      // Backend sends { unreadCount: number }
      if (data.unreadCount !== undefined) {
        this.handleUnreadCountChange({ count: data.unreadCount });
      }
    });

    const unsubscribeBulkRead = connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_BULK_READ, (data: any) => {
      console.log('[NotificationClient] Bulk read broadcast:', data);
      this.handleBulkNotificationsRead(data);
      // Backend sends { updated: number, unreadCount: number }
      if (data.unreadCount !== undefined) {
        this.handleUnreadCountChange({ count: data.unreadCount });
      }
    });

    // Add high priority notification handler (like HTML test)
    const unsubscribeHighPriority = connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_HIGH_PRIORITY_CREATED, (data: any) => {
      console.log('[NotificationClient] High priority notification broadcast:', data);
      // Same as regular created but with special handling
      if (data.notification) {
        this.handleNewNotification(data.notification);
      }
      if (data.unreadCount !== undefined) {
        this.handleUnreadCountChange({ count: data.unreadCount });
      }
    });

    this.subscriptions = [
      unsubscribeCreated,
      unsubscribeUpdated,
      unsubscribeDeleted,
      unsubscribeRead,
      unsubscribeUnreadCount,
      unsubscribeBulkRead,
      unsubscribeHighPriority
    ];

    console.log('[NotificationClient] Event listeners set up for BROADCAST events');
  }

  /**
   * Handle new notification received
   */
  private async handleNewNotification(notification: Notification): Promise<void> {
    console.log('[NotificationClient] Handling new notification:', notification);

    // Defensive check for notification
    if (!notification || typeof notification !== 'object' || !notification.id) {
      console.error('[NotificationClient] Invalid notification received:', notification);
      return;
    }

    try {
      // Cache the new notification if storage is available
      const storage = this.client.getStorage();
      if (storage) {
        await storage.set('notifications', notification.id, notification);
      }

      // Emit client event for UI updates
      console.log('[NotificationClient] Emitting notifications:new event');
      this.client.emit('notifications:new', notification);
    } catch (error) {
      console.error('[NotificationClient] Error handling new notification:', error);
    }
  }

  /**
   * Handle notification deleted
   */
  private async handleNotificationDeleted(data: { id: string }): Promise<void> {
    // Remove from cache if storage is available
    const storage = this.client.getStorage();
    if (storage) {
      await storage.delete('notifications', data.id);
    }

    // Emit client event for UI updates
    this.client.emit('notifications:deleted', data);
  }

  /**
   * Handle notification read
   */
  private async handleNotificationRead(data: { id: string; readAt: string }): Promise<void> {
    // Update cached notification if storage is available
    const storage = this.client.getStorage();
    if (storage) {
      const cached = await storage.get<Notification>('notifications', data.id);
      if (cached) {
        cached.isRead = true;
        cached.readAt = data.readAt;
        await storage.set('notifications', data.id, cached);
      }
    }

    // Emit client event for UI updates
    this.client.emit('notifications:read', data);
  }

  /**
   * Handle unread count change
   */
  private handleUnreadCountChange(data: { count: number }): void {
    // Emit client event for UI updates
    this.client.emit('notifications:unread_count_changed', data.count);
  }

  /**
   * Handle notification update
   */
  private async handleNotificationUpdate(data: NotificationUpdateData): Promise<void> {
    // Update cached notification if storage is available
    const storage = this.client.getStorage();
    if (storage) {
      const cached = await storage.get<Notification>('notifications', data.id);
      if (cached) {
        // Apply updates
        if (data.isRead !== undefined) {
          cached.isRead = data.isRead;
        }
        if (data.readAt !== undefined) {
          cached.readAt = data.readAt;
        }
        if (data.metadata !== undefined) {
          cached.metadata = { ...cached.metadata, ...data.metadata };
        }

        await storage.set('notifications', cached.id, cached);
      }
    }

    // Emit client event for UI updates
    this.client.emit('notifications:updated', data);
  }

  /**
   * Handle bulk notifications read
   */
  private handleBulkNotificationsRead(data: any): void {
    // Update multiple notifications as read
    if (data.notificationIds && Array.isArray(data.notificationIds)) {
      data.notificationIds.forEach((id: string) => {
        this.handleNotificationUpdate({ id: id, isRead: true });
      });
    }
  }

  /**
   * Apply filters to notifications array
   */
  private applyNotificationFilters(notifications: Notification[], filters?: any): Notification[] {
    if (!filters) {
      return notifications;
    }

    return notifications.filter(notification => {
      // Filter by read status
      if (filters.isRead !== undefined && notification.isRead !== filters.isRead) {
        return false;
      }

      // Filter by category
      if (filters.category) {
        const categories = Array.isArray(filters.category) ? filters.category : [filters.category];
        if (!categories.includes(notification.category)) {
          return false;
        }
      }

      // Filter by priority
      if (filters.priority) {
        const priorities = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
        if (!priorities.includes(notification.priority)) {
          return false;
        }
      }

      // Filter by type
      if (filters.type) {
        const types = Array.isArray(filters.type) ? filters.type : [filters.type];
        if (!types.includes(notification.type)) {
          return false;
        }
      }

      // Filter by sender
      if (filters.senderId && notification.senderId !== filters.senderId) {
        return false;
      }

      // Filter by date range
      if (filters.dateFrom) {
        const notificationDate = new Date(notification.createdAt);
        const fromDate = new Date(filters.dateFrom);
        if (notificationDate < fromDate) {
          return false;
        }
      }

      if (filters.dateTo) {
        const notificationDate = new Date(notification.createdAt);
        const toDate = new Date(filters.dateTo);
        if (notificationDate > toDate) {
          return false;
        }
      }

      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = `${notification.title} ${notification.message}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        const notificationTags = notification.metadata?.tags || [];
        const hasMatchingTag = filters.tags.some((tag: string) =>
          notificationTags.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    });
  }
}

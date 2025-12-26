/**
 * React hook for SyncBase notifications
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { NotificationClient } from './NotificationClient';
import { WEBSOCKET_EVENTS } from '../../constants';
import {
  Notification,
  NotificationStats,
  NotificationFilters,
  CreateNotificationData,
  UseNotificationsOptions,
  UseNotificationsReturn
} from './types';
import { useSyncBase } from '../../providers/SyncBaseProvider';

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const { client } = useSyncBase();
  const { status: sessionStatus } = useSession();
  const notificationClientRef = useRef<NotificationClient | null>(null);

  // State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [filters, setFiltersState] = useState<NotificationFilters>(options.filters || {});
  const [isClientReady, setIsClientReady] = useState(false);

  // Initialize notification client
  useEffect(() => {
    console.log('[useNotifications] Client initialization check:', {
      hasClient: !!client,
      hasNotificationClient: !!notificationClientRef.current,
      clientType: client ? typeof client : 'undefined',
      clientConstructor: client?.constructor?.name
    });

    if (client && !notificationClientRef.current) {
      console.log('[useNotifications] Creating NotificationClient...');
      notificationClientRef.current = new NotificationClient(client);
      setIsClientReady(true);
      console.log('[useNotifications] NotificationClient created successfully');
    } else if (!client && notificationClientRef.current) {
      // Clean up if client is removed
      console.log('[useNotifications] Cleaning up NotificationClient...');
      notificationClientRef.current = null;
      setIsClientReady(false);
    }
  }, [client]);

  // Auto-subscribe on mount if enabled
  useEffect(() => {
    console.log('[useNotifications] Auto-subscribe check:', {
      sessionStatus,
      isClientReady,
      hasClient: !!notificationClientRef.current,
      isSubscribed,
      autoRefresh: options.autoRefresh,
      shouldSubscribe: sessionStatus === 'authenticated' && isClientReady && !isSubscribed && options.autoRefresh !== false
    });

    if (sessionStatus === 'authenticated' && isClientReady && !isSubscribed && options.autoRefresh !== false) {
      console.log('[useNotifications] Auto-subscribing to notifications...');
      subscribe().catch(error => {
        console.error('[useNotifications] Auto-subscribe failed:', error);
      });
    }
  }, [sessionStatus, isClientReady, isSubscribed, options.autoRefresh]);

  // Load initial notifications
  useEffect(() => {
    if (notificationClientRef.current && !isLoading) {
      loadNotifications();
    }
  }, [notificationClientRef.current, filters]);

  // Setup event listeners
  useEffect(() => {
    if (!client) return;

    // Get the connection manager to listen to actual socket events (like HTML test)
    const connectionManager = client.getConnectionManager();
    if (!connectionManager) {
      console.error('[useNotifications] No connection manager available');
      return;
    }

    const unsubscribers: (() => void)[] = [];

    // Listen to direct socket events (matching HTML test exactly)
    // New notification created
    unsubscribers.push(
      connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_CREATED, (data: { notification: Notification; unreadCount?: number }) => {
        console.log('[useNotifications] Notification created:', data);

        // Defensive check for data object
        if (!data || typeof data !== 'object' || !data.notification) {
          console.error('[useNotifications] Invalid notification:created data:', data);
          return;
        }

        const notification = data.notification;

        // Defensive check for notification object
        if (!notification || typeof notification !== 'object' || !notification.id) {
          console.error('[useNotifications] Invalid notification in created event:', notification);
          return;
        }

        try {
          setNotifications(prev => {
            // Check for duplicates
            const exists = prev.some(n => n.id === notification.id);
            if (exists) return prev;

            // Add to beginning (newest first)
            return [notification, ...prev];
          });

          // Update unread count from server if provided
          if (data.unreadCount !== undefined) {
            setUnreadCount(data.unreadCount);
          } else if (!notification.isRead) {
            // Fallback: increment unread count
            setUnreadCount(count => count + 1);
          }

          // Call callback if provided
          if (options.onNotificationReceived) {
            try {
              options.onNotificationReceived(notification);
            } catch (callbackError) {
              console.error('[useNotifications] Error in onNotificationReceived callback:', callbackError);
            }
          }
        } catch (error) {
          console.error('[useNotifications] Error processing notification:created:', error);
          if (options.onError) {
            options.onError(error as Error);
          }
        }
      })
    );

    // Notification updated
    unsubscribers.push(
      connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_UPDATED, (data: { notification: Notification }) => {
        console.log('[useNotifications] Notification updated:', data);

        // Defensive check for data object
        if (!data || typeof data !== 'object' || !data.notification) {
          console.error('[useNotifications] Invalid notification update data:', data);
          return;
        }

        const updatedNotification = data.notification;

        try {
          setNotifications(prev =>
            prev.map(notification => {
              if (notification.id === updatedNotification.id) {
                // Replace with updated notification from server
                return { ...notification, ...updatedNotification };
              }
              return notification;
            })
          );

          // Call callback if provided
          if (options.onNotificationRead && updatedNotification.isRead) {
            try {
              options.onNotificationRead(updatedNotification.id);
            } catch (callbackError) {
              console.error('[useNotifications] Error in onNotificationRead callback:', callbackError);
            }
          }
        } catch (error) {
          console.error('[useNotifications] Error processing notification update:', error);
          if (options.onError) {
            options.onError(error as Error);
          }
        }
      })
    );

    // Unread count updated
    unsubscribers.push(
      connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_UNREAD_COUNT_UPDATED, (data: { unreadCount: number }) => {
        console.log('[useNotifications] Unread count changed:', data);

        // Defensive check for data
        if (!data || typeof data.unreadCount !== 'number' || isNaN(data.unreadCount) || data.unreadCount < 0) {
          console.error('[useNotifications] Invalid unread count data:', data);
          return;
        }

        try {
          setUnreadCount(data.unreadCount);
        } catch (error) {
          console.error('[useNotifications] Error updating unread count:', error);
          if (options.onError) {
            options.onError(error as Error);
          }
        }
      })
    );

    // Notification deleted (database update)
    unsubscribers.push(
      connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_DELETED, (data: { notification: Notification; unreadCount?: number }) => {
        console.log('[useNotifications] Notification deleted:', data);

        if (!data || typeof data !== 'object' || !data.notification) {
          console.error('[useNotifications] Invalid notification delete data:', data);
          return;
        }

        try {
          setNotifications(prev => prev.filter(n => n.id !== data.notification.id));

          // Update unread count if provided
          if (data.unreadCount !== undefined) {
            setUnreadCount(data.unreadCount);
          }
        } catch (error) {
          console.error('[useNotifications] Error processing notification deletion:', error);
          if (options.onError) {
            options.onError(error as Error);
          }
        }
      })
    );

    // Notification read (database update)
    unsubscribers.push(
      connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_READ, (data: { notification: Notification; unreadCount?: number }) => {
        console.log('[useNotifications] Notification read:', data);

        if (!data || typeof data !== 'object' || !data.notification) {
          console.error('[useNotifications] Invalid notification read data:', data);
          return;
        }

        try {
          setNotifications(prev =>
            prev.map(notification => {
              if (notification.id === data.notification.id) {
                return { ...notification, ...data.notification, isRead: true };
              }
              return notification;
            })
          );

          // Update unread count if provided
          if (data.unreadCount !== undefined) {
            setUnreadCount(data.unreadCount);
          }

          // Call callback if provided
          if (options.onNotificationRead) {
            try {
              options.onNotificationRead(data.notification.id);
            } catch (callbackError) {
              console.error('[useNotifications] Error in onNotificationRead callback:', callbackError);
            }
          }
        } catch (error) {
          console.error('[useNotifications] Error processing notification read:', error);
          if (options.onError) {
            options.onError(error as Error);
          }
        }
      })
    );

    // Bulk read (database update)
    unsubscribers.push(
      connectionManager.subscribe(WEBSOCKET_EVENTS.BROADCAST_NOTIFICATION_BULK_READ, (data: { updated: number; unreadCount: number }) => {
        console.log('[useNotifications] Bulk notifications read:', data);

        if (!data || typeof data !== 'object') {
          console.error('[useNotifications] Invalid bulk read data:', data);
          return;
        }

        try {
          // Mark all notifications as read
          setNotifications(prev =>
            prev.map(notification => ({
              ...notification,
              isRead: true,
              readAt: new Date().toISOString()
            }))
          );

          // Update unread count
          if (data.unreadCount !== undefined) {
            setUnreadCount(data.unreadCount);
          }
        } catch (error) {
          console.error('[useNotifications] Error processing bulk read:', error);
          if (options.onError) {
            options.onError(error as Error);
          }
        }
      })
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [client, options.onNotificationReceived, options.onNotificationRead, options.onError]);

  // Auto-refresh when filters change (like HTML test)
  useEffect(() => {
    if (notificationClientRef.current && !isLoading) {
      console.log('[useNotifications] Filters changed, refreshing notifications:', filters);
      loadNotifications(false); // Reset pagination and load fresh results
    }
  }, [filters]);

  // Auto-refresh interval
  useEffect(() => {
    if (!options.autoRefresh || !options.refreshInterval) return;

    const interval = setInterval(() => {
      if (!isLoading) {
        refresh();
      }
    }, options.refreshInterval);

    return () => clearInterval(interval);
  }, [options.autoRefresh, options.refreshInterval, isLoading]);

  /**
   * Load notifications
   */
  const loadNotifications = useCallback(async (loadMore: boolean = false) => {
    if (!notificationClientRef.current || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationClientRef.current.getNotifications({
        limit: options.limit || 10, // Match HTML test: 10 notifications per page
        cursor: loadMore ? nextCursor : undefined,
        filters
      });

      setNotifications(prev => {
        if (loadMore) {
          // Remove duplicates and merge
          const existingIds = new Set(prev.map(n => n.id));
          const newNotifications = response.items.filter(n => !existingIds.has(n.id));
          return [...prev, ...newNotifications];
        } else {
          return response.items;
        }
      });

      setHasMore(response.pagination.hasMore);
      setNextCursor(response.pagination.nextCursor);

      // Update unread count from first notification in the list
      const unreadNotifications = response.items.filter(n => !n.isRead);
      if (!loadMore) {
        setUnreadCount(unreadNotifications.length);
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load notifications');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }

      // Try to load from cache if available
      if (notificationClientRef.current) {
        try {
          const cached = await notificationClientRef.current.getCachedNotifications({
            limit: options.limit || 15,
            filters
          });
          
          if (cached.length > 0) {
            setNotifications(cached);
          }
        } catch (cacheError) {
          console.warn('[useNotifications] Failed to load from cache:', cacheError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [options.limit, nextCursor, filters, isLoading, options.onError]);

  /**
   * Load more notifications
   */
  const loadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      await loadNotifications(true);
    }
  }, [hasMore, isLoading, loadNotifications]);

  /**
   * Refresh notifications
   */
  const refresh = useCallback(async () => {
    setNextCursor(undefined);
    await loadNotifications(false);
  }, [loadNotifications]);

  /**
   * Mark notifications as read
   */
  const markAsRead = useCallback(async (notificationIds: string[]) => {
    if (!notificationClientRef.current) return;

    try {
      if (notificationIds.length === 1) {
        await notificationClientRef.current.markAsRead(notificationIds[0]);
      } else {
        await notificationClientRef.current.markMultipleAsRead(notificationIds);
      }

      // Update local state optimistically
      setNotifications(prev => 
        prev.map(notification => {
          if (notificationIds.includes(notification.id) && !notification.isRead) {
            return {
              ...notification,
              isRead: true,
              readAt: new Date().toISOString()
            };
          }
          return notification;
        })
      );

      // Update unread count
      const unreadToMark = notifications.filter(n => 
        notificationIds.includes(n.id) && !n.isRead
      ).length;
      
      setUnreadCount(count => Math.max(0, count - unreadToMark));

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to mark notifications as read');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
    }
  }, [notifications, options.onError]);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    if (!notificationClientRef.current) return;

    try {
      const result = await notificationClientRef.current.markAllAsRead();

      console.log('[useNotifications] Mark all as read result:', result);

      // Update local state optimistically
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          isRead: true,
          readAt: notification.readAt || new Date().toISOString()
        }))
      );

      // Use the unread count from the server response
      setUnreadCount(result.unreadCount);

      console.log(`[useNotifications] Marked ${result.updated} notifications as read, ${result.unreadCount} unread remaining`);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to mark all notifications as read');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }
    }
  }, [options.onError]);

  /**
   * Delete a notification
   */
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!notificationClientRef.current) return;

    try {
      await notificationClientRef.current.deleteNotification(notificationId);

      // Update local state optimistically
      const notificationToDelete = notifications.find(n => n.id === notificationId);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      // Update unread count if deleted notification was unread
      if (notificationToDelete && !notificationToDelete.isRead) {
        setUnreadCount(count => Math.max(0, count - 1));
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete notification');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
    }
  }, [notifications, options.onError]);

  /**
   * Create a new notification
   */
  const createNotification = useCallback(async (data: CreateNotificationData): Promise<Notification> => {
    if (!notificationClientRef.current) {
      throw new Error('Notification client not initialized');
    }

    try {
      const notification = await notificationClientRef.current.createNotification(data);

      // Add to local state optimistically
      setNotifications(prev => [notification, ...prev]);

      // Update unread count if notification is unread
      if (!notification.isRead) {
        setUnreadCount(count => count + 1);
      }

      return notification;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create notification');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [options.onError]);

  /**
   * Subscribe to notifications
   */
  const subscribe = useCallback(async () => {
    if (!notificationClientRef.current || isSubscribed) {
      console.log('[useNotifications] Subscribe skipped:', {
        hasClient: !!notificationClientRef.current,
        isSubscribed
      });
      return;
    }

    try {
      console.log('[useNotifications] Attempting to subscribe...');
      await notificationClientRef.current.subscribe();
      console.log('[useNotifications] Successfully subscribed to notifications');
      setIsSubscribed(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to subscribe to notifications');
      console.error('[useNotifications] Subscribe failed:', error);
      setError(error);

      if (options.onError) {
        options.onError(error);
      }
    }
  }, [isSubscribed, options.onError]);

  /**
   * Unsubscribe from notifications
   */
  const unsubscribe = useCallback(async () => {
    if (!notificationClientRef.current || !isSubscribed) return;

    try {
      await notificationClientRef.current.unsubscribe();
      setIsSubscribed(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to unsubscribe from notifications');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }
    }
  }, [isSubscribed, options.onError]);

  /**
   * Set filters
   */
  const setFilters = useCallback((newFilters: NotificationFilters) => {
    setFiltersState(newFilters);
    setNextCursor(undefined); // Reset pagination
  }, []);

  /**
   * Clear filters
   */
  const clearFilters = useCallback(() => {
    setFiltersState({});
    setNextCursor(undefined); // Reset pagination
  }, []);

  /**
   * Get notification by ID
   */
  const getNotificationById = useCallback((id: string): Notification | undefined => {
    return notifications.find(notification => notification.id === id);
  }, [notifications]);

  /**
   * Get unread notifications
   */
  const getUnreadNotifications = useCallback((): Notification[] => {
    return notifications.filter(notification => !notification.isRead);
  }, [notifications]);

  /**
   * Get notifications by category
   */
  const getNotificationsByCategory = useCallback((category: string): Notification[] => {
    return notifications.filter(notification => notification.category === category);
  }, [notifications]);

  /**
   * Get notification templates (admin only)
   */
  const getTemplates = useCallback(async (): Promise<any[]> => {
    if (!notificationClientRef.current) {
      throw new Error('Notification client not initialized');
    }

    try {
      return await notificationClientRef.current.getTemplates();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get templates');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [options.onError]);

  /**
   * Create notification template (admin only)
   */
  const createTemplate = useCallback(async (templateData: any): Promise<any> => {
    if (!notificationClientRef.current) {
      throw new Error('Notification client not initialized');
    }

    try {
      return await notificationClientRef.current.createTemplate(templateData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create template');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [options.onError]);

  /**
   * Update notification template (admin only)
   */
  const updateTemplate = useCallback(async (templateId: string, templateData: any): Promise<any> => {
    if (!notificationClientRef.current) {
      throw new Error('Notification client not initialized');
    }

    try {
      return await notificationClientRef.current.updateTemplate(templateId, templateData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update template');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [options.onError]);

  /**
   * Show browser notification
   */
  const showBrowserNotification = useCallback(async (notification: Notification): Promise<void> => {
    if (!notificationClientRef.current) {
      throw new Error('Notification client not initialized');
    }

    try {
      return await notificationClientRef.current.showBrowserNotification(notification);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to show browser notification');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [options.onError]);

  /**
   * Request browser notification permission
   */
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!notificationClientRef.current) {
      throw new Error('Notification client not initialized');
    }

    try {
      return await notificationClientRef.current.requestNotificationPermission();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to request notification permission');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [options.onError]);

  // Load stats on mount and when notifications change
  useEffect(() => {
    const loadStats = async () => {
      if (!notificationClientRef.current) return;

      try {
        const notificationStats = await notificationClientRef.current.getStats();
        setStats(notificationStats);
      } catch (err) {
        console.warn('[useNotifications] Failed to load stats:', err);
      }
    };

    loadStats();
  }, [notifications.length]);

  return {
    // Data
    notifications,
    unreadCount,
    stats,

    // State
    isLoading,
    isSubscribed,
    hasMore,
    error,

    // Actions
    loadMore,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    subscribe,
    unsubscribe,

    // Template Management (Admin Only)
    getTemplates,
    createTemplate,
    updateTemplate,

    // Browser Notifications
    showBrowserNotification,
    requestNotificationPermission,

    // Filters
    setFilters,
    clearFilters,

    // Utils
    getNotificationById,
    getUnreadNotifications,
    getNotificationsByCategory
  };
}

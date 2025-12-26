/**
 * React hook for SyncBase messenger (messages in a conversation)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { MessengerClient } from './MessengerClient';
import {
  Message,
  Conversation,
  MessageFilters,
  SendMessageData,
  EditMessageData,
  UseMessengerOptions,
  UseMessengerReturn
} from './types';
import { useSyncBase } from '../../providers/SyncBaseProvider';
import { WEBSOCKET_EVENTS } from '../../constants';

export function useMessenger(
  conversationId: string | null,
  options: UseMessengerOptions = {}
): UseMessengerReturn {
  const { client } = useSyncBase();
  const { data: session, status: sessionStatus } = useSession(); // ✅ ADDED: Use NextAuth session like notifications
  const messengerClientRef = useRef<MessengerClient | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null); // ✅ FIXED: Move useRef to top level

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [filters, setFiltersState] = useState<MessageFilters>(options.filters || {});
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Initialize messenger client
  useEffect(() => {
    if (client && !messengerClientRef.current) {
      messengerClientRef.current = new MessengerClient(client);
    }
  }, [client]);

  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId && messengerClientRef.current) {
      loadMessages();
      
      // Subscribe to conversation events
      if (!isSubscribed) {
        subscribeToConversation();
      }

      // Auto-join selected conversation and mark as read like HTML test
      (async () => {
        try {
          await messengerClientRef.current!.joinConversation(conversationId);
          if (options.markAsRead !== false) {
            await messengerClientRef.current!.markAsRead(conversationId);
          }
        } catch (e) {
          console.warn('[useMessenger] auto join/markAsRead failed', e);
        }
      })();
    } else {
      // Clear messages when no conversation is selected
      setMessages([]);
      setConversation(null);
      setIsSubscribed(false);
    }

    return () => {
      // ✅ FIXED: Use the cleanup function from subscribeToConversation
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      // attempt to unsubscribe from conversation room subscriptions
      try {
        if (messengerClientRef.current && conversationId) {
          messengerClientRef.current.unsubscribeFromConversationRoom(conversationId);
        }
      } catch {}
      setIsSubscribed(false);
    };
  }, [conversationId, messengerClientRef.current, filters]);

  /**
   * Load messages
   */
  const loadMessages = useCallback(async (loadMore: boolean = false) => {
    if (!messengerClientRef.current || !conversationId || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await messengerClientRef.current.getMessages({
        conversationId,
        limit: options.limit || 50,
        cursor: loadMore ? nextCursor : undefined,
        filters
      });

      setMessages(prev => {
        if (loadMore) {
          // Remove duplicates and merge
          const existingIds = new Set(prev.map(m => m.id));
          const newMessages = response.items.filter(m => !existingIds.has(m.id));
          return [...prev, ...newMessages];
        } else {
          return response.items;
        }
      });

      setHasMore(response.pagination.hasMore);
      setNextCursor(response.pagination.nextCursor);

      // Set conversation info if provided
      if (response.meta?.conversationInfo) {
        setConversation(response.meta.conversationInfo);
      }

      // Auto-mark as read if enabled
      if (options.markAsRead && messengerClientRef.current) {
        await messengerClientRef.current.markAsRead(conversationId);
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load messages');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }

      // Try to load from cache if available
      if (messengerClientRef.current) {
        try {
          const cached = await messengerClientRef.current.getCachedMessages(conversationId, {
            limit: options.limit || 50,
            filters
          });
          
          if (cached.length > 0) {
            setMessages(cached);
          }
        } catch (cacheError) {
          console.warn('[useMessenger] Failed to load from cache:', cacheError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, options.limit, nextCursor, filters, isLoading, options.markAsRead, options.onError]);

  /**
   * Subscribe to conversation events
   */
  const subscribeToConversation = useCallback(async () => {
    if (!messengerClientRef.current || !conversationId || isSubscribed) {
      console.log('🔔 Skipping subscription:', {
        hasClient: !!messengerClientRef.current,
        hasConversationId: !!conversationId,
        isSubscribed
      });
      return;
    }

    console.log('🔔 Subscribing to conversation events for:', conversationId);

    // ✅ FIXED: First subscribe to the conversation room (like HTML test)
    try {
      const subscriptionResult = await messengerClientRef.current.subscribeToConversationRoom(conversationId);
      if (!subscriptionResult.success) {
        console.error('Failed to subscribe to conversation room:', subscriptionResult.error);
        return;
      }
      console.log('✅ Successfully subscribed to conversation room:', subscriptionResult.subscriptionId);
    } catch (error) {
      console.error('Error subscribing to conversation room:', error);
      return;
    }

    // ✅ FIXED: Use MessengerClient.subscribeToConversation method instead of direct client.subscribe
    const unsubscribeAll = messengerClientRef.current.subscribeToConversation(conversationId, (eventData) => {
      try {
        console.log('📨 Real-time conversation event:', eventData.type, eventData);
      // Typing indicator events
      if (eventData.type === 'typing_start') {
        const userId = eventData.userId;
        if (userId && session?.user?.id && userId !== session.user.id) {
          setTypingUsers(prev => (prev.includes(userId) ? prev : [...prev, userId]));
        }
      }
      if (eventData.type === 'typing_stop') {
        const userId = eventData.userId;
        if (userId) {
          setTypingUsers(prev => prev.filter(id => id !== userId));
        }
      }

      // Handle message:created events
      if (eventData.type === 'message:created') {
        // Only add to UI if it's for the current conversation (like HTML test line 1389)
        if (eventData.data.conversationId === conversationId) {
          // ✅ FIXED: Use NextAuth session for user ID (like notifications module)
          const currentUserId = session?.user?.id;

          console.log('🔍 Processing message:created event:', {
            messageId: eventData.data.id,
            senderId: eventData.data.senderId,
            senderName: eventData.data.senderName,
            currentUserId,
            isFromCurrentUser: eventData.data.senderId === currentUserId
          });

          // ✅ FIXED: Transform real-time message to match frontend Message interface
          const transformedMessage = {
            ...eventData.data,
            // Create sender object from senderName (now contains full name from backend)
            sender: {
              id: eventData.data.senderId,
              username: eventData.data.senderName,
              fullName: eventData.data.senderName, // Backend now sends full name
              displayName: eventData.data.senderName,
              firstName: eventData.data.senderName?.split(' ')[0],
              lastName: eventData.data.senderName?.split(' ').slice(1).join(' ')
            },
            createdAt: eventData.data.createdAt || new Date().toISOString(),
            updatedAt: eventData.data.updatedAt || new Date().toISOString()
          };

          // ✅ IMPROVED: Handle both own and received messages like HTML test
          if (eventData.data.senderId !== currentUserId) {
            // Message from another user - add it
            setMessages(prev => {
              const exists = prev.some(m => m.id === eventData.data.id);
              if (exists) {
                console.log('🔄 Message already exists, skipping:', eventData.data.id);
                return prev;
              }

              console.log('✅ Adding received message to UI:', eventData.data.id);
              return [...prev, transformedMessage];
            });

            if (options.onMessageReceived) {
              options.onMessageReceived(transformedMessage);
            }
          } else {
            // ✅ IMPROVED: Replace optimistic message with real message (like HTML test)
            console.log('🔄 Replacing optimistic message with real message:', eventData.data.id);
            setMessages(prev => {
              // Find and replace any temporary message for this conversation
              const tempMessageIndex = prev.findIndex(m =>
                m.id.startsWith('temp-') &&
                m.conversationId === conversationId &&
                m.content === eventData.data.content
              );

              if (tempMessageIndex !== -1) {
                // Replace the temporary message
                const newMessages = [...prev];
                newMessages[tempMessageIndex] = transformedMessage;
                console.log('✅ Replaced optimistic message:', prev[tempMessageIndex].id, '→', eventData.data.id);
                return newMessages;
              } else {
                // No matching temp message found, check if real message already exists
                const exists = prev.some(m => m.id === eventData.data.id);
                if (!exists) {
                  console.log('✅ Adding own message (no optimistic found):', eventData.data.id);
                  return [...prev, transformedMessage];
                }
                return prev;
              }
            });
          }
        }
      }

      // Handle message:edited events
      if (eventData.type === 'message:edited') {
        if (eventData.conversationId === conversationId) {
          console.log('✏️ Processing message:edited event:', eventData.messageId);
          setMessages(prev =>
            prev.map(m =>
              m.id === eventData.messageId
                ? {
                    ...m,
                    content: eventData.content,
                    editedAt: eventData.editedAt,
                    metadata: { ...m.metadata, isEdited: true }
                  }
                : m
            )
          );
        }
      }

      // Handle message:deleted events (soft delete)
      if (eventData.type === 'message:deleted') {
        if (eventData.conversationId === conversationId) {
          console.log('🗑️ Processing message:deleted event:', eventData.messageId);
          setMessages(prev =>
            prev.map(m =>
              m.id === eventData.messageId
                ? {
                    ...m,
                    content: 'This message was deleted',
                    deletedAt: eventData.deletedAt,
                    metadata: { ...m.metadata, isDeleted: true }
                  }
                : m
            )
          );
        }
      }

      // Handle message:hard_deleted events (permanent removal)
      if (eventData.type === 'message:hard_deleted') {
        if (eventData.conversationId === conversationId) {
          console.log('💥 Processing message:hard_deleted event:', eventData.messageId);
          setMessages(prev =>
            prev.filter(m => m.id !== eventData.messageId)
          );
        }
      }

      // Handle message:reaction_changed events
      if (eventData.type === 'message:reaction_changed') {
        if (eventData.conversationId === conversationId) {
          console.log('😀 Processing message:reaction_changed event:', eventData.messageId);
          setMessages(prev =>
            prev.map(m =>
              m.id === eventData.messageId
                ? { ...m, reactions: eventData.reactions || [] }
                : m
            )
          );
        }
      }

      // Handle message:status_changed events (read/delivered)
      if (eventData.type === 'message:status_changed') {
        if (eventData.conversationId === conversationId) {
          console.log('📋 Processing message:status_changed event:', eventData.messageId);
          setMessages(prev =>
            prev.map(m =>
              m.id === eventData.messageId
                ? {
                    ...m,
                    status: eventData.status,
                    deliveredAt: eventData.deliveredAt,
                    readAt: eventData.readAt
                  }
                : m
            )
          );
        }
      }

      // Handle connection events
      if (eventData.type === 'connection:connected') {
        console.log('🔌 Connection established:', eventData);
        // Could trigger auto-refresh or re-subscribe logic here
        if (options.autoRefresh) {
          refresh();
        }
      }

      if (eventData.type === 'connection:disconnected') {
        console.log('🔌 Connection lost:', eventData);
        // Could show offline indicator or queue operations
      }
      } catch (error) {
        console.error('❌ Error processing conversation event:', error, eventData);
      }
    });

    // ✅ FIXED: Store the unsubscribe function for cleanup (using top-level ref)
    cleanupRef.current = unsubscribeAll;

    setIsSubscribed(true);
    console.log('✅ Successfully subscribed to conversation:', conversationId);
  }, [conversationId, isSubscribed, options.onMessageReceived, session]); // ✅ FIXED: Add session to dependencies

  /**
   * Load more messages
   */
  const loadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      await loadMessages(true);
    }
  }, [hasMore, isLoading, loadMessages]);

  /**
   * Refresh messages
   */
  const refresh = useCallback(async () => {
    setNextCursor(undefined);
    await loadMessages(false);
  }, [loadMessages]);

  /**
   * Send a message
   */
  const sendMessage = useCallback(async (data: SendMessageData): Promise<Message> => {
    if (!messengerClientRef.current || !conversationId) {
      throw new Error('Messenger client not initialized or no conversation selected');
    }

    // ✅ FIXED: Use NextAuth session for user ID (like notifications module)
    if (sessionStatus !== 'authenticated' || !session?.user?.id) {
      throw new Error('User not authenticated - cannot send message');
    }

    const currentUserId = session.user.id;

    const idempotencyKey = data.idempotencyKey || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`, // More unique temporary ID
      conversationId,
      senderId: currentUserId,
      content: data.content,
      type: 'text',
      status: 'sending',
      reactions: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      cursor: `temp-${Date.now()}`,
      sender: {
        id: currentUserId,
        displayName: session.user.name || session.user.username || 'You',
        username: session.user.username || session.user.name || 'You'
      }
    };

    // Add optimistic message immediately (like HTML test)
    setMessages(prev => [...prev, optimisticMessage]);
    console.log('📤 Added optimistic message:', optimisticMessage.id);

    try {
      const sentMessage = await messengerClientRef.current.sendMessage(conversationId, { ...data, idempotencyKey });

      // ✅ IMPROVED: Replace optimistic message with real message (like HTML test)
      setMessages(prev => {
        const updatedMessages = prev.map(m =>
          m.id === optimisticMessage.id ? { ...sentMessage, status: 'sent' as const } : m
        );
        console.log('✅ Replaced optimistic message with real message:', optimisticMessage.id, '→', sentMessage.id);
        return updatedMessages;
      });

      if (options.onMessageSent) {
        options.onMessageSent(sentMessage);
      }

      return sentMessage;
    } catch (err) {
      // ✅ IMPROVED: Mark optimistic message as failed instead of removing (like HTML test)
      setMessages(prev =>
        prev.map(m =>
          m.id === optimisticMessage.id
            ? { ...m, status: 'failed' as const }
            : m
        )
      );

      console.log('❌ Marked optimistic message as failed:', optimisticMessage.id);

      const error = err instanceof Error ? err : new Error('Failed to send message');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [conversationId, options.onMessageSent, options.onError]);

  /**
   * Edit a message
   */
  const editMessage = useCallback(async (messageId: string, data: EditMessageData) => {
    if (!messengerClientRef.current) return;

    try {
      await messengerClientRef.current.editMessage(messageId, data);
      
      // Update local state optimistically
      setMessages(prev => 
        prev.map(message => {
          if (message.id === messageId) {
            return {
              ...message,
              content: data.content,
              editedAt: new Date().toISOString(),
              metadata: { ...message.metadata, ...data.metadata }
            };
          }
          return message;
        })
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to edit message');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
    }
  }, [options.onError]);

  /**
   * Delete a message
   */
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!messengerClientRef.current) return;

    try {
      await messengerClientRef.current.deleteMessage(messageId);
      
      // Update local state optimistically
      setMessages(prev => 
        prev.map(message => {
          if (message.id === messageId) {
            return {
              ...message,
              deletedAt: new Date().toISOString()
            };
          }
          return message;
        })
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete message');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
    }
  }, [options.onError]);

  /**
   * React to a message
   */
  const reactToMessage = useCallback(async (messageId: string, emoji: string) => {
    if (!messengerClientRef.current) return;

    try {
      await messengerClientRef.current.reactToMessage(messageId, emoji);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to react to message');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
    }
  }, [options.onError]);

  /**
   * Remove reaction from a message
   */
  const removeReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!messengerClientRef.current) return;

    try {
      await messengerClientRef.current.removeReaction(messageId, emoji);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove reaction');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
    }
  }, [options.onError]);

  /**
   * Mark conversation as read
   */
  const markAsRead = useCallback(async () => {
    if (!messengerClientRef.current || !conversationId) return;

    try {
      await messengerClientRef.current.markAsRead(conversationId);
      
      // Update conversation state
      if (conversation) {
        setConversation(prev => prev ? { ...prev, unreadCount: 0 } : null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to mark as read');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
    }
  }, [conversationId, conversation, options.onError]);

  /**
   * Set filters
   */
  const setFilters = useCallback((newFilters: MessageFilters) => {
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
   * Get message by ID
   */
  const getMessageById = useCallback((id: string): Message | undefined => {
    return messages.find(message => message.id === id);
  }, [messages]);

  /**
   * Get unread messages
   */
  const getUnreadMessages = useCallback((): Message[] => {
    return messages.filter(message => message.status !== 'read');
  }, [messages]);

  /**
   * Get messenger client instance (for direct access)
   */
  const getClient = useCallback(() => {
    return messengerClientRef.current;
  }, []);

  /**
   * Search messages in current conversation (like HTML test)
   */
  const searchMessages = useCallback(async (query: string) => {
    if (!messengerClientRef.current || !conversationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await messengerClientRef.current.searchMessages(conversationId, query, {
        limit: options.limit || 50,
        filters
      });

      setMessages(response.messages || []);
      setHasMore(response.pagination?.hasMore || false);
      setNextCursor(response.pagination?.nextCursor);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to search messages');
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, options.limit, filters, options.onError]);

  /**
   * Clear search and reload messages
   */
  const clearSearch = useCallback(async () => {
    setNextCursor(undefined);
    await loadMessages(false);
  }, [loadMessages]);

  /**
   * Reply to a message
   */
  const replyToMessage = useCallback(async (replyToId: string, data: Omit<SendMessageData, 'replyToId'>): Promise<Message> => {
    if (!messengerClientRef.current || !conversationId) {
      throw new Error('Messenger client not initialized or no conversation selected');
    }

    try {
      const message = await messengerClientRef.current.replyToMessage(conversationId, replyToId, data);

      // Add to local state (optimistic update)
      setMessages(prev => [...prev, message]);

      if (options.onMessageSent) {
        options.onMessageSent(message);
      }

      return message;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reply to message');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [conversationId, options.onMessageSent, options.onError]);

  /**
   * Join conversation
   */
  const joinConversation = useCallback(async (): Promise<void> => {
    if (!messengerClientRef.current || !conversationId) {
      throw new Error('Messenger client not initialized or no conversation selected');
    }

    try {
      await messengerClientRef.current.joinConversation(conversationId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to join conversation');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [conversationId, options.onError]);

  /**
   * Leave conversation
   */
  const leaveConversation = useCallback(async (): Promise<void> => {
    if (!messengerClientRef.current || !conversationId) {
      throw new Error('Messenger client not initialized or no conversation selected');
    }

    try {
      await messengerClientRef.current.leaveConversation(conversationId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to leave conversation');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [conversationId, options.onError]);

  /**
   * Add participants to conversation
   */
  const addParticipants = useCallback(async (participantIds: string[]): Promise<void> => {
    if (!messengerClientRef.current || !conversationId) {
      throw new Error('Messenger client not initialized or no conversation selected');
    }

    try {
      await messengerClientRef.current.addParticipants(conversationId, participantIds);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add participants');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [conversationId, options.onError]);

  /**
   * Remove participants from conversation
   */
  const removeParticipants = useCallback(async (participantIds: string[]): Promise<void> => {
    if (!messengerClientRef.current || !conversationId) {
      throw new Error('Messenger client not initialized or no conversation selected');
    }

    try {
      await messengerClientRef.current.removeParticipants(conversationId, participantIds);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove participants');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [conversationId, options.onError]);

  /**
   * Get presence information
   */
  const getPresence = useCallback(async (): Promise<any> => {
    if (!messengerClientRef.current || !conversationId) {
      throw new Error('Messenger client not initialized or no conversation selected');
    }

    try {
      return await messengerClientRef.current.getPresence(conversationId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get presence');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [conversationId, options.onError]);

  /**
   * Get read status information
   */
  const getReadStatus = useCallback(async (): Promise<any> => {
    if (!messengerClientRef.current || !conversationId) {
      throw new Error('Messenger client not initialized or no conversation selected');
    }

    try {
      return await messengerClientRef.current.getReadStatus(conversationId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get read status');
      setError(error);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [conversationId, options.onError]);

  return {
    // Data
    messages,
    conversation,
    typingUsers,
    
    // State
    isLoading,
    hasMore,
    error,
    isSubscribed,
    
    // Actions
    loadMore,
    refresh,
    sendMessage,
    replyToMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    removeReaction,
    markAsRead,

    // Conversation Management
    joinConversation,
    leaveConversation,
    addParticipants,
    removeParticipants,

    // Presence & Read Status
    getPresence,
    getReadStatus,
    
    // Filters
    setFilters,
    clearFilters,

    // Search
    searchMessages,
    clearSearch,

    // Utils
    getMessageById,
    getUnreadMessages,
    getClient
  };
}

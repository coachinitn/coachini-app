/**
 * React hook for SyncBase conversations
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { MessengerClient } from './MessengerClient';
import {
  Conversation,
  ConversationFilters,
  CreateConversationData,
  UseConversationsOptions,
  UseConversationsReturn
} from './types';
import { useSyncBase } from '../../providers/SyncBaseProvider';
import { WEBSOCKET_EVENTS } from '../../constants';

export function useConversations(options: UseConversationsOptions = {}): UseConversationsReturn {
  const { client } = useSyncBase();
  const { data: session, status: sessionStatus } = useSession();
  const messengerClientRef = useRef<MessengerClient | null>(null);
  const userConversationsSubscribed = useRef<boolean>(false);

  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [filters, setFiltersState] = useState<ConversationFilters>(options.filters || {});

  // Initialize messenger client
  useEffect(() => {
    if (client && !messengerClientRef.current) {
      messengerClientRef.current = new MessengerClient(client);
    }
  }, [client]);

  // Subscribe to user conversations (like HTML test)
  useEffect(() => {
    if (messengerClientRef.current && sessionStatus === 'authenticated' && session?.user?.id && !userConversationsSubscribed.current) {
      const subscribeToUserConversations = async () => {
        try {
          console.log('[useConversations] Subscribing to user conversations for:', session.user.id);

          const result = await messengerClientRef.current!.subscribeToUserConversations(session.user.id);
          if (result.success) {
            userConversationsSubscribed.current = true;
            console.log('[useConversations] Successfully subscribed to user conversations');
          } else {
            console.error('[useConversations] Failed to subscribe to user conversations:', result.error);
          }
        } catch (error) {
          console.error('[useConversations] Error subscribing to user conversations:', error);
        }
      };

      subscribeToUserConversations();
    }
    return () => {
      // cleanup user conversations subscription if needed
      try {
        if (messengerClientRef.current && session?.user?.id) {
          messengerClientRef.current.unsubscribeFromUserConversations(session.user.id);
        }
      } catch {}
      userConversationsSubscribed.current = false;
    };
  }, [messengerClientRef.current, sessionStatus, session?.user?.id]);

  // Load initial conversations and subscribe to real-time updates
  useEffect(() => {
    if (messengerClientRef.current && !isLoading) {
      loadConversations();

      // Subscribe to conversation-level events (like HTML test)
      const client = messengerClientRef.current.getClient();
      if (client) {
        // Listen for read status changes
        const unsubscribeReadStatus = client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_READ_STATUS_CHANGED, (eventData) => {
          console.log('📖 Read status changed:', eventData);

          // Update conversation unread status
          setConversations(prev =>
            prev.map(conv =>
              conv.id === eventData.conversationId
                ? {
                    ...conv,
                    unreadCount: eventData.unreadCount || 0,
                    hasUnread: eventData.hasUnread || false
                  }
                : conv
            )
          );
        });

        // Listen for conversation updates
        const unsubscribeConvUpdated = client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_UPDATED, (eventData) => {
          console.log('🔄 Conversation updated:', eventData);

          setConversations(prev =>
            prev.map(conv =>
              conv.id === eventData.conversationId
                ? { ...conv, ...eventData }
                : conv
            )
          );
        });

        // ✅ UNIFIED: Single subscription for all conversation list updates
        // UnifiedMessageHandler sends conversation list updates via message:created for new/edited/deleted messages
        const unsubscribeMessageCreated = client.subscribe(WEBSOCKET_EVENTS.BROADCAST_MESSAGE_CREATED, (eventData) => {
          console.log('📨 Unified message event (conversation list):', eventData);

          setConversations(prev =>
            prev.map(conv =>
              conv.id === eventData.conversationId
                ? {
                    ...conv,
                    // Use preview if available (from UnifiedMessageHandler), otherwise content
                    lastMessage: eventData.preview || eventData.content || '[No content]',
                    lastMessageAt: eventData.createdAt || eventData.updatedAt || eventData.editedAt,
                    // Store last message sender in metadata since it's not in the Conversation type
                    metadata: {
                      ...conv.metadata,
                      lastMessageBy: eventData.senderId,
                      // Handle deleted messages
                      ...(eventData.deletedAt && {
                        lastMessage: '[Message deleted]',
                        lastMessageAt: eventData.deletedAt
                      })
                    }
                  }
                : conv
            )
          );
        });

        // ⚠️ DISABLED: Redundant with UnifiedMessageHandler - conversation list updates now come via message:created
        // const unsubscribeMessageAdded = client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_MESSAGE_ADDED, (eventData) => {
        //   console.log('📨 Conversation message added:', eventData);
        //   // ... (removed redundant conversation list update logic)
        // });
        const unsubscribeMessageAdded = () => {}; // No-op for cleanup compatibility

        // ⚠️ DISABLED: Redundant with UnifiedMessageHandler - conversation list updates now come via message:created
        // const unsubscribeLastMessageUpdated = client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_LAST_MESSAGE_UPDATED, (eventData) => {
        //   console.log('📨 Conversation last message updated:', eventData);
        //   // ... (removed redundant conversation list update logic)
        // });
        const unsubscribeLastMessageUpdated = () => {}; // No-op for cleanup compatibility

        // Listen for conversation:created (like HTML test)
        const unsubscribeConversationCreated = client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_CREATED, (eventData) => {
          console.log('🆕 New conversation created:', eventData);

          // Add new conversation to the list
          setConversations(prev => {
            const exists = prev.some(conv => conv.id === eventData.conversationId);
            if (exists) return prev;

            return [eventData, ...prev]; // Add to beginning
          });
        });

        // ✅ NEW: Listen for conversation:deleted
        const unsubscribeConversationDeleted = client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_DELETED, (eventData) => {
          console.log('🗑️ Conversation deleted:', eventData);

          // Remove conversation from the list
          setConversations(prev =>
            prev.filter(conv => conv.id !== eventData.conversationId)
          );
        });

        // ✅ NEW: Listen for conversation:archived
        const unsubscribeConversationArchived = client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_ARCHIVED, (eventData) => {
          console.log('📦 Conversation archived:', eventData);

          // Update conversation archived status
          setConversations(prev =>
            prev.map(conv =>
              conv.id === eventData.conversationId
                ? {
                    ...conv,
                    isArchived: eventData.isArchived,
                    archivedAt: eventData.isArchived ? eventData.timestamp : null
                  }
                : conv
            )
          );
        });

        // Listen for conversation:presence_changed (like HTML test)
        const unsubscribePresenceChanged = client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_PRESENCE_CHANGED, (eventData) => {
          console.log('👁️ Conversation presence changed:', eventData);

          // Update presence info (could be used for online indicators)
          setConversations(prev =>
            prev.map(conv =>
              conv.id === eventData.conversationId
                ? {
                    ...conv,
                    // Add presence info to metadata or specific fields
                    metadata: {
                      ...conv.metadata,
                      presence: eventData.presence || eventData,
                      presentUsers: eventData.presentUsers,
                      presentCount: eventData.presentCount
                    }
                  }
                : conv
            )
          );
        });

        // Listen for conversation:participant_joined (like HTML test)
        const unsubscribeParticipantJoined = client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_PARTICIPANT_JOINED, (eventData) => {
          console.log('👋 Participant joined conversation:', eventData);

          setConversations(prev =>
            prev.map(conv =>
              conv.id === eventData.conversationId
                ? {
                    ...conv,
                    // Store participant info in metadata since participantCount is not in Conversation type
                    metadata: {
                      ...conv.metadata,
                      participantCount: (conv.metadata?.participantCount || conv.participants?.length || 0) + 1,
                      lastParticipantAction: 'joined',
                      lastParticipantId: eventData.userId
                    }
                  }
                : conv
            )
          );
        });

        // Listen for conversation:participant_left (like HTML test)
        const unsubscribeParticipantLeft = client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_PARTICIPANT_LEFT, (eventData) => {
          console.log('👋 Participant left conversation:', eventData);

          setConversations(prev =>
            prev.map(conv =>
              conv.id === eventData.conversationId
                ? {
                    ...conv,
                    // Store participant info in metadata since participantCount is not in Conversation type
                    metadata: {
                      ...conv.metadata,
                      participantCount: Math.max((conv.metadata?.participantCount || conv.participants?.length || 1) - 1, 0),
                      lastParticipantAction: 'left',
                      lastParticipantId: eventData.userId
                    }
                  }
                : conv
            )
          );
        });

        // ✅ NEW: Listen for connection events (like HTML test line 339-345)
        const unsubscribeConnected = client.on('connection:connected', (eventData) => {
          console.log('🔌 Connection established (conversations):', eventData);
          // Auto-refresh conversations when reconnected
          if (options.autoRefresh !== false) {
            loadConversations();
          }
        });

        const unsubscribeDisconnected = client.on('connection:disconnected', (eventData) => {
          console.log('🔌 Connection lost (conversations):', eventData);
          // Could show offline indicator
        });

        // Cleanup subscriptions
        return () => {
          unsubscribeReadStatus();
          unsubscribeConvUpdated();
          unsubscribeMessageCreated();
          unsubscribeMessageAdded();
          unsubscribeLastMessageUpdated();
          unsubscribeConversationCreated();
          unsubscribeConversationDeleted(); // ✅ NEW: Cleanup conversation deletion events
          unsubscribeConversationArchived(); // ✅ NEW: Cleanup conversation archiving events
          unsubscribePresenceChanged();
          unsubscribeParticipantJoined();
          unsubscribeParticipantLeft();
          unsubscribeConnected(); // ✅ NEW: Cleanup connection events
          unsubscribeDisconnected(); // ✅ NEW: Cleanup connection events
        };
      }
    }
  }, [messengerClientRef.current, filters]);

  /**
   * Load conversations
   */
  const loadConversations = useCallback(async (loadMore: boolean = false) => {
    if (!messengerClientRef.current || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await messengerClientRef.current.getConversations({
        limit: options.limit || 20,
        cursor: loadMore ? nextCursor : undefined,
        filters
      });

      // Enrich conversations with read status (like HTML test)
      const currentUserId = session?.user?.id;
      await messengerClientRef.current.enrichConversationsWithReadStatus(response.items, currentUserId);

      setConversations(prev => {
        if (loadMore) {
          // Remove duplicates and merge
          const existingIds = new Set(prev.map(c => c.id));
          const newConversations = response.items.filter(c => !existingIds.has(c.id));
          return [...prev, ...newConversations];
        } else {
          return response.items;
        }
      });

      setHasMore(response.pagination.hasMore);
      setNextCursor(response.pagination.nextCursor);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load conversations');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }

      // Try to load from cache if available
      if (messengerClientRef.current) {
        try {
          const cached = await messengerClientRef.current.getCachedConversations({
            limit: options.limit || 20,
            filters
          });
          
          if (cached.length > 0) {
            setConversations(cached);
          }
        } catch (cacheError) {
          console.warn('[useConversations] Failed to load from cache:', cacheError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [options.limit, nextCursor, filters, isLoading, options.onError]);

  /**
   * Load more conversations
   */
  const loadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      await loadConversations(true);
    }
  }, [hasMore, isLoading, loadConversations]);

  /**
   * Refresh conversations
   */
  const refresh = useCallback(async () => {
    setNextCursor(undefined);
    await loadConversations(false);
  }, [loadConversations]);

  /**
   * Select a conversation
   */
  const selectConversation = useCallback((conversation: Conversation) => {
    setSelectedConversation(conversation);

    if (options.onConversationSelected) {
      options.onConversationSelected(conversation);
    }
  }, [options.onConversationSelected]);

  /**
   * Clear conversation selection
   */
  const clearSelection = useCallback(() => {
    setSelectedConversation(null);
  }, []);

  /**
   * Create a new conversation
   */
  const createConversation = useCallback(async (data: CreateConversationData): Promise<Conversation> => {
    if (!messengerClientRef.current) {
      throw new Error('Messenger client not initialized');
    }

    try {
      const conversation = await messengerClientRef.current.createConversation(data);
      
      // Add to local state optimistically
      setConversations(prev => [conversation, ...prev]);
      
      return conversation;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create conversation');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
      
      throw error;
    }
  }, [options.onError]);

  /**
   * Archive conversation
   */
  const archiveConversation = useCallback(async (conversationId: string) => {
    // Implementation would depend on backend API
    console.log('Archive conversation:', conversationId);
  }, []);

  /**
   * Unarchive conversation
   */
  const unarchiveConversation = useCallback(async (conversationId: string) => {
    // Implementation would depend on backend API
    console.log('Unarchive conversation:', conversationId);
  }, []);

  /**
   * Mute conversation
   */
  const muteConversation = useCallback(async (conversationId: string) => {
    // Implementation would depend on backend API
    console.log('Mute conversation:', conversationId);
  }, []);

  /**
   * Unmute conversation
   */
  const unmuteConversation = useCallback(async (conversationId: string) => {
    // Implementation would depend on backend API
    console.log('Unmute conversation:', conversationId);
  }, []);

  /**
   * Set filters
   */
  const setFilters = useCallback((newFilters: ConversationFilters) => {
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
   * Get conversation by ID
   */
  const getConversationById = useCallback((id: string): Conversation | undefined => {
    return conversations.find(conversation => conversation.id === id);
  }, [conversations]);

  /**
   * Get unread conversations
   */
  const getUnreadConversations = useCallback((): Conversation[] => {
    return conversations.filter(conversation => conversation.unreadCount > 0);
  }, [conversations]);

  /**
   * Search conversations (like HTML test)
   */
  const searchConversations = useCallback(async (query: string) => {
    if (!messengerClientRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await messengerClientRef.current.searchConversations(query, {
        limit: options.limit || 20,
        filters
      });

      setConversations(response.conversations || []);
      setHasMore(response.pagination?.hasMore || false);
      setNextCursor(response.pagination?.nextCursor);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to search conversations');
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [options.limit, filters, options.onError]);

  /**
   * Clear search and reload conversations
   */
  const clearSearch = useCallback(async () => {
    setNextCursor(undefined);
    await loadConversations(false);
  }, [loadConversations]);

  return {
    // Data
    conversations,
    selectedConversation,
    
    // State
    isLoading,
    hasMore,
    error,
    
    // Actions
    loadMore,
    refresh,
    selectConversation,
    clearSelection,
    createConversation,
    archiveConversation,
    unarchiveConversation,
    muteConversation,
    unmuteConversation,
    
    // Filters
    setFilters,
    clearFilters,

    // Search
    searchConversations,
    clearSearch,

    // Utils
    getConversationById,
    getUnreadConversations
  };
}

/**
 * Messenger Client for SyncBase
 * Handles conversation and message operations
 */

import { SyncBaseClient } from '../../core/SyncBaseClient';
import { WEBSOCKET_EVENTS } from '../../constants';
import { SyncBaseResponse } from '../../types/shared';
import {
  Conversation,
  Message,
  ConversationOptions,
  MessageOptions,
  CreateConversationData,
  SendMessageData,
  EditMessageData,
  ConversationListResponse,
  MessageListResponse
} from './types';

export class MessengerClient {
  private client: SyncBaseClient;
  private subscriptions: Map<string, (() => void)[]> = new Map();
  private conversationSubscriptionIds: Map<string, string> = new Map();

  constructor(client: SyncBaseClient) {
    this.client = client;
  }

  /**
   * Get the underlying SyncBase client
   */
  getClient(): SyncBaseClient {
    return this.client;
  }

  // ========================================
  // CONVERSATION METHODS
  // ========================================

  /**
   * Get conversations with pagination
   */
  async getConversations(options: ConversationOptions = {}): Promise<ConversationListResponse> {
    const payload = {
      limit: options.limit || 20,
      direction: options.direction || 'before',
      sortBy: options.sortBy || 'cursor',
      sortOrder: options.sortOrder || 'DESC',
      cursor: options.cursor,
      includeParticipants: options.includeParticipants !== false,
      includeLastMessage: options.includeLastMessage !== false,
      ...options.filters
    };

    const response = await this.client.sendEvent<{
      conversations: Conversation[];
      pagination: any;
      meta: any;
    }>(WEBSOCKET_EVENTS.MESSENGER_GET_CONVERSATIONS, payload);

    if (response.success && response.data) {
      const { conversations, pagination, meta } = response.data;

      // Cache conversations if storage is available
      const storage = this.client.getStorage();
      if (storage) {
        for (const conversation of conversations) {
          await storage.set('conversations', conversation.id, conversation);
        }
      }

      return {
        items: conversations,
        pagination: {
          hasMore: pagination.hasMore || false,
          nextCursor: pagination.nextCursor,
          prevCursor: pagination.prevCursor,
          limit: payload.limit
        },
        meta
      };
    }

    throw new Error(response.error?.message || 'Failed to get conversations');
  }

  /**
   * Create a new conversation
   */
  async createConversation(data: CreateConversationData): Promise<Conversation> {
    const response = await this.client.sendEvent<{ conversation: Conversation }>(
      WEBSOCKET_EVENTS.MESSENGER_CREATE_CONVERSATION,
      data
    );

    if (response.success && response.data) {
      const conversation = response.data.conversation;

      // Cache the new conversation if storage is available
      const storage = this.client.getStorage();
      if (storage) {
        await storage.set('conversations', conversation.id, conversation);
      }

      return conversation;
    }

    throw new Error(response.error?.message || 'Failed to create conversation');
  }

  /**
   * Get a specific conversation
   */
  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await this.client.sendEvent<{ conversation: Conversation }>(
      WEBSOCKET_EVENTS.MESSENGER_GET_CONVERSATION,
      { conversationId }
    );

    if (response.success && response.data) {
      const conversation = response.data.conversation;

      // Cache the conversation if storage is available
      const storage = this.client.getStorage();
      if (storage) {
        await storage.set('conversations', conversation.id, conversation);
      }

      return conversation;
    }

    throw new Error(response.error?.message || 'Failed to get conversation');
  }

  // ========================================
  // MESSAGE METHODS
  // ========================================

  /**
   * Get messages with pagination
   */
  async getMessages(options: MessageOptions): Promise<MessageListResponse> {
    const payload = {
      conversationId: options.conversationId,
      limit: options.limit || 50,
      direction: options.direction || 'before',
      sortBy: options.sortBy || 'cursor',
      sortOrder: options.sortOrder || 'DESC',
      cursor: options.cursor,
      includeReactions: options.includeReactions !== false,
      includeAttachments: options.includeAttachments !== false,
      includeReplies: options.includeReplies !== false,
      ...options.filters
    };

    const response = await this.client.sendEvent<{
      messages: Message[];
      pagination: any;
      meta: any;
      conversationInfo?: Conversation;
    }>(WEBSOCKET_EVENTS.MESSENGER_GET_MESSAGES, payload);

    if (response.success && response.data) {
      const { messages, pagination, meta, conversationInfo } = response.data;

      // Cache messages if storage is available
      const storage = this.client.getStorage();
      if (storage) {
        for (const message of messages) {
          await storage.set('messages', message.id, message);
        }

        // Cache conversation info if provided
        if (conversationInfo) {
          await storage.set('conversations', conversationInfo.id, conversationInfo);
        }
      }

      return {
        items: messages,
        pagination: {
          hasMore: pagination.hasMore || false,
          nextCursor: pagination.nextCursor,
          prevCursor: pagination.prevCursor,
          limit: payload.limit
        },
        meta: {
          ...meta,
          conversationInfo
        }
      };
    }

    throw new Error(response.error?.message || 'Failed to get messages');
  }

  /**
   * Send a message
   */
  async sendMessage(conversationId: string, data: SendMessageData): Promise<Message> {
    // Transform draft attachments to backend DTO if provided
    const draft = (data as any).attachmentsDraft as Array<{
      fileId: string; filename: string; originalName: string; mimeType: string; thumbnailUrl?: string;
    }> | undefined;

    const payload = {
      conversationId,
      type: data.type || 'text',
      idempotencyKey: data.idempotencyKey || `msg_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      ...(draft ? { attachments: draft } : {}),
      // spread after so content/reply/metadata remain
      ...data,
    };

    const response = await this.client.sendEvent<{ message: Message }>(
      WEBSOCKET_EVENTS.MESSENGER_SEND_MESSAGE,
      payload
    );

    if (response.success && response.data) {
      const message = response.data.message;

      // Cache the new message if storage is available
      const storage = this.client.getStorage();
      if (storage) {
        await storage.set('messages', message.id, message);
      }

      return message;
    }

    throw new Error(response.error?.message || 'Failed to send message');
  }

  /**
   * Reply to a message
   */
  async replyToMessage(conversationId: string, replyToId: string, data: Omit<SendMessageData, 'replyToId'>): Promise<Message> {
    return this.sendMessage(conversationId, {
      ...data,
      replyToId
    });
  }

  /**
   * Edit a message
   */
  async editMessage(messageId: string, data: EditMessageData): Promise<void> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_EDIT_MESSAGE, {
      messageId,
      ...data
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to edit message');
    }

    // Update cached message if storage is available
    const storage = this.client.getStorage();
    if (storage) {
      const cached = await storage.get<Message>('messages', messageId);
      if (cached) {
        cached.content = data.content;
        cached.editedAt = new Date().toISOString();
        if (data.metadata) {
          cached.metadata = { ...cached.metadata, ...data.metadata };
        }
        await storage.set('messages', messageId, cached);
      }
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<void> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_DELETE_MESSAGE, {
      messageId
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to delete message');
    }

    // Update cached message if storage is available
    const storage = this.client.getStorage();
    if (storage) {
      const cached = await storage.get<Message>('messages', messageId);
      if (cached) {
        cached.deletedAt = new Date().toISOString();
        await storage.set('messages', messageId, cached);
      }
    }
  }

  /**
   * React to a message
   */
  async reactToMessage(messageId: string, emoji: string): Promise<void> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_REACT_MESSAGE, {
      messageId,
      emoji
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to add reaction');
    }
  }

  /**
   * Remove reaction from a message
   */
  async removeReaction(messageId: string, emoji: string): Promise<void> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_REMOVE_REACTION, {
      messageId,
      emoji
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to remove reaction');
    }
  }

  /**
   * Mark conversation as read
   */
  async markAsRead(conversationId: string): Promise<void> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_MARK_AS_READ, {
      conversationId
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to mark conversation as read');
    }

    // Update cached conversation if storage is available
    const storage = this.client.getStorage();
    if (storage) {
      const cached = await storage.get<Conversation>('conversations', conversationId);
      if (cached) {
        cached.unreadCount = 0;
        await storage.set('conversations', conversationId, cached);
      }
    }
  }

  // ========================================
  // 🔍 SEARCH & FILTERING METHODS
  // ========================================

  /**
   * Search conversations
   */
  async searchConversations(query: string, options: any = {}): Promise<any> {
    const payload = {
      search: query,
      limit: options.limit || 20,
      cursor: options.cursor,
      ...options.filters
    };

    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_GET_CONVERSATIONS, payload);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error?.message || 'Failed to search conversations');
  }

  /**
   * Search messages in a conversation
   */
  async searchMessages(conversationId: string, query: string, options: any = {}): Promise<any> {
    const payload = {
      conversationId,
      search: query,
      limit: options.limit || 20,
      cursor: options.cursor,
      ...options.filters
    };

    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_GET_MESSAGES, payload);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error?.message || 'Failed to search messages');
  }

  /**
   * Enrich conversations with read status (like HTML test)
   */
  async enrichConversationsWithReadStatus(conversations: Conversation[], currentUserId?: string): Promise<void> {
    if (!conversations || conversations.length === 0) return;

    try {
      for (const conversation of conversations) {
        try {
          const readStatus = await this.getReadStatus(conversation.id);

          // Find current user's read status
          if (currentUserId && readStatus.participantReadStatus) {
            const userReadStatus = readStatus.participantReadStatus.find((p: any) => p.userId === currentUserId);

            if (userReadStatus) {
              conversation.unreadCount = userReadStatus.unreadCount || 0;
              // Store lastReadAt in metadata since it's not part of Conversation interface
              if (userReadStatus.lastReadAt) {
                conversation.metadata = {
                  ...conversation.metadata,
                  lastReadAt: userReadStatus.lastReadAt
                };
              }
            }
          } else if (readStatus.participantReadStatus) {
            // Fallback: use first participant's read status if no currentUserId provided
            const firstParticipant = readStatus.participantReadStatus[0];
            if (firstParticipant) {
              conversation.unreadCount = firstParticipant.unreadCount || 0;
            }
          }
        } catch (error) {
          console.warn(`Failed to get read status for conversation ${conversation.id}:`, error);
        }
      }
    } catch (error) {
      console.warn('Error enriching conversations with read status:', error);
    }
  }

  // ========================================
  // 👥 CONVERSATION MANAGEMENT
  // ========================================

  /**
   * Join a conversation (set presence)
   */
  async joinConversation(conversationId: string): Promise<void> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_JOIN_CONVERSATION, {
      conversationId
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to join conversation');
    }
  }

  /**
   * Leave a conversation (remove presence)
   */
  async leaveConversation(conversationId: string): Promise<void> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_LEAVE_CONVERSATION, {
      conversationId
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to leave conversation');
    }
  }

  /**
   * Add participants to a conversation
   */
  async addParticipants(conversationId: string, participantIds: string[]): Promise<void> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_ADD_PARTICIPANTS, {
      conversationId,
      participantIds
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to add participants');
    }
  }

  /**
   * Remove participants from a conversation
   */
  async removeParticipants(conversationId: string, participantIds: string[]): Promise<void> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_REMOVE_PARTICIPANTS, {
      conversationId,
      participantIds
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to remove participants');
    }
  }

  // ========================================
  // 👁️ PRESENCE & READ STATUS
  // ========================================

  /**
   * Get conversation presence information
   */
  async getPresence(conversationId: string): Promise<any> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_GET_PRESENCE, {
      conversationId
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to get presence information');
    }

    return response.data;
  }

  /**
   * Get read status for a conversation
   */
  async getReadStatus(conversationId: string): Promise<any> {
    const response = await this.client.sendEvent(WEBSOCKET_EVENTS.MESSENGER_GET_READ_STATUS, {
      conversationId
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to get read status');
    }

    return response.data;
  }

  // ========================================
  // SUBSCRIPTION METHODS
  // ========================================

  /**
   * Subscribe to user conversations (like HTML test)
   * This subscribes to the user's conversation list for real-time updates
   */
  async subscribeToUserConversations(userId: string): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    try {
      console.log('[MessengerClient] Subscribing to user conversations for:', userId);

      const response = await this.client.sendEvent<{ subscriptionId: string }>(
        WEBSOCKET_EVENTS.SUBSCRIPTION_SUBSCRIBE,
        {
          type: 'messenger:user_conversations',
          target: userId
        }
      );

      if (response.success) {
        console.log('[MessengerClient] Successfully subscribed to user conversations:', response.data);
        return {
          success: true,
          subscriptionId: response.data?.subscriptionId
        };
      } else {
        console.error('[MessengerClient] Failed to subscribe to user conversations:', response.error);
        return {
          success: false,
          error: response.error?.message || 'Subscription failed'
        };
      }
    } catch (error) {
      console.error('[MessengerClient] Error subscribing to user conversations:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Unsubscribe from user conversations feed
   */
  async unsubscribeFromUserConversations(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // currently only client-side event listeners; real gateway unsubscribe would use subscriptionId
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Subscribe to a specific conversation (like HTML test)
   * This subscribes to the conversation room for real-time message updates
   */
  async subscribeToConversationRoom(conversationId: string): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    try {
      console.log('[MessengerClient] Subscribing to conversation room:', conversationId);

      const response = await this.client.sendEvent<{ subscriptionId: string }>(
        WEBSOCKET_EVENTS.SUBSCRIPTION_SUBSCRIBE,
        {
          type: 'messenger:conversation',
          target: conversationId
        }
      );

      if (response.success) {
        console.log('[MessengerClient] Successfully subscribed to conversation room:', response.data);
        if (response.data?.subscriptionId) {
          this.conversationSubscriptionIds.set(conversationId, response.data.subscriptionId);
        }
        return {
          success: true,
          subscriptionId: response.data?.subscriptionId
        };
      } else {
        console.error('[MessengerClient] Failed to subscribe to conversation room:', response.error);
        return {
          success: false,
          error: response.error?.message || 'Subscription failed'
        };
      }
    } catch (error) {
      console.error('[MessengerClient] Error subscribing to conversation room:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Unsubscribe from a specific conversation room
   */
  async unsubscribeFromConversationRoom(conversationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Unsubscribe server-side if we have subscriptionId
      const subId = this.conversationSubscriptionIds.get(conversationId);
      if (subId) {
        await this.client.sendEvent(WEBSOCKET_EVENTS.SUBSCRIPTION_UNSUBSCRIBE, { subscriptionId: subId });
        this.conversationSubscriptionIds.delete(conversationId);
      }
      // Remove local event listeners
      const subs = this.subscriptions.get(conversationId) || [];
      subs.forEach(unsub => { try { unsub(); } catch {} });
      this.subscriptions.delete(conversationId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Subscribe to conversation events (enhanced to match HTML test)
   * This only sets up event listeners - use subscribeToConversationRoom for actual subscription
   */
  subscribeToConversation(conversationId: string, callback: (data: any) => void): () => void {
    // Typing events
    const typingStartUnsubscribe = this.client.subscribe('typing_start', (data) => {
      if (data?.conversationId === conversationId) callback({ type: 'typing_start', ...data });
    });
    const typingStopUnsubscribe = this.client.subscribe('typing_stop', (data) => {
      if (data?.conversationId === conversationId) callback({ type: 'typing_stop', ...data });
    });
    // ✅ FIXED: Wrap callbacks to add event type information
    const messageCreatedUnsubscribe = this.client.subscribe(WEBSOCKET_EVENTS.BROADCAST_MESSAGE_CREATED, (data) => {
      callback({ type: 'message:created', data });
    });
    const messageEditedUnsubscribe = this.client.subscribe(WEBSOCKET_EVENTS.BROADCAST_MESSAGE_EDITED, (data) => {
      callback({ type: 'message:edited', data });
    });
    const messageDeletedUnsubscribe = this.client.subscribe(WEBSOCKET_EVENTS.BROADCAST_MESSAGE_DELETED, (data) => {
      callback({ type: 'message:deleted', data });
    });
    const messageHardDeletedUnsubscribe = this.client.subscribe(WEBSOCKET_EVENTS.BROADCAST_MESSAGE_HARD_DELETED, (data) => {
      callback({ type: 'message:hard_deleted', data });
    });

    // Message status and reaction events (like HTML test)
    const messageReactionChangedUnsubscribe = this.client.subscribe(WEBSOCKET_EVENTS.BROADCAST_MESSAGE_REACTION_CHANGED, callback);
    const messageStatusChangedUnsubscribe = this.client.subscribe(WEBSOCKET_EVENTS.BROADCAST_MESSAGE_STATUS_CHANGED, callback);

    // Conversation events (like HTML test)
    const conversationCreatedUnsubscribe = this.client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_CREATED, callback);
    const conversationUpdatedUnsubscribe = this.client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_UPDATED, callback);
    // Removed deprecated events; updates come through MESSAGE_CREATED
    const conversationLastMessageUpdatedUnsubscribe = () => {};
    const conversationMessageAddedUnsubscribe = () => {};

    // Presence and participant events (like HTML test)
    const conversationPresenceChangedUnsubscribe = this.client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_PRESENCE_CHANGED, callback);
    const conversationReadStatusChangedUnsubscribe = this.client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_READ_STATUS_CHANGED, callback);
    const conversationParticipantJoinedUnsubscribe = this.client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_PARTICIPANT_JOINED, callback);
    const conversationParticipantLeftUnsubscribe = this.client.subscribe(WEBSOCKET_EVENTS.BROADCAST_CONVERSATION_PARTICIPANT_LEFT, callback);

    if (!this.subscriptions.has(conversationId)) {
      this.subscriptions.set(conversationId, []);
    }

    const unsubscribers = [
      messageCreatedUnsubscribe,
      messageEditedUnsubscribe,
      messageDeletedUnsubscribe,
      messageHardDeletedUnsubscribe,
      messageReactionChangedUnsubscribe,
      messageStatusChangedUnsubscribe,
      conversationCreatedUnsubscribe,
      conversationUpdatedUnsubscribe,
      conversationLastMessageUpdatedUnsubscribe,
      conversationMessageAddedUnsubscribe,
      conversationPresenceChangedUnsubscribe,
      conversationReadStatusChangedUnsubscribe,
      conversationParticipantJoinedUnsubscribe,
      conversationParticipantLeftUnsubscribe,
      typingStartUnsubscribe,
      typingStopUnsubscribe
    ];

    this.subscriptions.get(conversationId)!.push(...unsubscribers);

    // Return a function that unsubscribes from all events
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  /**
   * Unsubscribe from conversation events
   */
  unsubscribeFromConversation(conversationId: string): void {
    const conversationSubs = this.subscriptions.get(conversationId);
    if (conversationSubs) {
      conversationSubs.forEach(unsubscribe => unsubscribe());
      this.subscriptions.delete(conversationId);
    }
  }

  /**
   * Get cached conversations (offline support)
   */
  async getCachedConversations(options: Partial<ConversationOptions> = {}): Promise<Conversation[]> {
    const storage = this.client.getStorage();
    if (!storage) {
      return [];
    }

    try {
      const conversations = await storage.getMany<Conversation>('conversations', {
        limit: options.limit || 50,
        indexName: options.sortBy === 'cursor' ? 'cursor' : 'lastMessageAt'
      });

      // Apply filters if specified
      return this.applyConversationFilters(conversations, options.filters);
    } catch (error) {
      console.warn('[MessengerClient] Failed to get cached conversations:', error);
      return [];
    }
  }

  /**
   * Get cached messages (offline support)
   */
  async getCachedMessages(conversationId: string, options: Partial<MessageOptions> = {}): Promise<Message[]> {
    const storage = this.client.getStorage();
    if (!storage) {
      return [];
    }

    try {
      const messages = await storage.getMany<Message>('messages', {
        limit: options.limit || 100,
        indexName: 'conversationId'
      });

      // Filter by conversation ID
      const conversationMessages = messages.filter(m => m.conversationId === conversationId);

      // Apply additional filters
      return this.applyMessageFilters(conversationMessages, options.filters);
    } catch (error) {
      console.warn('[MessengerClient] Failed to get cached messages:', error);
      return [];
    }
  }

  // Private helper methods
  private applyConversationFilters(conversations: Conversation[], filters?: any): Conversation[] {
    if (!filters) return conversations;
    // Implement filtering logic similar to notifications
    return conversations;
  }

  private applyMessageFilters(messages: Message[], filters?: any): Message[] {
    if (!filters) return messages;
    // Implement filtering logic similar to notifications
    return messages;
  }
}

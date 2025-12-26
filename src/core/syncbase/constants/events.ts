// ========================================
// 🎯 SYNCBASE EVENT CONSTANTS
// ========================================

/**
 * WebSocket API Events - Client-facing commands that clients send to the gateway
 * These represent user intentions/actions
 */
export const WEBSOCKET_EVENTS = {
  // ========================================
  // � AUTHENTICATION EVENTS
  // ========================================
  
  UPDATE_TOKEN: 'auth:update_token',      // Client sending new token to server
  
  // ========================================
  // �💬 MESSENGER EVENTS
  // ========================================
  
  // Message Actions
  MESSENGER_SEND_MESSAGE: 'messenger:send_message',
  MESSENGER_EDIT_MESSAGE: 'messenger:edit_message',
  MESSENGER_DELETE_MESSAGE: 'messenger:delete_message',
  MESSENGER_REPLY_MESSAGE: 'messenger:reply_message',
  MESSENGER_REACT_MESSAGE: 'messenger:react_message',
  MESSENGER_ADD_REACTION: 'messenger:add_reaction',
  MESSENGER_REMOVE_REACTION: 'messenger:remove_reaction',
  MESSENGER_MARK_READ: 'messenger:mark_read',
  MESSENGER_GET_MESSAGES: 'messenger:get_messages',
  
  // Conversation Actions
  MESSENGER_CREATE_CONVERSATION: 'messenger:create_conversation',
  MESSENGER_GET_CONVERSATIONS: 'messenger:get_conversations',
  MESSENGER_GET_CONVERSATION: 'messenger:get_conversation',
  MESSENGER_JOIN_CONVERSATION: 'messenger:join_conversation',
  MESSENGER_LEAVE_CONVERSATION: 'messenger:leave_conversation',
  MESSENGER_ADD_PARTICIPANTS: 'messenger:add_participants',
  MESSENGER_REMOVE_PARTICIPANTS: 'messenger:remove_participants',

  // Read Status & Presence Actions
  MESSENGER_MARK_AS_READ: 'messenger:mark_as_read',
  MESSENGER_GET_PRESENCE: 'messenger:get_presence',
  MESSENGER_GET_READ_STATUS: 'messenger:get_read_status',

  // Real-time Actions
  MESSENGER_TYPING_START: 'messenger:typing_start',
  MESSENGER_TYPING_STOP: 'messenger:typing_stop',

  // ========================================
  // 🔔 NOTIFICATION EVENTS
  // ========================================

  NOTIFICATIONS_WILDCARD: 'notifications:*',
  NOTIFICATIONS_SUBSCRIBE: 'notifications:subscribe',
  NOTIFICATIONS_GET: 'notifications:get',
  NOTIFICATIONS_GET_UNREAD: 'notifications:get_unread',
  NOTIFICATIONS_GET_UNREAD_COUNT: 'notifications:get_unread_count',
  NOTIFICATIONS_MARK_READ: 'notifications:mark_read',
  NOTIFICATIONS_MARK_ALL_READ: 'notifications:mark_all_read',
  NOTIFICATIONS_CREATE: 'notifications:create',

  // Template operations (admin only)
  NOTIFICATIONS_GET_TEMPLATES: 'notifications:get_templates',
  NOTIFICATIONS_CREATE_TEMPLATE: 'notifications:create_template',
  NOTIFICATIONS_UPDATE_TEMPLATE: 'notifications:update_template',

  // ========================================
  // 📊 DATA SYNC EVENTS
  // ========================================
  
  DATA_WILDCARD: 'data:*',
  DATA_SYNC_TABLE: 'data:sync_table',
  DATA_QUERY: 'data:query',
  DATA_SUBSCRIBE_TABLE: 'data:subscribe_table',
  DATA_SUBSCRIBE_ENTITY: 'data:subscribe_entity',

  // ========================================
  // � BROADCAST TYPES (for WebSocket responses)
  // ========================================

  // Notification broadcast types
  BROADCAST_NOTIFICATION_CREATED: 'notification:created',
  BROADCAST_NOTIFICATION_UPDATED: 'notification:updated',
  BROADCAST_NOTIFICATION_READ: 'notification:read',
  BROADCAST_NOTIFICATION_DELETED: 'notification:deleted',
  BROADCAST_NOTIFICATION_BULK_READ: 'notification:bulk_read',
  BROADCAST_NOTIFICATION_HIGH_PRIORITY_CREATED: 'notification:high_priority_created',
  BROADCAST_NOTIFICATION_UNREAD_COUNT_UPDATED: 'notification:unread_count_updated',

  // Template broadcast types
  BROADCAST_TEMPLATE_CREATED: 'notification_template:created',
  BROADCAST_TEMPLATE_UPDATED: 'notification_template:updated',
  BROADCAST_TEMPLATE_DELETED: 'notification_template:deleted',
  BROADCAST_TEMPLATE_LIST_UPDATED: 'notification_template:list_updated',
  BROADCAST_TEMPLATE_VALIDATION_RESULT: 'notification_template:validation_result',
  BROADCAST_TEMPLATE_STATS_UPDATED: 'notification_template:stats_updated',

  // Messenger broadcast types
  BROADCAST_MESSAGE_CREATED: 'message:created',
  BROADCAST_MESSAGE_EDITED: 'message:edited',
  BROADCAST_MESSAGE_DELETED: 'message:deleted',
  BROADCAST_MESSAGE_REACTION_CHANGED: 'message:reaction_changed',
  BROADCAST_MESSAGE_STATUS_CHANGED: 'message:status_changed',
  BROADCAST_MESSAGE_HARD_DELETED: 'message:hard_deleted',

  // Conversation broadcast types
  BROADCAST_CONVERSATION_CREATED: 'conversation:created',
  BROADCAST_CONVERSATION_UPDATED: 'conversation:updated',
  BROADCAST_CONVERSATION_DELETED: 'conversation:deleted',        // ✅ ADDED: Missing WebSocket event
  BROADCAST_CONVERSATION_ARCHIVED: 'conversation:archived',      // ✅ ADDED: Missing WebSocket event
  // unified updates come via BROADCAST_MESSAGE_CREATED

  // Conversation presence & read status broadcasts
  BROADCAST_CONVERSATION_PRESENCE_CHANGED: 'conversation:presence_changed',
  BROADCAST_CONVERSATION_READ_STATUS_CHANGED: 'conversation:read_status_changed',
  BROADCAST_CONVERSATION_PARTICIPANT_JOINED: 'conversation:participant_joined',
  BROADCAST_CONVERSATION_PARTICIPANT_LEFT: 'conversation:participant_left',

  // ========================================
  // �🔧 CORE SUBSCRIPTION EVENTS
  // ========================================

  SUBSCRIPTION_SUBSCRIBE: 'subscription:subscribe',
  SUBSCRIPTION_UNSUBSCRIBE: 'subscription:unsubscribe',
  SUBSCRIPTION_LIST: 'subscription:list',

  // ========================================
  // 📡 SYSTEM BROADCAST TYPES
  // ========================================

  BROADCAST_SYNCBASE_CONNECTED: 'syncbase:connected',

  // ========================================
  // 📊 SYSTEM EVENTS
  // ========================================
  
  SYNCBASE_HEALTH: 'syncbase:health',
  SYNCBASE_METRICS: 'syncbase:metrics',
  SYNCBASE_DEBUG: 'syncbase:debug',
} as const;

/**
 * Domain Events - Internal event system for reactive changes
 * These represent state changes that already happened
 */
export const DOMAIN_EVENTS = {
  // ========================================
  // 💬 MESSAGE DOMAIN EVENTS
  // ========================================
  
  MESSAGE_CREATED: 'messenger:message:created',
  MESSAGE_EDITED: 'messenger:message:edited',
  MESSAGE_DELETED: 'messenger:message:deleted',
  MESSAGE_HARD_DELETED: 'messenger:message:hard_deleted',
  MESSAGE_REACTION_CHANGED: 'messenger:message:reaction_changed',
  MESSAGE_STATUS_CHANGED: 'messenger:message:status_changed',

  // ========================================
  // 🗣️ CONVERSATION DOMAIN EVENTS
  // ========================================
  
  CONVERSATION_CREATED: 'messenger:conversation:created',
  CONVERSATION_UPDATED: 'messenger:conversation:updated',
  // ❌ REMOVED: CONVERSATION_LAST_MESSAGE_UPDATED - Redundant with unified MESSAGE_CREATED
  // ❌ REMOVED: CONVERSATION_MESSAGE_ADDED - Redundant with unified MESSAGE_CREATED
  CONVERSATION_PARTICIPANT_JOINED: 'messenger:conversation:participant_joined',
  CONVERSATION_PARTICIPANT_LEFT: 'messenger:conversation:participant_left',
  CONVERSATION_ARCHIVED: 'messenger:conversation:archived',
  CONVERSATION_DELETED: 'messenger:conversation:deleted',

  // Presence & Read Status Domain Events
  CONVERSATION_PRESENCE_CHANGED: 'messenger:conversation:presence_changed',
  CONVERSATION_READ_STATUS_CHANGED: 'messenger:conversation:read_status_changed',
  // ❌ REMOVED: CONVERSATION_PARTICIPANT_READ_STATUS_UPDATED - Redundant with CONVERSATION_READ_STATUS_CHANGED

  // ========================================
  // 🔔 NOTIFICATION DOMAIN EVENTS
  // ========================================

  NOTIFICATION_CREATED: 'notifications:notification:created',
  NOTIFICATION_UPDATED: 'notifications:notification:updated',
  NOTIFICATION_READ: 'notifications:notification:read',
  NOTIFICATION_DELETED: 'notifications:notification:deleted',
  NOTIFICATIONS_BULK_READ: 'notifications:notifications:bulk_read',

  // Template events
  NOTIFICATION_TEMPLATE_CREATED: 'notifications:template:created',
  NOTIFICATION_TEMPLATE_UPDATED: 'notifications:template:updated',
  NOTIFICATION_TEMPLATE_DELETED: 'notifications:template:deleted',

  // ========================================
  // 📊 DATA DOMAIN EVENTS
  // ========================================
  
  TABLE_UPDATED: 'data:table:updated',
  ENTITY_CREATED: 'data:entity:created',
  ENTITY_UPDATED: 'data:entity:updated',
  ENTITY_DELETED: 'data:entity:deleted',
} as const;

/**
 * Subscription Types - Room names for Socket.IO broadcasting
 * These define what clients can subscribe to
 */
export const SUBSCRIPTION_TYPES = {
  // ========================================
  // 💬 MESSENGER SUBSCRIPTIONS
  // ========================================
  
  MESSENGER_CONVERSATION: 'messenger:conversation',
  MESSENGER_USER_CONVERSATIONS: 'messenger:user_conversations',
  MESSENGER_CONVERSATION_PARTICIPANTS: 'messenger:conversation_participants',
  MESSENGER_MESSAGE_THREAD: 'messenger:message_thread',

  // ========================================
  // 🔔 NOTIFICATION SUBSCRIPTIONS
  // ========================================
  
  NOTIFICATIONS_USER: 'notifications:user',
  NOTIFICATIONS_ROLE: 'notifications:role',
  NOTIFICATIONS_GLOBAL: 'notifications:global',

  // ========================================
  // 📊 DATA SUBSCRIPTIONS
  // ========================================
  
  DATA_TABLE: 'data:table',
  DATA_USER_DATA: 'data:user_data',
  DATA_ENTITY: 'data:entity',
} as const;

/**
 * Type helpers for better TypeScript support
 */
export type WebSocketEventType = typeof WEBSOCKET_EVENTS[keyof typeof WEBSOCKET_EVENTS];
export type DomainEventType = typeof DOMAIN_EVENTS[keyof typeof DOMAIN_EVENTS];
export type SubscriptionType = typeof SUBSCRIPTION_TYPES[keyof typeof SUBSCRIPTION_TYPES];

/**
 * Event categories for easier management
 */
/**
 * Authentication events - Server to client events for token management
 */
export const AUTH_EVENTS = {
  TOKEN_EXPIRING_SOON: 'auth:token_expiring_soon',     // 5-min warning
  TOKEN_REFRESH_REQUIRED: 'auth:token_refresh_required', // 1-min warning
  TOKEN_EXPIRED: 'auth:token_expired',                 // Token expired
  TOKEN_UPDATED: 'auth:token_updated'                  // Server confirmation
} as const;

export const EVENT_CATEGORIES = {
  MESSENGER: {
    WEBSOCKET: [
      WEBSOCKET_EVENTS.MESSENGER_SEND_MESSAGE,
      WEBSOCKET_EVENTS.MESSENGER_EDIT_MESSAGE,
      WEBSOCKET_EVENTS.MESSENGER_DELETE_MESSAGE,
      WEBSOCKET_EVENTS.MESSENGER_REPLY_MESSAGE,
      WEBSOCKET_EVENTS.MESSENGER_REACT_MESSAGE,
      WEBSOCKET_EVENTS.MESSENGER_CREATE_CONVERSATION,
      WEBSOCKET_EVENTS.MESSENGER_GET_CONVERSATIONS,
      WEBSOCKET_EVENTS.MESSENGER_GET_MESSAGES,
      WEBSOCKET_EVENTS.MESSENGER_JOIN_CONVERSATION,
      WEBSOCKET_EVENTS.MESSENGER_LEAVE_CONVERSATION,
      WEBSOCKET_EVENTS.MESSENGER_ADD_PARTICIPANTS,
      WEBSOCKET_EVENTS.MESSENGER_REMOVE_PARTICIPANTS,
      WEBSOCKET_EVENTS.MESSENGER_MARK_AS_READ,
      WEBSOCKET_EVENTS.MESSENGER_GET_PRESENCE,
      WEBSOCKET_EVENTS.MESSENGER_GET_READ_STATUS,
    ],
    DOMAIN: [
      DOMAIN_EVENTS.MESSAGE_CREATED,
      DOMAIN_EVENTS.MESSAGE_EDITED,
      DOMAIN_EVENTS.MESSAGE_DELETED,
      DOMAIN_EVENTS.CONVERSATION_CREATED,
      DOMAIN_EVENTS.CONVERSATION_UPDATED,
      // ❌ REMOVED: DOMAIN_EVENTS.CONVERSATION_MESSAGE_ADDED - Redundant with unified MESSAGE_CREATED
      DOMAIN_EVENTS.CONVERSATION_PRESENCE_CHANGED,
      DOMAIN_EVENTS.CONVERSATION_READ_STATUS_CHANGED,
      // ❌ REMOVED: DOMAIN_EVENTS.CONVERSATION_PARTICIPANT_READ_STATUS_UPDATED - Redundant with CONVERSATION_READ_STATUS_CHANGED
    ]
  },
  NOTIFICATIONS: {
    WEBSOCKET: [
      WEBSOCKET_EVENTS.NOTIFICATIONS_WILDCARD,
      WEBSOCKET_EVENTS.NOTIFICATIONS_SUBSCRIBE,
      WEBSOCKET_EVENTS.NOTIFICATIONS_GET,
      WEBSOCKET_EVENTS.NOTIFICATIONS_GET_UNREAD,
      WEBSOCKET_EVENTS.NOTIFICATIONS_GET_UNREAD_COUNT,
      WEBSOCKET_EVENTS.NOTIFICATIONS_MARK_READ,
      WEBSOCKET_EVENTS.NOTIFICATIONS_MARK_ALL_READ,
      WEBSOCKET_EVENTS.NOTIFICATIONS_CREATE,
      WEBSOCKET_EVENTS.NOTIFICATIONS_GET_TEMPLATES,
      WEBSOCKET_EVENTS.NOTIFICATIONS_CREATE_TEMPLATE,
      WEBSOCKET_EVENTS.NOTIFICATIONS_UPDATE_TEMPLATE,
    ],
    DOMAIN: [
      DOMAIN_EVENTS.NOTIFICATION_CREATED,
      DOMAIN_EVENTS.NOTIFICATION_UPDATED,
      DOMAIN_EVENTS.NOTIFICATION_READ,
      DOMAIN_EVENTS.NOTIFICATION_DELETED,
      DOMAIN_EVENTS.NOTIFICATIONS_BULK_READ,
    ]
  },
  DATA: {
    WEBSOCKET: [
      WEBSOCKET_EVENTS.DATA_WILDCARD,
      WEBSOCKET_EVENTS.DATA_SYNC_TABLE,
      WEBSOCKET_EVENTS.DATA_QUERY,
      WEBSOCKET_EVENTS.DATA_SUBSCRIBE_TABLE,
      WEBSOCKET_EVENTS.DATA_SUBSCRIBE_ENTITY,
    ],
    DOMAIN: [
      DOMAIN_EVENTS.TABLE_UPDATED,
      DOMAIN_EVENTS.ENTITY_CREATED,
      DOMAIN_EVENTS.ENTITY_UPDATED,
    ]
  }
} as const;

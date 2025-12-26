/**
 * Messenger types for SyncBase Client
 */

import { PaginationOptions, PaginatedResponse } from '../../core/types';

// Core interfaces
export interface User {
  id: string;
  username?: string;
  email?: string;
  firstName?: string; // ✅ ADDED: Backend has firstName
  lastName?: string;  // ✅ ADDED: Backend has lastName
  fullName?: string;  // ✅ ADDED: Backend has fullName getter
  displayName?: string; // Keep for compatibility
  avatarUrl?: string;
  profilePictureUrl?: string; // ✅ ADDED: Backend uses profilePictureUrl
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  title?: string; // ✅ ADDED: Backend uses 'title' field
  description?: string;
  participants: User[];
  lastMessage?: Message;
  lastMessageAt?: string;
  unreadCount: number;
  hasUnread?: boolean; // ✅ ADDED: Like HTML test
  isArchived: boolean;
  isMuted: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  cursor: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
  type: MessageType;
  status: MessageStatus;
  replyToId?: string;
  replyTo?: Message;
  reactions: MessageReaction[];
  attachments: MessageAttachment[];
  metadata?: Record<string, any>;
  editedAt?: string;
  deletedAt?: string;
  createdAt: string;
  cursor: string;
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  user?: User;
  emoji: string;
  createdAt: string;
}

export interface MessageAttachment {
  id: string;
  messageId: string;
  type: 'image' | 'file' | 'video' | 'audio';
  name: string;
  url: string;
  size: number;
  mimeType: string;
  metadata?: Record<string, any>;
  uploadedAt: string;
}

// Enums
export type ConversationType = 'direct' | 'group' | 'channel';
export type MessageType = 'text' | 'image' | 'file' | 'system' | 'emoji' | 'reply';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

// Filters and options
export interface ConversationFilters {
  type?: ConversationType | ConversationType[];
  isArchived?: boolean;
  isMuted?: boolean;
  hasUnread?: boolean;
  participantId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface MessageFilters {
  senderId?: string;
  type?: MessageType | MessageType[];
  hasAttachments?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ConversationOptions extends PaginationOptions {
  filters?: ConversationFilters;
  includeParticipants?: boolean;
  includeLastMessage?: boolean;
}

export interface MessageOptions extends PaginationOptions {
  conversationId: string;
  filters?: MessageFilters;
  includeReactions?: boolean;
  includeAttachments?: boolean;
  includeReplies?: boolean;
}

// Creation and updates
export interface CreateConversationData {
  type: ConversationType;
  name?: string;
  description?: string;
  participantIds: string[];
  metadata?: Record<string, any>;
}

export interface SendMessageData {
  content: string;
  type?: MessageType;
  replyToId?: string;
  attachments?: Omit<MessageAttachment, 'id' | 'messageId' | 'uploadedAt'>[];
  metadata?: Record<string, any>;
  idempotencyKey?: string;
  attachmentsDraft?: Array<{
    fileId: string;
    filename: string;
    originalName: string;
    mimeType: string;
    thumbnailUrl?: string;
  }>;
}

export interface EditMessageData {
  content: string;
  metadata?: Record<string, any>;
}

// React hook types
export interface UseConversationsOptions {
  limit?: number;
  filters?: ConversationFilters;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onConversationSelected?: (conversation: Conversation) => void;
  onError?: (error: Error) => void;
}

export interface UseConversationsReturn {
  // Data
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  
  // State
  isLoading: boolean;
  hasMore: boolean;
  error: Error | null;
  
  // Actions
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  selectConversation: (conversation: Conversation) => void;
  clearSelection: () => void;
  createConversation: (data: CreateConversationData) => Promise<Conversation>;
  archiveConversation: (conversationId: string) => Promise<void>;
  unarchiveConversation: (conversationId: string) => Promise<void>;
  muteConversation: (conversationId: string) => Promise<void>;
  unmuteConversation: (conversationId: string) => Promise<void>;
  
  // Filters
  setFilters: (filters: ConversationFilters) => void;
  clearFilters: () => void;

  // Search
  searchConversations: (query: string) => Promise<void>;
  clearSearch: () => Promise<void>;

  // Utils
  getConversationById: (id: string) => Conversation | undefined;
  getUnreadConversations: () => Conversation[];
}

export interface UseMessengerOptions {
  limit?: number;
  filters?: MessageFilters;
  autoRefresh?: boolean;
  refreshInterval?: number;
  markAsRead?: boolean;
  onMessageReceived?: (message: Message) => void;
  onMessageSent?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export interface UseMessengerReturn {
  // Data
  messages: Message[];
  conversation: Conversation | null;
  typingUsers: string[];
  
  // State
  isLoading: boolean;
  hasMore: boolean;
  error: Error | null;
  isSubscribed: boolean;
  
  // Actions
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  sendMessage: (data: SendMessageData) => Promise<Message>;
  replyToMessage: (replyToId: string, data: Omit<SendMessageData, 'replyToId'>) => Promise<Message>;
  editMessage: (messageId: string, data: EditMessageData) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  reactToMessage: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string, emoji: string) => Promise<void>;
  markAsRead: () => Promise<void>;

  // Conversation Management
  joinConversation: () => Promise<void>;
  leaveConversation: () => Promise<void>;
  addParticipants: (participantIds: string[]) => Promise<void>;
  removeParticipants: (participantIds: string[]) => Promise<void>;

  // Presence & Read Status
  getPresence: () => Promise<any>;
  getReadStatus: () => Promise<any>;
  
  // Filters
  setFilters: (filters: MessageFilters) => void;
  clearFilters: () => void;

  // Search
  searchMessages: (query: string) => Promise<void>;
  clearSearch: () => Promise<void>;

  // Utils
  getMessageById: (id: string) => Message | undefined;
  getUnreadMessages: () => Message[];
  getClient: () => any; // MessengerClient instance
}

// Response types
export type ConversationListResponse = PaginatedResponse<Conversation>;
export type MessageListResponse = PaginatedResponse<Message>;

// Real-time events
export interface ConversationEvent {
  type: 'conversation:created' | 'conversation:updated' | 'conversation:deleted';
  conversation: Conversation;
  timestamp: string;
}

export interface MessageEvent {
  type: 'message:new' | 'message:updated' | 'message:deleted';
  message: Message;
  conversationId: string;
  timestamp: string;
}

export interface TypingEvent {
  type: 'typing:start' | 'typing:stop';
  conversationId: string;
  userId: string;
  user?: User;
  timestamp: string;
}

// Utility types
export type MessageSortField = 'createdAt' | 'cursor';
export type ConversationSortField = 'lastMessageAt' | 'createdAt' | 'cursor';
export type SortOrder = 'ASC' | 'DESC';

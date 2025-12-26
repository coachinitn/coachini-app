"use client"

import React, { ReactNode, useState, useEffect, createContext, useContext } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatPanel } from "@/design-system/ui/components/chat/chat-panel"
import { useMessenger } from "@/core/syncbase/modules/messenger/useMessenger"
import { useConversations } from "@/core/syncbase/modules/messenger/useConversations"
import {
  Conversation,
  Message,
  CreateConversationData,
  SendMessageData,
  EditMessageData
} from "@/core/syncbase/modules/messenger/types"
import { useNotificationSounds } from "@/core/hooks/useNotificationSounds"

// Enhanced chat context that includes SyncBase data
type ChatContextType = {
  // UI State
  isOpen: boolean
  hasNewMessages: boolean
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void

  // SyncBase Data
  conversations: Conversation[]
  messages: Message[]
  currentConversationId: string | null
  isConnected: boolean
  isLoading: boolean
  error: Error | null
  typingUsers: string[]

  // Actions (from SyncBase hooks)
  sendMessage: (data: SendMessageData) => Promise<Message>
  editMessage: (messageId: string, data: EditMessageData) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  createConversation: (data: CreateConversationData) => Promise<Conversation>
  selectConversation: (conversationId: string) => void
  loadMoreMessages: () => Promise<void>
  loadMoreConversations: () => Promise<void>
  hasMoreMessages: boolean
  hasMoreConversations: boolean

  // Message reactions and replies
  addReaction: (messageId: string, emoji: string) => Promise<void>
  removeReaction: (messageId: string, emoji: string) => Promise<void>
  replyToMessage: (messageId: string, content: string) => Promise<Message>

  // Conversation management
  addParticipants: (conversationId: string, userIds: string[]) => Promise<void>
  removeParticipants: (conversationId: string, userIds: string[]) => Promise<void>
  joinConversation: (conversationId: string) => Promise<void>
  leaveConversation: (conversationId: string) => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>

  // Search functionality (like HTML test)
  searchConversations: (query: string) => Promise<void>
  clearConversationSearch: () => Promise<void>
  searchMessages: (query: string) => Promise<void>
  clearMessageSearch: () => Promise<void>

  // Filter functionality
  setConversationFilters: (filters: any) => void
  clearConversationFilters: () => void
  setMessageFilters: (filters: any) => void
  clearMessageFilters: () => void

  // Client access and conversation management
  getClient: () => any
  clearConversationSelection: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within a ChatLayoutProvider")
  }
  return context
}

interface ChatLayoutProps {
  children: ReactNode
}

export function ChatLayout({ children }: ChatLayoutProps) {
  // ✅ ADDED: Use NextAuth session for user authentication
  const { data: session } = useSession()
  
  // ✅ ADDED: Notification sounds for new messages
  const { playMessageReceived } = useNotificationSounds()

  // Local UI state
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewMessages, setHasNewMessages] = useState(false)
  const [autoUnsubscribe, setAutoUnsubscribe] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    const stored = localStorage.getItem('chatAutoUnsubscribe')
    return stored === null ? true : stored === 'true'
  })

  // Get SyncBase conversations data (like notifications layout)
  const conversationsHook = useConversations({
    limit: 15, // Load 15 conversations initially like HTML test
    autoRefresh: true,
    onError: (error) => {
      console.error('Conversations error:', error);
    }
  });

  // Debug: Log conversations data
  useEffect(() => {
    console.log('🔍 ChatLayout Debug - Conversations:', {
      count: conversationsHook.conversations.length,
      conversations: conversationsHook.conversations,
      selectedConversation: conversationsHook.selectedConversation,
      isLoading: conversationsHook.isLoading,
      error: conversationsHook.error
    });
  }, [conversationsHook.conversations, conversationsHook.selectedConversation, conversationsHook.isLoading, conversationsHook.error]);

  // Get SyncBase messenger data for selected conversation
  const messengerHook = useMessenger(
    conversationsHook.selectedConversation?.id || null,
    {
      limit: 15, // Load 15 messages initially like HTML test
      autoRefresh: true,
      onMessageReceived: (message) => {
        console.log('New message received:', message.content);
        if (!isOpen) {
          setHasNewMessages(true);
        }
        
        // ✅ ADDED: Play boop sound for new messages
        try {
          playMessageReceived();
        } catch (error) {
          console.warn('Failed to play message sound:', error);
        }
      },
      onError: (error) => {
        console.error('Messenger error:', error);
      }
    }
  );

  // Debug: Log messages data
  useEffect(() => {
    console.log('🔍 ChatLayout Debug - Messages:', {
      conversationId: conversationsHook.selectedConversation?.id,
      messageCount: messengerHook.messages.length,
      messages: messengerHook.messages,
      isLoading: messengerHook.isLoading,
      error: messengerHook.error
    });
  }, [conversationsHook.selectedConversation?.id, messengerHook.messages, messengerHook.isLoading, messengerHook.error]);

  // UI actions
  const openChat = () => setIsOpen(true)
  const closeChat = () => setIsOpen(false)
  const toggleChat = () => setIsOpen(prev => !prev)

  // Check if there are new messages (using status instead of isRead)
  const checkForNewMessages = () => {
    return messengerHook.getUnreadMessages().length > 0;
  };
  // Prevent body scrolling when chat is open
  useEffect(() => {
    if (isOpen) {
      // Save the current overflow value
      const originalOverflow = document.body.style.overflow
      // Lock scrolling
      document.body.style.overflow = 'hidden'

      // Cleanup function to restore original overflow when component unmounts or isOpen changes
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Mark messages as seen when chat is opened
  useEffect(() => {
    if (isOpen && hasNewMessages) {
      setHasNewMessages(false)
      // Mark current conversation as read if there is one
      if (conversationsHook.selectedConversation) {
        messengerHook.markAsRead();
      }
    }
  }, [isOpen, hasNewMessages, conversationsHook.selectedConversation])

  // Check for new messages when messages change
  useEffect(() => {
    if (!isOpen) {
      const hasNew = checkForNewMessages();
      setHasNewMessages(hasNew);
    }
  }, [messengerHook.messages, isOpen])

  // Enhanced send message function using SyncBase
  const sendMessage = async (data: SendMessageData) => {
    try {
      return await messengerHook.sendMessage(data);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  // Select conversation function (like HTML test)
  const selectConversation = async (conversationId: string) => {
    console.log('🎯 Selecting conversation:', conversationId);
    const conversation = conversationsHook.getConversationById(conversationId);
    if (conversation) {
      // Auto-leave previous conversation if any
      if (conversationsHook.selectedConversation?.id && conversationsHook.selectedConversation.id !== conversationId) {
        try {
          // Use MessengerClient directly for specific conversation ID
          const messengerClient = messengerHook.getClient?.();
          if (messengerClient) {
            if (autoUnsubscribe) {
              await messengerClient.leaveConversation(conversationsHook.selectedConversation.id);
              console.log('🟠 Left previous conversation:', conversationsHook.selectedConversation.id);
            } else {
              console.log('📝 Auto-unsubscribe OFF: keeping presence in previous conversation');
            }
          }
        } catch (error) {
          console.warn('⚠️ Failed to leave previous conversation:', error);
        }
      }

      // Select the conversation (this will trigger useMessenger to load messages)
      conversationsHook.selectConversation(conversation);

      // Auto-join conversation when selecting it (like HTML test)
      try {
        // Use MessengerClient directly for specific conversation ID
        const messengerClient = messengerHook.getClient?.();
        if (messengerClient) {
          await messengerClient.joinConversation(conversationId);
          console.log('✅ Auto-joined conversation:', conversationId);
        }
      } catch (error) {
        console.warn('⚠️ Auto-join failed:', error);
      }

      console.log('✅ Conversation selected, messages will load automatically');
    } else {
      console.error('❌ Conversation not found:', conversationId);
    }
  };

  // Adapter functions to convert SyncBase types to ChatPanel types
  const adaptConversations = (conversations: Conversation[]) => {
    const currentUserId = session?.user?.id;

    return conversations.map(conv => {
      // ✅ FIXED: Use proper conversation naming logic like backend getDisplayName()
      let displayName = '';

      if (conv.name || conv.title) {
        // Use explicit title/name if available
        displayName = conv.name || conv.title || '';
      } else if (conv.type === 'direct' && conv.participants?.length === 2) {
        // For direct conversations, show the other participant's name
        const otherParticipant = conv.participants.find(p => p.id !== currentUserId);
        displayName = otherParticipant?.displayName || otherParticipant?.username || otherParticipant?.email || 'Unknown User';
      } else if (conv.type === 'group') {
        displayName = `Group (${conv.participants?.length || 0} members)`;
      } else {
        displayName = `${conv.type} conversation`;
      }

      // ✅ FIXED: Use proper unread logic like HTML test
      const hasUnread = conv.hasUnread || conv.unreadCount > 0;
      const unreadCount = conv.unreadCount || 0;

      return {
        id: conv.id,
        name: displayName,
        avatar: conv.participants[0]?.avatarUrl || conv.participants[0]?.profilePictureUrl || '/placeholder.svg',
        lastMessage: typeof conv.lastMessage === 'string' ? conv.lastMessage : (conv.lastMessage?.content || ''), // ✅ FIXED: Handle both string and object lastMessage
        timestamp: conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString() : '',
        unread: hasUnread ? (unreadCount > 0 ? unreadCount : true) : false, // ✅ FIXED: Show count if > 0, otherwise true/false like HTML test
        isGroup: conv.type === 'group'
      };
    });
  };

  const adaptMessages = (messages: Message[]) => {
    // ✅ FIXED: Get current user ID from NextAuth session (like notifications module)
    const currentUserId = session?.user?.id;

    return messages.map(msg => {
      // ✅ FIXED: Message is from "bot" (left side) if it's NOT from current user
      // This matches HTML test logic: isOwnMessage = message.senderId === currentUserId
      const isFromCurrentUser = msg.senderId === currentUserId;

      console.log('🔍 Message adaptation:', {
        messageId: msg.id,
        senderId: msg.senderId,
        currentUserId,
        isFromCurrentUser,
        willBeBot: !isFromCurrentUser
      });

      // ✅ FIXED: Use proper user name fields from backend
      let senderName = 'Unknown';
      if (msg.sender) {
        senderName = msg.sender.fullName ||
                    `${msg.sender.firstName || ''} ${msg.sender.lastName || ''}`.trim() ||
                    msg.sender.displayName ||
                    msg.sender.username ||
                    msg.sender.email ||
                    'Unknown';
      }

      return {
        id: msg.id,
        sender: {
          id: msg.senderId,
          name: senderName,
          avatar: msg.sender?.avatarUrl || msg.sender?.profilePictureUrl || '/placeholder.svg',
          isBot: !isFromCurrentUser // ✅ CORRECT: Left side for others, right side for current user
        },
        content: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString()
      };
    });
  };

  return (
    <ChatContext.Provider
      value={{
        // UI State
        isOpen,
        hasNewMessages,
        openChat,
        closeChat,
        toggleChat,

        // SyncBase Data
        conversations: conversationsHook.conversations,
        messages: messengerHook.messages,
        currentConversationId: conversationsHook.selectedConversation?.id || null,
        isConnected: true, // TODO: Get from SyncBase connection status
        isLoading: conversationsHook.isLoading || messengerHook.isLoading,
        error: conversationsHook.error || messengerHook.error,
        typingUsers: messengerHook.typingUsers,

        // Actions (from SyncBase hooks)
        sendMessage: messengerHook.sendMessage,
        editMessage: async (messageId: string, data: EditMessageData) => {
          return messengerHook.editMessage(messageId, data);
        },
        deleteMessage: messengerHook.deleteMessage,
        createConversation: conversationsHook.createConversation,
        selectConversation,
        loadMoreMessages: messengerHook.loadMore,
        loadMoreConversations: conversationsHook.loadMore,
        hasMoreMessages: messengerHook.hasMore,
        hasMoreConversations: conversationsHook.hasMore,

        // Message reactions and replies
        addReaction: messengerHook.reactToMessage,
        removeReaction: messengerHook.removeReaction,
        replyToMessage: async (messageId: string, content: string) => {
          return messengerHook.replyToMessage(messageId, { content });
        },

        // Conversation management
        addParticipants: async (_conversationId: string, userIds: string[]) => {
          return messengerHook.addParticipants(userIds);
        },
        removeParticipants: async (_conversationId: string, userIds: string[]) => {
          return messengerHook.removeParticipants(userIds);
        },
        joinConversation: messengerHook.joinConversation,
        leaveConversation: messengerHook.leaveConversation,
        markAsRead: messengerHook.markAsRead,

        // Search functionality (like HTML test)
        searchConversations: conversationsHook.searchConversations,
        clearConversationSearch: conversationsHook.clearSearch,
        searchMessages: messengerHook.searchMessages,
        clearMessageSearch: messengerHook.clearSearch,

        // Filter functionality
        setConversationFilters: conversationsHook.setFilters,
        clearConversationFilters: conversationsHook.clearFilters,
        setMessageFilters: messengerHook.setFilters,
        clearMessageFilters: messengerHook.clearFilters,

        // Client access and conversation management
        getClient: messengerHook.getClient,
        clearConversationSelection: conversationsHook.clearSelection,
      }}
    >
      {children}
      
      {/* Background overlay with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeChat}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-y-0 right-0 z-50 w-[400px] max-w-full shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
          >
            <ChatPanel
              conversations={adaptConversations(conversationsHook.conversations)}
              messages={adaptMessages(messengerHook.messages)}
              onClose={closeChat}
              onSelectConversation={selectConversation}
              onSearchConversations={conversationsHook.searchConversations}
              onClearConversationSearch={conversationsHook.clearSearch}
              onSearchMessages={messengerHook.searchMessages}
              onClearMessageSearch={messengerHook.clearSearch}
              onSetConversationFilters={conversationsHook.setFilters}
              onSendMessage={(message: string) => {
                if (conversationsHook.selectedConversation) {
                  sendMessage({
                    content: message
                  });
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ChatContext.Provider>
  )
} 
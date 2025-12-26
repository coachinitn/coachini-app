"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, X, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/core/utils/cn"
import { SearchIcon } from "@/design-system/icons/layout/navbar"
import { ConversationsIcon, AddIcon, EmojiIcon, ArrowBackIcon, GroupChatIcon } from "@/design-system/icons/layout/chatbox"
import { CloseIcon } from "@/design-system/icons/common"
import { TitleMedium } from "@/design-system/ui/base"
import { useChatContext } from "@/design-system/ui/layout/chat-layout"
import { uploadFile, apiClient } from "@/lib/api-client"

export interface ChatMessage {
  id: string
  sender: {
    id: string
    name: string
    avatar: string
    isBot?: boolean
  }
  content: string
  attachments?: { id: string; url: string; mimeType?: string; name?: string; thumbnailUrl?: string }[]
  timestamp: string
}

export interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread?: boolean | number // ✅ FIXED: Allow number for unread count like HTML test
  isGroup?: boolean
}

interface ChatPanelProps {
  conversations?: Conversation[]
  messages?: ChatMessage[]
  onSendMessage?: (message: string) => void
  onSelectConversation?: (conversationId: string) => void
  onSearchConversations?: (query: string) => void
  onClearConversationSearch?: () => void
  onSearchMessages?: (query: string) => void
  onClearMessageSearch?: () => void
  onSetConversationFilters?: (filters: any) => void
  onClose?: () => void
  className?: string
}

export function ChatPanel({
  conversations = [],
  messages = [],
  onSendMessage,
  onSelectConversation,
  onSearchConversations,
  onClearConversationSearch,
  onSearchMessages,
  onClearMessageSearch,
  onSetConversationFilters,
  onClose,
  className
}: ChatPanelProps) {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<any>(null)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingAttachment, setPendingAttachment] = useState<{
    fileId: string
    filename: string
    originalName: string
    mimeType: string
    thumbnailUrl?: string
  } | null>(null)
  const [replyTo, setReplyTo] = useState<{ id: string; author: string; content: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Filter states (like HTML test)
  const [showFilters, setShowFilters] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Search states (like notifications sidebar)
  const [showSearch, setShowSearch] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [conversationTypeFilter, setConversationTypeFilter] = useState('')
  const [conversationStatusFilter, setConversationStatusFilter] = useState('')
  const [conversationUnreadFilter, setConversationUnreadFilter] = useState('')
  const [autoUnsubscribeUI, setAutoUnsubscribeUI] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    const stored = localStorage.getItem('chatAutoUnsubscribe')
    return stored === null ? true : stored === 'true'
  })

  // Get chat context for real SyncBase functionality
  const chatContext = useChatContext()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Dedicated effect for conversation changes with a slight delay to ensure UI is rendered
  useEffect(() => {
    if (activeConversation) {
      // Delayed scroll to allow animations to complete
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [activeConversation])

  const handleSend = () => {
    if (!message.trim() && !pendingAttachment) return

    const send = async () => {
      const data: any = { content: message }
      if (pendingAttachment) {
        data.attachmentsDraft = [
          {
            fileId: pendingAttachment.fileId,
            filename: pendingAttachment.filename,
            originalName: pendingAttachment.originalName,
            mimeType: pendingAttachment.mimeType,
            thumbnailUrl: pendingAttachment.thumbnailUrl,
          },
        ]
      }
      if (replyTo) {
        data.replyToId = replyTo.id
      }

      if (chatContext?.sendMessage) {
        await chatContext.sendMessage(data)
      } else if (onSendMessage) {
        onSendMessage(message)
      }
      setMessage("")
      setPendingAttachment(null)
      setReplyTo(null)
      setTimeout(scrollToBottom, 100)
    }

    send()

    // stop typing when message is sent
    try {
      const client = chatContext.getClient?.()?.getClient?.() || chatContext.getClient?.()
      if (client && chatContext.currentConversationId) {
        client.sendEvent?.('messenger:typing_stop', { conversationId: chatContext.currentConversationId })
      }
    } catch {}
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Emit typing start/stop using SyncBase client under the hood
  const handleTypingInput = (value: string) => {
    setMessage(value)
    try {
      const client = chatContext.getClient?.()?.getClient?.() || chatContext.getClient?.()
      if (!client) return
      if (!isTyping) {
        setIsTyping(true)
        client.sendEvent?.('messenger:typing_start', { conversationId: chatContext.currentConversationId })
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        client.sendEvent?.('messenger:typing_stop', { conversationId: chatContext.currentConversationId })
      }, 2000)
    } catch {}
  }

  const handleAddAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !chatContext.currentConversationId) return
    try {
      const res = await uploadFile(
        '/api/upload/single',
        file,
        {},
        {
          isPublic: 'false',
          referenceType: 'messenger_attachment_draft',
          referenceId: chatContext.currentConversationId,
          category: 'message',
        }
      )
      const json = await res.json()
      const fileResp = json?.data || json
      setPendingAttachment({
        fileId: fileResp.id,
        filename: fileResp.filename || file.name,
        originalName: fileResp.originalName || file.name,
        mimeType: fileResp.mimeType || file.type,
        thumbnailUrl: fileResp.thumbnails?.medium?.url,
      })
    } catch (err) {
      console.error('Attachment upload failed', err)
    } finally {
      e.target.value = ''
    }
  }

  const handleRemoveAttachment = async () => {
    if (!pendingAttachment) return
    try {
      await apiClient(`/api/upload/${pendingAttachment.fileId}`, { method: 'DELETE' })
    } catch {}
    setPendingAttachment(null)
  }

  const handleBackToList = async () => {
    // Leave current conversation when going back (like HTML test)
    if (chatContext.currentConversationId) {
      try {
        const messengerClient = chatContext.getClient?.();
        if (messengerClient) {
          await messengerClient.leaveConversation(chatContext.currentConversationId);
          console.log('🟠 Left conversation when going back:', chatContext.currentConversationId);
        }
      } catch (error) {
        console.warn('⚠️ Failed to leave conversation when going back:', error);
      }
    }

    // Clear local selection
    setActiveConversation(null);

    // Clear SyncBase selection (this will trigger useMessenger to unload messages)
    // We need to add a method to clear selection
    if (chatContext.clearConversationSelection) {
      chatContext.clearConversationSelection();
    }
  }

  // Use real SyncBase data directly (filtering is done server-side)
  // Show sample data only if no real conversations are provided
  const displayConversations = conversations.length > 0 ? conversations : []

  // Use real SyncBase data directly (filtering is done server-side)
  // Only show sample messages if we have no real conversations at all
  // If we have real conversations but no messages for selected conversation, show empty state
  const displayMessages = (conversations.length > 0 && messages.length === 0) ? [] :
                          (messages.length > 0 ? messages : []);

  return (
		<div
			className={cn(
				'flex flex-col h-full bg-foreground-white rounded-xl overflow-hidden',
				className,
			)}
		>
			<AnimatePresence mode="wait">
				{!activeConversation ? (
					// Conversations List View
					<motion.div
						key="conversation-list"
						className="flex flex-col h-full"
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -10 }}
						transition={{ duration: 0.15 }}
					>
						<div className="flex items-center justify-between px-[23px] pt-[23px] pb-[10px] border-gray-100">
							<div className="flex items-center">
								<ConversationsIcon className="mr-3 text-primary-400 w-[32px] h-[32px]" />
								<AnimatePresence>
									{!showSearch && (
										<motion.div
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, ease: "easeInOut" }}
										>
											<TitleMedium className="font-semibold text-text-700 dark:text-gray-100">
												Conversations
											</TitleMedium>
										</motion.div>
									)}
								</AnimatePresence>
								{/* Typing indicator */}
								{(chatContext.typingUsers && chatContext.typingUsers.length > 0) && !showSearch && (
									<div className="px-4 py-1 text-xs italic text-gray-500">Someone is typing…</div>
								)}
							</div>
							<div className={`flex items-center ${!showSearch ? 'gap-3' : 'grow'}`}>
								<AnimatePresence>
									{showSearch ? (
										<motion.div
											className="relative flex items-center"
											initial={{ width: 0, opacity: 0 }}
											animate={{ width: "100%", opacity: 1 }}
											exit={{ width: 0, opacity: 0 }}
											transition={{
												duration: 0.2,
												ease: "easeInOut"
											}}
											style={{ flex: 1 }}
										>
											<motion.input
												type="text"
												placeholder="Search conversations"
												value={searchValue}
												onChange={(e) => {
													setSearchValue(e.target.value)
													onSearchConversations?.(e.target.value)
												}}
												autoFocus
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ duration: 0.15 }}
												className="w-full pl-4 text-sm border border-gray-200 rounded-full h-7 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
											/>
											<button
												className="absolute inset-y-0 right-0 flex items-center pr-3"
												onClick={() => {
													setSearchValue('')
													setShowSearch(false)
													onClearConversationSearch?.()
												}}
											>
												<X className="w-4 h-4 text-gray-400" />
											</button>
										</motion.div>
									) : (
										<motion.button
											className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
											onClick={() => setShowSearch(true)}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<SearchIcon className="w-[24px] h-[24px] text-text-300" />
										</motion.button>
									)}
								</AnimatePresence>

								{/* Filter toggle button */}
								{/* {!showSearch && (
									<motion.button
										className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${showFilters ? 'bg-blue-100 text-blue-600' : ''}`}
										onClick={() => setShowFilters(!showFilters)}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										title="Toggle filters"
									>
										<Filter className="w-[20px] h-[20px]" />
									</motion.button>
								)} */}

								{onClose && (
									<button
										className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
										onClick={onClose}
									>
										<CloseIcon className="w-[24px] h-[24px] text-text-300" />
									</button>
								)}
							</div>
						</div>

						{/* Filter Controls (like HTML test) */}
						{showFilters && (
							<div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<input
											type="text"
											placeholder="Search conversations..."
											value={searchQuery}
											onChange={(e) => {
												const query = e.target.value;
												setSearchQuery(query);
												// Real-time search like HTML test
												if (query.length >= 2 || query.length === 0) {
													onSearchConversations?.(query);
												}
											}}
											className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
										/>
										<button
											onClick={() => {
												setSearchQuery('');
												onClearConversationSearch?.();
											}}
											className="px-3 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
										>
											Clear
										</button>
									</div>
									<div className="flex gap-2">
										<select
											value={conversationTypeFilter}
											onChange={(e) => {
												const value = e.target.value;
												setConversationTypeFilter(value);
												onSetConversationFilters?.({ type: value || undefined });
											}}
											className="px-3 py-2 border border-gray-300 rounded-md text-sm"
										>
											<option value="">All Types</option>
											<option value="direct">Direct</option>
											<option value="group">Group</option>
										</select>
										<select
											value={conversationStatusFilter}
											onChange={(e) => {
												const value = e.target.value;
												setConversationStatusFilter(value);
												onSetConversationFilters?.({ isActive: value ? value === 'true' : undefined });
											}}
											className="px-3 py-2 border border-gray-300 rounded-md text-sm"
										>
											<option value="">All Status</option>
											<option value="true">Active</option>
											<option value="false">Archived</option>
										</select>
										<select
											value={conversationUnreadFilter}
											onChange={(e) => {
												const value = e.target.value;
												setConversationUnreadFilter(value);
												let filters = {};
												if (value === 'unread') {
													filters = { hasUnreadMessages: true };
												} else if (value === 'read') {
													filters = { hasUnreadMessages: false };
												}
												onSetConversationFilters?.(filters);
											}}
											className="px-3 py-2 border border-gray-300 rounded-md text-sm"
										>
											<option value="">All Messages</option>
											<option value="unread">Unread</option>
											<option value="read">Read</option>
										</select>
									</div>
								</div>
							</div>
						)}

						{/* Settings & Test Controls (like HTML test) */}
						{/* {showSettings && (
							<div className="px-6 py-4 bg-green-50 border-b border-green-200">
								<div className="space-y-4">
									<div>
										<h4 className="font-semibold text-green-800 mb-2">⚡ Quick Actions</h4>
										<div className="flex flex-wrap gap-2">
											<button
												onClick={async () => {
													if (chatContext.currentConversationId) {
														const testMessage = `Test message at ${new Date().toLocaleTimeString()}`;
														await chatContext.sendMessage({ content: testMessage });
													} else {
														alert('Please select a conversation first');
													}
												}}
												className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
											>
												📨 Test Send
											</button>
											<button
												onClick={async () => {
													// Find the most recent message to edit
													const lastMessage = chatContext.messages[chatContext.messages.length - 1];
													if (lastMessage) {
														const newContent = `Edited: ${lastMessage.content} (edited at ${new Date().toLocaleTimeString()})`;
														await chatContext.editMessage(lastMessage.id, { content: newContent });
													} else {
														alert('No messages to edit. Send a message first.');
													}
												}}
												className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
											>
												✏️ Test Edit
											</button>
											<button
												onClick={async () => {
													const lastMessage = chatContext.messages[chatContext.messages.length - 1];
													if (lastMessage && confirm('Are you sure you want to delete this message?')) {
														await chatContext.deleteMessage(lastMessage.id);
													} else if (!lastMessage) {
														alert('No messages to delete. Send a message first.');
													}
												}}
												className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
											>
												🗑️ Test Delete
											</button>
											<button
												onClick={async () => {
													const title = prompt('Enter conversation title:');
													if (title) {
														await chatContext.createConversation({
															type: 'group',
															name: title,
															participantIds: [] // Add current user automatically
														});
													}
												}}
												className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
											>
												📝 Test Create
											</button>
											<button
												onClick={() => {
													console.log('📋 Current subscriptions:', {
														isConnected: chatContext.isConnected,
														currentConversation: chatContext.currentConversationId,
														messageCount: chatContext.messages.length,
														conversationCount: chatContext.conversations.length
													});
													alert('Check console for subscription details');
												}}
												className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
											>
												📋 Subscribe
											</button>
										</div>
									</div>
									<div>
										<h4 className="font-semibold text-green-800 mb-2">👁️ Presence & Read Status</h4>
										<div className="flex flex-wrap gap-2">
											<button
												onClick={async () => {
													if (chatContext.currentConversationId) {
														await chatContext.joinConversation(chatContext.currentConversationId);
														alert('✅ Joined conversation successfully');
													} else {
														alert('Please select a conversation first');
													}
												}}
												className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
											>
												🟢 Join Conversation
											</button>
											<button
												onClick={async () => {
													if (chatContext.currentConversationId) {
														await chatContext.leaveConversation(chatContext.currentConversationId);
														alert('✅ Left conversation successfully');
													} else {
														alert('Please select a conversation first');
													}
												}}
												className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
											>
												🟠 Leave Conversation
											</button>
											<button
												onClick={async () => {
													if (chatContext.currentConversationId) {
														await chatContext.markAsRead(chatContext.currentConversationId);
														alert('✅ Marked conversation as read');
													} else {
														alert('Please select a conversation first');
													}
												}}
												className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
											>
												✅ Mark as Read
											</button>
											<button
												onClick={() => {
													console.log('👁️ Current presence info:', {
														isConnected: chatContext.isConnected,
														currentConversation: chatContext.currentConversationId,
														hasNewMessages: chatContext.hasNewMessages,
														connectionStatus: chatContext.isConnected ? 'Connected' : 'Disconnected'
													});
													alert('Check console for presence details');
												}}
												className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
											>
												👁️ Get Presence
											</button>
										</div>
									</div>
                  <div>
										<h4 className="font-semibold text-green-800 mb-2">⚙️ Configuration</h4>
										<div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          const next = !autoUnsubscribeUI
                          setAutoUnsubscribeUI(next)
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('chatAutoUnsubscribe', String(next))
                          }
                          alert(`Auto-unsubscribe ${next ? 'enabled' : 'disabled'}`)
                        }}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        🔄 Auto-unsubscribe: {autoUnsubscribeUI ? 'ON' : 'OFF'}
                      </button>
											<button
												onClick={() => {
													console.log('📋 Active Subscriptions:', {
														conversations: chatContext.conversations.length,
														messages: chatContext.messages.length,
														currentConversation: chatContext.currentConversationId,
														isConnected: chatContext.isConnected,
														hasMore: {
															conversations: chatContext.hasMoreConversations,
															messages: chatContext.hasMoreMessages
														}
													});
													alert('Check console for active subscriptions');
												}}
												className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
											>
												📋 Active Subs
											</button>
											<button
												onClick={() => {
													if (confirm('Are you sure you want to clear the chat? This will close the chat panel.')) {
														chatContext.closeChat();
													}
												}}
												className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
											>
												🗑️ Clear Chat
											</button>
										</div>
									</div>
								</div>
							</div>
						)} */}

						<div className="flex-1 overflow-y-auto">
							{displayConversations.map((conversation) => (
								<div
									key={conversation.id}
									className={cn(
										"px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50",
										// ✅ ADDED: Highlight unread conversations like HTML test
										conversation.unread && "bg-blue-50 border-blue-200"
									)}
									onClick={() => {
										setActiveConversation(conversation.id);
										onSelectConversation?.(conversation.id);
									}}
								>
									<div className="flex items-center gap-3">
										<div className="relative">
											{(() => {
												// Check if this is a SyncBase conversation with participants
												const syncBaseConv = chatContext.conversations?.find(c => c.id === conversation.id);
												const isGroup = syncBaseConv?.type === 'group' || conversation.isGroup;
												const conversationName = syncBaseConv?.name || syncBaseConv?.title || conversation.name;
												
												// For direct conversations, try to get the other participant's avatar
												let avatarUrl: string | undefined;
												if (!isGroup && syncBaseConv?.participants && syncBaseConv.participants.length > 0) {
													const otherParticipant = syncBaseConv.participants[0]; // Simplified for now
													avatarUrl = otherParticipant?.avatarUrl || otherParticipant?.profilePictureUrl;
												}
												
												return isGroup ? (
													<div className="flex items-center justify-center w-[47px] h-[47px] rounded-full">
														<GroupChatIcon className="w-[48px] h-[48px]" />
													</div>
												) : avatarUrl ? (
													<img 
														src={avatarUrl} 
														alt={conversationName}
														className="w-[47px] h-[47px] rounded-[15px] object-cover"
													/>
												) : (
													<div className="flex items-center justify-center w-[47px] h-[47px] font-bold text-white bg-yellow-400 rounded-[15px]">
														{conversationName.charAt(0).toUpperCase()}
													</div>
												);
											})()}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between">
												<h3 className={cn(
													"font-medium truncate",
													// ✅ ADDED: Bold unread conversations like HTML test
													conversation.unread && "font-bold"
												)}>
													{(() => {
														// Use SyncBase conversation name if available
														const syncBaseConv = chatContext.conversations?.find(c => c.id === conversation.id);
														return syncBaseConv?.name || syncBaseConv?.title || conversation.name;
													})()}
													{/* {conversation.isGroup && (
                            <span className="px-1 ml-1 text-xs text-white bg-blue-500 rounded-sm">
                              GROUP
                            </span>
                          )} */}
												</h3>
												{/* ✅ ADDED: Unread count badge like HTML test */}
												{conversation.unread && (
													<span className="ml-2 px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full min-w-[20px] text-center">
														{typeof conversation.unread === 'number' ? conversation.unread : '•'}
													</span>
												)}
											</div>
											<p className="text-sm text-gray-600 truncate">
												{/* {conversation.isGroup && <span className="mr-1 font-medium text-blue-500">[Group]</span>} */}
												{conversation.lastMessage}
											</p>
										</div>
										<span className="ml-2 text-sm text-gray-500 whitespace-nowrap">
											{conversation.timestamp}
										</span>
									</div>
								</div>
							))}

							{/* Load More Conversations Button (like HTML test) */}
							{chatContext.hasMoreConversations && (
								<div className="px-6 py-4 border-t border-gray-200">
									<button
										onClick={async () => {
											await chatContext.loadMoreConversations();
										}}
										disabled={chatContext.isLoading}
										className="w-full px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{chatContext.isLoading ? 'Loading...' : 'Load More Conversations'}
									</button>
								</div>
							)}
						</div>
					</motion.div>
				) : (
					// Conversation Detail View
					<motion.div
						key="conversation-detail"
						className="flex flex-col h-full"
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 10 }}
						transition={{ duration: 0.15 }}
					>
						<div className="flex items-center justify-between px-4 pb-3 pt-[23px]">
							<motion.div
								className="flex items-center gap-1"
								initial={{ opacity: 0.8, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2 }}
							>
								<button
									className="p-2 rounded-full hover:bg-gray-100"
									onClick={handleBackToList}
								>
									<ArrowBackIcon className="w-[32px] h-[32px] text-gray-500" />
								</button>
								<div className="flex items-center gap-2">
									{(() => {
										// Find the selected conversation from chat context
										const selectedConversation = chatContext.conversations?.find(
											conv => conv.id === chatContext.currentConversationId
										);
										
										const conversationName = selectedConversation?.name || selectedConversation?.title || 'Chat';
										const isGroup = selectedConversation?.type === 'group';
										
										// For direct conversations, try to get the other participant's avatar
										let avatarUrl: string | undefined;
										if (!isGroup && selectedConversation?.participants && selectedConversation.participants.length > 0) {
											// Find the other participant (not current user)
											const otherParticipant = selectedConversation.participants[0]; // Simplified for now
											avatarUrl = otherParticipant?.avatarUrl || otherParticipant?.profilePictureUrl;
										}
										
										return (
											<>
												<div className="relative">
													{isGroup ? (
														<div className="flex items-center justify-center w-[47px] h-[47px] rounded-full">
															<GroupChatIcon className="w-[48px] h-[48px]" />
														</div>
													) : avatarUrl ? (
														<img 
															src={avatarUrl} 
															alt={conversationName}
															className="w-[47px] h-[47px] rounded-[15px] object-cover"
														/>
													) : (
														<div className="flex items-center justify-center w-[47px] h-[47px] font-bold text-white bg-yellow-400 rounded-[15px]">
															{conversationName.charAt(0).toUpperCase()}
														</div>
													)}
												</div>
												<h3 className="font-medium">{conversationName}</h3>
											</>
										);
									})()}
								</div>
							</motion.div>
							{/* <button className="p-2 rounded-full hover:bg-gray-100">
								<InfoIcon className="w-[24px] h-[24px] text-gray-400" />
							</button> */}
						</div>
						<div className="w-[90%] self-center border-b border-text-300"></div>

						{/* Message Search (like HTML test) */}
						<div className="px-4 py-2 border-b border-gray-200">
							<div className="flex items-center gap-2">
								<input
									type="text"
									placeholder="Search messages..."
									value={searchQuery}
									onChange={(e) => {
										const query = e.target.value;
										setSearchQuery(query);
										// Real-time search like HTML test
										if (query.length >= 2 || query.length === 0) {
											onSearchMessages?.(query);
										}
									}}
									className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md"
								/>
								<button
									onClick={() => {
										setSearchQuery('');
										onClearMessageSearch?.();
									}}
									className="px-3 py-2 text-sm text-white bg-gray-500 rounded-md hover:bg-gray-600"
								>
									Clear
								</button>
							</div>
						</div>

						<div className="flex-1 px-[23px] py-4 overflow-y-auto">
							{displayMessages.length === 0 ? (
								<div className="flex items-center justify-center h-full text-gray-500">
									<div className="text-center">
										<div className="text-4xl mb-2">💬</div>
										<div>No messages yet</div>
										<div className="text-sm">Start a conversation!</div>
									</div>
								</div>
							) : (
								displayMessages.map((msg) => (
                <motion.div
									key={msg.id}
									className={cn(
                    'mb-6 max-w-[80%] group',
										// ✅ FIXED: Match HTML test logic - own messages on right (ml-auto), others on left (mr-auto)
										msg.sender.isBot ? 'mr-auto' : 'ml-auto',
									)}
									initial={{
										opacity: 0,
										x: msg.sender.isBot ? -10 : 10,
										scale: 0.98,
									}}
									animate={{
										opacity: 1,
										x: 0,
										scale: 1,
									}}
									transition={{
										duration: 0.15,
										ease: 'easeOut',
									}}
								>
                  <div
										className={cn(
											'rounded-t-2xl p-4',
											// ✅ FIXED: Match HTML test styling - own messages get different color/style
											msg.sender.isBot
                        ? 'bg-primary-80 text-gray-800 rounded-br-2xl'
                        : 'bg-primary-500 text-white rounded-bl-2xl',
										)}
                >
                  {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mb-2 space-y-2">
                        {msg.attachments.map((att) => {
                          const isImage = (att.mimeType || '').startsWith('image/')
                          return (
                            <div key={att.id}>
                              {isImage ? (
                                <a href={att.url} target="_blank" rel="noreferrer">
                                  <img src={att.thumbnailUrl || att.url} alt={att.name || 'attachment'} className="max-h-40 rounded" />
                                </a>
                              ) : (
                                <a href={att.url} target="_blank" rel="noreferrer" className="underline">
                                  {att.name || 'Download file'}
                                </a>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                  <div className="mt-2 text-[11px] opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => setReplyTo({ id: msg.id, author: msg.sender.name, content: msg.content })}
                      className="text-blue-500 hover:underline"
                    >
                      ↩ Reply
                    </button>
                  </div>
                </div>
									<div className={cn("mt-1 text-xs text-gray-500",
										// ✅ FIXED: Match HTML test alignment - own messages right-aligned
										msg.sender.isBot ? "text-left" : "text-right"
									)}>
										{msg.sender.isBot ? msg.sender.name : 'You'} • {msg.timestamp}
									</div>
								</motion.div>
							)))}
							<div ref={messagesEndRef} />

							{/* Load More Messages Button (like HTML test) */}
							{chatContext.hasMoreMessages && (
								<div className="px-4 py-2">
									<button
										onClick={async () => {
											await chatContext.loadMoreMessages();
										}}
										disabled={chatContext.isLoading}
										className="w-full px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{chatContext.isLoading ? 'Loading...' : 'Load More Messages'}
									</button>
								</div>
							)}
						</div>

						<div className="px-4 py-4">
              <motion.div
								className="flex items-center gap-2 p-[10px] bg-primary-50 rounded-[10px]"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1, duration: 0.2 }}
							>
                  <button className="p-2 ml-1 text-gray-500 rounded-full hover:bg-gray-200" onClick={handleAddAttachmentClick}>
                    <AddIcon className="w-[24px] h-[24px] text-primary-200" />
                  </button>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />
                  <input
									type="text"
									placeholder="Message ici"
									value={message}
                    onChange={(e) => handleTypingInput(e.target.value)}
									onKeyDown={handleKeyDown}
									className="flex-1 px-4 py-2 bg-transparent border-none text-text-400 focus:outline-none"
								/>
                <button
									className="p-2 rounded-full text-primary-400 hover:bg-gray-200"
									onClick={handleSend}
								>
									{message.trim() ? (
										<Send className="w-[24px] h-[24px] text-primary-400" />
									) : (
										<EmojiIcon className="w-[24px] h-[24px] text-primary-400" />
									)}
								</button>
							</motion.div>
              {replyTo && (
                <div className="flex items-center justify-between mt-2 px-3 py-2 text-xs bg-gray-100 rounded">
                  <div className="truncate">
                    Replying to <span className="font-medium">{replyTo.author}</span>: {replyTo.content}
                  </div>
                  <button onClick={() => setReplyTo(null)} className="ml-2 text-gray-500 hover:text-gray-700">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {pendingAttachment && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                  <span>Attachment ready: {pendingAttachment.originalName}</span>
                  <button onClick={handleRemoveAttachment} className="text-red-500 flex items-center gap-1">
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              )}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
} 
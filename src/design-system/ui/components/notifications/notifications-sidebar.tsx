"use client"

import React, { useState, useEffect } from "react"
import { FileText, Info, X, Wifi, WifiOff, Volume2, VolumeX, Filter, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/core/utils/cn"
import { NotificationIcon, SearchIcon } from "@/design-system/icons/layout"
import { CloseIcon } from "@/design-system/icons/common"
import { TitleMedium, TitleSmall } from "@/design-system/ui"
import { useNotificationContext } from "@/design-system/ui/layout/notification-layout"
import { Notification, NotificationCategory, NotificationPriority } from "@/core/syncbase/modules/notifications/types"
import { useNotificationSounds } from "@/core/hooks/useNotificationSounds"

interface NotificationsSidebarProps {
  onClose: () => void
}

export function NotificationsSidebar({ onClose }: NotificationsSidebarProps) {
  const context = useNotificationContext()
  const [searchValue, setSearchValue] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [soundsEnabled, setSoundsEnabled] = useState(true)

  // Filter state (like notifications-test)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [readFilter, setReadFilter] = useState('')
  const [actionOnly, setActionOnly] = useState(false)

  // Sound system
  const { toggleSounds, getSoundsEnabled } = useNotificationSounds()

  // Update sounds enabled state
  useEffect(() => {
    setSoundsEnabled(getSoundsEnabled())
  }, [getSoundsEnabled])

  // Update backend filters when local filters change (like notifications-test)
  useEffect(() => {
    const filters: any = {};

    // Add search query
    if (searchValue) {
      filters.search = searchValue;
    }

    // Add filters (match HTML test exactly)
    if (categoryFilter) filters.category = categoryFilter;
    if (priorityFilter) filters.priority = priorityFilter;
    if (typeFilter) filters.type = typeFilter;
    if (readFilter === 'unread') filters.unreadOnly = true;
    else if (readFilter === 'read') filters.unreadOnly = false;
    if (actionOnly) filters.isActionNotification = true;

    // Send filters to backend (like HTML test)
    context.setFilters(filters);
  }, [searchValue, categoryFilter, priorityFilter, typeFilter, readFilter, actionOnly]); // Remove context dependency

  // Clear all filters (like notifications-test)
  const clearAllFilters = () => {
    setSearchValue('');
    setCategoryFilter('');
    setPriorityFilter('');
    setTypeFilter('');
    setReadFilter('');
    setActionOnly(false);
    setShowSearch(false);
    setShowFilters(false);
    setShowSettings(false);
  };

  // Test notification creation (like notifications-test)
  const handleTestNotification = async (type: 'info' | 'action' | 'critical' | 'template') => {
    try {
      // Match HTML test exactly
      const notifications = {
        info: {
          title: 'Information Notification',
          content: 'This is a test information notification to verify the system is working correctly.',
          priority: 'medium' as const,
          category: 'system' as const,
          type: 'info' as const,
          metadata: {
            icon: 'info',
            data: {
              color: '#17a2b8'
            }
          }
        },
        action: {
          title: 'Action Required',
          content: 'This is a test action notification that requires user interaction.',
          priority: 'high' as const,
          category: 'alert' as const,
          type: 'action' as const,
          isActionNotification: true,
          actionLabel: 'Take Action',
          path: '/test-action',
          metadata: {
            icon: 'warning',
            isActionNotification: true,
            data: {
              color: '#ffc107'
            }
          }
        },
        critical: {
          title: 'Critical System Alert',
          content: 'This is a critical test notification with high priority.',
          priority: 'critical' as const,
          category: 'alert' as const,
          type: 'info' as const,
          metadata: {
            icon: 'error',
            data: {
              color: '#dc3545',
              sound: 'alert'
            }
          }
        },
        template: {
          title: 'Template Notification',
          content: 'This notification was created from a template with test variables.',
          priority: 'medium' as const,
          category: 'system' as const,
          type: 'info' as const,
          metadata: {
            data: {
              templateKey: 'system.welcome',
              variables: {
                userName: 'Test User',
                platformName: 'Coachini'
              }
            }
          }
        }
      };

      await context.createNotification(notifications[type]);
      console.log(`✅ ${type} notification created successfully`);
    } catch (error) {
      console.error(`❌ Failed to create ${type} notification:`, error);
    }
  };

  const getIconComponent = (category: NotificationCategory) => {
    switch (category) {
      case 'session':
        return <FileText className="w-[40px] h-[40px] text-white" />
      case 'system':
        return <Info className="w-[40px] h-[40px] text-white" />
      case 'alert':
        return <X className="w-[40px] h-[40px] text-white" />
      case 'message':
        return <FileText className="w-[40px] h-[40px] text-white" />
      default:
        return <Info className="w-[40px] h-[40px] text-white" />
    }
  }

  const getIconBackground = (category: NotificationCategory, priority: NotificationPriority) => {
    if (priority === 'critical') return 'bg-red-500'
    if (priority === 'high') return 'bg-orange-500'

    switch (category) {
      case 'session':
        return 'bg-[#84A5D2]'
      case 'system':
        return 'bg-[#F8D451]'
      case 'alert':
        return 'bg-[#FF8787]'
      case 'message':
        return 'bg-[#84A5D2]'
      default:
        return 'bg-gray-500'
    }
  }

  // Use all notifications since filtering is now done on backend (like notifications-test)
  const filteredNotifications = context.notifications;

  // Calculate stats (like notifications-test)
  const totalNotifications = filteredNotifications.length;
  const unreadNotifications = filteredNotifications.filter(n => !n.isRead).length;
  // Action notifications: check isActionNotification flag, actionLabel, or path (match HTML test logic)
  const actionNotifications = filteredNotifications.filter(n =>
    n.isActionNotification ||
    n.actionLabel ||
    n.path ||
    n.metadata?.isActionNotification
  ).length;

  const formatTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}min`
    if (hours < 24) return `${hours}h`
    return `${days} days`
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-card">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center">
          <NotificationIcon className="mr-3 text-primary-400 w-[32px] h-[32px]" />
          <AnimatePresence>
            {!showSearch && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <TitleMedium className="font-semibold text-text-700 dark:text-gray-100">
                  Notifications
                </TitleMedium>
              </motion.div>
            )}
          </AnimatePresence>
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
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  autoFocus
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="w-full pl-4 text-sm border border-gray-200 rounded-full h-7 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button 
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => {
                    setSearchValue('');
                    setShowSearch(false);
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
          {/* <motion.button
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${showFilters ? 'bg-blue-100 text-blue-600' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle filters"
          >
            <Filter className="w-[20px] h-[20px]" />
          </motion.button> */}

          {/* Settings toggle button */}
          {/* <motion.button
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${showSettings ? 'bg-green-100 text-green-600' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle settings & test controls"
          >
            <Settings className="w-[20px] h-[20px]" />
          </motion.button> */}

          {/* Sound toggle button */}
          {/* <motion.button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              const newState = toggleSounds()
              setSoundsEnabled(newState)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={soundsEnabled ? 'Disable notification sounds' : 'Enable notification sounds'}
          >
            {soundsEnabled ? (
              <Volume2 className="w-[20px] h-[20px] text-green-600" />
            ) : (
              <VolumeX className="w-[20px] h-[20px] text-gray-400" />
            )}
          </motion.button> */}

          <motion.button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CloseIcon className="w-[24px] h-[24px] text-text-300" />
          </motion.button>
        </div>
      </div>

      {/* Connection Status & Stats */}
      {/* <div className="px-5 py-2 border-b border-gray-100 bg-gray-50 dark:bg-gray-800/20">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {context.isConnected ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {context.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {context.unreadCount} unread
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Total: {totalNotifications}</span>
          <span>Actions: {actionNotifications}</span>
          <span>Unread: {unreadNotifications}</span>
        </div>
      </div> */}

      {/* Filter Controls (like notifications-test) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-gray-100 bg-gray-50 dark:bg-gray-800/20 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2 py-1 text-xs border rounded"
                >
                  <option value="">All Categories</option>
                  <option value="system">System</option>
                  <option value="session">Session</option>
                  <option value="alert">Alert</option>
                  <option value="message">Message</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-2 py-1 text-xs border rounded"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-2 py-1 text-xs border rounded"
                >
                  <option value="">All Types</option>
                  <option value="info">Info</option>
                  <option value="action">Action</option>
                </select>

                <select
                  value={readFilter}
                  onChange={(e) => setReadFilter(e.target.value)}
                  className="px-2 py-1 text-xs border rounded"
                >
                  <option value="">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={actionOnly}
                  onChange={(e) => setActionOnly(e.target.checked)}
                  className="rounded"
                />
                Action Notifications Only
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings & Test Controls (like notifications-test) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-gray-100 bg-green-50 dark:bg-green-900/20 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Test Controls</span>
                <span className="text-xs text-green-600">Development Mode</span>
              </div>

              {/* Test Notification Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTestNotification('info')}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200"
                >
                  📘 Info
                </button>
                <button
                  onClick={() => handleTestNotification('action')}
                  className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded hover:bg-orange-200"
                >
                  ⚡ Action
                </button>
                <button
                  onClick={() => handleTestNotification('critical')}
                  className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200"
                >
                  🚨 Critical
                </button>
                <button
                  onClick={() => handleTestNotification('template')}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200"
                >
                  📋 Template
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => context.refresh()}
                  disabled={context.isLoading}
                  className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  {context.isLoading ? '⏳' : '🔄'} Refresh
                </button>
                <button
                  onClick={clearAllFilters}
                  className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'px-5 py-4 border-b border-gray-100 flex items-center gap-4 cursor-pointer transition-colors group',
                !notification.isRead
                  ? 'bg-[#84A5D2]/19 dark:bg-blue-900/10'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/10',
              )}
              onClick={() => {
                if (!notification.isRead) {
                  context.markAsRead([notification.id])
                }
                if (notification.actionUrl) {
                  window.open(notification.actionUrl, '_blank')
                }
              }}
            >
              <div className={`p-[10px] flex items-center justify-center ${getIconBackground(notification.category, notification.priority)} rounded-[10px]`}>
                {getIconComponent(notification.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <TitleSmall
                    className={cn(
                      'text-text-700 truncate',
                      !notification.isRead && 'font-bold text-foreground',
                    )}
                  >
                    {notification.title}
                  </TitleSmall>
                  {notification.priority === 'critical' && (
                    <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                      CRITICAL
                    </span>
                  )}
                  {notification.metadata?.isActionNotification && (
                    <span className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">
                      ACTION
                    </span>
                  )}
                </div>
                <TitleSmall
                  className={cn(
                    'text-text-700 dark:text-gray-400 line-clamp-2',
                    !notification.isRead && 'font-medium text-foreground',
                  )}
                >
                  {notification.content || notification.message}
                </TitleSmall>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 capitalize">
                    {notification.category}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 capitalize">
                    {notification.priority}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={cn(
                    'text-xs text-text-500',
                    !notification.isRead && 'font-bold text-foreground',
                  )}
                >
                  {formatTime(notification.createdAt)}
                </span>

                {/* Action buttons (visible on hover) */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        context.markAsRead([notification.id])
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Read
                    </button>
                  )}
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation()
                      context.deleteNotification(notification.id)
                    }}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
            <NotificationIcon className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              No notifications
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {searchValue ? 'No notifications match your search' : 'You\'re all caught up!'}
            </p>
          </div>
        )}
      </div>

      {/* Load More button (if there are more notifications) */}
      {context.hasMore && context.notifications.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => context.loadMore()}
            disabled={!context.isConnected || context.isLoading}
            className="w-full px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
          >
            {context.isLoading ? 'Loading...' : 'Load More Notifications'}
          </button>
        </div>
      )}

      {/* Footer with actions */}
      {/* {context.notifications.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 dark:bg-gray-800/20">
          <div className="flex gap-2">
            <button
              onClick={() => context.markAllAsRead()}
              className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Mark All Read
            </button>
            <button
              onClick={() => context.refresh()}
              disabled={context.isLoading}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
            >
              {context.isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      )} */}

      {/* Debug info (like notifications-test) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="p-2 text-xs text-gray-500 border-t bg-gray-50">
          <div className="space-y-1">
            <div>Debug: hasMore={String(context.hasMore)}, total={filteredNotifications.length}, isLoading={String(context.isLoading)}</div>
            <div>Connected: {String(context.isConnected)}, Unread: {context.unreadCount}</div>
            <div>Active Filters: {[
              searchValue && `search="${searchValue}"`,
              categoryFilter && `category="${categoryFilter}"`,
              priorityFilter && `priority="${priorityFilter}"`,
              typeFilter && `type="${typeFilter}"`,
              readFilter && `read="${readFilter}"`,
              actionOnly && 'actionOnly=true'
            ].filter(Boolean).join(', ') || 'none'}</div>
          </div>
        </div>
      )} */}
    </div>
  )
}

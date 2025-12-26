"use client"

import React, { ReactNode, useState, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { NotificationsSidebar } from "@/design-system/ui/components/notifications/notifications-sidebar"
import { useNotifications } from "@/core/syncbase/modules/notifications/useNotifications"
import { Notification, CreateNotificationData } from "@/core/syncbase/modules/notifications/types"

// Enhanced notification context that includes SyncBase data
type NotificationContextType = {
  // UI State
  isOpen: boolean
  hasNewNotifications: boolean
  openNotifications: () => void
  closeNotifications: () => void
  toggleNotifications: () => void

  // SyncBase Data
  notifications: Notification[]
  unreadCount: number
  isConnected: boolean
  isLoading: boolean
  error: Error | null

  // Actions (from SyncBase useNotifications hook)
  markAsRead: (notificationIds: string[]) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  createNotification: (data: CreateNotificationData) => Promise<Notification>
  refresh: () => Promise<void>
  loadMore: () => Promise<void>
  hasMore: boolean

  // Filter functionality (like notifications-test)
  setFilters: (filters: any) => void
  clearFilters: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotificationContext = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotificationContext must be used within a NotificationLayoutProvider")
  }
  return context
}

interface NotificationLayoutProps {
  children: ReactNode
}

export function NotificationLayout({ children }: NotificationLayoutProps) {
  // Get SyncBase notification data (match notifications-test settings)
  const syncBaseNotifications = useNotifications({
    limit: 10, // Load 10 notifications initially like notifications-test
    autoRefresh: true,
    enableSounds: true,
    onNotificationReceived: (notification) => {
      console.log('New notification received:', notification.title);
    },
    onError: (error) => {
      console.error('Notification error:', error);
    }
  });

  // Local UI state
  const [isOpen, setIsOpen] = useState(false)

  // UI actions
  const openNotifications = () => setIsOpen(true)
  const closeNotifications = () => setIsOpen(false)
  const toggleNotifications = () => setIsOpen(prev => !prev)

  // Check if there are new notifications
  const hasNewNotifications = syncBaseNotifications.unreadCount > 0

  // Prevent body scrolling when notifications panel is open
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

  // Update page title with unread notification count (favicon remains unchanged)
  useEffect(() => {
    // Get the original title (without notification count)
    const getOriginalTitle = () => {
      const currentTitle = document.title
      // Remove existing notification count if present
      return currentTitle.replace(/^\(\d+\)\s*/, '')
    }

    const originalTitle = getOriginalTitle()

    // Update page title
    if (syncBaseNotifications.unreadCount > 0) {
      // Add unread count to title
      document.title = `(${syncBaseNotifications.unreadCount}) ${originalTitle}`
    } else {
      // Remove unread count from title
      document.title = originalTitle
    }

    // Cleanup function to restore original title when component unmounts
    return () => {
      document.title = originalTitle
    }
  }, [syncBaseNotifications.unreadCount])

  // Handle page visibility changes (when user switches tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && syncBaseNotifications.unreadCount > 0) {
        // Optional: You could add a subtle flash or animation here
        console.log(`👀 User returned to tab with ${syncBaseNotifications.unreadCount} unread notifications`)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [syncBaseNotifications.unreadCount])

  // Note: Initial notification fetching is now handled by SyncBase useNotifications hook
  // This provides automatic subscription and real-time updates

  return (
    <NotificationContext.Provider
      value={{
        // UI State
        isOpen,
        hasNewNotifications,
        openNotifications,
        closeNotifications,
        toggleNotifications,

        // SyncBase Data
        notifications: syncBaseNotifications.notifications,
        unreadCount: syncBaseNotifications.unreadCount,
        isConnected: syncBaseNotifications.isSubscribed,
        isLoading: syncBaseNotifications.isLoading,
        error: syncBaseNotifications.error,

        // Actions
        markAsRead: syncBaseNotifications.markAsRead,
        markAllAsRead: syncBaseNotifications.markAllAsRead,
        deleteNotification: syncBaseNotifications.deleteNotification,
        createNotification: syncBaseNotifications.createNotification,
        refresh: syncBaseNotifications.refresh,
        loadMore: syncBaseNotifications.loadMore,
        hasMore: syncBaseNotifications.hasMore,

        // Filter functionality
        setFilters: syncBaseNotifications.setFilters,
        clearFilters: syncBaseNotifications.clearFilters,
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
            onClick={closeNotifications}
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
            <NotificationsSidebar
              onClose={closeNotifications}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  )
}

"use client"

import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from '@/core/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface MaintenanceBannerProps {
  message?: string
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

/**
 * MaintenanceBanner - A yellow warning strip displayed at the top of the page
 * 
 * Features:
 * - Fixed positioning at top of viewport
 * - Yellow warning color scheme
 * - Optional dismiss button
 * - Smooth animations
 * - Responsive design
 */
export function MaintenanceBanner({
  message = "This website is currently under maintenance. Some features may be unavailable.",
  dismissible = false,
  onDismiss,
  className
}: MaintenanceBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            // Fixed positioning at top
            "fixed top-0 left-0 right-0 z-[100]",
            // Yellow warning colors
            "bg-amber-50 border-b-2 border-amber-400",
            // Layout
            "px-4 py-3 sm:px-6",
            className
          )}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              {/* Icon and Message */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm font-medium text-amber-900 truncate sm:text-base">
                  {message}
                </p>
              </div>

              {/* Dismiss Button */}
              {dismissible && (
                <button
                  onClick={handleDismiss}
                  className={cn(
                    "flex-shrink-0 p-1 rounded-md",
                    "text-amber-600 hover:text-amber-900",
                    "hover:bg-amber-100",
                    "transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  )}
                  aria-label="Dismiss maintenance banner"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


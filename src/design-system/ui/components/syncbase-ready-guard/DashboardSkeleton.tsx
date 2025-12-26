"use client"

import React from 'react'
import { Skeleton } from '@/design-system/ui/base/skeleton'
import { cn } from '@/core/utils'

/**
 * Loading skeleton for the dashboard while SyncBase initializes
 */
export function DashboardSkeleton() {
  return (
    <div className="relative flex h-screen">
      {/* Loading indicator */}
      <div className="absolute inset-0 bg-background/50 flex items-center justify-center pointer-events-none">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
      </div>
    </div>
  )
}

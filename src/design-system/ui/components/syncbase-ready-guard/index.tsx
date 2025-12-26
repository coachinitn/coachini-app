"use client"

import React, { ReactNode, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSyncBase } from '@/core/syncbase/providers/SyncBaseProvider'
import { useAuth } from '@/core/auth/hooks'
import { ConnectionState } from '@/core/syncbase/core/types'
import { DashboardSkeleton } from './DashboardSkeleton'
import { SyncBaseErrorBoundary } from './SyncBaseErrorBoundary'

interface SyncBaseReadyGuardProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: ReactNode
  enableSimulation?: boolean // Enable simulation mode for testing
}

/**
 * Guards components that depend on SyncBase context
 * Only renders children when SyncBase is fully initialized and connected
 */
export function SyncBaseReadyGuard({
  children,
  fallback = <DashboardSkeleton />,
  errorFallback,
}: SyncBaseReadyGuardProps) {
  const { isInitialized, isConnected, error, connectionState } = useSyncBase()
  const { logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isDashboardRoute = pathname?.startsWith('/dashboard')


 
  if (isDashboardRoute) {
    return <>{fallback}</>;
  }

  return children;
}

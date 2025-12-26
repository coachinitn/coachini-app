"use client"

import React from 'react'
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/design-system/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/ui/base/card'
import { Badge } from '@/design-system/ui/base/badge'
import { ConnectionState } from '@/core/syncbase/core/types'

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'
import { useSyncBase } from '@/core/syncbase/providers/SyncBaseProvider'

interface SyncBaseErrorBoundaryProps {
  error: string
  connectionState: ConnectionState
}

/**
 * Error boundary for SyncBase connection issues
 * Provides user-friendly error messages and recovery options
 */
export function SyncBaseErrorBoundary({ error, connectionState }: SyncBaseErrorBoundaryProps) {
  const { reconnect } = useSyncBase()

  const getErrorIcon = () => {
    if (connectionState.status === 'disconnected') {
      return <WifiOff className="h-12 w-12 text-destructive" />
    }
    return <AlertCircle className="h-12 w-12 text-destructive" />
  }

  const getErrorTitle = () => {
    switch (connectionState.status) {
      case 'disconnected':
        return 'Connection Lost'
      case 'connecting':
        return 'Connecting...'
      case 'error':
        return 'Connection Error'
      default:
        return 'Real-time Service Error'
    }
  }

  const getErrorMessage = () => {
    if (connectionState.status === 'disconnected') {
      return 'Lost connection to real-time services. Your dashboard may not show the latest updates.'
    }
    if (connectionState.status === 'connecting') {
      return `Attempting to connect... (${connectionState.reconnectAttempts} attempts)`
    }
    return error || 'Unable to connect to real-time services. Some features may be limited.'
  }

  const handleRetry = async () => {
    try {
      await reconnect()
    } catch (error) {
      console.error('Manual reconnect failed:', error)
    }
  }

  const getConnectionBadge = () => {
    const variants = {
      connected: 'default' as const,
      connecting: 'secondary' as const,
      disconnected: 'destructive' as const,
      error: 'destructive' as const,
    }

    return (
      <Badge variant={variants[connectionState.status] || 'secondary'}>
        {connectionState.status === 'connecting' && (
          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
        )}
        {connectionState.status}
      </Badge>
    )
  }

  return (
      <div className='min-h-screen bg-background flex items-center justify-center p-4'>
          {getErrorIcon()}

          {/* <Card className='w-full max-w-md'> */}
              {/* <CardHeader className='text-center pb-4'>
                  <div className='flex justify-center mb-4'>{getErrorIcon()}</div>
                  <CardTitle className='text-xl font-semibold'>{getErrorTitle()}</CardTitle>
                  <div className='flex justify-center mt-2'>{getConnectionBadge()}</div>
              </CardHeader> */}

              {/* <CardContent className='text-center space-y-4'>
                  <p className='text-foreground-subtle text-sm leading-relaxed'>{getErrorMessage()}</p>

                  {process.env.NODE_ENV === 'development' && (
                      <details className='text-left'>
                          <summary className='cursor-pointer text-xs text-foreground-subtle hover:text-foreground'>
                              Technical Details
                          </summary>
                          <div className='mt-2 p-3 bg-muted rounded text-xs font-mono'>
                              <div>
                                  <strong>Error:</strong> {error}
                              </div>
                              <div>
                                  <strong>Status:</strong> {connectionState.status}
                              </div>
                              <div>
                                  <strong>Attempts:</strong> {connectionState.reconnectAttempts}
                              </div>
                          </div>
                      </details>
                  )}

                  <div className='flex flex-col sm:flex-row gap-2 pt-2'>
                      <Button
                          onClick={handleRetry}
                          className='flex-1'
                          disabled={connectionState.status === 'connecting'}>
                          {connectionState.status === 'connecting' ? (
                              <>
                                  <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                                  Connecting...
                              </>
                          ) : (
                              <>
                                  <Wifi className='w-4 h-4 mr-2' />
                                  Retry Connection
                              </>
                          )}
                      </Button>

                      <Button variant='outline' onClick={() => window.location.reload()} className='flex-1'>
                          Reload Page
                      </Button>
                  </div>

                  <p className='text-xs text-foreground-subtle'>If the problem persists, please contact support.</p>
              </CardContent> */}
          {/* </Card> */}
      </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useSyncBase } from '../providers/SyncBaseProvider';

interface SyncBaseDebugPanelProps {
  className?: string;
  showMetrics?: boolean;
  showDebugInfo?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function SyncBaseDebugPanel({ 
  className = '',
  showMetrics = true,
  showDebugInfo = true,
  autoRefresh = true,
  refreshInterval = 2000
}: SyncBaseDebugPanelProps) {
  const { 
    isConnected, 
    connectionState, 
    metrics, 
    error, 
    getMetrics, 
    getDebugInfo,
    reconnect,
    disconnect
  } = useSyncBase();

  const [debugInfo, setDebugInfo] = useState<any>({});
  const [currentMetrics, setCurrentMetrics] = useState<any>({});

  // Auto-refresh debug info and metrics
  useEffect(() => {
    if (!autoRefresh) return;

    const updateInfo = () => {
      setDebugInfo(getDebugInfo());
      setCurrentMetrics(getMetrics());
    };

    updateInfo();
    const interval = setInterval(updateInfo, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, getDebugInfo, getMetrics]);

  const formatUptime = (uptime: number) => {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getConnectionStatusColor = () => {
    if (isConnected) return 'text-green-600';
    if (connectionState.status === 'connecting') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConnectionStatusIcon = () => {
    if (isConnected) return '🟢';
    if (connectionState.status === 'connecting') return '🟡';
    return '🔴';
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">SyncBase Debug Panel</h3>
        <div className="flex gap-2">
          <button
            onClick={reconnect}
            disabled={isConnected}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reconnect
          </button>
          <button
            onClick={disconnect}
            disabled={!isConnected}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Connection Status</h4>
        <div className="bg-gray-50 p-3 rounded">
          <div className="flex items-center gap-2 mb-2">
            <span>{getConnectionStatusIcon()}</span>
            <span className={`font-medium ${getConnectionStatusColor()}`}>
              {connectionState.status.toUpperCase()}
            </span>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm mb-2">
              Error: {error}
            </div>
          )}
          
          <div className="text-sm text-gray-600 space-y-1">
            <div>Reconnect Attempts: {connectionState.reconnectAttempts}</div>
            {currentMetrics.connectionUptime > 0 && (
              <div>Uptime: {formatUptime(currentMetrics.connectionUptime)}</div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics */}
      {showMetrics && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Performance Metrics</h4>
          <div className="bg-gray-50 p-3 rounded">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Latency</div>
                <div className="font-mono font-medium">
                  {currentMetrics.latency || 0}ms
                </div>
              </div>
              <div>
                <div className="text-gray-600">Messages Sent</div>
                <div className="font-mono font-medium">
                  {currentMetrics.messagesSent || 0}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Messages Received</div>
                <div className="font-mono font-medium">
                  {currentMetrics.messagesReceived || 0}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Error Count</div>
                <div className="font-mono font-medium text-red-600">
                  {currentMetrics.errorCount || 0}
                </div>
              </div>
            </div>
            
            {currentMetrics.lastHealthCheck && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Last Health Check: {new Date(currentMetrics.lastHealthCheck).toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debug Information */}
      {showDebugInfo && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Debug Information</h4>
          <details className="bg-gray-50 rounded">
            <summary className="p-3 cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
              Show Debug Data
            </summary>
            <div className="p-3 pt-0">
              <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

// Hook for easy access to debug panel
export function useSyncBaseDebug() {
  const syncbase = useSyncBase();
  
  return {
    ...syncbase,
    DebugPanel: SyncBaseDebugPanel
  };
}

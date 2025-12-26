/**
 * Enhanced SyncBase Hook
 * Provides additional utilities and computed properties for SyncBase
 */

import { useSyncBase } from '../providers/SyncBaseProvider';

export interface HealthCheckResult {
  success: boolean;
  latency?: number;
  error?: string;
  timestamp: Date;
}

export type ConnectionQuality = 'disconnected' | 'poor' | 'fair' | 'good' | 'excellent';

/**
 * Enhanced hook with additional utilities and computed properties
 */
export function useSyncBaseEnhanced() {
  const syncbase = useSyncBase();
  
  // Health check utility
  const performHealthCheck = async (): Promise<HealthCheckResult> => {
    if (!syncbase.client) {
      return {
        success: false,
        error: 'SyncBase client not available',
        timestamp: new Date()
      };
    }
    
    try {
      const start = Date.now();
      await syncbase.client.sendEvent('syncbase:health');
      const latency = Date.now() - start;
      
      return {
        success: true,
        latency,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  };

  // Connection quality assessment
  const getConnectionQuality = (): ConnectionQuality => {
    const metrics = syncbase.getMetrics();
    const latency = metrics.latency || 0;
    const errorRate = metrics.errorCount / Math.max(metrics.messagesSent, 1);
    
    if (!syncbase.isConnected) return 'disconnected';
    if (latency > 1000 || errorRate > 0.1) return 'poor';
    if (latency > 500 || errorRate > 0.05) return 'fair';
    if (latency > 200) return 'good';
    return 'excellent';
  };

  // Auto-reconnect with exponential backoff
  const autoReconnect = async (maxAttempts = 5): Promise<boolean> => {
    let attempts = 0;
    
    while (attempts < maxAttempts && !syncbase.isConnected) {
      try {
        await syncbase.reconnect();
        return true;
      } catch (error) {
        attempts++;
        const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return false;
  };

  // Get formatted metrics
  const getFormattedMetrics = () => {
    const metrics = syncbase.getMetrics();
    
    return {
      ...metrics,
      latencyFormatted: `${metrics.latency || 0}ms`,
      uptimeFormatted: formatUptime(metrics.connectionUptime || 0),
      errorRate: metrics.messagesSent > 0 
        ? ((metrics.errorCount || 0) / metrics.messagesSent * 100).toFixed(2) + '%'
        : '0%',
      successRate: metrics.messagesSent > 0
        ? (((metrics.messagesSent - (metrics.errorCount || 0)) / metrics.messagesSent) * 100).toFixed(2) + '%'
        : '100%'
    };
  };

  // Format uptime duration
  const formatUptime = (uptime: number): string => {
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

  // Check if connection is healthy
  const isHealthy = (): boolean => {
    const metrics = syncbase.getMetrics();
    return syncbase.isConnected && 
           (metrics.errorCount || 0) < 5 && 
           (metrics.latency || 0) < 1000;
  };

  // Get connection status with details
  const getConnectionStatus = () => {
    const quality = getConnectionQuality();
    const metrics = syncbase.getMetrics();
    
    return {
      isConnected: syncbase.isConnected,
      quality,
      latency: metrics.latency || 0,
      uptime: metrics.connectionUptime || 0,
      errorCount: metrics.errorCount || 0,
      isHealthy: isHealthy(),
      lastHealthCheck: metrics.lastHealthCheck,
      reconnectAttempts: syncbase.connectionState.reconnectAttempts || 0
    };
  };

  // Monitor connection and trigger callbacks
  const monitorConnection = (callbacks: {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: string) => void;
    onHealthy?: () => void;
    onUnhealthy?: () => void;
  }) => {
    // This would typically use useEffect in the component
    // For now, return the current state
    return {
      isConnected: syncbase.isConnected,
      isHealthy: isHealthy(),
      error: syncbase.error
    };
  };

  // Computed properties
  const connectionQuality = getConnectionQuality();
  const healthy = isHealthy();
  const formattedMetrics = getFormattedMetrics();
  const connectionStatus = getConnectionStatus();

  return {
    // Original syncbase properties
    ...syncbase,
    
    // Enhanced utilities
    performHealthCheck,
    getConnectionQuality,
    autoReconnect,
    getFormattedMetrics,
    formatUptime,
    isHealthy,
    getConnectionStatus,
    monitorConnection,
    
    // Computed properties
    connectionQuality,
    healthy,
    formattedMetrics,
    connectionStatus,
    
    // Convenience properties
    uptime: syncbase.metrics.connectionUptime || 0,
    latency: syncbase.metrics.latency || 0,
    errorCount: syncbase.metrics.errorCount || 0,
    messagesSent: syncbase.metrics.messagesSent || 0,
    messagesReceived: syncbase.metrics.messagesReceived || 0
  };
}

// Type for the enhanced hook return
export type UseSyncBaseEnhancedReturn = ReturnType<typeof useSyncBaseEnhanced>;

// Re-export the basic hook for convenience
export { useSyncBase } from '../providers/SyncBaseProvider';

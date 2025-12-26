'use client';

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { SyncBaseClient } from '../core/SyncBaseClient';
import { SyncBaseConfig, ConnectionState, ClientState } from '../core/types';

// Context interface
interface SyncBaseContextType {
  client: SyncBaseClient | null;
  isConnected: boolean;
  isInitialized: boolean;
  connectionState: ConnectionState;
  clientState: ClientState | null;
  metrics: any;
  error: string | null;
  reconnect: () => Promise<void>;
  disconnect: () => void;
  getMetrics: () => any;
  getDebugInfo: () => any;
}

// Create context
const SyncBaseContext = createContext<SyncBaseContextType | null>(null);

// Provider props
interface SyncBaseProviderProps {
  children: ReactNode;
  config?: Partial<SyncBaseConfig>;
  debug?: boolean;
}

// Default configuration
const DEFAULT_CONFIG = {
    url: process.env.NEXT_PUBLIC_WS_URL,
    options: {
        autoReconnect: true,
        reconnectInterval: 5000,
        maxReconnectAttempts: 10,
        timeout: 20000,
        offlineSupport: false, // Temporarily disabled to fix subscription issues
        debug: process.env.NODE_ENV === 'development',
        transports: ['websocket', 'polling'],
        path: '/syncbase/socket.io'
    }
};

export function SyncBaseProvider({ children, config = {}, debug = false }: SyncBaseProviderProps) {
  const { data: session, status } = useSession();
  const clientRef = useRef<SyncBaseClient | null>(null);
  
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: 'disconnected',
    reconnectAttempts: 0
  });
  const [clientState, setClientState] = useState<ClientState | null>(null);
  const [metrics, setMetrics] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  // Get WebSocket URL from environment
  const getWebSocketUrl = (): string => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!wsUrl) {
      throw new Error('NEXT_PUBLIC_WS_URL or NEXT_PUBLIC_API_URL environment variable is required');
    }

    // Add /syncbase namespace to match backend configuration
    const syncbaseUrl = `${wsUrl}/syncbase`;

    if (debug) {
      console.log('[SyncBaseProvider] Using WebSocket URL:', syncbaseUrl);
    }

    return syncbaseUrl;
  };

  // Memoize authentication functions to prevent unnecessary re-renders
  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      console.log('[SyncBaseProvider] Fetching token from /api/auth/token...');
      const response = await fetch('/api/auth/token');
      if (!response.ok) {
        console.warn('[SyncBaseProvider] Failed to get token:', response.status);
        return null;
      }
      const data = await response.json();
      const token = data.accessToken || null;
      console.log('[SyncBaseProvider] Token retrieved:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
      });
      return token;
    } catch (error) {
      console.error('[SyncBaseProvider] Error getting token:', error);
      return null;
    }
  }, []);

  // Token refresh function
  const refreshToken = useCallback(async (): Promise<string> => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token available for refresh');
      }
      return token;
    } catch (error) {
      console.error('[SyncBaseProvider] Error refreshing token:', error);
      throw new Error('Failed to refresh token');
    }
  }, [getToken]);

  // Memoize the config to prevent unnecessary re-renders
  const memoizedConfig = useMemo(() => config, [JSON.stringify(config)]);

  // Initialize client only once when authenticated
  useEffect(() => {
    console.log('[SyncBaseProvider] Authentication check:', {
      status,
      hasSession: !!session,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id
    });

    if (status !== 'authenticated' || !session?.user?.id) {
      console.log('[SyncBaseProvider] Not authenticated, skipping client initialization');
      return;
    }

    // Skip if already initialized and connected
    if (clientRef.current && isInitialized && isConnected) {
      if (debug) {
        console.log('[SyncBaseProvider] Client already initialized and connected');
      }
      return;
    }

    let isMounted = true;

    const initializeClient = async () => {
      try {
        if (!isMounted) return;

        setError(null);

        // Create SyncBase configuration
        const syncBaseConfig: SyncBaseConfig = {
          url: getWebSocketUrl(),
          auth: {
            getToken,
            refreshToken,
            onTokenExpired: () => {
              if (isMounted) {
                console.warn('[SyncBaseProvider] Token expired');
                setError('Authentication token expired');
              }
            },
            onTokenRefresh: (_token: string) => {
              if (debug && isMounted) {
                console.log('[SyncBaseProvider] Token refreshed');
              }
            }
          },
          options: {
            ...DEFAULT_CONFIG.options,
            ...memoizedConfig.options,
            debug: debug || DEFAULT_CONFIG.options.debug
          }
        };

        // Create client instance
        const client = new SyncBaseClient(syncBaseConfig);
        if (!isMounted) return;

        clientRef.current = client;

        // Setup event listeners
        setupEventListeners(client);

        // Initialize the client
        await client.initialize();

        if (!isMounted) return;

        setIsInitialized(true);
        setIsConnected(client.isConnected());
        setConnectionState(client.getConnectionState());
        setClientState(client.getClientState());

        if (debug) {
          console.log('[SyncBaseProvider] Client initialized successfully');
        }

      } catch (err) {
        if (!isMounted) return;

        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize SyncBase client';
        setError(errorMessage);
        console.error('[SyncBaseProvider] Initialization failed:', err);
      }
    };

    initializeClient();

    return () => {
      isMounted = false;
    };
  }, [status, session?.user?.id, isInitialized, isConnected]); // Only re-run when auth status changes

  // Handle cleanup on unmount or when authentication is lost
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        if (debug) {
          console.log('[SyncBaseProvider] Cleaning up client on unmount');
        }
        clientRef.current.destroy();
        clientRef.current = null;
        setIsInitialized(false);
        setIsConnected(false);
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // Handle authentication state changes
  useEffect(() => {
    if (status === 'unauthenticated' && clientRef.current) {
      if (debug) {
        console.log('[SyncBaseProvider] User unauthenticated, cleaning up client');
      }
      clientRef.current.destroy();
      clientRef.current = null;
      setIsInitialized(false);
      setIsConnected(false);
      setError(null);
    }
  }, [status, debug]);

  // Setup event listeners for client events
  const setupEventListeners = (client: SyncBaseClient) => {
    // Connection status changes
    const unsubscribeConnection = client.on('connection:status', (data: { status: string; reason?: string }) => {
      setIsConnected(data.status === 'connected');
      setConnectionState(client.getConnectionState());
      setClientState(client.getClientState());

      if (debug) {
        console.log('[SyncBaseProvider] Connection status:', data.status);
      }
    });

    // Connection errors
    const unsubscribeError = client.on('connection:error', (data: { error: string }) => {
      setError(data.error);
      setConnectionState(client.getConnectionState());
      setClientState(client.getClientState());

      if (debug) {
        console.error('[SyncBaseProvider] Connection error:', data.error);
      }
    });

    // Reconnection attempts
    const unsubscribeReconnect = client.on('connection:reconnect', (data: { attempt: number; maxAttempts: number }) => {
      setConnectionState(client.getConnectionState());
      setClientState(client.getClientState());

      if (debug) {
        console.log(`[SyncBaseProvider] Reconnection attempt ${data.attempt}/${data.maxAttempts}`);
      }
    });

    // Client initialization
    const unsubscribeInit = client.on('client:initialized', (data: { timestamp: Date; offlineSupport: boolean }) => {
      setIsInitialized(true);
      setClientState(client.getClientState());

      if (debug) {
        console.log('[SyncBaseProvider] Client initialized:', data);
      }
    });

    // Store unsubscribe functions for cleanup
    return () => {
      unsubscribeConnection();
      unsubscribeError();
      unsubscribeReconnect();
      unsubscribeInit();
    };
  };

  // State synchronization effect - keep React state in sync with client state
  useEffect(() => {
    if (!clientRef.current) return;

    const syncState = () => {
      if (clientRef.current) {
        // Update metrics
        const currentMetrics = clientRef.current.getMetrics();
        setMetrics(currentMetrics);

        // Update connection state
        const currentConnectionState = clientRef.current.getConnectionState();
        setConnectionState(currentConnectionState);

        // Update client state
        const currentClientState = clientRef.current.getClientState();
        setClientState(currentClientState);

        // Update connection status
        setIsConnected(clientRef.current.isConnected());
      }
    };

    // Initial sync
    syncState();

    // Periodic sync every 2 seconds
    const syncInterval = setInterval(syncState, 2000);

    return () => {
      clearInterval(syncInterval);
    };
  }, [clientRef.current]);

  // Manual reconnect function
  const reconnect = async (): Promise<void> => {
    if (!clientRef.current) {
      throw new Error('Client not initialized');
    }

    try {
      setError(null);
      await clientRef.current.connect();
      
      if (debug) {
        console.log('[SyncBaseProvider] Manual reconnection successful');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Reconnection failed';
      setError(errorMessage);
      throw err;
    }
  };

  // Manual disconnect function
  const disconnect = (): void => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      
      if (debug) {
        console.log('[SyncBaseProvider] Manual disconnection');
      }
    }
  };

  // Context value
  const contextValue: SyncBaseContextType = {
    client: clientRef.current,
    isConnected,
    isInitialized,
    connectionState,
    clientState,
    metrics,
    error,
    reconnect,
    disconnect,
    getMetrics: () => clientRef.current?.getMetrics() || {},
    getDebugInfo: () => clientRef.current?.getDebugInfo() || {}
  };

  return (
    <SyncBaseContext.Provider value={contextValue}>
      {children}
    </SyncBaseContext.Provider>
  );
}

// Hook to use SyncBase context
export function useSyncBase(): SyncBaseContextType {
  const context = useContext(SyncBaseContext);
  
  if (!context) {
    throw new Error('useSyncBase must be used within a SyncBaseProvider');
  }
  
  return context;
}

// Hook to check if SyncBase is ready
export function useSyncBaseReady(): boolean {
  const { isInitialized, isConnected } = useSyncBase();
  return isInitialized && isConnected;
}

// Hook to get SyncBase client safely
export function useSyncBaseClient(): SyncBaseClient | null {
  const { client, isInitialized } = useSyncBase();
  return isInitialized ? client : null;
}

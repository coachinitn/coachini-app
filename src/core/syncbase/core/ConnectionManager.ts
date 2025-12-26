/**
 * Connection Manager for SyncBase Client
 * Handles WebSocket connections, reconnection, and authentication
 */

import { io, Socket } from 'socket.io-client';
import { EventManager } from './EventManager';
import { 
  AuthConfig, 
  ConnectionOptions, 
  ConnectionState, 
  EventResponse,
  ReconnectStrategy
} from './types';

export class ConnectionManager {
  private socket: Socket | null = null;
  private eventManager: EventManager;
  private config: ConnectionOptions;
  private authConfig: AuthConfig;
  private url: string;
  private connectionState: ConnectionState;
  private reconnectStrategy: ReconnectStrategy;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private isDestroyed: boolean = false;
  private metrics = {
    latency: 0,
    reconnectCount: 0,
    lastHealthCheck: null as Date | null,
    messagesSent: 0,
    messagesReceived: 0,
    errorCount: 0,
    connectionTime: null as Date | null
  };

  constructor(
    url: string,
    authConfig: AuthConfig,
    eventManager: EventManager,
    options: ConnectionOptions = {}
  ) {
    this.url = url;
    this.authConfig = authConfig;
    this.eventManager = eventManager;
    this.config = {
      autoReconnect: true,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      timeout: 30000, // Increased timeout to 30 seconds
      debug: false,
      transports: ['websocket', 'polling'],
      path: '/syncbase/socket.io',
      ...options
    };

    this.connectionState = {
      status: 'disconnected',
      reconnectAttempts: 0
    };

    this.reconnectStrategy = {
      attempt: 0,
      delay: this.config.reconnectInterval!,
      maxAttempts: this.config.maxReconnectAttempts!
    };
  }

  /**
   * Connect to the WebSocket server
   */
  async connect(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error('ConnectionManager has been destroyed');
    }

    if (this.socket?.connected) {
      if (this.config.debug) {
        console.log('[ConnectionManager] Already connected');
      }
      return;
    }

    const tokenResult = this.authConfig.getToken();
    const token = await Promise.resolve(tokenResult);

    if (this.config.debug) {
      console.log('[ConnectionManager] Token retrieval result:', {
        hasTokenResult: !!tokenResult,
        tokenType: typeof tokenResult,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
      });
    }

    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      this.updateConnectionState('connecting');

      if (this.config.debug) {
        console.log(`[ConnectionManager] Connecting to ${this.url}`);
      }

      this.socket = io(this.url, {
        path: this.config.path,
        auth: { token },
        transports: this.config.transports,
        timeout: this.config.timeout,
        reconnection: false, // We handle reconnection manually
      });

      this.setupEventHandlers();

      // Wait for connection or timeout
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, this.config.timeout);

        this.socket!.once('connect', () => {
          clearTimeout(timeout);
          resolve();
        });

        this.socket!.once('connect_error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      this.updateConnectionState('connected');
      this.resetReconnectStrategy();
      this.metrics.connectionTime = new Date();
      this.startHealthMonitoring();

      if (this.config.debug) {
        console.log('[ConnectionManager] Connected successfully');
      }

    } catch (error) {
      this.updateConnectionState('error', error instanceof Error ? error.message : 'Connection failed');
      
      if (this.config.autoReconnect && this.shouldReconnect()) {
        this.scheduleReconnect();
      }
      
      throw error;
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    this.stopHealthMonitoring();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.updateConnectionState('disconnected');

    if (this.config.debug) {
      console.log('[ConnectionManager] Disconnected');
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Send an event to the server
   */
  async sendEvent<T = any>(event: string, payload: any = {}): Promise<EventResponse<T>> {
    if (!this.socket?.connected) {
      this.metrics.errorCount++;
      throw new Error('Not connected to server');
    }

    this.metrics.messagesSent++;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.metrics.errorCount++;
        reject(new Error('Event timeout'));
      }, this.config.timeout);

      this.socket!.emit(event, payload, (response: EventResponse<T>) => {
        clearTimeout(timeout);
        this.metrics.messagesReceived++;

        if (!response.success) {
          this.metrics.errorCount++;
        }

        resolve(response);
      });
    });
  }

  /**
   * Subscribe to server events
   */
  subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.socket) {
      throw new Error('Not connected to server');
    }

    this.socket.on(event, callback);

    // Return unsubscribe function
    return () => {
      if (this.socket) {
        this.socket.off(event, callback);
      }
    };
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Update authentication token
   */
  async updateToken(token: string): Promise<void> {
    if (this.socket?.connected) {
      try {
        await this.sendEvent('auth:update_token', { token });
        
        if (this.config.debug) {
          console.log('[ConnectionManager] Token updated successfully');
        }
      } catch (error) {
        console.error('[ConnectionManager] Failed to update token:', error);
        throw error;
      }
    }
  }

  /**
   * Destroy the connection manager
   */
  destroy(): void {
    this.isDestroyed = true;
    this.stopHealthMonitoring();
    this.disconnect();

    if (this.config.debug) {
      console.log('[ConnectionManager] Connection manager destroyed');
    }
  }

  // Private methods

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.updateConnectionState('connected');
      this.resetReconnectStrategy();

      // Emit both the generic status event and specific connected event (like HTML test)
      this.eventManager.emit('connection:status', { status: 'connected' });
      this.eventManager.emit('connection:connected', {
        socketId: this.socket?.id,
        timestamp: new Date()
      });
    });

    this.socket.on('disconnect', (reason) => {
      this.updateConnectionState('disconnected');

      // Emit both the generic status event and specific disconnected event (like HTML test)
      this.eventManager.emit('connection:status', { status: 'disconnected', reason });
      this.eventManager.emit('connection:disconnected', {
        reason,
        timestamp: new Date()
      });

      if (this.config.autoReconnect && this.shouldReconnect() && reason !== 'io client disconnect') {
        this.scheduleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      this.updateConnectionState('error', error.message);
      this.eventManager.emit('connection:error', { error: error.message });

      if (this.config.autoReconnect && this.shouldReconnect()) {
        this.scheduleReconnect();
      }
    });

    // Handle token refresh requests from server
    this.socket.on('auth:token_refresh_required', async () => {
      if (this.authConfig.refreshToken) {
        try {
          const newToken = await this.authConfig.refreshToken();
          await this.updateToken(newToken);
          
          if (this.authConfig.onTokenRefresh) {
            this.authConfig.onTokenRefresh(newToken);
          }
        } catch (error) {
          console.error('[ConnectionManager] Token refresh failed:', error);
          
          if (this.authConfig.onTokenExpired) {
            this.authConfig.onTokenExpired();
          }
        }
      }
    });
  }

  private updateConnectionState(status: ConnectionState['status'], error?: string): void {
    this.connectionState = {
      ...this.connectionState,
      status,
      error,
      lastConnected: status === 'connected' ? new Date() : this.connectionState.lastConnected
    };
  }

  private shouldReconnect(): boolean {
    return !this.isDestroyed && 
           this.reconnectStrategy.attempt < this.reconnectStrategy.maxAttempts;
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    const delay = this.calculateReconnectDelay();
    
    if (this.config.debug) {
      console.log(`[ConnectionManager] Scheduling reconnect in ${delay}ms (attempt ${this.reconnectStrategy.attempt + 1}/${this.reconnectStrategy.maxAttempts})`);
    }

    this.reconnectTimer = setTimeout(() => {
      this.attemptReconnect();
    }, delay);
  }

  private calculateReconnectDelay(): number {
    // Exponential backoff with jitter
    const baseDelay = this.config.reconnectInterval!;
    const exponentialDelay = baseDelay * Math.pow(2, this.reconnectStrategy.attempt);
    const maxDelay = 30000; // 30 seconds max
    const jitter = Math.random() * 1000; // Add up to 1 second of jitter
    
    return Math.min(exponentialDelay + jitter, maxDelay);
  }

  private async attemptReconnect(): Promise<void> {
    this.reconnectStrategy.attempt++;
    this.connectionState.reconnectAttempts = this.reconnectStrategy.attempt;

    this.eventManager.emit('connection:reconnect', { 
      attempt: this.reconnectStrategy.attempt,
      maxAttempts: this.reconnectStrategy.maxAttempts
    });

    try {
      await this.connect();
    } catch (error) {
      if (this.config.debug) {
        console.log(`[ConnectionManager] Reconnect attempt ${this.reconnectStrategy.attempt} failed:`, error);
      }

      if (this.shouldReconnect()) {
        this.scheduleReconnect();
      } else {
        if (this.config.debug) {
          console.log('[ConnectionManager] Max reconnect attempts reached');
        }
        this.eventManager.emit('connection:error', { 
          error: 'Max reconnect attempts reached',
          maxAttempts: this.reconnectStrategy.maxAttempts
        });
      }
    }
  }

  private resetReconnectStrategy(): void {
    this.reconnectStrategy.attempt = 0;
    this.connectionState.reconnectAttempts = 0;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Start health monitoring
   */
  private startHealthMonitoring(): void {
    // Start ping monitoring for latency
    this.pingInterval = setInterval(() => {
      if (this.socket?.connected) {
        const start = Date.now();
        this.socket.emit('ping', start, () => {
          this.metrics.latency = Date.now() - start;
        });
      }
    }, 5000);

    // Start health checks
    this.healthCheckTimer = setInterval(async () => {
      if (this.socket?.connected) {
        try {
          const start = Date.now();
          await this.sendEvent('syncbase:health');
          this.metrics.latency = Math.min(this.metrics.latency, Date.now() - start);
          this.metrics.lastHealthCheck = new Date();

          if (this.config.debug) {
            console.log('[ConnectionManager] Health check successful, latency:', this.metrics.latency + 'ms');
          }
        } catch (error) {
          this.metrics.errorCount++;
          console.warn('[ConnectionManager] Health check failed:', error);

          if (this.config.debug) {
            console.log('[ConnectionManager] Health check error count:', this.metrics.errorCount);
          }
        }
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Stop health monitoring
   */
  private stopHealthMonitoring(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }

  /**
   * Get connection metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      isConnected: this.socket?.connected || false,
      socketId: this.socket?.id || null,
      connectionUptime: this.metrics.connectionTime
        ? Date.now() - this.metrics.connectionTime.getTime()
        : 0
    };
  }
}

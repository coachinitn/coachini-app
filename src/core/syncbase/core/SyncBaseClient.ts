/**
 * Main SyncBase Client
 * Central client for managing connections, modules, and offline support
 */

import { EventManager } from './EventManager';
import { ConnectionManager } from './ConnectionManager';
import { StorageManager } from './StorageManager';
import { 
  SyncBaseConfig, 
  ConnectionState, 
  EventResponse,
  StorageConfig,
  QueuedOperation,
  SyncBaseError,
  ClientState
} from './types';

export class SyncBaseClient {
  private eventManager: EventManager;
  private connectionManager: ConnectionManager;
  private storageManager: StorageManager | null = null;
  private config: SyncBaseConfig;
  private operationQueue: QueuedOperation[] = [];
  private isProcessingQueue: boolean = false;
  private clientState: ClientState;

  constructor(config: SyncBaseConfig) {
    this.config = config;
    this.eventManager = new EventManager(config.options?.debug || false);
    
    // Initialize connection manager
    this.connectionManager = new ConnectionManager(
      config.url,
      config.auth,
      this.eventManager,
      config.options
    );

    // Initialize client state
    this.clientState = {
      isInitialized: false,
      isConnected: false,
      isAuthenticated: false,
      connectionState: {
        status: 'disconnected',
        reconnectAttempts: 0
      },
      activeSubscriptions: new Map(),
      queuedOperations: [],
      lastActivity: new Date()
    };

    // Initialize storage manager if offline support is enabled
    if (config.options?.offlineSupport) {
      this.initializeStorage();
    }

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Initialize the client
   */
  async initialize(): Promise<void> {
    if (this.clientState.isInitialized) {
      return;
    }

    try {
      // Initialize storage if enabled
      if (this.storageManager) {
        await this.storageManager.initialize();
        await this.loadQueuedOperations();
      }

      // Connect to server
      await this.connectionManager.connect();

      this.clientState.isInitialized = true;
      this.clientState.isConnected = true;
      this.clientState.isAuthenticated = true;

      // Process any queued operations
      if (this.operationQueue.length > 0) {
        this.processOperationQueue();
      }

      this.eventManager.emit('client:initialized', {
        timestamp: new Date(),
        offlineSupport: !!this.storageManager
      });

      if (this.config.options?.debug) {
        console.log('[SyncBaseClient] Client initialized successfully');
      }

    } catch (error) {
      this.clientState.isInitialized = false;
      this.clientState.isConnected = false;
      this.clientState.isAuthenticated = false;

      if (this.config.options?.debug) {
        console.error('[SyncBaseClient] Failed to initialize:', error);
      }

      throw error;
    }
  }

  /**
   * Connect to the server
   */
  async connect(): Promise<void> {
    await this.connectionManager.connect();
    this.clientState.isConnected = true;
  }

  /**
   * Disconnect from the server
   */
  disconnect(): void {
    this.connectionManager.disconnect();
    this.clientState.isConnected = false;
  }

  /**
   * Check if client is connected
   */
  isConnected(): boolean {
    return this.connectionManager.isConnected();
  }

  /**
   * Send an event to the server
   */
  async sendEvent<T = any>(event: string, payload: any = {}): Promise<EventResponse<T>> {
    this.updateLastActivity();

    const isConnected = this.connectionManager.isConnected();
    const offlineSupport = this.config.options?.offlineSupport;

    if (this.config.options?.debug) {
      console.log(`[SyncBaseClient] Sending event ${event}:`, {
        isConnected,
        offlineSupport,
        willQueue: !isConnected && offlineSupport
      });
    }

    // If offline and offline support is enabled, queue the operation
    if (!isConnected && offlineSupport) {
      console.log(`[SyncBaseClient] Operation queued: ${event}`);
      return this.queueOperation(event, payload);
    }

    try {
      return await this.connectionManager.sendEvent<T>(event, payload);
    } catch (error) {
      // If the request fails and offline support is enabled, queue it
      if (this.config.options?.offlineSupport) {
        console.log(`[SyncBaseClient] Event failed, queuing: ${event}`);
        return this.queueOperation(event, payload);
      }
      throw error;
    }
  }

  /**
   * Subscribe to server events
   */
  subscribe(event: string, callback: (data: any) => void): () => void {
    return this.connectionManager.subscribe(event, callback);
  }

  /**
   * Subscribe to client events
   */
  on(event: string, callback: (data: any) => void): () => void {
    return this.eventManager.on(event, callback);
  }

  /**
   * Subscribe to client events once
   */
  once(event: string, callback: (data: any) => void): () => void {
    return this.eventManager.once(event, callback);
  }

  /**
   * Unsubscribe from client events
   */
  off(event: string, callback: (data: any) => void): void {
    this.eventManager.off(event, callback);
  }

  /**
   * Emit client events
   */
  emit(event: string, data?: any): void {
    this.eventManager.emit(event, data);
  }

  /**
   * Get storage manager instance
   */
  getStorage(): StorageManager | null {
    return this.storageManager;
  }

  /**
   * Get connection manager instance
   */
  getConnectionManager(): ConnectionManager {
    return this.connectionManager;
  }

  /**
   * Get connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionManager.getConnectionState();
  }

  /**
   * Get client state
   */
  getClientState(): ClientState {
    return {
      ...this.clientState,
      connectionState: this.getConnectionState(),
      queuedOperations: [...this.operationQueue]
    };
  }

  /**
   * Update authentication token
   */
  async updateToken(token: string): Promise<void> {
    await this.connectionManager.updateToken(token);
    
    if (this.config.auth.onTokenRefresh) {
      this.config.auth.onTokenRefresh(token);
    }
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    if (this.storageManager) {
      const stores = Object.keys(this.config.options?.offlineSupport ? {} : {});
      for (const store of stores) {
        await this.storageManager.clear(store);
      }
    }
  }

  /**
   * Get connection metrics
   */
  getMetrics() {
    return this.connectionManager.getMetrics();
  }

  /**
   * Get debug information
   */
  getDebugInfo(): any {
    return {
      client: this.getClientState(),
      connection: this.getConnectionState(),
      metrics: this.getMetrics(),
      events: this.eventManager.getDebugInfo(),
      storage: this.storageManager ? 'enabled' : 'disabled',
      queuedOperations: this.operationQueue.length,
      config: {
        url: this.config.url,
        options: this.config.options
      }
    };
  }

  /**
   * Destroy the client and clean up resources
   */
  destroy(): void {
    // Clear operation queue processing
    this.isProcessingQueue = false;
    this.operationQueue = [];

    // Disconnect and cleanup connection manager
    this.connectionManager.destroy();

    // Close storage
    if (this.storageManager) {
      this.storageManager.close();
    }

    // Clear all event listeners
    this.eventManager.destroy();

    // Reset client state
    this.clientState = {
      isInitialized: false,
      isConnected: false,
      isAuthenticated: false,
      connectionState: {
        status: 'disconnected',
        reconnectAttempts: 0
      },
      activeSubscriptions: new Map(),
      queuedOperations: [],
      lastActivity: new Date()
    };

    if (this.config.options?.debug) {
      console.log('[SyncBaseClient] Client destroyed');
    }
  }

  // Private methods

  private initializeStorage(): void {
    if (!StorageManager.isAvailable()) {
      console.warn('[SyncBaseClient] IndexedDB not available, offline support disabled');
      return;
    }

    // Use default storage config or custom one
    const storageConfig: StorageConfig = {
      dbName: 'syncbase-cache',
      version: 1,
      stores: {
        notifications: {
          keyPath: 'id',
          indexes: ['cursor', 'isRead', 'createdAt', 'recipientId']
        },
        conversations: {
          keyPath: 'id',
          indexes: ['cursor', 'lastMessageAt', 'createdAt']
        },
        messages: {
          keyPath: 'id',
          indexes: ['cursor', 'conversationId', 'createdAt', 'senderId']
        },
        operations: {
          keyPath: 'id',
          indexes: ['timestamp', 'event']
        }
      }
    };

    this.storageManager = new StorageManager(storageConfig);
  }

  private setupEventListeners(): void {
    // Listen to connection state changes
    this.eventManager.on('connection:status', (data) => {
      this.clientState.isConnected = data.status === 'connected';
      
      if (data.status === 'connected' && this.operationQueue.length > 0) {
        this.processOperationQueue();
      }
    });

    // Listen to connection errors
    this.eventManager.on('connection:error', (data) => {
      this.clientState.isConnected = false;
      
      if (this.config.options?.debug) {
        console.error('[SyncBaseClient] Connection error:', data.error);
      }
    });
  }

  private updateLastActivity(): void {
    this.clientState.lastActivity = new Date();
  }

  /**
   * Queue an operation for later execution
   */
  private async queueOperation<T = any>(event: string, payload: any): Promise<EventResponse<T>> {
    const operation: QueuedOperation = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      event,
      payload,
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: 3
    };

    this.operationQueue.push(operation);
    this.clientState.queuedOperations = [...this.operationQueue];
    this.eventManager.emit('offline:queue_updated', this.operationQueue);

    // Store in persistent storage if available
    if (this.storageManager) {
      try {
        await this.storageManager.set('operations', operation.id, operation);
      } catch (error) {
        console.warn('[SyncBaseClient] Failed to persist queued operation:', error);
      }
    }

    if (this.config.options?.debug) {
      console.log('[SyncBaseClient] Operation queued:', event);
    }

    // Return a pending response
    return {
      success: false,
      error: {
        code: 'QUEUED',
        message: 'Operation queued for when connection is restored'
      }
    };
  }

  /**
   * Process queued operations when connection is restored
   */
  private async processOperationQueue(): Promise<void> {
    if (this.isProcessingQueue || this.operationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    if (this.config.options?.debug) {
      console.log(`[SyncBaseClient] Processing ${this.operationQueue.length} queued operations`);
    }

    const operations = [...this.operationQueue];
    this.operationQueue = [];

    for (const operation of operations) {
      if (!this.connectionManager.isConnected()) {
        // Connection lost during processing, re-queue remaining operations
        this.operationQueue.unshift(operation);
        break;
      }

      try {
        await this.connectionManager.sendEvent(operation.event, operation.payload);

        // Remove from persistent storage if successful
        if (this.storageManager) {
          try {
            await this.storageManager.delete('operations', operation.id);
          } catch (error) {
            console.warn('[SyncBaseClient] Failed to remove processed operation from storage:', error);
          }
        }

        if (this.config.options?.debug) {
          console.log('[SyncBaseClient] Processed queued operation:', operation.event);
        }

      } catch (error) {
        operation.retryCount++;

        if (operation.retryCount < operation.maxRetries) {
          // Re-queue for retry
          this.operationQueue.push(operation);

          if (this.config.options?.debug) {
            console.log(`[SyncBaseClient] Retrying operation ${operation.event} (attempt ${operation.retryCount}/${operation.maxRetries})`);
          }
        } else {
          // Max retries reached, remove from storage
          if (this.storageManager) {
            try {
              await this.storageManager.delete('operations', operation.id);
            } catch (storageError) {
              console.warn('[SyncBaseClient] Failed to remove failed operation from storage:', storageError);
            }
          }

          if (this.config.options?.debug) {
            console.error(`[SyncBaseClient] Operation ${operation.event} failed after ${operation.maxRetries} retries:`, error);
          }

          this.eventManager.emit('offline:operation_failed', {
            operation,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }

    this.clientState.queuedOperations = [...this.operationQueue];
    this.isProcessingQueue = false;

    if (this.operationQueue.length === 0) {
      this.eventManager.emit('offline:sync_completed', {
        timestamp: new Date(),
        processedCount: operations.length
      });
    }
  }

  /**
   * Load queued operations from storage on initialization
   */
  private async loadQueuedOperations(): Promise<void> {
    if (!this.storageManager) {
      return;
    }

    try {
      const operations = await this.storageManager.getMany<QueuedOperation>('operations', {
        limit: 100,
        indexName: 'timestamp'
      });

      this.operationQueue = operations.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      this.clientState.queuedOperations = [...this.operationQueue];

      if (this.config.options?.debug && operations.length > 0) {
        console.log(`[SyncBaseClient] Loaded ${operations.length} queued operations from storage`);
      }

    } catch (error) {
      console.warn('[SyncBaseClient] Failed to load queued operations from storage:', error);
    }
  }
}

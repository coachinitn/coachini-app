/**
 * Storage Manager for SyncBase Client
 * Handles IndexedDB operations for offline support and caching
 */

import { StorageConfig, StorageAdapter } from './types';

export class StorageManager implements StorageAdapter {
  private db: IDBDatabase | null = null;
  private config: StorageConfig;
  private isInitialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor(config: StorageConfig) {
    this.config = config;
  }

  /**
   * Initialize the storage manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.initializeDatabase();
    await this.initPromise;
  }

  /**
   * Get a single item from storage
   */
  async get<T>(store: string, key: string): Promise<T | null> {
    await this.initialize();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(key);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get item from ${store}: ${request.error?.message}`));
      };
    });
  }

  /**
   * Set a single item in storage
   */
  async set<T>(store: string, key: string, value: T): Promise<void> {
    await this.initialize();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.put(value, key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to set item in ${store}: ${request.error?.message}`));
      };
    });
  }

  /**
   * Delete a single item from storage
   */
  async delete(store: string, key: string): Promise<void> {
    await this.initialize();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to delete item from ${store}: ${request.error?.message}`));
      };
    });
  }

  /**
   * Get multiple items from storage
   */
  async getMany<T>(store: string, options: {
    limit?: number;
    indexName?: string;
    range?: IDBKeyRange;
  } = {}): Promise<T[]> {
    await this.initialize();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      
      let source: IDBObjectStore | IDBIndex = objectStore;
      if (options.indexName) {
        source = objectStore.index(options.indexName);
      }

      const request = source.openCursor(options.range);
      const results: T[] = [];
      let count = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        
        if (cursor && (!options.limit || count < options.limit)) {
          results.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => {
        reject(new Error(`Failed to get items from ${store}: ${request.error?.message}`));
      };
    });
  }

  /**
   * Clear all items from a store
   */
  async clear(store: string): Promise<void> {
    await this.initialize();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to clear ${store}: ${request.error?.message}`));
      };
    });
  }

  /**
   * Count items in a store
   */
  async count(store: string): Promise<number> {
    await this.initialize();
    
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to count items in ${store}: ${request.error?.message}`));
      };
    });
  }

  /**
   * Check if storage is available
   */
  static isAvailable(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  }

  /**
   * Get storage usage information
   */
  async getStorageInfo(): Promise<{
    usage: number;
    quota: number;
    stores: Record<string, number>;
  }> {
    const stores: Record<string, number> = {};
    
    for (const storeName of Object.keys(this.config.stores)) {
      try {
        stores[storeName] = await this.count(storeName);
      } catch (error) {
        stores[storeName] = 0;
      }
    }

    let usage = 0;
    let quota = 0;

    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        usage = estimate.usage || 0;
        quota = estimate.quota || 0;
      } catch (error) {
        console.warn('Failed to get storage estimate:', error);
      }
    }

    return { usage, quota, stores };
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
      this.initPromise = null;
    }
  }

  /**
   * Delete the entire database
   */
  static async deleteDatabase(dbName: string): Promise<void> {
    if (!StorageManager.isAvailable()) {
      throw new Error('IndexedDB not available');
    }

    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(dbName);

      deleteRequest.onsuccess = () => {
        resolve();
      };

      deleteRequest.onerror = () => {
        reject(new Error(`Failed to delete database: ${deleteRequest.error?.message}`));
      };

      deleteRequest.onblocked = () => {
        console.warn('Database deletion blocked - close all connections');
      };
    });
  }

  // Private methods

  private async initializeDatabase(): Promise<void> {
    if (!StorageManager.isAvailable()) {
      throw new Error('IndexedDB not available');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.version);

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to open database: ${request.error?.message}`));
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        for (const [storeName, storeConfig] of Object.entries(this.config.stores)) {
          if (!db.objectStoreNames.contains(storeName)) {
            const objectStore = db.createObjectStore(storeName, {
              keyPath: storeConfig.keyPath
            });

            // Create indexes
            for (const indexName of storeConfig.indexes) {
              if (indexName !== storeConfig.keyPath) {
                objectStore.createIndex(indexName, indexName, { unique: false });
              }
            }
          }
        }
      };

      request.onblocked = () => {
        console.warn('Database upgrade blocked - close other connections');
      };
    });
  }
}

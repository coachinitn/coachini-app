/**
 * LocalStorage implementation for client-side storage
 */
import { CookieOptions, StorageResult, EncryptionOptions } from './types';
import { BaseStorageAdapter } from './storageAdapter';

/**
 * LocalStorage adapter for client-side state persistence
 * with optional encryption support
 */
export class LocalStorageAdapter extends BaseStorageAdapter {
  /**
   * Create a new LocalStorageAdapter
   * @param encryptionOptions - Optional encryption configuration
   */
  constructor(encryptionOptions?: Partial<EncryptionOptions>) {
    super(encryptionOptions);
  }

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get a value from localStorage with optional decryption
   * @param key - Storage key
   */
  async get<T>(key: string): Promise<StorageResult<T>> {
    return this.safeExecuteAsync(async () => {
      if (!this.isLocalStorageAvailable()) {
        throw new Error('LocalStorage not available');
      }
      
      const value = localStorage.getItem(key);
      
      if (value === null) {
        return undefined as unknown as T;
      }
      
      return await this.processFromStorage<T>(key, value);
    });
  }

  /**
   * Set a value in localStorage with optional encryption
   * @param key - Storage key
   * @param value - Value to store
   * @param _options - Unused but kept for interface compatibility
   * @param forceEncrypt - Override encryption setting for this operation
   */
  async set<T>(key: string, value: T, _options?: CookieOptions, forceEncrypt?: boolean): Promise<StorageResult<void>> {
    return this.safeExecuteAsync(async () => {
      if (!this.isLocalStorageAvailable()) {
        throw new Error('LocalStorage not available');
      }
      
      const processedValue = await this.processForStorage(key, value, forceEncrypt);
      localStorage.setItem(key, processedValue);
      
      if (this.encryptionOptions.cacheDecryptedValues) {
        this.valueCache.set(key, value);
      }
    });
  }

  /**
   * Remove a value from localStorage
   * @param key - Storage key
   */
  async remove(key: string, _options?: CookieOptions): Promise<StorageResult<void>> {
    return this.safeExecuteAsync(async () => {
      if (!this.isLocalStorageAvailable()) {
        throw new Error('LocalStorage not available');
      }
      
      localStorage.removeItem(key);
      
      if (this.encryptionOptions.cacheDecryptedValues) {
        this.valueCache.delete(key);
      }
    });
  }

  /**
   * Clear all localStorage values
   * Note: This clears all localStorage for the domain, use with caution
   */
  async clear(): Promise<StorageResult<void>> {
    return this.safeExecuteAsync(async () => {
      if (!this.isLocalStorageAvailable()) {
        throw new Error('LocalStorage not available');
      }
      
      localStorage.clear();
      
      this.clearCache();
    });
  }
} 
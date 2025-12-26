/**
 * Abstract storage adapter with common functionality
 */
import { StorageAdapter, StorageResult, CookieOptions, EncryptionOptions } from './types';
import { DEFAULT_ENCRYPTION_OPTIONS } from './storage-config';
import { EncryptionService } from './encryption';

/**
 * Creates a successful result
 */
export const success = <T>(value?: T): StorageResult<T> => ({
  success: true,
  value,
});

/**
 * Creates an error result
 */
export const failure = (error: Error): StorageResult<any> => ({
  success: false,
  error,
});

/**
 * Base adapter class with error handling and encryption support
 */
export abstract class BaseStorageAdapter implements StorageAdapter {
  protected encryption?: EncryptionService;
  protected encryptionOptions: EncryptionOptions;
  protected valueCache: Map<string, any> = new Map();
  
  constructor(encryptionOptions?: Partial<EncryptionOptions>) {
    this.encryptionOptions = {
      ...DEFAULT_ENCRYPTION_OPTIONS,
      ...encryptionOptions
    };
    
    if (this.encryptionOptions.enabled) {
      this.encryption = new EncryptionService(
        this.encryptionOptions.encryptionKey,
        this.encryptionOptions.pbkdf2Iterations
      );
    }
  }

  /**
   * Get a value from storage
   */
  abstract get<T>(key: string): Promise<StorageResult<T>>;

  /**
   * Set a value in storage
   */
  abstract set<T>(key: string, value: T, options?: CookieOptions, forceEncrypt?: boolean): Promise<StorageResult<void>>;

  /**
   * Remove a value from storage
   */
  abstract remove(key: string, options?: CookieOptions): Promise<StorageResult<void>>;

  /**
   * Clear all values
   */
  abstract clear(): Promise<StorageResult<void>>;

  /**
   * Determine if a specific key should be encrypted
   */
  protected shouldEncrypt(key: string, forceEncrypt?: boolean): boolean {
    if (forceEncrypt !== undefined) return forceEncrypt;
    
    if (!this.encryptionOptions.enabled) return false;
    
    if (this.encryptionOptions.shouldEncryptKey) {
      return this.encryptionOptions.shouldEncryptKey(key);
    }
    
    return true;
  }
  
  /**
   * Process value before storage (encrypt if needed)
   */
  protected async processForStorage<T>(key: string, value: T, forceEncrypt?: boolean): Promise<string> {
    let stringValue: string;
    
    if (typeof value === 'string') {
      stringValue = value;
    } else {
      stringValue = JSON.stringify(value);
    }
    
    if (this.shouldEncrypt(key, forceEncrypt) && this.encryptionOptions.enabled) {
      if (!this.encryption) {
        throw new Error('Encryption service not initialized');
      }
      return this.encryption.encrypt(stringValue);
    }
    
    return stringValue; 
  }
  
  /**
   * Process value after retrieval (decrypt if needed)
   */
  protected async processFromStorage<T>(key: string, value: string, forceEncrypt?: boolean): Promise<T> {
    if (this.encryptionOptions.cacheDecryptedValues) {
      const cached = this.valueCache.get(key);
      if (cached !== undefined) {
        return cached as T;
      }
    }
    
    let processedValue: any;
    
    if (this.shouldEncrypt(key, forceEncrypt) && this.encryptionOptions.enabled) {
      try {
        if (!this.encryption) {
          throw new Error('Encryption service not initialized');
        }
        const decrypted = await this.encryption.decrypt(value);
        
        try {
          processedValue = JSON.parse(decrypted);
        } catch (e) {
          processedValue = decrypted;
        }
      } catch (e) {
        try {
          processedValue = JSON.parse(value);
        } catch (e) {
          processedValue = value;
        }
      }
    } else {
      try {
        processedValue = JSON.parse(value);
      } catch (e) {
        processedValue = value;
      }
    }
    
    if (this.encryptionOptions.cacheDecryptedValues) {
      this.valueCache.set(key, processedValue);
    }
    
    return processedValue as T;
  }
  
  /**
   * Clear the value cache
   */
  protected clearCache(): void {
    this.valueCache.clear();
  }

  /**
   * Safely execute an async function and handle errors
   */
  protected async safeExecuteAsync<T>(operation: () => Promise<T>): Promise<StorageResult<T>> {
    try {
      const result = await operation();
      return success(result);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[Storage Error]', error);
      }
      
      return failure(error instanceof Error ? error : new Error(String(error)));
    }
  }
  
  /**
   * Safely execute a function and handle errors (synchronous version)
   */
  protected safeExecute<T>(operation: () => T): StorageResult<T> {
    try {
      const result = operation();
      return success(result);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[Storage Error]', error);
      }
      
      return failure(error instanceof Error ? error : new Error(String(error)));
    }
  }
} 
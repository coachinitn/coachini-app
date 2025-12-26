/**
 * Types for the storage system
 */

/**
 * Cookie options based on js-cookie and next-cookies options
 */
export interface CookieOptions {
  expires?: Date | number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  maxAge?: number;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Storage operation result
 */
export interface StorageResult<T> {
  success: boolean;
  value?: T;
  error?: Error;
}

/**
 * Encryption configuration options
 */
export interface EncryptionOptions {
  enabled: boolean;
  encryptionKey?: string;
  shouldEncryptKey?: (key: string) => boolean;
  cacheDecryptedValues?: boolean;
  pbkdf2Iterations?: number;
}

/**
 * Storage adapter interface - common API for different storage types
 */
export interface StorageAdapter {
  get<T>(key: string): Promise<StorageResult<T>>;
  set<T>(key: string, value: T, options?: CookieOptions, forceEncrypt?: boolean): Promise<StorageResult<void>>;
  remove(key: string, options?: CookieOptions): Promise<StorageResult<void>>;
  clear(): Promise<StorageResult<void>>;
}

/**
 * Generic interface for both cookie and localStorage implementations
 */
export interface Storage {
  cookies: StorageAdapter;
  local: StorageAdapter;
}

/**
 * Server-side request context (for next-cookies)
 */
export interface RequestContext {
  req?: {
    headers: {
      cookie?: string;
    };
  };
  res?: {
    getHeader?: (name: string) => string | string[] | undefined;
    setHeader: (name: string, value: string | string[]) => void;
  };
} 
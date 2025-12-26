/**
 * Storage system with optional encryption
 * Exports unified API for client and server storage with encryption capabilities
 */

export * from './types';
export * from './storage-config';
export * from './encryption';
export * from './storageAdapter';
export * from './localStorage';
export * from './cookies';

import { CookieAdapter } from './cookies';
import { LocalStorageAdapter } from './localStorage';
import { EncryptionOptions, RequestContext, Storage } from './types';
import { 
  SECURE_ENCRYPTION_OPTIONS, 
  BALANCED_ENCRYPTION_OPTIONS 
} from './storage-config';

/**
 * Creates a complete storage system with both cookie and localStorage support
 * with optional encryption
 * 
 * @param requestContext - Server request context for SSR cookie handling
 * @param encryptionOptions - Encryption configuration
 * @returns Storage object with cookies and localStorage adapters
 */
export function createStorage(
  requestContext?: RequestContext,
  encryptionOptions?: Partial<EncryptionOptions>
): Storage {
  return {
    cookies: new CookieAdapter(requestContext, encryptionOptions),
    local: new LocalStorageAdapter(encryptionOptions)
  };
}

/**
 * Creates a secure storage system with encryption enabled by default
 * Configures encryption with strong security defaults
 * 
 * @param requestContext - Server request context for SSR cookie handling
 * @param customOptions - Override default secure encryption options
 * @returns Storage object with encryption enabled
 */
export function createSecureStorage(
  requestContext?: RequestContext,
  customOptions?: Partial<EncryptionOptions>
): Storage {
  const encryptionOptions = {
    ...SECURE_ENCRYPTION_OPTIONS,
    ...customOptions
  };
  
  return createStorage(requestContext, encryptionOptions);
}

/**
 * Creates a balanced storage system with selective encryption
 * Only encrypts sensitive data while maintaining good performance
 * 
 * @param requestContext - Server request context for SSR cookie handling
 * @param customOptions - Override default balanced encryption options
 * @returns Storage object with selective encryption
 */
export function createBalancedStorage(
  requestContext?: RequestContext,
  customOptions?: Partial<EncryptionOptions>
): Storage {
  const encryptionOptions = {
    ...BALANCED_ENCRYPTION_OPTIONS,
    ...customOptions
  };
  
  return createStorage(requestContext, encryptionOptions);
} 
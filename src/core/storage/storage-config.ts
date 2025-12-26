/**
 * Storage configuration options
 */
import { EncryptionOptions, CookieOptions } from './types';

/**
 * Prefix for storage keys to avoid collisions with other applications
 */
export const STORAGE_PREFIX = 'nextapp_';

/**
 * Cookie keys used throughout the application
 */
export const COOKIE_KEYS = {
  AUTH_TOKEN: `${STORAGE_PREFIX}auth_token`,
  REFRESH_TOKEN: `${STORAGE_PREFIX}refresh_token`,
  USER_ID: `${STORAGE_PREFIX}user_id`,
  THEME: `${STORAGE_PREFIX}theme`,
  LOCALE: `${STORAGE_PREFIX}locale`,
  CONSENT: `${STORAGE_PREFIX}cookie_consent`,
};

/**
 * LocalStorage keys used throughout the application
 */
export const LOCAL_STORAGE_KEYS = {
  USER_SETTINGS: `${STORAGE_PREFIX}user_settings`,
  LAST_VISIT: `${STORAGE_PREFIX}last_visit`,
  RECENT_SEARCHES: `${STORAGE_PREFIX}recent_searches`,
  CART_ITEMS: `${STORAGE_PREFIX}cart_items`,
  FORM_DRAFT: `${STORAGE_PREFIX}form_draft`,
};

/**
 * Default cookie options applied to all cookies
 */
export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  // Default cookie expiration: 7 days
  maxAge: 60 * 60 * 24 * 7,
  // Only send cookies over HTTPS in production
  secure: process.env.NODE_ENV === 'production',
  // Restrict cookie access from JavaScript for sensitive cookies
  httpOnly: false,
  // Restrict cookies to same-site requests by default
  sameSite: 'lax',
  // Default path for cookies
  path: '/',
};

/**
 * Secure cookie options for sensitive data like auth tokens
 */
export const SECURE_COOKIE_OPTIONS: CookieOptions = {
  ...DEFAULT_COOKIE_OPTIONS,
  // Prevent JavaScript access for sensitive cookies
  httpOnly: true,
  // Strict same-site policy for auth cookies
  sameSite: 'strict',
};

/**
 * Default encryption options with minimal security
 */
export const DEFAULT_ENCRYPTION_OPTIONS: EncryptionOptions = {
  enabled: false,
  cacheDecryptedValues: true,
  pbkdf2Iterations: 10000,
  // By default, encrypt keys that contain sensitive data
  shouldEncryptKey: (key: string) => {
    const sensitivePatterns = ['token', 'password', 'secret', 'auth', 'user', 'email', 'profile'];
    return sensitivePatterns.some(pattern => key.toLowerCase().includes(pattern));
  }
};

/**
 * Secure encryption options with maximum protection for all data
 */
export const SECURE_ENCRYPTION_OPTIONS: EncryptionOptions = {
  enabled: true,
  cacheDecryptedValues: true,
  pbkdf2Iterations: 100000,
  shouldEncryptKey: () => true,
};

/**
 * Balanced encryption options for good performance while maintaining security
 */
export const BALANCED_ENCRYPTION_OPTIONS: EncryptionOptions = {
  enabled: true,
  cacheDecryptedValues: true,
  pbkdf2Iterations: 10000,
  shouldEncryptKey: (key: string) => {
    const sensitivePatterns = ['token', 'password', 'secret', 'auth', 'user', 'email', 'credit'];
    return sensitivePatterns.some(pattern => key.toLowerCase().includes(pattern));
  },
}; 
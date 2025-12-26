/**
 * Cookie storage implementation
 * Uses js-cookie for client-side and next-cookies for server-side
 * Supports optional encryption for sensitive data
 */
import { CookieOptions, RequestContext, StorageResult, EncryptionOptions } from './types';
import { BaseStorageAdapter } from './storageAdapter';
import { DEFAULT_COOKIE_OPTIONS } from './storage-config';

/**
 * Type definition for js-cookie module
 */
type JsCookieType = {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options?: CookieOptions) => void;
  remove: (name: string, options?: CookieOptions) => void;
};

/**
 * Type definition for next-cookies module
 */
type NextCookiesType = (ctx: RequestContext) => Record<string, string>;

// Dynamic imports to handle server/client environments
let JsCookie: JsCookieType | null = null;
let NextCookies: NextCookiesType | null = null;

if (typeof window !== 'undefined') {
  import('js-cookie' as any)
    .then((module) => {
      JsCookie = module.default;
    })
    .catch((err) => {
      console.error('Error importing js-cookie:', err);
    });
}

if (typeof window === 'undefined') {
  import('next-cookies' as any)
    .then((module) => {
      NextCookies = module.default;
    })
    .catch((err) => {
      console.error('Error importing next-cookies:', err);
    });
}

/**
 * Cookie storage adapter that works on both client and server
 * With optional encryption support
 */
export class CookieAdapter extends BaseStorageAdapter {
  private context?: RequestContext;

  /**
   * Create a new CookieAdapter
   * @param context - Server request context (for SSR)
   * @param encryptionOptions - Optional encryption configuration
   */
  constructor(context?: RequestContext, encryptionOptions?: Partial<EncryptionOptions>) {
    super(encryptionOptions);
    this.context = context;
  }

  /**
   * Check if we're in a browser environment
   */
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Get a cookie value with optional decryption
   * @param key - Cookie name
   */
  async get<T>(key: string): Promise<StorageResult<T>> {
    return this.safeExecuteAsync(async () => {
      if (this.isClient()) {
        if (!JsCookie) {
          throw new Error('js-cookie not loaded yet');
        }
        
        const value = JsCookie.get(key);
        if (value === undefined) {
          return undefined as unknown as T;
        }
        
        return await this.processFromStorage<T>(key, value);
      } else {
        if (!NextCookies) {
          throw new Error('next-cookies not loaded yet');
        }
        
        if (!this.context) {
          throw new Error('Context required for server-side cookie access');
        }
        
        const cookies = NextCookies(this.context);
        const value = cookies[key];
        
        if (value === undefined) {
          return undefined as unknown as T;
        }
        
        return await this.processFromStorage<T>(key, value);
      }
    });
  }

  /**
   * Set a cookie with optional encryption
   * @param key - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options
   * @param forceEncrypt - Override encryption setting for this operation
   */
  async set<T>(key: string, value: T, options?: CookieOptions, forceEncrypt?: boolean): Promise<StorageResult<void>> {
    return this.safeExecuteAsync(async () => {
      const processedValue = await this.processForStorage(key, value, forceEncrypt);
      const mergedOptions = { ...DEFAULT_COOKIE_OPTIONS, ...options };
      
      if (this.isClient()) {
        if (!JsCookie) {
          throw new Error('js-cookie not loaded yet');
        }
        
        JsCookie.set(key, processedValue, mergedOptions);
        
        if (this.encryptionOptions.cacheDecryptedValues) {
          this.valueCache.set(key, value);
        }
      } else {
        if (!this.context?.res) {
          throw new Error('Response object required for server-side cookie setting');
        }
        
        const cookieOptions = this.formatCookieOptions(mergedOptions);
        const cookieValue = `${key}=${encodeURIComponent(processedValue)}; ${cookieOptions}`;
        
        const existingCookies = this.context.res.getHeader?.('Set-Cookie') || [];
        const cookieArray = Array.isArray(existingCookies) 
          ? existingCookies 
          : [existingCookies as string];
          
        this.context.res.setHeader('Set-Cookie', [...cookieArray, cookieValue]);
      }
    });
  }

  /**
   * Remove a cookie
   * @param key - Cookie name
   * @param options - Cookie options
   */
  async remove(key: string, options?: CookieOptions): Promise<StorageResult<void>> {
    return this.safeExecuteAsync(async () => {
      const mergedOptions = { ...DEFAULT_COOKIE_OPTIONS, ...options };
      
      if (this.encryptionOptions.cacheDecryptedValues) {
        this.valueCache.delete(key);
      }
      
      if (this.isClient()) {
        if (!JsCookie) {
          throw new Error('js-cookie not loaded yet');
        }
        
        JsCookie.remove(key, mergedOptions);
      } else {
        if (!this.context?.res) {
          throw new Error('Response object required for server-side cookie removal');
        }
        
        const expiredOptions = {
          ...mergedOptions,
          expires: new Date(0),
        };
        
        const cookieOptions = this.formatCookieOptions(expiredOptions);
        const cookieValue = `${key}=; ${cookieOptions}`;
        
        const existingCookies = this.context.res.getHeader?.('Set-Cookie') || [];
        const cookieArray = Array.isArray(existingCookies) 
          ? existingCookies 
          : [existingCookies as string];
          
        this.context.res.setHeader('Set-Cookie', [...cookieArray, cookieValue]);
      }
    });
  }

  /**
   * Clear all cookies (only those accessible by JavaScript)
   * Note: This is limited by browser security - can only clear cookies 
   * accessible to JavaScript from current domain
   */
  async clear(): Promise<StorageResult<void>> {
    return this.safeExecuteAsync(async () => {
      if (this.isClient()) {
        const cookies = document.cookie.split(';');
        
        for (const cookie of cookies) {
          const [name] = cookie.trim().split('=');
          await this.remove(name);
        }
        
        this.clearCache();
      } else {
        throw new Error('Clearing all cookies not supported on server');
      }
    });
  }

  /**
   * Format cookie options into a string for Set-Cookie header
   * @param options - Cookie options
   */
  private formatCookieOptions(options: CookieOptions): string {
    const parts: string[] = [];
    
    if (options.path) {
      parts.push(`Path=${options.path}`);
    }
    
    if (options.domain) {
      parts.push(`Domain=${options.domain}`);
    }
    
    if (options.expires) {
      const expiresValue = typeof options.expires === 'number'
        ? new Date(Date.now() + options.expires * 1000).toUTCString()
        : options.expires.toUTCString();
      
      parts.push(`Expires=${expiresValue}`);
    } else if (options.maxAge !== undefined) {
      parts.push(`Max-Age=${options.maxAge}`);
    }
    
    if (options.secure) {
      parts.push('Secure');
    }
    
    if (options.httpOnly) {
      parts.push('HttpOnly');
    }
    
    if (options.sameSite) {
      parts.push(`SameSite=${options.sameSite}`);
    }
    
    return parts.join('; ');
  }
} 
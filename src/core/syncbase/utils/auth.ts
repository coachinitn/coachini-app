/**
 * Authentication utilities for SyncBase Client
 */

import { jsonLocalStorage, jsonSessionStorage } from './storage';

// Token information interface
export interface TokenInfo {
  token: string;
  expiresAt: number;
  issuedAt: number;
  userId?: string;
  username?: string;
  roles?: string[];
  permissions?: string[];
}

/**
 * Parse JWT token
 */
export function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token: string): number | null {
  const payload = parseJWT(token);
  return payload?.exp ? payload.exp * 1000 : null; // Convert to milliseconds
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  return Date.now() >= expiration;
}

/**
 * Get user info from token
 */
export function getUserInfoFromToken(token: string): {
  userId?: string;
  username?: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
} | null {
  const payload = parseJWT(token);
  if (!payload) return null;

  // ✅ IMPROVED: Try multiple possible user ID fields (like HTML test)
  const userId = payload.sub || payload.userId || payload.id || payload.user_id;

  return {
    userId,
    username: payload.username || payload.preferred_username || payload.name,
    email: payload.email,
    roles: payload.roles || (payload.role ? [payload.role] : []),
    permissions: payload.permissions || []
  };
}

/**
 * Create token info from JWT
 */
export function createTokenInfoFromJWT(token: string): TokenInfo | null {
  const payload = parseJWT(token);
  if (!payload) return null;

  const userInfo = getUserInfoFromToken(token);
  const expiresAt = getTokenExpiration(token);
  
  if (!expiresAt) return null;

  return {
    token,
    expiresAt,
    issuedAt: payload.iat ? payload.iat * 1000 : Date.now(),
    userId: userInfo?.userId,
    username: userInfo?.username,
    roles: userInfo?.roles,
    permissions: userInfo?.permissions
  };
}

/**
 * Token Manager class
 */
export class TokenManager {
  private storageKey: string;
  private useSessionStorage: boolean;

  constructor(storageKey: string = 'syncbase-token', useSessionStorage: boolean = false) {
    this.storageKey = storageKey;
    this.useSessionStorage = useSessionStorage;
  }

  /**
   * Get storage adapter
   */
  private getStorage() {
    return this.useSessionStorage ? jsonSessionStorage : jsonLocalStorage;
  }

  /**
   * Store token
   */
  setToken(token: string): boolean {
    const tokenInfo = createTokenInfoFromJWT(token);
    if (!tokenInfo) return false;

    return this.getStorage().setItem(this.storageKey, tokenInfo);
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    const tokenInfo = this.getStorage().getItem<TokenInfo>(this.storageKey);
    if (!tokenInfo) return null;

    // Check if token is expired
    if (this.isTokenExpired(tokenInfo.token)) {
      this.removeToken();
      return null;
    }

    return tokenInfo.token;
  }

  /**
   * Get token info
   */
  getTokenInfo(): TokenInfo | null {
    const tokenInfo = this.getStorage().getItem<TokenInfo>(this.storageKey);
    if (!tokenInfo) return null;

    // Check if token is expired
    if (this.isTokenExpired(tokenInfo.token)) {
      this.removeToken();
      return null;
    }

    return tokenInfo;
  }

  /**
   * Remove token
   */
  removeToken(): boolean {
    return this.getStorage().removeItem(this.storageKey);
  }

  /**
   * Check if token exists and is valid
   */
  hasValidToken(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    return isTokenExpired(token);
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiration(): number | null {
    const tokenInfo = this.getTokenInfo();
    if (!tokenInfo) return null;

    return Math.max(0, tokenInfo.expiresAt - Date.now());
  }

  /**
   * Check if token will expire soon
   */
  willExpireSoon(thresholdMinutes: number = 5): boolean {
    const timeUntilExpiration = this.getTimeUntilExpiration();
    if (timeUntilExpiration === null) return true;

    const thresholdMs = thresholdMinutes * 60 * 1000;
    return timeUntilExpiration <= thresholdMs;
  }

  /**
   * Get user info from stored token with improved reliability
   */
  getUserInfo(): {
    userId?: string;
    username?: string;
    roles?: string[];
    permissions?: string[];
  } | null {
    try {
      const tokenInfo = this.getTokenInfo();
      if (!tokenInfo) {
        console.warn('[TokenManager] No token info available');
        return null;
      }

      // ✅ IMPROVED: Ensure we have a valid user ID
      const userId = tokenInfo.userId || tokenInfo.id || tokenInfo.sub;
      if (!userId) {
        console.warn('[TokenManager] No user ID found in token info');
        return null;
      }

      return {
        userId,
        username: tokenInfo.username,
        roles: tokenInfo.roles || [],
        permissions: tokenInfo.permissions || []
      };
    } catch (error) {
      console.error('[TokenManager] Error getting user info:', error);
      return null;
    }
  }

  /**
   * Clear all stored data
   */
  clear(): boolean {
    return this.removeToken();
  }
}

/**
 * Default token manager instance
 */
export const defaultTokenManager = new TokenManager();

/**
 * Auth helper functions
 */
export const authHelpers = {
  /**
   * Create auth config for SyncBase client
   */
  createAuthConfig: (tokenManager: TokenManager = defaultTokenManager) => ({
    getToken: () => tokenManager.getToken(),
    refreshToken: async () => {
      // This should be implemented based on your auth system
      // For now, return the current token
      const token = tokenManager.getToken();
      if (!token) {
        throw new Error('No token available for refresh');
      }
      return token;
    },
    onTokenExpired: () => {
      tokenManager.removeToken();
      // You might want to redirect to login or emit an event here
      console.warn('[AuthHelpers] Token expired, removed from storage');
    },
    onTokenRefresh: (newToken: string) => {
      tokenManager.setToken(newToken);
      console.log('[AuthHelpers] Token refreshed and stored');
    }
  }),

  /**
   * Check if user has permission
   */
  hasPermission: (permission: string, tokenManager: TokenManager = defaultTokenManager): boolean => {
    const userInfo = tokenManager.getUserInfo();
    return userInfo?.permissions?.includes(permission) || false;
  },

  /**
   * Check if user has role
   */
  hasRole: (role: string, tokenManager: TokenManager = defaultTokenManager): boolean => {
    const userInfo = tokenManager.getUserInfo();
    return userInfo?.roles?.includes(role) || false;
  },

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole: (roles: string[], tokenManager: TokenManager = defaultTokenManager): boolean => {
    const userInfo = tokenManager.getUserInfo();
    if (!userInfo?.roles) return false;
    return roles.some(role => userInfo.roles!.includes(role));
  },

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions: (permissions: string[], tokenManager: TokenManager = defaultTokenManager): boolean => {
    const userInfo = tokenManager.getUserInfo();
    if (!userInfo?.permissions) return false;
    return permissions.every(permission => userInfo.permissions!.includes(permission));
  },

  /**
   * Get current user ID with improved reliability
   * ✅ FIXED: Try NextAuth session first, then fallback to token manager
   */
  getCurrentUserId: (tokenManager: TokenManager = defaultTokenManager): string | null => {
    try {
      // ✅ FIRST: Try to get user ID from NextAuth session (client-side)
      if (typeof window !== 'undefined') {
        // Check if we have access to NextAuth session data
        const nextAuthSession = (window as any).__NEXT_DATA__?.props?.pageProps?.session;
        if (nextAuthSession?.user?.id) {
          console.log('[AuthHelpers] Got user ID from NextAuth session:', nextAuthSession.user.id);
          return nextAuthSession.user.id;
        }

        // Try to get from sessionStorage (where NextAuth might store it)
        try {
          const sessionData = sessionStorage.getItem('next-auth.session-token') ||
                             sessionStorage.getItem('__Secure-next-auth.session-token') ||
                             localStorage.getItem('next-auth.session-token');
          if (sessionData) {
            // Parse JWT if it's a token
            const payload = parseJWT(sessionData);
            if (payload?.sub || payload?.id || payload?.userId) {
              const userId = payload.sub || payload.id || payload.userId;
              console.log('[AuthHelpers] Got user ID from NextAuth token:', userId);
              return userId;
            }
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }

      // ✅ FALLBACK: Try token manager (original logic)
      const userInfo = tokenManager.getUserInfo();
      if (!userInfo) {
        console.warn('[AuthHelpers] No user info available from token manager or NextAuth');
        return null;
      }

      // Try multiple possible user ID fields (like HTML test does)
      const userId = userInfo.userId || userInfo.id || userInfo.sub;
      if (!userId) {
        console.warn('[AuthHelpers] No user ID found in token info:', userInfo);
        return null;
      }

      console.log('[AuthHelpers] Got user ID from token manager:', userId);
      return userId;
    } catch (error) {
      console.error('[AuthHelpers] Error getting current user ID:', error);
      return null;
    }
  },

  /**
   * Get current username
   */
  getCurrentUsername: (tokenManager: TokenManager = defaultTokenManager): string | null => {
    // ✅ IMPROVED: Try NextAuth session first
    if (typeof window !== 'undefined') {
      const nextAuthSession = (window as any).__NEXT_DATA__?.props?.pageProps?.session;
      if (nextAuthSession?.user?.name || nextAuthSession?.user?.username) {
        return nextAuthSession.user.name || nextAuthSession.user.username;
      }
    }

    // Fallback to token manager
    const userInfo = tokenManager.getUserInfo();
    return userInfo?.username || null;
  },

  /**
   * ✅ NEW: Get current user ID from NextAuth session (React hook version)
   * This should be used in React components where useSession is available
   */
  getCurrentUserIdFromSession: (session: any): string | null => {
    if (!session?.user) {
      console.warn('[AuthHelpers] No session or user data available');
      return null;
    }

    const userId = session.user.id || session.user.sub || session.user.userId;
    if (!userId) {
      console.warn('[AuthHelpers] No user ID found in session:', session.user);
      return null;
    }

    return userId;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (tokenManager: TokenManager = defaultTokenManager): boolean => {
    return tokenManager.hasValidToken();
  },

  /**
   * Format token expiration time
   */
  formatTokenExpiration: (tokenManager: TokenManager = defaultTokenManager): string | null => {
    const timeUntilExpiration = tokenManager.getTimeUntilExpiration();
    if (timeUntilExpiration === null) return null;

    const minutes = Math.floor(timeUntilExpiration / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return 'Less than a minute';
    }
  }
};

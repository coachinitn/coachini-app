/**
 * RBAC Performance Optimization with Caching
 * 
 * Implements caching for expensive RBAC operations
 */

import { Role, Permission } from '../redux/features/user/slice';
import { NavigationItem } from './config';
import { createPermissionChecker, expandPermissions } from './permissions';

// ==================== CACHE TYPES ====================

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface PermissionCache {
  expandedPermissions: Map<string, CacheEntry<Permission[]>>;
  navigationItems: Map<string, CacheEntry<NavigationItem[]>>;
  pageAccess: Map<string, CacheEntry<boolean>>;
  permissionCheckers: Map<string, CacheEntry<ReturnType<typeof createPermissionChecker>>>;
}

// ==================== CACHE IMPLEMENTATION ====================

class RBACCache {
  private cache: PermissionCache;
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes
  private maxCacheSize: number = 1000;

  constructor() {
    this.cache = {
      expandedPermissions: new Map(),
      navigationItems: new Map(),
      pageAccess: new Map(),
      permissionCheckers: new Map(),
    };
  }

  /**
   * Generate cache key from roles and permissions
   */
  private generateKey(roles: Role[], permissions?: Permission[]): string {
    const roleKey = roles.sort().join(',');
    const permKey = permissions ? permissions.sort().join(',') : '';
    return `${roleKey}:${permKey}`;
  }

  /**
   * Check if cache entry is valid
   */
  private isValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Clean expired entries from a cache map
   */
  private cleanExpired<T>(cacheMap: Map<string, CacheEntry<T>>): void {
    const now = Date.now();
    for (const [key, entry] of cacheMap.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        cacheMap.delete(key);
      }
    }
  }

  /**
   * Ensure cache doesn't exceed max size
   */
  private enforceMaxSize<T>(cacheMap: Map<string, CacheEntry<T>>): void {
    if (cacheMap.size > this.maxCacheSize) {
      // Remove oldest entries
      const entries = Array.from(cacheMap.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = entries.slice(0, entries.length - this.maxCacheSize);
      toRemove.forEach(([key]) => cacheMap.delete(key));
    }
  }

  /**
   * Set cache entry
   */
  private set<T>(
    cacheMap: Map<string, CacheEntry<T>>, 
    key: string, 
    value: T, 
    ttl: number = this.defaultTTL
  ): void {
    cacheMap.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });
    
    // Periodic cleanup
    if (Math.random() < 0.1) { // 10% chance
      this.cleanExpired(cacheMap);
      this.enforceMaxSize(cacheMap);
    }
  }

  /**
   * Get cache entry
   */
  private get<T>(cacheMap: Map<string, CacheEntry<T>>, key: string): T | null {
    const entry = cacheMap.get(key);
    if (!entry || !this.isValid(entry)) {
      if (entry) cacheMap.delete(key);
      return null;
    }
    return entry.value;
  }

  // ==================== PUBLIC CACHE METHODS ====================

  /**
   * Cache expanded permissions
   */
  setExpandedPermissions(roles: Role[], permissions: Permission[], expanded: Permission[]): void {
    const key = this.generateKey(roles, permissions);
    this.set(this.cache.expandedPermissions, key, expanded);
  }

  getExpandedPermissions(roles: Role[], permissions: Permission[]): Permission[] | null {
    const key = this.generateKey(roles, permissions);
    return this.get(this.cache.expandedPermissions, key);
  }

  /**
   * Cache navigation items
   */
  setNavigationItems(roles: Role[], currentRole: Role | null, items: NavigationItem[]): void {
    const key = `${this.generateKey(roles)}:${currentRole || 'null'}`;
    this.set(this.cache.navigationItems, key, items);
  }

  getNavigationItems(roles: Role[], currentRole: Role | null): NavigationItem[] | null {
    const key = `${this.generateKey(roles)}:${currentRole || 'null'}`;
    return this.get(this.cache.navigationItems, key);
  }

  /**
   * Cache page access results
   */
  setPageAccess(roles: Role[], currentRole: Role | null, path: string, canAccess: boolean): void {
    const key = `${this.generateKey(roles)}:${currentRole || 'null'}:${path}`;
    this.set(this.cache.pageAccess, key, canAccess);
  }

  getPageAccess(roles: Role[], currentRole: Role | null, path: string): boolean | null {
    const key = `${this.generateKey(roles)}:${currentRole || 'null'}:${path}`;
    return this.get(this.cache.pageAccess, key);
  }

  /**
   * Cache permission checkers
   */
  setPermissionChecker(permissions: Permission[], checker: ReturnType<typeof createPermissionChecker>): void {
    const key = permissions.sort().join(',');
    this.set(this.cache.permissionCheckers, key, checker, this.defaultTTL * 2); // Longer TTL for checkers
  }

  getPermissionChecker(permissions: Permission[]): ReturnType<typeof createPermissionChecker> | null {
    const key = permissions.sort().join(',');
    return this.get(this.cache.permissionCheckers, key);
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.cache.expandedPermissions.clear();
    this.cache.navigationItems.clear();
    this.cache.pageAccess.clear();
    this.cache.permissionCheckers.clear();
  }

  /**
   * Clear specific cache type
   */
  clearCache(type: keyof PermissionCache): void {
    this.cache[type].clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      expandedPermissions: this.cache.expandedPermissions.size,
      navigationItems: this.cache.navigationItems.size,
      pageAccess: this.cache.pageAccess.size,
      permissionCheckers: this.cache.permissionCheckers.size,
      total: Object.values(this.cache).reduce((sum, map) => sum + map.size, 0),
    };
  }

  /**
   * Configure cache settings
   */
  configure(options: { defaultTTL?: number; maxCacheSize?: number }): void {
    if (options.defaultTTL) this.defaultTTL = options.defaultTTL;
    if (options.maxCacheSize) this.maxCacheSize = options.maxCacheSize;
  }
}

// ==================== SINGLETON INSTANCE ====================

export const rbacCache = new RBACCache();

// ==================== CACHED UTILITY FUNCTIONS ====================

/**
 * Cached version of expandPermissions
 */
export const cachedExpandPermissions = (roles: Role[], permissions: Permission[]): Permission[] => {
  const cached = rbacCache.getExpandedPermissions(roles, permissions);
  if (cached) return cached;
  
  const expanded = expandPermissions(permissions);
  rbacCache.setExpandedPermissions(roles, permissions, expanded);
  return expanded;
};

/**
 * Cached permission checker factory
 */
export const cachedCreatePermissionChecker = (permissions: Permission[]) => {
  const cached = rbacCache.getPermissionChecker(permissions);
  if (cached) return cached;
  
  const checker = createPermissionChecker(permissions);
  rbacCache.setPermissionChecker(permissions, checker);
  return checker;
};

// ==================== CACHE WARMING ====================

/**
 * Pre-warm cache with common permission combinations
 */
export const warmCache = () => {
  const commonRoleCombinations = [
    [Role.USER],
    [Role.COACHEE],
    [Role.COACH],
    [Role.SUPERVISOR],
    [Role.ADMIN],
    [Role.USER, Role.COACHEE],
    [Role.COACH, Role.SUPERVISOR],
    [Role.SUPERVISOR, Role.ADMIN],
  ];

  const commonPermissions = [
    [Permission.VIEW_DASHBOARD],
    [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE],
    [Permission.VIEW_THEMES, Permission.MANAGE_THEMES],
    [Permission.VIEW_TEAMS, Permission.MANAGE_TEAMS],
    [Permission.VIEW_REQUESTS, Permission.MANAGE_REQUESTS],
  ];

  // Pre-compute common combinations
  commonRoleCombinations.forEach(roles => {
    commonPermissions.forEach(permissions => {
      cachedExpandPermissions(roles, permissions);
      cachedCreatePermissionChecker(permissions);
    });
  });
};

export default rbacCache;

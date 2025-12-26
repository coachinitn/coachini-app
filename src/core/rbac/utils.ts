/**
 * RBAC Utility Functions
 *
 * Comprehensive utility functions for role-based access control
 */

import { Role, Permission, rolePermissions } from '../redux/features/user/slice';
import {
  navigationConfig,
  roleHierarchy,
  getRolePriority,
  PermissionScope,
  contextPermissions,
  NavigationItem
} from './config';

// ==================== PERMISSION CHECKING ====================

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role: Role | null, permission: Permission): boolean => {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) || false;
};

/**
 * Check if user with given roles has at least one role with a specific permission
 */
export const userHasPermission = (roles: Role[], permission: Permission): boolean => {
  if (!roles || roles.length === 0) return false;
  return roles.some(role => hasPermission(role, permission));
};

/**
 * Check if user has permission with specific context/scope
 */
export const userHasContextPermission = (
  roles: Role[],
  permission: Permission,
  scope: PermissionScope = PermissionScope.GLOBAL,
  resourceId?: string
): boolean => {
  if (!roles || roles.length === 0) return false;

  return roles.some(role => {
    const roleContextPerms = contextPermissions[role] || [];
    return roleContextPerms.some(contextPerm =>
      contextPerm.permission === permission &&
      contextPerm.scope === scope &&
      (!resourceId || contextPerm.resourceId === resourceId)
    );
  });
};

/**
 * Get all permissions for given roles
 */
export const getAllPermissionsForRoles = (roles: Role[]): Permission[] => {
  if (!roles || roles.length === 0) return [];

  const allPermissions = new Set<Permission>();
  roles.forEach(role => {
    const permissions = rolePermissions[role] || [];
    permissions.forEach(permission => allPermissions.add(permission));
  });

  return Array.from(allPermissions);
};

/**
 * Get highest priority role from a list of roles
 */
export const getHighestRole = (roles: Role[]): Role | null => {
  if (!roles || roles.length === 0) return null;

  let highestRole = roles[0];
  let highestPriority = getRolePriority(highestRole);

  roles.forEach(role => {
    const priority = getRolePriority(role);
    if (priority > highestPriority) {
      highestRole = role;
      highestPriority = priority;
    }
  });

  return highestRole;
};

// ==================== PAGE ACCESS CONTROL ====================

/**
 * Cache for compiled path patterns to improve performance
 */
const pathPatternCache = new Map<string, RegExp>();

/**
 * Convert a path pattern to a RegExp
 * Supports:
 * - Wildcards: /dashboard/requests/* matches /dashboard/requests/anything
 * - Double wildcards: /dashboard/** matches /dashboard/anything/nested
 * - Named parameters: /dashboard/requests/:id matches /dashboard/requests/123
 * - Optional segments: /dashboard/requests/:id? matches /dashboard/requests and /dashboard/requests/123
 * - Exact patterns: /dashboard/requests (no wildcards)
 */
const compilePathPattern = (pattern: string): RegExp => {
  if (pathPatternCache.has(pattern)) {
    return pathPatternCache.get(pattern)!;
  }

  let regexPattern = pattern
    // Escape special regex characters except our wildcards
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    // Handle double wildcards /** (matches any nested path)
    .replace(/\/\*\*/g, '(?:/.*)?')
    // Handle single wildcards /* (matches one segment)
    .replace(/\/\*/g, '/[^/]*')
    // Handle named parameters /:param
    .replace(/\/:([^/?]+)/g, '/[^/]+')
    // Handle optional parameters /:param?
    .replace(/\/:([^/?]+)\?/g, '(?:/[^/]+)?')
    // Handle trailing optional slash
    .replace(/\/$/, '/?');

  // Ensure exact match from start to end
  regexPattern = `^${regexPattern}$`;

  const regex = new RegExp(regexPattern);
  pathPatternCache.set(pattern, regex);
  return regex;
};

/**
 * Check if a path matches a pattern (with wildcard support)
 */
const matchesPathPattern = (path: string, pattern: string): boolean => {
  // Simple exact match optimization
  if (pattern === path) return true;

  // If no wildcards or parameters, use simple string comparison
  if (!pattern.includes('*') && !pattern.includes(':')) {
    return pattern === path;
  }

  // Use compiled regex for complex patterns
  const regex = compilePathPattern(pattern);
  return regex.test(path);
};

/**
 * Get navigation item that matches a page path (including sub-paths with wildcard support)
 */
export const getNavigationItemForPath = (pagePath: string): NavigationItem | undefined => {
  return navigationConfig.find(item => {
    // Exact match
    if (item.href === pagePath) return true;

    // Check if it's an exact match only item
    if (item.exactMatch) return item.href === pagePath;

    // Check sub-paths with pattern matching
    if (item.subPaths) {
      for (const subPath of item.subPaths) {
        if (matchesPathPattern(pagePath, subPath)) {
          return true;
        }
      }
    }

    // Check if path starts with the navigation item path (for nested routes)
    if (!item.exactMatch && pagePath.startsWith(item.href + '/')) return true;

    return false;
  });
};

/**
 * Check if user can access a specific page using navigationConfig
 */
export const canAccessPage = (
  userRoles: Role[],
  currentRole: Role | null,
  pagePath: string
): { canAccess: boolean; navigationItem?: NavigationItem; fallbackPath?: string } => {
  const navigationItem = getNavigationItemForPath(pagePath);

  if (!navigationItem) {
    // If no navigation rule is defined, deny access by default for security
    return {
      canAccess: false,
      fallbackPath: '/dashboard'
    };
  }

  // Check if current role is allowed
  const hasRoleAccess = currentRole && navigationItem.allowedRoles.includes(currentRole);

  // Check if user has any of the allowed roles
  const hasAnyAllowedRole = userRoles.some(role => navigationItem.allowedRoles.includes(role));

  // Check required permissions if specified
  let hasRequiredPermissions = true;
  if (navigationItem.requiredPermissions && navigationItem.requiredPermissions.length > 0) {
    hasRequiredPermissions = navigationItem.requiredPermissions.every(permission =>
      userHasPermission(userRoles, permission)
    );
  }

  const canAccess = (hasRoleAccess || hasAnyAllowedRole) && hasRequiredPermissions;

  return {
    canAccess,
    navigationItem,
    fallbackPath: navigationItem.fallbackPath || '/dashboard'
  };
};

/**
 * Get all accessible pages for user roles (derived from navigationConfig)
 */
export const getAccessiblePages = (userRoles: Role[], currentRole: Role | null): NavigationItem[] => {
  return navigationConfig.filter(item => {
    const { canAccess } = canAccessPage(userRoles, currentRole, item.href);
    return canAccess;
  });
};

// ==================== NAVIGATION FILTERING ====================

/**
 * Get the effective order for a navigation item based on current role
 */
const getEffectiveOrder = (item: NavigationItem, currentRole: Role | null): number => {
  // If there's a role-specific order for the current role, use it
  if (currentRole && item.roleSpecificOrder?.[currentRole] !== undefined) {
    return item.roleSpecificOrder[currentRole]!;
  }

  // Otherwise use the global order, or default based on config source
  if (item.order !== undefined) {
    return item.order;
  }

  // Default ordering based on logical grouping
  // Dashboard items: 0-99, User items: 100-199, Admin items: 200-299
  const href = item.href;
  if (href === '/dashboard') return 1; // Dashboard always first
  if (href === '/dashboard/profile') return 98; // Profile near end of user section
  if (href.startsWith('/dashboard/themes')) return 10;
  if (href.startsWith('/dashboard/reports')) return 200; // Admin section
  if (href.startsWith('/dashboard/requests')) return 210;
  if (href.startsWith('/dashboard/users')) return 220;
  if (href.startsWith('/dashboard/user-acc')) return 230;

  // Fallback for unknown items
  return 999;
};

/**
 * Sort navigation items by their effective order
 */
const sortNavigationItems = (items: NavigationItem[], currentRole: Role | null): NavigationItem[] => {
  return [...items].sort((a, b) => {
    const orderA = getEffectiveOrder(a, currentRole);
    const orderB = getEffectiveOrder(b, currentRole);

    // Primary sort by order
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Secondary sort by name for consistent ordering
    return a.name.localeCompare(b.name);
  });
};

/**
 * Filter navigation items based on user roles and permissions
 * Only returns items that should be shown in the sidebar navigation
 */
export const filterNavigationItems = (
  userRoles: Role[],
  currentRole: Role | null
): NavigationItem[] => {
  const filteredItems = navigationConfig.filter(item => {
    // Skip items that shouldn't show in navigation
    if (item.showInNavigation === undefined || item.showInNavigation === false) {
			return false;
		}

    // Check if current role is allowed
    const hasRoleAccess = currentRole && item.allowedRoles.includes(currentRole);

    // Check if user has any of the allowed roles
    const hasAnyAllowedRole = userRoles.some(role => item.allowedRoles.includes(role));

    // Check required permissions if specified
    let hasRequiredPermissions = true;
    if (item.requiredPermissions && item.requiredPermissions.length > 0) {
      hasRequiredPermissions = item.requiredPermissions.every(permission =>
        userHasPermission(userRoles, permission)
      );
    }

    return (hasRoleAccess || hasAnyAllowedRole) && hasRequiredPermissions;
  });

  // Sort the filtered items by their effective order
  return sortNavigationItems(filteredItems, currentRole);
};

/**
 * Get navigation item by path
 */
export const getNavigationItem = (path: string): NavigationItem | undefined => {
  return navigationConfig.find(item => item.href === path);
};

// ==================== PATH PATTERN UTILITIES ====================

/**
 * Utility functions for creating common path patterns
 */
export const PathPatterns = {
  /**
   * Match any single segment: /dashboard/requests/*
   */
  wildcard: (basePath: string) => `${basePath}/*`,

  /**
   * Match any nested path: /dashboard/requests/**
   */
  deepWildcard: (basePath: string) => `${basePath}/**`,

  /**
   * Match specific parameter: /dashboard/requests/:id
   */
  param: (basePath: string, paramName: string) => `${basePath}/:${paramName}`,

  /**
   * Match optional parameter: /dashboard/requests/:id?
   */
  optionalParam: (basePath: string, paramName: string) => `${basePath}/:${paramName}?`,

  /**
   * Match multiple patterns for common CRUD operations
   */
  crud: (basePath: string) => [
    `${basePath}/*`,           // Any single segment
    `${basePath}/create`,      // Create page
    `${basePath}/edit/*`,      // Edit with ID
    `${basePath}/view/*`,      // View with ID
    `${basePath}/delete/*`,    // Delete with ID
  ],

  /**
   * Match admin patterns
   */
  admin: (basePath: string) => [
    `${basePath}/admin/**`,    // Any admin nested route
    `${basePath}/settings/**`, // Any settings nested route
    `${basePath}/manage/**`,   // Any management nested route
  ],
};

/**
 * Test if a path matches any of the given patterns
 */
export const testPathPatterns = (path: string, patterns: string[]): boolean => {
  return patterns.some(pattern => matchesPathPattern(path, pattern));
};

/**
 * Get all paths that would match a pattern (for debugging)
 */
export const getMatchingPaths = (pattern: string, testPaths: string[]): string[] => {
  return testPaths.filter(path => matchesPathPattern(path, pattern));
};

/**
 * Validate a path pattern (check if it's a valid pattern)
 */
export const validatePathPattern = (pattern: string): { valid: boolean; error?: string } => {
  try {
    compilePathPattern(pattern);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid pattern'
    };
  }
};

// ==================== NAVIGATION ORDERING UTILITIES ====================

/**
 * Order ranges for logical grouping
 */
const ORDER_RANGES = {
  CORE: { start: 1, end: 9 },        // Dashboard, essential items
  USER: { start: 10, end: 99 },      // User-facing features
  ADMIN: { start: 200, end: 299 },   // Admin features
  SYSTEM: { start: 300, end: 399 },  // System management
  PROFILE: { start: 90, end: 99 },   // Profile/settings (end of user section)
} as const;

/**
 * Predefined orders for common items
 */
const COMMON_ORDERS = {
  DASHBOARD: 1,
  THEMES: 10,
  PROFILE: 98,
  REPORTS: 200,
  REQUESTS: 210,
  USERS: 220,
  USER_ACCOUNTS: 230,
  SYSTEM_LOGS: 300,
  SETTINGS: 310,
} as const;

/**
 * Utility functions for managing navigation item ordering
 */
export const NavigationOrdering = {
  ORDER_RANGES,
  COMMON_ORDERS,

  /**
   * Create a navigation item with global ordering
   */
  withOrder: (order: number) => ({ order }),

  /**
   * Create a navigation item with role-specific ordering
   */
  withRoleOrder: (roleOrders: Partial<Record<Role, number>>) => ({
    roleSpecificOrder: roleOrders
  }),

  /**
   * Create a navigation item with both global and role-specific ordering
   */
  withMixedOrder: (globalOrder: number, roleOrders: Partial<Record<Role, number>>) => ({
    order: globalOrder,
    roleSpecificOrder: roleOrders
  }),

  /**
   * Create ordering within a logical group
   */
  inGroup: (group: keyof typeof ORDER_RANGES, position: number) => {
    const range = ORDER_RANGES[group];
    const order = range.start + position - 1;
    if (order > range.end) {
      console.warn(`Order ${order} exceeds ${String(group)} range (${range.start}-${range.end})`);
    }
    return { order };
  },

  /**
   * Get the effective order for debugging
   */
  getEffectiveOrder: (item: NavigationItem, role: Role | null) => getEffectiveOrder(item, role),

  /**
   * Preview how navigation items will be ordered for a specific role
   */
  previewOrder: (items: NavigationItem[], role: Role | null) => {
    return sortNavigationItems(items, role).map((item, index) => ({
      position: index + 1,
      name: item.name,
      href: item.href,
      effectiveOrder: getEffectiveOrder(item, role),
      globalOrder: item.order,
      roleSpecificOrder: role ? item.roleSpecificOrder?.[role] : undefined,
    }));
  },
};

// ==================== ROLE MANAGEMENT ====================

/**
 * Check if a role can be assigned to a user by another role
 */
export const canAssignRole = (assignerRole: Role, targetRole: Role): boolean => {
  const assignerPriority = getRolePriority(assignerRole);
  const targetPriority = getRolePriority(targetRole);

  // Can only assign roles of lower or equal priority
  return assignerPriority >= targetPriority;
};

/**
 * Get roles that can be assigned by a specific role
 */
export const getAssignableRoles = (assignerRole: Role): Role[] => {
  const assignerPriority = getRolePriority(assignerRole);
  return roleHierarchy.filter(role => getRolePriority(role) <= assignerPriority);
};

/**
 * Check if user can perform an action on a resource
 */
export const canPerformAction = (
  userRoles: Role[],
  action: Permission,
  resourceOwnerId?: string,
  userId?: string,
  scope: PermissionScope = PermissionScope.GLOBAL
): boolean => {
  // Check global permission first
  if (userHasPermission(userRoles, action)) {
    return true;
  }

  // Check context-based permission
  if (userHasContextPermission(userRoles, action, scope)) {
    return true;
  }

  // Check if user is the resource owner (for personal scope)
  if (scope === PermissionScope.PERSONAL && resourceOwnerId === userId) {
    return true;
  }

  return false;
};

// ==================== PERMISSION VALIDATION ====================

/**
 * Validate multiple permissions at once
 */
export const validatePermissions = (
  userRoles: Role[],
  requiredPermissions: Permission[],
  requireAll: boolean = true
): { isValid: boolean; missingPermissions: Permission[] } => {
  const missingPermissions: Permission[] = [];

  requiredPermissions.forEach(permission => {
    if (!userHasPermission(userRoles, permission)) {
      missingPermissions.push(permission);
    }
  });

  const isValid = requireAll
    ? missingPermissions.length === 0
    : missingPermissions.length < requiredPermissions.length;

  return { isValid, missingPermissions };
};

/**
 * Get permission summary for a user
 */
export const getPermissionSummary = (userRoles: Role[]) => {
  const allPermissions = getAllPermissionsForRoles(userRoles);
  const accessiblePages = getAccessiblePages(userRoles, getHighestRole(userRoles));
  const navigationItems = filterNavigationItems(userRoles, getHighestRole(userRoles));

  return {
    roles: userRoles,
    highestRole: getHighestRole(userRoles),
    permissions: allPermissions,
    accessiblePages: accessiblePages.map(page => page.href), // Use href instead of path
    navigationItems: navigationItems.map(item => item.name),
    permissionCount: allPermissions.length,
    pageCount: accessiblePages.length,
  };
};

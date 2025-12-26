/**
 * Enhanced RBAC Hooks with Performance Optimization
 *
 * React hooks for role-based access control with caching and memoization
 */

import { useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  Permission,
  Role,
} from '@/core/redux/features/user/slice';
import {
  hasPermission,
  userHasPermission,
  getAllPermissionsForRoles,
  getHighestRole,
  canAccessPage,
  getAccessiblePages,
  filterNavigationItems,
  canPerformAction,
  validatePermissions,
  getPermissionSummary,
  userHasContextPermission,
} from './utils';
import { PermissionScope } from './config';
import { rbacCache, cachedCreatePermissionChecker } from './cache';
import { ROLE_TEMPLATES } from './permissions';

// ==================== MAIN RBAC HOOK ====================

/**
 * Main RBAC hook providing comprehensive role and permission management
 * Now uses NextAuth session as the single source of truth for roles
 */
export const useRBAC = () => {
  const { data: session, status } = useSession();

  // Extract roles from session and convert strings to Role enum types
  const userRoles = useMemo(() => {
    const sessionRoles = session?.user?.roles || [];
    return sessionRoles.map(roleString => roleString as Role).filter(role =>
      Object.values(Role).includes(role)
    );
  }, [session?.user?.roles]);

  const currentRole = useMemo(() => userRoles[0] || null, [userRoles]);

  // Loading state from session
  const isLoading = status === 'loading';

  // ========== PERMISSION CHECKS ==========

  /**
   * Check if current active role has permission
   */
  const checkPermission = useCallback(
    (permission: Permission) => {
      return hasPermission(currentRole, permission);
    },
    [currentRole]
  );

  /**
   * Check if any of user's roles has permission
   */
  const checkAnyRoleHasPermission = useCallback(
    (permission: Permission) => {
      return userHasPermission(userRoles, permission);
    },
    [userRoles]
  );

  /**
   * Check context-based permission
   */
  const checkContextPermission = useCallback(
    (permission: Permission, scope: PermissionScope = PermissionScope.GLOBAL, resourceId?: string) => {
      return userHasContextPermission(userRoles, permission, scope, resourceId);
    },
    [userRoles]
  );

  /**
   * Check if user can perform action on resource
   */
  const checkCanPerformAction = useCallback(
    (action: Permission, resourceOwnerId?: string, userId?: string, scope: PermissionScope = PermissionScope.GLOBAL) => {
      return canPerformAction(userRoles, action, resourceOwnerId, userId, scope);
    },
    [userRoles]
  );

  /**
   * Validate multiple permissions
   */
  const checkMultiplePermissions = useCallback(
    (permissions: Permission[], requireAll: boolean = true) => {
      return validatePermissions(userRoles, permissions, requireAll);
    },
    [userRoles]
  );

  // ========== PAGE ACCESS ==========

  /**
   * Check if user can access a page
   */
  const checkPageAccess = useCallback(
    (pagePath: string) => {
      return canAccessPage(userRoles, currentRole, pagePath);
    },
    [userRoles, currentRole]
  );

  /**
   * Get all accessible pages
   */
  const getAccessiblePagesList = useCallback(
    () => {
      return getAccessiblePages(userRoles, currentRole);
    },
    [userRoles, currentRole]
  );

  // ========== NAVIGATION ==========

  /**
   * Get filtered navigation items (with caching)
   * Memoized to prevent recalculation on every render
   */
  const getFilteredNavigation = useMemo(
    () => {
      // Try cache first
      const cached = rbacCache.getNavigationItems(userRoles, currentRole);
      if (cached) return cached;

      // Compute and cache
      const items = filterNavigationItems(userRoles, currentRole);
      rbacCache.setNavigationItems(userRoles, currentRole, items);
      return items;
    },
    [userRoles, currentRole]
  );

  // ========== COMPUTED VALUES ==========

  /**
   * Get all permissions from all roles (with caching)
   */
  const allPermissions = useMemo(
    () => getAllPermissionsForRoles(userRoles),
    [userRoles]
  );

  /**
   * Optimized permission checker (with caching)
   */
  const permissionChecker = useMemo(
    () => cachedCreatePermissionChecker(allPermissions),
    [allPermissions]
  );

  /**
   * Get highest priority role
   */
  const highestRole = useMemo(
    () => getHighestRole(userRoles),
    [userRoles]
  );

  /**
   * Get permission summary
   */
  const permissionSummary = useMemo(
    () => getPermissionSummary(userRoles),
    [userRoles]
  );

  /**
   * Check if user is admin
   */
  const isAdmin = useMemo(
    () => userRoles.includes('admin' as any),
    [userRoles]
  );

  /**
   * Check if user is supervisor or higher
   */
  const isSupervisorOrHigher = useMemo(
    () => userRoles.some(role => ['supervisor', 'admin'].includes(role)),
    [userRoles]
  );

  return {
    // Current state
    currentRole,
    userRoles,
    isLoading,
    highestRole,
    allPermissions,
    isAdmin,
    isSupervisorOrHigher,

    // Permission checks
    checkPermission,
    checkAnyRoleHasPermission,
    checkContextPermission,
    checkCanPerformAction,
    checkMultiplePermissions,

    // Page access
    checkPageAccess,
    getAccessiblePagesList,

    // Navigation
    getFilteredNavigation: () => getFilteredNavigation,

    // Optimized checker
    permissionChecker,

    // Summary
    permissionSummary,
  };
};

// ==================== SPECIALIZED HOOKS ====================

/**
 * Hook for page-level access control
 */
export const usePageAccess = (pagePath: string) => {
  const { checkPageAccess } = useRBAC();

  const accessResult = useMemo(
    () => checkPageAccess(pagePath),
    [checkPageAccess, pagePath]
  );

  return {
    canAccess: accessResult.canAccess,
    fallbackPath: accessResult.fallbackPath,
    navigationItem: accessResult.navigationItem, // Updated from 'rule'
  };
};

/**
 * Hook for permission-based component rendering
 */
export const usePermissionGuard = (permission: Permission) => {
  const { checkAnyRoleHasPermission } = useRBAC();

  const hasPermission = useMemo(
    () => checkAnyRoleHasPermission(permission),
    [checkAnyRoleHasPermission, permission]
  );

  return hasPermission;
};

/**
 * Hook for multiple permissions check
 */
export const useMultiplePermissions = (permissions: Permission[], requireAll: boolean = true) => {
  const { checkMultiplePermissions } = useRBAC();

  const result = useMemo(
    () => checkMultiplePermissions(permissions, requireAll),
    [checkMultiplePermissions, permissions, requireAll]
  );

  return result;
};

/**
 * Hook for navigation items filtering
 * Optimized to only recalculate when roles actually change, not on session updates
 */
export const useNavigationItems = () => {
  const { data: session } = useSession();

  // Extract roles from session and convert to Role enum types
  const userRoles = useMemo(() => {
    const sessionRoles = session?.user?.roles || [];
    return sessionRoles.map(roleString => roleString as Role).filter(role =>
      Object.values(Role).includes(role)
    );
  }, [session?.user?.roles]);

  const currentRole = useMemo(() => userRoles[0] || null, [userRoles]);

  // Cache navigation items based on actual role data, not the entire RBAC hook
  const navigationItems = useMemo(() => {
    // Try cache first
    const cached = rbacCache.getNavigationItems(userRoles, currentRole);
    if (cached) return cached;

    // Compute and cache
    const items = filterNavigationItems(userRoles, currentRole);
    rbacCache.setNavigationItems(userRoles, currentRole, items);
    return items;
  }, [userRoles, currentRole]); // Only depend on actual role data

  return navigationItems;
};

/**
 * Hook for action-level permissions (e.g., buttons, forms)
 */
export const useActionPermission = (
  action: Permission,
  resourceOwnerId?: string,
  userId?: string,
  scope: PermissionScope = PermissionScope.GLOBAL
) => {
  const { checkCanPerformAction } = useRBAC();

  const canPerform = useMemo(
    () => checkCanPerformAction(action, resourceOwnerId, userId, scope),
    [checkCanPerformAction, action, resourceOwnerId, userId, scope]
  );

  return canPerform;
};

/**
 * Hook for role-based conditional rendering
 */
export const useRoleGuard = (allowedRoles: string[]) => {
  const { userRoles } = useRBAC();

  const hasRole = useMemo(
    () => userRoles.some(role => allowedRoles.includes(role)),
    [userRoles, allowedRoles]
  );

  return hasRole;
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook to get user's permission summary
 */
export const usePermissionSummary = () => {
  const { permissionSummary } = useRBAC();
  return permissionSummary;
};

/**
 * Hook to check if user has admin privileges
 */
export const useIsAdmin = () => {
  const { isAdmin } = useRBAC();
  return isAdmin;
};

/**
 * Hook to check if user has supervisor or higher privileges
 */
export const useIsSupervisorOrHigher = () => {
  const { isSupervisorOrHigher } = useRBAC();
  return isSupervisorOrHigher;
};

/**
 * Hook for debugging RBAC state
 */
export const useRBACDebug = () => {
  const rbac = useRBAC();

  const debugInfo = useMemo(() => ({
    currentRole: rbac.currentRole,
    userRoles: rbac.userRoles,
    highestRole: rbac.highestRole,
    permissionCount: rbac.allPermissions.length,
    permissions: rbac.allPermissions,
    accessiblePages: rbac.getAccessiblePagesList().map(p => p.href), // Use href instead of path
    navigationItems: rbac.getFilteredNavigation().map(n => n.name),
    cacheStats: rbacCache.getStats(),
  }), [rbac]);

  return debugInfo;
};

// ==================== OPTIMIZED HOOKS ====================

/**
 * Hook for role template management
 */
export const useRoleTemplate = () => {
  const { userRoles } = useRBAC();

  const currentTemplate = useMemo(() => {
    // Find matching template
    for (const [templateName, template] of Object.entries(ROLE_TEMPLATES)) {
      if (template.roles.every(role => userRoles.includes(role))) {
        return { name: templateName, ...template };
      }
    }
    return null;
  }, [userRoles]);

  const availableTemplates = useMemo(() => {
    return Object.entries(ROLE_TEMPLATES).map(([name, template]) => ({
      name,
      ...template,
    }));
  }, []);

  return {
    currentTemplate,
    availableTemplates,
    hasTemplate: (templateName: keyof typeof ROLE_TEMPLATES) => {
      const template = ROLE_TEMPLATES[templateName];
      return template.roles.every(role => userRoles.includes(role));
    },
  };
};

/**
 * Hook for performance monitoring
 */
export const useRBACPerformance = () => {
  const cacheStats = useMemo(() => rbacCache.getStats(), []);

  const clearCache = useCallback((type?: keyof typeof rbacCache['cache']) => {
    if (type) {
      rbacCache.clearCache(type);
    } else {
      rbacCache.clearAll();
    }
  }, []);

  const configureCache = useCallback((options: { defaultTTL?: number; maxCacheSize?: number }) => {
    rbacCache.configure(options);
  }, []);

  return {
    cacheStats,
    clearCache,
    configureCache,
  };
};

/**
 * Hook for batch permission checking (optimized for multiple checks)
 */
export const useBatchPermissions = (permissions: Permission[]) => {
  const { permissionChecker } = useRBAC();

  const results = useMemo(() => {
    return permissions.reduce((acc, permission) => {
      acc[permission] = permissionChecker.hasPermission(permission);
      return acc;
    }, {} as Record<Permission, boolean>);
  }, [permissions, permissionChecker]);

  return results;
};

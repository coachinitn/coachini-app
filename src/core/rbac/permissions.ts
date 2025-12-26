/**
 * Advanced Permission Management System
 *
 * Implements permission inheritance, wildcards, and optimization
 */

import { Permission, Role } from '../redux/features/user/slice';

// ==================== PERMISSION HIERARCHY ====================

/**
 * Permission inheritance hierarchy
 * Higher-level permissions automatically include lower-level ones
 */
export const PERMISSION_HIERARCHY: Record<string, Permission[]> = {
  // User management hierarchy
  [Permission.MANAGE_USERS]: [
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.EDIT_USERS,
    Permission.DELETE_USERS,
  ],

  // Content management hierarchy
  [Permission.MANAGE_CONTENT]: [
    Permission.VIEW_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.DELETE_CONTENT,
  ],

  // Request management hierarchy
  [Permission.MANAGE_REQUESTS]: [
    Permission.VIEW_REQUESTS,
    Permission.CREATE_REQUESTS,
    Permission.EDIT_REQUESTS,
    Permission.DELETE_REQUESTS,
    Permission.APPROVE_REQUESTS,
  ],

  // Account management hierarchy
  [Permission.MANAGE_ACCOUNTS]: [
    Permission.VIEW_ACCOUNTS,
    Permission.CREATE_ACCOUNTS,
    Permission.DELETE_ACCOUNTS,
  ],

  // Team management hierarchy
  [Permission.MANAGE_TEAMS]: [
    Permission.VIEW_TEAMS,
    Permission.CREATE_TEAMS,
    Permission.EDIT_TEAMS,
    Permission.DELETE_TEAMS,
  ],

  // Theme management hierarchy
  [Permission.MANAGE_THEMES]: [
    Permission.VIEW_THEMES,
    Permission.CREATE_THEMES,
    Permission.EDIT_THEMES,
    Permission.DELETE_THEMES,
    Permission.PURCHASE_THEMES,
  ],

  // System management hierarchy (super permissions)
  [Permission.MANAGE_SYSTEM]: [
    Permission.MANAGE_USERS,
    Permission.MANAGE_CONTENT,
    Permission.MANAGE_ACCOUNTS,
    Permission.VIEW_LOGS,
  ],
};

// ==================== PERMISSION PATTERNS ====================

/**
 * Permission patterns for wildcard matching
 */
export const PERMISSION_PATTERNS: Record<string, string> = {
  'admin:*': 'All administrative permissions',
  'user:read:*': 'All user read permissions',
  'user:write:*': 'All user write permissions',
  'content:*': 'All content-related permissions',
  'system:*': 'All system-level permissions',
};

// ==================== ROLE TEMPLATES ====================

/**
 * Pre-defined role templates for common user types
 */
export const ROLE_TEMPLATES = {
  BASIC_USER: {
    roles: [Role.USER],
    description: 'Basic authenticated user',
    permissions: [Permission.VIEW_DASHBOARD, Permission.VIEW_PROFILE, Permission.EDIT_PROFILE],
  },

  CONTENT_CREATOR: {
    roles: [Role.USER, Role.COACHEE],
    description: 'User who can create and manage content',
    permissions: [
      Permission.VIEW_DASHBOARD,
      Permission.VIEW_PROFILE,
      Permission.EDIT_PROFILE,
      Permission.VIEW_THEMES,
      Permission.PURCHASE_THEMES,
    ],
  },

  COACH: {
    roles: [Role.USER, Role.COACH],
    description: 'Coach with team and theme management',
    permissions: [
      Permission.VIEW_DASHBOARD,
      Permission.VIEW_PROFILE,
      Permission.EDIT_PROFILE,
      Permission.MANAGE_THEMES,
      Permission.MANAGE_TEAMS,
      Permission.VIEW_REQUESTS,
      Permission.EDIT_REQUESTS,
    ],
  },

  MANAGER: {
    roles: [Role.USER, Role.COACH, Role.SUPERVISOR],
    description: 'Manager with oversight capabilities',
    permissions: [
      Permission.VIEW_DASHBOARD,
      Permission.VIEW_ANALYTICS,
      Permission.VIEW_PROFILE,
      Permission.EDIT_PROFILE,
      Permission.MANAGE_THEMES,
      Permission.MANAGE_TEAMS,
      Permission.MANAGE_REQUESTS,
      Permission.VIEW_REPORTS,
      Permission.EXPORT_REPORTS,
    ],
  },

  SUPER_ADMIN: {
    roles: [Role.ADMIN],
    description: 'Full system administrator',
    permissions: Object.values(Permission), // All permissions
  },
} as const;

// ==================== PERMISSION UTILITIES ====================

/**
 * Expand permissions to include inherited permissions
 */
export const expandPermissions = (permissions: Permission[]): Permission[] => {
  const expandedPermissions = new Set<Permission>(permissions);

  permissions.forEach(permission => {
    const inheritedPermissions = PERMISSION_HIERARCHY[permission];
    if (inheritedPermissions) {
      inheritedPermissions.forEach(inherited => {
        expandedPermissions.add(inherited);
        // Recursively expand inherited permissions
        const subInherited = expandPermissions([inherited]);
        subInherited.forEach(sub => expandedPermissions.add(sub));
      });
    }
  });

  return Array.from(expandedPermissions);
};

/**
 * Check if a permission matches a pattern
 */
export const matchesPermissionPattern = (permission: Permission, pattern: string): boolean => {
  if (pattern.endsWith(':*')) {
    const prefix = pattern.slice(0, -2);
    return permission.startsWith(prefix);
  }
  return permission === pattern;
};

/**
 * Get all permissions for a role template
 */
export const getTemplatePermissions = (templateName: keyof typeof ROLE_TEMPLATES): Permission[] => {
  const template = ROLE_TEMPLATES[templateName];
  return expandPermissions([...template.permissions]); // Convert readonly to mutable
};

/**
 * Create optimized permission checker
 */
export const createPermissionChecker = (userPermissions: Permission[]) => {
  const expandedPermissions = new Set(expandPermissions(userPermissions));

  return {
    hasPermission: (permission: Permission): boolean => {
      return expandedPermissions.has(permission);
    },

    hasAnyPermission: (permissions: Permission[]): boolean => {
      return permissions.some(permission => expandedPermissions.has(permission));
    },

    hasAllPermissions: (permissions: Permission[]): boolean => {
      return permissions.every(permission => expandedPermissions.has(permission));
    },

    getExpandedPermissions: (): Permission[] => {
      return Array.from(expandedPermissions);
    },
  };
};

/**
 * Permission validation with detailed results
 */
export const validatePermissions = (
  userPermissions: Permission[],
  requiredPermissions: Permission[],
  requireAll: boolean = true
): {
  isValid: boolean;
  hasPermissions: Permission[];
  missingPermissions: Permission[];
  expandedUserPermissions: Permission[];
} => {
  const expandedUserPermissions = expandPermissions(userPermissions);
  const userPermissionSet = new Set(expandedUserPermissions);

  const hasPermissions: Permission[] = [];
  const missingPermissions: Permission[] = [];

  requiredPermissions.forEach(permission => {
    if (userPermissionSet.has(permission)) {
      hasPermissions.push(permission);
    } else {
      missingPermissions.push(permission);
    }
  });

  const isValid = requireAll
    ? missingPermissions.length === 0
    : hasPermissions.length > 0;

  return {
    isValid,
    hasPermissions,
    missingPermissions,
    expandedUserPermissions,
  };
};

// ==================== EXPORTS ====================

export default {
  PERMISSION_HIERARCHY,
  PERMISSION_PATTERNS,
  ROLE_TEMPLATES,
  expandPermissions,
  matchesPermissionPattern,
  getTemplatePermissions,
  createPermissionChecker,
  validatePermissions,
};

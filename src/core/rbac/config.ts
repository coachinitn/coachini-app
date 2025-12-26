/**
 * Comprehensive Role-Based Access Control (RBAC) Configuration
 *
 * This file defines the complete RBAC system including:
 * - Page access control
 * - Permission management
 * - Navigation menu configuration
 * - Role hierarchies
 */

import { Role, Permission } from '../redux/features/user/slice';
import { ElementType } from 'react';

// ==================== PAGE ACCESS CONTROL ====================

/**
 * DEPRECATED: Use navigationConfig instead for both navigation and page access
 * This interface is kept for backward compatibility
 */
export interface PageAccessRule {
  path: string;
  allowedRoles: Role[];
  requiredPermissions?: Permission[];
  fallbackPath?: string;
  description?: string;
}

/**
 * DEPRECATED: Page access rules are now derived from navigationConfig
 * This ensures single source of truth for both navigation and access control
 */
export const pageAccessRules: PageAccessRule[] = [];

// ==================== NAVIGATION MENU CONFIGURATION ====================

/**
 * Navigation menu item with role-based visibility AND page access control
 * This serves as the single source of truth for both navigation and page access
 */
export interface NavigationItem {
  name: string;
  href: string;
  icon: ElementType | string;
  allowedRoles: Role[];
  requiredPermissions?: Permission[];
  description?: string;
  children?: NavigationItem[];
  badge?: string;
  isNew?: boolean;

  // Navigation control
  showInNavigation?: boolean; // Whether to show in sidebar (default: true)

  // Navigation ordering
  order?: number; // Global order (lower numbers appear first)
  roleSpecificOrder?: Partial<Record<Role, number>>; // Role-specific ordering

  // Page access control properties
  fallbackPath?: string; // Where to redirect if access is denied
  exactMatch?: boolean;  // Whether to match exact path or allow sub-paths

  /**
   * Additional protected sub-paths under this route
   * Supports advanced patterns:
   * - Wildcards: '/dashboard/requests/*' matches any single segment
   * - Double wildcards: '/dashboard/**' matches any nested path
   * - Named parameters: '/dashboard/requests/:id' matches dynamic segments
   * - Optional parameters: '/dashboard/requests/:id?' matches with or without segment
   * - Exact paths: '/dashboard/requests/specific' for exact matches
   *
   * Examples:
   * - '/dashboard/requests/*' → matches /dashboard/requests/123, /dashboard/requests/pending
   * - '/dashboard/requests/**' → matches /dashboard/requests/123/details/edit
   * - '/dashboard/requests/:id' → matches /dashboard/requests/123 (captures id)
   * - '/dashboard/requests/:id?' → matches /dashboard/requests and /dashboard/requests/123
   */
  subPaths?: string[];
}

/**
 * Complete navigation menu configuration with role-based access
 */
/**
 * DEPRECATED: Use feature-based configs instead
 * This is now imported from the modular configuration
 */
export { navigationConfig } from './configs';

// ==================== ROLE HIERARCHY ====================

/**
 * Role hierarchy for permission inheritance and priority
 * Higher index = higher priority
 */
export const roleHierarchy: Role[] = [
  Role.USER,
  Role.COACHEE,
  Role.COACH,
  Role.SUPERVISOR,
  Role.ADMIN,
];

/**
 * Get role priority (higher number = higher priority)
 */
export const getRolePriority = (role: Role): number => {
  return roleHierarchy.indexOf(role);
};

// ==================== PERMISSION GROUPS ====================

/**
 * Permission groups for easier management
 */
export const permissionGroups = {
  dashboard: [Permission.VIEW_DASHBOARD, Permission.VIEW_ANALYTICS],
  profile: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE],
  users: [Permission.VIEW_USERS, Permission.CREATE_USERS, Permission.DELETE_USERS, Permission.MANAGE_USERS],
  content: [Permission.VIEW_CONTENT, Permission.CREATE_CONTENT, Permission.EDIT_CONTENT, Permission.DELETE_CONTENT, Permission.MANAGE_CONTENT],
  requests: [Permission.VIEW_REQUESTS, Permission.CREATE_REQUESTS, Permission.EDIT_REQUESTS, Permission.DELETE_REQUESTS, Permission.APPROVE_REQUESTS, Permission.MANAGE_REQUESTS],
  accounts: [Permission.VIEW_ACCOUNTS, Permission.CREATE_ACCOUNTS, Permission.DELETE_ACCOUNTS, Permission.MANAGE_ACCOUNTS],
  teams: [Permission.VIEW_TEAMS, Permission.CREATE_TEAMS, Permission.EDIT_TEAMS, Permission.DELETE_TEAMS, Permission.MANAGE_TEAMS],
  themes: [Permission.VIEW_THEMES, Permission.CREATE_THEMES, Permission.EDIT_THEMES, Permission.DELETE_THEMES, Permission.MANAGE_THEMES, Permission.PURCHASE_THEMES],
  reports: [Permission.VIEW_REPORTS, Permission.EXPORT_REPORTS],
  system: [Permission.MANAGE_SYSTEM, Permission.VIEW_LOGS],
} as const;

// ==================== CONTEXT-BASED PERMISSIONS ====================

/**
 * Context-based permission scopes for granular control
 */
export enum PermissionScope {
  GLOBAL = 'global',
  ORGANIZATION = 'organization',
  TEAM = 'team',
  PERSONAL = 'personal',
}

/**
 * Context-based permission rule
 */
export interface ContextPermission {
  permission: Permission;
  scope: PermissionScope;
  resourceId?: string;
  conditions?: Record<string, any>;
}

/**
 * Default context permissions for each role
 */
export const contextPermissions: Record<Role, ContextPermission[]> = {
  [Role.USER]: [
    { permission: Permission.VIEW_PROFILE, scope: PermissionScope.PERSONAL },
    { permission: Permission.EDIT_PROFILE, scope: PermissionScope.PERSONAL },
  ],
  [Role.COACHEE]: [
    { permission: Permission.VIEW_PROFILE, scope: PermissionScope.PERSONAL },
    { permission: Permission.EDIT_PROFILE, scope: PermissionScope.PERSONAL },
    { permission: Permission.VIEW_THEMES, scope: PermissionScope.GLOBAL },
    { permission: Permission.PURCHASE_THEMES, scope: PermissionScope.PERSONAL },
    { permission: Permission.CREATE_REQUESTS, scope: PermissionScope.PERSONAL },
  ],
  [Role.COACH]: [
    { permission: Permission.VIEW_PROFILE, scope: PermissionScope.PERSONAL },
    { permission: Permission.EDIT_PROFILE, scope: PermissionScope.PERSONAL },
    { permission: Permission.MANAGE_THEMES, scope: PermissionScope.TEAM },
    { permission: Permission.MANAGE_TEAMS, scope: PermissionScope.TEAM },
    { permission: Permission.VIEW_REQUESTS, scope: PermissionScope.TEAM },
    { permission: Permission.EDIT_REQUESTS, scope: PermissionScope.TEAM },
  ],
  [Role.SUPERVISOR]: [
    { permission: Permission.VIEW_ANALYTICS, scope: PermissionScope.ORGANIZATION },
    { permission: Permission.MANAGE_REQUESTS, scope: PermissionScope.ORGANIZATION },
    { permission: Permission.APPROVE_REQUESTS, scope: PermissionScope.ORGANIZATION },
    { permission: Permission.VIEW_REPORTS, scope: PermissionScope.ORGANIZATION },
    { permission: Permission.EXPORT_REPORTS, scope: PermissionScope.ORGANIZATION },
  ],
  [Role.ADMIN]: [
    { permission: Permission.MANAGE_USERS, scope: PermissionScope.GLOBAL },
    { permission: Permission.MANAGE_SYSTEM, scope: PermissionScope.GLOBAL },
    { permission: Permission.VIEW_LOGS, scope: PermissionScope.GLOBAL },
    { permission: Permission.MANAGE_ACCOUNTS, scope: PermissionScope.GLOBAL },
  ],
};

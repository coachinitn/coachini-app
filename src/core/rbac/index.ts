/**
 * RBAC System - Main Export File
 *
 * Comprehensive Role-Based Access Control system with performance optimizations
 */

// ==================== CONFIGURATION ====================
export * from './config';
export * from './configs'; // Feature-based configs

// ==================== UTILITIES ====================
export * from './utils';

// ==================== HOOKS ====================
export * from './hooks';

// ==================== COMPONENTS ====================
export * from './components';

// ==================== PAGE WRAPPERS ====================
export * from './page-wrapper';

// ==================== PERFORMANCE OPTIMIZATIONS ====================
export {
  PERMISSION_HIERARCHY,
  PERMISSION_PATTERNS,
  ROLE_TEMPLATES,
  expandPermissions,
  createPermissionChecker,
  getTemplatePermissions,
  validatePermissions as validatePermissionsAdvanced, // Avoid conflict
} from './permissions';
export { rbacCache, cachedExpandPermissions, cachedCreatePermissionChecker } from './cache';
export { auditLogger, auditPermissionCheck, auditPageAccess } from './audit';

// ==================== RE-EXPORTS FROM REDUX ====================
export {
  Role,
  Permission,
  rolePermissions,
  type UserData
} from '../redux/features/user/slice';

// ==================== MAIN RBAC CLASS ====================

import { Role, Permission } from '../redux/features/user/slice';
import {
  canAccessPage,
  filterNavigationItems,
  userHasPermission,
  getPermissionSummary
} from './utils';
// PermissionScope is re-exported from config above

/**
 * Main RBAC class for programmatic access control
 */
export class RBACManager {
  private userRoles: Role[];
  private currentRole: Role | null;

  constructor(userRoles: Role[], currentRole: Role | null = null) {
    this.userRoles = userRoles;
    this.currentRole = currentRole || (userRoles.length > 0 ? userRoles[0] : null);
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission: Permission): boolean {
    return userHasPermission(this.userRoles, permission);
  }

  /**
   * Check if user can access page
   */
  canAccessPage(pagePath: string): boolean {
    const result = canAccessPage(this.userRoles, this.currentRole, pagePath);
    return result.canAccess;
  }

  /**
   * Get filtered navigation items
   */
  getNavigationItems() {
    return filterNavigationItems(this.userRoles, this.currentRole);
  }

  /**
   * Get permission summary
   */
  getPermissionSummary() {
    return getPermissionSummary(this.userRoles);
  }

  /**
   * Update user roles
   */
  updateRoles(newRoles: Role[], newCurrentRole?: Role | null) {
    this.userRoles = newRoles;
    this.currentRole = newCurrentRole || (newRoles.length > 0 ? newRoles[0] : null);
  }

  /**
   * Switch current role
   */
  switchRole(role: Role): boolean {
    if (this.userRoles.includes(role)) {
      this.currentRole = role;
      return true;
    }
    return false;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.userRoles.includes(Role.ADMIN);
  }

  /**
   * Check if user is supervisor or higher
   */
  isSupervisorOrHigher(): boolean {
    return this.userRoles.some(role => [Role.SUPERVISOR, Role.ADMIN].includes(role));
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Create RBAC manager instance
 */
export const createRBACManager = (userRoles: Role[], currentRole?: Role | null): RBACManager => {
  return new RBACManager(userRoles, currentRole);
};

/**
 * Quick permission check function
 */
export const quickPermissionCheck = (userRoles: Role[], permission: Permission): boolean => {
  return userHasPermission(userRoles, permission);
};

/**
 * Quick page access check function
 */
export const quickPageAccessCheck = (
  userRoles: Role[],
  currentRole: Role | null,
  pagePath: string
): boolean => {
  const result = canAccessPage(userRoles, currentRole, pagePath);
  return result.canAccess;
};

// ==================== CONSTANTS ====================

/**
 * Common permission sets for easy reference
 */
export const PERMISSION_SETS = {
  BASIC_USER: [Permission.VIEW_DASHBOARD, Permission.VIEW_PROFILE, Permission.EDIT_PROFILE],
  CONTENT_MANAGER: [Permission.VIEW_CONTENT, Permission.CREATE_CONTENT, Permission.EDIT_CONTENT],
  USER_MANAGER: [Permission.VIEW_USERS, Permission.CREATE_USERS, Permission.EDIT_USERS],
  ADMIN_FULL: Object.values(Permission),
} as const;

/**
 * Common role sets for easy reference
 */
export const ROLE_SETS = {
  ALL_USERS: Object.values(Role),
  STAFF_ONLY: [Role.COACH, Role.SUPERVISOR, Role.ADMIN],
  MANAGEMENT_ONLY: [Role.SUPERVISOR, Role.ADMIN],
  ADMIN_ONLY: [Role.ADMIN],
} as const;

// ==================== TYPE GUARDS ====================

/**
 * Type guard to check if value is a valid Role
 */
export const isValidRole = (value: any): value is Role => {
  return Object.values(Role).includes(value);
};

/**
 * Type guard to check if value is a valid Permission
 */
export const isValidPermission = (value: any): value is Permission => {
  return Object.values(Permission).includes(value);
};

// ==================== DEFAULT EXPORT ====================

export default {
  RBACManager,
  createRBACManager,
  quickPermissionCheck,
  quickPageAccessCheck,
  PERMISSION_SETS,
  ROLE_SETS,
  isValidRole,
  isValidPermission,
};

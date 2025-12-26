import { Permission, Role, rolePermissions } from '../features/user/slice';

/**
 * Checks if a role has a specific permission
 */
export const hasPermission = (role: Role | null, permission: Permission): boolean => {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) || false;
};

/**
 * Checks if a user with given roles has at least one role with a specific permission
 */
export const userHasPermission = (roles: Role[], permission: Permission): boolean => {
  if (!roles || roles.length === 0) return false;
  return roles.some(role => hasPermission(role, permission));
};

/**
 * Get all permissions for a list of roles
 */
export const getAllPermissionsForRoles = (roles: Role[]): Permission[] => {
  if (!roles || roles.length === 0) return [];
  
  const permissionsSet = new Set<Permission>();
  
  roles.forEach(role => {
    const permissions = rolePermissions[role] || [];
    permissions.forEach(permission => permissionsSet.add(permission));
  });
  
  return Array.from(permissionsSet);
};

/**
 * Get highest priority role from a list of roles
 * (Assuming ADMIN > SUPERVISOR > USER in terms of priority)
 */
export const getHighestRole = (roles: Role[]): Role | null => {
  if (!roles || roles.length === 0) return null;
  
  if (roles.includes(Role.ADMIN)) return Role.ADMIN;
  if (roles.includes(Role.SUPERVISOR)) return Role.SUPERVISOR;
  if (roles.includes(Role.USER)) return Role.USER;
  
  return roles[0]; // Fallback to first role
};

/**
 * Check if a required permission should be granted
 * This is a pure utility function without React/JSX dependencies
 */
export const checkPermissionAccess = (
  hasPermission: boolean,
  requiredPermission: Permission
): boolean => {
  return hasPermission;
}; 
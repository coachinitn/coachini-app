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
  getHighestRole
} from '@/core/redux/utils/roleUtils';

export const useRolePermissions = () => {
  const { data: session } = useSession();

  // Extract roles from session and convert to Role enum types
  const userRoles = useMemo(() => {
    const sessionRoles = session?.user?.roles || [];
    return sessionRoles.map(roleString => roleString as Role).filter(role =>
      Object.values(Role).includes(role)
    );
  }, [session?.user?.roles]);

  const currentRole = useMemo(() => userRoles[0] || null, [userRoles]);
  
  // Check if current active role has permission
  const checkPermission = useCallback(
    (permission: Permission) => {
      return hasPermission(currentRole, permission);
    },
    [currentRole]
  );
  
  // Check if any of user's roles has permission (regardless of currently active role)
  const checkAnyRoleHasPermission = useCallback(
    (permission: Permission) => {
      return userHasPermission(userRoles, permission);
    },
    [userRoles]
  );
  
  // Get all permissions from all roles
  const getAllPermissions = useCallback(
    () => {
      return getAllPermissionsForRoles(userRoles);
    },
    [userRoles]
  );
  
  // Get highest priority role
  const getHighestUserRole = useCallback(
    () => {
      return getHighestRole(userRoles);
    },
    [userRoles]
  );
  
  return {
    currentRole,
    userRoles,
    checkPermission,
    checkAnyRoleHasPermission,
    getAllPermissions,
    getHighestUserRole,
  };
}; 
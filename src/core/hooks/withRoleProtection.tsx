import React from 'react';
import { useRouter } from 'next/navigation';
import { Permission, Role } from '@/core/redux/features/user/slice';
import { useRolePermissions } from './useRolePermissions';

type ProtectionOptions = {
  requiredPermission?: Permission;
  requiredRole?: Role;
  fallbackPath?: string;
  FallbackComponent?: React.ComponentType<any>;
};

/**
 * Higher-order component to protect components based on user role or permission
 * 
 * @param Component - The component to protect
 * @param options - Protection options
 * @returns Protected component
 */
export const withRoleProtection = <P extends object>(
  Component: React.ComponentType<P>,
  options: ProtectionOptions
) => {
  const {
    requiredPermission,
    requiredRole,
    fallbackPath = '/unauthorized',
    FallbackComponent,
  } = options;

  const ProtectedComponent = (props: P) => {
    const router = useRouter();
    const { 
      currentRole, 
      checkPermission, 
      userRoles 
    } = useRolePermissions();

    const hasAccess = React.useMemo(() => {
      if (requiredPermission) {
        return checkPermission(requiredPermission);
      }
      
      if (requiredRole) {
        return userRoles.includes(requiredRole);
      }
      
      return true; // No requirements specified
    }, [checkPermission, requiredPermission, requiredRole, userRoles]);

    React.useEffect(() => {
      if (!hasAccess && !FallbackComponent) {
        router.push(fallbackPath);
      }
    }, [hasAccess, router]);

    if (!hasAccess) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    return <Component {...props} />;
  };

  return ProtectedComponent;
}; 
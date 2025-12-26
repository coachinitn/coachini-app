/**
 * RBAC Components
 * 
 * Reusable components for role-based access control
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { PulseSpinner } from '@/design-system/ui/base/pulse-spinner';
import { Permission, Role } from '../redux/features/user/slice';
import { 
  useRBAC, 
  usePageAccess, 
  usePermissionGuard, 
  useMultiplePermissions,
  useActionPermission,
  useRoleGuard 
} from './hooks';
import { PermissionScope } from './config';

// ==================== PERMISSION GUARD COMPONENT ====================

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

/**
 * Component that conditionally renders children based on permission
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const hasPermission = usePermissionGuard(permission);
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

// ==================== MULTIPLE PERMISSIONS GUARD ====================

interface MultiplePermissionsGuardProps {
  permissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

/**
 * Component that conditionally renders children based on multiple permissions
 */
export const MultiplePermissionsGuard: React.FC<MultiplePermissionsGuardProps> = ({
  permissions,
  children,
  fallback = null,
  requireAll = true,
}) => {
  const { isValid } = useMultiplePermissions(permissions, requireAll);
  
  return isValid ? <>{children}</> : <>{fallback}</>;
};

// ==================== ROLE GUARD COMPONENT ====================

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user roles
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const hasRole = useRoleGuard(allowedRoles);
  
  return hasRole ? <>{children}</> : <>{fallback}</>;
};

// ==================== ACTION GUARD COMPONENT ====================

interface ActionGuardProps {
  action: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  resourceOwnerId?: string;
  userId?: string;
  scope?: PermissionScope;
}

/**
 * Component that conditionally renders children based on action permissions
 */
export const ActionGuard: React.FC<ActionGuardProps> = ({
  action,
  children,
  fallback = null,
  resourceOwnerId,
  userId,
  scope = PermissionScope.GLOBAL,
}) => {
  const canPerform = useActionPermission(action, resourceOwnerId, userId, scope);
  
  return canPerform ? <>{children}</> : <>{fallback}</>;
};

// ==================== PAGE ACCESS GUARD ====================

interface PageAccessGuardProps {
  pagePath: string;
  children: React.ReactNode;
  redirectOnDenied?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Component that guards page access and optionally redirects
 */
export const PageAccessGuard: React.FC<PageAccessGuardProps> = ({
  pagePath,
  children,
  redirectOnDenied = false,
  fallback = null,
}) => {
  const router = useRouter();
  const { canAccess, fallbackPath } = usePageAccess(pagePath);
  
  React.useEffect(() => {
    if (!canAccess && redirectOnDenied && fallbackPath) {
      router.push(fallbackPath);
    }
  }, [canAccess, redirectOnDenied, fallbackPath, router]);
  
  if (!canAccess) {
    if (redirectOnDenied) {
      return null; // Will redirect
    }
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// ==================== ADMIN ONLY COMPONENT ====================

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that only renders for admin users
 */
export const AdminOnly: React.FC<AdminOnlyProps> = ({
  children,
  fallback = null,
}) => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

// ==================== SUPERVISOR OR HIGHER COMPONENT ====================

interface SupervisorOrHigherProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that renders for supervisor or admin users
 */
export const SupervisorOrHigher: React.FC<SupervisorOrHigherProps> = ({
  children,
  fallback = null,
}) => {
  return (
    <RoleGuard allowedRoles={[Role.SUPERVISOR, Role.ADMIN]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

// ==================== CONDITIONAL RENDER COMPONENT ====================

interface ConditionalRenderProps {
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Generic conditional render component
 */
export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  condition,
  children,
  fallback = null,
}) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};

// ==================== RBAC DEBUG COMPONENT ====================

/**
 * Debug component to display RBAC information (development only)
 */
export const RBACDebugPanel: React.FC = () => {
  const { 
    currentRole, 
    userRoles, 
    allPermissions, 
    permissionSummary 
  } = useRBAC();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="font-bold mb-2">RBAC Debug Info</h3>
      <div className="space-y-1">
        <div><strong>Current Role:</strong> {currentRole || 'None'}</div>
        <div><strong>All Roles:</strong> {userRoles.join(', ') || 'None'}</div>
        <div><strong>Permissions:</strong> {allPermissions.length}</div>
        <div><strong>Accessible Pages:</strong> {permissionSummary.pageCount}</div>
        <div><strong>Nav Items:</strong> {permissionSummary.navigationItems.length}</div>
      </div>
    </div>
  );
};

// ==================== ACCESS DENIED COMPONENT ====================

interface AccessDeniedProps {
  title?: string;
  message?: string;
  showCurrentRole?: boolean;
  className?: string;
}

/**
 * Standard access denied component
 */
export const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = "Access Denied",
  message = "You don't have permission to access this resource.",
  showCurrentRole = true,
  className = "",
}) => {
  const { currentRole } = useRBAC();
  
  return (
    <div className={`p-6 flex flex-col items-center justify-center min-h-[50vh] text-center ${className}`}>
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      <p className="mb-6 text-muted-foreground">{message}</p>
      {showCurrentRole && (
        <div className="p-4 text-sm rounded-md bg-muted">
          <p className="mb-2 font-medium">Current role: {currentRole || 'No role assigned'}</p>
          <p className="text-xs text-muted-foreground">
            Contact your administrator if you believe this is an error.
          </p>
        </div>
      )}
    </div>
  );
};

// ==================== LOADING COMPONENT ====================

interface LoadingAccessProps {
  message?: string;
}

/**
 * Loading component for access checks
 */
export const LoadingAccess: React.FC<LoadingAccessProps> = ({
  message = "Checking permissions...",
}) => {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="p-6 rounded-lg border border-border bg-card shadow-sm">
        <PulseSpinner size="md" className="mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">{message}</p>
      </div>
    </div>
  );
};

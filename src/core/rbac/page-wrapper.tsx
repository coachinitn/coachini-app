/**
 * RBAC Page Wrapper
 *
 * Enhanced page wrapper component that handles role-based access control
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Role, Permission } from '../redux/features/user/slice';
import { usePageAccess, useRBAC } from './hooks';
import { AccessDenied, LoadingAccess } from './components';

// ==================== TYPES ====================

interface RBACPageWrapperProps {
  children: React.ReactNode;
  pagePath: string;
  allowedRoles?: Role[];
  requiredPermissions?: Permission[];
  fallbackPath?: string;
  loadingComponent?: React.ComponentType;
  accessDeniedComponent?: React.ComponentType;
  redirectOnDenied?: boolean;
  showRoleInfo?: boolean;
}

interface RoleBasedPageProps {
  children?: React.ReactNode;
  roleComponents: {
    [key in Role]?: React.ComponentType<any>;
  };
  defaultComponent?: React.ComponentType<any>;
  fallbackComponent?: React.ComponentType<any>;
  props?: any;
}

// ==================== RBAC PAGE WRAPPER ====================

/**
 * Main RBAC page wrapper that handles access control
 */
export const RBACPageWrapper: React.FC<RBACPageWrapperProps> = ({
  children,
  pagePath,
  allowedRoles,
  requiredPermissions,
  fallbackPath,
  loadingComponent: LoadingComponent = LoadingAccess,
  accessDeniedComponent: AccessDeniedComponent = AccessDenied,
  redirectOnDenied = false,
  showRoleInfo = true,
}) => {
  const router = useRouter();
  const { canAccess, fallbackPath: defaultFallbackPath } = usePageAccess(pagePath);
  const { currentRole, userRoles, isLoading, checkMultiplePermissions } = useRBAC();

  // Additional role check if specified
  const hasAllowedRole = React.useMemo(() => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return userRoles.some(role => allowedRoles.includes(role));
  }, [userRoles, allowedRoles]);

  // Additional permission check if specified
  const hasRequiredPermissions = React.useMemo(() => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    const { isValid } = checkMultiplePermissions(requiredPermissions, true);
    return isValid;
  }, [requiredPermissions, checkMultiplePermissions]);

  // Final access decision
  const finalCanAccess = canAccess && hasAllowedRole && hasRequiredPermissions;
  const finalFallbackPath = fallbackPath || defaultFallbackPath || '/dashboard';

  // Handle redirect
  React.useEffect(() => {
    if (!finalCanAccess && redirectOnDenied) {
      router.push(finalFallbackPath);
    }
  }, [finalCanAccess, redirectOnDenied, finalFallbackPath, router]);

  // Show loading if session is loading or checking access
  if (isLoading || currentRole === undefined) {
    return <LoadingComponent />;
  }

  // Show access denied if no access
  if (!finalCanAccess) {
    if (redirectOnDenied) {
      return <LoadingComponent message="Redirecting..." />;
    }
    return <AccessDeniedComponent showCurrentRole={showRoleInfo} />;
  }

  return <>{children}</>;
};

// ==================== ROLE-BASED PAGE COMPONENT ====================

/**
 * Component that renders different components based on user's current role
 */
export const RoleBasedPage: React.FC<RoleBasedPageProps> = ({
  roleComponents,
  defaultComponent: DefaultComponent,
  fallbackComponent: FallbackComponent = AccessDenied,
  props = {},
}) => {
  const { currentRole } = useRBAC();

  // Get component for current role
  const RoleComponent = currentRole ? roleComponents[currentRole] : null;

  // Render based on role
  if (RoleComponent) {
    return <RoleComponent {...props} />;
  }

  if (DefaultComponent) {
    return <DefaultComponent {...props} />;
  }

  return <FallbackComponent {...props} />;
};

// ==================== ENHANCED CLIENT WRAPPER ====================

interface EnhancedClientWrapperProps {
  locale: string;
  pagePath: string;
  roleComponents: {
    [key in Role]?: React.ComponentType<any>;
  };
  defaultComponent?: React.ComponentType<any>;
  allowedRoles?: Role[];
  requiredPermissions?: Permission[];
  redirectOnDenied?: boolean;
}

/**
 * Enhanced client wrapper that combines RBAC with role-based component rendering
 */
export const EnhancedClientWrapper: React.FC<EnhancedClientWrapperProps> = ({
  locale,
  pagePath,
  roleComponents,
  defaultComponent,
  allowedRoles,
  requiredPermissions,
  redirectOnDenied = false,
}) => {
  return (
    <RBACPageWrapper
      pagePath={pagePath}
      allowedRoles={allowedRoles}
      requiredPermissions={requiredPermissions}
      redirectOnDenied={redirectOnDenied}
    >
      <RoleBasedPage
        roleComponents={roleComponents}
        defaultComponent={defaultComponent}
        props={{ locale }}
      />
    </RBACPageWrapper>
  );
};

// ==================== SPECIFIC WRAPPERS ====================

/**
 * Admin-only page wrapper
 */
export const AdminPageWrapper: React.FC<{
  children: React.ReactNode;
  pagePath: string;
  redirectOnDenied?: boolean;
}> = ({ children, pagePath, redirectOnDenied = true }) => {
  return (
    <RBACPageWrapper
      pagePath={pagePath}
      allowedRoles={[Role.ADMIN]}
      redirectOnDenied={redirectOnDenied}
    >
      {children}
    </RBACPageWrapper>
  );
};

/**
 * Supervisor or higher page wrapper
 */
export const SupervisorPageWrapper: React.FC<{
  children: React.ReactNode;
  pagePath: string;
  redirectOnDenied?: boolean;
}> = ({ children, pagePath, redirectOnDenied = true }) => {
  return (
    <RBACPageWrapper
      pagePath={pagePath}
      allowedRoles={[Role.SUPERVISOR, Role.ADMIN]}
      redirectOnDenied={redirectOnDenied}
    >
      {children}
    </RBACPageWrapper>
  );
};

/**
 * Permission-based page wrapper
 */
export const PermissionPageWrapper: React.FC<{
  children: React.ReactNode;
  pagePath: string;
  requiredPermissions: Permission[];
  redirectOnDenied?: boolean;
}> = ({ children, pagePath, requiredPermissions, redirectOnDenied = true }) => {
  return (
    <RBACPageWrapper
      pagePath={pagePath}
      requiredPermissions={requiredPermissions}
      redirectOnDenied={redirectOnDenied}
    >
      {children}
    </RBACPageWrapper>
  );
};

// ==================== EXPORT ====================

export default RBACPageWrapper;

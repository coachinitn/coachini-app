'use client';

import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/auth/hooks';

interface WithAuthOptions {
  requiredRoles?: string[];
  requiredPermissions?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
  fallback?: ComponentType;
}

/**
 * Higher-order component for protecting routes with authentication and authorization
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requiredRoles = [],
    requiredPermissions = [],
    redirectTo,
    requireAuth = true,
    fallback: FallbackComponent,
  } = options;

  const AuthenticatedComponent = (props: P) => {
    const {
      isAuthenticated,
      isLoading,
      hasRole,
      hasPermission,
      user,
    } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;

      // Check authentication requirement
      if (requireAuth && !isAuthenticated) {
        const currentPath = window.location.pathname + window.location.search;
        const loginUrl = redirectTo || `/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`;
        router.push(loginUrl);
        return;
      }

      // Check role requirements
      if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
        router.push(redirectTo || "/unauthorized");
        return;
      }

      // Check permission requirements
      if (requiredPermissions.length > 0 && !hasPermission(requiredPermissions)) {
        router.push(redirectTo || "/unauthorized");
        return;
      }
    }, [
      isLoading,
      isAuthenticated,
      hasRole,
      hasPermission,
      router,
    ]);

    // Show loading state
    if (isLoading) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    // Check authentication
    if (requireAuth && !isAuthenticated) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return null;
    }

    // Check role requirements
    if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return null;
    }

    // Check permission requirements
    if (requiredPermissions.length > 0 && !hasPermission(requiredPermissions)) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return null;
    }

    // All checks passed, render the component
    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}

/**
 * Convenience HOCs for common use cases
 */

// Require authentication only
export const withAuthRequired = <P extends object>(Component: ComponentType<P>) =>
  withAuth(Component, { requireAuth: true });

// Require admin role
export const withAdminRequired = <P extends object>(Component: ComponentType<P>) =>
  withAuth(Component, { 
    requireAuth: true, 
    requiredRoles: ['admin', 'super_admin'] 
  });

// Require coach role or higher
export const withCoachRequired = <P extends object>(Component: ComponentType<P>) =>
  withAuth(Component, { 
    requireAuth: true, 
    requiredRoles: ['coach', 'admin', 'super_admin'] 
  });

// Require student role or higher (basically any authenticated user)
export const withStudentRequired = <P extends object>(Component: ComponentType<P>) =>
  withAuth(Component, { 
    requireAuth: true, 
    requiredRoles: ['student', 'coach', 'admin', 'super_admin'] 
  });

import { PulseSpinner } from '@/design-system/ui/base/pulse-spinner';

/**
 * Loading component for auth checks
 */
export const AuthLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center p-8 rounded-lg border border-border bg-card shadow-sm">
      <PulseSpinner size="lg" className="mx-auto" />
      <p className="mt-6 text-foreground-muted font-medium">Checking authentication...</p>
    </div>
  </div>
);

/**
 * Unauthorized access component
 */
export const UnauthorizedAccess = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 text-red-600">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h2>
      <p className="mt-2 text-sm text-gray-600">
        You don't have permission to access this page.
      </p>
    </div>
  </div>
);

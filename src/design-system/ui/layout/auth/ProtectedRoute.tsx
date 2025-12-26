'use client';

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/auth/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallback?: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Protected Route Component
 * Wraps components that require authentication or specific roles/permissions
 */
export default function ProtectedRoute({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallback = <div>Loading...</div>,
  redirectTo,
  requireAuth = true,
}: ProtectedRouteProps) {
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
      router.push(redirectTo || "/auth/login");
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
    requiredRoles,
    requiredPermissions,
    requireAuth,
    redirectTo,
    router,
  ]);

  // Show loading state
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check roles
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <>{fallback}</>;
  }

  // Check permissions
  if (requiredPermissions.length > 0 && !hasPermission(requiredPermissions)) {
    return <>{fallback}</>;
  }

  // All checks passed, render children
  return <>{children}</>;
}

/**
 * Role-based wrapper component
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
}: {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}) {
  const { hasRole, isLoading } = useAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Permission-based wrapper component
 */
export function PermissionGuard({
  children,
  requiredPermissions,
  fallback = null,
}: {
  children: ReactNode;
  requiredPermissions: string[];
  fallback?: ReactNode;
}) {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!hasPermission(requiredPermissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Authentication wrapper component
 */
export function AuthGuard({
  children,
  fallback = <div>Please log in to access this content.</div>,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

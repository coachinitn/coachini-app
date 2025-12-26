'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useEffect } from "react";


/**
 * Client-side authentication hooks
 * These hooks provide authentication state and methods for client components
 */

/**
 * Main authentication hook
 * Provides user state, authentication status, and auth methods
 */
export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session && !(session as any)?.error;
  const user = session?.user || null;
  const hasTokenError = !!(session as any)?.error;

  // Handle token revocation errors
  useEffect(() => {
    if (hasTokenError && (session as any)?.error === 'TokenRevokedError') {
      console.warn('Token revocation detected in useAuth, forcing logout');
      signOut({ redirect: false }).then(() => {
        router.push('/auth/login');
      });
    }
  }, [hasTokenError, session, router]);

  // Handle token expiration and session errors
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError" || session?.error === "TokenRevokedError") {
      // Token refresh failed or token was revoked, redirect to login
      console.warn(`Token error detected: ${session.error}, redirecting to login`);

      // Prevent infinite loops by checking if we're already on the login page
      if (window.location.pathname.includes('/auth/login')) {
        console.log("Already on login page, skipping redirect");
        return;
      }

      // Clear any cached data immediately
      if (typeof window !== 'undefined') {
        localStorage.removeItem('next-auth.session-token');
        localStorage.removeItem('next-auth.callback-url');
        sessionStorage.clear();
      }

      signOut({ redirect: false }).then(() => {
        const currentPath = window.location.pathname + window.location.search;
        // Only redirect if not already on auth pages
        if (!currentPath.includes('/auth/')) {
          router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`);
        } else {
          router.push('/auth/login');
        }
      }).catch((error) => {
        console.error("Error during forced logout:", error);
        // Force redirect even if signOut fails
        window.location.href = '/auth/login';
      });
    }
  }, [session?.error, router]);

  // Note: Token expiration and validation is now handled server-side by NextAuth JWT callbacks
  // and the SessionMonitor component. This prevents duplicate validation logic and potential conflicts.
  // Client-side token access has been removed for security reasons.

  // Login function
  const login = useCallback(async (credentials: {
    emailOrUsername: string;
    password: string;
    rememberMe?: boolean;
    callbackUrl?: string;
  }) => {
    try {
      const result = await signIn("credentials", {
        emailOrUsername: credentials.emailOrUsername,
        password: credentials.password,
        rememberMe: credentials.rememberMe?.toString() || 'false',
        redirect: false,
        callbackUrl: credentials.callbackUrl,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return {
        success: true,
        url: result?.url // NextAuth provides the redirect URL
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Login failed"
      };
    }
  }, []);

  // Enhanced logout function with backend confirmation
  const logout = useCallback(async () => {
    try {
      // Call backend logout through the API proxy
      // The proxy will handle extracting tokens from the NextAuth session
      try {
        const response = await fetch('/api/proxy/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // The proxy will automatically add the refresh token from the session
          body: JSON.stringify({}),
        });

        if (response.ok) {
          console.log('[Logout] Backend logout successful');
        } else {
          console.warn('[Logout] Backend logout failed with status:', response.status);
        }
      } catch (backendError) {
        console.warn('[Logout] Backend logout failed, proceeding with frontend logout:', backendError);
        // Continue with frontend logout even if backend fails (graceful degradation)
      }

      // Then do NextAuth logout
      await signOut({ redirect: false });
      router.push("/auth/login");
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Logout failed"
      };
    }
  }, [router]);

  // Manual user data sync function
  const syncUserData = useCallback(async () => {
    try {
      await update();

      return { success: true };
    } catch (error: any) {
      console.error("Sync user data error:", error);
      return {
        success: false,
        error: error.message || "Sync failed"
      };
    }
  }, [update]);

  // Role checking functions
  const hasRole = useCallback((roles: string | string[]) => {
    if (!user?.roles) return false;
    
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.some(role => user.roles.includes(role));
  }, [user?.roles]);

  const hasPermission = useCallback((permissions: string | string[]) => {
    if (!user?.permissions) return false;
    
    const permissionsToCheck = Array.isArray(permissions) ? permissions : [permissions];
    return permissionsToCheck.some(permission => user.permissions.includes(permission));
  }, [user?.permissions]);

  const hasAnyRole = useCallback((roles: string[]) => {
    return hasRole(roles);
  }, [hasRole]);

  const hasAllRoles = useCallback((roles: string[]) => {
    if (!user?.roles) return false;
    return roles.every(role => user.roles.includes(role));
  }, [user?.roles]);

  const hasAnyPermission = useCallback((permissions: string[]) => {
    return hasPermission(permissions);
  }, [hasPermission]);

  const hasAllPermissions = useCallback((permissions: string[]) => {
    if (!user?.permissions) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  }, [user?.permissions]);

  // Convenience role checks
  const isAdmin = useMemo(() => hasRole("admin"), [hasRole]);
  const isCoach = useMemo(() => hasRole(["coach", "admin"]), [hasRole]);
  const isStudent = useMemo(() => hasRole(["student", "coach", "admin"]), [hasRole]);

  // Role hierarchy check
  const hasRoleOrHigher = useCallback((requiredRole: string) => {
    const roleHierarchy = {
      "student": 1,
      "coach": 2,
      "admin": 3,
    };
    
    if (!user?.roles) return false;
    
    const userHighestRole = Math.max(
      ...user.roles.map(role => roleHierarchy[role as keyof typeof roleHierarchy] || 0)
    );
    
    const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
    
    return userHighestRole >= requiredRoleLevel;
  }, [user?.roles]);

  return {
    // State
    session,
    user,
    isLoading,
    isAuthenticated,
    hasTokenError,

    // Methods
    login,
    logout,
    syncUserData,

    // Role checks
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    hasAnyPermission,
    hasAllPermissions,
    hasRoleOrHigher,

    // Convenience checks
    isAdmin,
    isCoach,
    isStudent,
  };
}

/**
 * Hook for role-based rendering
 */
export function useRoleGuard(allowedRoles: string | string[]) {
  const { hasRole, isLoading } = useAuth();
  
  const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasAccess = hasRole(rolesToCheck);
  
  return {
    hasAccess,
    isLoading,
    isAllowed: hasAccess && !isLoading,
  };
}

/**
 * Hook for permission-based rendering
 */
export function usePermissionGuard(requiredPermissions: string | string[]) {
  const { hasPermission, isLoading } = useAuth();
  
  const permissionsToCheck = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  const hasAccess = hasPermission(permissionsToCheck);
  
  return {
    hasAccess,
    isLoading,
    isAllowed: hasAccess && !isLoading,
  };
}

/**
 * Hook that redirects to login if not authenticated
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading && !isAuthenticated) {
    router.push("/auth/login");
  }

  return { isAuthenticated, isLoading };
}

/**
 * Hook that redirects if user doesn't have required roles
 */
export function useRequireRole(allowedRoles: string | string[]) {
  const { hasRole, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasAccess = hasRole(rolesToCheck);

  if (!isLoading && isAuthenticated && !hasAccess) {
    router.push("/unauthorized");
  }

  if (!isLoading && !isAuthenticated) {
    router.push("/auth/login");
  }

  return { hasAccess, isAuthenticated, isLoading };
}

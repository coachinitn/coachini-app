'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/core/auth/hooks';
import { PulseSpinner } from '@/design-system/ui/base/pulse-spinner';
import { getRequiredAccess as getRequiredAccessFromConfig } from '@/core/auth/config/routes';

interface RouteGuardProps {
  children: ReactNode;
}

// Route configuration is now centralized in @/auth/config/routes
// This component uses the centralized configuration

/**
 * Get the required access level for a given path
 * Uses centralized route configuration
 */
function getRequiredAccess(pathname: string): {
  requireAuth: boolean;
  requiredRoles?: string[];
} {
  return getRequiredAccessFromConfig(pathname);
}

/**
 * Route Guard Component
 * Handles client-side route protection and redirects
 */
export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if route is authorized
    const checkAuth = () => {
      const { requireAuth, requiredRoles } = getRequiredAccess(pathname);
      
      // If route doesn't require auth, allow access
      if (!requireAuth) {
        setAuthorized(true);
        return;
      }
      
      // If auth is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        setAuthorized(false);
        const callbackUrl = encodeURIComponent(pathname);
        router.push(`/auth/login?callbackUrl=${callbackUrl}`);
        return;
      }
      
      // If specific roles are required
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = hasRole(requiredRoles);
        if (!hasRequiredRole) {
          setAuthorized(false);
          router.push('/unauthorized');
          return;
        }
      }
      
      // All checks passed
      setAuthorized(true);
    };

    // Don't check auth on initial load
    if (isLoading) {
      return;
    }

    checkAuth();
  }, [pathname, isAuthenticated, isLoading, hasRole, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 rounded-lg border border-border bg-card shadow-sm">
          <PulseSpinner size="lg" className="mx-auto" />
          <p className="mt-6 text-foreground-muted font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while authorization is being checked
  if (!authorized && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 rounded-lg border border-border bg-card shadow-sm">
          <PulseSpinner size="lg" className="mx-auto" />
          <p className="mt-6 text-foreground-muted font-medium">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Render children if authorized
  return <>{children}</>;
}

/**
 * Hook to check if current route is accessible
 */
export function useRouteAccess() {
  const pathname = usePathname();
  const { isAuthenticated, hasRole } = useAuth();
  
  const { requireAuth, requiredRoles } = getRequiredAccess(pathname);
  
  const canAccess = () => {
    if (!requireAuth) return true;
    if (requireAuth && !isAuthenticated) return false;
    if (requiredRoles && !hasRole(requiredRoles)) return false;
    return true;
  };
  
  return {
    canAccess: canAccess(),
    requireAuth,
    requiredRoles,
    isPublicRoute: !requireAuth,
  };
}

/**
 * Component to conditionally render content based on route access
 */
export function ConditionalRoute({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  const { canAccess } = useRouteAccess();
  
  return canAccess ? <>{children}</> : <>{fallback}</>;
}

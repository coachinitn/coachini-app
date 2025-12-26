/**
 * Centralized Route Configuration
 * Single source of truth for all authentication and authorization route definitions
 *
 * ENTERPRISE SECURITY MODEL:
 * - DEFAULT: All routes are public (no authentication required)
 * - EXPLICIT PROTECTION: Only routes listed in protected/role arrays require authentication
 * - FAIL-SAFE: Unknown routes show 404 instead of redirecting to login
 * - SCALABLE: No need to manually list hundreds of public content routes
 */

export interface RouteConfig {
  // Public routes (optional - for documentation only, all unlisted routes are public by default)
  public: string[];

  // Protected routes that require authentication but no specific roles
  protected: string[];

  // Technician routes (absolute access to everything)
  technician: string[];

  // Admin routes (independent, no inheritance)
  admin: string[];

  // Supervisor routes (independent, no inheritance from coach)
  supervisor: string[];

  // Coach routes (independent, no inheritance from coachee)
  coach: string[];

  // Coachee routes (base user role)
  coachee: string[];
}


export const ROUTE_CONFIG: RouteConfig = {
  // Public routes (kept for explicit documentation, but all unlisted routes are public by default)
  // This list is now optional and mainly for documentation purposes
  public: [
    // Optional list for documentation purposes
    // All unlisted routes are public by default in the new model
  ],
  
  // Protected routes that require authentication but no specific roles
  protected: [
    '/dashboard', // Moved to public for testing
    '/profile',
    '/settings',
    '/hello', 
  ],
  
  // Technician routes (absolute access to everything)
  technician: [
    '/technician',
    '/system',
    '/maintenance',
  ],

  // Admin routes (independent, no inheritance)
  admin: [
    '/admin',
  ],

  // Supervisor routes (independent, no inheritance from coach)
  supervisor: [
    '/supervisor',
    '/oversight',
  ],

  // Coach routes (independent, no inheritance from coachee)
  coach: [
    '/coach',
    '/themes',
    '/programs',
  ],

  // Coachee routes (base user role)
  coachee: [
    '/coachee',
    '/scheduling',
    '/realtime',
  ],
};

/**
 * Role hierarchy for access control
 * Only Technician has absolute permissions over everything
 * Other roles are independent and don't inherit from each other
 */
export const ROLE_HIERARCHY: Record<string, string[]> = {
  'technician': ['admin', 'supervisor', 'coach', 'coachee'], // Technician has absolute permissions
  'admin': [], // Admin doesn't inherit from other roles
  'supervisor': [], // Supervisor doesn't inherit from coach
  'coach': [], // Coach doesn't inherit from coachee
  'coachee': [], // Base role with no inheritance
};

/**
 * Get all roles that can access a specific role-based route
 */
export function getAllowedRoles(targetRole: string): string[] {
  const roles: string[] = [targetRole];

  // Add all roles that inherit access to this role
  for (const [role, inherits] of Object.entries(ROLE_HIERARCHY)) {
    if (inherits.includes(targetRole)) {
      roles.push(role);
    }
  }

  return roles;
}

/**
 * Check if a path matches any route in the given array
 * Handles both exact matches and prefix matches
 */
export function matchesRoute(pathname: string, routes: string[]): boolean {
  // Safety check: if routes array is empty or undefined, return false
  if (!routes || routes.length === 0) {
    return false;
  }

  // Remove locale prefix for checking (e.g., /en/dashboard -> /dashboard)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

  return routes.some(route => {
    // Exact match for root path
    if (route === '/' && pathWithoutLocale === '/') {
      return true;
    }

    // Prefix match for sub-paths
    return pathWithoutLocale.startsWith(route + '/') || pathWithoutLocale === route;
  });
}

/**
 * Check if a route is explicitly listed as public
 * NOTE: In the new model, ALL routes are public by default
 * This function is mainly for documentation/explicit checking
 */
export function isPublicRoute(pathname: string): boolean {
  return matchesRoute(pathname, ROUTE_CONFIG.public);
}

/**
 * Check if a route is protected (requires authentication but no specific roles)
 */
export function isProtectedRoute(pathname: string): boolean {
  return matchesRoute(pathname, ROUTE_CONFIG.protected);
}

/**
 * Check if a route requires technician access
 */
export function isTechnicianRoute(pathname: string): boolean {
  return matchesRoute(pathname, ROUTE_CONFIG.technician);
}

/**
 * Check if a route requires admin access
 */
export function isAdminRoute(pathname: string): boolean {
  return matchesRoute(pathname, ROUTE_CONFIG.admin);
}

/**
 * Check if a route requires supervisor access
 */
export function isSupervisorRoute(pathname: string): boolean {
  return matchesRoute(pathname, ROUTE_CONFIG.supervisor);
}

/**
 * Check if a route requires coach access
 */
export function isCoachRoute(pathname: string): boolean {
  return matchesRoute(pathname, ROUTE_CONFIG.coach);
}

/**
 * Check if a route requires coachee access
 */
export function isCoacheeRoute(pathname: string): boolean {
  return matchesRoute(pathname, ROUTE_CONFIG.coachee);
}

/**
 * Get the required access level for a given path
 * Returns the authentication and role requirements
 */
export function getRequiredAccess(pathname: string): {
  requireAuth: boolean;
  requiredRoles?: string[];
  accessLevel: 'public' | 'protected' | 'technician' | 'admin' | 'supervisor' | 'coach' | 'coachee' | 'unknown';
} {
  if (isPublicRoute(pathname)) {
    return {
      requireAuth: false,
      accessLevel: 'public'
    };
  }

  // Technician has absolute access to everything, so check first
  if (isTechnicianRoute(pathname)) {
    return {
      requireAuth: true,
      requiredRoles: ['technician'], // Only technician can access technician routes
      accessLevel: 'technician'
    };
  }

  if (isAdminRoute(pathname)) {
    return {
      requireAuth: true,
      requiredRoles: getAllowedRoles('admin'), // Only admin + technician
      accessLevel: 'admin'
    };
  }

  if (isSupervisorRoute(pathname)) {
    return {
      requireAuth: true,
      requiredRoles: getAllowedRoles('supervisor'), // Only supervisor + technician
      accessLevel: 'supervisor'
    };
  }

  if (isCoachRoute(pathname)) {
    return {
      requireAuth: true,
      requiredRoles: getAllowedRoles('coach'), // Only coach + technician
      accessLevel: 'coach'
    };
  }

  if (isCoacheeRoute(pathname)) {
    return {
      requireAuth: true,
      requiredRoles: getAllowedRoles('coachee'), // Only coachee + technician
      accessLevel: 'coachee'
    };
  }

  if (isProtectedRoute(pathname)) {
    return {
      requireAuth: true,
      accessLevel: 'protected'
    };
  }

  // ENTERPRISE DEFAULT: Unknown routes are PUBLIC (show 404 if they don't exist)
  // This prevents the callback bug where non-existent routes redirect to login
  // Only explicitly defined protected/role routes require authentication
  return {
    requireAuth: false,
    accessLevel: 'public'
  };
}

/**
 * Get all routes that require authentication
 * Useful for middleware and other security checks
 */
export function getAllProtectedRoutes(): string[] {
  return [
    ...ROUTE_CONFIG.protected,
    ...ROUTE_CONFIG.technician,
    ...ROUTE_CONFIG.admin,
    ...ROUTE_CONFIG.supervisor,
    ...ROUTE_CONFIG.coach,
    ...ROUTE_CONFIG.coachee,
  ];
}

/**
 * Check if a user with given roles can access a path
 */
export function canUserAccessPath(pathname: string, userRoles: string[] = []): boolean {
  const { requireAuth, requiredRoles } = getRequiredAccess(pathname);
  
  // Public routes are always accessible
  if (!requireAuth) {
    return true;
  }
  
  // If authentication is required but no specific roles, any authenticated user can access
  if (requireAuth && !requiredRoles) {
    return true; // Assumes user is authenticated if this function is called
  }
  
  // Check if user has any of the required roles
  if (requiredRoles && requiredRoles.length > 0) {
    return userRoles.some(role => requiredRoles.includes(role));
  }
  
  return false;
}

/**
 * Development helper: Log route configuration
 */
export function logRouteConfig() {
  if (process.env.NODE_ENV === 'development') {
    console.group('🛡️ Route Configuration');
    console.log('Public routes:', ROUTE_CONFIG.public);
    console.log('Protected routes:', ROUTE_CONFIG.protected);
    console.log('Technician routes:', ROUTE_CONFIG.technician);
    console.log('Admin routes:', ROUTE_CONFIG.admin);
    console.log('Supervisor routes:', ROUTE_CONFIG.supervisor);
    console.log('Coach routes:', ROUTE_CONFIG.coach);
    console.log('Coachee routes:', ROUTE_CONFIG.coachee);
    console.log('All protected routes:', getAllProtectedRoutes());
    console.groupEnd();
  }
}

/**
 * Get public routes for SEO purposes (sitemap generation)
 * Filters out temporary testing routes that shouldn't be in sitemap
 */
export function getPublicRoutesForSEO(): string[] {
  return ROUTE_CONFIG.public.filter(route => {
    // Exclude auth routes from sitemap
    if (route.startsWith('/auth/')) return false;
    // Exclude dashboard if it's temporarily public for testing
    if (route === '/dashboard') return false;
    return true;
  });
}

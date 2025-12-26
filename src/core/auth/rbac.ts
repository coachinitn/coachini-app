import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-options";
import type { Session } from "next-auth";
import { Role, Permission } from "@/core/redux/features/user/slice";
import { userHasPermission } from "@/core/rbac/utils";

/**
 * Server-side authentication utilities
 * These functions run on the server and provide secure authentication checks
 */

/**
 * Require authentication for server components
 * Redirects to login if not authenticated
 */
export async function requireAuth(): Promise<Session> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/auth/login");
  }
  
  return session;
}

/**
 * Require specific roles for server components
 * Redirects to unauthorized page if user doesn't have required roles
 */
export async function requireRole(allowedRoles: Role[] | string[]): Promise<Session> {
  const session = await requireAuth();

  // Convert roles to strings for comparison
  const roleStrings = allowedRoles.map(role => typeof role === 'string' ? role : String(role));

  const hasRole = session.user.roles.some(role => roleStrings.includes(role));

  if (!hasRole) {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * Require specific permissions for server components
 * Redirects to unauthorized page if user doesn't have required permissions
 */
export async function requirePermission(requiredPermissions: Permission[] | string[]): Promise<Session> {
  const session = await requireAuth();

  // Convert permissions to strings for comparison
  const permissionStrings = requiredPermissions.map(permission =>
    typeof permission === 'string' ? permission : String(permission)
  );

  const hasPermission = permissionStrings.some(permission =>
    session.user.permissions?.includes(permission)
  );

  if (!hasPermission) {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * Check if user has specific role (returns boolean)
 */
export async function hasRole(roles: Role[] | string[]): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.roles) {
      return false;
    }

    // Convert roles to strings for comparison
    const roleStrings = roles.map(role => typeof role === 'string' ? role : String(role));

    return session.user.roles.some(role => roleStrings.includes(role));
  } catch {
    return false;
  }
}

/**
 * Check if user has specific permission (returns boolean)
 * Uses RBAC permission checking logic for consistency with client-side
 */
export async function hasPermission(permissions: Permission[] | string[]): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.roles) {
      return false;
    }

    // Convert session roles to Role enum types
    const userRoles = session.user.roles.map(roleString => roleString as Role).filter(role =>
      Object.values(Role).includes(role)
    );

    // Convert permissions to Permission enum types
    const permissionEnums = permissions.map(permission => {
      if (typeof permission === 'string') {
        // Try to find matching Permission enum value
        const enumValue = Object.values(Permission).find(p => String(p) === permission);
        return enumValue || permission as Permission;
      }
      return permission;
    }).filter(p => Object.values(Permission).includes(p));

    // Use RBAC logic to check permissions
    return permissionEnums.some(permission => userHasPermission(userRoles, permission));
  } catch {
    return false;
  }
}

/**
 * Get current session (returns null if not authenticated)
 */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    return await getServerSession(authOptions);
  } catch {
    return null;
  }
}

/**
 * Get current user (returns null if not authenticated)
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user || null;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole([Role.ADMIN]);
}

/**
 * Check if user is coach
 */
export async function isCoach(): Promise<boolean> {
  return await hasRole([Role.COACH, Role.ADMIN]);
}

/**
 * Check if user is student
 */
export async function isStudent(): Promise<boolean> {
  return await hasRole(["student", "coach", "admin"]);
}

/**
 * Role hierarchy check
 * Returns true if user has the required role or higher
 */
export async function hasRoleOrHigher(requiredRole: string): Promise<boolean> {
  const roleHierarchy = {
    "student": 1,
    "coach": 2,
    "admin": 3,
  };
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.roles) {
      return false;
    }
    
    const userHighestRole = Math.max(
      ...session.user.roles.map(role => roleHierarchy[role as keyof typeof roleHierarchy] || 0)
    );
    
    const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
    
    return userHighestRole >= requiredRoleLevel;
  } catch {
    return false;
  }
}

/**
 * Create server-side RBAC context from session
 * This provides the same interface as client-side useRBAC hook
 */
export async function getServerRBAC() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.roles) {
      return {
        userRoles: [],
        currentRole: null,
        isAuthenticated: false,
        hasRole: async (_roles: Role[] | string[]) => false,
        hasPermission: async (_permissions: Permission[] | string[]) => false,
        isAdmin: async () => false,
        isCoach: async () => false,
      };
    }

    // Convert session roles to Role enum types
    const userRoles = session.user.roles.map(roleString => roleString as Role).filter(role =>
      Object.values(Role).includes(role)
    );
    const currentRole = userRoles[0] || null;

    return {
      userRoles,
      currentRole,
      isAuthenticated: true,
      hasRole: async (roles: Role[] | string[]) => hasRole(roles),
      hasPermission: async (permissions: Permission[] | string[]) => hasPermission(permissions),
      isAdmin: async () => isAdmin(),
      isCoach: async () => isCoach(),
      session,
    };
  } catch {
    return {
      userRoles: [],
      currentRole: null,
      isAuthenticated: false,
      hasRole: async (_roles: Role[] | string[]) => false,
      hasPermission: async (_permissions: Permission[] | string[]) => false,
      isAdmin: async () => false,
      isCoach: async () => false,
      session: null,
    };
  }
}

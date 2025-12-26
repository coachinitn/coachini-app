'use client';

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { apiRequest } from '@/lib/api-client';

/**
 * React Query hooks with authentication integration
 */

/**
 * Authenticated query hook
 * Automatically includes authentication and only runs when user is authenticated
 */
export function useAuthenticatedQuery<T>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const { data: session, status } = useSession();
  
  return useQuery({
    queryKey,
    queryFn: () => apiRequest<T>(endpoint),
    enabled: status === 'authenticated' && !!session && (options?.enabled !== false),
    ...options,
  });
}

/**
 * Authenticated mutation hook
 * Automatically includes authentication for mutations
 */
export function useAuthenticatedMutation<TData, TVariables>(
  endpoint: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: TVariables) =>
      apiRequest<TData>(endpoint, {
        method: 'POST',
        body: JSON.stringify(variables),
      }),
    ...options,
  });
}

/**
 * Role-based query hook
 * Only runs if user has required roles
 */
export function useRoleBasedQuery<T>(
  queryKey: string[],
  endpoint: string,
  requiredRoles: string[],
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const { data: session, status } = useSession();
  
  const hasRequiredRole = session?.user?.roles?.some(role => 
    requiredRoles.includes(role)
  ) || false;
  
  return useQuery({
    queryKey,
    queryFn: () => apiRequest<T>(endpoint),
    enabled: status === 'authenticated' && hasRequiredRole && (options?.enabled !== false),
    ...options,
  });
}

/**
 * Permission-based query hook
 * Only runs if user has required permissions
 */
export function usePermissionBasedQuery<T>(
  queryKey: string[],
  endpoint: string,
  requiredPermissions: string[],
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const { data: session, status } = useSession();
  
  const hasRequiredPermission = session?.user?.permissions?.some(permission => 
    requiredPermissions.includes(permission)
  ) || false;
  
  return useQuery({
    queryKey,
    queryFn: () => apiRequest<T>(endpoint),
    enabled: status === 'authenticated' && hasRequiredPermission && (options?.enabled !== false),
    ...options,
  });
}

/**
 * User profile query hook
 */
export function useUserProfile() {
  return useAuthenticatedQuery<any>(
    ['user', 'profile'],
    '/auth/profile',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
    }
  );
}

/**
 * Admin-only query hook
 */
export function useAdminQuery<T>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useRoleBasedQuery(queryKey, endpoint, ['admin'], options);
}

/**
 * Coach-only query hook
 */
export function useCoachQuery<T>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useRoleBasedQuery(queryKey, endpoint, ['coach', 'admin'], options);
}

/**
 * Student-only query hook
 */
export function useStudentQuery<T>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useRoleBasedQuery(queryKey, endpoint, ['student', 'coach', 'admin'], options);
}

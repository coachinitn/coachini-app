'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { apiRequest } from '@/lib/api-client';
import { useCallback } from 'react';

/**
 * Hook for syncing user data with the backend
 * Provides both automatic and manual sync capabilities
 */
export function useUserSync() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  // Query for user profile data
  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user', 'profile', session?.user?.id],
    queryFn: () => apiRequest<any>('/auth/profile'),
    enabled: status === 'authenticated' && !!session,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Manual sync function
  const syncUserData = useCallback(async () => {
    try {
      // Refetch the profile data
      const result = await refetch();
      
      if (result.data) {
        // Invalidate all user-related queries to force refresh
        await queryClient.invalidateQueries({
          queryKey: ['user'],
        });
        
        return { success: true, data: result.data };
      }
      
      return { success: false, error: 'No data received' };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Sync failed' 
      };
    }
  }, [refetch, queryClient]);

  // Check if user data has changed compared to session
  const hasDataChanged = useCallback(() => {
    if (!session?.user || !profileData) return false;
    
    return (
      session.user.name !== profileData.name ||
      session.user.username !== profileData.username ||
      session.user.avatar !== profileData.avatar ||
      JSON.stringify(session.user.roles) !== JSON.stringify(profileData.userRoles?.map((ur: any) => ur.role.name))
    );
  }, [session?.user, profileData]);

  return {
    // Data
    profileData,
    isLoading,
    error,
    hasDataChanged: hasDataChanged(),
    
    // Methods
    syncUserData,
    refetch,
  };
}

/**
 * Hook for automatic user data synchronization
 * Automatically syncs when data changes are detected
 */
export function useAutoUserSync(options: {
  enabled?: boolean;
  interval?: number; // in milliseconds
} = {}) {
  const { enabled = true, interval = 5 * 60 * 1000 } = options; // Default 5 minutes
  const { syncUserData, hasDataChanged } = useUserSync();

  // Auto-sync when data changes are detected
  useQuery({
    queryKey: ['user', 'auto-sync'],
    queryFn: async () => {
      if (hasDataChanged) {
        await syncUserData();
      }
      return null;
    },
    enabled: enabled && hasDataChanged,
    refetchInterval: interval,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    hasDataChanged,
    syncUserData,
  };
}

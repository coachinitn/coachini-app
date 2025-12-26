'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SessionMonitor from "@/design-system/ui/layout/auth/SessionMonitor";
import { SECURITY_CONFIG } from "@/core/auth/config/security";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Global App Providers
 * Includes NextAuth SessionProvider and React Query for global data fetching
 */
export function Providers({ children }: ProvidersProps) {
  // Create QueryClient with optimized defaults
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Global defaults for all queries
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
        retry: (failureCount, error: any) => {
          // Don't retry on auth errors
          if (error?.status === 401 || error?.status === 403) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        refetchOnWindowFocus: false, // Disable for better UX
        refetchOnMount: true,
        refetchOnReconnect: true,
      },
      mutations: {
        // Global defaults for mutations
        retry: false, // Don't retry mutations by default
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider
        // Use security configuration for refetch interval
        refetchInterval={SECURITY_CONFIG.sessionRefetchInterval}
        // Disable window focus refetch for better performance
        refetchOnWindowFocus={false}
      >
        <SessionMonitor />
        {children}

        {/* React Query DevTools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools
            initialIsOpen={false}
          />
        )}
      </SessionProvider>
    </QueryClientProvider>
  );
}

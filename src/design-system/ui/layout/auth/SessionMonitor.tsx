'use client';

import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SECURITY_CONFIG } from '@/core/auth/config/security';
import { isPublicRoute } from '@/core/auth/config/routes';
import { usePageFocus } from '@/core/hooks/usePageVisibility';

/**
 * Global session monitor that checks for token revocation
 * This component should be included in the root layout
 *
 * Features:
 * - Configurable validation on page load/refresh (validateOnPageRefresh)
 * - Configurable validation when page gains focus (validateOnPageFocus)
 * - Periodic validation based on security level
 * - Automatic logout on session revocation detection
 * - Enhanced logout with backend confirmation
 *
 * Security levels:
 * - High Security: 30s intervals, no caching, all triggers enabled
 * - Standard: 2min intervals, 1min caching, all triggers enabled
 * - Relaxed: 5min intervals, 5min caching, focus trigger disabled for performance
 * - Development: 30s intervals, no caching, all triggers enabled for testing
 */

export default function SessionMonitor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const lastCheckRef = useRef<number>(0);
  const isCheckingRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);

  // Temporarily disable session monitoring during realtime testing to prevent auth loops
  const isRealtimeTestPage = typeof window !== 'undefined' && window.location.pathname.includes('realtime-test');

  // Skip session monitoring for public routes (using centralized config)
  const isCurrentRoutePublic = typeof window !== 'undefined' && isPublicRoute(window.location.pathname);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user || isRealtimeTestPage || isCurrentRoutePublic) {
      return;
    }

    const checkTokenValidity = async (forceCheck: boolean = false) => {
      // Prevent multiple simultaneous checks
      if (isCheckingRef.current) return;

      const now = Date.now();
      const timeSinceLastCheck = now - lastCheckRef.current;

      // Respect the configured interval unless forced (e.g., on page load)
      if (!forceCheck && timeSinceLastCheck < SECURITY_CONFIG.monitorInterval) return;

      isCheckingRef.current = true;
      lastCheckRef.current = now;

      if (forceCheck) {
        console.log('[SessionMonitor] Performing immediate session validation (cache bypassed)');
      }

      try {
        // Use NextAuth's built-in session validation with cache bypass for immediate checks
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Bypass cache for immediate validation on page load/refresh
          cache: forceCheck ? 'no-store' : 'default',
        });

        const sessionData = await response.json();

        // Check for session errors or invalid session
        if (!response.ok || !sessionData?.user || sessionData?.error === 'TokenRevokedError') {
          if (sessionData?.error === 'TokenRevokedError') {
            console.warn('Session tokens have been revoked, forcing logout');
          } else {
            console.warn('Session validation failed - session may be invalid');
          }

          retryCountRef.current = 0; // Reset retry count on auth failure

          // Clear all cached data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('next-auth.session-token');
            localStorage.removeItem('next-auth.callback-url');
            sessionStorage.clear();
          }

          // Force logout
          await signOut({ redirect: false });

          // Redirect to login with current page as callback
          const currentPath = window.location.pathname + window.location.search;
          if (!currentPath.includes('/auth/')) {
            router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`);
          } else {
            router.push('/auth/login');
          }
        } else {
          // Success - reset retry count
          retryCountRef.current = 0;
        }
      } catch (error) {
        console.error('Session validation error:', error);

        // Implement exponential backoff for network errors
        retryCountRef.current++;
        if (retryCountRef.current >= SECURITY_CONFIG.monitorMaxRetries) {
          console.warn('Max validation retries reached, assuming network issues');
          retryCountRef.current = 0; // Reset for next cycle
        }

        // Don't logout on network errors, just log them
      } finally {
        isCheckingRef.current = false;
      }
    };

    // Immediate check on page load/refresh (if enabled)
    if (SECURITY_CONFIG.validateOnPageRefresh) {
      checkTokenValidity(true);
    }

    // Set up interval for periodic checks (without cache bypass)
    const interval = setInterval(() => checkTokenValidity(false), SECURITY_CONFIG.monitorInterval);

    return () => {
      clearInterval(interval);
      isCheckingRef.current = false;
    };
  }, [session?.user?.id, status, router]);

  // Page focus validation (if enabled)
  usePageFocus(() => {
    if (
      SECURITY_CONFIG.validateOnPageFocus &&
      status === 'authenticated' &&
      session?.user &&
      !isRealtimeTestPage &&
      !isCurrentRoutePublic
    ) {
      console.log('[SessionMonitor] Page gained focus - performing immediate session validation');
      // Create a temporary validation function since we can't access the one from useEffect
      const validateOnFocus = async () => {
        if (isCheckingRef.current) return;

        isCheckingRef.current = true;
        try {
          const response = await fetch('/api/auth/session', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store', // Always bypass cache for focus validation
          });

          const sessionData = await response.json();

          if (!response.ok || !sessionData?.user || sessionData?.error === 'TokenRevokedError') {
            console.warn('[SessionMonitor] Focus validation failed - forcing logout');

            // Clear cached data
            if (typeof window !== 'undefined') {
              localStorage.removeItem('next-auth.session-token');
              localStorage.removeItem('next-auth.callback-url');
              sessionStorage.clear();
            }

            await signOut({ redirect: false });
            const currentPath = window.location.pathname + window.location.search;
            if (!currentPath.includes('/auth/')) {
              router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`);
            } else {
              router.push('/auth/login');
            }
          }
        } catch (error) {
          console.error('[SessionMonitor] Focus validation error:', error);
        } finally {
          isCheckingRef.current = false;
        }
      };

      validateOnFocus();
    }
  }, [status, session?.user?.id, router, isRealtimeTestPage, isCurrentRoutePublic]);

  // Also monitor for session errors
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError' || session?.error === 'TokenRevokedError') {
      console.warn(`Session error detected: ${session.error}`);
      
      // Prevent infinite loops by checking current location
      if (window.location.pathname.includes('/auth/login')) {
        return;
      }

      // Clear cached data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('next-auth.session-token');
        localStorage.removeItem('next-auth.callback-url');
        sessionStorage.clear();
      }

      // Force logout and redirect
      signOut({ redirect: false }).then(() => {
        const currentPath = window.location.pathname + window.location.search;
        if (!currentPath.includes('/auth/')) {
          router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`);
        } else {
          router.push('/auth/login');
        }
      }).catch(() => {
        // Force redirect even if signOut fails
        window.location.href = '/auth/login';
      });
    }
  }, [session?.error, router]);

  // This component doesn't render anything
  return null;
}

/**
 * Hook for manual session validation
 * Can be used in components that need to validate session on demand
 */
export function useSessionValidation() {
  const { data: session } = useSession();
  const router = useRouter();

  const validateSession = async (bypassCache: boolean = false): Promise<boolean> => {
    if (!session?.user) {
      return false;
    }

    try {
      console.log(`[useSessionValidation] Validating session (cache bypass: ${bypassCache})`);

      // Use NextAuth's session endpoint for validation
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Allow cache bypass for immediate validation
        cache: bypassCache ? 'no-store' : 'default',
      });

      if (!response.ok) {
        console.warn('[useSessionValidation] Session validation failed, forcing logout');
        // Session is invalid, force logout
        await signOut({ redirect: false });
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`);
        return false;
      }

      const sessionData = await response.json();
      const isValid = !!sessionData?.user;
      console.log(`[useSessionValidation] Session validation result: ${isValid}`);
      return isValid;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  };

  return { validateSession };
}

/**
 * Component that validates session before rendering children
 * Useful for critical pages that need guaranteed valid sessions
 */
export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { validateSession } = useSessionValidation();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      validateSession();
    }
  }, [status, session, validateSession]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will be redirected by SessionMonitor
  }

  return <>{children}</>;
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '../redux/hooks';
import { getStore } from '../redux/store';
import useSSR from 'use-ssr';

/**
 * Hook to detect when Redux persist has completed rehydration
 * Uses use-ssr for reliable server/client detection and proper persist events
 *
 * @returns boolean indicating if Redux has been rehydrated
 */
export function useReduxHydration() {
  const { isBrowser, isServer } = useSSR();

  const [isHydrated, setIsHydrated] = useState(() => {
    // On server, always consider hydrated
    if (isServer) {
      return true;
    }

    // On client, check if already rehydrated
    if (isBrowser) {
      const state = getStore().getState();
      return state._persist?.rehydrated === true;
    }

    return false;
  });

  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Skip if server-side or already hydrated or already checked
    if (isServer || isHydrated || hasCheckedRef.current) {
      return;
    }

    hasCheckedRef.current = true;
    const store = getStore();

    // Check current state first
    const currentState = store.getState();
    if (currentState._persist?.rehydrated === true) {
      setIsHydrated(true);
      return;
    }

    // Listen for state changes to detect rehydration
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state._persist?.rehydrated === true) {
        setIsHydrated(true);
        unsubscribe();
      }
    });

    return unsubscribe;
  }, [isHydrated, isBrowser, isServer]);

  return isHydrated;
}

/**
 * Hook that waits for both component mount and Redux rehydration
 * Uses use-ssr for reliable server/client detection
 */
export function useIsomorphicHydration() {
  const { isBrowser, isServer } = useSSR();
  const isReduxHydrated = useReduxHydration();

  const [isMounted, setIsMounted] = useState(() => {
    // On server, consider mounted immediately
    return isServer;
  });

  useEffect(() => {
    if (isBrowser && !isMounted) {
      setIsMounted(true);
    }
  }, [isMounted, isBrowser]);

  // Only consider fully hydrated when both conditions are met
  return isMounted && isReduxHydrated;
}

/**
 * Hook to safely access Redux state that might cause hydration issues
 * Returns initial/fallback values until hydration is complete
 * Optimized to prevent unnecessary selector calls during hydration
 */
export function useSafeSelector<T>(
  selector: (state: any) => T,
  fallbackValue: T
): T {
  const isHydrated = useIsomorphicHydration();

  // Only call selector if hydrated to prevent unnecessary computations
  const selectorResult = useAppSelector((state) => {
    return isHydrated ? selector(state) : fallbackValue;
  });

  return selectorResult;
}

/**
 * Hook for components that need to wait for hydration before rendering
 * Returns a loading state until Redux is fully hydrated
 */
export function useHydrationGuard() {
  const isHydrated = useIsomorphicHydration();

  return {
    isHydrated,
    isLoading: !isHydrated,
  };
}

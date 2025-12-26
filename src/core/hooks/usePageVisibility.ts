'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * Hook that tracks page visibility state using the Page Visibility API
 * 
 * @returns {object} Object containing visibility state and event handlers
 * @returns {boolean} isVisible - Whether the page is currently visible
 * @returns {function} onVisibilityChange - Callback for visibility changes
 * @returns {function} onPageFocus - Callback for when page becomes visible (focus)
 * @returns {function} onPageBlur - Callback for when page becomes hidden (blur)
 * 
 * @example
 * ```tsx
 * const { isVisible, onPageFocus } = usePageVisibility();
 * 
 * onPageFocus(() => {
 *   console.log('Page gained focus - validate session');
 * });
 * ```
 */
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === 'undefined') return true;
    return !document.hidden;
  });

  const [focusCallbacks, setFocusCallbacks] = useState<(() => void)[]>([]);
  const [blurCallbacks, setBlurCallbacks] = useState<(() => void)[]>([]);
  const [changeCallbacks, setChangeCallbacks] = useState<((isVisible: boolean) => void)[]>([]);

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    const visible = !document.hidden;
    setIsVisible(visible);

    // Call registered callbacks
    changeCallbacks.forEach(callback => callback(visible));
    
    if (visible) {
      focusCallbacks.forEach(callback => callback());
    } else {
      blurCallbacks.forEach(callback => callback());
    }
  }, [focusCallbacks, blurCallbacks, changeCallbacks]);

  // Register callbacks
  const onPageFocus = useCallback((callback: () => void) => {
    setFocusCallbacks(prev => [...prev, callback]);
    
    // Return cleanup function
    return () => {
      setFocusCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  }, []);

  const onPageBlur = useCallback((callback: () => void) => {
    setBlurCallbacks(prev => [...prev, callback]);
    
    // Return cleanup function
    return () => {
      setBlurCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  }, []);

  const onVisibilityChange = useCallback((callback: (isVisible: boolean) => void) => {
    setChangeCallbacks(prev => [...prev, callback]);
    
    // Return cleanup function
    return () => {
      setChangeCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Add event listener for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also listen for window focus/blur as fallback
    const handleWindowFocus = () => {
      if (!document.hidden) {
        setIsVisible(true);
        focusCallbacks.forEach(callback => callback());
      }
    };

    const handleWindowBlur = () => {
      setIsVisible(false);
      blurCallbacks.forEach(callback => callback());
    };

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [handleVisibilityChange, focusCallbacks, blurCallbacks]);

  return {
    isVisible,
    onPageFocus,
    onPageBlur,
    onVisibilityChange,
  };
}

/**
 * Simplified hook that just returns the visibility state
 * 
 * @returns {boolean} Whether the page is currently visible
 * 
 * @example
 * ```tsx
 * const isVisible = useIsPageVisible();
 * 
 * useEffect(() => {
 *   if (isVisible) {
 *     // Page became visible
 *   }
 * }, [isVisible]);
 * ```
 */
export function useIsPageVisible(): boolean {
  const { isVisible } = usePageVisibility();
  return isVisible;
}

/**
 * Hook that executes a callback when the page becomes visible
 * 
 * @param callback - Function to execute when page becomes visible
 * @param deps - Dependencies array for the callback
 * 
 * @example
 * ```tsx
 * usePageFocus(() => {
 *   validateSession();
 * }, [validateSession]);
 * ```
 */
export function usePageFocus(callback: () => void, deps: React.DependencyList = []) {
  const { onPageFocus } = usePageVisibility();

  useEffect(() => {
    const cleanup = onPageFocus(callback);
    return cleanup;
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Hook that executes a callback when the page becomes hidden
 * 
 * @param callback - Function to execute when page becomes hidden
 * @param deps - Dependencies array for the callback
 * 
 * @example
 * ```tsx
 * usePageBlur(() => {
 *   pauseTimers();
 * }, [pauseTimers]);
 * ```
 */
export function usePageBlur(callback: () => void, deps: React.DependencyList = []) {
  const { onPageBlur } = usePageVisibility();

  useEffect(() => {
    const cleanup = onPageBlur(callback);
    return cleanup;
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

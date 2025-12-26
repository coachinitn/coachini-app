'use client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { getStore } from '../redux/store';
import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { setDeviceInfo, initialize, updateSetting } from '../redux/features/appConfig/slice';
import { siteConfig } from '@/core/config/siteConfig';
import useSSR from 'use-ssr';

/**
 * Optimized Redux Provider that eliminates hydration flash
 * Uses use-ssr hook for reliable server/client detection
 */
export function ReduxProvider({ children }: { children: ReactNode }) {
  // Reliable server/client detection
  const { isBrowser } = useSSR();

  // Create store only once
  const store = useMemo(() => getStore(), []);

  // Create persistor ref to avoid recreating it
  const persistorRef = useRef<any>(null);

  // Initialize persistor only on client side
  useEffect(() => {
    if (isBrowser && !persistorRef.current) {
      persistorRef.current = persistStore(store);
    }
  }, [store, isBrowser]);

  // Initialize app state lazily after mount
  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    // Initialize app store
    store.dispatch(initialize());

    // Lazy initialization to avoid blocking hydration
    const initializeAsync = () => {
      // Add event listeners for online/offline status
      const handleOnline = () => {
        store.dispatch(setDeviceInfo({ isOnline: true }));
      };

      const handleOffline = () => {
        store.dispatch(setDeviceInfo({ isOnline: false }));
      };

      // Add resize listener to update device info
      const handleResize = () => {
        const width = window.innerWidth;
        const isMobile = width < 768;

        let screenSize: 'sm' | 'md' | 'lg' | 'xl' = 'lg';
        if (width < 640) screenSize = 'sm';
        else if (width < 768) screenSize = 'md';
        else if (width < 1024) screenSize = 'lg';
        else screenSize = 'xl';

        store.dispatch(setDeviceInfo({
          isMobile,
          screenSize
        }));
      };

      // Initialize device-specific settings only (no locale/theme management)
      const initializeDeviceSettings = () => {
        // Only handle device-specific settings, let next-intl handle locale
        // and next-themes handle theme
      };

      // Call handlers once to initialize
      handleResize();
      initializeDeviceSettings();

      // Add event listeners
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('resize', handleResize);

      // Return cleanup function
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('resize', handleResize);
      };
    };

    // Initialize after a short delay to avoid blocking
    const timeoutId = setTimeout(initializeAsync, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [store, isBrowser]);

  // Use use-ssr for consistent server/client rendering
  return (
    <Provider store={store}>
      {isBrowser && persistorRef.current ? (
        <PersistGate
          loading={null}
          persistor={persistorRef.current}
        >
          {children}
        </PersistGate>
      ) : (
        // Server-side or before persistor is ready
        children
      )}
    </Provider>
  );
}

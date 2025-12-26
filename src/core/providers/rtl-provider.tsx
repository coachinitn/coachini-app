'use client';

import { ReactNode } from 'react';

interface DirectionProviderProps {
  children: ReactNode;
}

/**
 * @deprecated RTLProvider is deprecated and will be removed in a future version.
 *
 * RTL direction is now handled server-side in layout.tsx using:
 * ```typescript
 * const isRTL = siteConfig.rtlLanguages.includes(locale);
 * const dir = isRTL ? 'rtl' : 'ltr';
 * <html dir={dir}>
 * ```
 *
 * This approach is better because:
 * - No hydration mismatches
 * - Better performance (no client-side DOM manipulation)
 * - SSR-friendly (direction set before page renders)
 * - Single source of truth
 *
 * Please remove <RTLProvider> from your component tree.
 */
export function RTLProvider({ children }: DirectionProviderProps) {
  console.warn(
    '⚠️ RTLProvider is deprecated. RTL direction is now handled server-side in layout.tsx. ' +
    'Please remove <RTLProvider> from your component tree.'
  );

  // Just pass through children without any RTL logic
  return <>{children}</>;
}
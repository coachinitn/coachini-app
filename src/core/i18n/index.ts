/**
 * Core internationalization (i18n) module
 * Centralizes all i18n-related functionality
 */
export * from './i18n-config';
export * from './navigation';
export * from './generated-types';
export * from './useTypedTranslations';
export * from './metadata';

/**
 * Server-side only exports
 * Uses dynamic imports to prevent client-side bundle bloat
 */
if (typeof window === 'undefined') {
  const exportServerOnly = async () => {
    const { loadMessages } = await import('./loadMessages');
    
    Object.defineProperty(exports, 'loadMessages', {
      enumerable: true,
      get: () => loadMessages
    });
  };
  
  exportServerOnly().catch(err => 
    console.error('Error loading server-side i18n modules:', err)
  );
} 
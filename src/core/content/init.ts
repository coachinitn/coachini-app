/**
 * Content System Initialization
 *
 * Registers all content types and initializes the content system.
 * Uses singleton pattern to prevent re-initialization.
 */

import { registerContentType } from './registry';
import { blogContentType } from './types/blog';
import { changelogContentType } from './types/changelog';
import { pagesContentType } from './types/pages';

// Track initialization state
let isInitialized = false;

/**
 * Initialize the content system by registering all content types
 * Uses singleton pattern to prevent multiple initializations
 */
export function initializeContentSystem(): void {
  // Skip if already initialized
  if (isInitialized) {
    return;
  }

  try {
    // Register blog content type
    registerContentType(blogContentType, {
      override: true, // Allow re-registration during development
      validate: true,
      autoRegisterRoutes: true,
    });

    // Register changelog content type
    registerContentType(changelogContentType, {
      override: true,
      validate: true,
      autoRegisterRoutes: true,
    });

    // Register static pages content type
    registerContentType(pagesContentType, {
      override: true,
      validate: true,
      autoRegisterRoutes: true,
    });

    // Mark as initialized
    isInitialized = true;

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Content system initialized successfully');
    }
  } catch (error) {
    console.error('❌ Failed to initialize content system:', error);
    throw error;
  }
}

/**
 * Get all registered content types for debugging
 */
export function getRegisteredContentTypes() {
  const { getAllContentTypes } = require('./registry');
  return getAllContentTypes();
}

/**
 * Validate content system integrity
 */
export function validateContentSystem(): boolean {
  try {
    const { getRegistryStatistics } = require('./registry');
    const stats = getRegistryStatistics();
    
    // Check that we have the expected content types
    const expectedTypes = ['blog', 'changelog'];
    const registeredTypes = stats.typeIds;
    
    const missingTypes = expectedTypes.filter(type => !registeredTypes.includes(type));
    
    if (missingTypes.length > 0) {
      console.error('Missing content types:', missingTypes);
      return false;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Content system validation passed:', stats);
    }
    
    return true;
  } catch (error) {
    console.error('Content system validation failed:', error);
    return false;
  }
}

/**
 * Re-initialize content system (useful for development)
 */
export function reinitializeContentSystem(): void {
  const { clearRegistry } = require('./registry');
  clearRegistry();
  isInitialized = false; // Reset initialization flag
  initializeContentSystem();
}

// Auto-initialize when this module is imported
// This ensures content types are registered as soon as the module loads
if (typeof window === 'undefined') {
  // Only initialize on server-side to avoid issues with SSR
  initializeContentSystem();
}

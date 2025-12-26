/**
 * Content Type Registry
 * 
 * Central registry for managing different content types in the application.
 * Provides registration, retrieval, and validation of content type configurations.
 */

import { 
  ContentTypeConfig, 
  ContentTypeRegistry, 
  ContentTypeRegistrationOptions,
  ContentFrontmatter 
} from './types';

/**
 * Global content type registry
 */
const contentTypeRegistry: ContentTypeRegistry = {};

/**
 * Register a new content type
 */
export function registerContentType<T extends ContentFrontmatter>(
  config: ContentTypeConfig<T>,
  options: ContentTypeRegistrationOptions = {}
): void {
  const { override = false, validate = true, autoRegisterRoutes = true } = options;

  // Check if content type already exists
  if (contentTypeRegistry[config.id] && !override) {
    throw new Error(`Content type '${config.id}' is already registered. Use override option to replace.`);
  }

  // Validate configuration if requested
  if (validate) {
    validateContentTypeConfig(config);
  }

  // Register the content type
  contentTypeRegistry[config.id] = config;

  // Log registration in development (only if not already registered)
  if (process.env.NODE_ENV === 'development' && !override) {
    console.log(`📝 Registered content type: ${config.name} (${config.id})`);
  }

  // Auto-register routes if enabled
  if (autoRegisterRoutes) {
    // This will be implemented when we create the routing system
    // registerContentTypeRoutes(config);
  }
}

/**
 * Get a content type configuration by ID
 */
export function getContentTypeConfig<T extends ContentFrontmatter = ContentFrontmatter>(
  contentTypeId: string
): ContentTypeConfig<T> {
  const config = contentTypeRegistry[contentTypeId];
  
  if (!config) {
    throw new Error(`Content type '${contentTypeId}' is not registered.`);
  }
  
  return config as ContentTypeConfig<T>;
}

/**
 * Get all registered content types
 */
export function getAllContentTypes(): ContentTypeRegistry {
  return { ...contentTypeRegistry };
}

/**
 * Get all registered content type IDs
 */
export function getContentTypeIds(): string[] {
  return Object.keys(contentTypeRegistry);
}

/**
 * Check if a content type is registered
 */
export function isContentTypeRegistered(contentTypeId: string): boolean {
  return contentTypeId in contentTypeRegistry;
}

/**
 * Unregister a content type
 */
export function unregisterContentType(contentTypeId: string): boolean {
  if (contentTypeRegistry[contentTypeId]) {
    delete contentTypeRegistry[contentTypeId];
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🗑️ Unregistered content type: ${contentTypeId}`);
    }
    
    return true;
  }
  
  return false;
}

/**
 * Get content types by feature
 */
export function getContentTypesByFeature(feature: keyof ContentTypeConfig['features']): ContentTypeConfig[] {
  return Object.values(contentTypeRegistry).filter(config => config.features[feature]);
}

/**
 * Get content types by base path pattern
 */
export function getContentTypeByBasePath(basePath: string): ContentTypeConfig | null {
  return Object.values(contentTypeRegistry).find(config => config.basePath === basePath) || null;
}

/**
 * Validate content type configuration
 */
function validateContentTypeConfig<T extends ContentFrontmatter>(
  config: ContentTypeConfig<T>
): void {
  const errors: string[] = [];

  // Required fields validation
  if (!config.id || typeof config.id !== 'string') {
    errors.push('Content type ID is required and must be a string');
  }

  if (!config.name || typeof config.name !== 'string') {
    errors.push('Content type name is required and must be a string');
  }

  if (!config.directory || typeof config.directory !== 'string') {
    errors.push('Content type directory is required and must be a string');
  }

  if (!config.basePath || typeof config.basePath !== 'string') {
    errors.push('Content type basePath is required and must be a string');
  }

  // ID format validation
  if (config.id && !/^[a-z][a-z0-9-]*$/.test(config.id)) {
    errors.push('Content type ID must start with a letter and contain only lowercase letters, numbers, and hyphens');
  }

  // Base path validation
  if (config.basePath && !config.basePath.startsWith('/')) {
    errors.push('Content type basePath must start with a forward slash');
  }

  // Schema validation
  if (!config.frontmatterSchema) {
    errors.push('Content type frontmatter schema is required');
  }

  // Components validation
  if (!config.components) {
    errors.push('Content type components configuration is required');
  } else {
    if (!config.components.listLayout) {
      errors.push('Content type listLayout component is required');
    }
    if (!config.components.detailLayout) {
      errors.push('Content type detailLayout component is required');
    }
    if (!config.components.cardComponent) {
      errors.push('Content type cardComponent is required');
    }
  }

  // SEO validation
  if (!config.seo) {
    errors.push('Content type SEO configuration is required');
  } else {
    if (!config.seo.generateMetadata || typeof config.seo.generateMetadata !== 'function') {
      errors.push('Content type SEO generateMetadata function is required');
    }
  }

  // Features validation
  if (!config.features) {
    errors.push('Content type features configuration is required');
  }

  // Throw validation errors
  if (errors.length > 0) {
    throw new Error(`Content type configuration validation failed:\n${errors.join('\n')}`);
  }
}

/**
 * Get registry statistics
 */
export function getRegistryStatistics() {
  const types = Object.values(contentTypeRegistry);
  
  return {
    totalTypes: types.length,
    typeIds: types.map(t => t.id),
    featuresUsage: {
      pagination: types.filter(t => t.features.pagination).length,
      categories: types.filter(t => t.features.categories).length,
      tags: types.filter(t => t.features.tags).length,
      search: types.filter(t => t.features.search).length,
      comments: types.filter(t => t.features.comments).length,
    },
    basePaths: types.map(t => t.basePath),
    directories: types.map(t => t.directory),
  };
}

/**
 * Clear all registered content types (mainly for testing)
 */
export function clearRegistry(): void {
  Object.keys(contentTypeRegistry).forEach(key => {
    delete contentTypeRegistry[key];
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleared content type registry');
  }
}

/**
 * Export registry for debugging
 */
export function exportRegistry(): ContentTypeRegistry {
  return JSON.parse(JSON.stringify(contentTypeRegistry));
}

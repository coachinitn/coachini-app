/**
 * Content System - Main Export
 * 
 * Central export point for the modular content system.
 * Provides a clean API for working with different content types.
 */

// Core types and interfaces
export type {
  ContentFrontmatter,
  ContentItem,
  ContentQueryOptions,
  ContentProcessingOptions,
  ContentMetadata,
  ContentValidationResult,
  ContentStatistics,
  ContentTypeConfig,
  ContentTypeRegistry,
  ContentTypeFeatures,
  ContentTypeSEO,
  ContentTypeComponents,
} from './types';

// Registry functions
export {
  registerContentType,
  getContentTypeConfig,
  getAllContentTypes,
  getContentTypeIds,
  isContentTypeRegistered,
  unregisterContentType,
  getContentTypesByFeature,
  getContentTypeByBasePath,
  getRegistryStatistics,
  clearRegistry,
  exportRegistry,
} from './registry';

// MDX processing functions
export {
  getContentPath,
  isValidContentFile,
  isValidSlug,
  readMDXFile,
  getContentFiles,
  getContentBySlug,
  getAllContent,
  getPaginatedContent,
  contentExists,
  validateContentFrontmatter,
  defaultMdxOptions,
} from './mdx';

// Content type definitions
export type { BlogFrontmatter } from './types/blog';
export type { ChangelogFrontmatter } from './types/changelog';
export type { PageFrontmatter } from './types/pages';
export {
  blogContentType,
  getBlogPosts,
  blogFrontmatterSchema,
  defaultBlogFrontmatter,
} from './types/blog';
export {
  changelogContentType,
  getChangelogEntries,
  changelogFrontmatterSchema,
  defaultChangelogFrontmatter,
} from './types/changelog';
export {
  pagesContentType,
  getStaticPage,
  getAllStaticPages,
  pageFrontmatterSchema,
  defaultPageFrontmatter,
} from './types/pages';

// Initialization
export {
  initializeContentSystem,
  getRegisteredContentTypes,
  validateContentSystem,
  reinitializeContentSystem,
} from './init';

// Convenience functions for common operations
export async function getBlogPost(slug: string, locale?: string) {
  const { getContentBySlug } = await import('./mdx');
  return getContentBySlug('blog', slug, locale);
}

export async function getAllBlogPosts(locale?: string, options?: any) {
  const { getAllContent } = await import('./mdx');
  return getAllContent('blog', locale, options);
}

export async function getChangelogEntry(version: string, locale?: string) {
  const { getContentBySlug } = await import('./mdx');
  return getContentBySlug('changelog', version, locale);
}

export async function getAllChangelogEntries(locale?: string, options?: any) {
  const { getAllContent } = await import('./mdx');
  return getAllContent('changelog', locale, options);
}

export async function getAboutPage(locale?: string) {
  const { getStaticPage } = await import('./types/pages');
  return getStaticPage('about', locale || 'en');
}
export async function getAccessibilityPage(locale?: string) {
  const { getStaticPage } = await import('./types/pages');
  return getStaticPage('accessibility', locale || 'en');
}


export async function getPrivacyPolicyPage(locale?: string) {
  const { getStaticPage } = await import('./types/pages');
  return getStaticPage('privacy-policy', locale || 'en');
}

export async function getTermsOfServicePage(locale?: string) {
  const { getStaticPage } = await import('./types/pages');
  return getStaticPage('terms-of-service', locale || 'en');
}

// Legacy compatibility functions (to ease migration)
// These will be deprecated in future versions
export async function getContentBySlugLegacy(
  slug: string,
  locale: string,
  type: 'blog' | 'static'
) {
  console.warn('getContentBySlugLegacy is deprecated. Use getContentBySlug with content type ID instead.');
  
  if (type === 'blog') {
    return getBlogPost(slug, locale);
  }
  
  // For static content, we'll need to handle this differently
  // This is a placeholder for now
  return null;
}

export async function getAllBlogPostsLegacy(
  locale: string,
  options: {
    published?: boolean;
    limit?: number;
    sortBy?: 'date' | 'title';
    sortOrder?: 'asc' | 'desc';
  } = {}
) {
  console.warn('getAllBlogPostsLegacy is deprecated. Use getAllBlogPosts instead.');
  return getAllBlogPosts(locale, options);
}

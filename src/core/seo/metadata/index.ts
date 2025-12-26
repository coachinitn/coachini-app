/**
 * Metadata Module - Main Exports
 * Centralized exports for all metadata functionality
 */

// Core generators
export {
  generateMetadata,
  generateHomeMetadata,
  type MetadataOptions,
} from './generators';

// Specialized metadata generators
export {
  generateArticleMetadata,
  generateProfileMetadata,
  generateErrorMetadata,
  generateServiceMetadata,
  generateLandingPageMetadata,
  generateCategoryMetadata,
} from './specialized';

// Social media metadata
export {
  generateSocialMetadata,
  generateSharingUrls,
  getSocialVerificationTags,
  type SocialMetadataOptions,
  type SocialMetadataResult,
} from './social';

// Structured data (JSON-LD)
export {
  generateOrganizationJsonLd,
  generateArticleJsonLd,
  generatePersonJsonLd,
  generateWebsiteJsonLd,
  generateServiceJsonLd,
  generateFAQJsonLd,
  generateBreadcrumbJsonLd,
} from './structured-data';

// Utility functions for common metadata patterns
export {
  createMetadataTitle,
  createMetadataDescription,
  createMetadataKeywords,
  validateMetadata,
  logMetadataInfo,
  generateImageUrl,
  extractTextForMetadata,
  generateCanonicalUrl,
} from './utils';

// Re-export commonly used types from Next.js
export type { Metadata } from 'next';

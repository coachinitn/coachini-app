/**
 * SEO Utilities - Main Export
 * Centralized exports for all SEO-related functionality
 */

// Metadata utilities (new structure)
export {
  // Core generators
  generateMetadata,
  generateHomeMetadata,
  type MetadataOptions,

  // Specialized generators
  generateArticleMetadata,
  generateProfileMetadata,
  generateErrorMetadata,
  generateServiceMetadata,
  generateLandingPageMetadata,
  generateCategoryMetadata,

  // Social media
  generateSocialMetadata,
  generateSharingUrls,
  getSocialVerificationTags,
  type SocialMetadataOptions,
  type SocialMetadataResult,

  // Structured data
  generateOrganizationJsonLd,
  generateArticleJsonLd,
  generatePersonJsonLd,
  generateWebsiteJsonLd,
  generateServiceJsonLd,
  generateFAQJsonLd,
  generateBreadcrumbJsonLd,

  // Utilities
  createMetadataTitle,
  createMetadataDescription,
  createMetadataKeywords,
  validateMetadata,
  logMetadataInfo,
  generateImageUrl,
  extractTextForMetadata,
  generateCanonicalUrl,

  // Types
  type Metadata,
} from './metadata/';


// Analytics utilities
export {
  GoogleAnalytics,
  AnalyticsProvider,
  trackEvent,
  trackPageView,
  trackEngagement,
  trackCoachini,
  type AnalyticsEvent,
} from './analytics';

// Route utilities
export {
  getAllBlockedRoutes,
  getPublicRoutesForSitemap,
  shouldIncludeInSitemap,
  getRoutePriority,
  getChangeFrequency,
  logSEORouteConfig,
  SEO_BLOCKED_ROUTES,
} from './routes';

// SEO configuration utilities
export {
  seoConfig,
  getSiteUrl,
  getCanonicalUrl,
  getAlternateUrls,
  formatTitle,
  getOgType,
  type SEOConfig
} from './seo';

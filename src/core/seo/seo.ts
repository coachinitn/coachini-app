/**
 * SEO Configuration
 * Centralized configuration for all SEO-related settings
 * Integrates with centralized site configuration
 */

import { siteConfig } from '../config/siteConfig';

export interface SEOConfig {
  // Site information
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  
  // Default metadata
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultKeywords: string[];
  
  // Social media
  twitterHandle: string;
  facebookAppId?: string;
  
  // Images
  defaultOgImage: string;
  defaultTwitterImage: string;
  
  // Localization
  defaultLocale: string;
  supportedLocales: string[];
  
  // Analytics
  googleAnalyticsId?: string;
  
  // Verification
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  
  // Robots and crawling
  robotsPolicy: {
    index: boolean;
    follow: boolean;
  };
}

/**
 * Main SEO configuration
 * Integrates with centralized site configuration
 */
export const seoConfig: SEOConfig = {
  // Site information (from site config)
  siteName: siteConfig.name,
  siteDescription: siteConfig.description,
  siteUrl: siteConfig.url,

  // Default metadata
  defaultTitle: `${siteConfig.name} - ${siteConfig.tagLine}`,
  titleTemplate: `%s | ${siteConfig.name}`,
  defaultDescription: siteConfig.description,
  defaultKeywords: siteConfig.seo.defaultKeywords,

  // Social media (from site config)
  twitterHandle: siteConfig.socialLinks.twitter?.replace('https://twitter.com/', '@') || '@coachini',
  facebookAppId: siteConfig.socialLinks.facebook?.replace('https://facebook.com/', '@') || '@coachini-app',

  // Images (from site config)
  defaultOgImage: siteConfig.seo.defaultOgImage,
  defaultTwitterImage: siteConfig.seo.defaultTwitterImage,

  // Localization (from site config)
  defaultLocale: siteConfig.defaultLocale,
  supportedLocales: siteConfig.supportedLocales,

  // Analytics (from site config)
  googleAnalyticsId: siteConfig.seo.googleAnalyticsId,

  // Verification (from site config)
  googleSiteVerification: siteConfig.seo.googleSiteVerification,
  bingSiteVerification: siteConfig.seo.bingSiteVerification,

  // Robots and crawling (from site config)
  robotsPolicy: siteConfig.seo.robotsPolicy,
};

/**
 * Get the full site URL with proper protocol
 */
export function getSiteUrl(): string {
  const url = seoConfig.siteUrl;
  if (url.startsWith('http')) {
    return url;
  }
  return `https://${url}`;
}

/**
 * Get the canonical URL for a given path
 */
export function getCanonicalUrl(path: string = '', locale?: string): string {
  const baseUrl = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (locale && locale !== siteConfig.defaultLocale) {
    return `${baseUrl}/${locale}${cleanPath === '/' ? '' : cleanPath}`;
  }

  return `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Get alternate language URLs for hreflang
 */
export function getAlternateUrls(path: string = ''): Record<string, string> {
  const alternates: Record<string, string> = {};

  siteConfig.supportedLocales.forEach(locale => {
    alternates[locale] = getCanonicalUrl(path, locale);
  });

  return alternates;
}

/**
 * Format title using the template
 */
export function formatTitle(title?: string): string {
  if (!title) {
    return seoConfig.defaultTitle;
  }
  
  if (title === seoConfig.siteName) {
    return title;
  }
  
  return seoConfig.titleTemplate.replace('%s', title);
}

/**
 * Get Open Graph type based on path
 */
export function getOgType(path: string): 'website' | 'article' | 'profile' {
  if (path.includes('/blog/') || path.includes('/article/')) {
    return 'article';
  }
  
  if (path.includes('/profile/') || path.includes('/coach/')) {
    return 'profile';
  }
  
  return 'website';
}

/**
 * Development helper: Log SEO configuration
 */
export function logSEOConfig() {
  if (process.env.NODE_ENV === 'development') {
    console.group('🔍 SEO Configuration');
    console.log('Site Name:', seoConfig.siteName);
    console.log('Site URL:', getSiteUrl());
    console.log('Default Locale:', seoConfig.defaultLocale);
    console.log('Supported Locales:', seoConfig.supportedLocales);
    console.log('Google Analytics ID:', seoConfig.googleAnalyticsId ? '✅ Configured' : '❌ Not configured');
    console.groupEnd();
  }
}

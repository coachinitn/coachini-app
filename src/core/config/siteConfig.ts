/**
 * Site Configuration
 * Centralized configuration for the Coachini application
 * Integrates with existing SEO and i18n systems
 */

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, RTL_LANGUAGES } from '../i18n/i18n-config';
import type {
  AuthorConfig,
  ThemeColor,
  SocialLinks,
  EmailConfig,
  SiteConfig
} from './siteConfig.types';

// Re-export types for backward compatibility
export type {
  AuthorConfig,
  ThemeColor,
  SocialLinks,
  EmailConfig,
  SiteConfig
} from './siteConfig.types';

// Base URL configuration
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://coachini.net';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.coachini.net';

// External links
export const TWITTER_URL = 'https://twitter.com/coachini';
export const LINKEDIN_URL = 'https://linkedin.com/company/coachini';
export const FACEBOOK_URL = 'https://facebook.com/coachini';
export const INSTAGRAM_URL = 'https://instagram.com/coachini';
export const YOUTUBE_URL = 'https://youtube.com/@coachini';
export const TIKTOK_URL = 'https://tiktok.com/@coachini';
export const CONTACT_EMAIL_URL = 'mailto:contact@coachini.net';
export const SUPPORT_EMAIL_URL = 'mailto:support@coachini.net';



/**
 * Main site configuration
 * This configuration integrates with the existing SEO system
 */
export const siteConfig: SiteConfig = {
  // Basic site information
  name: 'Coachini',
  tagLine: 'Professional Coaching Platform',
  description: 'Transform your potential with professional coaching. Connect with certified coaches for personal and professional development.',
  url: BASE_URL,
  
  // Author and creator information
  authors: [
    {
      name: 'Coachini',
      url: 'https://coachini.net/about',
      email: 'contact@coachini.net',
    },
  ],
  creator: '@coachini',
  
  // Social media links
  socialLinks: {
    twitter: TWITTER_URL,
    linkedin: LINKEDIN_URL,
    facebook: FACEBOOK_URL,
    instagram: INSTAGRAM_URL,
    youtube: YOUTUBE_URL,
    tiktok: TIKTOK_URL,
  },

  // Social platform configuration
  socialPlatforms: {
    tiktokAppId: process.env.NEXT_PUBLIC_TIKTOK_APP_ID,
    facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    youtubeChannelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
    linkedinCompanyId: process.env.NEXT_PUBLIC_LINKEDIN_COMPANY_ID,
  },

  // Email configuration
  emails: {
    contact: 'contact@coachini.net',
    support: 'support@coachini.net',
  },
  
  // Theme configuration
  themeColors: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  defaultNextTheme: 'light',
  
  // Icon configuration
  icons: {
    icon: '/favicon.ico',
    shortcut: '/logo.png',
    apple: '/apple-touch-icon.png',
    favicon: '/favicon.ico',
  },
  
  // Localization (using existing i18n config)
  defaultLocale: DEFAULT_LOCALE,
  supportedLocales: SUPPORTED_LOCALES,
  rtlLanguages: RTL_LANGUAGES, 
  // Features
  features: {
    blog: true,
    changelog: true,
    pages: true,
    newsletter: true,
    analytics: true,
    search: true,
  },

  // Content/MDX Configuration
  content: {
    blog: {
      postsPerPage: 10,
      enableComments: false,
      enableReadingTime: true,
      enableTags: true,
      enableCategories: true,
      defaultAuthor: 'Coachini',
    },
    changelog: {
      entriesPerPage: 20,
      showBreakingChanges: true,
      groupByMajorVersion: false,
      includePrerelease: false,
      defaultAuthor: 'Coachini Team',
    },
    pages: {
      enableLastUpdated: true,
      enableTableOfContents: true,
      defaultAuthor: 'Coachini Team',
    },
    static: {
      enableLastUpdated: true,
      defaultAuthor: 'Coachini',
    },
  },

  // SEO Configuration
  seo: {
    defaultKeywords: [
      'coaching',
      'professional development',
      'personal growth',
      'life coaching',
      'business coaching',
      'career development',
      'mentoring',
      'leadership',
      'executive coaching',
      'transformation',
    ],
    defaultOgImage: '/images/og-default.png',
    defaultTwitterImage: '/images/twitter-default.png',
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    bingSiteVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    robotsPolicy: {
      index: true,
      follow: true,
    },
  },

  contact: {
    email: 'contact@coachini.net',
    phone: '+216 28 28 52 52',
    phone2: '+216 96 28 19 91',
  },

  // Company address
  address: {
    street: 'Novation City - Technopole de Sousse',
    city: 'Tunisia',
    region: 'Tunisia',
    country: 'Tunisia',
    postalCode: '-',
  },

  // Company information
  company: {
    foundingDate: '-',
    numberOfEmployees: '-',
    industry: 'Professional Coaching',
    description: 'Professional coaching platform connecting individuals with certified coaches for personal and professional development.',
  },

  // Legal pages
  legal: {
    privacyPolicy: '/privacy-policy',
    termsOfService: '/terms-of-service',
    cookiePolicy: '/cookie-policy',
    accessibility: '/accessibility'
  },
};

/**
 * Get the full site URL with proper protocol
 */
export function getSiteUrl(): string {
  const url = siteConfig.url;
  if (url.startsWith('http')) {
    return url;
  }
  return `https://${url}`;
}

/**
 * Get social media links as an array for easy iteration
 */
export function getSocialLinksArray() {
  return Object.entries(siteConfig.socialLinks)
    .filter(([_, url]) => url)
    .map(([platform, url]) => ({
      platform,
      url: url!,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
    }));
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof SiteConfig['features']): boolean {
  return siteConfig.features[feature];
}

/**
 * Get contact email address
 */
export function getContactEmail(): string {
  return siteConfig.emails.contact;
}

/**
 * Get support email address
 */
export function getSupportEmail(): string {
  return siteConfig.emails.support;
}

/**
 * Get contact email URL (with mailto:)
 */
export function getContactEmailUrl(): string {
  return `mailto:${siteConfig.emails.contact}`;
}

/**
 * Get support email URL (with mailto:)
 */
export function getSupportEmailUrl(): string {
  return `mailto:${siteConfig.emails.support}`;
}

/**
 * Get all email addresses as an object
 */
export function getEmailConfig(): EmailConfig {
  return siteConfig.emails;
}

/**
 * Get content configuration
 */
export function getContentConfig() {
  return siteConfig.content;
}

/**
 * Get blog configuration
 */
export function getBlogConfig() {
  return siteConfig.content.blog;
}

/**
 * Get static content configuration
 */
export function getStaticContentConfig() {
  return siteConfig.content.static;
}

/**
 * Development helper: Log site configuration
 */
export function logSiteConfig() {
  if (process.env.NODE_ENV === 'development') {
    console.group('🏗️ Site Configuration');
    console.log('Site Name:', siteConfig.name);
    console.log('Site URL:', getSiteUrl());
    console.log('Default Locale:', siteConfig.defaultLocale);
    console.log('Supported Locales:', siteConfig.supportedLocales);
    console.log('Features:', siteConfig.features);
    console.log('Contact Email:', siteConfig.emails.contact);
    console.log('Support Email:', siteConfig.emails.support);
    console.groupEnd();
  }
}

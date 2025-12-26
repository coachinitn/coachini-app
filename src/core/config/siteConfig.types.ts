/**
 * Site Configuration Types
 * Type definitions for the Coachini application site configuration
 */

// Author information
export interface AuthorConfig {
  name: string;
  url: string;
  email?: string;
}

// Theme color configuration
export interface ThemeColor {
  media: string;
  color: string;
}

// Social links configuration
export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

// Social platform configuration
export interface SocialPlatformConfig {
  tiktokAppId?: string;
  facebookAppId?: string;
  youtubeChannelId?: string;
  linkedinCompanyId?: string;
}

// Address configuration
export interface AddressConfig {
  street?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
}

// Company information
export interface CompanyInfo {
  foundingDate?: string;
  numberOfEmployees?: string;
  industry?: string;
  description?: string;
}

// Email configuration
export interface EmailConfig {
  contact: string;
  support: string;
}

// Main site configuration interface
export interface SiteConfig {
  // Basic site information
  name: string;
  tagLine: string;
  description: string;
  url: string;

  // Author and creator information
  authors: AuthorConfig[];
  creator: string;

  // Social media links
  socialLinks: SocialLinks;

  // Social platform configuration
  socialPlatforms: SocialPlatformConfig;

  // Email configuration
  emails: EmailConfig;

  // Theme configuration
  themeColors: ThemeColor[];
  defaultNextTheme: 'system' | 'dark' | 'light';

  // Icon configuration
  icons: {
    icon: string;
    shortcut?: string;
    apple?: string;
    favicon?: string;
  };

  // Localization
  defaultLocale: string;
  supportedLocales: string[];
  rtlLanguages: string[];

  // Features
  features: {
    blog: boolean;
    changelog: boolean;
    pages: boolean;
    newsletter: boolean;
    analytics: boolean;
    search: boolean;
  };

  // Content/MDX Configuration
  content: {
    blog: {
      postsPerPage: number;
      enableComments: boolean;
      enableReadingTime: boolean;
      enableTags: boolean;
      enableCategories: boolean;
      defaultAuthor: string;
    };
    changelog: {
      entriesPerPage: number;
      showBreakingChanges: boolean;
      groupByMajorVersion: boolean;
      includePrerelease: boolean;
      defaultAuthor: string;
    };
    pages: {
      enableLastUpdated: boolean;
      enableTableOfContents: boolean;
      defaultAuthor: string;
    };
    static: {
      enableLastUpdated: boolean;
      defaultAuthor: string;
    };
  };

  // SEO Configuration
  seo: {
    defaultKeywords: string[];
    defaultOgImage: string;
    defaultTwitterImage: string;
    googleAnalyticsId?: string;
    googleSiteVerification?: string;
    bingSiteVerification?: string;
    robotsPolicy: {
      index: boolean;
      follow: boolean;
    };
  };

  // Contact information (deprecated - use emails instead)
  contact: {
    email: string;
    phone?: string;
    phone2?: string;
    address?: string;
  };

  // Company address
  address?: AddressConfig;

  // Company information
  company: CompanyInfo;

  // Legal pages
  legal: {
    privacyPolicy: string;
    termsOfService: string;
    cookiePolicy?: string;
    accessibility?: string;
  };
}

/**
 * Core Metadata Generators
 * Main metadata generation functions with enhanced social media support
 */

import { Metadata } from 'next';
import { seoConfig, formatTitle, getCanonicalUrl, getAlternateUrls, getOgType } from '../seo';
import { generateSocialMetadata } from './social';

export interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  path?: string;
  locale?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
  socialImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  enableAllSocialPlatforms?: boolean;
  overrideDefaultKeywords?: boolean; // New option: true = override defaults (fallback to defaults if empty), false = merge with defaults
}

/**
 * Generate comprehensive metadata for a page with enhanced social media support
 *
 * @param options.overrideDefaultKeywords - If true (default), only use provided keywords + tags.
 *                                         If false, merge with seoConfig.defaultKeywords.
 *                                         Default: true for better SEO targeting.
 */
export function generateMetadata(options: MetadataOptions = {}): Metadata {
  const {
    title,
    description = seoConfig.defaultDescription,
    keywords = [],
    image,
    socialImage,
    path = '',
    locale = seoConfig.defaultLocale,
    type,
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    noIndex = false,
    noFollow = false,
    twitterCard = 'summary_large_image',
    enableAllSocialPlatforms = true,
    overrideDefaultKeywords = false, 
  } = options;

  const formattedTitle = formatTitle(title);
  const canonicalUrl = getCanonicalUrl(path, locale);
  const alternateUrls = getAlternateUrls(path);
  const ogType = type || getOgType(path);
  
  // Determine the best image to use
  const metaImage = socialImage || image || seoConfig.defaultOgImage;
  const fullImageUrl = metaImage.startsWith('http') 
    ? metaImage 
    : `${seoConfig.siteUrl}${metaImage}`;

  // Combine keywords based on override setting
  const providedKeywords = Array.from(new Set([...keywords, ...tags]));
  const allKeywords = overrideDefaultKeywords
    ? (providedKeywords.length > 0 ? providedKeywords : seoConfig.defaultKeywords) // Override: use provided keywords, fallback to defaults if empty
    : Array.from(new Set([...seoConfig.defaultKeywords, ...keywords, ...tags])); // Merge: include defaults

  // Generate social media metadata
  const socialMetadata = generateSocialMetadata({
    title: formattedTitle,
    description,
    image: fullImageUrl,
    url: canonicalUrl,
    twitterCard,
    enableAllPlatforms: enableAllSocialPlatforms,
  });

  const metadata: Metadata = {
    title: formattedTitle,
    description,
    keywords: allKeywords,
    
    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    
    // Open Graph (enhanced)
    openGraph: {
      type: ogType,
      title: formattedTitle,
      description,
      url: canonicalUrl,
      siteName: seoConfig.siteName,
      locale,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: formattedTitle,
        },
      ],
    },
    
    // Twitter (enhanced)
    twitter: socialMetadata.twitter,
    
    // Robots
    robots: {
      index: !noIndex && seoConfig.robotsPolicy.index,
      follow: !noFollow && seoConfig.robotsPolicy.follow,
      googleBot: {
        index: !noIndex && seoConfig.robotsPolicy.index,
        follow: !noFollow && seoConfig.robotsPolicy.follow,
      },
    },
    
    // Verification (enhanced with more platforms)
    verification: {
      google: seoConfig.googleSiteVerification,
      other: {
        ...(seoConfig.bingSiteVerification && {
          'msvalidate.01': seoConfig.bingSiteVerification,
        }),
        ...socialMetadata.verification,
      },
    },
    
    // Additional social platform meta tags
    other: socialMetadata.other,
  };

  // Add article-specific metadata
  if (ogType === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags,
    };
  }

  return metadata;
}

/**
 * Generate metadata for the homepage
 */
export function generateHomeMetadata(locale?: string): Metadata {
  return generateMetadata({
    title: seoConfig.siteName,
    description: seoConfig.defaultDescription,
    path: '/',
    locale,
    type: 'website',
    enableAllSocialPlatforms: true,
  });
}

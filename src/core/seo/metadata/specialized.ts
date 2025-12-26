/**
 * Specialized Metadata Generators
 * Specific metadata generators for different page types
 */

import { Metadata } from 'next';
import { seoConfig } from '../seo';
import { generateMetadata } from './generators';

/**
 * Generate metadata for blog posts/articles
 */
export function generateArticleMetadata(options: {
  title: string;
  description: string;
  slug: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  image?: string;
  locale?: string;
  category?: string;
  readingTime?: number;
}): Metadata {
  const {
    title,
    description,
    slug,
    publishedTime,
    modifiedTime,
    author,
    tags = [],
    image,
    locale,
    category,
    readingTime,
  } = options;

  // Enhanced keywords for articles
  const articleKeywords = [
    ...tags,
    'blog',
    'article',
    category,
    'coaching',
    'professional development',
  ].filter(Boolean) as string[];

  return generateMetadata({
    title,
    description,
    keywords: articleKeywords,
    path: `/blog/${slug}`,
    locale,
    type: 'article',
    publishedTime,
    modifiedTime,
    author,
    section: category || 'Blog',
    tags,
    image,
    socialImage: image,
    twitterCard: 'summary_large_image',
    enableAllSocialPlatforms: true,
  });
}

/**
 * Generate metadata for user profiles
 */
export function generateProfileMetadata(options: {
  name: string;
  bio?: string;
  username: string;
  image?: string;
  locale?: string;
  jobTitle?: string;
  specialties?: string[];
  experience?: string;
}): Metadata {
  const {
    name,
    bio,
    username,
    image,
    locale,
    jobTitle,
    specialties = [],
    experience,
  } = options;

  const profileDescription = bio || `View ${name}'s coaching profile on ${seoConfig.siteName}. ${jobTitle ? `${jobTitle} specializing in ${specialties.join(', ')}.` : ''}`;

  const profileKeywords = [
    'coach',
    'profile',
    'professional',
    jobTitle,
    ...specialties,
    'coaching',
    'mentoring',
  ].filter(Boolean) as string[];

  return generateMetadata({
    title: `${name}${jobTitle ? ` - ${jobTitle}` : ''} - Coach Profile`,
    description: profileDescription,
    keywords: profileKeywords,
    path: `/coach/${username}`,
    image,
    socialImage: image,
    locale,
    type: 'profile',
    twitterCard: 'summary',
    enableAllSocialPlatforms: true,
  });
}

/**
 * Generate metadata for error pages
 */
export function generateErrorMetadata(errorCode: number, locale?: string): Metadata {
  const errorMessages: Record<number, { title: string; description: string; keywords: string[] }> = {
    404: {
      title: 'Page Not Found',
      description: 'The page you are looking for could not be found. Please check the URL or return to our homepage.',
      keywords: ['404', 'not found', 'error', 'missing page'],
    },
    500: {
      title: 'Server Error',
      description: 'An internal server error occurred. Please try again later or contact our support team.',
      keywords: ['500', 'server error', 'internal error', 'technical issue'],
    },
    403: {
      title: 'Access Forbidden',
      description: 'You do not have permission to access this page. Please log in or contact support if you believe this is an error.',
      keywords: ['403', 'forbidden', 'access denied', 'permission'],
    },
    401: {
      title: 'Unauthorized',
      description: 'You need to be logged in to access this page. Please sign in to continue.',
      keywords: ['401', 'unauthorized', 'login required', 'authentication'],
    },
    503: {
      title: 'Service Unavailable',
      description: 'Our service is temporarily unavailable. We are working to restore it as quickly as possible.',
      keywords: ['503', 'service unavailable', 'maintenance', 'temporary'],
    },
  };

  const errorInfo = errorMessages[errorCode] || {
    title: 'Error',
    description: 'An error occurred while processing your request. Please try again or contact support.',
    keywords: ['error', 'issue', 'problem'],
  };

  return generateMetadata({
    title: `${errorInfo.title} - ${errorCode}`,
    description: errorInfo.description,
    keywords: errorInfo.keywords,
    path: `/${errorCode}`,
    locale,
    noIndex: true,
    noFollow: true,
    twitterCard: 'summary',
    enableAllSocialPlatforms: false, // Don't promote error pages on social media
  });
}

/**
 * Generate metadata for service pages
 */
export function generateServiceMetadata(options: {
  serviceName: string;
  description: string;
  slug: string;
  benefits?: string[];
  targetAudience?: string[];
  image?: string;
  locale?: string;
  price?: string;
  duration?: string;
}): Metadata {
  const {
    serviceName,
    description,
    slug,
    benefits = [],
    targetAudience = [],
    image,
    locale,
    price,
    duration,
  } = options;

  const serviceKeywords = [
    'coaching service',
    serviceName.toLowerCase(),
    ...benefits.map(b => b.toLowerCase()),
    ...targetAudience.map(t => t.toLowerCase()),
    'professional development',
    'coaching',
    'mentoring',
  ];

  const enhancedDescription = `${description} ${benefits.length > 0 ? `Benefits include: ${benefits.join(', ')}.` : ''} ${price ? `Starting at ${price}.` : ''}`;

  return generateMetadata({
    title: `${serviceName} - Professional Coaching Service`,
    description: enhancedDescription,
    keywords: serviceKeywords,
    path: `/services/${slug}`,
    image,
    socialImage: image,
    locale,
    type: 'website',
    twitterCard: 'summary_large_image',
    enableAllSocialPlatforms: true,
  });
}

/**
 * Generate metadata for landing pages
 */
export function generateLandingPageMetadata(options: {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
  image?: string;
  locale?: string;
  ctaText?: string;
  benefits?: string[];
}): Metadata {
  const {
    title,
    description,
    slug,
    keywords = [],
    image,
    locale,
    ctaText,
    benefits = [],
  } = options;

  const landingKeywords = [
    ...keywords,
    'coaching',
    'professional development',
    'transformation',
    'growth',
    ...benefits.map(b => b.toLowerCase()),
  ];

  const enhancedDescription = `${description} ${ctaText ? ctaText : 'Get started today!'} ${benefits.length > 0 ? `Key benefits: ${benefits.join(', ')}.` : ''}`;

  return generateMetadata({
    title,
    description: enhancedDescription,
    keywords: landingKeywords,
    path: `/${slug}`,
    image,
    socialImage: image,
    locale,
    type: 'website',
    twitterCard: 'summary_large_image',
    enableAllSocialPlatforms: true,
  });
}

/**
 * Generate metadata for category/taxonomy pages
 */
export function generateCategoryMetadata(options: {
  categoryName: string;
  description: string;
  slug: string;
  itemCount?: number;
  image?: string;
  locale?: string;
  parentCategory?: string;
}): Metadata {
  const {
    categoryName,
    description,
    slug,
    itemCount,
    image,
    locale,
    parentCategory,
  } = options;

  const categoryKeywords = [
    categoryName.toLowerCase(),
    'category',
    'coaching topics',
    'professional development',
    parentCategory?.toLowerCase(),
  ].filter(Boolean) as string[];

  const enhancedDescription = `${description} ${itemCount ? `Browse ${itemCount} items in this category.` : ''} ${parentCategory ? `Part of ${parentCategory}.` : ''}`;

  return generateMetadata({
    title: `${categoryName} - Coaching Resources`,
    description: enhancedDescription,
    keywords: categoryKeywords,
    path: `/category/${slug}`,
    image,
    locale,
    type: 'website',
    twitterCard: 'summary',
    enableAllSocialPlatforms: true,
  });
}

/**
 * Metadata Utilities
 * Helper functions for metadata generation and validation
 */

import { Metadata } from 'next';
import { seoConfig } from '../seo';
import { siteConfig } from '../../config/siteConfig';

/**
 * Create a properly formatted metadata title
 */
export function createMetadataTitle(title?: string, includeTemplate: boolean = true): string {
  if (!title) {
    return seoConfig.defaultTitle;
  }
  
  if (title === siteConfig.name || !includeTemplate) {
    return title;
  }
  
  return seoConfig.titleTemplate.replace('%s', title);
}

/**
 * Create a metadata description with proper length and formatting
 */
export function createMetadataDescription(
  description: string,
  maxLength: number = 160,
  suffix?: string
): string {
  let result = description.trim();
  
  // Add suffix if provided and there's room
  if (suffix && result.length + suffix.length + 1 <= maxLength) {
    result += ` ${suffix}`;
  }
  
  // Truncate if too long
  if (result.length > maxLength) {
    result = result.substring(0, maxLength - 3).trim() + '...';
  }
  
  return result;
}

/**
 * Create metadata keywords array with deduplication and filtering
 */
export function createMetadataKeywords(
  ...keywordSources: (string | string[] | undefined)[]
): string[] {
  const allKeywords: string[] = [];
  
  keywordSources.forEach(source => {
    if (Array.isArray(source)) {
      allKeywords.push(...source);
    } else if (typeof source === 'string') {
      allKeywords.push(source);
    }
  });
  
  // Filter out empty strings, deduplicate, and normalize
  const filteredKeywords = allKeywords
    .filter(keyword => keyword && keyword.trim().length > 0)
    .map(keyword => keyword.trim().toLowerCase());

  return Array.from(new Set(filteredKeywords));
}

/**
 * Validate metadata object for common issues
 */
export function validateMetadata(metadata: Metadata): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Title validation
  if (!metadata.title) {
    errors.push('Title is missing');
  } else {
    const titleLength = typeof metadata.title === 'string'
      ? metadata.title.length
      : (typeof metadata.title === 'object' && 'absolute' in metadata.title
          ? metadata.title.absolute?.length || 0
          : 0);
    
    if (titleLength > 60) {
      warnings.push(`Title is ${titleLength} characters (recommended: 50-60)`);
    }
    if (titleLength < 30) {
      warnings.push(`Title is ${titleLength} characters (recommended: 30-60)`);
    }
  }
  
  // Description validation
  if (!metadata.description) {
    errors.push('Description is missing');
  } else {
    const descLength = metadata.description.length;
    if (descLength > 160) {
      warnings.push(`Description is ${descLength} characters (recommended: 120-160)`);
    }
    if (descLength < 120) {
      warnings.push(`Description is ${descLength} characters (recommended: 120-160)`);
    }
  }
  
  // Keywords validation
  if (metadata.keywords) {
    const keywordCount = Array.isArray(metadata.keywords) 
      ? metadata.keywords.length 
      : metadata.keywords.split(',').length;
    
    if (keywordCount > 10) {
      warnings.push(`Too many keywords: ${keywordCount} (recommended: 5-10)`);
    }
    if (keywordCount < 3) {
      warnings.push(`Too few keywords: ${keywordCount} (recommended: 5-10)`);
    }
  }
  
  // Open Graph validation
  if (metadata.openGraph) {
    if (!metadata.openGraph.title) {
      warnings.push('Open Graph title is missing');
    }
    if (!metadata.openGraph.description) {
      warnings.push('Open Graph description is missing');
    }
    if (!metadata.openGraph.images ||
        (Array.isArray(metadata.openGraph.images) && metadata.openGraph.images.length === 0)) {
      warnings.push('Open Graph image is missing');
    }
  }
  
  // Twitter validation
  if (metadata.twitter) {
    if (!metadata.twitter.title) {
      warnings.push('Twitter title is missing');
    }
    if (!metadata.twitter.description) {
      warnings.push('Twitter description is missing');
    }
    if (!metadata.twitter.images ||
        (Array.isArray(metadata.twitter.images) && metadata.twitter.images.length === 0)) {
      warnings.push('Twitter image is missing');
    }
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Log metadata information for debugging
 */
export function logMetadataInfo(metadata: Metadata, pagePath?: string): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  const validation = validateMetadata(metadata);
  
  console.group(`🔍 Metadata Info${pagePath ? ` - ${pagePath}` : ''}`);
  
  // Basic info
  console.log('Title:', metadata.title);
  console.log('Description:', metadata.description);
  console.log('Keywords:', metadata.keywords);
  
  // Validation results
  if (validation.errors.length > 0) {
    console.error('❌ Errors:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Warnings:', validation.warnings);
  }
  
  if (validation.isValid && validation.warnings.length === 0) {
    console.log('✅ Metadata looks good!');
  }
  
  // Social media info
  if (metadata.openGraph) {
    console.log('🌐 Open Graph:', {
      type: (metadata.openGraph as any).type || 'website',
      hasImage: !!(Array.isArray(metadata.openGraph.images)
        ? metadata.openGraph.images.length
        : metadata.openGraph.images),
    });
  }

  if (metadata.twitter) {
    console.log('🐦 Twitter:', {
      card: (metadata.twitter as any).card || 'summary',
      hasImage: !!(Array.isArray(metadata.twitter.images)
        ? metadata.twitter.images.length
        : metadata.twitter.images),
    });
  }
  
  console.groupEnd();
}

/**
 * Generate image URL with proper fallbacks
 */
export function generateImageUrl(
  image?: string,
  fallback?: string,
  size?: { width: number; height: number }
): string {
  const baseImage = image || fallback || seoConfig.defaultOgImage;
  
  // If it's already a full URL, return as-is
  if (baseImage.startsWith('http')) {
    return baseImage;
  }
  
  // Construct full URL
  const fullUrl = `${seoConfig.siteUrl}${baseImage.startsWith('/') ? '' : '/'}${baseImage}`;
  
  // Add size parameters if supported (would need image optimization service)
  if (size && process.env.NEXT_PUBLIC_IMAGE_OPTIMIZATION_ENABLED === 'true') {
    const url = new URL(fullUrl);
    url.searchParams.set('w', size.width.toString());
    url.searchParams.set('h', size.height.toString());
    return url.toString();
  }
  
  return fullUrl;
}

/**
 * Extract and clean text for metadata
 */
export function extractTextForMetadata(
  html: string,
  maxLength: number = 160
): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, ' ');
  
  // Clean up whitespace
  const cleaned = text.replace(/\s+/g, ' ').trim();
  
  // Truncate if needed
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  // Find the last complete sentence within the limit
  const truncated = cleaned.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSentence > maxLength * 0.7) {
    return cleaned.substring(0, lastSentence + 1);
  } else if (lastSpace > maxLength * 0.8) {
    return cleaned.substring(0, lastSpace) + '...';
  } else {
    return truncated + '...';
  }
}

/**
 * Generate canonical URL with proper locale handling
 */
export function generateCanonicalUrl(
  path: string,
  locale?: string,
  baseUrl?: string
): string {
  const base = baseUrl || seoConfig.siteUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (locale && locale !== seoConfig.defaultLocale) {
    return `${base}/${locale}${cleanPath === '/' ? '' : cleanPath}`;
  }
  
  return `${base}${cleanPath === '/' ? '' : cleanPath}`;
}

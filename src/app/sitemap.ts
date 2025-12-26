/**
 * Dynamic Sitemap Generation
 * Automatically generates sitemap.xml based on route configuration and content
 */

import { MetadataRoute } from 'next';
import { siteConfig } from '@/core/config/siteConfig';
import { getCanonicalUrl } from '@/core/seo/seo';
import {
  getPublicRoutesForSitemap,
  getRoutePriority,
  getChangeFrequency
} from '@/core/seo/routes';
import { LOCALE_PREFIX } from '@/core/i18n/i18n-config';
// Import from new content system
import { getAllBlogPosts, getAllChangelogEntries, getAllContent } from '../core/content';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

/**
 * Generate sitemap entries for static pages
 */
function generateStaticPages(): MetadataRoute.Sitemap {
  const publicRoutes = getPublicRoutesForSitemap();
  const staticPages: MetadataRoute.Sitemap = [];

  // Generate entries for each supported locale
  siteConfig.supportedLocales.forEach(locale => {
    publicRoutes.forEach(route => {
      // Skip auth routes and other non-public pages
      if (route.startsWith('/auth/') || route === '/dashboard') {
        return;
      }

      // Handle locale prefix configuration
      let url: string;
      if (LOCALE_PREFIX === 'as-needed') {
        // For "as-needed" prefix, only default locale gets no prefix
        if (locale === siteConfig.defaultLocale) {
          url = getCanonicalUrl(route); // No locale in URL for default
        } else {
          url = getCanonicalUrl(route, locale); // Include locale for non-default
        }
      } else {
        // For other prefix strategies, always include locale
        url = getCanonicalUrl(route, locale);
      }

      const priority = getRoutePriority(route);
      const changeFrequency = getChangeFrequency(route) as ChangeFrequency;

      staticPages.push({
        url,
        lastModified: new Date(),
        changeFrequency,
        priority,
      });
    });
  });

  return staticPages;
}

/**
 * Generate sitemap entries for blog posts
 */
async function generateBlogPages(): Promise<MetadataRoute.Sitemap> {
  const blogPages: MetadataRoute.Sitemap = [];

  try {
    // Generate entries for each supported locale
    for (const locale of siteConfig.supportedLocales) {
      // Get all published blog posts for this locale
      const posts = await getAllBlogPosts(locale, { published: true });

      // Only process if we have posts
      if (posts && posts.length > 0) {
        posts.forEach(post => {
        // Handle locale prefix configuration
        let url: string;
        if (LOCALE_PREFIX === 'as-needed') {
          // For "as-needed" prefix, only default locale gets no prefix
          if (locale === siteConfig.defaultLocale) {
            url = getCanonicalUrl(`/blog/${post.slug}`); // No locale in URL for default
          } else {
            url = getCanonicalUrl(`/blog/${post.slug}`, locale); // Include locale for non-default
          }
        } else {
          // For other prefix strategies, always include locale
          url = getCanonicalUrl(`/blog/${post.slug}`, locale);
        }          const lastModified = post.frontmatter.date
            ? new Date(post.frontmatter.date)
            : new Date();

          blogPages.push({
            url,
            lastModified,
            changeFrequency: 'weekly' as ChangeFrequency,
            priority: 0.7,
          });
        });
      }
    }
  } catch (error) {
    // Don't log errors in production builds to reduce noise
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating blog sitemap entries:', error);
    }
  }

  return blogPages;
}

/**
 * Generate sitemap entries for changelog entries
 */
async function generateChangelogPages(): Promise<MetadataRoute.Sitemap> {
  const changelogPages: MetadataRoute.Sitemap = [];

  try {
    // Generate entries for each supported locale
    for (const locale of siteConfig.supportedLocales) {
      // Get all published changelog entries for this locale
      const entries = await getAllChangelogEntries(locale, {
        published: true,
        includePrerelease: false,
        includeYanked: false,
      });

      // Only process if we have entries
      if (entries && entries.length > 0) {
        entries.forEach(entry => {
          // Handle locale prefix configuration
          let url: string;
          if (LOCALE_PREFIX === 'as-needed') {
            // For "as-needed" prefix, only default locale gets no prefix
            if (locale === siteConfig.defaultLocale) {
              url = getCanonicalUrl(`/changelog/${entry.slug}`); // No locale in URL for default
            } else {
              url = getCanonicalUrl(`/changelog/${entry.slug}`, locale); // Include locale for non-default
            }
          } else {
            // For other prefix strategies, always include locale
            url = getCanonicalUrl(`/changelog/${entry.slug}`, locale);
          }

          const lastModified = entry.frontmatter.lastUpdated
            ? new Date(entry.frontmatter.lastUpdated)
            : new Date(entry.frontmatter.releaseDate);

          changelogPages.push({
            url,
            lastModified,
            changeFrequency: 'yearly' as ChangeFrequency,
            priority: 0.6,
          });
        });
      }
    }
  } catch (error) {
    // Don't log errors in production builds to reduce noise
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating changelog sitemap entries:', error);
    }
  }

  return changelogPages;
}

/**
 * Generate sitemap entries for static content pages
 */
async function generateContentPages(): Promise<MetadataRoute.Sitemap> {
  const contentPages: MetadataRoute.Sitemap = [];

  try {
    // Static content pages (about, privacy-policy, terms-of-service, etc.)
    const staticPages = ['about', 'privacy-policy', 'terms-of-service'];

    // Generate entries for each supported locale
    for (const locale of siteConfig.supportedLocales) {
      for (const pageSlug of staticPages) {
        try {
          // Generate URLs for static pages (no content check needed since these are hardcoded routes)
            // Handle locale prefix configuration
            let url: string;
            if (LOCALE_PREFIX === 'as-needed') {
              // For "as-needed" prefix, only default locale gets no prefix
              if (locale === siteConfig.defaultLocale) {
                url = getCanonicalUrl(`/${pageSlug}`); // No locale in URL for default
              } else {
                url = getCanonicalUrl(`/${pageSlug}`, locale); // Include locale for non-default
              }
            } else {
              // For other prefix strategies, always include locale
              url = getCanonicalUrl(`/${pageSlug}`, locale);
            }

          contentPages.push({
            url,
            lastModified: new Date(),
            changeFrequency: 'monthly' as ChangeFrequency,
            priority: 0.8,
          });
        } catch (error) {
          console.warn(`Error generating sitemap entry for ${pageSlug} (${locale}):`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error generating content sitemap entries:', error);
  }

  return contentPages;
}

/**
 * Generate sitemap entries for coach profiles (if public)
 * This is a placeholder - implement based on your coach profile structure
 */
async function generateCoachPages(): Promise<MetadataRoute.Sitemap> {
  const coachPages: MetadataRoute.Sitemap = [];

  try {

  } catch (error) {
    console.error('Error generating coach sitemap entries:', error);
  }

  return coachPages;
}

/**
 * Main sitemap generation function
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [staticPages, blogPages, changelogPages, contentPages, coachPages] = await Promise.all([
      generateStaticPages(),
      generateBlogPages(),
      generateChangelogPages(),
      generateContentPages(),
      generateCoachPages(),
    ]);

    // Combine all entries
    const allPages = [
      ...staticPages,
      ...blogPages,
      ...changelogPages,
      ...contentPages,
      ...coachPages,
    ];

    allPages.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (b.priority || 0) - (a.priority || 0);
      }
      return a.url.localeCompare(b.url);
    });

    return allPages;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [
      {
        url: siteConfig.url,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}

/**
 * Helper function to manually trigger sitemap regeneration
 * Useful for development and testing
 */
export async function regenerateSitemap(): Promise<MetadataRoute.Sitemap> {
  return await sitemap();
}

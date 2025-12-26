/**
 * Static Pages Content Type Configuration
 * 
 * Defines the static pages content type for about, privacy-policy, terms-of-service, etc.
 * These are standalone pages that don't need complex features like pagination or categories.
 */

import { z } from 'zod';
import { Metadata } from 'next';
import { ContentFrontmatter, ContentTypeConfig, ContentItem } from '../types';
import { generateMetadata } from '../../seo/metadata/generators';

/**
 * Static page frontmatter schema
 */
export interface PageFrontmatter extends ContentFrontmatter {
  lastUpdated?: string;
}

/**
 * Zod schema for static page frontmatter validation
 * Handles both new format and legacy format
 */
export const pageFrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  lastUpdated: z.union([z.string(), z.date()]).optional().transform(val => {
    if (val instanceof Date) {
      return val.toISOString().split('T')[0];
    }
    return val;
  }),
  author: z.string().optional(),
  tags: z.union([
    z.array(z.string()),
    z.string().transform(str => str.split(',').map(tag => tag.trim()))
  ]).optional(),
  image: z.string().optional(),
  published: z.boolean().optional().default(true),
});

/**
 * Default static page frontmatter values
 */
export const defaultPageFrontmatter: Partial<PageFrontmatter> = {
  published: true,
  tags: [],
};

/**
 * Get page-specific keywords based on slug
 */
function getPageSpecificKeywords(slug: string): string[] {
  const pageKeywords: Record<string, string[]> = {
    'privacy-policy': [
      'privacy policy',
      'data protection',
      'GDPR',
      'personal information',
      'cookies',
      'data security',
      'user privacy',
      'information collection',
      'data processing'
    ],
    'terms-of-service': [
      'terms of service',
      'terms and conditions',
      'legal agreement',
      'user agreement',
      'service terms',
      'liability',
      'user responsibilities',
      'service usage',
      'legal terms'
    ],
    'about': [
      'about us',
      'company information',
      'our story',
      'team',
      'mission',
      'vision',
      'company profile'
    ]
  };

  return pageKeywords[slug] || [];
}

/**
 * Generate metadata for static pages
 */
function generatePageMetadata(
  item: ContentItem<PageFrontmatter>,
  locale?: string
): Metadata {
  const { frontmatter } = item;

  // Get page-specific keywords
  const pageSpecificKeywords = getPageSpecificKeywords(item.slug);

  return generateMetadata({
    title: frontmatter.title,
    description: frontmatter.description || '',
    path: `/${item.slug}`,
    locale,
    type: 'website',
    publishedTime: undefined, // Static pages don't have publish dates
    modifiedTime: frontmatter.lastUpdated,
    author: frontmatter.author,
    tags: frontmatter.tags || [],
    image: frontmatter.image,
    keywords: [
      'coachini',
      ...pageSpecificKeywords,
      ...(frontmatter.tags || []), // Frontmatter tags can still add additional keywords
    ],
  });
}

/**
 * Process static page content (minimal processing needed)
 */
function processPageContent(content: string, _frontmatter: PageFrontmatter): string {
  return content;
}

/**
 * Validate and transform static page frontmatter
 */
function validatePageFrontmatter(frontmatter: any): PageFrontmatter {
  try {
    const validated = pageFrontmatterSchema.parse(frontmatter);
    return validated;
  } catch (error) {
    console.error('Static page frontmatter validation error:', error);
    if (process.env.NODE_ENV === 'development') {
      console.log('Original static page frontmatter:', frontmatter);
    }
    throw error;
  }
}

/**
 * Transform static page item (minimal transformation needed)
 */
function transformPageItem(item: ContentItem<PageFrontmatter>): ContentItem<PageFrontmatter> {
  return item;
}

// Import components (these will use generic layouts)
// For now, we'll use placeholder components
const PageListLayout = () => null; // Not needed for static pages
const PageDetailLayout = () => null; // Will use generic layout
const PageCard = () => null; // Not needed for static pages

/**
 * Static pages content type configuration
 */
export const pagesContentType: ContentTypeConfig<PageFrontmatter> = {
  // Basic identification
  id: 'pages',
  name: 'Static Pages',
  pluralName: 'Static Pages',
  
  // File system configuration
  directory: 'content',
  fileExtension: '.mdx',
  
  // URL and routing configuration
  basePath: '/', // Static pages are at root level (/, /about, /privacy-policy)
  slugPattern: '[slug]',
  
  // Schema and validation
  frontmatterSchema: pageFrontmatterSchema as any,
  defaultFrontmatter: defaultPageFrontmatter,
  
  // Features and behavior (minimal features for static pages)
  features: {
    pagination: false,
    categories: false,
    tags: false,
    search: false,
    sorting: ['title'],
    comments: false,
    readingTime: false,
    tableOfContents: true,
    relatedContent: false,
  },
  
  // Display configuration
  itemsPerPage: 50, // Not used since pagination is disabled
  defaultSortBy: 'title',
  defaultSortOrder: 'asc',
  
  // Components (placeholders for now)
  components: {
    listLayout: PageListLayout,
    detailLayout: PageDetailLayout,
    cardComponent: PageCard,
  },
  
  // SEO and metadata
  seo: {
    titleTemplate: '%s',
    defaultDescription: 'Learn more about Coachini and our services.',
    ogType: 'website',
    generateMetadata: generatePageMetadata,
    keywords: ['coachini', 'information', 'company', 'coaching platform'],
  },
  
  // Custom processing functions
  processContent: processPageContent,
  validateFrontmatter: validatePageFrontmatter,
  transformItem: transformPageItem,
};

/**
 * Helper function to get a specific static page
 */
export async function getStaticPage(
  slug: string,
  locale: string
) {
  // This will use the new getContentBySlug function
  const { getContentBySlug } = await import('../mdx');

  return getContentBySlug<PageFrontmatter>('pages', slug, locale);
}

/**
 * Helper function to get all static pages
 */
export async function getAllStaticPages(
  locale: string,
  options: {
    published?: boolean;
  } = {}
) {
  // This will use the new getAllContent function
  const { getAllContent } = await import('../mdx');
  
  const queryOptions = {
    published: options.published !== false, // Default to true
    sortBy: 'title',
    sortOrder: 'asc' as const,
  };
  
  return getAllContent<PageFrontmatter>('pages', locale, queryOptions);
}

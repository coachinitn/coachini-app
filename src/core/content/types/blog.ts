/**
 * Blog Content Type Configuration
 * 
 * Defines the blog content type with its schema, components, and behavior.
 * This replaces the hardcoded blog logic from the old system.
 */

import { z } from 'zod';
import { Metadata } from 'next';
import { ContentFrontmatter, ContentTypeConfig, ContentItem } from '../types';
import { generateArticleMetadata } from '../../seo/metadata/specialized';

/**
 * Blog post frontmatter schema
 */
export interface BlogFrontmatter extends ContentFrontmatter {
  slug: string;
  date: string; // Always normalized to string after validation
  visible: 'draft' | 'published' | 'archived';
  pin?: boolean;
  category?: string;
  readingTime?: number;
}

/**
 * Zod schema for blog frontmatter validation
 * Handles both new format and legacy format from existing blog posts
 */
export const blogFrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  // Handle both string dates and Date objects from existing posts
  date: z.union([z.string(), z.date()]).transform(val => {
    if (val instanceof Date) {
      return val.toISOString().split('T')[0]; // Convert Date to YYYY-MM-DD string
    }
    return val;
  }),
  visible: z.enum(['draft', 'published', 'archived']).default('draft'),
  pin: z.boolean().optional(),
  category: z.string().optional(),
  readingTime: z.number().optional(),
  lastUpdated: z.union([z.string(), z.date()]).optional().transform(val => {
    if (val instanceof Date) {
      return val.toISOString().split('T')[0];
    }
    return val;
  }),
  author: z.string().optional(),
  // Handle both array format and comma-separated string from existing posts
  tags: z.union([
    z.array(z.string()),
    z.string().transform(str => str.split(',').map(tag => tag.trim()))
  ]).optional(),
  image: z.string().optional(),
  published: z.boolean().optional(),
});

/**
 * Default blog frontmatter values
 */
export const defaultBlogFrontmatter: Partial<BlogFrontmatter> = {
  visible: 'draft',
  pin: false,
  published: false,
  tags: [],
};

/**
 * Generate metadata for blog posts
 */
function generateBlogMetadata(
  item: ContentItem<BlogFrontmatter>,
  locale?: string
): Metadata {
  const { frontmatter } = item;
  
  return generateArticleMetadata({
    title: frontmatter.title,
    description: frontmatter.description || '',
    slug: item.slug,
    publishedTime: frontmatter.date,
    modifiedTime: frontmatter.lastUpdated,
    author: frontmatter.author,
    tags: frontmatter.tags || [],
    image: frontmatter.image,
    locale,
    category: frontmatter.category,
    readingTime: frontmatter.readingTime,
  });
}

/**
 * Process blog content (add reading time calculation, etc.)
 */
function processBlogContent(content: string, frontmatter: BlogFrontmatter): string {
  // Calculate reading time if not provided
  if (!frontmatter.readingTime) {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    frontmatter.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  
  return content;
}

/**
 * Validate and transform blog frontmatter
 */
function validateBlogFrontmatter(frontmatter: any): BlogFrontmatter {
  try {
    const validated = blogFrontmatterSchema.parse(frontmatter);

    // Ensure published status matches visible status
    if (validated.visible === 'published') {
      validated.published = true;
    } else {
      validated.published = false;
    }

    return validated;
  } catch (error) {
    console.error('Blog frontmatter validation error:', error);
    // For development, log the original frontmatter to help debug
    if (process.env.NODE_ENV === 'development') {
      console.log('Original frontmatter:', frontmatter);
    }
    throw error;
  }
}

/**
 * Transform blog item (add computed fields, etc.)
 */
function transformBlogItem(item: ContentItem<BlogFrontmatter>): ContentItem<BlogFrontmatter> {
  // Add computed fields or transformations here
  return item;
}

// Import components (these will be created later)
// For now, we'll use placeholder components
const BlogListLayout = () => null;
const BlogDetailLayout = () => null;
const BlogCard = () => null;

/**
 * Blog content type configuration
 */
export const blogContentType: ContentTypeConfig<BlogFrontmatter> = {
  // Basic identification
  id: 'blog',
  name: 'Blog',
  pluralName: 'Blog Posts',
  
  // File system configuration
  directory: 'blog',
  fileExtension: '.mdx',
  
  // URL and routing configuration
  basePath: '/blog',
  slugPattern: '[slug]',
  
  // Schema and validation
  frontmatterSchema: blogFrontmatterSchema as any, // Type assertion to handle transform types
  defaultFrontmatter: defaultBlogFrontmatter,
  
  // Features and behavior
  features: {
    pagination: true,
    categories: true,
    tags: true,
    search: true,
    sorting: ['date', 'title', 'category'],
    comments: false,
    readingTime: true,
    tableOfContents: false,
    relatedContent: true,
  },
  
  // Display configuration
  itemsPerPage: 10,
  defaultSortBy: 'date',
  defaultSortOrder: 'desc',
  
  // Components (placeholders for now)
  components: {
    listLayout: BlogListLayout,
    detailLayout: BlogDetailLayout,
    cardComponent: BlogCard,
  },
  
  // SEO and metadata
  seo: {
    titleTemplate: '%s | Blog',
    defaultDescription: 'Discover expert coaching insights, personal development tips, and success stories.',
    ogType: 'article',
    generateMetadata: generateBlogMetadata,
    keywords: ['blog', 'coaching', 'personal development', 'professional growth'],
  },
  
  // Custom processing functions
  processContent: processBlogContent,
  validateFrontmatter: validateBlogFrontmatter,
  transformItem: transformBlogItem,
};

/**
 * Helper function to get blog posts with specific filtering
 */
export async function getBlogPosts(
  locale: string,
  options: {
    published?: boolean;
    limit?: number;
    sortBy?: 'date' | 'title';
    sortOrder?: 'asc' | 'desc';
    category?: string;
    pinned?: boolean;
  } = {}
) {
  // This will use the new getAllContent function
  const { getAllContent } = await import('../mdx');
  
  const queryOptions = {
    published: options.published,
    limit: options.limit,
    sortBy: options.sortBy || 'date',
    sortOrder: options.sortOrder || 'desc',
    category: options.category,
  };
  
  let posts = await getAllContent<BlogFrontmatter>('blog', locale, queryOptions);
  
  // Filter by pinned status if specified
  if (options.pinned !== undefined) {
    posts = posts.filter(post => post.frontmatter.pin === options.pinned);
  }
  
  return posts;
}

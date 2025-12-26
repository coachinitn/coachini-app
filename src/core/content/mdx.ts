/**
 * Modern MDX Processing System
 * 
 * Content-type agnostic MDX processing utilities that work with the
 * modular content type registry system.
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { DEFAULT_LOCALE } from '../i18n/i18n-config';
import { getContentTypeConfig } from './registry';
import { 
  ContentItem, 
  ContentFrontmatter, 
  ContentQueryOptions, 
  ContentProcessingOptions,
  ContentMetadata,
  ContentValidationResult 
} from './types';

/**
 * Default MDX processing options
 */
export const defaultMdxOptions: ContentProcessingOptions = {
  parseFrontmatter: true,
  validateSchema: true, // Re-enabled with better error handling
  transformContent: true,
  generateExcerpt: true,
  calculateReadingTime: true,
};

/**
 * Get content directory path for a content type
 */
export function getContentPath(contentTypeId: string): string {
  const config = getContentTypeConfig(contentTypeId);
  return path.join(process.cwd(), config.directory);
}

/**
 * Check if a file is a valid content file
 */
export function isValidContentFile(filename: string, contentTypeId: string): boolean {
  const config = getContentTypeConfig(contentTypeId);
  const extension = config.fileExtension || '.mdx';
  return filename.endsWith(extension) && !filename.startsWith('.');
}

/**
 * Validate slug format
 * Allows standard slugs (a-z, 0-9, hyphens) and semantic versions (dots allowed)
 */
export function isValidSlug(slug: string): boolean {
  // Allow standard slugs: lowercase letters, numbers, hyphens
  const standardSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  // Allow semantic versions: numbers with dots (e.g., 1.0.0, 2.1.3-beta.1)
  const semanticVersion = /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9-]+)?(?:\+[a-zA-Z0-9-]+)?$/;

  return standardSlug.test(slug) || semanticVersion.test(slug);
}

/**
 * Read and parse MDX file
 */
export async function readMDXFile(filePath: string): Promise<{ frontmatter: any; content: string }> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    // Convert any Date objects back to strings to maintain consistency
    // This handles the case where gray-matter auto-parses YAML dates
    const normalizedFrontmatter = normalizeDataTypes(frontmatter);

    return { frontmatter: normalizedFrontmatter, content };
  } catch (error) {
    throw new Error(`Failed to read MDX file: ${filePath}. ${error}`);
  }
}

/**
 * Normalize data types in frontmatter (convert Date objects to strings)
 */
function normalizeDataTypes(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Date) {
    return obj.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
  }

  if (Array.isArray(obj)) {
    return obj.map(normalizeDataTypes);
  }

  if (typeof obj === 'object') {
    const normalized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      normalized[key] = normalizeDataTypes(value);
    }
    return normalized;
  }

  return obj;
}

/**
 * Get all content files for a specific content type and locale
 */
export async function getContentFiles(
  contentTypeId: string,
  locale: string = DEFAULT_LOCALE
): Promise<string[]> {
  const contentPath = path.join(getContentPath(contentTypeId), locale);
  
  try {
    // Check if directory exists first
    const stat = await fs.stat(contentPath);
    if (!stat.isDirectory()) {
      return [];
    }
    
    const entries = await fs.readdir(contentPath, { withFileTypes: true });
    const files = entries
      .filter(entry => entry.isFile() && isValidContentFile(entry.name, contentTypeId))
      .map(entry => entry.name);
    
    // Only log if in development mode to reduce build noise
    if (process.env.NODE_ENV === 'development' && files.length === 0) {
      console.log(`No content files found in: ${contentPath}`);
    }
    
    return files;
  } catch (error) {
    // Only log in development to reduce production build noise
    if (process.env.NODE_ENV === 'development') {
      console.log(`Content directory not accessible: ${contentPath}`);
    }
    return [];
  }
}

/**
 * Get a specific content item by slug
 */
export async function getContentBySlug<T extends ContentFrontmatter>(
  contentTypeId: string,
  slug: string,
  locale: string = DEFAULT_LOCALE,
  options: ContentProcessingOptions = defaultMdxOptions
): Promise<ContentItem<T> | null> {
  // Validate slug
  if (!isValidSlug(slug)) {
    console.warn(`Invalid slug provided: ${slug}`);
    return null;
  }

  const config = getContentTypeConfig<T>(contentTypeId);
  const extension = config.fileExtension || '.mdx';
  const filePath = path.join(getContentPath(contentTypeId), locale, `${slug}${extension}`);

  try {
    const { frontmatter, content } = await readMDXFile(filePath);

    // Skip general schema validation - let the custom validator handle it
    // The custom validateFrontmatter function will handle validation

    // Apply custom frontmatter validation if provided
    const validatedFrontmatter = config.validateFrontmatter 
      ? config.validateFrontmatter(frontmatter)
      : frontmatter as T;

    // Process content if transformation is enabled
    const processedContent = options.transformContent && config.processContent
      ? config.processContent(content, validatedFrontmatter)
      : content;

    let item: ContentItem<T> = {
      slug,
      locale,
      frontmatter: validatedFrontmatter,
      content: processedContent,
      path: filePath,
    };

    // Apply custom item transformation if provided
    if (config.transformItem) {
      item = config.transformItem(item);
    }

    return item;
  } catch (error) {
    console.error(`Error processing content file: ${slug}`, error);
    return null;
  }
}

/**
 * Get all content items for a specific content type
 */
export async function getAllContent<T extends ContentFrontmatter>(
  contentTypeId: string,
  locale: string = DEFAULT_LOCALE,
  options: ContentQueryOptions = {}
): Promise<ContentItem<T>[]> {
  const files = await getContentFiles(contentTypeId, locale);
  const config = getContentTypeConfig<T>(contentTypeId);

  const contentItems = await Promise.all(
    files.map(async (file) => {
      const extension = config.fileExtension || '.mdx';
      const slug = path.basename(file, extension);

      return await getContentBySlug<T>(contentTypeId, slug, locale);
    })
  );

  let items = contentItems.filter((item): item is ContentItem<T> => item !== null);

  // Apply filtering
  if (options.published !== undefined) {
    items = items.filter(item => item.frontmatter.published === options.published);
  }

  if (options.category) {
    items = items.filter(item => 
      (item.frontmatter as any).category === options.category
    );
  }

  if (options.tags && options.tags.length > 0) {
    items = items.filter(item => {
      const itemTags = item.frontmatter.tags || [];
      return options.tags!.some(tag => itemTags.includes(tag));
    });
  }

  // Apply sorting
  const sortBy = options.sortBy || config.defaultSortBy;
  const sortOrder = options.sortOrder || config.defaultSortOrder;

  items.sort((a, b) => {
    const aValue = (a.frontmatter as any)[sortBy];
    const bValue = (b.frontmatter as any)[sortBy];

    if (aValue === bValue) return 0;

    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else {
      comparison = aValue < bValue ? -1 : 1;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Apply limit
  if (options.limit) {
    items = items.slice(0, options.limit);
  }

  return items;
}

/**
 * Get paginated content
 */
export async function getPaginatedContent<T extends ContentFrontmatter>(
  contentTypeId: string,
  locale: string = DEFAULT_LOCALE,
  page: number = 1,
  options: ContentQueryOptions = {}
): Promise<{ items: ContentItem<T>[]; metadata: ContentMetadata }> {
  const config = getContentTypeConfig<T>(contentTypeId);
  const itemsPerPage = options.limit || config.itemsPerPage;

  // Get all items first
  const allItems = await getAllContent<T>(contentTypeId, locale, {
    ...options,
    limit: undefined, // Remove limit to get total count
  });

  const totalItems = allItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const items = allItems.slice(startIndex, endIndex);

  const metadata: ContentMetadata = {
    totalItems,
    totalPages,
    currentPage: page,
    itemsPerPage,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return { items, metadata };
}

/**
 * Check if content exists
 */
export async function contentExists(
  contentTypeId: string,
  slug: string,
  locale: string = DEFAULT_LOCALE
): Promise<boolean> {
  const content = await getContentBySlug(contentTypeId, slug, locale);
  return content !== null;
}

/**
 * Validate content frontmatter against schema
 */
export function validateContentFrontmatter(
  contentTypeId: string,
  frontmatter: any
): ContentValidationResult {
  const config = getContentTypeConfig(contentTypeId);
  
  try {
    config.frontmatterSchema.parse(frontmatter);
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  } catch (error: any) {
    const errors = error.errors?.map((err: any) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    })) || [{ field: 'unknown', message: error.message, code: 'validation_error' }];

    return {
      isValid: false,
      errors,
      warnings: [],
    };
  }
}

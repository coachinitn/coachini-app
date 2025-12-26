/**
 * Changelog Content Type Configuration
 * 
 * Defines the changelog content type for tracking product updates,
 * releases, and version history.
 */

import { z } from 'zod';
import { Metadata } from 'next';
import { ContentFrontmatter, ContentTypeConfig, ContentItem } from '../types';
import { generateMetadata } from '../../seo/metadata/generators';

/**
 * Changelog entry frontmatter schema
 */
export interface ChangelogFrontmatter extends ContentFrontmatter {
  version: string;
  releaseDate: string; // Always normalized to string after validation
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  breaking?: boolean;
  categories: ('added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security')[];
  prerelease?: boolean;
  yanked?: boolean;
}

/**
 * Zod schema for changelog frontmatter validation
 * Handles both new format and legacy format with Date objects
 */
export const changelogFrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  version: z.string().min(1, 'Version is required').regex(
    /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9-]+)?(?:\+[a-zA-Z0-9-]+)?$/,
    'Version must follow semantic versioning (e.g., 1.0.0, 1.0.0-beta.1)'
  ),
  // Handle both string dates and Date objects
  releaseDate: z.union([z.string(), z.date()]).transform(val => {
    if (val instanceof Date) {
      return val.toISOString().split('T')[0]; // Convert Date to YYYY-MM-DD string
    }
    return val;
  }),
  type: z.enum(['major', 'minor', 'patch', 'hotfix']),
  breaking: z.boolean().optional().default(false),
  categories: z.array(z.enum(['added', 'changed', 'deprecated', 'removed', 'fixed', 'security'])),
  prerelease: z.boolean().optional().default(false),
  yanked: z.boolean().optional().default(false),
  lastUpdated: z.union([z.string(), z.date()]).optional().transform(val => {
    if (val instanceof Date) {
      return val.toISOString().split('T')[0];
    }
    return val;
  }),
  author: z.string().optional(),
  // Handle both array format and comma-separated string
  tags: z.union([
    z.array(z.string()),
    z.string().transform(str => str.split(',').map(tag => tag.trim()))
  ]).optional(),
  image: z.string().optional(),
  published: z.boolean().optional().default(true),
});

/**
 * Default changelog frontmatter values
 */
export const defaultChangelogFrontmatter: Partial<ChangelogFrontmatter> = {
  type: 'patch',
  breaking: false,
  categories: [],
  prerelease: false,
  yanked: false,
  published: true,
  tags: [],
};

/**
 * Generate metadata for changelog entries
 */
function generateChangelogMetadata(
  item: ContentItem<ChangelogFrontmatter>,
  locale?: string
): Metadata {
  const { frontmatter } = item;
  
  const title = `${frontmatter.title} - v${frontmatter.version}`;
  const description = frontmatter.description || 
    `Release notes for version ${frontmatter.version} - ${frontmatter.categories.join(', ')} updates`;
  
  return generateMetadata({
    title,
    description,
    path: `/changelog/${item.slug}`,
    locale,
    type: 'article',
    publishedTime: frontmatter.releaseDate,
    modifiedTime: frontmatter.lastUpdated,
    author: frontmatter.author,
    tags: [
      ...(frontmatter.tags || []),
      'changelog',
      'release',
      frontmatter.type,
      `v${frontmatter.version}`,
      ...frontmatter.categories,
    ],
    image: frontmatter.image,
    keywords: [
      'changelog',
      'release notes',
      'updates',
      'version',
      frontmatter.version,
      ...frontmatter.categories,
    ],
  });
}

/**
 * Process changelog content (add version badges, etc.)
 */
function processChangelogContent(content: string, _frontmatter: ChangelogFrontmatter): string {
  // Don't add HTML badges in the content processing since it causes React className issues
  // The badges are handled in the React component instead
  return content;
}

/**
 * Validate and transform changelog frontmatter
 */
function validateChangelogFrontmatter(frontmatter: any): ChangelogFrontmatter {
  try {
    const validated = changelogFrontmatterSchema.parse(frontmatter);

    // Auto-generate title if not provided
    if (!validated.title || validated.title === frontmatter.version) {
      validated.title = `Release ${validated.version}`;
    }

    // Ensure breaking changes are marked for major versions
    if (validated.type === 'major' && validated.breaking === undefined) {
      validated.breaking = true;
    }

    // Sort categories in a logical order
    const categoryOrder = ['added', 'changed', 'deprecated', 'removed', 'fixed', 'security'];
    validated.categories.sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));

    return validated;
  } catch (error) {
    console.error('Changelog frontmatter validation error:', error);
    // For development, log the original frontmatter to help debug
    if (process.env.NODE_ENV === 'development') {
      console.log('Original changelog frontmatter:', frontmatter);
    }
    throw error;
  }
}

/**
 * Transform changelog item (add computed fields, etc.)
 */
function transformChangelogItem(item: ContentItem<ChangelogFrontmatter>): ContentItem<ChangelogFrontmatter> {
  // Parse version for sorting and comparison
  const version = item.frontmatter.version;
  const versionParts = version.split(/[.-]/);

  // Add computed fields for easier sorting and filtering
  (item as any).computedFields = {
    majorVersion: parseInt(versionParts[0]) || 0,
    minorVersion: parseInt(versionParts[1]) || 0,
    patchVersion: parseInt(versionParts[2]) || 0,
    isPrerelease: item.frontmatter.prerelease || version.includes('-'),
    releaseTimestamp: new Date(item.frontmatter.releaseDate).getTime(),
  };

  return item;
}

// Import components (these will be created later)
// For now, we'll use placeholder components
const ChangelogListLayout = () => null;
const ChangelogDetailLayout = () => null;
const ChangelogCard = () => null;

/**
 * Changelog content type configuration
 */
export const changelogContentType: ContentTypeConfig<ChangelogFrontmatter> = {
  // Basic identification
  id: 'changelog',
  name: 'Changelog',
  pluralName: 'Changelog Entries',
  
  // File system configuration
  directory: 'changelog',
  fileExtension: '.mdx',
  
  // URL and routing configuration
  basePath: '/changelog',
  slugPattern: '[version]',
  
  // Schema and validation
  frontmatterSchema: changelogFrontmatterSchema as any, // Type assertion to handle transform types
  defaultFrontmatter: defaultChangelogFrontmatter,
  
  // Features and behavior
  features: {
    pagination: true,
    categories: true,
    tags: true,
    search: true,
    sorting: ['releaseDate', 'version', 'type'],
    comments: false,
    readingTime: false,
    tableOfContents: true,
    relatedContent: false,
  },
  
  // Display configuration
  itemsPerPage: 20,
  defaultSortBy: 'releaseDate',
  defaultSortOrder: 'desc',
  
  // Components (placeholders for now)
  components: {
    listLayout: ChangelogListLayout,
    detailLayout: ChangelogDetailLayout,
    cardComponent: ChangelogCard,
  },
  
  // SEO and metadata
  seo: {
    titleTemplate: '%s | Changelog',
    defaultDescription: 'Product updates, release notes, and version history.',
    ogType: 'article',
    generateMetadata: generateChangelogMetadata,
    keywords: ['changelog', 'release notes', 'updates', 'version history'],
  },
  
  // Custom processing functions
  processContent: processChangelogContent,
  validateFrontmatter: validateChangelogFrontmatter,
  transformItem: transformChangelogItem,
};

/**
 * Helper function to get changelog entries with version-specific filtering
 */
export async function getChangelogEntries(
  locale: string,
  options: {
    published?: boolean;
    limit?: number;
    majorVersion?: number;
    includePrerelease?: boolean;
    includeYanked?: boolean;
    type?: 'major' | 'minor' | 'patch' | 'hotfix';
    category?: string;
  } = {}
) {
  // This will use the new getAllContent function
  const { getAllContent } = await import('../mdx');
  
  const queryOptions = {
    published: options.published !== false, // Default to true
    limit: options.limit,
    sortBy: 'releaseDate',
    sortOrder: 'desc' as const,
  };
  
  let entries = await getAllContent<ChangelogFrontmatter>('changelog', locale, queryOptions);
  
  // Filter by version constraints
  if (options.majorVersion !== undefined) {
    entries = entries.filter(entry => {
      const version = entry.frontmatter.version;
      const majorVersion = parseInt(version.split('.')[0]);
      return majorVersion === options.majorVersion;
    });
  }
  
  // Filter by prerelease status
  if (!options.includePrerelease) {
    entries = entries.filter(entry => !entry.frontmatter.prerelease);
  }
  
  // Filter by yanked status
  if (!options.includeYanked) {
    entries = entries.filter(entry => !entry.frontmatter.yanked);
  }
  
  // Filter by type
  if (options.type) {
    entries = entries.filter(entry => entry.frontmatter.type === options.type);
  }
  
  // Filter by category
  if (options.category) {
    entries = entries.filter(entry => 
      entry.frontmatter.categories.includes(options.category as any)
    );
  }
  
  return entries;
}

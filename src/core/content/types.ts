/**
 * Content Type System - Core Types and Interfaces
 * 
 * This module defines the core types and interfaces for the modular content system.
 * It provides a flexible foundation for different content types (blog, changelog, docs, etc.)
 */

import { ComponentType } from 'react';
import { Metadata } from 'next';
import { z } from 'zod';

/**
 * Base content frontmatter interface
 * All content types must extend this interface
 */
export interface ContentFrontmatter {
  title: string;
  description?: string;
  lastUpdated?: string;
  author?: string;
  tags?: string[];
  image?: string;
  published?: boolean;
  [key: string]: any;
}

/**
 * Content item with typed frontmatter
 */
export interface ContentItem<T extends ContentFrontmatter = ContentFrontmatter> {
  slug: string;
  locale: string;
  frontmatter: T;
  content: string;
  path: string;
}

/**
 * Query options for content retrieval
 */
export interface ContentQueryOptions {
  published?: boolean;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
  tags?: string[];
  [key: string]: any;
}

/**
 * Content type features configuration
 */
export interface ContentTypeFeatures {
  pagination: boolean;
  categories: boolean;
  tags: boolean;
  search: boolean;
  sorting: string[];
  comments?: boolean;
  readingTime?: boolean;
  tableOfContents?: boolean;
  relatedContent?: boolean;
}

/**
 * Content type SEO configuration
 */
export interface ContentTypeSEO<T extends ContentFrontmatter = ContentFrontmatter> {
  titleTemplate: string;
  defaultDescription: string;
  ogType: 'website' | 'article' | 'profile';
  generateMetadata: (item: ContentItem<T>, locale?: string) => Metadata;
  keywords?: string[];
}

/**
 * Content type component configuration
 */
export interface ContentTypeComponents {
  listLayout: ComponentType<any>;
  detailLayout: ComponentType<any>;
  cardComponent: ComponentType<any>;
  headerComponent?: ComponentType<any>;
  footerComponent?: ComponentType<any>;
}

/**
 * Main content type configuration interface
 */
export interface ContentTypeConfig<T extends ContentFrontmatter = ContentFrontmatter> {
  // Basic identification
  id: string;
  name: string;
  pluralName: string;
  
  // File system configuration
  directory: string;
  fileExtension: string;
  
  // URL and routing configuration
  basePath: string;
  slugPattern: string;
  
  // Schema and validation
  frontmatterSchema: z.ZodSchema<T>;
  defaultFrontmatter: Partial<T>;
  
  // Features and behavior
  features: ContentTypeFeatures;
  
  // Display configuration
  itemsPerPage: number;
  defaultSortBy: string;
  defaultSortOrder: 'asc' | 'desc';
  
  // Components
  components: ContentTypeComponents;
  
  // SEO and metadata
  seo: ContentTypeSEO<T>;
  
  // Custom processing functions
  processContent?: (content: string, frontmatter: T) => string;
  validateFrontmatter?: (frontmatter: any) => T;
  transformItem?: (item: ContentItem<T>) => ContentItem<T>;
}

/**
 * Content type registry interface
 */
export interface ContentTypeRegistry {
  [key: string]: ContentTypeConfig<any>;
}

/**
 * Content processing options
 */
export interface ContentProcessingOptions {
  parseFrontmatter: boolean;
  validateSchema: boolean;
  transformContent: boolean;
  generateExcerpt: boolean;
  calculateReadingTime: boolean;
}

/**
 * Content metadata for listings and navigation
 */
export interface ContentMetadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Content search result
 */
export interface ContentSearchResult<T extends ContentFrontmatter = ContentFrontmatter> {
  item: ContentItem<T>;
  score: number;
  matches: {
    field: string;
    value: string;
    highlight: string;
  }[];
}

/**
 * Content statistics
 */
export interface ContentStatistics {
  total: number;
  published: number;
  drafts: number;
  categories: number;
  tags: number;
  totalWords: number;
  averageReadingTime: number;
  lastUpdated?: string;
}

/**
 * Content type registration options
 */
export interface ContentTypeRegistrationOptions {
  override?: boolean;
  validate?: boolean;
  autoRegisterRoutes?: boolean;
}

/**
 * Content validation result
 */
export interface ContentValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
    code: string;
  }[];
  warnings: {
    field: string;
    message: string;
    code: string;
  }[];
}

/**
 * Content export/import format
 */
export interface ContentExportFormat<T extends ContentFrontmatter = ContentFrontmatter> {
  contentType: string;
  version: string;
  items: ContentItem<T>[];
  metadata: {
    exportedAt: string;
    totalItems: number;
    locale: string;
  };
}

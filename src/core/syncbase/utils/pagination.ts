/**
 * Pagination utilities for SyncBase Client
 */

import { PaginationOptions, PaginatedResponse } from '../core/types';

/**
 * Create pagination options with defaults
 */
export function createPaginationOptions(options: Partial<PaginationOptions> = {}): PaginationOptions {
  return {
    limit: 20,
    direction: 'before',
    sortBy: 'cursor',
    sortOrder: 'DESC',
    ...options
  };
}

/**
 * Merge paginated results
 */
export function mergePaginatedResults<T>(
  existing: T[],
  newItems: T[],
  keyField: keyof T = 'id' as keyof T
): T[] {
  const existingIds = new Set(existing.map(item => item[keyField]));
  const uniqueNewItems = newItems.filter(item => !existingIds.has(item[keyField]));
  return [...existing, ...uniqueNewItems];
}

/**
 * Sort items by cursor
 */
export function sortByCursor<T extends { cursor: string }>(
  items: T[],
  direction: 'before' | 'after' = 'before'
): T[] {
  return items.sort((a, b) => {
    const aTime = parseInt(a.cursor, 10);
    const bTime = parseInt(b.cursor, 10);
    
    if (direction === 'before') {
      return bTime - aTime; // Newest first
    } else {
      return aTime - bTime; // Oldest first
    }
  });
}

/**
 * Extract next cursor from items
 */
export function extractNextCursor<T extends { cursor: string }>(
  items: T[],
  direction: 'before' | 'after' = 'before'
): string | undefined {
  if (items.length === 0) {
    return undefined;
  }

  if (direction === 'before') {
    // For "before" pagination, next cursor is the oldest item's cursor
    return items[items.length - 1]?.cursor;
  } else {
    // For "after" pagination, next cursor is the newest item's cursor
    return items[0]?.cursor;
  }
}

/**
 * Create cursor query for database
 */
export function createCursorQuery(
  cursor?: string,
  direction: 'before' | 'after' = 'before'
): { operator: string; value?: string } {
  if (!cursor) {
    return { operator: '', value: undefined };
  }

  if (direction === 'before') {
    return { operator: '<', value: cursor };
  } else {
    return { operator: '>', value: cursor };
  }
}

/**
 * Check if there are more items available
 */
export function hasMoreItems<T>(
  items: T[],
  requestedLimit: number
): boolean {
  return items.length >= requestedLimit;
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta<T extends { cursor: string }>(
  items: T[],
  options: PaginationOptions
): {
  hasMore: boolean;
  nextCursor?: string;
  prevCursor?: string;
  limit: number;
  count: number;
} {
  const limit = options.limit || 20;
  const hasMore = hasMoreItems(items, limit);
  const nextCursor = hasMore ? extractNextCursor(items, options.direction) : undefined;
  
  // For previous cursor, we need to reverse the direction
  const prevDirection = options.direction === 'before' ? 'after' : 'before';
  const prevCursor = items.length > 0 ? extractNextCursor(items, prevDirection) : undefined;

  return {
    hasMore,
    nextCursor,
    prevCursor,
    limit,
    count: items.length
  };
}

/**
 * Validate pagination options
 */
export function validatePaginationOptions(options: PaginationOptions): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (options.limit !== undefined) {
    if (options.limit <= 0) {
      errors.push('Limit must be greater than 0');
    }
    if (options.limit > 100) {
      errors.push('Limit cannot exceed 100');
    }
  }

  if (options.direction && !['before', 'after'].includes(options.direction)) {
    errors.push('Direction must be either "before" or "after"');
  }

  if (options.sortOrder && !['ASC', 'DESC'].includes(options.sortOrder)) {
    errors.push('Sort order must be either "ASC" or "DESC"');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Pagination Manager class for advanced pagination handling
 */
export class PaginationManager<T extends { cursor: string }> {
  private items: T[] = [];
  private cursors: Map<string, number> = new Map(); // cursor -> index mapping
  private options: PaginationOptions;

  constructor(options: PaginationOptions = {}) {
    this.options = createPaginationOptions(options);
  }

  /**
   * Add items to the manager
   */
  addItems(newItems: T[], replace: boolean = false): void {
    if (replace) {
      this.items = [];
      this.cursors.clear();
    }

    // Merge items and update cursor mapping
    const merged = mergePaginatedResults(this.items, newItems);
    this.items = sortByCursor(merged, this.options.direction);
    
    // Update cursor mapping
    this.items.forEach((item, index) => {
      this.cursors.set(item.cursor, index);
    });
  }

  /**
   * Get items for a specific page
   */
  getPage(cursor?: string, limit?: number): {
    items: T[];
    pagination: {
      hasMore: boolean;
      nextCursor?: string;
      prevCursor?: string;
      limit: number;
    };
  } {
    const pageLimit = limit || this.options.limit || 20;
    let startIndex = 0;

    if (cursor) {
      const cursorIndex = this.cursors.get(cursor);
      if (cursorIndex !== undefined) {
        startIndex = cursorIndex + 1; // Start after the cursor
      }
    }

    const endIndex = startIndex + pageLimit;
    const pageItems = this.items.slice(startIndex, endIndex);

    return {
      items: pageItems,
      pagination: calculatePaginationMeta(pageItems, {
        ...this.options,
        limit: pageLimit
      })
    };
  }

  /**
   * Get all items
   */
  getAllItems(): T[] {
    return [...this.items];
  }

  /**
   * Get item by cursor
   */
  getItemByCursor(cursor: string): T | undefined {
    const index = this.cursors.get(cursor);
    return index !== undefined ? this.items[index] : undefined;
  }

  /**
   * Remove item by cursor
   */
  removeItem(cursor: string): boolean {
    const index = this.cursors.get(cursor);
    if (index === undefined) {
      return false;
    }

    this.items.splice(index, 1);
    this.cursors.delete(cursor);

    // Update cursor mapping for items after the removed item
    for (let i = index; i < this.items.length; i++) {
      this.cursors.set(this.items[i].cursor, i);
    }

    return true;
  }

  /**
   * Update item by cursor
   */
  updateItem(cursor: string, updater: (item: T) => T): boolean {
    const index = this.cursors.get(cursor);
    if (index === undefined) {
      return false;
    }

    this.items[index] = updater(this.items[index]);
    return true;
  }

  /**
   * Clear all items
   */
  clear(): void {
    this.items = [];
    this.cursors.clear();
  }

  /**
   * Get total count
   */
  getCount(): number {
    return this.items.length;
  }

  /**
   * Check if has items
   */
  hasItems(): boolean {
    return this.items.length > 0;
  }

  /**
   * Get first item
   */
  getFirstItem(): T | undefined {
    return this.items[0];
  }

  /**
   * Get last item
   */
  getLastItem(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

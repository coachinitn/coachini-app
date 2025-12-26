import { FilterFn, FilterValue } from './useFilterData';

/**
 * Common filter functions that can be reused
 * These are utility functions to create common filter patterns
 */

/**
 * Text search filter that searches across multiple string fields
 */
export function createTextSearchFilter<T>(fields: (keyof T)[]): FilterFn<T> {
  return (item, [query]) => {
    if (!query || typeof query !== 'string') return true;
    const searchTerm = query.toLowerCase();
    return fields.some(field => {
      const value = item[field];
      return typeof value === 'string' && value.toLowerCase().includes(searchTerm);
    });
  };
}

/**
 * Array inclusion filter (OR logic)
 */
export function createArrayIncludesFilter<T>(field: keyof T): FilterFn<T> {
  return (item, selectedValues) => {
    if (!selectedValues.length) return true;
    const itemValue = item[field];
    if (Array.isArray(itemValue)) {
      return selectedValues.some(value => itemValue.includes(value as any));
    }
    return selectedValues.includes(itemValue as any);
  };
}

/**
 * Range filter for numeric values
 */
export function createNumericRangeFilter<T>(field: keyof T): FilterFn<T> {
  return (item, [min, max]) => {
    const value = item[field] as number;
    if (typeof value !== 'number') return true;
    if (min && value < (min as number)) return false;
    if (max && value > (max as number)) return false;
    return true;
  };
}

/**
 * Date range filter
 */
export function createDateRangeFilter<T>(field: keyof T): FilterFn<T> {
  return (item, [startDate, endDate]) => {
    const value = item[field];
    const itemDate = value instanceof Date ? value : new Date(value as any);
    if (isNaN(itemDate.getTime())) return true;
    
    if (startDate && itemDate < new Date(startDate as any)) return false;
    if (endDate && itemDate > new Date(endDate as any)) return false;
    return true;
  };
}

/**
 * Exact match filter
 */
export function createExactMatchFilter<T>(field: keyof T): FilterFn<T> {
  return (item, selectedValues) => {
    if (!selectedValues.length) return true;
    return selectedValues.includes(item[field] as any);
  };
}

/**
 * Boolean filter
 */
export function createBooleanFilter<T>(field: keyof T): FilterFn<T> {
  return (item, [value]) => {
    if (value === null || value === undefined) return true;
    return item[field] === value;
  };
}

/**
 * Minimum threshold filter
 */
export function createMinimumFilter<T>(field: keyof T): FilterFn<T> {
  return (item, [min]) => {
    if (!min) return true;
    const value = item[field] as number;
    return typeof value === 'number' && value >= (min as number);
  };
}

/**
 * Custom regex filter
 */
export function createRegexFilter<T>(field: keyof T): FilterFn<T> {
  return (item, [pattern, flags]) => {
    if (!pattern || typeof pattern !== 'string') return true;
    try {
      const regex = new RegExp(pattern, flags as string || 'i');
      const value = item[field];
      return typeof value === 'string' && regex.test(value);
    } catch {
      return true; // Invalid regex, show all items
    }
  };
}

/**
 * Combined OR filter (for multiple field search)
 */
export function createMultiFieldOrFilter<T>(
  filters: Record<string, FilterFn<T>>
): FilterFn<T> {
  return (item, filterValues, filterId) => {
    const filterEntries = Object.entries(filters);
    return filterEntries.some(([, filterFn]) => 
      filterFn(item, filterValues, filterId)
    );
  };
}

/**
 * Combined AND filter (for multiple field search)
 */
export function createMultiFieldAndFilter<T>(
  filters: Record<string, FilterFn<T>>
): FilterFn<T> {
  return (item, filterValues, filterId) => {
    const filterEntries = Object.entries(filters);
    return filterEntries.every(([, filterFn]) => 
      filterFn(item, filterValues, filterId)
    );
  };
}

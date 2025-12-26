/**
 * Translation Cache Manager
 * 
 * Manages caching for translation files to avoid unnecessary regeneration
 * when translation files haven't changed.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface CacheEntry {
  hash: string;
  timestamp: number;
  data: any;
}

export class TranslationCacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private cacheFile: string;

  constructor() {
    this.cacheFile = path.join(process.cwd(), '.next', 'translations-cache.json');
    this.loadCache();
  }

  /**
   * Generate cache key based on translation files
   */
  async getCacheKey(dictionaryDir: string): Promise<string> {
    const translationFiles = this.getTranslationFiles(dictionaryDir);
    const fileHashes: string[] = [];

    for (const file of translationFiles) {
      if (fs.existsSync(file)) {
        const content = await fs.promises.readFile(file, 'utf8');
        const hash = this.hashContent(content);
        fileHashes.push(`${path.basename(file)}:${hash}`);
      }
    }

    return this.hashContent(fileHashes.join('|'));
  }

  /**
   * Check if a cache entry exists and is valid
   */
  isCached(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // Cache is valid for 1 hour in development, longer in production
    const maxAge = process.env.NODE_ENV === 'development' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const isExpired = Date.now() - entry.timestamp > maxAge;

    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Update cache with new data
   */
  updateCache(key: string, data: any): void {
    this.cache.set(key, {
      hash: key,
      timestamp: Date.now(),
      data
    });

    this.saveCache();
  }

  /**
   * Get cached data
   */
  getCachedData(key: string): any {
    const entry = this.cache.get(key);
    return entry?.data;
  }

  /**
   * Clear all cache entries
   */
  clearCache(): void {
    this.cache.clear();
    this.saveCache();
  }

  /**
   * Get list of translation files for cache key generation
   */
  private getTranslationFiles(dictionaryDir: string): string[] {
    const files: string[] = [];

    const scanDirectory = (dir: string) => {
      try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
          const itemPath = path.join(dir, item.name);
          
          if (item.isDirectory()) {
            scanDirectory(itemPath);
          } else if (item.isFile() && item.name.endsWith('.json')) {
            files.push(itemPath);
          }
        }
      } catch (error) {
        // Ignore errors for missing directories
      }
    };

    try {
      if (fs.existsSync(dictionaryDir)) {
        const locales = fs.readdirSync(dictionaryDir).filter(item => 
          fs.statSync(path.join(dictionaryDir, item)).isDirectory()
        );

        for (const locale of locales) {
          const localeDir = path.join(dictionaryDir, locale);
          scanDirectory(localeDir);
        }
      }
    } catch (error) {
      console.warn('Error scanning translation files for cache:', error);
    }

    return files;
  }

  /**
   * Generate hash for content
   */
  private hashContent(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Load cache from disk
   */
  private loadCache(): void {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const content = fs.readFileSync(this.cacheFile, 'utf8');
        const data = JSON.parse(content);
        
        // Convert plain object back to Map
        for (const [key, value] of Object.entries(data)) {
          this.cache.set(key, value as CacheEntry);
        }
      }
    } catch (error) {
      console.warn('Failed to load translation cache:', error);
      this.cache.clear();
    }
  }

  /**
   * Save cache to disk
   */
  private saveCache(): void {
    try {
      // Ensure .next directory exists
      const nextDir = path.dirname(this.cacheFile);
      if (!fs.existsSync(nextDir)) {
        fs.mkdirSync(nextDir, { recursive: true });
      }

      // Convert Map to plain object for JSON serialization
      const data = Object.fromEntries(this.cache);
      fs.writeFileSync(this.cacheFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.warn('Failed to save translation cache:', error);
    }
  }

  /**
   * Cleanup old cache entries
   */
  cleanupOldEntries(): void {
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }

    this.saveCache();
  }
}

/**
 * Cache Manager
 * 
 * Manages caching for design tokens to avoid unnecessary regeneration
 * when source files haven't changed.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface CacheEntry {
  key: string;
  timestamp: number;
  tokens: any;
  fileHashes: Record<string, string>;
}

export class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private cacheFile: string;

  constructor() {
    this.cacheFile = path.join(process.cwd(), '.next', 'design-tokens-cache.json');
    this.loadCache();
  }

  /**
   * Generate cache key based on token files
   */
  async getCacheKey(tokensDir: string): Promise<string> {
    const tokenFiles = this.getTokenFiles(tokensDir);
    const fileHashes: string[] = [];

    for (const file of tokenFiles) {
      if (fs.existsSync(file)) {
        const content = await fs.promises.readFile(file, 'utf8');
        const hash = this.hashContent(content);
        fileHashes.push(`${path.basename(file)}:${hash}`);
      }
    }

    return this.hashContent(fileHashes.join('|'));
  }

  /**
   * Check if tokens are cached and still valid
   */
  isCached(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if cache is not too old (1 hour in development, 24 hours in production)
    const maxAge = process.env.NODE_ENV === 'development' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const age = Date.now() - entry.timestamp;

    return age < maxAge;
  }

  /**
   * Get cached tokens
   */
  getCachedTokens(key: string): any {
    const entry = this.cache.get(key);
    return entry?.tokens;
  }

  /**
   * Update cache with new tokens
   */
  updateCache(key: string, tokens: any): void {
    const entry: CacheEntry = {
      key,
      timestamp: Date.now(),
      tokens,
      fileHashes: {},
    };

    this.cache.set(key, entry);
    this.saveCache();
  }

  /**
   * Clear all cache entries
   */
  clearCache(): void {
    this.cache.clear();
    this.saveCache();
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }

    this.saveCache();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; oldestEntry: number; newestEntry: number } {
    if (this.cache.size === 0) {
      return { size: 0, oldestEntry: 0, newestEntry: 0 };
    }

    const timestamps = Array.from(this.cache.values()).map(entry => entry.timestamp);
    
    return {
      size: this.cache.size,
      oldestEntry: Math.min(...timestamps),
      newestEntry: Math.max(...timestamps),
    };
  }

  /**
   * Load cache from disk
   */
  private loadCache(): void {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const cacheData = fs.readFileSync(this.cacheFile, 'utf8');
        const parsed = JSON.parse(cacheData);
        
        if (Array.isArray(parsed)) {
          // Convert array format to Map
          for (const entry of parsed) {
            this.cache.set(entry.key, entry);
          }
        } else if (parsed && typeof parsed === 'object') {
          // Convert object format to Map
          for (const [key, entry] of Object.entries(parsed)) {
            this.cache.set(key, entry as CacheEntry);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ [Cache Manager] Failed to load cache, starting fresh:', error);
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

      // Convert Map to array for JSON serialization
      const cacheArray = Array.from(this.cache.values());
      fs.writeFileSync(this.cacheFile, JSON.stringify(cacheArray, null, 2));
    } catch (error) {
      console.warn('⚠️ [Cache Manager] Failed to save cache:', error);
    }
  }

  /**
   * Get list of token files
   */
  private getTokenFiles(tokensDir: string): string[] {
    const files = [
      'colors.ts',
      'themes.ts',
      'theme.ts',
      'types.ts',
    ];

    return files.map(file => path.join(tokensDir, file));
  }

  /**
   * Generate hash for content
   */
  private hashContent(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex');
  }
}

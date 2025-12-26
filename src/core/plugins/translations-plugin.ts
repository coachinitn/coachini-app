/**
 * Translations Next.js Plugin
 *
 * A comprehensive Next.js plugin that handles translation bundling and TypeScript
 * type generation. Works with both Turbopack and webpack by using Next.js
 * configuration hooks instead of bundler-specific hooks.
 */

import { NextConfig } from 'next';
import * as path from 'path';
import * as chokidar from 'chokidar';
import { TranslationBundler } from './generators/translation-bundler';
import { TranslationTypesGenerator } from './generators/translation-types-generator';
import { FileManager } from './utils/file-manager';
import { TranslationCacheManager } from './utils/translation-cache-manager';

export interface TranslationsPluginOptions {
  /** Source directory for translation files */
  dictionaryDir?: string;
  /** Output directory for bundled translations */
  outputDir?: string;
  /** Output file for TypeScript types */
  typesOutputFile?: string;
  /** Default locale for type generation */
  defaultLocale?: string;
  /** Enable development mode features */
  isDev?: boolean;
  /** Enable verbose logging */
  verbose?: boolean;
  /** Create backup files before overwriting */
  createBackups?: boolean;
  /** Enable file watching for automatic regeneration */
  enableWatching?: boolean;
  /** Custom file patterns to watch */
  watchPatterns?: string[];
}

/**
 * Global translations manager instance
 */
let translationsManagerInstance: TranslationsManager | null = null;

class TranslationsManager {
  private options: Required<TranslationsPluginOptions>;
  private bundler: TranslationBundler;
  private typesGenerator: TranslationTypesGenerator;
  private fileManager: FileManager;
  private cacheManager: TranslationCacheManager;
  private watcher: chokidar.FSWatcher | null = null;
  private isInitialized = false;

  constructor(options: TranslationsPluginOptions = {}) {
    this.options = {
      dictionaryDir: path.resolve(process.cwd(), 'dictionary'),
      outputDir: path.resolve(process.cwd(), 'src/core/i18n/generated'),
      typesOutputFile: path.resolve(process.cwd(), 'src/core/i18n/generated-types.ts'),
      defaultLocale: 'en',
      isDev: process.env.NODE_ENV === 'development',
      verbose: false,
      createBackups: true,
      enableWatching: this.shouldEnableWatching(),
      watchPatterns: ['**/*.json'],
      ...options,
    };

    this.bundler = new TranslationBundler(this.options.dictionaryDir, this.options.outputDir);
    this.typesGenerator = new TranslationTypesGenerator(
      this.options.dictionaryDir,
      this.options.defaultLocale,
      this.options.typesOutputFile
    );
    this.fileManager = new FileManager(this.options.outputDir, this.options.createBackups);
    this.cacheManager = new TranslationCacheManager();
  }

  /**
   * Determine if file watching should be enabled
   */
  private shouldEnableWatching(): boolean {
    // Disable watching in production
    if (process.env.NODE_ENV === 'production') {
      return false;
    }

    // Allow explicit control via environment variable
    if (process.env.TRANSLATIONS_WATCH === 'false') {
      return false;
    }

    // Enable by default in development
    return true;
  }

  /**
   * Initialize the translations manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Generate translations and types
      await this.generateTranslations();

      // Setup file watching if enabled
      if (this.options.enableWatching && this.options.isDev) {
        this.setupFileWatching();
      }

      this.isInitialized = true;

      if (this.options.verbose) {
        console.log('🌐 [Translations] Plugin initialized successfully');
      }

    } catch (error) {
      console.error('❌ [Translations] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Setup file watching for automatic regeneration
   */
  private setupFileWatching(): void {
    if (this.watcher) {
      return; // Already watching
    }

    const watchPaths = this.options.watchPatterns.map(pattern =>
      path.join(this.options.dictionaryDir, pattern)
    );

    this.watcher = chokidar.watch(watchPaths, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100
      }
    });

    this.watcher
      .on('add', (filePath) => {
        if (this.options.verbose) {
          console.log(`🌐 [Translations] File added: ${path.relative(process.cwd(), filePath)}`);
        }
        this.handleFileChange();
      })
      .on('change', (filePath) => {
        if (this.options.verbose) {
          console.log(`🌐 [Translations] File changed: ${path.relative(process.cwd(), filePath)}`);
        }
        this.handleFileChange();
      })
      .on('unlink', (filePath) => {
        if (this.options.verbose) {
          console.log(`🌐 [Translations] File deleted: ${path.relative(process.cwd(), filePath)}`);
        }
        this.handleFileChange();
      });

    if (this.options.verbose) {
      console.log('🌐 [Translations] File watching enabled');
    }
  }

  /**
   * Handle file changes with debouncing
   */
  private debounceTimer: NodeJS.Timeout | null = null;
  private handleFileChange(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(async () => {
      try {
        await this.generateTranslations();
      } catch (error) {
        console.error('❌ [Translations] Failed to regenerate after file change:', error);
      }
    }, 500);
  }

  /**
   * Generate translations and types
   */
  private async generateTranslations(): Promise<void> {
    const startTime = Date.now();

    if (this.options.verbose) {
      console.log('🌐 [Translations] Starting translation generation...');
    }

    try {
      // Check cache first
      const cacheKey = await this.cacheManager.getCacheKey(this.options.dictionaryDir);
      if (this.isInitialized && this.cacheManager.isCached(cacheKey)) {
        if (this.options.verbose) {
          console.log('🌐 [Translations] Using cached translations');
        }
        return;
      }

      // Bundle translations
      await this.bundler.bundleTranslations();

      // Generate TypeScript types
      await this.typesGenerator.generateTypes();

      // Update cache
      this.cacheManager.updateCache(cacheKey, { timestamp: Date.now() });

      const duration = Date.now() - startTime;
      console.log(`🌐 [Translations] Generated in ${duration}ms`);

    } catch (error) {
      console.error('❌ [Translations] Generation failed:', error);
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    // Cleanup old backup files
    await this.fileManager.cleanupBackups();

    if (this.options.verbose) {
      console.log('🌐 [Translations] Cleanup completed');
    }
  }
}

/**
 * Initialize the global translations manager
 */
async function initializeTranslationsManager(options: TranslationsPluginOptions): Promise<void> {
  if (translationsManagerInstance) {
    return; // Already initialized
  }

  translationsManagerInstance = new TranslationsManager(options);
  await translationsManagerInstance.initialize();

  // Cleanup on process exit
  const cleanup = async () => {
    if (translationsManagerInstance) {
      await translationsManagerInstance.cleanup();
      translationsManagerInstance = null;
    }
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
}

/**
 * Next.js plugin factory function that works with both Turbopack and webpack
 */
export function withTranslations(options: TranslationsPluginOptions = {}) {
  return (nextConfig: NextConfig = {}): NextConfig => {

    // Initialize translations manager immediately when the config is loaded
    initializeTranslationsManager(options).catch(error => {
      console.error('❌ [Translations] Failed to initialize:', error);
    });

    return {
      ...nextConfig,

      // Hook into webpack for additional compatibility (but don't re-initialize)
      webpack: (config, context) => {
        // Call the original webpack function if it exists
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, context);
        }

        return config;
      },
    };
  };
}

// Export the manager class for direct usage
export { TranslationsManager };

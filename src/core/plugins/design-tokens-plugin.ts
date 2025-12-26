/**
 * Design Tokens Next.js Plugin
 *
 * A comprehensive Next.js plugin that replaces the script-based approach
 * for generating CSS from design tokens. Works with both Turbopack and webpack
 * by using Next.js configuration hooks instead of bundler-specific hooks.
 */

import { NextConfig } from 'next';
import * as path from 'path';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import { TokenLoader } from './generators/token-loader';
import { CSSGenerator } from './generators/css-generator';
import { FileManager } from './utils/file-manager';
import { CacheManager } from './utils/cache-manager';

export interface DesignTokensPluginOptions {
  /** Source directory for design tokens */
  tokensDir?: string;
  /** Output directory for generated CSS files */
  outputDir?: string;
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

export class DesignTokensManager {
  private options: Required<DesignTokensPluginOptions>;
  private tokenLoader: TokenLoader;
  private cssGenerator: CSSGenerator;
  private fileManager: FileManager;
  private cacheManager: CacheManager;
  private watcher?: chokidar.FSWatcher;
  private isInitialized = false;
  private regenerationTimeout?: NodeJS.Timeout;
  private isRegenerating = false;

  constructor(options: DesignTokensPluginOptions = {}) {
    this.options = {
      tokensDir: path.resolve(process.cwd(), 'src/design-system/tokens'),
      outputDir: path.resolve(process.cwd(), 'src'),
      isDev: process.env.NODE_ENV === 'development',
      verbose: false,
      createBackups: true,
      enableWatching: this.shouldEnableWatching(),
      watchPatterns: ['**/*.ts', '**/*.js'],
      ...options,
    };

    this.tokenLoader = new TokenLoader(this.options.tokensDir);
    this.cssGenerator = new CSSGenerator();
    this.fileManager = new FileManager(this.options.outputDir, this.options.createBackups);
    this.cacheManager = new CacheManager();
  }

  /**
   * Determine if file watching should be enabled
   */
  private shouldEnableWatching(): boolean {
    // Check environment variable first
    if (process.env.DESIGN_TOKENS_WATCH === 'false') {
      return false;
    }

    // Check for CI environment
    if (process.env.CI === 'true') {
      return false;
    }

    // Enable by default in development
    return process.env.NODE_ENV === 'development';
  }

  /**
   * Initialize the design tokens manager
   * This works with both Turbopack and webpack
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🎨 [Design Tokens] Initializing...');

    try {
      // Generate tokens immediately
      await this.generateTokens();

      // Set up file watching if enabled
      if (this.options.enableWatching) {
        this.setupFileWatching();
      } else if (this.options.verbose) {
        console.log('🎨 [Design Tokens] File watching disabled');
      }

      this.isInitialized = true;
      console.log('🎨 [Design Tokens] Initialization complete');
    } catch (error) {
      console.error('❌ [Design Tokens] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Set up file watching for development mode
   */
  private setupFileWatching(): void {
    const watchPaths = [
      path.join(this.options.tokensDir, '**/*.ts'),
      path.join(this.options.tokensDir, '**/*.js'),
    ];

    this.watcher = chokidar.watch(watchPaths, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    });

    this.watcher.on('all', async (event, filePath) => {
      if (this.options.verbose) {
        console.log(`🎨 [Design Tokens] File ${event}: ${path.relative(process.cwd(), filePath)}`);
      }

      // Debounce regeneration to prevent multiple triggers
      this.debouncedRegeneration();
    });

    console.log('🎨 [Design Tokens] File watching enabled');
  }

  /**
   * Debounced regeneration to prevent multiple triggers
   */
  private debouncedRegeneration(): void {
    // Clear existing timeout
    if (this.regenerationTimeout) {
      clearTimeout(this.regenerationTimeout);
    }

    // Skip if already regenerating
    if (this.isRegenerating) {
      return;
    }

    // Set new timeout
    this.regenerationTimeout = setTimeout(async () => {
      this.isRegenerating = true;
      try {
        await this.generateTokens();
      } catch (error) {
        console.error('❌ [Design Tokens] Error during file watch regeneration:', error);
      } finally {
        this.isRegenerating = false;
      }
    }, 500); // 500ms debounce
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.regenerationTimeout) {
      clearTimeout(this.regenerationTimeout);
      this.regenerationTimeout = undefined;
    }

    if (this.watcher) {
      this.watcher.close();
      this.watcher = undefined;
    }
  }

  private async generateTokens(): Promise<void> {
    const startTime = Date.now();

    if (this.options.verbose) {
      console.log('🎨 [Design Tokens] Starting token generation...');
    }

    try {
      // Check cache first
      const cacheKey = await this.cacheManager.getCacheKey(this.options.tokensDir);
      if (this.isInitialized && this.cacheManager.isCached(cacheKey)) {
        if (this.options.verbose) {
          console.log('🎨 [Design Tokens] Using cached tokens');
        }
        return;
      }

      // Load design tokens from TypeScript files
      const tokens = await this.tokenLoader.loadTokens();

      // Generate CSS files
      await this.generateCSSFiles(tokens);

      // Update cache
      this.cacheManager.updateCache(cacheKey, tokens);

      const duration = Date.now() - startTime;
      console.log(`🎨 [Design Tokens] Generated in ${duration}ms`);

    } catch (error) {
      console.error('❌ [Design Tokens] Generation failed:', error);
      throw error;
    }
  }

  private async generateCSSFiles(tokens: any): Promise<void> {
    const { colors, themes, theme } = tokens;

    // Generate colors.css
    const colorsCSS = this.cssGenerator.generateColorsCSS(colors);
    await this.fileManager.writeFile('styles/colors.css', colorsCSS);

    // Generate theme files
    if (themes && Array.isArray(themes)) {
      for (const themeData of themes) {
        const themeCSS = this.cssGenerator.generateThemeCSS(themeData);
        await this.fileManager.writeFile(`styles/${themeData.id}-theme.css`, themeCSS);
      }
    }

    // Generate theme-base.css
    const baseCSS = this.cssGenerator.generateBaseCSS(themes, theme);
    await this.fileManager.writeFile('styles/theme-base.css', baseCSS);

    // Generate globals.css
    const globalsCSS = this.cssGenerator.generateGlobalsCSS(themes);
    await this.fileManager.writeFile('app/globals.css', globalsCSS);

    if (this.options.verbose) {
      console.log('🎨 [Design Tokens] CSS files generated successfully');
    }
  }

}

// Global instance to ensure singleton behavior
let globalTokensManager: DesignTokensManager | null = null;
let isInitializing = false;

/**
 * Initialize tokens manager with singleton pattern
 */
async function initializeTokensManager(options: DesignTokensPluginOptions): Promise<void> {
  if (globalTokensManager || isInitializing) {
    return;
  }

  isInitializing = true;
  try {
    globalTokensManager = new DesignTokensManager({
      ...options,
      isDev: process.env.NODE_ENV === 'development',
      verbose: options.verbose ?? process.env.NODE_ENV === 'development',
    });

    await globalTokensManager.initialize();
  } finally {
    isInitializing = false;
  }
}

/**
 * Next.js plugin factory function that works with both Turbopack and webpack
 */
export function withDesignTokens(options: DesignTokensPluginOptions = {}) {
  return (nextConfig: NextConfig = {}): NextConfig => {

    // Initialize tokens manager immediately when the config is loaded
    initializeTokensManager(options).catch(error => {
      console.error('❌ [Design Tokens] Failed to initialize:', error);
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

/**
 * Cleanup function for graceful shutdown
 */
export function cleanupDesignTokens(): void {
  if (globalTokensManager) {
    globalTokensManager.cleanup();
    globalTokensManager = null;
  }
}

// Handle process cleanup
if (typeof process !== 'undefined') {
  process.on('SIGINT', cleanupDesignTokens);
  process.on('SIGTERM', cleanupDesignTokens);
  process.on('exit', cleanupDesignTokens);
}

export default withDesignTokens;

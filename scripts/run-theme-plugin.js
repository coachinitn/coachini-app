#!/usr/bin/env node

/**
 * Run script for the Design Tokens Plugin with Chokidar File Watching
 *
 * This script runs the plugin functionality independently with external
 * chokidar file watching to prevent duplicate processing issues.
 *
 * Respects environment variables:
 * - NODE_ENV: Controls verbose logging
 * - DESIGN_TOKENS_WATCH: Controls file watching (default: enabled in dev)
 */

const path = require('path');
const chokidar = require('chokidar');

// Load environment variables from .env file
require('dotenv').config();

// Set defaults for environment variables if not defined
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.DESIGN_TOKENS_WATCH = process.env.DESIGN_TOKENS_WATCH || 'true';

/**
 * Global variables for file watching
 */
let watcher = null;
let debounceTimer = null;
let manager = null;

/**
 * Handle file changes with debouncing
 */
function handleFileChange(filePath, verbose = false) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  if (verbose) {
    console.log(`🎨 [Design Tokens] File changed: ${path.relative(process.cwd(), filePath)}`);
  }

  debounceTimer = setTimeout(async () => {
    try {
      if (verbose) {
        console.log('🎨 [Design Tokens] Processing file change...');
      }

      // Trigger regeneration
      if (manager) {
        await manager.generateTokens();
      }
    } catch (error) {
      console.error('❌ [Design Tokens] Failed to regenerate after file change:', error);
    }
  }, 500);
}

/**
 * Setup external chokidar file watching
 */
function setupFileWatching(tokensDir, verbose = false) {
  const watchPaths = path.join(tokensDir, '**/*.ts');

  if (verbose) {
    console.log(`🎨 [Design Tokens] Setting up external file watcher for: ${watchPaths}`);
  }

  watcher = chokidar.watch(watchPaths, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100
    }
  });

  watcher
    .on('add', (filePath) => {
      if (verbose) {
        console.log(`🎨 [Design Tokens] File added: ${path.relative(process.cwd(), filePath)}`);
      }
      handleFileChange(filePath, verbose);
    })
    .on('change', (filePath) => {
      handleFileChange(filePath, verbose);
    })
    .on('unlink', (filePath) => {
      if (verbose) {
        console.log(`🎨 [Design Tokens] File deleted: ${path.relative(process.cwd(), filePath)}`);
      }
      handleFileChange(filePath, verbose);
    });

  if (verbose) {
    console.log('🎨 [Design Tokens] External file watching enabled');
  }
}

/**
 * Cleanup resources
 */
async function cleanup() {
  console.log('\n🛑 Shutting down...');

  // Clear debounce timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  // Close file watcher
  if (watcher) {
    await watcher.close();
    watcher = null;
  }

  // Cleanup manager
  if (manager) {
    manager.cleanup();
    manager = null;
  }
}

async function runPlugin() {
  console.log('🎨 Running Design Tokens Plugin with External File Watching...');
  
  // Use the environment variables from .env file
  const nodeEnv = process.env.NODE_ENV;
  const designTokensWatch = process.env.DESIGN_TOKENS_WATCH !== 'false';
  
  console.log(`🔧 Environment Variables:`);
  console.log(`   - NODE_ENV: ${process.env.NODE_ENV} -> using: ${nodeEnv}`);
  console.log(`   - DESIGN_TOKENS_WATCH: ${process.env.DESIGN_TOKENS_WATCH} -> using: ${designTokensWatch}`);

  try {
    // Import the compiled plugin
    const { DesignTokensManager } = require('../.next/plugins/design-tokens-plugin');

    // Determine if watching should be enabled
    const shouldWatch = designTokensWatch !== 'false' && nodeEnv === 'development';

    // Create manager with internal watching disabled (we'll handle it externally)
    manager = new DesignTokensManager({
      verbose: nodeEnv === 'development',
      createBackups: true,
      enableWatching: false, // Disable internal watching
    });

    console.log('✅ Plugin instance created successfully');

    const verbose = manager.options?.verbose;
    if (verbose) {
      console.log('🔧 Configuration:');
      console.log(`   - Verbose: ${verbose}`);
      console.log(`   - Create Backups: ${manager.options.createBackups}`);
      console.log(`   - Internal Watching: ${manager.options.enableWatching} (disabled)`);
      console.log(`   - External Watching: ${shouldWatch}`);
    }

    // Run initial token generation
    await manager.initialize();

    console.log('✅ Design Tokens Plugin completed successfully!');

    // Setup external file watching if enabled
    if (shouldWatch) {
      setupFileWatching(manager.options.tokensDir, verbose);
      console.log('👀 External file watching enabled - press Ctrl+C to exit');

      // Keep process alive for file watching
      process.on('SIGINT', async () => {
        try {
          await cleanup();
          process.exit(0);
        } catch (error) {
          console.error('Error during cleanup:', error);
          process.exit(1);
        }
      });

      process.on('SIGTERM', async () => {
        try {
          await cleanup();
          process.exit(0);
        } catch (error) {
          console.error('Error during cleanup:', error);
          process.exit(1);
        }
      });
    }

  } catch (error) {
    console.error('❌ Plugin execution failed:', error);
    process.exit(1);
  }
}

// Run the plugin
runPlugin();

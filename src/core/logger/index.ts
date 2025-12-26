/**
 * Core logging module for application-wide logging
 */
import { LogLevel, logLevelToString } from './types';
import { getLoggerConfig, LoggerConfig } from './config';
import { consoleTransport, fileTransport } from './transports';

// Store enabled/disabled categories
const enabledCategories: Map<string, boolean> = new Map();
let globalLoggingEnabled = true;

/**
 * Check if logging is enabled for a specific category
 * @param category Category to check
 * @returns Whether logging is enabled
 */
function isLoggingEnabled(category: string): boolean {
  if (!globalLoggingEnabled) return false;
  
  // If the category is specifically configured, use that setting
  if (enabledCategories.has(category)) {
    return enabledCategories.get(category)!;
  }
  
  // Check if any parent category is disabled
  // For example, if 'auth' is disabled, 'auth:signup' should also be disabled
  const parts = category.split(':');
  while (parts.length > 1) {
    parts.pop();
    const parentCategory = parts.join(':');
    if (enabledCategories.has(parentCategory) && !enabledCategories.get(parentCategory)) {
      return false;
    }
  }
  
  // Default to enabled
  return true;
}

/**
 * Format the log message with timestamp, level, and category
 * @param level Log level
 * @param category Log category
 * @param message Log message
 * @param meta Optional metadata
 * @returns Formatted log message
 */
function formatLogMessage(level: LogLevel, category: string, message: string, meta?: any): string {
  const timestamp = new Date().toISOString();
  const levelStr = logLevelToString(level);
  
  let formatted = `[${timestamp}] [${levelStr}] [${category}] ${message}`;
  
  if (meta) {
    try {
      formatted += ' ' + JSON.stringify(meta);
    } catch (err) {
      formatted += ' [Error serializing metadata]';
    }
  }
  
  return formatted;
}

/**
 * Create a logger for a specific category
 * @param category Category name for the logger
 * @returns Logger object with debug, info, warn, error methods
 */
export function createLogger(category: string) {
  /**
   * Log a message at a specific level
   * @param level Log level
   * @param message Message to log
   * @param meta Optional metadata to include
   */
  function log(level: LogLevel, message: string, meta?: any): void {
    // Get current config (to ensure we always use the latest settings)
    const config = getLoggerConfig();
    
    // Skip if logging is disabled for this category or the level is below the minimum
    if (!isLoggingEnabled(category) || level < config.minLevel) {
      return;
    }
    
    const formattedMessage = formatLogMessage(level, category, message, meta);
    
    // Send to each enabled transport based on current config
    if (config.console) {
      consoleTransport(level, formattedMessage);
    }
    
    if (typeof window === 'undefined' && config.file) {
      const categoryPath = category.replace(/:/g, '/');
      fileTransport(level, formattedMessage, categoryPath, config);
    }
  }
  
  /**
   * Create a sub-logger with additional context
   * @param context Context to add to the category
   * @returns New logger with combined category name
   */
  function createContextLogger(context: string) {
    return createLogger(`${category}:${context}`);
  }
  
  return {
    debug: (message: string, meta?: any) => log(LogLevel.DEBUG, message, meta),
    info: (message: string, meta?: any) => log(LogLevel.INFO, message, meta),
    warn: (message: string, meta?: any) => log(LogLevel.WARN, message, meta),
    error: (message: string, meta?: any) => log(LogLevel.ERROR, message, meta),
    context: createContextLogger,
  };
}

/**
 * Enable or disable logging for a specific category
 * @param category Category to configure
 * @param enabled Whether to enable or disable
 */
export function setLoggerEnabled(category: string, enabled: boolean): void {
  enabledCategories.set(category, enabled);
}

/**
 * Enable or disable all logging globally
 * @param enabled Whether to enable or disable
 */
export function setGlobalLoggingEnabled(enabled: boolean): void {
  globalLoggingEnabled = enabled;
}

/**
 * Reset all logger settings to defaults
 */
export function resetLoggerSettings(): void {
  enabledCategories.clear();
  globalLoggingEnabled = true;
}

// Re-export key types and functions
export { LogLevel, type LoggerConfig } from './types';
export {
  configureLogger,
  getLoggerConfig,
  resetLoggerConfig,
  setupLogger,
  shouldLogFeature
} from './config'; 
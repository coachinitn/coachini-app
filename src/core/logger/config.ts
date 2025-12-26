import path from 'path';
import { LogLevel, LoggerConfig } from './types';
import { setGlobalLoggingEnabled } from './index';

/**
 * Parse environment variable to boolean
 * @param value Environment variable value
 * @param defaultValue Default value if not set
 */
function parseBoolEnv(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Parse environment variable to LogLevel
 * @param value Environment variable value
 * @param defaultValue Default value if not set or invalid
 */
function parseLogLevelEnv(value: string | undefined, defaultValue: LogLevel): LogLevel {
  if (value === undefined) return defaultValue;
  
  switch (value.toLowerCase()) {
    case 'debug': return LogLevel.DEBUG;
    case 'info': return LogLevel.INFO;
    case 'warn': return LogLevel.WARN;
    case 'error': return LogLevel.ERROR;
    case 'none': return LogLevel.NONE;
    default: return defaultValue;
  }
}

/**
 * Default configuration for the logger, using environment variables if available
 */
const defaultConfig: LoggerConfig = {
  // Use LOG_LEVEL env var or default based on environment
  minLevel: parseLogLevelEnv(
    process.env.LOG_LEVEL, 
    process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
  ),
  
  // Use LOG_CONSOLE env var or default to true
  console: parseBoolEnv(process.env.LOG_CONSOLE, true),
  
  // Use LOG_FILE env var or default based on environment
  file: parseBoolEnv(
    process.env.LOG_FILE, 
    process.env.NODE_ENV === 'production'
  ),
  
  // Use LOG_DIR env var or default to 'logs' directory
  logDir: process.env.LOG_DIR || path.join(process.cwd(), 'logs'),
  
  // Use LOG_USE_DATE_DIRS env var or default to true
  useDateDirs: parseBoolEnv(process.env.LOG_USE_DATE_DIRS, true),
  
  // Use LOG_MAX_FILE_SIZE env var (in MB) or default to 5MB
  maxFileSize: (parseInt(process.env.LOG_MAX_FILE_SIZE || '5', 10) || 5) * 1024 * 1024,
  
  // Use LOG_MAX_FILES env var or default to 5
  maxFiles: parseInt(process.env.LOG_MAX_FILES || '5', 10) || 5,
};

// Current configuration state
let currentConfig: LoggerConfig = { ...defaultConfig };

/**
 * Get the current logger configuration
 * @returns Copy of the current configuration
 */
export function getLoggerConfig(): LoggerConfig {
  return { ...currentConfig };
}

/**
 * Configure the logger with custom options
 * @param options Partial configuration to merge with current settings
 */
export function configureLogger(options: Partial<LoggerConfig>): void {
  currentConfig = { ...currentConfig, ...options };
}

/**
 * Reset logger configuration to defaults (reading from env variables again)
 */
export function resetLoggerConfig(): void {
  currentConfig = { ...defaultConfig };
}

/**
 * Initialize the logger based on environment variables
 * Call this early in your application startup
 */
export function setupLogger(): void {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const loggingDisabled = process.env.LOGGING_ENABLED === 'false' || process.env.LOGGING_ENABLED === '0';
  
  if (loggingDisabled) {
    setGlobalLoggingEnabled(false);
    return;
  }
  
  
  configureLogger({});
}

/**
 * Determine whether a feature should have logging enabled
 * @param featureName Name of the feature to check
 * @returns true if logging should be enabled for this feature
 */
export function shouldLogFeature(featureName: string): boolean {
  const logFeatures = process.env.LOG_FEATURES;
  
  if (!logFeatures) return true; 
  
  return logFeatures.split(',').some(f => 
    f.trim().toLowerCase() === featureName.toLowerCase() || 
    f.trim() === '*'
  );
}

export type { LoggerConfig }; 
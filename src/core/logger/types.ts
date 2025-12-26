/**
 * Core logger type definitions
 */

/**
 * Log levels in order of increasing severity
 * Used to filter logs and determine console output method
 */
export enum LogLevel {
  /** Most detailed logging level for diagnostic information */
  DEBUG = 0,
  
  /** Standard information messages about normal operation */
  INFO = 1,
  
  /** Warning about potential issues that don't stop operation */
  WARN = 2,
  
  /** Error conditions that require attention */
  ERROR = 3,
  
  /** Special level to completely disable logging */
  NONE = 4
}

/**
 * Convert a log level to its string representation
 * @param level The numeric log level
 * @returns The string representation of the log level
 */
export function logLevelToString(level: LogLevel): string {
  switch (level) {
    case LogLevel.DEBUG: return 'DEBUG';
    case LogLevel.INFO: return 'INFO';
    case LogLevel.WARN: return 'WARN';
    case LogLevel.ERROR: return 'ERROR';
    default: return 'UNKNOWN';
  }
}

/**
 * Logger configuration options
 * Controls behavior of all logging operations
 */
export interface LoggerConfig {
  /** 
   * Minimum level to log 
   * Messages below this level will be filtered out
   */
  minLevel: LogLevel;
  
  /** 
   * Whether to log to the console
   * Defaults to true
   */
  console: boolean;
  
  /** 
   * Whether to log to files 
   * Defaults to true in production, false in development
   */
  file: boolean;
  
  /** 
   * Base directory for log files 
   * Defaults to 'logs' in project root
   */
  logDir: string;
  
  /** 
   * Whether to use date-based subdirectories
   * When true, creates YYYY-MM-DD subdirectories
   */
  useDateDirs: boolean;
  
  /** 
   * Maximum size of log files in bytes before rotation
   * Default 5MB
   */
  maxFileSize: number;
  
  /** 
   * Maximum number of rotated log files to keep
   * Default 5
   */
  maxFiles: number;
} 
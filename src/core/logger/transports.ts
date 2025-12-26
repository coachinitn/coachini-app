import fs from 'fs';
import path from 'path';
import { LogLevel, LoggerConfig } from './types';

/**
 * Console transport - logs messages to the console with appropriate colors
 * @param level Log level
 * @param message Formatted log message
 */
export function consoleTransport(level: LogLevel, message: string): void {
  // Skip client-side logging in production
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    return;
  }

  switch (level) {
    case LogLevel.ERROR:
      console.error(message);
      break;
    case LogLevel.WARN:
      console.warn(message);
      break;
    case LogLevel.INFO:
      console.info(message);
      break;
    case LogLevel.DEBUG:
    default:
      console.log(message);
      break;
  }
}

/**
 * Get the log file path for a specific category
 * @param category Log category
 * @param config Logger configuration
 * @returns Path to the log file
 */
function getLogFilePath(category: string, config: LoggerConfig): string {
  let logDir = config.logDir;
  
  // Add date-based directory if enabled
  if (config.useDateDirs) {
    const date = new Date();
    const dateDir = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    logDir = path.join(logDir, dateDir);
  }
  
  // Add category directories
  if (category) {
    logDir = path.join(logDir, category);
  }
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  return path.join(logDir, 'log.txt');
}

/**
 * Rotate log file if it exceeds the configured size limit
 * @param filePath Path to log file
 * @param config Logger configuration
 */
function rotateLogFileIfNeeded(filePath: string, config: LoggerConfig): void {
  if (!fs.existsSync(filePath)) return;
  
  const stats = fs.statSync(filePath);
  if (stats.size < config.maxFileSize) return;
  
  // Rotate existing backup files
  for (let i = config.maxFiles - 1; i > 0; i--) {
    const oldFile = `${filePath}.${i}`;
    const newFile = `${filePath}.${i + 1}`;
    
    if (fs.existsSync(oldFile)) {
      if (i === config.maxFiles - 1) {
        // Delete the oldest log file if we've reached the limit
        fs.unlinkSync(oldFile);
      } else {
        // Rename to the next number
        fs.renameSync(oldFile, newFile);
      }
    }
  }
  
  // Rename current log file to .1
  fs.renameSync(filePath, `${filePath}.1`);
}

/**
 * File transport - logs messages to category-specific files
 * @param level Log level
 * @param message Formatted log message
 * @param category Log category
 * @param config Logger configuration
 */
export function fileTransport(level: LogLevel, message: string, category: string, config: LoggerConfig): void {
  try {
    if (!config.file) return;
    const filePath = getLogFilePath(category, config);
    rotateLogFileIfNeeded(filePath, config);
    fs.appendFileSync(filePath, message + '\n');
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
} 
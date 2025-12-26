'use server';

import { createLogger, setLoggerEnabled } from './index';
import { configureLogger, setupLogger } from './config';

// Initialize server-side logger configuration from environment variables
if (typeof process !== 'undefined') {
  setupLogger();
}

// Pre-configured loggers for common server categories
const authLogger = createLogger('auth');
const apiLogger = createLogger('api');
const dbLogger = createLogger('db');
const themeLogger = createLogger('theme');

/**
 * Get a logger instance for the specified category
 * Not exported directly - for internal use only
 * @param category Logger category name
 * @returns Logger instance for the specified category
 */
function getLoggerInternal(category: string) {
  switch (category) {
    case 'auth':
      return authLogger;
    case 'api':
      return apiLogger;
    case 'db':
      return dbLogger;
    case 'theme':
      return themeLogger;
    default:
      return createLogger(category);
  }
}

/**
 * Get a logger for a specific category (server action)
 * @param category Logger category name
 */
export async function getLogger(category: string) {
  return getLoggerInternal(category);
}

/**
 * Configure logging destinations (server action)
 * @param options Logging destination configuration
 */
export async function configureLoggingDestinations(options: {
  console?: boolean;
  file?: boolean;
}) {
  configureLogger(options);
  return { success: true, options };
}

/**
 * Server action for logging messages
 * @param actionData Data containing category, message, level and metadata
 */
export async function logServerAction(actionData: { 
  category: string; 
  context?: string;
  message: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  meta?: Record<string, any>;
}) {
  try {
    // Get a logger for the specified category
    let logger = getLoggerInternal(actionData.category);
    
    // Use a context if provided
    if (actionData.context && actionData.context.trim() !== '') {
      logger = logger.context(actionData.context);
    }
    
    // Log with the appropriate level
    switch (actionData.level) {
      case 'debug':
        logger.debug(actionData.message, actionData.meta);
        break;
      case 'info':
        logger.info(actionData.message, actionData.meta);
        break;
      case 'warn':
        logger.warn(actionData.message, actionData.meta);
        break;
      case 'error':
        logger.error(actionData.message, actionData.meta);
        break;
    }
    
    return { 
      success: true, 
      timestamp: new Date().toISOString(),
      fullCategory: actionData.context ? `${actionData.category}:${actionData.context}` : actionData.category
    };
  } catch (error) {
    console.error('Error logging:', error);
    return { success: false, error: 'Failed to log message' };
  }
}

/**
 * Toggle logging for a specific category (server action)
 * @param category Logger category to toggle
 * @param enabled Whether to enable or disable logging
 */
export async function toggleLogging(category: string, enabled: boolean) {
  setLoggerEnabled(category, enabled);
  return { success: true, category, enabled };
}

/**
 * Example auth login function with logging (server action)
 * @param email User email
 * @param password User password
 */
export async function mockLoginWithLogging(email: string, password: string) {
  const logger = getLoggerInternal('auth').context('login');
  
  logger.info('Login attempt', { email });
  
  try {
    // Simulate login process
    if (!email.includes('@')) {
      logger.warn('Invalid email format', { email });
      return { success: false, error: 'Invalid email format' };
    }
    
    if (password.length < 8) {
      logger.warn('Password too short');
      return { success: false, error: 'Password too short' };
    }
    
    // Simulate successful login
    logger.info('Login successful', { email });
    return { success: true, userId: 'user-123' };
  } catch (error) {
    logger.error('Login error', { error, email });
    return { success: false, error: 'An unexpected error occurred' };
  }
} 
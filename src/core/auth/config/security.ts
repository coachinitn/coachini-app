
export type SecurityLevel = 'high' | 'standard' | 'relaxed';

// Determine security level from environment or default to standard
const getSecurityLevel = (): SecurityLevel => {
  const level = process.env.NEXT_PUBLIC_SECURITY_LEVEL as SecurityLevel;
  return ['high', 'standard', 'relaxed'].includes(level) ? level : 'standard';
};

export const SECURITY_LEVEL = getSecurityLevel();

// Security configurations by level
const SECURITY_CONFIGS = {
  high: {
    // Session settings
    sessionUpdateAge: 0,           // No caching
    sessionRefetchInterval: 60,    // 1 minute

    // JWT validation
    jwtValidationInterval: 60 * 1000,     // 1 minute

    // Session monitor
    monitorInterval: 30 * 1000,           // 30 seconds
    monitorMaxRetries: 2,

    // Token refresh
    tokenRefreshBuffer: 10 * 60 * 1000,   // Refresh 10min before expiry

    // Session validation triggers
    validateOnPageFocus: true,            // Check session when page gains focus
    validateOnPageRefresh: true,          // Check session immediately on page load
  },
  
  standard: {
    // Session settings
    sessionUpdateAge: 60,          // 1 minute cache
    sessionRefetchInterval: 5 * 60, // 5 minutes

    // JWT validation
    jwtValidationInterval: 5 * 60 * 1000,  // 5 minutes

    // Session monitor
    monitorInterval: 2 * 60 * 1000,        // 2 minutes
    monitorMaxRetries: 3,

    // Token refresh
    tokenRefreshBuffer: 5 * 60 * 1000,     // Refresh 5min before expiry

    // Session validation triggers
    validateOnPageFocus: true,            // Check session when page gains focus
    validateOnPageRefresh: true,          // Check session immediately on page load
  },
  
  relaxed: {
    // Session settings
    sessionUpdateAge: 5 * 60,      // 5 minute cache
    sessionRefetchInterval: 15 * 60, // 15 minutes

    // JWT validation
    jwtValidationInterval: 15 * 60 * 1000, // 15 minutes

    // Session monitor
    monitorInterval: 5 * 60 * 1000,        // 5 minutes
    monitorMaxRetries: 5,

    // Token refresh
    tokenRefreshBuffer: 2 * 60 * 1000,     // Refresh 2min before expiry

    // Session validation triggers (more conservative for performance)
    validateOnPageFocus: false,           // Disabled for performance
    validateOnPageRefresh: true,          // Still check on page load
  },
};

// Development overrides (optimized for immediate session revocation detection)
const DEVELOPMENT_OVERRIDES = {
  sessionUpdateAge: 0,           // No caching - always validate against backend
  sessionRefetchInterval: 2 * 60, // 2 minutes
  jwtValidationInterval: 30 * 1000,  // 30 seconds
  monitorInterval: 30 * 1000,    // 30 seconds (much more responsive)
  monitorMaxRetries: 3,
  tokenRefreshBuffer: 2 * 60 * 1000,     // 2 minutes

  // Session validation triggers (enabled for testing)
  validateOnPageFocus: true,     // Enable for development testing
  validateOnPageRefresh: true,   // Enable for development testing
};

// Get the active configuration
export const getSecurityConfig = () => {
  const baseConfig = SECURITY_CONFIGS[SECURITY_LEVEL];
  
  // Override with development settings if in development
  if (process.env.NODE_ENV === 'development') {
    return { ...baseConfig, ...DEVELOPMENT_OVERRIDES };
  }
  
  return baseConfig;
};

// Export the active configuration
export const SECURITY_CONFIG = getSecurityConfig();

// Helper functions for common checks
export const isHighSecurity = () => SECURITY_LEVEL === 'high';
export const isStandardSecurity = () => SECURITY_LEVEL === 'standard';
export const isRelaxedSecurity = () => SECURITY_LEVEL === 'relaxed';

// Logging configuration
export const shouldLogSecurityEvents = () => {
  return process.env.NODE_ENV === 'development' || isHighSecurity();
};

// Performance monitoring
export const getPerformanceMetrics = () => ({
  securityLevel: SECURITY_LEVEL,
  environment: process.env.NODE_ENV,
  config: SECURITY_CONFIG,
  estimatedApiCallsPerHour: {
    sessionRefetch: 60 / (SECURITY_CONFIG.sessionRefetchInterval / 60),
    jwtValidation: 60 / (SECURITY_CONFIG.jwtValidationInterval / 60 / 1000),
    monitorChecks: 60 / (SECURITY_CONFIG.monitorInterval / 60 / 1000),
  },
});

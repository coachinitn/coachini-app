/**
 * Token validation utilities for detecting revoked or invalid tokens
 */

interface TokenValidationResult {
  isValid: boolean;
  isRevoked: boolean;
  error?: string;
}

/**
 * Validate token with the backend
 * This can be used to quickly check if a token is still valid
 */
export async function validateTokenWithBackend(accessToken: string): Promise<TokenValidationResult> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return { isValid: true, isRevoked: false };
    }

    const errorData = await response.json().catch(() => ({}));
    
    // Check for specific revocation indicators
    if (response.status === 401) {
      const message = errorData.message || '';
      if (message.includes('revoked') || message.includes('blacklisted')) {
        return { 
          isValid: false, 
          isRevoked: true, 
          error: 'Token has been revoked' 
        };
      }
    }

    return { 
      isValid: false, 
      isRevoked: false, 
      error: errorData.message || 'Token validation failed' 
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { 
      isValid: false, 
      isRevoked: false, 
      error: 'Network error during token validation' 
    };
  }
}

/**
 * Check if we should validate the token based on last validation time
 * This prevents excessive API calls
 */
export function shouldValidateToken(lastValidation?: number): boolean {
  if (!lastValidation) return true;
  
  // Validate every 30 seconds at most
  const VALIDATION_INTERVAL = 30 * 1000;
  return Date.now() - lastValidation > VALIDATION_INTERVAL;
}

/**
 * Store last validation time in session storage
 */
export function setLastValidationTime(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('token-last-validation', Date.now().toString());
  }
}

/**
 * Get last validation time from session storage
 */
export function getLastValidationTime(): number | undefined {
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('token-last-validation');
    return stored ? parseInt(stored, 10) : undefined;
  }
  return undefined;
}

/**
 * Clear validation cache
 */
export function clearValidationCache(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('token-last-validation');
  }
}

/**
 * Enhanced token validation that includes caching
 */
export async function validateTokenCached(accessToken: string): Promise<TokenValidationResult> {
  const lastValidation = getLastValidationTime();
  
  if (!shouldValidateToken(lastValidation)) {
    // Return cached positive result (we assume it's still valid)
    return { isValid: true, isRevoked: false };
  }
  
  const result = await validateTokenWithBackend(accessToken);
  
  if (result.isValid) {
    setLastValidationTime();
  } else {
    clearValidationCache();
  }
  
  return result;
}

/**
 * Quick check for obvious token issues without API call
 */
export function quickTokenCheck(token: any): { isValid: boolean; reason?: string } {
  if (!token) {
    return { isValid: false, reason: 'No token provided' };
  }
  
  if (token.error) {
    return { isValid: false, reason: `Token error: ${token.error}` };
  }
  
  if (!token.accessToken || !token.refreshToken) {
    return { isValid: false, reason: 'Missing token values' };
  }
  
  if (token.accessTokenExpires && Date.now() >= token.accessTokenExpires) {
    return { isValid: false, reason: 'Token expired' };
  }
  
  return { isValid: true };
}

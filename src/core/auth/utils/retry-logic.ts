/**
 * 🕒 Password Reset Retry Logic
 *
 * Manages 2-minute cooldown for password reset resend functionality
 * Uses localStorage for persistence across browser sessions
 */

import type { RetryState, RetryConfig } from '@/lib/api/auth/auth.types';

// Configuration for password reset retry logic
const PASSWORD_RESET_CONFIG: RetryConfig = {
  maxAttempts: 3, // Maximum attempts per hour (backend enforces this)
  cooldownMs: 2 * 60 * 1000, // 2 minutes in milliseconds
  storageKey: 'pwd_reset_retry'
};

/**
 * Password Reset Retry Manager
 * Handles cooldown logic for resending password reset emails
 */
export class PasswordResetRetry {
  private static getStorageKey(email: string): string {
    // Create a unique key for each email
    return `${PASSWORD_RESET_CONFIG.storageKey}_${btoa(email).replace(/[^a-zA-Z0-9]/g, '')}`;
  }

  /**
   * Check if user can send/resend password reset email
   */
  static canSend(email: string): boolean {
    if (!email) return false;

    const storageKey = this.getStorageKey(email);
    const storedData = localStorage.getItem(storageKey);

    if (!storedData) return true;

    try {
      const retryState: RetryState = JSON.parse(storedData);
      const timeDiff = Date.now() - retryState.lastAttemptTime;

      return timeDiff >= PASSWORD_RESET_CONFIG.cooldownMs;
    } catch (error) {
      // If data is corrupted, allow the attempt
      console.warn('Corrupted retry state data, clearing:', error);
      localStorage.removeItem(storageKey);
      return true;
    }
  }

  /**
   * Record a password reset attempt
   */
  static recordAttempt(email: string): void {
    if (!email) return;

    const storageKey = this.getStorageKey(email);
    const now = Date.now();

    // Get existing state or create new one
    let retryState: RetryState;
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
      try {
        retryState = JSON.parse(storedData);
        retryState.attemptCount += 1;
        retryState.lastAttemptTime = now;
      } catch (error) {
        // Create new state if data is corrupted
        retryState = {
          lastAttemptTime: now,
          attemptCount: 1,
          canRetry: false,
          remainingTime: PASSWORD_RESET_CONFIG.cooldownMs
        };
      }
    } else {
      // Create new state for first attempt
      retryState = {
        lastAttemptTime: now,
        attemptCount: 1,
        canRetry: false,
        remainingTime: PASSWORD_RESET_CONFIG.cooldownMs
      };
    }

    // Update retry state
    retryState.canRetry = false;
    retryState.remainingTime = PASSWORD_RESET_CONFIG.cooldownMs;

    // Store updated state
    localStorage.setItem(storageKey, JSON.stringify(retryState));
  }

  /**
   * Get remaining cooldown time in milliseconds
   */
  static getRemainingTime(email: string): number {
    if (!email) return 0;

    const storageKey = this.getStorageKey(email);
    const storedData = localStorage.getItem(storageKey);

    if (!storedData) return 0;

    try {
      const retryState: RetryState = JSON.parse(storedData);
      const elapsed = Date.now() - retryState.lastAttemptTime;
      const remaining = PASSWORD_RESET_CONFIG.cooldownMs - elapsed;

      return Math.max(0, remaining);
    } catch (error) {
      console.warn('Error calculating remaining time:', error);
      return 0;
    }
  }

  /**
   * Get remaining time formatted as human-readable string
   */
  static getFormattedRemainingTime(email: string): string {
    const remainingMs = this.getRemainingTime(email);

    if (remainingMs <= 0) return '';

    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Clear retry state for an email (useful for testing or manual reset)
   */
  static clearRetryState(email: string): void {
    if (!email) return;

    const storageKey = this.getStorageKey(email);
    localStorage.removeItem(storageKey);
  }

  /**
   * Clear all retry states (useful for logout or cleanup)
   */
  static clearAllRetryStates(): void {
    const keysToRemove: string[] = [];

    // Find all keys that match our pattern
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PASSWORD_RESET_CONFIG.storageKey)) {
        keysToRemove.push(key);
      }
    }

    // Remove all matching keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Get retry state for debugging/display purposes
   */
  static getRetryState(email: string): RetryState | null {
    if (!email) return null;

    const storageKey = this.getStorageKey(email);
    const storedData = localStorage.getItem(storageKey);

    if (!storedData) return null;

    try {
      const retryState: RetryState = JSON.parse(storedData);

      // Update dynamic properties
      const remainingTime = this.getRemainingTime(email);
      retryState.remainingTime = remainingTime;
      retryState.canRetry = remainingTime <= 0;

      return retryState;
    } catch (error) {
      console.warn('Error parsing retry state:', error);
      return null;
    }
  }
}
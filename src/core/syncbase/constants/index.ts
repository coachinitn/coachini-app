/**
 * SyncBase Constants - Centralized exports
 * 
 * This file provides a single entry point for all SyncBase constants
 * used throughout the frontend application.
 */

// Export all event constants
export {
  WEBSOCKET_EVENTS,
  DOMAIN_EVENTS,
  SUBSCRIPTION_TYPES,
  AUTH_EVENTS,
  EVENT_CATEGORIES,
  type WebSocketEventType,
  type DomainEventType,
  type SubscriptionType,
  type AuthEventType,
} from './events';

// Import for re-export
import {
  WEBSOCKET_EVENTS,
  DOMAIN_EVENTS,
  SUBSCRIPTION_TYPES,
  AUTH_EVENTS,
  EVENT_CATEGORIES,
} from './events';

// Re-export for convenience
export const Events = {
  WEBSOCKET: WEBSOCKET_EVENTS,
  DOMAIN: DOMAIN_EVENTS,
  SUBSCRIPTION: SUBSCRIPTION_TYPES,
  AUTH: AUTH_EVENTS,
  CATEGORIES: EVENT_CATEGORIES,
} as const;

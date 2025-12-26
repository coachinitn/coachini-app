/**
 * Event Manager for SyncBase Client
 * Handles event subscription, emission, and management
 */

import { EventListener, SyncBaseEvent, EventManagerConfig } from './types';

export class EventManager {
  private listeners: Map<string, Set<EventListener>> = new Map();
  private onceListeners: Map<string, Set<EventListener>> = new Map();
  private config: EventManagerConfig;
  private maxListeners: number;

  constructor(debug: boolean = false, config: EventManagerConfig = {}) {
    this.config = { debug, ...config };
    this.maxListeners = config.maxListeners || 100;
  }

  /**
   * Subscribe to an event
   */
  on<T = any>(event: string, callback: EventListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const eventListeners = this.listeners.get(event)!;
    
    // Check max listeners limit
    if (eventListeners.size >= this.maxListeners) {
      console.warn(`[EventManager] Maximum listeners (${this.maxListeners}) reached for event: ${event}`);
      return () => {}; // Return no-op unsubscribe function
    }

    eventListeners.add(callback);

    if (this.config.debug) {
      console.log(`[EventManager] Subscribed to event: ${event} (${eventListeners.size} listeners)`);
    }

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first emission)
   */
  once<T = any>(event: string, callback: EventListener<T>): () => void {
    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, new Set());
    }

    const onceEventListeners = this.onceListeners.get(event)!;
    
    // Check max listeners limit
    if (onceEventListeners.size >= this.maxListeners) {
      console.warn(`[EventManager] Maximum once listeners (${this.maxListeners}) reached for event: ${event}`);
      return () => {}; // Return no-op unsubscribe function
    }

    onceEventListeners.add(callback);

    if (this.config.debug) {
      console.log(`[EventManager] Subscribed once to event: ${event} (${onceEventListeners.size} once listeners)`);
    }

    // Return unsubscribe function
    return () => {
      onceEventListeners.delete(callback);
    };
  }

  /**
   * Unsubscribe from an event
   */
  off<T = any>(event: string, callback: EventListener<T>): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }

      if (this.config.debug) {
        console.log(`[EventManager] Unsubscribed from event: ${event} (${eventListeners.size} listeners remaining)`);
      }
    }

    // Also remove from once listeners
    const onceEventListeners = this.onceListeners.get(event);
    if (onceEventListeners) {
      onceEventListeners.delete(callback);
      
      if (onceEventListeners.size === 0) {
        this.onceListeners.delete(event);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   */
  emit<T = any>(event: string, data?: T): void {
    if (this.config.debug) {
      console.log(`[EventManager] Emitting event: ${event}`, data);
    }

    // Emit to regular listeners
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[EventManager] Error in event listener for ${event}:`, error);
        }
      });
    }

    // Emit to once listeners and remove them
    const onceEventListeners = this.onceListeners.get(event);
    if (onceEventListeners) {
      onceEventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[EventManager] Error in once event listener for ${event}:`, error);
        }
      });
      
      // Clear once listeners after emission
      this.onceListeners.delete(event);
    }
  }

  /**
   * Remove all listeners for a specific event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
      this.onceListeners.delete(event);
      
      if (this.config.debug) {
        console.log(`[EventManager] Removed all listeners for event: ${event}`);
      }
    } else {
      this.listeners.clear();
      this.onceListeners.clear();
      
      if (this.config.debug) {
        console.log(`[EventManager] Removed all listeners for all events`);
      }
    }
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount(event: string): number {
    const regularCount = this.listeners.get(event)?.size || 0;
    const onceCount = this.onceListeners.get(event)?.size || 0;
    return regularCount + onceCount;
  }

  /**
   * Get all events that have listeners
   */
  eventNames(): string[] {
    const regularEvents = Array.from(this.listeners.keys());
    const onceEvents = Array.from(this.onceListeners.keys());
    return [...new Set([...regularEvents, ...onceEvents])];
  }

  /**
   * Check if there are any listeners for an event
   */
  hasListeners(event: string): boolean {
    return this.listenerCount(event) > 0;
  }

  /**
   * Get debug information about the event manager
   */
  getDebugInfo(): {
    totalEvents: number;
    totalListeners: number;
    totalOnceListeners: number;
    events: Array<{
      event: string;
      listeners: number;
      onceListeners: number;
    }>;
  } {
    const events = this.eventNames();
    const totalListeners = Array.from(this.listeners.values())
      .reduce((sum, listeners) => sum + listeners.size, 0);
    const totalOnceListeners = Array.from(this.onceListeners.values())
      .reduce((sum, listeners) => sum + listeners.size, 0);

    return {
      totalEvents: events.length,
      totalListeners,
      totalOnceListeners,
      events: events.map(event => ({
        event,
        listeners: this.listeners.get(event)?.size || 0,
        onceListeners: this.onceListeners.get(event)?.size || 0,
      }))
    };
  }

  /**
   * Set maximum number of listeners per event
   */
  setMaxListeners(max: number): void {
    this.maxListeners = max;
  }

  /**
   * Get maximum number of listeners per event
   */
  getMaxListeners(): number {
    return this.maxListeners;
  }

  /**
   * Clean up all listeners and resources
   */
  destroy(): void {
    this.removeAllListeners();
    
    if (this.config.debug) {
      console.log(`[EventManager] Event manager destroyed`);
    }
  }
}

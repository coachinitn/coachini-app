/**
 * Core theme type definitions
 * This file contains the type system for our theming architecture
 */

/**
 * Semantic color variant object
 */
export interface SemanticColorVariants {
  default: string;
  muted?: string;
  subtle?: string;
  emphasis?: string;
  focus?: string;
  [key: string]: string | undefined;
}

/**
 * Component color object with foreground/background pairing
 */
export interface ComponentColors {
  // DEFAULT?: string;
  default: string;
  foreground: string;
  [key: string]: string | undefined;
}

/**
 * Base color definition with semantic meaning
 */
export interface ThemeColors {
  // Base colors
  background: string | SemanticColorVariants;
  foreground: string | SemanticColorVariants;
  
  // Component colors
  card: string | ComponentColors;
  popover: string | ComponentColors;
  // primary: string | ComponentColors;
  // secondary: string | ComponentColors;
  muted: string | ComponentColors;
  accent: string | ComponentColors;
  destructive: string | ComponentColors;
  
  // UI element colors
  border: string | SemanticColorVariants;
  input: string;
  ring: string;
  
  // Chart colors
  chart: {
    [key: string]: string;
  } | {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  
  // Sidebar specific
  sidebar: string | ComponentColors;
  
  // Allow additional properties
  [key: string]: string | ComponentColors | SemanticColorVariants | { [key: string]: string } | undefined;
}

/**
 * Theme metadata with additional properties
 */
export interface ThemeDefinition {
  colors: ThemeColors;
  name: string;
  id: string;
  type: 'light' | 'dark' | 'system' | 'custom';
}

/**
 * Color format types supported by our system
 */
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

/**
 * Configuration for theme generation
 */
export interface ThemeGenerationOptions {
  /**
   * Target color format for CSS variables 
   */
  format?: ColorFormat;
  
  /**
   * Class name for themed styles (e.g., 'dark', 'high-contrast')
   * If undefined, generates for root (:root)
   */
  className?: string;
  
  /**
   * Additional metadata to include in comments
   */
  meta?: Record<string, string>;
} 
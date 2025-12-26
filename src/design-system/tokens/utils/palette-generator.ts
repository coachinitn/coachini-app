/**
 * Palette Generator
 * 
 * Generates color palettes for the design system from base colors
 */
import { lighten, darken } from './color-utils';
import { ThemeColors } from '../types';

/**
 * Generate a color scale from a base color
 */
export function generateColorScale(
  baseColor: string, 
  options: {
    steps?: number;
    lightnessRange?: [number, number];
  } = {}
): string[] {
  const { 
    steps = 10, 
    lightnessRange = [15, 85]
  } = options;
  
  const [min, max] = lightnessRange;
  const scale: string[] = [];
  
  // Generate colors with increasing lightness
  for (let i = 0; i < steps; i++) {
    const percentage = min + (max - min) * (i / (steps - 1));
    
    // For middle colors, use the base color
    if (i === Math.floor(steps / 2)) {
      scale.push(baseColor);
    } else if (i < Math.floor(steps / 2)) {
      // Darker colors
      const darkenAmount = Math.abs(percentage - 50) * 0.7;
      scale.push(darken(baseColor, darkenAmount));
    } else {
      // Lighter colors
      const lightenAmount = Math.abs(percentage - 50) * 0.7;
      scale.push(lighten(baseColor, lightenAmount));
    }
  }
  
  return scale;
}

/**
 * Generate a semantic palette with primary, secondary, and accent colors
 */
export function generateSemanticPalette(
  primary: string,
  secondary: string,
  accent: string,
  options: {
    includeStates?: boolean;
    darkMode?: boolean;
  } = {}
): Partial<ThemeColors> {
  const { includeStates = true, darkMode = false } = options;
  
  const palette: Partial<ThemeColors> = {
    primary,
    secondary,
    accent,
    
    // Text colors
    primaryForeground: darkMode ? '#FFFFFF' : '#000000',
    secondaryForeground: darkMode ? '#F7F7F7' : '#111111',
    accentForeground: darkMode ? '#FFFFFF' : '#000000',
    
    // Background colors
    background: darkMode ? '#121212' : '#FFFFFF',
    foreground: darkMode ? '#F8F8F8' : '#121212',
    
    // Card colors
    card: darkMode ? '#1E1E1E' : '#FFFFFF',
    cardForeground: darkMode ? '#F8F8F8' : '#121212',
    
    // Border colors
    border: darkMode ? '#333333' : '#E2E2E2',
    
    // Muted colors
    muted: darkMode ? '#2A2A2A' : '#F1F1F1',
    mutedForeground: darkMode ? '#A1A1A1' : '#737373',
  };
  
  // Add state variations if requested
  if (includeStates) {
    palette.primaryHover = lighten(primary, 10);
    palette.primaryActive = darken(primary, 10);
    
    palette.secondaryHover = lighten(secondary, 10);
    palette.secondaryActive = darken(secondary, 10);
    
    palette.accentHover = lighten(accent, 10);
    palette.accentActive = darken(accent, 10);
  }
  
  return palette;
}

/**
 * Generate CSS variables for a color palette
 */
export function generatePaletteCssVariables(
  palette: Partial<ThemeColors>,
  prefix = ''
): string {
  return Object.entries(palette)
    .map(([key, value]) => {
      const varName = prefix 
        ? `--${prefix}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
        : `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      
      return `  ${varName}: ${value};`;
    })
    .join('\n');
}

/**
 * Generate theme colors for light and dark modes
 */
export function generateThemeColorModes(
  primary: string,
  secondary: string,
  accent: string
): { light: Partial<ThemeColors>; dark: Partial<ThemeColors> } {
  return {
    light: generateSemanticPalette(primary, secondary, accent, { darkMode: false }),
    dark: generateSemanticPalette(primary, secondary, accent, { darkMode: true })
  };
} 
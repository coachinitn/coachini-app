/**
 * Utility to generate CSS variables from color definitions
 */
import { colors } from '../colors';

type ColorPalette = {
  [key: string]: {
    [shade: string | number]: string;
  } | string;
};

/**
 * Generate CSS variables for all colors in the color palette
 */
export function generateColorCssVariables(colorPalette: ColorPalette = colors): string {
  const cssVars: string[] = [];
  
  // Process each color group (primary, gray, success, etc.)
  Object.entries(colorPalette).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'string') {
      // Handle simple colors (not color scales)
      cssVars.push(`  --${colorName}: ${colorValue};`);
    } else {
      // Handle color scales with shades
      Object.entries(colorValue).forEach(([shade, value]) => {
        cssVars.push(`  --${colorName}-${shade}: ${value};`);
      });
    }
  });
  
  // Handle semantic color groups separately
  const semanticGroups = ['background', 'foreground', 'border'];
  semanticGroups.forEach(group => {
    if (colorPalette[group] && typeof colorPalette[group] !== 'string') {
      Object.entries(colorPalette[group] as Record<string, string>).forEach(([key, value]) => {
        if (key === 'default') {
          cssVars.push(`  --${group}: ${value};`);
        } else {
          cssVars.push(`  --${group}-${key}: ${value};`);
        }
      });
    }
  });
  
  return `:root {\n${cssVars.join('\n')}\n}`;
}

/**
 * Generate complete CSS file with color variables
 */
export function generateColorsCssFile(): string {
  const timestamp = new Date().toISOString();
  
  const header = [
    `/**`,
    ` * Generated color variables file`,
    ` * Generated on: ${timestamp}`,
    ` * This file is auto-generated from colors.ts`,
    ` */`,
    ``
  ].join('\n');
  
  const colorVars = generateColorCssVariables();
  
  return `${header}\n${colorVars}\n`;
} 
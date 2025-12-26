/**
 * Design tokens entry point
 * Export all design tokens from a single entry point for consistency
 */

// Export all tokens
export * from './colors';
export * from './spacing';
export * from './typography';
export * from './types';
export * from './themes';
export * from './utils/color-utils';
export * from './utils/theme-generator';
export * from './utils/palette-generator';

// Export token categories for convenience
import colors from './colors';
import spacing, { spacingAliases } from './spacing';
import typography, { typographyPresets } from './typography';
import theme, { cssVariables } from './theme';
import { themes, lightThemeColors, darkThemeColors } from './themes';
import { generateColorScale, generateSemanticPalette, generateThemeColorModes } from './utils/palette-generator';

// Export all token collections as named exports
export const tokens = {
  colors,
  spacing,
  spacingAliases,
  typography,
  typographyPresets,
  theme,
  cssVariables,
  themes,
  lightTheme: lightThemeColors,
  darkTheme: darkThemeColors,
  generateColorScale,
  generateSemanticPalette,
  generateThemeColorModes
};

// Default export for convenience
export default tokens; 
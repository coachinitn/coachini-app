/**
 * Tailwind theme configuration
 * This file bridges our design tokens with Tailwind CSS
 */
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

/**
 * Converts a design token object to a format Tailwind can use
 */
const convertTokensToCssVariables = (tokens: Record<string, any>, prefix = '') => {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(tokens)) {
    const tokenKey = prefix ? `${prefix}-${key}` : key;
    
    if (typeof value === 'string' || typeof value === 'number') {
      result[key] = value.toString();
    } else if (typeof value === 'object' && value !== null) {
      const nestedTokens = convertTokensToCssVariables(value, tokenKey);
      Object.assign(result, nestedTokens);
    }
  }
  
  return result;
};

/**
 * Flattens a nested color object for use with Tailwind
 */
const flattenColors = (obj: Record<string, any>, prefix = ''): Record<string, string> => {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const colorKey = prefix ? `${prefix}-${key}` : key;
    
    if (typeof value === 'string') {
      result[colorKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      const nestedColors = flattenColors(value, colorKey);
      Object.assign(result, nestedColors);
    }
  }
  
  return result;
};

/**
 * Tailwind theme configuration object
 */
export const theme = {
	colors: flattenColors(colors),
	// spacing,
	fontFamily: {
		...typography.fontFamily,
	},
	fontSize: typography.fontSize,
	fontWeight: typography.fontWeight,
	lineHeight: typography.lineHeight,
	letterSpacing: typography.letterSpacing,
	borderRadius: {
		// none: '0',
		// sm: '0.125rem',
		// DEFAULT: '0.25rem',
		// md: '0.375rem',
		// lg: 'var(--radius)',
		// xl: '0.75rem',
		// '2xl': '1rem',
		// '3xl': '1.5rem',
		// full: '9999px',
	},
	// boxShadow: {
	// 	sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
	// 	DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
	// 	md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
	// 	lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
	// 	xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
	// 	'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
	// 	inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
	// 	none: 'none',
	// },
	extend: {
		// Add any additional extensions here
		transitionTimingFunction: {
			'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
			'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
		},
		transitionDuration: {
			'2000': '2000ms',
		},
		keyframes: {
			'accordion-down': {
				from: { height: 0 },
				to: { height: 'var(--radix-accordion-content-height)' },
			},
			'accordion-up': {
				from: { height: 'var(--radix-accordion-content-height)' },
				to: { height: 0 },
			},
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
		},
	},
};

/**
 * CSS variables version of our theme 
 * Can be used to generate CSS custom properties
 */
export const cssVariables = {
  colors: convertTokensToCssVariables(colors, 'color'),
  spacing: convertTokensToCssVariables(spacing, 'spacing'),
  typography: convertTokensToCssVariables(typography, 'typography'),
};

export default theme; 
/**
 * Theme generator for the design system
 * Generates CSS variable definitions from theme objects
 */
import { ThemeColors, ThemeDefinition, ThemeGenerationOptions, ColorFormat } from '../types';
import { convertColorFormat, getColorValue } from './color-utils';

/**
 * Convert a camelCase string to kebab-case
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generate CSS variable declarations for a theme
 */
export function generateThemeVariables(
  colors: ThemeColors,
  options: ThemeGenerationOptions = {}
): string {
  const { format = 'oklch', className } = options;
  const selector = className ? `.${className}` : ':root';
  
  // Convert colors to CSS variable declarations
  const cssVars = Object.entries(colors).map(([key, value]) => {
    const varName = `--${toKebabCase(key)}`;
    const colorValue = getColorValue(value);
    const formattedValue = convertColorFormat(colorValue, format as ColorFormat);
    return `  ${varName}: ${formattedValue};`;
  }).join('\n');
  
  // Generate CSS block
  return `${selector} {\n${cssVars}\n}`;
}

/**
 * Generate CSS for a theme
 */
export function generateThemeCss(
  theme: ThemeDefinition,
  options: ThemeGenerationOptions = {}
): string {
  const { id, name, type } = theme;
  
  // Add metadata comment
  const commentSection = [
    `/**`,
    ` * Theme: ${name}`,
    ` * Type: ${type}`,
    ` * ID: ${id}`,
    ...(options.meta ? Object.entries(options.meta).map(([k, v]) => ` * ${k}: ${v}`) : []),
    ` */`
  ].join('\n');
  
  // Generate CSS with variables
  const className = type === 'light' ? undefined : options.className || type;
  const cssSection = generateThemeVariables(theme.colors, {
    ...options,
    className
  });
  
  return `${commentSection}\n${cssSection}`;
}

/**
 * Generate CSS for multiple themes
 */
export function generateMultiThemeCss(
  themes: ThemeDefinition[],
  options: ThemeGenerationOptions = {}
): string {
  return themes.map(theme => generateThemeCss(theme, {
    ...options,
    className: theme.type === 'light' ? undefined : theme.type
  })).join('\n\n');
}

/**
 * Generate a combined theme CSS file including variables
 */
export function generateThemeCssFile(themes: ThemeDefinition[]): string {
  const timestamp = new Date().toISOString();
  const header = [
    `/**`,
    ` * Generated theme file`,
    ` * Generated on: ${timestamp}`,
    ` * Theme count: ${themes.length}`,
    ` */`,
    ``,
    `@import "tailwindcss";`,
    ``,
    `@plugin "tailwindcss-animate";`,
    ``,
    `@custom-variant dark (&:is(.dark *));`,
    ``,
    `@theme inline {`,
    `  --color-background: var(--background);`,
    `  --color-foreground: var(--foreground);`,
    `  --font-sans: var(--font-poppins);`,
    `  --color-sidebar-ring: var(--sidebar-ring);`,
    `  --color-sidebar-border: var(--sidebar-border);`,
    `  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);`,
    `  --color-sidebar-accent: var(--sidebar-accent);`,
    `  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);`,
    `  --color-sidebar-primary: var(--sidebar-primary);`,
    `  --color-sidebar-foreground: var(--sidebar-foreground);`,
    `  --color-sidebar: var(--sidebar);`,
    `  --color-chart-5: var(--chart-5);`,
    `  --color-chart-4: var(--chart-4);`,
    `  --color-chart-3: var(--chart-3);`,
    `  --color-chart-2: var(--chart-2);`,
    `  --color-chart-1: var(--chart-1);`,
    `  --color-ring: var(--ring);`,
    `  --color-input: var(--input);`,
    `  --color-border: var(--border);`,
    `  --color-destructive: var(--destructive);`,
    `  --color-accent-foreground: var(--accent-foreground);`,
    `  --color-accent: var(--accent);`,
    `  --color-muted-foreground: var(--muted-foreground);`,
    `  --color-muted: var(--muted);`,
    `  --color-secondary-foreground: var(--secondary-foreground);`,
    `  --color-secondary: var(--secondary);`,
    `  --color-primary-foreground: var(--primary-foreground);`,
    `  --color-primary: var(--primary);`,
    
    // Add color palette shade mappings
    `  /* Primary color shades */`,
    `  --color-primary-50: var(--primary-50);`,
    `  --color-primary-100: var(--primary-100);`,
    `  --color-primary-200: var(--primary-200);`,
    `  --color-primary-300: var(--primary-300);`,
    `  --color-primary-400: var(--primary-400);`,
    `  --color-primary-500: var(--primary-500);`,
    `  --color-primary-600: var(--primary-600);`,
    `  --color-primary-700: var(--primary-700);`,
    `  --color-primary-800: var(--primary-800);`,
    `  --color-primary-900: var(--primary-900);`,
    `  --color-primary-950: var(--primary-950);`,
    
    `  /* Gray color shades */`,
    `  --color-gray-50: var(--gray-50);`,
    `  --color-gray-100: var(--gray-100);`,
    `  --color-gray-200: var(--gray-200);`,
    `  --color-gray-300: var(--gray-300);`,
    `  --color-gray-400: var(--gray-400);`,
    `  --color-gray-500: var(--gray-500);`,
    `  --color-gray-600: var(--gray-600);`,
    `  --color-gray-700: var(--gray-700);`,
    `  --color-gray-800: var(--gray-800);`,
    `  --color-gray-900: var(--gray-900);`,
    `  --color-gray-950: var(--gray-950);`,
    
    `  /* Success color shades */`,
    `  --color-success-50: var(--success-50);`,
    `  --color-success-100: var(--success-100);`,
    `  --color-success-200: var(--success-200);`,
    `  --color-success-300: var(--success-300);`,
    `  --color-success-400: var(--success-400);`,
    `  --color-success-500: var(--success-500);`,
    `  --color-success-600: var(--success-600);`,
    `  --color-success-700: var(--success-700);`,
    `  --color-success-800: var(--success-800);`,
    `  --color-success-900: var(--success-900);`,
    `  --color-success-950: var(--success-950);`,
    
    `  /* Warning color shades */`,
    `  --color-warning-50: var(--warning-50);`,
    `  --color-warning-100: var(--warning-100);`,
    `  --color-warning-200: var(--warning-200);`,
    `  --color-warning-300: var(--warning-300);`,
    `  --color-warning-400: var(--warning-400);`,
    `  --color-warning-500: var(--warning-500);`,
    `  --color-warning-600: var(--warning-600);`,
    `  --color-warning-700: var(--warning-700);`,
    `  --color-warning-800: var(--warning-800);`,
    `  --color-warning-900: var(--warning-900);`,
    `  --color-warning-950: var(--warning-950);`,
    
    `  /* Error color shades */`,
    `  --color-error-50: var(--error-50);`,
    `  --color-error-100: var(--error-100);`,
    `  --color-error-200: var(--error-200);`,
    `  --color-error-300: var(--error-300);`,
    `  --color-error-400: var(--error-400);`,
    `  --color-error-500: var(--error-500);`,
    `  --color-error-600: var(--error-600);`,
    `  --color-error-700: var(--error-700);`,
    `  --color-error-800: var(--error-800);`,
    `  --color-error-900: var(--error-900);`,
    `  --color-error-950: var(--error-950);`,
    
    `  /* Info color shades */`,
    `  --color-info-50: var(--info-50);`,
    `  --color-info-100: var(--info-100);`,
    `  --color-info-200: var(--info-200);`,
    `  --color-info-300: var(--info-300);`,
    `  --color-info-400: var(--info-400);`,
    `  --color-info-500: var(--info-500);`,
    `  --color-info-600: var(--info-600);`,
    `  --color-info-700: var(--info-700);`,
    `  --color-info-800: var(--info-800);`,
    `  --color-info-900: var(--info-900);`,
    `  --color-info-950: var(--info-950);`,
    
    `  --radius-sm: calc(var(--radius) - 4px);`,
    `  --radius-md: calc(var(--radius) - 2px);`,
    `  --radius-lg: var(--radius);`,
    `  --radius-xl: calc(var(--radius) + 4px);`,
    `}`,
    ``
  ].join('\n');
  
  // Add shared variables
  const shared = [
    `:root {`,
    `  --radius: 0.625rem;`,
    `}`,
    ``
  ].join('\n');
  
  // Generate theme CSS
  const themeCss = generateMultiThemeCss(themes);
  
  // Add base layer styles
  const baseLayers = [
    ``,
    `@layer base {`,
    `  * {`,
    `    @apply border-border outline-ring/50;`,
    `  }`,
    `  body {`,
    `    @apply bg-background text-foreground;`,
    `  }`,
    `  `,
    `  /* Set Poppins as the default font with proper fallbacks */`,
    `  .font-sans {`,
    `    font-family: var(--font-poppins), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;`,
    `  }`,
    `}`,
    ``,
    ``,
    `/* #region RTL CSS */`,
    `.omit-rtl {`,
    `  direction: ltr;`,
    `  unicode-bidi: isolate;`,
    `}`,
    `.inherit-dir {`,
    `  direction: inherit;`,
    `  unicode-bidi: inherit;`,
    `}`,
    `/* End of RTL CSS */`,
    ``
  ].join('\n');
  
  // Combine all sections
  return [header, shared, themeCss, baseLayers].join('\n');
} 
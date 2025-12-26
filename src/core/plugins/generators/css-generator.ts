/**
 * CSS Generator
 * 
 * Generates CSS files from design tokens, maintaining compatibility
 * with the existing script-based output format.
 */

export class CSSGenerator {
  private timestamp: string;

  constructor() {
    this.timestamp = new Date().toISOString();
  }

  /**
   * Generate colors.css file content
   */
  generateColorsCSS(colors: Record<string, any>): string {
    const header = this.generateHeader('Generated color variables file', 'colors.ts');
    const rootVariables = this.generateRootVariables(colors);
    const themeInline = this.generateThemeInlineSection(colors);

    return `${header}\n${rootVariables}\n\n${themeInline}\n`;
  }

  /**
   * Generate individual theme CSS file content
   */
  generateThemeCSS(theme: any): string {
    const { id, name, type, colors } = theme;
    
    const header = [
      `/**`,
      ` * Theme: ${name}`,
      ` * Type: ${type}`,
      ` * ID: ${id}`,
      ` * Generated on: ${this.timestamp}`,
      ` */`,
    ].join('\n');

    const selector = type === 'light' ? ':root' : `.${id}`;
    const variables = this.generateCSSVariables(colors || {});

    return `${header}\n\n${selector} {\n${variables}\n}\n`;
  }

  /**
   * Generate theme-base.css file content
   */
  generateBaseCSS(themes: any[], theme: any): string {
    const header = this.generateHeader('Theme Base CSS', 'Contains shared theme variables and CSS');
    
    const staticContent = [
      ':root {',
      '  --radius: 0.625rem;',
      '}',
      '',
      '@theme inline {',
      this.generateBaseThemeVariables(themes),
      '  /* Fonts - Poppins only */',
      '  --font-sans: var(--font-poppins);',
      '  ',
      '  /* Radius values */',
      '  --radius-sm: calc(var(--radius) - 4px);',
      '  --radius-md: calc(var(--radius) - 2px);',
      '  --radius-lg: var(--radius);',
      '  --radius-xl: calc(var(--radius) + 4px);',
      '}',
      '',
      '@layer base {',
      '  * {',
      '    @apply border-border outline-ring/50;',
      '  }',
      '  body {',
      '    @apply bg-background text-foreground;',
      '  }',
      '  ',
      '  /* Set Poppins as the default font with proper fallbacks */',
      '  .font-sans {',
      '    font-family: var(--font-poppins), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;',
      '  }',
      '}',
      '',
      '/* #region RTL CSS */',
      '.omit-rtl {',
      '  direction: ltr;',
      '  unicode-bidi: isolate;',
      '}',
      '.inherit-dir {',
      '  direction: inherit;',
      '  unicode-bidi: inherit;',
      '}',
      '/* End of RTL CSS */',
      '',
    ].join('\n');

    return `${header}\n${staticContent}`;
  }

  /**
   * Generate globals.css file content
   */
  generateGlobalsCSS(themes: any[]): string {
    const header = [
      `/**`,
      ` * Generated theme file`,
      ` * Generated on: ${this.timestamp}`,
      ` * Theme count: ${themes?.length || 0}`,
      ` */`,
      ``,
      `/* Import design system color variables */`,
      `@import "../styles/colors.css";`,
      ``,
      `/* Import base theme styles */`,
      `@import "../styles/theme-base.css";`,
      `@import "../styles/general.css";`,
      ``,
      `/* Import theme files */`,
    ];

    if (themes && Array.isArray(themes)) {
      themes.forEach(theme => {
        header.push(`@import "../styles/${theme.id}-theme.css";`);
      });
    }

    header.push(
      '',
      '@import "tailwindcss";',
      '',
      '@plugin "tailwindcss-animate";',
      '',
      '@custom-variant dark (&:is(.dark *));',
      '',
      // '@config "../../tailwind.config.ts"; /*- uncomment to enable backwards compatibility for tailwind config (v3)-*/',
    );

    return header.join('\n');
  }

  /**
   * Generate CSS variables from colors object
   */
  private generateRootVariables(colors: Record<string, any>): string {
    const variables: string[] = [];

    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        variables.push(`  --${this.toKebabCase(key)}: ${value};`);
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (typeof subValue === 'string') {
            variables.push(`  --${this.toKebabCase(key)}-${this.toKebabCase(subKey)}: ${subValue};`);
          }
        });
      }
    });

    return `:root {\n${variables.join('\n')}\n}`;
  }

  /**
   * Generate @theme inline section
   */
  private generateThemeInlineSection(colors: Record<string, any>): string {
    const themeVars: string[] = [];

    const toKebab = (s: string) => this.toKebabCase(s);

    const getNumericShades = (obj: Record<string, any>): string[] =>
      Object.keys(obj)
        .filter(key => !isNaN(parseInt(key)))
        .sort((a, b) => parseInt(a) - parseInt(b));

    const getFallbackForGroupMain = (groupName: string, valueObj: any): string | undefined => {
      if (valueObj && typeof valueObj === 'object') {
        if (typeof valueObj.default === 'string') return valueObj.default;
        if (typeof valueObj.DEFAULT === 'string') return valueObj.DEFAULT;
        if (typeof valueObj[500] === 'string') return valueObj[500];
        const shades = getNumericShades(valueObj);
        if (shades.length > 0 && typeof valueObj[shades[0]] === 'string') return valueObj[shades[0]];
      }
      if (typeof valueObj === 'string') return valueObj;
      return undefined;
    };

    Object.entries(colors).forEach(([groupName, colorValue]) => {
      const groupKebab = toKebab(groupName);

      if (typeof colorValue === 'string') {
        // Simple color value: provide fallback directly
        themeVars.push(`  --color-${groupKebab}: var(--${groupKebab}, ${colorValue});`);
        return;
      }

      if (colorValue && typeof colorValue === 'object') {
        const numericShades = getNumericShades(colorValue);
        const hasNumericKeys = numericShades.length > 0;

        if (hasNumericKeys) {
          themeVars.push(`  /* ${this.capitalize(groupName)} color shades */`);

          // Main mapping for the group with sensible fallback
          const mainFallback = getFallbackForGroupMain(groupName, colorValue);
          if (typeof colorValue.default === 'string' || typeof colorValue.DEFAULT === 'string') {
            const defKey = typeof colorValue.default === 'string' ? 'default' : 'DEFAULT';
            themeVars.push(`  --color-${groupKebab}: var(--${groupKebab}-${defKey.toLowerCase()}, ${mainFallback});`);
          } else if (typeof colorValue[500] === 'string') {
            themeVars.push(`  --color-${groupKebab}: var(--${groupKebab}-500, ${colorValue[500]});`);
          } else if (numericShades.length > 0) {
            const first = numericShades.includes('500') ? '500' : numericShades[Math.floor(numericShades.length / 2)] || numericShades[0];
            themeVars.push(`  --color-${groupKebab}: var(--${groupKebab}-${first}, ${colorValue[first]});`);
          } else if (mainFallback) {
            themeVars.push(`  --color-${groupKebab}: var(--${groupKebab}, ${mainFallback});`);
          }

          // Shades with fallbacks
          numericShades.forEach(shade => {
            const val = colorValue[shade];
            if (typeof val === 'string') {
              themeVars.push(`  --color-${groupKebab}-${shade}: var(--${groupKebab}-${shade}, ${val});`);
            }
          });

          themeVars.push('');
        } else {
          // Semantic group (non-numeric keys)
          themeVars.push(`  /* ${this.capitalize(groupName)} semantic group */`);

          const groupFallback = getFallbackForGroupMain(groupName, colorValue);
          if (groupFallback) {
            themeVars.push(`  --color-${groupKebab}: var(--${groupKebab}, ${groupFallback});`);
          } else {
            themeVars.push(`  --color-${groupKebab}: var(--${groupKebab});`);
          }

          Object.keys(colorValue).forEach(key => {
            if (key !== 'default' && key !== 'DEFAULT') {
              const subVal = colorValue[key];
              const keyKebab = toKebab(key);
              if (typeof subVal === 'string') {
                themeVars.push(`  --color-${groupKebab}-${keyKebab}: var(--${groupKebab}-${keyKebab}, ${subVal});`);
              } else {
                themeVars.push(`  --color-${groupKebab}-${keyKebab}: var(--${groupKebab}-${keyKebab});`);
              }
            }
          });

          themeVars.push('');
        }
      }
    });

    // Add UI semantic mappings (theme-level variables; no direct token fallback)
    themeVars.push('  /* UI semantic mappings */');
    const semanticMappings = [
      'ring', 'input', 'card', 'card-foreground', 'popover', 'popover-foreground',
      'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
      'accent', 'accent-foreground', 'destructive', 'destructive-foreground'
    ];
    semanticMappings.forEach(mapping => {
      themeVars.push(`  --color-${mapping}: var(--${mapping});`);
    });

    return `@theme inline {\n${themeVars.join('\n')}\n}`;
  }

  /**
   * Generate CSS variables for a theme
   */
  private generateCSSVariables(colors: Record<string, any>): string {
    const variables: string[] = [];
    const flattenedVars = this.flattenObjectToCssVars(colors);
    
    flattenedVars.forEach(([varName, value]) => {
      variables.push(`  --${varName}: ${value};`);
    });

    return variables.join('\n');
  }

  /**
   * Generate base theme variables for @theme inline
   */
  private generateBaseThemeVariables(themes: any[]): string {
    if (!themes || themes.length === 0) return '';

    const baseTheme = themes[0];
    if (!baseTheme?.colors) return '';

    const flattenedVars = this.flattenObjectToCssVars(baseTheme.colors);
    const valueByVarName: Record<string, string> = {};
    flattenedVars.forEach(([varName, value]) => {
      valueByVarName[varName] = value;
    });
    const groupedVars: Record<string, string[]> = {};

    flattenedVars.forEach(([varName]) => {
      const parts = varName.split('-');
      const parent = parts[0];
      
      if (!groupedVars[parent]) {
        groupedVars[parent] = [];
      }
      groupedVars[parent].push(varName);
    });

    const result: string[] = [];
    Object.entries(groupedVars).forEach(([parent, children]) => {
      result.push(`  /* ${this.capitalize(parent)} */`);
      const parentFallback = valueByVarName[parent];
      if (parentFallback) {
        result.push(`  --color-${parent}: var(--${parent}, ${parentFallback});`);
      } else {
        result.push(`  --color-${parent}: var(--${parent});`);
      }
      
      children.forEach(child => {
        if (child !== parent) {
          const childFallback = valueByVarName[child];
          if (childFallback) {
            result.push(`  --color-${child}: var(--${child}, ${childFallback});`);
          } else {
            result.push(`  --color-${child}: var(--${child});`);
          }
        }
      });
      
      result.push('');
    });

    return result.join('\n');
  }

  /**
   * Flatten nested object to CSS variable pairs
   */
  private flattenObjectToCssVars(obj: Record<string, any>, prefix = ''): [string, string][] {
    const result: [string, string][] = [];
    
    Object.entries(obj).forEach(([key, value]) => {
      const varName = prefix ? `${prefix}-${this.toKebabCase(key)}` : this.toKebabCase(key);
      
      if (typeof value === 'string') {
        result.push([varName, value]);
      } else if (value && typeof value === 'object') {
        // Handle default values
        if ('DEFAULT' in value || 'default' in value) {
          const defaultValue = value.DEFAULT || value.default;
          if (typeof defaultValue === 'string') {
            result.push([varName, defaultValue]);
          }
        }
        
        // Add all other properties
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subKey.toLowerCase() !== 'default' && typeof subValue === 'string') {
            result.push([`${varName}-${this.toKebabCase(subKey)}`, subValue]);
          }
        });
      }
    });
    
    return result;
  }

  /**
   * Generate file header
   */
  private generateHeader(title: string, description?: string): string {
    const lines = [
      `/**`,
      ` * ${title}`,
      ` * Generated on: ${this.timestamp}`,
    ];
    
    if (description) {
      lines.push(` * This file is auto-generated from ${description}`);
    }
    
    lines.push(` */`);
    return lines.join('\n');
  }

  /**
   * Convert camelCase to kebab-case
   */
  private toKebabCase(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Capitalize first letter
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

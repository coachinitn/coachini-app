/**
 * Responsive design utilities
 * Provides functions for creating responsive classes and handling custom breakpoints
 */

/**
 * Responsive breakpoint variant definition
 */
export type ResponsiveVariant = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;

/**
 * Apply responsive variants to a class with support for custom viewport sizes
 * 
 * @param baseClass - Base class to apply at all screen sizes
 * @param variants - Optional object mapping breakpoints to class names
 * @returns Combined responsive class string
 * 
 * @example
 * // With standard Tailwind breakpoints and base class only
 * responsive('p-4')
 * 
 * @example
 * // With standard Tailwind breakpoints
 * responsive('p-4', { sm: 'p-2', md: 'p-3', lg: 'p-4', xl: 'p-5', '2xl': 'p-6' })
 * 
 * @example
 * // With custom pixel/rem/em breakpoints
 * responsive('text-sm', { '768px': 'text-base', '30rem': 'text-md', '1200px': 'text-lg' })
 * 
 * @example
 * // Mixing standard and custom breakpoints
 * responsive('font-bold', { sm: 'text-left', '1000px': 'text-center' })
 */
export function responsive(
  baseClass: string,
  variants?: Partial<Record<ResponsiveVariant, string>>
): string {
  const classes = [baseClass];
  const standardBreakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

  if (variants) {
    Object.entries(variants).forEach(([breakpoint, value]) => {
      if (!value) return;

      if (standardBreakpoints.includes(breakpoint)) {
        value.split(' ').forEach(cls => {
          if (cls.trim()) {
            classes.push(`${breakpoint}:${cls.trim()}`);
          }
        });
      }
      else if (breakpoint.match(/^\d+(px|rem|em)$/)) {
        value.split(' ').forEach(cls => {
          if (cls.trim()) {
            classes.push(`min-[${breakpoint}]:${cls.trim()}`);
          }
        });
      }
    });
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Short alias for the responsive function
 */
export const r = responsive;

export default responsive; 
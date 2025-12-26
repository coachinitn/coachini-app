/**
 * Fluid typography utilities
 * Provides functions for creating fluid typography that scales with viewport size
 */
import { typography, TypographyVariant } from './typography';

/**
 * Fluid typography configuration
 */
export type FluidConfig = {
  min: number;
  max: number;
  minVw?: number;
  maxVw?: number;
  unit?: 'px' | 'rem';
  lineHeight?: number | {
    min: number;
    max: number;
  };
};

/**
 * Type alias for fluid typography variants
 */
export type FluidVariant = TypographyVariant;

// Store for generated fluid typography classes
const fluidTypographyClasses: Record<string, string> = {};
let styleTagCreated = false;

/**
 * Predefined fluid typography configurations for common variants
 */
export const FLUID_VARIANTS: Record<FluidVariant, FluidConfig> = {
	h1: {
		min: 36,
		max: 60,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: { min: 1.1, max: 1.2 },
	},
	h2: {
		min: 30,
		max: 36,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: { min: 1.2, max: 1.3 },
	},
	h3: {
		min: 24,
		max: 30,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: { min: 1.2, max: 1.3 },
	},
	h4: {
		min: 20,
		max: 20,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.3,
	},
	h5: {
		min: 18,
		max: 18,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.4,
	},
	h6: {
		min: 16,
		max: 16,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.4,
	},
	p: {
		min: 16,
		max: 16,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.5,
	},
	lead: {
		min: 20,
		max: 20,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.5,
	},
	large: {
		min: 18,
		max: 18,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.5,
	},
	small: {
		min: 14,
		max: 14,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.4,
	},
	muted: {
		min: 14,
		max: 14,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.4,
	},
	figmaDisplayLarge: {
		min: 37,
		max: 57,
		minVw: 420,
		maxVw: 1280,
		unit: 'px',
		lineHeight: { min: 1.1, max: 1.2 },
	},
	figmaDisplayMedium: {
		min: 36,
		max: 60,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: { min: 1.1, max: 1.2 },
	},
	figmaDisplaySmall: {
		min: 36,
		max: 60,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: { min: 1.1, max: 1.2 },
	},
	figmaHeadlineLarge: {
		min: 30,
		max: 36,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: { min: 1.2, max: 1.3 },
	},
	figmaHeadlineMedium: {
		min: 30,
		max: 36,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: { min: 1.2, max: 1.3 },
	},
	figmaHeadlineSmall: {
		min: 30,
		max: 36,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: { min: 1.2, max: 1.3 },
	},
	figmaTitleLarge: {
		min: 24,
		max: 30,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: { min: 1.2, max: 1.3 },
	},
	figmaTitleMedium: {
		min: 24,
		max: 30,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: { min: 1.2, max: 1.3 },
	},
	figmaTitleSmall: {
		min: 24,
		max: 30,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: { min: 1.2, max: 1.3 },
	},
	figmaLabelLarge: {
		min: 14,
		max: 14,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.4,
	},
	figmaLabelMedium: {
		min: 14,
		max: 14,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.4,
	},
	figmaLabelSmall: {
		min: 14,
		max: 14,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.4,
	},
	figmaBodyLarge: {
		min: 16,
		max: 16,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.5,
	},
	figmaBodyMedium: {
		min: 16,
		max: 16,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.5,
	},
	figmaBodySmall: {
		min: 16,
		max: 16,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.5,
	},
	figmaButtonLarge: {
		min: 14,
		max: 14,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.4,
	},
	figmaButtonMedium: {
		min: 14,
		max: 14,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.4,
	},
	figmaButtonSmall: {
		min: 14,
		max: 14,
		minVw: 320,
		maxVw: 1280,
		unit: 'px',
		lineHeight: 1.4,
	},
};

/**
 * Generate fluid typography CSS
 * 
 * @param config - Fluid typography configuration
 * @returns CSS clamp function for fluid typography
 * 
 * @example
 * fluidType({ min: 16, max: 24 })
 */
export function fluidType(config: FluidConfig): string {
  const {
    min,
    max,
    minVw = 320,
    maxVw = 1280,
    unit = 'px'
  } = config;

  const minSize = min;
  const maxSize = max;
  const minWidth = minVw;
  const maxWidth = maxVw;

  const slope = (maxSize - minSize) / (maxWidth - minWidth);
  const intercept = minSize - slope * minWidth;

  const calcValue = `clamp(${minSize}${unit}, ${intercept.toFixed(4)}${unit} + ${(slope * 100).toFixed(4)}vw, ${maxSize}${unit})`;

  return calcValue;
}

/**
 * Create a utility class for fluid typography
 * Accepts either a FluidConfig object or a typography variant name
 * 
 * @param configOrVariant - Fluid configuration or variant name
 * @returns Generated CSS class name
 * 
 * @example
 * // With custom configuration
 * fluidTypography({ min: 16, max: 24 })
 * 
 * // With predefined variant
 * fluidTypography('h1')
 */
export function fluidTypography(configOrVariant: FluidConfig | FluidVariant): string {
  if (typeof configOrVariant === 'string') {
    const variant = configOrVariant as FluidVariant;
    const config = FLUID_VARIANTS[variant] || FLUID_VARIANTS.p;

    const fluidClass = createFluidClass(config);

    const typographyClasses = typography(variant);
    const styleProperties = typographyClasses
      .split(' ')
      .filter(cls => !cls.includes('text-') && !cls.includes(':text-'))
      .join(' ');

    return `${fluidClass} ${styleProperties}`;
  } else {
    return createFluidClass(configOrVariant);
  }
}

/**
 * Helper function to create a fluid typography class from a config
 */
function createFluidClass(config: FluidConfig): string {
  const hash = `fluid-${config.min}-${config.max}-${config.minVw || 320}-${config.maxVw || 1280}-${config.unit || 'px'}-${config.lineHeight ? JSON.stringify(config.lineHeight) : 'default'}`;

  if (fluidTypographyClasses[hash]) {
    return fluidTypographyClasses[hash];
  }

  const fluidValue = fluidType(config);

  let lineHeightValue: string | undefined;

  if (config.lineHeight) {
    if (typeof config.lineHeight === 'number') {
      lineHeightValue = config.lineHeight.toString();
    } else {
      const { min, max } = config.lineHeight;
      const minVw = config.minVw || 320;
      const maxVw = config.maxVw || 1280;

      const slope = (max - min) / (maxVw - minVw);
      const intercept = min - slope * minVw;

      lineHeightValue = `clamp(${min}, ${intercept.toFixed(4)} + ${(slope * 100).toFixed(4)}vw, ${max})`;
    }
  }

  const className = `ft-${Object.keys(fluidTypographyClasses).length}`;

  fluidTypographyClasses[hash] = className;

  if (typeof document !== 'undefined') {
    if (!styleTagCreated) {
      const styleTag = document.createElement('style');
      styleTag.id = 'fluid-typography-styles';
      document.head.appendChild(styleTag);
      styleTagCreated = true;
    }

    const styleTag = document.getElementById('fluid-typography-styles') as HTMLStyleElement;
    if (styleTag) {
      let cssRule = `\n.${className} { font-size: ${fluidValue};`;

      if (lineHeightValue) {
        cssRule += ` line-height: ${lineHeightValue};`;
      }

      cssRule += ' }';

      styleTag.innerHTML += cssRule;
    }
  }

  return className;
}

/**
 * Get a predefined fluid typography configuration
 * 
 * @param variant - Typography variant
 * @returns Fluid configuration for the variant
 */
export function getFluidVariant(variant: FluidVariant): FluidConfig {
  return FLUID_VARIANTS[variant] || FLUID_VARIANTS.p;
}

/**
 * Short alias for the fluidTypography function
 */
export const ft = fluidTypography;

export default fluidTypography; 
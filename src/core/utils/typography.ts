/**
 * Typography utilities
 * Provides functions for applying typography styles with Tailwind CSS
 */
import { responsive } from './responsive';

/**
 * Typography variant types
 */
export type TypographyVariant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'p' | 'lead' | 'large' | 'small' | 'muted'
  // Figma Display Styles
  | 'figmaDisplayLarge' | 'figmaDisplayMedium' | 'figmaDisplaySmall'
  // Figma Headline Styles
  | 'figmaHeadlineLarge' | 'figmaHeadlineMedium' | 'figmaHeadlineSmall'
  // Figma Title Styles
  | 'figmaTitleLarge' | 'figmaTitleMedium' | 'figmaTitleSmall'
  // Figma Label Styles
  | 'figmaLabelLarge' | 'figmaLabelMedium' | 'figmaLabelSmall'
  // Figma Body Styles
  | 'figmaBodyLarge' | 'figmaBodyMedium' | 'figmaBodySmall'
  // Figma Button Styles
  | 'figmaButtonLarge' | 'figmaButtonMedium' | 'figmaButtonSmall';

/**
 * Typography override options
 */
export type TypographyOverrides = {
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  fontStyle?: 'normal' | 'italic';
  responsive?: boolean;
};

/**
 * Custom typography configuration
 */
export type CustomTypographyConfig = TypographyOverrides;

/**
 * Typography variant default class mapping
 *
 * Responsive Typography System based on Figma Design System:
 *
 * Breakpoints:
 * - Mobile (default): < 768px
 * - Tablet (md:): >= 768px
 * - Desktop (lg:): >= 1024px
 *
 * Size Mapping:
 * - DL = Display Large (57px/64px)
 * - DM = Display Medium (45px/52px)
 * - DS = Display Small (36px/44px)
 * - HL = Headline Large (32px/40px)
 * - HM = Headline Medium (28px/36px)
 * - HS = Headline Small (24px/32px)
 * - TL = Title Large (22px/28px)
 * - TM = Title Medium (16px/24px)
 * - TS = Title Small (14px/20px)
 * - LL = Label Large (16px/24px)
 * - LM = Label Medium (14px/20px)
 * - LS = Label Small (12px/16px)
 * - BL = Body Large (18px/25px)
 * - BM = Body Medium (14px/20px)
 * - BS = Body Small (12px/16px)
 *
 * Responsive Behavior:
 * - figmaDisplayLarge: Mobile(HS) → Tablet(DS) → Desktop(DL)
 * - figmaDisplayMedium: Mobile(HS) → Tablet(DS) → Desktop(DM)
 * - figmaDisplaySmall: Mobile(HS) → Tablet(DS) → Desktop(DS)
 * - figmaHeadlineLarge: Mobile(TM) → Tablet(HM) → Desktop(HL)
 * - figmaHeadlineMedium: Mobile(TM) → Tablet(HM) → Desktop(HM)
 * - figmaHeadlineSmall: Mobile(TM) → Tablet(HS) → Desktop(HS)
 * - figmaTitleLarge: Mobile(TS) → Tablet(TM) → Desktop(TL)
 * - figmaTitleMedium: Mobile(TS) → Tablet(TM) → Desktop(TM)
 * - figmaTitleSmall: Mobile(TS) → Tablet(TS) → Desktop(TS)
 * - figmaLabelLarge: Mobile(TS) → Tablet(TS) → Desktop(LL)
 * - figmaLabelMedium: Mobile(TS) → Tablet(TS) → Desktop(LM)
 * - figmaLabelSmall: Mobile(LS) → Tablet(LS) → Desktop(LS)
 * - figmaBodyLarge: Mobile(BS) → Tablet(BM) → Desktop(BL)
 * - figmaBodyMedium: Mobile(BS) → Tablet(BM) → Desktop(BM)
 * - figmaBodySmall: Mobile(BS) → Tablet(BS) → Desktop(BS)
 * - figmaButtonLarge: Mobile(BS) → Tablet(BM) → Desktop(BL)
 * - figmaButtonMedium: Mobile(BS) → Tablet(BM) → Desktop(BM)
 * - figmaButtonSmall: Mobile(BS) → Tablet(BS) → Desktop(BS)
 */
export const TYPOGRAPHY_VARIANTS: Record<TypographyVariant, string> = {
	h1: 'text-4xl font-bold leading-none sm:text-5xl md:text-6xl',
	h2: 'text-3xl font-bold leading-normal sm:text-4xl',
	h3: 'text-2xl font-bold leading-normal sm:text-3xl',
	h4: 'text-xl font-bold leading-normal',
	h5: 'text-lg font-bold leading-normal',
	h6: 'text-base font-bold leading-normal',
	p: 'text-base leading-7',
	lead: 'text-xl text-muted-foreground',
	large: 'text-lg font-semibold',
	small: 'text-sm font-medium leading-none',
	muted: 'text-sm text-muted-foreground',

	// Figma Display Styles - Responsive (Mobile: HS, Tablet: DS, Desktop: DL/DM/DS)
	figmaDisplayLarge:
		'font-sans text-[24px] leading-[32px] md:text-[36px] md:leading-[44px] lg:text-[57px] lg:leading-[64px] tracking-normal',
	figmaDisplayMedium:
		'font-sans text-[24px] leading-[32px] md:text-[36px] md:leading-[44px] lg:text-[45px] lg:leading-[52px] tracking-normal',
	figmaDisplaySmall:
		'font-sans text-[24px] leading-[32px] md:text-[36px] md:leading-[44px] lg:text-[36px] lg:leading-[44px] tracking-normal',

	// Figma Headline Styles - Responsive (Mobile: TM, Tablet: HM, Desktop: HL/HM/HS)
	figmaHeadlineLarge:
		'font-sans text-[16px] leading-[24px] md:text-[28px] md:leading-[36px] lg:text-[32px] lg:leading-[40px] tracking-normal',
	figmaHeadlineMedium:
		'font-sans text-[16px] leading-[24px] md:text-[28px] md:leading-[36px] lg:text-[28px] lg:leading-[36px] tracking-normal',
	figmaHeadlineSmall:
		'font-sans text-[16px] leading-[24px] md:text-[24px] md:leading-[32px] lg:text-[24px] lg:leading-[32px] tracking-normal',

	// Figma Title Styles - Responsive (Mobile: TS, Tablet: TM/TS, Desktop: TL/TM/TS)
	figmaTitleLarge:
		'font-sans text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] lg:text-[22px] lg:leading-[28px] tracking-normal',
	figmaTitleMedium:
		'font-sans text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] lg:text-[16px] lg:leading-[24px] tracking-normal',
	figmaTitleSmall:
		'font-sans text-[14px] leading-[20px] md:text-[14px] md:leading-[20px] lg:text-[14px] lg:leading-[20px] tracking-normal',

	// Figma Label Styles - Responsive (Mobile: TS, Tablet: TS, Desktop: LL/LM/LS)
	figmaLabelLarge:
		'font-sans text-[14px] leading-[20px] md:text-[14px] md:leading-[20px] lg:text-[16px] lg:leading-[24px] tracking-normal',
	figmaLabelMedium:
		'font-sans text-[14px] leading-[20px] md:text-[14px] md:leading-[20px] lg:text-[14px] lg:leading-[20px] tracking-normal',
	figmaLabelSmall:
		'font-sans text-[12px] leading-[16px] md:text-[12px] md:leading-[16px] lg:text-[12px] lg:leading-[16px] tracking-normal',

	// Figma Body Styles - Responsive (Mobile: BS, Tablet: BM, Desktop: BL/BM/BS)
	figmaBodyLarge:
		'font-sans text-[12px] leading-[16px] md:text-[14px] md:leading-[20px] lg:text-[18px] lg:leading-[25px] tracking-normal',
	figmaBodyMedium:
		'font-sans text-[12px] leading-[16px] md:text-[14px] md:leading-[20px] lg:text-[14px] lg:leading-[20px] tracking-normal',
	figmaBodySmall:
		'font-sans text-[12px] leading-[16px] md:text-[12px] md:leading-[16px] lg:text-[12px] lg:leading-[16px] tracking-normal',

	// Figma Button Styles - Responsive (Mobile: BS, Tablet: BM, Desktop: BL/BM/BS)
	figmaButtonLarge:
		'font-sans text-[12px] leading-[16px] md:text-[14px] md:leading-[20px] lg:text-[18px] lg:leading-[25px] tracking-normal',
	figmaButtonMedium:
		'font-sans text-[12px] leading-[16px] md:text-[14px] md:leading-[20px] lg:text-[16px] lg:leading-[24px] tracking-normal',
	figmaButtonSmall:
		'font-sans text-[12px] leading-[16px] md:text-[12px] md:leading-[16px] lg:text-[14px] lg:leading-[20px] tracking-normal',
};

/**
 * Apply typography variants with optional overrides
 * 
 * @param variant - Typography variant or custom class string
 * @param overrides - Optional style overrides
 * @returns Combined typography class string
 * 
 * @example
 * typography('h1') // Returns predefined h1 classes
 * typography('h1', { fontWeight: 'font-normal' }) // Returns h1 classes with font-weight overridden
 */
export function typography(
  variant: TypographyVariant | string,
  overrides?: TypographyOverrides
): string {
  // If no overrides, just return the variant classes
  if (!overrides) {
    // Check if the variant is a predefined one
    if (typeof variant === 'string' && variant in TYPOGRAPHY_VARIANTS) {
      // Add a special class for debugging/styling hooks
      return `${TYPOGRAPHY_VARIANTS[variant as TypographyVariant]} _tp-${variant}`;
    }
    // If not a predefined variant, return the custom classes
    return variant;
  }

  // With overrides, we need to parse the variant classes and apply the overrides
  let baseClasses = '';

  // Get the base classes for the variant
  if (typeof variant === 'string' && variant in TYPOGRAPHY_VARIANTS) {
    baseClasses = TYPOGRAPHY_VARIANTS[variant as TypographyVariant];
  } else {
    baseClasses = variant;
  }

  // Parse the base classes into an array
  const classArray = baseClasses.split(' ');

  // Apply overrides
  if (overrides) {
    // Create a map to track which properties have been overridden
    const overriddenProperties = new Set<string>();

    // Helper function to check if a class belongs to a specific property
    const isPropertyClass = (cls: string, property: string): boolean => {
      const propertyPrefixes: Record<string, string[]> = {
        fontSize: ['text-'],
        fontWeight: ['font-'],
        lineHeight: ['leading-'],
        letterSpacing: ['tracking-'],
        textTransform: ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
        fontStyle: ['italic', 'not-italic'],
      };

      return propertyPrefixes[property]?.some(prefix =>
        cls.startsWith(prefix) ||
        cls.includes(':' + prefix)
      ) || false;
    };

    // Remove classes that will be overridden
    const filteredClasses = classArray.filter(cls => {
      // Check each property to see if this class should be removed
      for (const property of Object.keys(overrides)) {
        if (property !== 'responsive' && isPropertyClass(cls, property)) {
          overriddenProperties.add(property);
          return false;
        }
      }
      return true;
    });

    // Add the override classes
    const overrideClasses: string[] = [];

    if (overrides.fontSize) {
      overrideClasses.push(overrides.fontSize);
      overriddenProperties.add('fontSize');
    }

    if (overrides.fontWeight) {
      if (typeof overrides.fontWeight === 'number') {
        overrideClasses.push(`font-${overrides.fontWeight}`);
      } else {
        overrideClasses.push(overrides.fontWeight);
      }
      overriddenProperties.add('fontWeight');
    }

    if (overrides.lineHeight) {
      if (typeof overrides.lineHeight === 'number') {
        overrideClasses.push(`leading-[${overrides.lineHeight}]`);
      } else {
        overrideClasses.push(overrides.lineHeight);
      }
      overriddenProperties.add('lineHeight');
    }

    if (overrides.letterSpacing) {
      overrideClasses.push(overrides.letterSpacing);
      overriddenProperties.add('letterSpacing');
    }

    if (overrides.textTransform) {
      overrideClasses.push(overrides.textTransform);
      overriddenProperties.add('textTransform');
    }

    if (overrides.fontStyle) {
      overrideClasses.push(overrides.fontStyle);
      overriddenProperties.add('fontStyle');
    }

    // Handle responsive overrides
    if (overrides.responsive && overrides.fontSize) {
      // Extract the base size from fontSize (assuming format like 'text-lg')
      const baseSize = overrides.fontSize.replace('text-', '');

      // Create responsive variants based on the base size
      const responsiveClasses = responsive(overrides.fontSize, {
        sm: `text-${baseSize}`,
        md: overrides.fontSize,
        lg: overrides.fontSize.includes('xl') ? `text-${baseSize}xl` : `text-${baseSize}`,
        xl: overrides.fontSize.includes('xl') ? `text-${parseInt(baseSize) + 1}xl` : `text-${baseSize}`,
      });

      // Replace the fontSize with the responsive version
      const index = overrideClasses.indexOf(overrides.fontSize);
      if (index !== -1) {
        overrideClasses[index] = responsiveClasses;
      }
    }

    // Combine the filtered base classes with the override classes
    const result = [...filteredClasses, ...overrideClasses].join(' ');
    
    // Add the typography marker class
    if (typeof variant === 'string' && variant in TYPOGRAPHY_VARIANTS) {
      return `${result} _tp-${variant}`;
    }
    
    return result;
  }

  return baseClasses;
}

/**
 * Create custom typography styles
 * 
 * @param config - Typography configuration object
 * @returns Class string for custom typography
 * 
 * @example
 * customTypography({ fontSize: 'text-lg', fontWeight: 'font-semibold', lineHeight: 'leading-tight' })
 */
export function customTypography(config: CustomTypographyConfig): string {
  const classes: string[] = [];

  if (config.fontSize) {
    classes.push(config.fontSize);
  }

  if (config.fontWeight) {
    if (typeof config.fontWeight === 'number') {
      classes.push(`font-${config.fontWeight}`);
    } else {
      classes.push(config.fontWeight);
    }
  }

  if (config.lineHeight) {
    if (typeof config.lineHeight === 'number') {
      classes.push(`leading-[${config.lineHeight}]`);
    } else {
      classes.push(config.lineHeight);
    }
  }

  if (config.letterSpacing) {
    classes.push(config.letterSpacing);
  }

  if (config.textTransform) {
    classes.push(`${config.textTransform}`);
  }

  if (config.fontStyle) {
    classes.push(`${config.fontStyle}`);
  }

  // Add special typography marker class for custom typography
  classes.push('_tp-custom');

  // If responsive is true, add responsive variants
  if (config.responsive && config.fontSize) {
    // Extract the base size from fontSize
    const baseSize = config.fontSize.replace('text-', '');

    // Create responsive variants
    const responsiveClasses = responsive(config.fontSize, {
      sm: `text-${baseSize}`,
      md: config.fontSize,
      lg: config.fontSize.includes('xl') ? `text-${baseSize}xl` : `text-${baseSize}`,
      xl: config.fontSize.includes('xl') ? `text-${parseInt(baseSize) + 1}xl` : `text-${baseSize}`,
    });

    // Replace the original fontSize with the responsive version
    const index = classes.indexOf(config.fontSize);
    if (index !== -1) {
      classes[index] = responsiveClasses;
    }
  }

  return classes.join(' ');
}

/**
 * Short alias for the typography function
 */
export const t = typography;

export default typography; 
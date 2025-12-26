/**
 * Typography tokens for the design system
 */
export const typography = {
  // Font families - Poppins only with system fallbacks
  fontFamily: {
    sans: ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
    display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  },
  
  // Font sizes
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '22px': '1.375rem', // 22px - NEW
    '2xl': '1.5rem',   // 24px
    '28px': '1.75rem', // 28px - NEW
    '3xl': '1.875rem', // 30px
    '32px': '2rem',    // 32px - NEW
    '4xl': '2.25rem',  // 36px
    '45px': '2.8125rem', // 45px - NEW
    '5xl': '3rem',     // 48px
    '57px': '3.5625rem', // 57px - NEW
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
    '9xl': '8rem',     // 128px
  },
  
  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line heights
  lineHeight: {
    none: '1',
    closest: '1.125', // NEW
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
    // Absolute line heights
    3: '.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Text transform
  textTransform: {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    normalCase: 'none',
  },
  
  // Text decoration
  textDecoration: {
    underline: 'underline',
    lineThrough: 'line-through',
    none: 'none',
  },
  
  // Text overflow
  textOverflow: {
    truncate: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    ellipsis: {
      textOverflow: 'ellipsis',
    },
    clip: {
      textOverflow: 'clip',
    },
  },
};

// Semantic typography presets
export const typographyPresets = {
  headings: {
    h1: {
      fontSize: typography.fontSize['5xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    h2: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    h3: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.snug,
      letterSpacing: typography.letterSpacing.normal,
    },
    h4: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.snug,
      letterSpacing: typography.letterSpacing.normal,
    },
    h5: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    h6: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },
  body: {
    large: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed,
    },
    base: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed,
    },
    small: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed,
    },
    xs: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal, 
    },
  },
  display: {
    large: {
      fontFamily: typography.fontFamily.display,
      fontSize: typography.fontSize['7xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tighter,
    },
    medium: {
      fontFamily: typography.fontFamily.display,
      fontSize: typography.fontSize['6xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    small: {
      fontFamily: typography.fontFamily.display,
      fontSize: typography.fontSize['5xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
  },

  // New presets based on Figma styles
  figmaDisplay: {
    large: { 
      fontFamily: typography.fontFamily.display,
      fontSize: typography.fontSize['57px'], 
      fontWeight: typography.fontWeight.normal,
      lineHeight: '1.12',
      letterSpacing: typography.letterSpacing.normal,
    },
    medium: { 
      fontFamily: typography.fontFamily.display,
      // fontSize: typography.fontSize['45px'],
      fontWeight: typography.fontWeight.normal,
      lineHeight: '1.16',
      letterSpacing: typography.letterSpacing.normal,
    },
    small: { 
      fontFamily: typography.fontFamily.display,
      fontSize: typography.fontSize['4xl'], 
      fontWeight: typography.fontWeight.normal,
      lineHeight: '1.22',
      letterSpacing: typography.letterSpacing.normal,
    },
  },

  figmaHeadline: {
    large: { 
      fontSize: typography.fontSize['32px'],
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.normal,
    },
    medium: { 
      fontSize: typography.fontSize['28px'],
      fontWeight: typography.fontWeight.normal,
      lineHeight: '1.29',
      letterSpacing: typography.letterSpacing.normal,
    },
    small: { 
      fontSize: typography.fontSize['2xl'], 
      fontWeight: typography.fontWeight.normal,
      lineHeight: '1.33',
      letterSpacing: typography.letterSpacing.normal,
    },
  },

  figmaTitle: {
    large: { 
      fontSize: typography.fontSize['22px'],
      fontWeight: typography.fontWeight.normal,
      lineHeight: '1.27',
      letterSpacing: typography.letterSpacing.normal,
    },
    medium: { 
      fontSize: typography.fontSize.base, 
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    small: { 
      fontSize: typography.fontSize.sm, 
      fontWeight: typography.fontWeight.medium,
      lineHeight: '1.43',
      letterSpacing: typography.letterSpacing.normal,
    },
  },

  figmaLabel: {
    large: { 
      fontSize: typography.fontSize.base, 
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.none,
      letterSpacing: typography.letterSpacing.normal,
    },
    medium: { 
      fontSize: typography.fontSize.sm, 
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.none,
      letterSpacing: typography.letterSpacing.normal,
    },
    small: { 
      fontSize: typography.fontSize.xs, 
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.none,
      letterSpacing: typography.letterSpacing.normal,
    },
  },

  figmaBody: {
     large: { 
      fontSize: typography.fontSize.lg, 
      fontWeight: typography.fontWeight.normal,
      lineHeight: '1.39',
      letterSpacing: typography.letterSpacing.normal,
    },
    medium: { 
      fontSize: typography.fontSize.sm, 
      fontWeight: typography.fontWeight.normal,
      lineHeight: '1.43',
      letterSpacing: typography.letterSpacing.normal,
    },
    small: { 
      fontSize: typography.fontSize.xs, 
      fontWeight: typography.fontWeight.normal,
      lineHeight: '1.33',
      letterSpacing: typography.letterSpacing.normal,
    },
  },

  figmaButton: {
    large: { 
      fontSize: typography.fontSize.lg, 
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.none,
      letterSpacing: typography.letterSpacing.normal, 
    },
    medium: { 
      fontSize: typography.fontSize.base, 
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.none,
      letterSpacing: typography.letterSpacing.normal,
    },
    small: { 
      fontSize: typography.fontSize.sm, 
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.none,
      letterSpacing: typography.letterSpacing.normal,
    },
  },
};

export default typography; 
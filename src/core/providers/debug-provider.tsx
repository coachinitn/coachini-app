'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TypographyVariant } from '@/core/utils';

// Define typography adjustment settings
export type TypographyAdjustment = {
  enabled: boolean;
  scale: number; // 1 = 100%, 1.2 = 120%, etc.
  variants: {
    [key in TypographyVariant]?: {
      enabled: boolean;
      scaleFactor: number;
    }
  }
};

// Define the shape of our context
type DebugContextType = {
  showFontSizeTooltips: boolean;
  showDivOutlines: boolean;
  typographyAdjustment: TypographyAdjustment;
  debugInfo: { total: number; adjusted: number };
  toggleFontSizeTooltips: () => void;
  toggleDivOutlines: () => void;
  toggleTypographyAdjustment: () => void;
  setTypographyScale: (scale: number) => void;
  toggleVariantAdjustment: (variant: TypographyVariant) => void;
  setVariantScale: (variant: TypographyVariant, scale: number) => void;
};

// Default typography adjustments
const DEFAULT_TYPOGRAPHY_ADJUSTMENT: TypographyAdjustment = {
  enabled: false,
  scale: 1,
  variants: {
    h1: { enabled: true, scaleFactor: 1 },
    h2: { enabled: true, scaleFactor: 1 },
    h3: { enabled: true, scaleFactor: 1 },
    h4: { enabled: true, scaleFactor: 1 },
    h5: { enabled: true, scaleFactor: 1 },
    h6: { enabled: true, scaleFactor: 1 },
    p: { enabled: true, scaleFactor: 1 },
    lead: { enabled: true, scaleFactor: 1 },
    large: { enabled: true, scaleFactor: 1 },
    small: { enabled: true, scaleFactor: 1 },
    muted: { enabled: true, scaleFactor: 1 },
  }
};

// Define the mapping between Tailwind classes and pixel sizes
export const TAILWIND_FONT_SIZES: Record<string, number> = {
  'text-xs': 12,     // 0.75rem
  'text-sm': 14,     // 0.875rem
  'text-base': 16,   // 1rem
  'text-lg': 18,     // 1.125rem
  'text-xl': 20,     // 1.25rem
  'text-2xl': 24,    // 1.5rem
  'text-3xl': 30,    // 1.875rem
  'text-4xl': 36,    // 2.25rem
  'text-5xl': 48,    // 3rem
  'text-6xl': 60,    // 3.75rem
  'text-7xl': 72,    // 4.5rem
  'text-8xl': 96,    // 6rem
  'text-9xl': 128,   // 8rem
};

// Map of variant to default Tailwind classes
const VARIANT_DEFAULT_SIZES: Record<TypographyVariant, string> = {
  h1: 'text-4xl',  // Non-responsive base (sm:text-5xl md:text-6xl)
  h2: 'text-3xl',  // Non-responsive base (sm:text-4xl)
  h3: 'text-2xl',  // Non-responsive base (sm:text-3xl)
  h4: 'text-xl',   // No responsive variants
  h5: 'text-lg',   // No responsive variants
  h6: 'text-base', // No responsive variants
  p: 'text-base',  // No responsive variants
  lead: 'text-xl', // No responsive variants
  large: 'text-lg', // No responsive variants
  small: 'text-sm', // No responsive variants
  muted: 'text-sm', // No responsive variants

  // Figma Display Styles
  figmaDisplayLarge: 'text-[57px]',
  figmaDisplayMedium: 'text-[43px]',
  figmaDisplaySmall: 'text-4xl',

  // Figma Headline Styles
  figmaHeadlineLarge: 'text-[32px]',
  figmaHeadlineMedium: 'text-[28px]',
  figmaHeadlineSmall: 'text-2xl',

  // Figma Title Styles
  figmaTitleLarge: 'text-[22px]',
  figmaTitleMedium: 'text-base',
  figmaTitleSmall: 'text-[14px]',

  // Figma Label Styles
  figmaLabelLarge: 'text-base',
  figmaLabelMedium: 'text-sm',
  figmaLabelSmall: 'text-xs',

  // Figma Body Styles
  figmaBodyLarge: 'text-lg',
  figmaBodyMedium: 'text-sm',
  figmaBodySmall: 'text-xs',

  // Figma Button Styles
  figmaButtonLarge: 'text-lg',
  figmaButtonMedium: 'text-base',
  figmaButtonSmall: 'text-sm',
};

// Tailwind text size classes from smallest to largest
const TEXT_SIZE_CLASSES = [
  'text-xs',   // 0.75rem   12px
  'text-sm',   // 0.875rem  14px
  'text-base', // 1rem      16px
  'text-lg',   // 1.125rem  18px
  'text-xl',   // 1.25rem   20px
  'text-2xl',  // 1.5rem    24px
  'text-3xl',  // 1.875rem  30px
  'text-4xl',  // 2.25rem   36px
  'text-5xl',  // 3rem      48px
  'text-6xl',  // 3.75rem   60px
  'text-7xl',  // 4.5rem    72px
  'text-8xl',  // 6rem      96px
  'text-9xl',  // 8rem      128px
];

// Create the context with default values
const DebugContext = createContext<DebugContextType>({
  showFontSizeTooltips: false,
  showDivOutlines: false,
  typographyAdjustment: DEFAULT_TYPOGRAPHY_ADJUSTMENT,
  debugInfo: { total: 0, adjusted: 0 },
  toggleFontSizeTooltips: () => {},
  toggleDivOutlines: () => {},
  toggleTypographyAdjustment: () => {},
  setTypographyScale: () => {},
  toggleVariantAdjustment: () => {},
  setVariantScale: () => {},
});

// Helper to find a new text size class based on the current one and a scale factor
function getAdjustedTextClass(currentClass: string, scaleFactor: number): string {
  // Find the current size index
  const currentIndex = TEXT_SIZE_CLASSES.indexOf(currentClass);
  if (currentIndex === -1) return currentClass; // Not found, return original

  // Calculate the new index based on scale factor
  let newIndex = currentIndex;
  if (scaleFactor > 1) {
    // Scaling up - each full step of scale factor adds one text size
    const stepsUp = Math.floor((scaleFactor - 1) * 4); // 1.25 = 1 step, 1.5 = 2 steps, 1.75 = 3 steps, 2.0 = 4 steps
    newIndex = Math.min(currentIndex + stepsUp, TEXT_SIZE_CLASSES.length - 1);
  } else if (scaleFactor < 1) {
    // Scaling down - each 0.25 step of scale factor reduces one text size
    const stepsDown = Math.floor((1 - scaleFactor) * 4); // 0.75 = 1 step, 0.5 = 2 steps
    newIndex = Math.max(currentIndex - stepsDown, 0);
  }

  // Return the new text size class
  return TEXT_SIZE_CLASSES[newIndex];
}

// Helper to find the default text class for a variant
function getDefaultTextClass(variant: string): string {
  return VARIANT_DEFAULT_SIZES[variant as TypographyVariant] || 'text-base';
}

// Helper to get the pixel size for a text class
function getPixelSizeForTextClass(textClass: string): number {
  return TAILWIND_FONT_SIZES[textClass] || 16; // Default to 16px if not found
}

// Hook to use the debug context
export const useDebug = () => useContext(DebugContext);

// Provider component
export function DebugProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize state from localStorage if available
  const [showFontSizeTooltips, setShowFontSizeTooltips] = useState(false);
  const [showDivOutlines, setShowDivOutlines] = useState(false);
  const [typographyAdjustment, setTypographyAdjustment] = useState<TypographyAdjustment>(DEFAULT_TYPOGRAPHY_ADJUSTMENT);
  const [originalStyles, setOriginalStyles] = useState<Record<string, { fontSize: string }>>({});
  const [debugInfo, setDebugInfo] = useState({ total: 0, adjusted: 0 });

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFontSizeTooltips = localStorage.getItem('debug_fontSizeTooltips');
      const savedDivOutlines = localStorage.getItem('debug_divOutlines');

      if (savedFontSizeTooltips) {
        setShowFontSizeTooltips(savedFontSizeTooltips === 'true');
      }

      if (savedDivOutlines) {
        setShowDivOutlines(savedDivOutlines === 'true');
      }
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('debug_fontSizeTooltips', showFontSizeTooltips.toString());
      localStorage.setItem('debug_divOutlines', showDivOutlines.toString());
    }
  }, [showFontSizeTooltips, showDivOutlines]);

  // Manipulate typography styles directly with !important
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Get all heading and paragraph elements
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div, span');
    const elements: HTMLElement[] = [];

    // Process all potential typography elements
    headings.forEach(el => {
      const element = el as HTMLElement;
      const classList = element.className.split(' ');

      // Look for _tp-{variant} class pattern
      for (const cls of classList) {
        if (cls.startsWith('_tp-')) {
          const variant = cls.replace('_tp-', '');
          // Set the data attribute properly
          element.setAttribute('data-typography', variant);
          elements.push(element);
          console.log(`Found typography element with variant ${variant}`);
          break;
        }
      }
    });

    // If we already have data-typography attributes directly on elements, include those too
    document.querySelectorAll('[data-typography]').forEach(el => {
      if (!elements.includes(el as HTMLElement)) {
        elements.push(el as HTMLElement);
      }
    });

    const totalElements = elements.length;
    let adjustedElements = 0;

    console.log(`Debug: Found ${totalElements} typography elements`);

    if (typographyAdjustment.enabled) {
      // Save original styles and apply adjustments
      const newOriginalStyles: Record<string, { fontSize: string }> = {...originalStyles};
      let hasNewStyles = false;

      elements.forEach((element) => {
        const variant = element.getAttribute('data-typography') as TypographyVariant;
        if (!variant) {
          console.log("Element has no data-typography attribute:", element);
          return;
        }

        console.log(`Debug: Processing element with variant "${variant}"`);

        const variantSettings = typographyAdjustment.variants[variant];
        if (!variantSettings || !variantSettings.enabled) {
          console.log(`Debug: Variant "${variant}" is disabled or not found`);
          return;
        }

        // Create a unique ID for this element if it doesn't have one
        const elementId = element.getAttribute('data-typography-id') || `${variant}-${Math.random().toString(36).substring(2, 9)}`;
        if (!element.hasAttribute('data-typography-id')) {
          element.setAttribute('data-typography-id', elementId);
        }

        // Get the original fontSize if we don't have it yet
        if (!originalStyles[elementId]) {
          const computedStyle = window.getComputedStyle(element);
          newOriginalStyles[elementId] = {
            fontSize: computedStyle.fontSize
          };
          hasNewStyles = true;

          // Store original fontSize for this element
          element.setAttribute('data-original-font-size', computedStyle.fontSize);
          console.log(`Debug: Stored original font size ${computedStyle.fontSize} for ${variant}`);
        }

        // Get the default text size for this variant in pixels
        const defaultTextClass = getDefaultTextClass(variant);
        const defaultSizePx = getPixelSizeForTextClass(defaultTextClass);

        // Calculate the total scale factor
        const totalScale = typographyAdjustment.scale * variantSettings.scaleFactor;

        // Apply the adjusted font size with !important
        const newFontSize = `${Math.round(defaultSizePx * totalScale)}px`;
        try {
          element.style.setProperty('font-size', newFontSize, 'important');
          console.log(`Debug: Applied ${newFontSize} to ${variant} element (original class: ${defaultTextClass})`);
          adjustedElements++;
        } catch (error) {
          console.error(`Failed to apply style to ${variant} element:`, error);
        }
      });

      // Update debug info once
      setDebugInfo({ total: totalElements, adjusted: adjustedElements });

      // Update original styles if needed
      if (hasNewStyles) {
        setOriginalStyles(newOriginalStyles);
      }

      // Cleanup when component unmounts or adjustments disabled
      return () => {
        // Restore original styles
        elements.forEach((element) => {
          const originalFontSize = element.getAttribute('data-original-font-size');

          if (originalFontSize) {
            try {
              element.style.removeProperty('font-size');
            } catch (error) {
              console.error('Failed to restore original style:', error);
            }
          }
        });
      };
    } else {
      // Restore original styles when disabled
      elements.forEach((element) => {
        const originalFontSize = element.getAttribute('data-original-font-size');

        if (originalFontSize) {
          try {
            element.style.removeProperty('font-size');
          } catch (error) {
            console.error('Failed to restore original style:', error);
          }
        }
      });

      // Update debug info when disabled
      setDebugInfo({ total: totalElements, adjusted: 0 });
    }
  // Remove originalStyles from dependencies to prevent infinite loops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typographyAdjustment]);

  // Apply div outlines directly via JS for better compatibility
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (showDivOutlines) {
      // Add outline styles to elements with data-debug-outline
      const elements = document.querySelectorAll('[data-debug-outline]');

      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.outline = '2px dashed rgba(255, 0, 0, 0.7)';
        htmlEl.style.outlineOffset = '-2px';
        htmlEl.style.position = 'relative';

        // Add hover event to show outline name
        htmlEl.addEventListener('mouseenter', showOutlineTooltip);
        htmlEl.addEventListener('mouseleave', hideOutlineTooltip);
      });

      // Cleanup function
      return () => {
        elements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.outline = '';
          htmlEl.style.outlineOffset = '';
          htmlEl.style.position = '';

          htmlEl.removeEventListener('mouseenter', showOutlineTooltip);
          htmlEl.removeEventListener('mouseleave', hideOutlineTooltip);
        });
      };
    }
  }, [showDivOutlines]);

  // Helper functions for outline tooltips
  const showOutlineTooltip = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const debugName = target.getAttribute('data-debug-outline') || 'Unnamed Element';
    const rect = target.getBoundingClientRect();

    // Use our tooltip system
    const updateTooltip = (window as any).__debugUpdateTooltip;
    if (updateTooltip) {
      // Get element dimensions
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      // Get position, adjusting for viewport and scroll
      // These are viewport coordinates + scrolling offset
      const tooltipX = rect.left;
      const tooltipY = rect.bottom + 5; // Small offset for readability

      updateTooltip(
        true,
        debugName,
        tooltipX,
        tooltipY,
        `${width}px × ${height}px`
      );
    }
  };

  const hideOutlineTooltip = () => {
    const updateTooltip = (window as any).__debugUpdateTooltip;
    if (updateTooltip) {
      updateTooltip(false);
    }
  };

  // Toggle functions
  const toggleFontSizeTooltips = () => setShowFontSizeTooltips(prev => !prev);
  const toggleDivOutlines = () => setShowDivOutlines(prev => !prev);

  // Typography adjustment functions
  const toggleTypographyAdjustment = () => {
    setTypographyAdjustment(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  const setTypographyScale = (scale: number) => {
    setTypographyAdjustment(prev => ({
      ...prev,
      scale
    }));
  };

  const toggleVariantAdjustment = (variant: TypographyVariant) => {
    setTypographyAdjustment(prev => ({
      ...prev,
      variants: {
        ...prev.variants,
        [variant]: {
          ...prev.variants[variant],
          enabled: !prev.variants[variant]?.enabled
        }
      }
    }));
  };

  const setVariantScale = (variant: TypographyVariant, scaleFactor: number) => {
    setTypographyAdjustment(prev => ({
      ...prev,
      variants: {
        ...prev.variants,
        [variant]: {
          ...prev.variants[variant],
          scaleFactor
        }
      }
    }));
  };

  // Create value object
  const value = {
    showFontSizeTooltips,
    showDivOutlines,
    typographyAdjustment,
    debugInfo,
    toggleFontSizeTooltips,
    toggleDivOutlines,
    toggleTypographyAdjustment,
    setTypographyScale,
    toggleVariantAdjustment,
    setVariantScale,
  };

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
}

// Component to inject debug styles
function DebugStyles({
  showFontSizeTooltips,
  showDivOutlines
}: {
  showFontSizeTooltips: boolean;
  showDivOutlines: boolean;
}) {
  return (
    <style jsx global>{`
      ${showDivOutlines ? `
        [data-debug-outline] {
          outline: 2px dashed rgba(255, 0, 0, 0.5) !important;
          outline-offset: -2px;
          position: relative;
        }

        [data-debug-outline]:hover::after {
          content: attr(data-debug-outline);
          position: absolute;
          bottom: -20px;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 2px 4px;
          font-size: 10px;
          border-radius: 2px;
          z-index: 9999;
        }
      ` : ''}

      ${showFontSizeTooltips ? `
        /* This will be handled by JavaScript in the FontSizeDebugger component */
        .debug-font-tooltip {
          position: absolute;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 2px 4px;
          border-radius: 2px;
          font-size: 10px;
          pointer-events: none;
          z-index: 9999;
          white-space: nowrap;
        }
      ` : ''}
    `}</style>
  );
}
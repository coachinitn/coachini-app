import React, { useState, useEffect, useRef, useCallback } from 'react';
import { responsive as originalResponsive, ResponsiveVariant } from '../utils/responsive';

/**
 * Parses a width string (e.g., "200px", "30rem", "20em") into a numerical pixel value.
 * For 'rem' units, it uses the root document element's font size.
 * For 'em' units, it uses the provided element's font size if available, otherwise falls back to the root font size.
 * Unitless numbers are assumed to be pixels.
 * @param widthStr The width string to parse.
 * @param element Optional HTML element, used for 'em' unit calculation.
 * @returns The width in pixels, or 0 if parsing fails.
 */
const parseWidthToPx = (widthStr: string, element?: HTMLElement | null): number => {
  if (typeof document === 'undefined') return 0; // Guard for SSR or non-browser environments

  if (widthStr.endsWith('px')) {
    return parseFloat(widthStr);
  }
  if (widthStr.endsWith('rem')) {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return parseFloat(widthStr) * rootFontSize;
  }
  if (widthStr.endsWith('em')) {
    if (element) {
      const elementFontSize = parseFloat(getComputedStyle(element).fontSize);
      return parseFloat(widthStr) * elementFontSize;
    }
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return parseFloat(widthStr) * rootFontSize;
  }
  const num = parseFloat(widthStr);
  return isNaN(num) ? 0 : num;
};

interface UseResponsiveClassesOptions {
  /** Base CSS classes to apply consistently. */
  baseClass?: string;
  /** 
   * Object mapping viewport breakpoints (e.g., 'sm', '1024px') to CSS classes. 
   * Uses the original `responsive` utility's logic. 
   */
  viewportVariants?: Partial<Record<ResponsiveVariant | string, string>>;
  /** 
   * Object mapping container width thresholds (e.g., '200px', '30rem') to CSS classes.
   * Classes are applied if the referenced element's width is greater than or equal to the threshold.
   */
  containerVariants?: Record<string, string>;
  /**
   * Object mapping CSS class strings to a boolean or a function.
   * If the value is true or the function returns true, the class string (key) is applied.
   * The function receives the current container width (in pixels) as an argument, or null if not available.
   * e.g., `{ 'is-active': isActive, 'text-large': (width) => width && width > 500 }`
   */
  dynamicClasses?: Record<string, boolean | ((containerWidth: number | null) => boolean)>;
}

/**
 * A React hook that dynamically generates a string of CSS classes based on viewport size,
 * referenced element's width (container queries), and dynamic boolean conditions.
 *
 * @param ref A React ref to the HTML element whose width will be monitored for container-based classes.
 *            Can be null if only using viewport and/or dynamicClasses without container width dependency.
 * @param options Configuration object for base, viewport, container, and dynamic classes.
 * @returns A string of combined CSS classes to be applied to an element.
 */
export function useResponsiveClasses(
  ref: React.RefObject<HTMLElement | null>,
  options: UseResponsiveClassesOptions
): string {
  const { baseClass = '', viewportVariants = {}, containerVariants = {}, dynamicClasses = {} } = options;

  const [currentContainerWidth, setCurrentContainerWidth] = useState<number | null>(null);
  const [activeContainerClasses, setActiveContainerClasses] = useState<string>('');

  const viewportClassString = originalResponsive(baseClass, viewportVariants);

  const updateContainerClasses = useCallback((width: number | null, element: HTMLElement | null) => {
    setCurrentContainerWidth(width);
    if (width === null || !element || Object.keys(containerVariants).length === 0) {
      setActiveContainerClasses('');
      return;
    }

    let classesToApply: string[] = [];
    const sortedVariantKeys = Object.keys(containerVariants).sort((a, b) => {
      return parseWidthToPx(a, element) - parseWidthToPx(b, element);
    });

    for (const widthKey of sortedVariantKeys) {
      if (width >= parseWidthToPx(widthKey, element)) {
        classesToApply.push(containerVariants[widthKey]);
      }
    }
    setActiveContainerClasses(classesToApply.join(' '));
  }, [containerVariants]);

  useEffect(() => {
    const element = ref.current;
    if (!element || Object.keys(containerVariants).length === 0) {
      // Ensure states are reset if element or variants are not present
      if (currentContainerWidth !== null) setCurrentContainerWidth(null);
      if (activeContainerClasses !== '') setActiveContainerClasses('');
      return;
    }

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        updateContainerClasses(entry.contentRect.width, element);
      }
    });

    observer.observe(element);
    // Initial check for width and classes
    updateContainerClasses(element.getBoundingClientRect().width, element);

    return () => {
      observer.disconnect();
    };
  // updateContainerClasses is memoized and its dependency `containerVariants` is listed here indirectly.
  // Direct dependencies are ref and containerVariants (which affects updateContainerClasses).
  }, [ref, containerVariants, updateContainerClasses, currentContainerWidth, activeContainerClasses]);

  const dynamicClassArray: string[] = [];
  if (typeof dynamicClasses === 'object' && dynamicClasses !== null) {
    for (const className in dynamicClasses) {
      if (Object.prototype.hasOwnProperty.call(dynamicClasses, className)) {
        const condition = dynamicClasses[className];
        let shouldApply = false;
        if (typeof condition === 'function') {
          shouldApply = condition(currentContainerWidth);
        } else {
          shouldApply = !!condition; // Ensure boolean coercion for non-function values
        }
        if (shouldApply) {
          dynamicClassArray.push(className);
        }
      }
    }
  }
  const dynamicClassString = dynamicClassArray.join(' ');

  return [viewportClassString, activeContainerClasses, dynamicClassString]
    .filter(Boolean)
    .join(' ');
}

export default useResponsiveClasses; 
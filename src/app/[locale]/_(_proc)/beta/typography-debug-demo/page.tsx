'use client';

import React, { useState, useEffect } from 'react';
import { cn, typography, TypographyVariant } from '@/core/utils';
import { useDebug, TAILWIND_FONT_SIZES } from '@/core/providers/debug-provider';
import { TypographyVisualizer } from '../../../../../design-system/ui/components/debug/TypographyVisualizer';

// Import VARIANT_DEFAULT_SIZES
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

// Debug component to show active adjustments
function TypographyDebugInfo() {
  const { typographyAdjustment, debugInfo } = useDebug();
  const [sizeInfo, setSizeInfo] = useState<{
    sizes: { variant: string; original: string; adjusted: string }[];
  }>({
    sizes: []
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh of the component
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Use useRef to track previous state and avoid unnecessary updates
  const prevEnabledRef = React.useRef(typographyAdjustment.enabled);
  const prevScaleRef = React.useRef(typographyAdjustment.scale);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Only update if enabled state changed, scale changed, or refresh was triggered
    const enabledChanged = prevEnabledRef.current !== typographyAdjustment.enabled;
    const scaleChanged = prevScaleRef.current !== typographyAdjustment.scale;

    if (!enabledChanged && !scaleChanged && refreshKey === 0) {
      return;
    }

    // Update refs
    prevEnabledRef.current = typographyAdjustment.enabled;
    prevScaleRef.current = typographyAdjustment.scale;

    // Sample sizes from different variants
    const elements = document.querySelectorAll('[data-typography]');
    console.log(`DebugInfo found ${elements.length} typography elements`);

    const sizes = Array.from(elements).map(el => {
      const element = el as HTMLElement;
      const variant = element.getAttribute('data-typography') || 'unknown';
      const computedStyle = window.getComputedStyle(element);
      const adjustedSize = computedStyle.fontSize;
      const originalSize = element.getAttribute('data-original-font-size') || computedStyle.fontSize;

      return {
        variant,
        original: originalSize,
        adjusted: adjustedSize
      };
    });

    setSizeInfo({ sizes });

  }, [typographyAdjustment.enabled, typographyAdjustment.scale, refreshKey]);

  if (!typographyAdjustment.enabled) {
    return (
      <div className="p-4 mb-6 border border-yellow-200 rounded-md bg-yellow-50">
        <p className="text-yellow-800">
          Typography adjustment is currently <strong>disabled</strong>. Enable it in the config sidebar.
        </p>
      </div>
    );
  }

  // Group sizes by variant
  const sizesByVariant: Record<string, { original: string; adjusted: string }[]> = {};
  sizeInfo.sizes.forEach(size => {
    if (!sizesByVariant[size.variant]) {
      sizesByVariant[size.variant] = [];
    }
    sizesByVariant[size.variant].push({
      original: size.original,
      adjusted: size.adjusted
    });
  });

  return (
    <div className="p-4 mb-6 border border-green-200 rounded-md bg-green-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-green-800">Typography Adjustment Active</h3>
        <button
          onClick={handleRefresh}
          className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded hover:bg-green-200"
        >
          Refresh Info
        </button>
      </div>
      <p className="mb-2 text-green-700">
        Found {debugInfo.total} typography elements, {debugInfo.adjusted} with adjustments applied.
        Global scale: {typographyAdjustment.scale.toFixed(2)}×
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-green-100">
              <th className="p-1 text-left">Variant</th>
              <th className="p-1 text-left">Scale</th>
              <th className="p-1 text-left">Status</th>
              <th className="p-1 text-left">Sample</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(typographyAdjustment.variants).map(([variant, settings]) => {
              const samples = sizesByVariant[variant] || [];
              const hasSamples = samples.length > 0;

              return (
                <tr key={variant} className="border-t border-green-100">
                  <td className="p-1">{variant}</td>
                  <td className="p-1 font-mono">{settings.scaleFactor.toFixed(2)}×</td>
                  <td className="p-1">
                    {settings.enabled ?
                      <span className="inline-block px-1 bg-green-100 rounded">Active</span> :
                      <span className="text-gray-400">Disabled</span>
                    }
                  </td>
                  <td className="p-1">
                    {hasSamples && (
                      <span className="text-green-700">
                        {samples[0].original} → {samples[0].adjusted}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TypographyDebugPanel() {
  const { typographyAdjustment } = useDebug();
  const [appliedStyles, setAppliedStyles] = useState<Record<string, {
    variant: string;
    computedSize: string;
    expectedSize: string;
  }>>({});

  useEffect(() => {
    if (typeof document === 'undefined') return;
    setTimeout(() => {
      // Find all typography elements
      const elements = document.querySelectorAll('[data-typography]');
      const styleInfo: Record<string, any> = {};

      elements.forEach((el) => {
        const element = el as HTMLElement;
        const variant = element.getAttribute('data-typography');
        if (!variant) return;

        // Get computed style
        const computedStyle = window.getComputedStyle(element);
        const computedSize = computedStyle.fontSize;

        // Calculate expected size based on our math
        const variantSettings = typographyAdjustment.variants[variant as TypographyVariant];
        if (!variantSettings) return;

        // This should match the debug provider calculation
        const defaultClass = VARIANT_DEFAULT_SIZES[variant as TypographyVariant] || 'text-base';
        const baseSize = TAILWIND_FONT_SIZES[defaultClass] || 16;
        const totalScale = typographyAdjustment.scale * variantSettings.scaleFactor;
        const expectedSize = `${Math.round(baseSize * totalScale)}px`;

        // Store for display
        styleInfo[variant] = {
          variant,
          computedSize,
          expectedSize
        };
      });

      setAppliedStyles(styleInfo);
    }, 500); // Give time for styles to be applied
  }, [typographyAdjustment]);

  if (!typographyAdjustment.enabled) return null;

  return (
    <div className="p-4 mb-6 border border-purple-200 rounded-md bg-purple-50 leading-0">
      <h3 className="mb-2 font-medium text-purple-800">Applied Styles Debug</h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-purple-100">
            <th className="p-1 text-left">Variant</th>
            <th className="p-1 text-left">Computed Size</th>
            <th className="p-1 text-left">Expected Size</th>
            <th className="p-1 text-left">Match?</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(appliedStyles).map((info) => {
            const isMatch = info.computedSize === info.expectedSize;

            return (
              <tr key={info.variant} className="border-t border-purple-100">
                <td className="p-1">{info.variant}</td>
                <td className="p-1 font-mono">{info.computedSize}</td>
                <td className="p-1 font-mono">{info.expectedSize}</td>
                <td className="p-1">
                  {isMatch ?
                    <span className="text-green-600">✓</span> :
                    <span className="text-red-600">✗</span>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function TypographyDebugDemoPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className={cn(typography('h1'), 'mb-8')}>Typography Adjustment Demo</h1>

      <div className="max-w-3xl mx-auto">
        <TypographyDebugInfo />
        <TypographyDebugPanel />

        <div className="p-6 mb-8 border rounded-lg">
          <h2 className={cn(typography('h2'), 'mb-4')}>How to Use</h2>
          <ol className="ml-5 space-y-3 list-decimal">
            <li>Open the configuration sidebar by clicking the gear icon on the right edge</li>
            <li>Find the "Typography Adjustments" section</li>
            <li>Toggle the feature on to enable size adjustments</li>
            <li>Use the global scale slider to adjust all typography sizes at once</li>
            <li>Expand "Typography Variants" to adjust individual variants</li>
            <li>Changes are reflected in real-time on this page</li>
          </ol>
        </div>

        <div className="mb-8">
          <TypographyVisualizer />
        </div>

        <div className="grid grid-cols-1 gap-8 mb-10 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className={cn(typography('h2'), 'mb-4')}>Heading Examples</h2>

            <div className="p-4 space-y-4 border rounded-lg">
              <h1 className={typography('h1')}>Heading 1</h1>
              <h2 className={typography('h2')}>Heading 2</h2>
              <h3 className={typography('h3')}>Heading 3</h3>
              <h4 className={typography('h4')}>Heading 4</h4>
              <h5 className={typography('h5')}>Heading 5</h5>
              <h6 className={typography('h6')}>Heading 6</h6>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className={cn(typography('h2'), 'mb-4')}>Text Examples</h2>

            <div className="p-4 space-y-6 border rounded-lg">
              <div>
                <h4 className={typography('h4')}>Standard Paragraph</h4>
                <p className={typography('p')}>
                  This is a standard paragraph of text using the typography utility.
                  Try adjusting the size to see how it changes.
                </p>
              </div>

              <div>
                <h4 className={typography('h4')}>Lead Text</h4>
                <p className={typography('lead')}>
                  This is lead text, which is typically larger and used for introductions.
                </p>
              </div>

              <div>
                <h4 className={typography('h4')}>Large Text</h4>
                <p className={typography('large')}>
                  This is large text, which is used for emphasis.
                </p>
              </div>

              <div>
                <h4 className={typography('h4')}>Small Text</h4>
                <p className={typography('small')}>
                  This is small text, used for less important information.
                </p>
              </div>

              <div>
                <h4 className={typography('h4')}>Muted Text</h4>
                <p className={typography('muted')}>
                  This is muted text, typically used for secondary information.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className={cn(typography('h2'), 'mb-6')}>Typography in Context</h2>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className={typography('h1')}>Responsive Typography</h1>

            <p className={typography('lead')}>
              This demo showcases the typography adjustment feature where you can dynamically
              modify font sizes during development.
            </p>

            <p className={typography('p')}>
              The real power of this tool is that it lets you quickly experiment with different
              font sizes without changing any code. You can adjust the global scale to see how
              your entire design looks with larger or smaller text, or fine-tune individual
              typography variants.
            </p>

            <h2 className={typography('h2')}>When to Use This Tool</h2>

            <p className={typography('p')}>
              This tool is particularly useful when you're:
            </p>

            <ul className="ml-5 space-y-2 list-disc">
              <li className={typography('p')}>Testing accessibility of your design with larger text</li>
              <li className={typography('p')}>Fine-tuning visual hierarchy</li>
              <li className={typography('p')}>Comparing different type scale options</li>
              <li className={typography('p')}>Demonstrating text size options to stakeholders</li>
            </ul>

            <h3 className={typography('h3')}>Implementation Details</h3>

            <p className={typography('p')}>
              Behind the scenes, this works by adding data attributes to elements using the typography
              utility, then using CSS variables to adjust their size at runtime. The changes are
              non-destructive and can be toggled on/off at any time.
            </p>

            <p className={typography('small')}>
              Note: This tool only affects elements that use the typography utility. Custom text
              styling with direct Tailwind classes won't be affected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
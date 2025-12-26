'use client';

import React, { useState, useEffect } from 'react';
import { useDebug, TAILWIND_FONT_SIZES } from '@/core/providers/debug-provider';
import { TypographyVariant } from '@/core/utils';

// Import VARIANT_DEFAULT_SIZES from debug-provider.tsx
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

export function TypographyAdjuster() {
  const {
    typographyAdjustment,
    toggleTypographyAdjustment,
    setTypographyScale,
    toggleVariantAdjustment,
    setVariantScale
  } = useDebug();

  const [expandedVariants, setExpandedVariants] = useState(false);

  // Calculate size in pixels - using the same logic as debug-provider
  const calculateSize = (variant: TypographyVariant, scale: number) => {
    // Get default class for this variant
    const defaultClass = VARIANT_DEFAULT_SIZES[variant];

    // Get pixel size for that class
    const baseSize = TAILWIND_FONT_SIZES[defaultClass] || 16;

    // Calculate total scale
    const globalScale = typographyAdjustment.scale;
    const variantScale = typographyAdjustment.variants[variant]?.scaleFactor || 1;
    const totalScale = scale === 1 ? globalScale * variantScale : globalScale * scale;

    // Return rounded size
    return Math.round(baseSize * totalScale);
  };

  // Format as pixel value
  const formatPixels = (variant: TypographyVariant, scale: number = 1) => {
    return `${calculateSize(variant, scale)}px`;
  };

  // Calculate global size average (for display)
  const calculateGlobalSize = () => {
    const variants: TypographyVariant[] = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'lead', 'large', 'small', 'muted'
    ];

    const totalPixels = variants.reduce((sum, variant) => {
      return sum + calculateSize(variant, 1);
    }, 0);

    return Math.round(totalPixels / variants.length);
  };

  // All typography variants we support adjusting
  const variants: TypographyVariant[] = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'lead', 'large', 'small', 'muted'
  ];

  return (
    <div className="mb-6">
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Typography Adjustments</h3>

      <div className="space-y-4">
        {/* Main toggle */}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={typographyAdjustment.enabled}
              onChange={toggleTypographyAdjustment}
              className="w-4 h-4 mr-2 rounded form-checkbox"
            />
            <span className="text-sm">Adjust Typography Sizes</span>
          </label>
          <span className="text-xs font-medium">{calculateGlobalSize()}px avg</span>
        </div>

        {/* Global scale slider */}
        {typographyAdjustment.enabled && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Global Scale</span>
              <span className="font-mono text-xs font-medium">{(typographyAdjustment.scale).toFixed(2)}×</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={typographyAdjustment.scale}
              onChange={(e) => setTypographyScale(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary"
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0.5×</span>
              <span>1.0×</span>
              <span>2.0×</span>
            </div>
          </div>
        )}

        {/* Variants toggle */}
        {typographyAdjustment.enabled && (
          <div>
            <button
              onClick={() => setExpandedVariants(!expandedVariants)}
              className="flex items-center justify-between w-full py-2 text-sm text-left text-muted-foreground hover:text-foreground"
            >
              <span>Typography Variants</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 transition-transform ${expandedVariants ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Variant adjustments */}
            {expandedVariants && (
              <div className="p-3 mt-2 space-y-3 rounded-md bg-secondary/30">
                {variants.map((variant) => {
                  const variantSettings = typographyAdjustment.variants[variant];
                  if (!variantSettings) return null;

                  return (
                    <div key={variant} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={variantSettings.enabled}
                            onChange={() => toggleVariantAdjustment(variant)}
                            className="w-3 h-3 mr-2 rounded form-checkbox"
                          />
                          <span className="text-sm">{variant}</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{variantSettings.scaleFactor.toFixed(2)}×</span>
                          <span className="text-xs font-medium">{formatPixels(variant)}</span>
                        </div>
                      </div>

                      {variantSettings.enabled && (
                        <div className="pl-5">
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.05"
                            value={variantSettings.scaleFactor}
                            onChange={(e) => setVariantScale(variant, parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="mt-1 text-xs text-muted-foreground">
                            Base: {TAILWIND_FONT_SIZES[VARIANT_DEFAULT_SIZES[variant]]}px ×
                            Global: {typographyAdjustment.scale.toFixed(2)} ×
                            Variant: {variantSettings.scaleFactor.toFixed(2)} =
                            {calculateSize(variant, 1)}px
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
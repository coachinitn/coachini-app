/**
 * Palette Generator Demo Page
 * 
 * Demonstrates the palette generation capabilities
 */
import { generateColorScale, generateSemanticPalette, getColorValue } from '@/design-system/tokens';
import React from 'react';

export default function PaletteDemo() {
  // Generate a color scale from primary color
  const primaryColor = '#3b82f6'; // Primary blue
  const primaryScale = generateColorScale(primaryColor, { steps: 9 });
  
  // Generate a color scale from secondary color
  const secondaryColor = '#10b981'; // Green
  const secondaryScale = generateColorScale(secondaryColor, { steps: 9 });
  
  // Generate a color scale from accent color
  const accentColor = '#8b5cf6'; // Purple
  const accentScale = generateColorScale(accentColor, { steps: 9 });
  
  // Generate semantic palettes for light and dark modes
  const lightPalette = generateSemanticPalette(primaryColor, secondaryColor, accentColor, {
    darkMode: false
  });
  
  const darkPalette = generateSemanticPalette(primaryColor, secondaryColor, accentColor, {
    darkMode: true
  });
  
  return (
    <div className="p-8 space-y-12">
      <div>
        <h1 className="mb-4 text-2xl font-bold">Palette Generator Demo</h1>
        <p className="mb-8 text-gray-600">
          This page demonstrates the palette generation capabilities of the design system.
        </p>
      </div>
      
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Primary Color Scale</h2>
        <div className="grid grid-cols-9 gap-2">
          {primaryScale.map((color, index) => (
            <div key={`primary-${index}`} className="space-y-2">
              <div 
                className="w-full h-16 border border-gray-200 rounded-md" 
                style={{ backgroundColor: color }}
              />
              <div className="text-xs text-center">{color}</div>
              <div className="text-xs font-medium text-center">{index + 1}00</div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Secondary Color Scale</h2>
        <div className="grid grid-cols-9 gap-2">
          {secondaryScale.map((color, index) => (
            <div key={`secondary-${index}`} className="space-y-2">
              <div 
                className="w-full h-16 border border-gray-200 rounded-md" 
                style={{ backgroundColor: color }}
              />
              <div className="text-xs text-center">{color}</div>
              <div className="text-xs font-medium text-center">{index + 1}00</div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Accent Color Scale</h2>
        <div className="grid grid-cols-9 gap-2">
          {accentScale.map((color, index) => (
            <div key={`accent-${index}`} className="space-y-2">
              <div 
                className="w-full h-16 border border-gray-200 rounded-md" 
                style={{ backgroundColor: color }}
              />
              <div className="text-xs text-center">{color}</div>
              <div className="text-xs font-medium text-center">{index + 1}00</div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Light Mode Semantic Colors</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(lightPalette).map(([key, value]) => {
            const colorValue = getColorValue(value);
            return (
              <div key={`light-${key}`} className="space-y-2">
                <div 
                  className="flex items-end w-full h-16 p-2 border border-gray-200 rounded-md" 
                  style={{ backgroundColor: colorValue }}
                >
                  <span className={colorValue.startsWith('#fff') || colorValue.startsWith('#f') ? 'text-black' : 'text-white'}>
                    {key}
                  </span>
                </div>
                <div className="text-xs">{colorValue}</div>
              </div>
            );
          })}
        </div>
      </section>
      
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Dark Mode Semantic Colors</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(darkPalette).map(([key, value]) => {
            const colorValue = getColorValue(value);
            return (
              <div key={`dark-${key}`} className="space-y-2">
                <div 
                  className="flex items-end w-full h-16 p-2 border border-gray-200 rounded-md" 
                  style={{ backgroundColor: colorValue }}
                >
                  <span className={colorValue.startsWith('#fff') || colorValue.startsWith('#f') ? 'text-black' : 'text-white'}>
                    {key}
                  </span>
                </div>
                <div className="text-xs">{colorValue}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
} 
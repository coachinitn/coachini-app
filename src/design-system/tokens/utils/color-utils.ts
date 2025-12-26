/**
 * Color utilities for the design system
 * Provides conversion between color formats
 */
import { ColorFormat, SemanticColorVariants, ComponentColors } from '../types';

/**
 * Basic color parser utility
 */
export function parseColor(color: string): { r: number; g: number; b: number; a: number } {
  // Default to black if parsing fails
  const fallback = { r: 0, g: 0, b: 0, a: 1 };
  
  // Handle hex format
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    
    // Convert 3-digit hex to 6-digit
    const fullHex = hex.length === 3
      ? hex.split('').map(c => c + c).join('')
      : hex;
    
    // Parse hex values
    try {
      const r = parseInt(fullHex.slice(0, 2), 16);
      const g = parseInt(fullHex.slice(2, 4), 16);
      const b = parseInt(fullHex.slice(4, 6), 16);
      const a = fullHex.length === 8 ? parseInt(fullHex.slice(6, 8), 16) / 255 : 1;
      
      return { r, g, b, a };
    } catch (e) {
      console.warn(`Failed to parse hex color: ${color}`);
      return fallback;
    }
  }
  
  // Handle rgb/rgba format
  if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/);
    if (match) {
      const [, r, g, b, a = '1'] = match;
      return {
        r: parseInt(r, 10),
        g: parseInt(g, 10),
        b: parseInt(b, 10),
        a: parseFloat(a)
      };
    }
  }
  
  // Add other format parsing as needed
  
  console.warn(`Unsupported color format: ${color}`);
  return fallback;
}

/**
 * Convert RGB values to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number = 0;
  let s: number = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Convert HSL values to RGB
 */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
}

/**
 * Simple approximation of RGB to OKLCH conversion
 * For production use, consider a proper color library
 */
export function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  // This is a simplified conversion - in production use a proper color library
  // Convert RGB to a rough OKLCH approximation
  
  // First convert to HSL as an intermediate step
  const [h, s, l] = rgbToHsl(r, g, b);
  
  // Approximate lightness - OKLCH lightness is perceptual
  const lightness = l / 100;
  
  // Approximate chroma based on saturation
  const chroma = s / 100 * 0.3; // Scaling factor for reasonable chroma values
  
  // Hue remains mostly the same, just in degrees
  const hue = h;
  
  return [lightness, chroma, hue];
}

/**
 * Convert a color to a specific format
 */
export function convertColorFormat(color: string | SemanticColorVariants | ComponentColors | Record<string, string> | undefined, format: ColorFormat): string {
  // If we get an object or undefined, extract the string color value first
  if (typeof color !== 'string') {
    color = getColorValue(color);
  }
  
  if (!color) return '';
  
  const { r, g, b, a } = parseColor(color);
  
  switch (format) {
    case 'hex':
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    
    case 'rgb':
      return a < 1
        ? `rgba(${r}, ${g}, ${b}, ${a})`
        : `rgb(${r}, ${g}, ${b})`;
    
    case 'hsl': {
      const [h, s, l] = rgbToHsl(r, g, b);
      return a < 1
        ? `hsla(${h}, ${s}%, ${l}%, ${a})`
        : `hsl(${h}, ${s}%, ${l}%)`;
    }
    
    case 'oklch': {
      const [lightness, chroma, hue] = rgbToOklch(r, g, b);
      return a < 1
        ? `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(3)} / ${a})`
        : `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(3)})`;
    }
    
    default:
      return color;
  }
}

/**
 * Lighten a color by a percentage amount
 * @param color The color to lighten
 * @param amount The percentage amount to lighten (0-100)
 * @returns The lightened color
 */
export function lighten(color: string, amount: number): string {
  // Parse the input color
  const { r, g, b, a } = parseColor(color);
  
  // Convert to HSL
  const [h, s, l] = rgbToHsl(r, g, b);
  
  // Calculate new lightness, clamping between 0 and 100
  const newLightness = Math.min(100, l + amount);
  
  // Convert back to RGB
  const [newR, newG, newB] = hslToRgb(h, s, newLightness);
  
  // Return in the same format
  if (color.startsWith('#')) {
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  } else if (color.startsWith('rgb')) {
    return a < 1
      ? `rgba(${newR}, ${newG}, ${newB}, ${a})`
      : `rgb(${newR}, ${newG}, ${newB})`;
  } else if (color.startsWith('hsl')) {
    return a < 1
      ? `hsla(${h}, ${s}%, ${newLightness}%, ${a})`
      : `hsl(${h}, ${s}%, ${newLightness}%)`;
  } else {
    // For other formats, convert to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
}

/**
 * Darken a color by a percentage amount
 * @param color The color to darken
 * @param amount The percentage amount to darken (0-100)
 * @returns The darkened color
 */
export function darken(color: string, amount: number): string {
  // Parse the input color
  const { r, g, b, a } = parseColor(color);
  
  // Convert to HSL
  const [h, s, l] = rgbToHsl(r, g, b);
  
  // Calculate new lightness, clamping between 0 and 100
  const newLightness = Math.max(0, l - amount);
  
  // Convert back to RGB
  const [newR, newG, newB] = hslToRgb(h, s, newLightness);
  
  // Return in the same format
  if (color.startsWith('#')) {
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  } else if (color.startsWith('rgb')) {
    return a < 1
      ? `rgba(${newR}, ${newG}, ${newB}, ${a})`
      : `rgb(${newR}, ${newG}, ${newB})`;
  } else if (color.startsWith('hsl')) {
    return a < 1
      ? `hsla(${h}, ${s}%, ${newLightness}%, ${a})`
      : `hsl(${h}, ${s}%, ${newLightness}%)`;
  } else {
    // For other formats, convert to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
}

/**
 * Adjust the transparency of a color
 * @param color The color to adjust
 * @param amount The amount to make transparent (0-1)
 * @returns The color with adjusted transparency
 */
export function transparentize(color: string, amount: number): string {
  // Parse the input color
  const { r, g, b, a } = parseColor(color);
  
  // Calculate new alpha
  const newAlpha = Math.max(0, Math.min(1, a * amount));
  
  // Return with new alpha
  return `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
}

/**
 * Extract a color value from a theme color object or string
 * 
 * @param color - Theme color value which could be a string or object
 * @param variant - Optional variant to extract (default, muted, etc.)
 * @returns The extracted color value as a string
 */
export function getColorValue(
  color: string | SemanticColorVariants | ComponentColors | Record<string, string> | undefined,
  variant?: string
): string {
  // If it's undefined, return an empty string
  if (color === undefined) {
    return '';
  }
  
  // If it's already a string, return it
  if (typeof color === 'string') {
    return color;
  }
  
  // If it's an object with a specific variant
  if (variant && variant in color) {
    const variantValue = color[variant];
    return typeof variantValue === 'string' ? variantValue : '';
  }
  
  // Look for default values in a case-insensitive way
  const keys = Object.keys(color);
  
  // Check for DEFAULT (uppercase) first
  if ('DEFAULT' in color && typeof color.DEFAULT === 'string') {
    return color.DEFAULT;
  }
  
  // Then check for default (lowercase)
  if ('default' in color && typeof color.default === 'string') {
    return color.default;
  }
  
  // As a fallback, look for any key that matches 'default' case-insensitively
  const defaultKey = keys.find(k => k.toLowerCase() === 'default');
  if (defaultKey && typeof color[defaultKey] === 'string') {
    return color[defaultKey] as string;
  }
  
  // For other objects, try to get the first string value
  const values = Object.values(color);
  const firstString = values.find(value => typeof value === 'string');
  return firstString || '';
}

/**
 * Convert CSS variable names to actual values
 * Handles both string color values and object-based theme values
 * 
 * @param value - CSS variable name or color value
 * @returns The processed color value
 */
export function processColorValue(value: string): string {
  if (!value) return '';
  
  // If it's a CSS variable reference, keep it as is
  if (value.startsWith('var(--')) {
    return value;
  }
  
  // If it's a direct color value, return it
  return value;
} 
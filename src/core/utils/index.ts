/**
 * Core utility exports
 */

// Export main classname utility
export  { cn } from './cn';
export type { ClassValue } from './cn';

// -------------------- //
// Responsive utilities
// -------------------- //
export { responsive, r } from './responsive';
export type { ResponsiveVariant } from './responsive';

// -------------------- //
// Typography utilities
// -------------------- //
export {
  typography, t,
  customTypography,
  TYPOGRAPHY_VARIANTS
} from './typography';
export type {
  TypographyVariant,
  TypographyOverrides,
  CustomTypographyConfig
} from './typography';

// -------------------- //
// Fluid typography utilities
// -------------------- //
export {
  fluidTypography, ft,
  fluidType,
  getFluidVariant,
  FLUID_VARIANTS
} from './fluid';
export type {
  FluidConfig,
  FluidVariant
} from './fluid';

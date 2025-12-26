import React from 'react';
import { cn, typography, TypographyVariant, TypographyOverrides } from '@/core/utils';

// Define the available HTML elements our Text component can render as
type AsElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Typography variant to use
   * @type {TypographyVariant}
   */
  variant?: TypographyVariant;
  
  /**
   * HTML element to render as (defaults to matching the variant, or 'p' for non-heading variants)
   */
  as?: AsElement;
  
  /**
   * Optional typography overrides for font size, weight, etc.
   */
  overrides?: TypographyOverrides;
  
  /**
   * Whether to truncate text with ellipsis
   */
  truncate?: boolean;
  
  /**
   * Children content
   */
  children?: React.ReactNode;
}

/**
 * Text component that applies typography styles from the design system
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ 
    variant = 'p', 
    as, 
    overrides, 
    truncate, 
    className, 
    children, 
    ...props 
  }, ref) => {
    // Default the element based on the variant
    const Component = as || 
      (variant.startsWith('h') && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant) 
        ? variant 
        : 'p') as AsElement;
      
    // Apply the typography styles
    const typographyClasses = typography(variant, overrides);
    
    return (
      <Component
        ref={ref as any}
        className={cn(
          typographyClasses,
          truncate && 'truncate',
          className
        )}
        data-typography={variant}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

// ============================================
// Composition Helpers
// ============================================
type HeadingProps = Omit<TextProps, 'variant'>;

export const H1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => <Text variant="h1" ref={ref as any} {...props} />
);
H1.displayName = 'H1';

export const H2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => <Text variant="h2" ref={ref as any} {...props} />
);
H2.displayName = 'H2';

export const H3 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => <Text variant="h3" ref={ref as any} {...props} />
);
H3.displayName = 'H3';

export const H4 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => <Text variant="h4" ref={ref as any} {...props} />
);
H4.displayName = 'H4';

export const H5 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => <Text variant="h5" ref={ref as any} {...props} />
);
H5.displayName = 'H5';

export const H6 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => <Text variant="h6" ref={ref as any} {...props} />
);
H6.displayName = 'H6';

// Paragraph and text variants composition helpers
export const Paragraph = React.forwardRef<HTMLParagraphElement, HeadingProps>(
  (props, ref) => <Text variant="p" ref={ref as any} {...props} />
);
Paragraph.displayName = 'Paragraph';

export const Lead = React.forwardRef<HTMLParagraphElement, HeadingProps>(
  (props, ref) => <Text variant="lead" ref={ref as any} {...props} />
);
Lead.displayName = 'Lead';

export const Large = React.forwardRef<HTMLElement, HeadingProps>(
  (props, ref) => <Text variant="large" ref={ref as any} {...props} />
);
Large.displayName = 'Large';

export const Small = React.forwardRef<HTMLElement, HeadingProps>(
  (props, ref) => <Text variant="small" ref={ref as any} {...props} />
);
Small.displayName = 'Small';

export const Muted = React.forwardRef<HTMLElement, HeadingProps>(
  (props, ref) => <Text variant="muted" ref={ref as any} {...props} />
);
Muted.displayName = 'Muted';

// Special purpose composition helpers
export const Label = React.forwardRef<HTMLLabelElement, HeadingProps & { htmlFor?: string }>(
  ({ as = 'label', ...props }, ref) => (
    <Text variant="small" as={as} ref={ref as any} {...props} />
  )
);
Label.displayName = 'Label';

// ============================================
// Figma-based Composition Helpers
// ============================================

// Figma Display Components
export const DisplayLarge = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h1', ...props }, ref) => <Text variant="figmaDisplayLarge" as={as} ref={ref as any} {...props} />
);
DisplayLarge.displayName = 'DisplayLarge';

export const DisplayMedium = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h1', ...props }, ref) => <Text variant="figmaDisplayMedium" as={as} ref={ref as any} {...props} />
);
DisplayMedium.displayName = 'DisplayMedium';

export const DisplaySmall = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h1', ...props }, ref) => <Text variant="figmaDisplaySmall" as={as} ref={ref as any} {...props} />
);
DisplaySmall.displayName = 'DisplaySmall';

// Figma Headline Components
export const HeadlineLarge = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h2', ...props }, ref) => <Text variant="figmaHeadlineLarge" as={as} ref={ref as any} {...props} />
);
HeadlineLarge.displayName = 'HeadlineLarge';

export const HeadlineMedium = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h2', ...props }, ref) => <Text variant="figmaHeadlineMedium" as={as} ref={ref as any} {...props} />
);
HeadlineMedium.displayName = 'HeadlineMedium';

export const HeadlineSmall = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h2', ...props }, ref) => <Text variant="figmaHeadlineSmall" as={as} ref={ref as any} {...props} />
);
HeadlineSmall.displayName = 'HeadlineSmall';

// Figma Title Components
export const TitleLarge = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h3', ...props }, ref) => <Text variant="figmaTitleLarge" as={as} ref={ref as any} {...props} />
);
TitleLarge.displayName = 'TitleLarge';

export const TitleMedium = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h3', ...props }, ref) => <Text variant="figmaTitleMedium" as={as} ref={ref as any} {...props} />
);
TitleMedium.displayName = 'TitleMedium';

export const TitleSmall = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h3', ...props }, ref) => <Text variant="figmaTitleSmall" as={as} ref={ref as any} {...props} />
);
TitleSmall.displayName = 'TitleSmall';

// Figma Label Components
type LabelHelperProps = HeadingProps & { htmlFor?: string };

export const LabelLarge = React.forwardRef<HTMLLabelElement, LabelHelperProps>(
  ({ as = 'label', ...props }, ref) => <Text variant="figmaLabelLarge" as={as} ref={ref as any} {...props} />
);
LabelLarge.displayName = 'LabelLarge';

export const LabelMedium = React.forwardRef<HTMLLabelElement, LabelHelperProps>(
  ({ as = 'label', ...props }, ref) => <Text variant="figmaLabelMedium" as={as} ref={ref as any} {...props} />
);
LabelMedium.displayName = 'LabelMedium';

export const LabelSmall = React.forwardRef<HTMLLabelElement, LabelHelperProps>(
  ({ as = 'label', ...props }, ref) => <Text variant="figmaLabelSmall" as={as} ref={ref as any} {...props} />
);
LabelSmall.displayName = 'LabelSmall';

// Figma Body Components
export const BodyLarge = React.forwardRef<HTMLParagraphElement, HeadingProps>(
  ({ as = 'p', ...props }, ref) => <Text variant="figmaBodyLarge" as={as} ref={ref as any} {...props} />
);
BodyLarge.displayName = 'BodyLarge';

export const BodyMedium = React.forwardRef<HTMLParagraphElement, HeadingProps>(
  ({ as = 'p', ...props }, ref) => <Text variant="figmaBodyMedium" as={as} ref={ref as any} {...props} />
);
BodyMedium.displayName = 'BodyMedium';

export const BodySmall = React.forwardRef<HTMLParagraphElement, HeadingProps>(
  ({ as = 'p', ...props }, ref) => <Text variant="figmaBodySmall" as={as} ref={ref as any} {...props} />
);
BodySmall.displayName = 'BodySmall';

// Figma Button Text Components
export const ButtonLarge = React.forwardRef<HTMLSpanElement, HeadingProps>(
  ({ as = 'span', ...props }, ref) => <Text variant="figmaButtonLarge" as={as} ref={ref as any} {...props} />
);
ButtonLarge.displayName = 'ButtonLarge';

export const ButtonMedium = React.forwardRef<HTMLSpanElement, HeadingProps>(
  ({ as = 'span', ...props }, ref) => <Text variant="figmaButtonMedium" as={as} ref={ref as any} {...props} />
);
ButtonMedium.displayName = 'ButtonMedium';

export const ButtonSmall = React.forwardRef<HTMLSpanElement, HeadingProps>(
  ({ as = 'span', ...props }, ref) => <Text variant="figmaButtonSmall" as={as} ref={ref as any} {...props} />
);
ButtonSmall.displayName = 'ButtonSmall';

export default Text; 
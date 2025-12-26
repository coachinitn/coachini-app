'use client';

import React from 'react';
import { cn } from '@/core/utils';
import { Slot } from '@radix-ui/react-slot';
import { useScrollLock } from 'usehooks-ts';

export interface ContentLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to be rendered inside the layout
   */
  children: React.ReactNode;
  
  /**
   * Whether to use the maximum width constraint
   * @default true
   */
  maxWidth?: boolean;
  
  /**
   * The maximum width for the container
   * @default 'lg'
   */
  maxWidthSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  /**
   * Whether to center the content horizontally
   * @default true
   */
  centered?: boolean;
  
  /**
   * Apply horizontal padding
   * @default true
   */
  paddingX?: boolean;
  
  /**
   * Apply vertical padding
   * @default true
   */
  paddingY?: boolean;
  
  /**
   * Override the default padding size
   * @default 'md'
   */
  paddingSize?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  
  /**
   * Makes the layout take full viewport height (100vh)
   * @default false
   */
  fullHeight?: boolean;

  /**
   * Prevents body scrolling when fullHeight is enabled
   * @default false
   */
  preventScroll?: boolean;
  
  /**
   * Asigns the rendered element
   * @default false
   */
  asChild?: boolean;
  
  /**
   * Whether to add a border around the content
   * @default false
   */
  bordered?: boolean;
  
  /**
   * Whether to add a background color
   * @default false
   */
  withBackground?: boolean;
  
  /**
   * Whether to add a rounded corner
   * @default false
   */
  rounded?: boolean;
  
  /**
   * Whether to add a shadow
   * @default false
   */
  withShadow?: boolean;
}

/**
 * ContentLayout - A flexible container component for page content with consistent spacing
 * 
 * This component wraps content with standardized padding and spacing. It supports
 * customization through props and can be extended with additional classes.
 */
export function ContentLayout({
  children,
  className,
  maxWidth = true,
  maxWidthSize = 'lg',
  centered = true,
  paddingX = true,
  paddingY = true,
  paddingSize = 'md',
  fullHeight = false,
  preventScroll = false,
  bordered = false,
  withBackground = false,
  rounded = false,
  withShadow = false,
  asChild = false,
  ...props
}: ContentLayoutProps) {
  // Maximum width classes based on size
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    'full': 'max-w-full',
  };
  
  // Padding classes based on size
  const paddingClasses = {
    none: '',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6 md:px-8',
    lg: 'px-6 sm:px-8 md:px-12 lg:px-16',
    xl: 'px-8 sm:px-12 md:px-16 lg:px-24',
  };
  
  // Padding Y classes based on size
  const paddingYClasses = {
    none: '',
    sm: 'py-2 sm:py-4',
    md: 'py-4 sm:py-6 md:py-8',
    lg: 'py-6 sm:py-8 md:py-12 lg:py-16',
    xl: 'py-8 sm:py-12 md:py-16 lg:py-24',
  };
  const Comp = asChild ? Slot : 'div';

  preventScroll && useScrollLock();
  return (
    <Comp      className={cn(
        // Base styles
        'w-full',
        
        // Full height (if enabled)
        // fullHeight && 'h-screen',
        
        // Max width constraint (if enabled)
        // maxWidth && maxWidthClasses[maxWidthSize],
        
        // Horizontal centering (if enabled)
        // centered && 'mx-auto',
        
        // Horizontal padding (if enabled)
        // paddingX && paddingClasses[paddingSize],
        
        // Vertical padding (if enabled)
        // paddingY && paddingYClasses[paddingSize],
        
        // Optional border
        // bordered && 'border border-border',
        
        // Optional background
        // withBackground && 'bg-card',
        
        // Optional rounded corners
        // rounded && 'rounded-lg',
        
        // Optional shadow
        // withShadow && 'shadow-md',
        
        // Custom classNames passed as prop
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default ContentLayout;

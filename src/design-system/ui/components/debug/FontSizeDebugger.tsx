'use client';

import React, { useEffect } from 'react';
import { useDebug } from '@/core/providers/debug-provider';

export function FontSizeDebugger() {
  const { showFontSizeTooltips } = useDebug();
  
  useEffect(() => {
    if (!showFontSizeTooltips || typeof window === 'undefined') return;
    
    // Elements we want to track for font size (text elements)
    const selector = 'p, h1, h2, h3, h4, h5, h6, span, div, a, button, li, label';
    
    // Mouse move handler
    const onMouseMove = (e: MouseEvent) => {
      const updateTooltip = (window as any).__debugUpdateTooltip;
      if (!updateTooltip) return;
      
      const target = e.target as HTMLElement;
      
      // Only process text nodes (elements with text content)
      if (target.matches(selector) && target.innerText?.trim()) {
        const computedStyle = window.getComputedStyle(target);
        const fontSize = computedStyle.fontSize;
        const fontWeight = computedStyle.fontWeight;
        const lineHeight = computedStyle.lineHeight;
        const fontFamily = computedStyle.fontFamily;
        
        // Update tooltip - use clientX/Y which are viewport-relative
        // This works better with fixed positioning during scrolling
        const tooltipX = e.clientX + 10;
        const tooltipY = e.clientY + 10;
        
        updateTooltip(
          true, 
          `${fontSize} / ${fontWeight} / ${lineHeight}`,
          tooltipX,
          tooltipY,
          fontFamily
        );
      } else {
        // Hide tooltip
        updateTooltip(false);
      }
    };
    
    // Add event listener
    document.addEventListener('mousemove', onMouseMove);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      // Hide tooltip when component unmounts
      const updateTooltip = (window as any).__debugUpdateTooltip;
      if (updateTooltip) {
        updateTooltip(false);
      }
    };
  }, [showFontSizeTooltips]);
  
  // This component doesn't render anything directly
  return null;
} 
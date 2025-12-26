'use client';

import React, { useState, useEffect } from 'react';
import { TAILWIND_FONT_SIZES } from '@/core/providers/debug-provider';

export function TypographyVisualizer() {
  const [elements, setElements] = useState<Array<{
    variant: string;
    size: string;
    defaultSize: string;
    element: string;
    hasDataAttr: boolean;
  }>>([]);
  
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Find all elements that might be typography elements
    const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div, span');
    
    const typographyElements: Array<{
      variant: string;
      size: string;
      defaultSize: string;
      element: string;
      hasDataAttr: boolean;
    }> = [];
    
    allElements.forEach(el => {
      const element = el as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      
      // First check for data attribute
      let hasDataAttr = element.hasAttribute('data-typography');
      let variant = element.getAttribute('data-typography') || '';
      
      // If no data attribute, check for _tp classes
      if (!hasDataAttr) {
        const classList = element.className.split(' ');
        for (const cls of classList) {
          if (cls.startsWith('_tp-')) {
            variant = cls.replace('_tp-', '');
            hasDataAttr = true;
            break;
          }
        }
      }
      
      // If we found a typography element, add it to our list
      if (hasDataAttr) {
        const computedStyle = window.getComputedStyle(element);
        const fontSize = computedStyle.fontSize;
        
        // Find the default size for this variant
        let defaultSize = '16px';
        if (variant === 'h1') defaultSize = `${TAILWIND_FONT_SIZES['text-4xl']}px`;
        else if (variant === 'h2') defaultSize = `${TAILWIND_FONT_SIZES['text-3xl']}px`;
        else if (variant === 'h3') defaultSize = `${TAILWIND_FONT_SIZES['text-2xl']}px`;
        else if (variant === 'h4') defaultSize = `${TAILWIND_FONT_SIZES['text-xl']}px`;
        else if (variant === 'h5') defaultSize = `${TAILWIND_FONT_SIZES['text-lg']}px`;
        else if (variant === 'h6') defaultSize = `${TAILWIND_FONT_SIZES['text-base']}px`;
        else if (variant === 'p') defaultSize = `${TAILWIND_FONT_SIZES['text-base']}px`;
        else if (variant === 'lead') defaultSize = `${TAILWIND_FONT_SIZES['text-xl']}px`;
        else if (variant === 'large') defaultSize = `${TAILWIND_FONT_SIZES['text-lg']}px`;
        else if (variant === 'small') defaultSize = `${TAILWIND_FONT_SIZES['text-sm']}px`;
        else if (variant === 'muted') defaultSize = `${TAILWIND_FONT_SIZES['text-sm']}px`;
        
        typographyElements.push({
          variant,
          size: fontSize,
          defaultSize,
          element: tagName,
          hasDataAttr
        });
      }
    });
    
    setElements(typographyElements);
  }, []);
  
  return (
    <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
      <h3 className="mb-2 text-sm font-medium text-amber-900">Typography Elements Visualizer</h3>
      <p className="mb-3 text-xs text-amber-800">
        Found {elements.length} typography elements on this page.
      </p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-amber-100">
              <th className="p-1 text-left">Element</th>
              <th className="p-1 text-left">Variant</th>
              <th className="p-1 text-left">Current Size</th>
              <th className="p-1 text-left">Default Size</th>
              <th className="p-1 text-left">Scale</th>
            </tr>
          </thead>
          <tbody>
            {elements.map((item, index) => {
              // Calculate scale relative to default size
              const currentPx = parseInt(item.size);
              const defaultPx = parseInt(item.defaultSize);
              const scale = defaultPx > 0 ? (currentPx / defaultPx).toFixed(2) : '1.00';
              
              return (
                <tr key={index} className="border-t border-amber-100">
                  <td className="p-1 font-mono">{item.element}</td>
                  <td className="p-1">{item.variant}</td>
                  <td className="p-1">{item.size}</td>
                  <td className="p-1">{item.defaultSize}</td>
                  <td className="p-1 font-mono">{scale}×</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-2 mt-3 text-xs rounded-md bg-amber-100">
        <p className="font-medium text-amber-800">Troubleshooting:</p>
        <ul className="pl-4 mt-1 space-y-1 list-disc text-amber-700">
          <li>Typography elements are detected by special marker classes</li>
          <li>Use the <code>typography()</code> utility to create typography elements</li>
          <li>Example: <code className="px-1 bg-amber-200">className=&#123;cn(typography('h1'))&#125;</code></li>
        </ul>
      </div>
    </div>
  );
} 
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/core/utils';

export function DebugTooltip() {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: string;
    x: number;
    y: number;
    additionalInfo?: string;
  }>({
    visible: false,
    content: '',
    x: 0,
    y: 0,
  });

  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const updateTooltip = (
    visible: boolean,
    content: string = '',
    x: number = 0,
    y: number = 0,
    additionalInfo?: string
  ) => {
    setTooltip({ visible, content, x, y, additionalInfo });
  };

  // Export the update function through window
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__debugUpdateTooltip = updateTooltip;
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__debugUpdateTooltip;
      }
    };
  }, []);

  // Handle scroll positioning
  useEffect(() => {
    if (typeof window === 'undefined' || !tooltip.visible) return;
    
    const handleScroll = () => {
      // Force re-render on scroll to maintain position
      setTooltip(prev => ({ ...prev }));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tooltip.visible]);

  // Only render in browser
  if (typeof document === 'undefined') return null;

  // Calculate the position in fixed coordinates (viewport-relative)
  // This ensures the tooltip stays with the element during scrolling
  const style = {
    left: `${tooltip.x}px`,
    top: `${tooltip.y}px`,
    transition: 'opacity 0.15s ease',
  };

  return createPortal(
    <div
      ref={tooltipRef}
      className={cn(
        'fixed z-[9999] rounded-md bg-black/80 px-3 py-1.5 text-xs text-white shadow-md pointer-events-none',
        tooltip.visible ? 'opacity-100' : 'opacity-0'
      )}
      style={style}
    >
      <div className="font-medium">{tooltip.content}</div>
      {tooltip.additionalInfo && (
        <div className="text-[10px] text-gray-300 max-w-[200px] truncate">
          {tooltip.additionalInfo}
        </div>
      )}
    </div>,
    document.body
  );
} 
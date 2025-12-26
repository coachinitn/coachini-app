'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/core/utils/cn';
import { ScrollArea } from '@/design-system/ui/base/scroll-area';

interface ScrollableContainerProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  header?: ReactNode;
  footer?: ReactNode;
  scrollbarColor?: string;
  scrollbarWidth?: string;
  scrollbarHeight?: string;
  trackColor?: string;
  trackClassName?: string;
  alwaysShowScrollbar?: boolean;
  type?: "auto" | "always" | "scroll" | "hover";
  /** Enable horizontal scrolling for wide content like tables */
  horizontalScroll?: boolean;
  /** Content styles for the viewport, useful for table overflow handling */
  viewportStyle?: React.CSSProperties;
}

export function ScrollableContainer({
  children,
  className,
  contentClassName = 'flex-1',
  header,
  footer,
  scrollbarColor,
  scrollbarWidth,
  scrollbarHeight,
  trackColor,
  trackClassName,
  alwaysShowScrollbar,
  type = "auto",
  horizontalScroll = true, // Enable horizontal scrolling by default
  viewportStyle,
}: ScrollableContainerProps) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col w-full">
        {header && (
          <div className="flex-shrink-0">
            {header}
          </div>
        )}
          <ScrollArea 
          className={cn(contentClassName, horizontalScroll && 'overflow-x-auto')}
          type={alwaysShowScrollbar ? "always" : type}
          scrollbarColor={scrollbarColor}
          scrollbarWidth={scrollbarWidth}
          scrollbarHeight={scrollbarHeight}
          trackColor={trackColor}
          trackClassName={trackClassName}
          style={viewportStyle}
        >
          <div className={horizontalScroll ? 'min-w-fit w-full' : undefined}>
            {children}
          </div>
        </ScrollArea>
        
        {footer && (
          <div className="flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScrollableContainer; 
import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/core/utils/cn';

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
	scrollbarColor?: string;
	scrollbarWidth?: string;
	scrollbarHeight?: string;
	trackColor?: string;
	trackClassName?: string;
	type?: "auto" | "always" | "scroll" | "hover";
}

const ScrollArea = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.Root>,
	ScrollAreaProps
>(({ className, children, scrollbarColor, scrollbarWidth, scrollbarHeight, trackColor, trackClassName, ...props }, ref) => (
	<ScrollAreaPrimitive.Root
		ref={ref}
		className={cn('relative overflow-hidden', className)}
		{...props}
	>
		<ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
			{children}
		</ScrollAreaPrimitive.Viewport>
		<ScrollBar 
			scrollbarColor={scrollbarColor} 
			scrollbarWidth={scrollbarWidth}
			scrollbarHeight={scrollbarHeight}
			trackColor={trackColor}
			trackClassName={trackClassName}
			orientation="vertical"
		/>
		<ScrollBar 
			scrollbarColor={scrollbarColor} 
			scrollbarWidth={scrollbarWidth}
			scrollbarHeight={scrollbarHeight}
			trackColor={trackColor}
			trackClassName={trackClassName}
			orientation="horizontal"
		/>
		<ScrollAreaPrimitive.Corner />
	</ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

interface ScrollBarProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
	scrollbarColor?: string;
	scrollbarWidth?: string;
	scrollbarHeight?: string;
	trackColor?: string;
	trackClassName?: string;
}

const ScrollBar = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	ScrollBarProps
>(({ className, orientation = 'vertical', scrollbarColor="bg-primary-80", scrollbarWidth, scrollbarHeight, trackColor="bg-primary-50/50", trackClassName, ...props }, ref) => (
	<ScrollAreaPrimitive.ScrollAreaScrollbar
		ref={ref}
		orientation={orientation}
		className={cn(
			'flex touch-none select-none transition-colors',
			orientation === 'vertical' && cn(
				'h-full border-l border-l-transparent p-[1px]',
				scrollbarWidth || 'w-2'
			),
			orientation === 'horizontal' && cn(
				'flex-col border-t border-t-transparent p-[1px]',
				scrollbarHeight || 'h-2'
			),
			trackColor,
			trackClassName,
			className,
		)}
		{...props}
	>
		<ScrollAreaPrimitive.ScrollAreaThumb 
			className={cn(
				"relative flex-1 rounded-full", 
				scrollbarColor
			)} 
		/>
	</ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };

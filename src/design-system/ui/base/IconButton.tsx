import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/core/utils';
import { Slot } from '@radix-ui/react-slot';
import { Loader } from 'lucide-react';

// Define the button variants using class-variance-authority
const iconButtonVariants = cva(
	// Base styles applied to all buttons
	'inline-flex items-center justify-center whitespace-nowrap rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none relative',
	{
		variants: {
			variant: {
				default: 'bg-blue-600 text-white hover:bg-blue-700',
				outline:
					'border border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50',
				ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
				secondary: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
			},
			size: {
				default: 'h-10 w-10',
				sm: 'h-8 w-8',
				lg: 'h-12 w-12',
			},
			shadow: {
				none: '',
				default: 'shadow-md',
				lg: 'shadow-lg',
			},
			cursorStyle: {
				default: 'cursor-default',
				pointer: 'cursor-pointer',
				notAllowed: 'cursor-not-allowed',
				wait: 'cursor-wait',
			},
			outlineWidth: {
				default: 'border',
				thin: 'border',
				medium: 'border-2',
				thick: 'border-4',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
			shadow: 'none',
			cursorStyle: 'pointer',
			outlineWidth: 'default',
		},
	},
);

export interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		Omit<VariantProps<typeof iconButtonVariants>, 'disabled'> {
	asChild?: boolean;
	preserveColorWhenDisabled?: boolean;
	isLoading?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
			className,
			variant,
			size,
			shadow,
			cursorStyle,
			outlineWidth,
			asChild = false,
			preserveColorWhenDisabled = false,
			disabled,
			children,
			isLoading = false,
			...props
		},
		ref,
	) => {
		// Configure cursor based on disabled state or loading state
		const isDisabled = disabled || isLoading;
		const effectiveCursorStyle =
			isDisabled && preserveColorWhenDisabled
				? 'notAllowed'
				: isLoading
				? 'wait'
				: cursorStyle;

		const Comp = asChild ? Slot : 'button';

		return (
			<Comp
				className={cn(
					iconButtonVariants({
						variant,
						size,
						shadow,
						cursorStyle: effectiveCursorStyle,
						outlineWidth: variant === 'outline' ? outlineWidth : undefined,
						className: cn(
							// Apply opacity conditionally for disabled state
							isDisabled && !preserveColorWhenDisabled ? 'opacity-50' : '',
							className,
						),
					}),
				)}
				disabled={isDisabled}
				ref={ref}
				{...props}
			>
				{isLoading ? (
					<Loader
						className="animate-spin"
						size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18}
					/>
				) : (
					children
				)}
			</Comp>
		);
	},
);

IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants };

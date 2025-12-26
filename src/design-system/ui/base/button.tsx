import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/core/utils';
import { Slot } from '@radix-ui/react-slot';
import { Loader } from 'lucide-react';

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none relative',
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
				default: 'h-10 px-6 py-2 text-sm',
				sm: 'h-8 px-4 py-1 text-sm',
				lg: 'h-12 px-8 py-3 text-base',
				icon: 'h-10 w-10',
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
			fullWidth: {
				true: 'w-full',
				false: '',
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
			fullWidth: false,
			outlineWidth: 'default',
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		Omit<VariantProps<typeof buttonVariants>, 'disabled'> {
	asChild?: boolean;
	icon?: React.ReactNode;
	iconPosition?: 'left' | 'right';
	preserveColorWhenDisabled?: boolean;
	isLoading?: boolean;
	loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			shadow,
			cursorStyle,
			fullWidth,
			outlineWidth,
			asChild = false,
			icon,
			iconPosition = 'left',
			preserveColorWhenDisabled = false,
			disabled,
			children,
			isLoading = false,
			loadingText,
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

		// Determine what content to display
		const buttonContent = (
			<>
				{isLoading && !loadingText && (
					<span className="absolute inset-0 flex items-center justify-center">
						<Loader
							className="animate-spin"
							size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
						/>
					</span>
				)}
				<span className={cn('flex justify-center items-center',isLoading && !loadingText && 'invisible')}>
					{icon && iconPosition === 'left' && (
						<span
							className={cn(
								'mr-2',
								size === 'sm' ? 'mr-1.5' : '',
								size === 'lg' ? 'mr-3' : '',
							)}
						>
							{icon}
						</span>
					)}
					{isLoading && loadingText ? loadingText : children}
					{icon && iconPosition === 'right' && (
						<span
							className={cn(
								'ml-2',
								size === 'sm' ? 'ml-1.5' : '',
								size === 'lg' ? 'ml-3' : '',
							)}
						>
							{icon}
						</span>
					)}
				</span>
			</>
		);

		return (
			<Comp
				className={cn(
					buttonVariants({
						variant,
						size,
						shadow,
						cursorStyle: effectiveCursorStyle,
						fullWidth,
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
				{buttonContent}
			</Comp>
		);
	},
);

Button.displayName = 'Button';

export { Button, buttonVariants };

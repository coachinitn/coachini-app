import React, { ReactNode } from 'react';
import { cn } from '@/core/utils/cn';
// Import the DynamicIcon component
import { DynamicIcon } from '@/design-system/features/supervisor/dashboard/DynamicIcon';

/**
 * Types of metric displays available
 */
export type MetricDisplayType = 'number' | 'ratio' | 'rating' | 'percentage';

/**
 * Secondary display content after the main metric value
 */
export interface MetricSecondaryDisplay {
	value: string | number;
	label?: string;
	type?: 'trend' | 'info' | 'status';
	positive?: boolean;
	date?: string;
	className?: string;
	unit?: string;
}

/**
 * Props for the MetricCard component
 */
export interface MetricCardProps {
	/** Title displayed at the top of the card */
	title: string;
	/** Primary value to display (should be raw number or string) */
	value: string | number;
	/** Type of metric being displayed, affects formatting */
	displayType?: MetricDisplayType;
	/** Unit to display after the value (e.g., '%', '$', 'Users') */
	unit?: string;
	/** Secondary content to show below the main value */
	secondaryDisplay?: MetricSecondaryDisplay;
	/** Icon to display next to the content */
	icon?: ReactNode;
	/** Icon name for dynamic icon rendering */
	iconName?: string;
	/** CSS class for the icon color */
	iconColor?: string;
	/** CSS class for the icon background */
	iconBgColor?: string;
	/** Legacy support for trend data */
	trend?: {
		value: string | number;
		label?: string;
		positive?: boolean;
	};
	/** Legacy support for subtitle */
	subtitle?: string | ReactNode;
	/** Additional CSS classes for the card */
	className?: string;
	/** CSS classes for the icon container */
	iconClassName?: string;
}

/**
 * Format a value based on its display type and unit
 */
function formatDisplayValue(
	value: string | number,
	displayType: MetricDisplayType,
	unit?: string,
): string {
	// If value is already a string with formatting, return as is
	if (
		typeof value === 'string' &&
		(value.includes('%') || value.includes('/'))
	) {
		return value;
	}

	switch (displayType) {
		case 'percentage':
			return `${value}${unit || '%'}`;
		case 'rating':
			return `${value}${unit || ''}`;
		case 'ratio':
			return `${value}${unit || ''}`;
		case 'number':
		default:
			return `${value}${unit ? ` ${unit}` : ''}`;
	}
}

/**
 * Format the secondary display content based on its type and values
 */
function formatSecondaryDisplay(secondary: MetricSecondaryDisplay): {
	content: ReactNode;
	className: string;
} {
	const baseClasses = 'text-sm';
	let content: ReactNode;
	let typeClass = '';

	// Default class based on type and positive/negative status
	if (secondary.type === 'trend') {
		typeClass = secondary.positive
			? 'text-success-500 dark:text-success-500'
			: 'text-destructive dark:text-destructive';
		// Format trend content with +/- prefix
		content = (
			<>
				{secondary.positive ? '+' : '-'}
				{secondary.value}
				{secondary.unit || ''} {secondary.label}
			</>
		);
	} else if (secondary.type === 'status') {
		typeClass = secondary.positive
			? 'text-success-500 dark:text-success-500'
			: 'text-amber-500 dark:text-amber-500';

		content = (
			<>
				{secondary.value}
				{secondary.unit || ''} {secondary.label}
			</>
		);
	} else {
		// Default 'info' type or any unspecified type
		typeClass = 'text-muted-foreground dark:text-muted-foreground';
		content = (
			<>
				{secondary.value}
				{secondary.unit || ''} {secondary.label}
			</>
		);
	}

	// Add date if provided
	if (secondary.date) {
		content = (
			<>
				{content}
				<div className="text-xs text-muted-foreground mt-0.5">
					since {secondary.date}
				</div>
			</>
		);
	}

	return {
		content,
		className: secondary.className
			? cn(baseClasses, typeClass, secondary.className)
			: cn(baseClasses, typeClass),
	};
}

/**
 * MetricCard component displays a key metric with optional icon and secondary data
 */
export function MetricCard({
	title,
	value,
	displayType = 'number',
	unit,
	secondaryDisplay,
	icon,
	trend, // Legacy support
	subtitle, // Legacy support
	className,
	iconClassName,
	iconName,
	iconColor,
	iconBgColor,
}: MetricCardProps) {
	// Format the display value with unit
	const formattedValue = formatDisplayValue(value, displayType, unit);
	// Handle legacy props
	const secondary =
		secondaryDisplay ||
		(trend
			? {
					value: trend.value,
					label: trend.label,
					type: 'trend' as const,
					positive: trend.positive,
			  }
			: typeof subtitle === 'string'
			? {
					value: subtitle,
					type: 'info' as const,
			  }
			: undefined);

	const formattedSecondary = secondary
		? formatSecondaryDisplay(secondary)
		: null;

	return (
		<div
			className={cn(
				'flex items-center w-full bg-card rounded-[20px] overflow-hidden shadow-sm border border-border dark:border-border',
				className,
			)}
		>
			<div className="flex items-center p-[16px] gap-[12px]">
				{/* Render icon from icon prop or generate from iconName */}
				{(icon || iconName) && (
					<div
						className={cn(
							'rounded-full p-3',
							iconBgColor,
							iconClassName || 'bg-muted dark:bg-muted',
						)}
					>
						{' '}
						{icon ||
							(iconName && (
								<DynamicIcon
									name={iconName}
									className={cn('w-[56px] h-[56px]', iconColor)}
								/>
							))}
					</div>
				)}
				<div>
					<div className="text-sm text-muted-foreground dark:text-muted-foreground">
						{title}
					</div>
					<div className="text-2xl font-bold text-foreground dark:text-foreground">
						{formattedValue}
					</div>

					{/* Support for legacy subtitle as ReactNode */}
					{!formattedSecondary && typeof subtitle === 'object' && subtitle}

					{/* New formatted secondary display */}
					{formattedSecondary && (
						<div className={formattedSecondary.className}>
							{formattedSecondary.content}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

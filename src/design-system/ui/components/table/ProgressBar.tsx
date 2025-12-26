import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/core/utils';

interface ProgressBarProps {
	value: number;
	max?: number;
	className?: string;
	showLabel?: boolean;
	color?: 'green' | 'amber' | 'red' | 'blue' | 'purple';
	size?: 'sm' | 'md' | 'lg';
	labelPosition?: 'left' | 'right' | 'center';
	showUnits?: boolean;
	unitText?: string;
}

// Helper component for rendering the label
interface LabelDisplayProps {
	label: string;
	className?: string;
	isVisible: boolean;
}

const LabelDisplay: React.FC<LabelDisplayProps> = ({ label, className, isVisible }) => {
	if (!isVisible) return null;
	return <span className={cn('text-sm font-medium whitespace-nowrap', className)}>{label}</span>;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
	value,
	max = 100,
	className,
	showLabel = true,
	color = 'green',
	size = 'sm',
	labelPosition = 'center',
	showUnits = false,
	unitText = '',
}) => {
	const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

	const getColorClass = (colorName: string, type: 'bg' | 'text') => {
		switch (colorName) {
			case 'green':
				return type === 'bg' ? 'bg-green-500' : 'text-green-500';
			case 'amber':
				return type === 'bg' ? 'bg-amber-500' : 'text-amber-500';
			case 'red':
				return type === 'bg' ? 'bg-red-500' : 'text-red-500';
			case 'blue':
				return type === 'bg' ? 'bg-blue-500' : 'text-blue-500';
			case 'purple':
				return type === 'bg' ? 'bg-purple-500' : 'text-purple-500';
			default:
				return type === 'bg' ? 'bg-green-500' : 'text-green-500';
		}
	};

	const sizeClasses = {
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3',
	};

	const labelText = showUnits
		? `${value}/${max} ${unitText}`
		: `${Math.round(percentage)}%`;

	const textColorClassName = getColorClass(color, 'text');

	return (
		<div className={cn('flex items-center gap-2', className)}>
			<LabelDisplay
				label={labelText}
				className={textColorClassName}
				isVisible={showLabel && labelPosition === 'left'}
			/>
			<div className="flex flex-col w-full">
				<LabelDisplay
					label={labelText}
					className={cn(textColorClassName, 'w-full')}
					isVisible={showLabel && labelPosition === 'center'}
				/>
				<div
					className={cn(
						'flex-1 bg-gray-200 rounded-full overflow-hidden',
					)}
				>
					<motion.div
						className={cn(
							'rounded-full',
							getColorClass(color, 'bg'),
							sizeClasses[size],
						)}
						initial={{ width: 0 }}
						animate={{ width: `${percentage}%` }}
						transition={{ duration: 0.5, ease: "easeInOut" }}
					/>
				</div>
			</div>
			<LabelDisplay
				label={labelText}
				className={textColorClassName}
				isVisible={showLabel && labelPosition === 'right'}
			/>
		</div>
	);
};

export default ProgressBar;

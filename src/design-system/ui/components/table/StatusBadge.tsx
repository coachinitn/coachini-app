import React from 'react';
import { cn } from '@/core/utils';

type StatusType =
	| 'online'
	| 'offline'
	| 'away'
	| 'busy'
	| 'completed'
	| 'scheduled'
	| 'canceled'
	| 'in-progress';

interface StatusBadgeProps {
	status: StatusType;
	className?: string;
	variant?: 'filled' | 'outline';
	size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
	status,
	className,
	variant = 'filled',
	size = 'md',
}) => {
	const getStatusStyles = (
		status: StatusType,
		variant: 'filled' | 'outline',
	) => {
		const styles = {
			online:
				variant === 'filled'
					? 'bg-green-500 text-white'
					: 'bg-white text-green-500 border border-green-500',
			offline:
				variant === 'filled'
					? 'bg-gray-400 text-white'
					: 'bg-white text-gray-500 border border-gray-400',
			away:
				variant === 'filled'
					? 'bg-amber-400 text-white'
					: 'bg-white text-amber-500 border border-amber-400',
			busy:
				variant === 'filled'
					? 'bg-red-500 text-white'
					: 'bg-white text-red-500 border border-red-500',
			completed:
				variant === 'filled'
					? 'bg-green-100 text-green-600'
					: 'bg-white text-green-500 border border-green-500',
			scheduled:
				variant === 'filled'
					? 'bg-amber-100 text-amber-600'
					: 'bg-white text-amber-500 border border-amber-500',
			canceled:
				variant === 'filled'
					? 'bg-red-100 text-red-600'
					: 'bg-white text-red-500 border border-red-500',
			'in-progress':
				variant === 'filled'
					? 'bg-blue-100 text-blue-600'
					: 'bg-white text-blue-500 border border-blue-500',
		};

		return styles[status];
	};

	const sizeClasses = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-3 py-1 text-sm',
		lg: 'px-4 py-1.5 text-base',
	};

	return (
		<span
			className={cn(
				'inline-flex rounded-full font-medium',
				getStatusStyles(status, variant),
				sizeClasses[size],
				className,
			)}
		>
			{status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
		</span>
	);
};

export default StatusBadge;

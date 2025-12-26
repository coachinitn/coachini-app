import React from 'react';
import { cn } from '@/core/utils';

interface StarRatingProps {
	rating: number;
	maxRating?: number;
	className?: string;
	starSize?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({
	rating,
	maxRating = 5,
	className,
	starSize = 'md',
}) => {
	const sizeClasses = {
		sm: 'text-lg',
		md: 'text-xl',
		lg: 'text-2xl',
	};

	return (
		<div className={cn('flex', className)}>
			{Array.from({ length: maxRating }).map((_, index) => (
				<span
					key={index}
					className={cn(
						'text-amber-400',
						sizeClasses[starSize],
						index >= rating && 'text-gray-300',
					)}
				>
					★
				</span>
			))}
		</div>
	);
};

export default StarRating;

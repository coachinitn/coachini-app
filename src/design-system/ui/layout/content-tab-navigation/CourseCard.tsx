import React from 'react';
import { Card, CardContent } from '@/design-system/ui/base/card';
import { Button } from '@/design-system/ui/base/button';
import { Bookmark, Eye, Plus, X } from 'lucide-react';
import { cn } from '../../../../core/utils';
import { AvatarGroup } from '../../components/avatar-group';
// import AvatarGroup from './table/AvatarGroup';
// import { type Member } from './table/AvatarGroup';
// import { AspectRatio } from '@/components/ui/aspect-ratio';

interface CourseCardProps {
	title: string;
	description: string;
	isSaved?: boolean;
	members?: any[];
	imageUrl?: string;
	onSave?: () => void;
	onViewDetails?: () => void;
	onAddToProgram?: () => void;
	onRemoveFromProgram?: () => void;
	inProgram?: boolean;
	variant?: 'default' | 'compact' | 'minimal';
	colorAccent?: 'blue' | 'amber' | 'green' | 'purple';
	className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
	title,
	description,
	isSaved = false,
	members = [],
	imageUrl,
	onSave,
	onViewDetails,
	onAddToProgram,
	onRemoveFromProgram,
	inProgram = false,
	variant = 'default',
	colorAccent = 'blue',
	className,
}) => {
	const colorClasses = {
		blue: 'text-blue-800 border-blue-600',
		amber: 'text-amber-800 border-amber-500',
		green: 'text-green-800 border-green-600',
		purple: 'text-purple-800 border-purple-600',
	};

	const buttonColorClasses = {
		blue: 'text-blue-600 border-blue-600 hover:bg-blue-50',
		amber: 'text-amber-600 border-amber-600 hover:bg-amber-50',
		green: 'text-green-600 border-green-600 hover:bg-green-50',
		purple: 'text-purple-600 border-purple-600 hover:bg-purple-50',
	};

	return (
		<Card
			className={cn(
				'h-full overflow-hidden',
				variant === 'compact' && 'shadow-sm border-l-4',
				variant === 'compact' && colorAccent && `border-l-${colorAccent}-500`,
				className,
			)}
		>
			<CardContent
				className={cn(
					'p-0 flex flex-col h-full',
					variant === 'compact' && 'p-4',
				)}
			>
				{imageUrl && variant !== 'compact' && variant !== 'minimal' && (
					<div className="relative">
						{/* <AspectRatio ratio={16 / 9}>
							<img
								src={imageUrl}
								alt={title}
								className="w-full h-full object-cover"
							/>
						</AspectRatio> */}
						{inProgram && (
							<div className="absolute top-2 right-2">
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full h-8 w-8 bg-white/80 text-red-500 border border-red-200 hover:bg-white"
									onClick={onRemoveFromProgram}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						)}
					</div>
				)}

				<div
					className={cn(
						'p-6 flex flex-col flex-grow',
						variant === 'compact' && 'p-0',
						variant === 'minimal' && 'p-3',
					)}
				>
					<div className="flex justify-between items-start">
						<h3
							className={cn(
								'font-medium mb-2',
								colorAccent && colorClasses[colorAccent],
								variant === 'default' ? 'text-lg' : 'text-base',
							)}
						>
							{title}
						</h3>
						{onSave && variant !== 'minimal' && (
							<button
								onClick={onSave}
								className={cn(
									'text-blue-600',
									colorAccent && colorClasses[colorAccent],
								)}
							>
								<Bookmark
									className={
										isSaved
											? cn(
													'fill-current',
													colorAccent && colorClasses[colorAccent],
											  )
											: ''
									}
									size={variant === 'compact' ? 16 : 20}
								/>
							</button>
						)}
					</div>

					{variant !== 'minimal' && (
						<p
							className={cn(
								'text-gray-500 mb-6 flex-grow',
								variant === 'compact' ? 'text-xs' : 'text-sm',
							)}
						>
							{description}
						</p>
					)}

					<div className="flex items-center justify-between mt-auto">
						<div>
							{members.length > 0 && (
                  <AvatarGroup
                    members={members}
                    // size={variant === 'compact' ? 'sm' : 'md'}
								/>
							)}
						</div>

						<div className="flex items-center gap-2">
							{onAddToProgram && !inProgram && variant !== 'minimal' && (
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full"
									onClick={onAddToProgram}
								>
									<Plus
										className={cn(
											'h-4 w-4',
											colorAccent && colorClasses[colorAccent],
										)}
									/>
								</Button>
							)}

							{onViewDetails && variant !== 'minimal' && (
								<Button
									variant="outline"
									className={cn(
										'border hover:text-current rounded-full',
										buttonColorClasses[colorAccent],
										variant === 'compact' ? 'text-xs py-1 px-2' : '',
									)}
									onClick={onViewDetails}
								>
									<Eye className="mr-1 h-4 w-4" />
									{variant === 'compact' ? 'View' : 'View Details'}
								</Button>
							)}

							{inProgram && variant === 'minimal' && onRemoveFromProgram && (
								<Button
									variant="ghost"
									size="sm"
									className="text-red-500 hover:text-red-600 p-1 h-auto"
									onClick={onRemoveFromProgram}
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default CourseCard;

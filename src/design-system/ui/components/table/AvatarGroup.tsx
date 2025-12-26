import React from 'react';
import { Avatar } from '@/design-system/ui/base/avatar';
import { cn } from '@/core/utils';

export interface Member {
	id: string;
	name: string;
	avatarUrl?: string;
}

interface AvatarGroupProps {
	members: Member[];
	limit?: number;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
	members,
	limit = 5,
	size = 'md',
	className,
}) => {
	const visibleMembers = members.slice(0, limit);
	const remainingCount = members.length - limit;

	const sizeClasses = {
		sm: 'h-6 w-6 -ml-1.5',
		md: 'h-8 w-8 -ml-2',
		lg: 'h-10 w-10 -ml-2.5',
	};

	const containerClass = {
		sm: 'pl-1.5',
		md: 'pl-2',
		lg: 'pl-2.5',
	};

	return (
		<div className={cn('flex', containerClass[size], className)}>
			{visibleMembers.map((member) => (
				<Avatar
					key={member.id}
					className={cn(
						'border-2 border-white rounded-full',
						sizeClasses[size],
					)}
				>
					{member.avatarUrl ? (
						<img
							src={member.avatarUrl}
							alt={member.name}
							className="object-cover w-full h-full"
						/>
					) : (
						<div className="bg-blue-500 text-white flex items-center justify-center w-full h-full text-xs font-medium">
							{member.name.charAt(0)}
						</div>
					)}
				</Avatar>
			))}

			{remainingCount > 0 && (
				<div
					className={cn(
						'flex items-center justify-center bg-gray-200 text-gray-600 font-medium rounded-full border-2 border-white',
						sizeClasses[size],
					)}
				>
					<span className="text-xs">+{remainingCount}</span>
				</div>
			)}
		</div>
	);
};

export default AvatarGroup;

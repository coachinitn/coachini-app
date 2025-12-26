import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/core/utils';
import { ArrowCtaIcon } from '../../../icons';
import { Icon } from '../icon';

interface SuggestionCardProps {
	title: string;
	program: string;
	imageSrc?: string;
	className?: string;
	onClick?: () => void;
}

const SuggestionCard = ({
	title,
	program,
	imageSrc,
	className,
	onClick,
}: SuggestionCardProps) => {
	return (
		<div
			className={cn(
				'relative flex flex-col rounded-[80px] cursor-pointer group',
				'w-full  transition-transform hover:scale-[1.02]',
				className,
			)}
			onClick={onClick}
		>
			{/* <div className="absolute inset-0 flex-col justify-center bg-gradient-to-r from-gray-900/80 to-gray-700/50" /> */}

			<div className="absolute inset-0">
				{imageSrc && (
					<img
						src={imageSrc}
						alt={program}
						className="object-cover w-full h-full opacity-70 rounded-[10px]"
					/>
				)}
			</div>
			<div className="absolute rounded-[10px] inset-0 bg-gradient-to-r from-gray-900/80 to-gray-700/50" />

			{/* Content */}
			<div className="relative  flex flex-col  w-full h-full p-4 gap-[7px] z-10">
				<div className="flex flex-col justify-center gap-[12px]">
					<p className="text-sm font-medium text-white/80">{title}</p>
					<h3 className="mt-1 text-2xl font-bold text-white">{program}</h3>
				</div>
				<div className="self-end">
					<Icon icon={ArrowCtaIcon} size={32} />
				</div>
			</div>
		</div>
	);
};

export default SuggestionCard;

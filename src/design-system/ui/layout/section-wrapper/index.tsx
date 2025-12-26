import type React from 'react';
import { cn } from '../../../../core/utils/cn';

type AllowedTags = 'section' | 'div' | 'article' | 'aside' | 'main';

function SectionWrapper({
	children,
	className,
	tag: Tag = 'section',
}: {
	children: React.ReactNode;
	className?: string;
	tag?: AllowedTags;
}) {
	return (
		<Tag
			className={cn(
				'mx-auto flex-1 items-center bg-background',
				// 'px-[30px] py-[30px] space-y-6',
				className,
			)}
		>
			{children}
		</Tag>
	);
}

export default SectionWrapper;

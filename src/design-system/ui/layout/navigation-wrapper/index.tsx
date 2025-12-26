import type { ReactNode } from 'react';
import { cn } from '../../../../core/utils/cn';
import { NavHeader } from '@/design-system/ui/components';

type NavWrapper = {
	children: ReactNode;
	className?: string;
};

export default function NavigationWrapper({ children, className }: NavWrapper) {
	return (
		<div className={cn(className)}>
			<>
				{/* <div aria-hidden="true" className="h-[64px] w-full bg-green-300" /> */}
				<nav
					aria-label="Main Navigation"
					className="sticky top-0 left-0 z-30 flex shadow-small "
				>
					<div
						className={cn(
							'flex items-center justify-center w-full gap-[15px] bg-background',
							'px-[30px] py-[30px]',
						)}
					>
						<NavHeader title="HOME" breadcrumb="HOME" />
					</div>
				</nav>
			</>
			{children}
		</div>
	);
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/core/utils/cn';
import { SidebarItem, DashboardSidebarProps, AnimationStyle } from './types';
import { TitleMedium } from '@/design-system/ui/base';
import {
	DiscoveryIcon,
	HomeIcon,
	PlusIcon,
	ProfileIcon,
} from '@/design-system/icons/layout';
import { Icon } from '@/design-system/ui/components/icon';
import { motion, AnimatePresence } from 'framer-motion';

export type { SidebarItem, DashboardSidebarProps, AnimationStyle };

export function DashboardSidebar({ 
	items, 
	className, 
	animationStyle = 'center-outward',
	children
    
}: DashboardSidebarProps) {
	const pathname = usePathname();
	const [activePathname, setActivePathname] = useState(pathname);
	
	// Update activePathname when pathname changes to trigger animation
	useEffect(() => {
		setActivePathname(pathname);
	}, [pathname]);

	const defaultNavItems: SidebarItem[] = [
		{
			name: 'Dashboard',
			href: '/dashboard',
			icon: HomeIcon,
		},
		{
			name: 'Themes',
			href: '/dashboard/themes',
			icon: DiscoveryIcon,
		},
		{
			name: 'Teams',
			href: '/dashboard/teams',
			icon: PlusIcon,
		},
		{
			name: 'Profile',
			href: '/dashboard/profile',
			icon: ProfileIcon,
		},
		// For legacy string paths, the Icon component will handle them correctly
		// {
		// 	name: 'Reports',
		// 	href: '/dashboard/reports',
		// 	icon: '/icons/reports-icon.svg',
		// },
		// {
		// 	name: 'Requests',
		// 	href: '/dashboard/requests',
		// 	icon: '/icons/requests-icon.svg',
		// },
	];

	const navItems = items || defaultNavItems;

	// Define animation variants for the sidebar
	const sidebarVariants = {
		hidden: { opacity: 0.95, x: -10 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.15,
				staggerChildren: 0.05,
			},
		},
	};

	// Animation variants for sidebar items
	const itemVariants = {
		hidden: { opacity: 0, x: -5 },
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.15 },
		},
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={sidebarVariants}
			className={cn(
				'sticky top-0 left-0 h-screen w-[210px] shrink-0 flex flex-col bg-card border-r border-border dark:border-border overflow-y-auto ',
				className,
			)}
		>
			<div className="p-6">
				<Link href="/dashboard" className="flex items-center">
					<div className="flex items-center w-[143px] h-[47px] shrink-0">
						<Image
							src={'/icons/layout/C-Logo-Big.svg'}
							alt={`Coachini Logo`}
							width={143}
							height={47}
						/>
					</div>
				</Link>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.2 }} // Faster appearance
				className="h-px mx-6 bg-border dark:bg-border"
			/>

			<div className="py-6 shrink-0">
				<nav>
					<ul className="space-y-[20px]">
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<motion.li
									key={item.name}
									variants={itemVariants}
									className="py-[2px] group/sidebarItem"
								>
									<Link href={item.href}>
										<motion.div
											className={cn(
												'flex items-center gap-4 px-6 py-1 relative rounded-md ',
												isActive
													? 'text-primary dark:text-primary'
													: 'text-muted-foregroun dark:text-muted-foreground dark:hover:text-foreground group-hover/sidebarItem:text-foreground/70',
											)}
										>
											<div className={cn('flex items-center gap-4 ')}>
												<Icon
													icon={item.icon}
													alt={`${item.name} icon`}
													isActive={isActive}
													className={cn(
														'w-[24] h-[24]',
														!isActive &&
															'group-hover/sidebarItem:text-foreground/70',
													)}
													activeClassName="text-primary-900 dark:text-primary-500"
													inactiveClassName="text-muted-foreground"
												/>

												<TitleMedium
													className={cn(
														isActive
															? 'text-foreground'
															: 'text-muted-foreground group-hover/sidebarItem:text-foreground/70',
													)}
												>
													{item.name}
												</TitleMedium>
											</div>
											
											<AnimatePresence>
												{isActive && (
													<motion.div
														initial={
															animationStyle === 'top-to-bottom' 
																? { top: 0, bottom: '100%', opacity: 0 }
																: animationStyle === 'bottom-to-top'
																	? { top: '100%', bottom: 0, opacity: 0 }
																	: { top: '50%', bottom: '50%', opacity: 0 }
														}
														animate={{ 
															top: 0, 
															bottom: 0, 
															opacity: 1 
														}}
														exit={
															animationStyle === 'top-to-bottom' 
																? { bottom: 0, top: '100%', opacity: 0 }
																: animationStyle === 'bottom-to-top'
																	? { bottom: '100%', top: 0, opacity: 0 }
																	: { top: '50%', bottom: '50%', opacity: 0 }
														}
														transition={{ duration: 0.2, ease: 'easeInOut' }}
														className="absolute right-0 w-1 rounded-[25px] bg-primary-900 dark:bg-primary-500"
													/>
												)}
											</AnimatePresence>
										</motion.div>
									</Link>
								</motion.li>
							);
						})}
					</ul>
				</nav>
			</div>
		</motion.div>
	);
}

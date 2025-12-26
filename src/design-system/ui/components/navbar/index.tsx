'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedAvatar } from '@/design-system/ui/components/optimized-avatar';
import { NotificationsPanel } from '@/design-system/ui/components/notifications/notifications-panel';
import { HelpCenterButton } from '@/design-system/ui/components/help-center/help-center-button';
import { SearchIcon } from '@/design-system/icons/layout';
import { ChatButton } from './ChatButton';
import { cn } from '../../../../core/utils';
import { useChatContext } from '../../layout';

// Safe hook to use chat context with fallback
// function useSafeChatContext(): { toggleChat: () => void; hasNewMessages: boolean } {
//   // Fallback when chat context is not available
//   return {
//     toggleChat: () => console.log('Chat context not available'),
//     hasNewMessages: false,
//   };
// }

const NavContent = ({
	searchValue,
	setSearchValue,
	isMobile,
	searchPlaceholder = "Search",
}: {
	searchValue: string;
	setSearchValue: (value: string) => void;
	isMobile: boolean;
	searchPlaceholder?: string;
}) => {
	return (
		<div
			className={cn(
				'flex items-center gap-4 p-[10px] bg-card',
				'shadow-md rounded-[10px]',
			)}
		>
			<div
				className={`relative ${isMobile ? 'w-full' : 'w-[214px]'} h-[41px] `}
			>
				<div className="absolute inset-y-0 left-0 flex items-center pl-4">
					<SearchIcon
						width={20}
						height={20}
						className="text-muted-foreground"
					/>
				</div>
				<input
					type="text"
					placeholder={searchPlaceholder}
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					className="w-full h-full py-3 pl-12 pr-4 bg-muted dark:bg-muted rounded-[10px] border-none text-muted-foreground dark:text-muted-foreground placeholder-muted-foreground dark:placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
				/>
			</div>

			<div
				className={`flex items-center ${
					isMobile ? 'w-full justify-between mt-2' : 'ml-4'
				} space-x-4`}
			>
				<NotificationsPanel  />

				<HelpCenterButton />

				<OptimizedAvatar
					src="/placeholder.svg?height=42&width=42"
					alt="User"
					size={41}
					className="border-2 rounded-full border-card"
				/>
			</div>
		</div>
	);
};

const DesktopNavbar = ({
	searchValue,
	setSearchValue,
	hasNewMessages,
	toggleChat,
	searchPlaceholder,
}: {
	searchValue: string;
	setSearchValue: (value: string) => void;
	hasNewMessages: boolean;
	toggleChat: () => void;
	searchPlaceholder?: string;
}) => {
	return (
		<div className="max-w-max z-50 flex items-center justify-end gap-[12px]">
			<NavContent
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				isMobile={false}
				searchPlaceholder={searchPlaceholder}
			/>
			<ChatButton
				hasNewMessages={hasNewMessages}
				toggleChat={toggleChat}
			/>
		</div>
	);
};

const MobileNavbar = ({
	searchValue,
	setSearchValue,
	mobileMenuOpen,
	setMobileMenuOpen,
	hasNewMessages,
	toggleChat,
	searchPlaceholder,
}: {
	searchValue: string;
	setSearchValue: (value: string) => void;
	mobileMenuOpen: boolean;
	setMobileMenuOpen: (value: boolean) => void;
	hasNewMessages: boolean;
	toggleChat: () => void;
	searchPlaceholder?: string;
}) => {
	return (
		<>
			<div className="fixed flex items-center justify-between gap-3 top-10 right-10">
				<AnimatePresence>
					{mobileMenuOpen && (
						<motion.div
							className=" z-20 fixed top-20 left-0 right-0 shadow-lg rounded-[10px] flex flex-col items-start gap-4"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.2 }}
						>
							<NavContent
								searchValue={searchValue}
								setSearchValue={setSearchValue}
								isMobile={true}
								searchPlaceholder={searchPlaceholder}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				<ChatButton
					hasNewMessages={hasNewMessages}
					toggleChat={toggleChat}
					size="52px"
				/>
				<button
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					className="flex items-center justify-center z-30 p-2 bg-primary rounded-[10px] text-primary-foreground w-[52px] h-[52px]"
					aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
				>
					{mobileMenuOpen ? <X size={24} /> : <Menu size={30} />}
				</button>
			</div>
		</>
	);
};

interface NavbarProps {
	searchPlaceholder?: string;
	searchScope?: string;
}

export function Navbar({ searchPlaceholder = "Search", searchScope }: NavbarProps = {}) {
	const [searchValue, setSearchValue] = useState('');
	const { toggleChat, hasNewMessages } = useChatContext();
	const [isMobile, setIsMobile] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth >= 768) {
				setMobileMenuOpen(false);
			}
		};

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);

	return isMobile ? (
		<></>
		// <MobileNavbar
		// 	searchValue={searchValue}
		// 	setSearchValue={setSearchValue}
		// 	mobileMenuOpen={mobileMenuOpen}
		// 	setMobileMenuOpen={setMobileMenuOpen}
		// 	hasNewMessages={hasNewMessages}
		// 	toggleChat={() => {}}
		// 	searchPlaceholder={searchPlaceholder}
		// />
	) : (
		<DesktopNavbar
			searchValue={searchValue}
			setSearchValue={setSearchValue}
			hasNewMessages={hasNewMessages}
			toggleChat={() => {}}
			searchPlaceholder={searchPlaceholder}
		/>
	);
}

import React from 'react';
import { ScrollArea } from '@/design-system/ui/base/scroll-area';
import Image from 'next/image';
import MainFooter from '../main-footer';
import MainNavbar from '../main-navbar';
import { cn } from '@/core/utils';

interface AuthLayoutProps {
	children: React.ReactNode;
	className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, className }) => {
	return (
		<div className="relative flex w-full min-h-screen">
			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-secondary-900 opacity-40 " />
			{/* Background Image */}
			<Image
				src="/misc/auth-b.png"
				alt="Authentication background"
				fill
				className="object-cover"
				priority
				quality={85}
			/>
			<ScrollArea className="relative w-full h-screen z-20">
				<div className="flex flex-col min-h-screen wave-bg">
					{/* Header */}
					<MainNavbar />
					<main className="flex items-center justify-center flex-grow px-4 py-12">
						<div className={cn("w-full auth-container", className)}>{children}</div>
					</main>
					<MainFooter />
				</div>
			</ScrollArea>
		</div>
	);
};

export default AuthLayout;

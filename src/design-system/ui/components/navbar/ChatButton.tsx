import React from 'react';
import { motion } from "framer-motion";
import { ChatIcon } from "@/design-system/icons/layout";
import { cn } from '@/core/utils';

interface ChatButtonProps {
  hasNewMessages: boolean;
  toggleChat: () => void;
  className?: string;
  size?: string;
}

export function ChatButton({ hasNewMessages, toggleChat, className = "" , size = "62px" }: ChatButtonProps) {
  return (
		<motion.div
			className={`relative ${className}`}
			initial={{ scale: 0.9, opacity: 0.9 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ delay: 0.1 }}
		>
			<button
				onClick={toggleChat}
				className={cn(
					`relative flex items-center justify-center w-[${size}] h-[${size}]`,
					'p-[10px] bg-primary-400 dark:bg-primary-500 rounded-[10px] hover:bg-opacity-90 transition-colors shadow-md',
				)}
				aria-label="Open chat"
			>
				<ChatIcon
					width={32}
					height={32}
					className="text-white dark:text-primary-foreground"
				/>
				{hasNewMessages && (
					<motion.span
						className="absolute top-0 right-0 w-3 h-3 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive"
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							type: 'spring',
							stiffness: 500,
							damping: 20,
						}}
					/>
				)}
			</button>
		</motion.div>
	);
} 
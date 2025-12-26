"use client"

import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { FixedWrapper } from "../../../layout/fixed-wrapper"
import { DisplayLarge, DisplayMedium, H1, H2, H3, HeadlineLarge, HeadlineMedium, Navbar, TitleSmall } from "@/design-system/ui/"
import { cn, responsive } from "@/core/utils"
import { useScrollLock } from '@/design-system/ui/components/ScrollLockManager';

interface NavWrapperProps {
  breadcrumb: string
  title: string
  lockScroll?: boolean
}

export function NavHeader({ breadcrumb, title, lockScroll = false }: NavWrapperProps) {
//   const { isLocked, lockScroll: enableScrollLock, unlockScroll } = useScrollLock();
  
//   // Control scroll locking based on the lockScroll prop
//   useEffect(() => {
//     if (lockScroll && !isLocked) {
//       enableScrollLock();
//     } else if (!lockScroll && isLocked) {
//       unlockScroll();
//     }
    
//     // No cleanup needed as the ScrollLockManager handles that
//   }, [lockScroll, isLocked, enableScrollLock, unlockScroll]);

  return (
		<div className="relative w-full z-10">
			<div className="flex flex-col gap-[12px] sm:flex-row sm:items-center sm:justify-between">
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<TitleSmall className="text-foreground-emphasis">
						{breadcrumb}
					</TitleSmall>
					<HeadlineMedium className="font-medium">{title}</HeadlineMedium>
				</motion.div>
				<Navbar />
			</div>
		</div>
	);
} 
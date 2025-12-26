"use client"

import React, { useState } from "react"
import { Maximize2 } from "lucide-react"
import { cn } from "@/core/utils/cn"
import { motion, AnimatePresence } from "framer-motion"

interface AttendanceChartProps {
  data: number[]
  labels: string[]
  className?: string
  isExpanded: boolean
  // make the declaration more generic
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export function AttendanceChart({
	data,
	labels,
	className,
	isExpanded,
	setIsExpanded,
}: AttendanceChartProps) {
	// const [isExpanded, setIsExpanded] = useState(false);
	// Use a reference for the container element to properly animate from its current position
	const containerRef = React.useRef<HTMLDivElement>(null);

	return (
		<motion.div
			ref={containerRef}
			className={cn(
				isExpanded ? 'w-full' : 'lg:w-2/3',
				'bg-blue-50 dark:bg-blue-900/10 rounded-lg relative',
				className,
			)}
			style={{
				height: 300,
				transformOrigin: 'right center',
			}}
			initial={false}
			layout
			transition={{
				layout: { duration: 0.35, type: 'spring', stiffness: 300, damping: 30 },
				height: { duration: 0.35, ease: [0.34, 1.25, 0.64, 1] },
			}}
		>
			<div className="absolute z-10 top-2 right-2">
				<motion.button
					className="h-8 w-8 p-1.5 bg-card dark:bg-card rounded-md shadow-sm hover:bg-muted dark:hover:bg-muted/70"
					onClick={() => setIsExpanded(!isExpanded)}
					aria-label={isExpanded ? 'Collapse chart' : 'Expand chart'}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<motion.div
						animate={{ rotate: isExpanded ? 180 : 0 }}
						transition={{ duration: 0.3 }}
					>
						<Maximize2 className="w-5 h-5 text-muted-foreground dark:text-muted-foreground" />
					</motion.div>
				</motion.button>
			</div>

			<div className="flex flex-col h-full p-6">
				{/* Chart container */}
				<div className="flex flex-col h-full">
					{/* Y-axis labels and grid lines */}
					<div className="relative flex-1">
						{' '}
						{/* Y-axis labels */}{' '}
						<div className="absolute top-0 left-0 flex flex-col justify-between h-full text-sm font-medium text-gray-500">
							{[100, 80, 60, 40, 20, 0].map((value, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: -5 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3, delay: index * 0.05 }}
								>
									{value}
								</motion.div>
							))}
						</div>
						{/* Grid lines */}{' '}
						<div className="absolute top-0 right-0 flex flex-col justify-between h-full pointer-events-none left-8">
							{[0, 1, 2, 3, 4, 5].map((i) => (
								<motion.div
									key={i}
									className="w-full border-b border-blue-100 dark:border-blue-800"
									initial={{ scaleX: 0, opacity: 0 }}
									animate={{ scaleX: 1, opacity: 1 }}
									transition={{ duration: 0.3, delay: i * 0.05 }}
								></motion.div>
							))}
						</div>
						{/* Chart bars */}
						<div
							className={cn(
								'absolute top-0 right-0 flex items-end justify-between left-8 bottom-2',
								isExpanded ? 'justify-around' : 'justify-between',
							)}
						>
							{data.map((height, index) => (
								<div
									key={index}
									className="relative flex flex-col items-center justify-end h-full"
								>
									{' '}
									<motion.div
										className="w-[23px] bg-blue-600 rounded-xl relative"
										initial={{ height: 0 }}
										animate={{ height: `${height}%` }}
										style={{ transformOrigin: 'bottom' }}
										transition={{
											duration: 0.6,
											delay: index * 0.05,
											ease: [0.34, 1.25, 0.64, 1],
											layout: { type: 'spring', stiffness: 300, damping: 30 },
										}}
										layout="preserve-aspect"
										whileHover={{
											scale: 1.05,
											backgroundColor: '#2563eb',
										}}
										onHoverStart={() => {
											const tooltip = document.getElementById(
												`tooltip-${index}`,
											);
											if (tooltip) tooltip.style.opacity = '1';
										}}
										onHoverEnd={() => {
											const tooltip = document.getElementById(
												`tooltip-${index}`,
											);
											if (tooltip) tooltip.style.opacity = '0';
										}}
									>
										{/* Tooltip */}
										<div
											id={`tooltip-${index}`}
											className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-lg pointer-events-none opacity-0 whitespace-nowrap z-20 transition-opacity duration-200"
										>
											<div className="flex flex-col items-center">
												<span>{labels[index]}</span>
												<span className="font-bold">{height}%</span>
											</div>
											{/* Tooltip arrow */}
											<div className="absolute transform -translate-x-1/2 border-8 border-transparent top-full left-1/2 border-t-slate-800"></div>
										</div>
									</motion.div>
								</div>
							))}
						</div>
					</div>
					{/* X-axis with % label and yellow squares/program names */}{' '}
					<div className="flex items-start h-16 pt-1">
						<div className="w-8 text-sm text-gray-500">%</div>
						<div
							className={cn(
								'flex items-start flex-1',
								isExpanded ? 'justify-around' : 'justify-between',
							)}
						>
							{labels.map((label, index) => (
								<div key={index} className="flex flex-col items-center w-6">
									<AnimatePresence mode="wait">
										{isExpanded ? (
											<motion.div
												key="label"
												className="text-xs text-gray-500 text-center max-w-[60px] whitespace-normal"
												style={{ fontSize: '0.65rem' }}
												initial={{ opacity: 0, y: 5 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -5 }}
												transition={{ duration: 0.3 }}
											>
												{label}
											</motion.div>
										) : (
											<motion.div
												key="square"
												className="w-[20px] h-[20px] bg-yellow-300 rounded-[4px]"
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.8 }}
												transition={{ duration: 0.3 }}
												whileHover={{ scale: 1.1, rotate: 5 }}
											></motion.div>
										)}
									</AnimatePresence>
								</div>
							))}
						</div>
					</div>
				</div>{' '}
			</div>
		</motion.div>
	);
}
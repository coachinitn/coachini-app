'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useWindowScroll } from 'react-use';
import { cn } from '@/core/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

// Simple hook to get window dimensions
const useWindowSize = () => {
	const [size, setSize] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
	});

	useEffect(() => {
		if (typeof window === 'undefined') return;
		
		const handleResize = () => {
			setSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return size;
};

interface FixedWrapperProps {
	children: ReactNode;
	offsetTop?: number;
	offsetBottom?: number;
	offsetLeft?: number;
	offsetRight?: number;
	threshold?: number;
	className?: string;
	zIndex?: number;
	disabled?: boolean;
	alwaysFixed?: boolean;
	transitionDuration?: string;
	transitionTimingFunction?: string;
	animation?: boolean;
	onFixedChange?: (isFixed: boolean) => void;
}

export function FixedWrapper({
	children,
	offsetTop = 0,
	offsetBottom = 0,
	offsetLeft = 0,
	offsetRight = 0,
	threshold = 0,
	className = '',
	zIndex = 10,
	disabled = false,
	alwaysFixed = false,
	transitionDuration = '0.25s',
	transitionTimingFunction = 'ease-out',
	animation = true,
	onFixedChange,
}: FixedWrapperProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const { y: scrollY } = useWindowScroll();
	const windowSize = useWindowSize();
	
	const [isFixed, setIsFixed] = useState(alwaysFixed);
	const [dimensions, setDimensions] = useState({
		top: 0,
		right: 0,
		width: 0,
		height: 0,
	});
	const [initialized, setInitialized] = useState(false);
	
	// Update isFixed when alwaysFixed changes
	useEffect(() => {
		setIsFixed(alwaysFixed);
	}, [alwaysFixed]);
	
	// Measure container on mount and resize
	useEffect(() => {
		if (disabled) return;
		
		const updateMeasurements = () => {
			if (!containerRef.current) return;
			
			const rect = containerRef.current.getBoundingClientRect();
			const rightEdge = window.innerWidth - rect.right;
			
			setDimensions({
				top: rect.top + window.scrollY,
				right: rightEdge,
				width: rect.width,
				height: rect.height,
			});
			
			setInitialized(true);
		};
		
		// Initial measurement
		updateMeasurements();
		
		// Update on resize
		window.addEventListener('resize', updateMeasurements);
		
		return () => {
			window.removeEventListener('resize', updateMeasurements);
		};
	}, [disabled, windowSize]);
	
	// Handle scroll to determine if element should be fixed
	useEffect(() => {
		if (disabled || !initialized || alwaysFixed) return;
		
		const triggerPoint = dimensions.top - offsetTop - threshold;
		const shouldBeFixed = scrollY > triggerPoint;
		
		if (shouldBeFixed !== isFixed) {
			setIsFixed(shouldBeFixed);
			if (onFixedChange) {
				onFixedChange(shouldBeFixed);
			}
		}
	}, [scrollY, dimensions.top, offsetTop, threshold, disabled, initialized, isFixed, onFixedChange, alwaysFixed]);
	
	if (!initialized) {
		return (
			<div ref={containerRef} className={className}>
				{children}
			</div>
		);
	}
	
	// When alwaysFixed is true, we need to render both the placeholder and fixed element immediately
	if (alwaysFixed && !disabled) {
		return (
			<div ref={containerRef} className="fixed-wrapper-container" style={{ position: 'relative' }}>
				{/* Placeholder element to maintain height when fixed */}
				<div 
					style={{ 
						height: `${dimensions.height}px`,
						width: `${dimensions.width}px`, 
						visibility: 'hidden' 
					}}
					aria-hidden="true"
				></div>
				
				{/* Always fixed element */}
				<div
					className={cn('fixed-wrapper-element--fixed', className)}
					style={{
						position: 'fixed',
						top: dimensions.top,
						right: dimensions.right + offsetRight,
						width: dimensions.width > 0 ? dimensions.width : 'auto',
						zIndex: zIndex,
					}}
				>
					{children}
				</div>
			</div>
		);
	}
	
	// Normal behavior for scroll-triggered fixed elements
	return (
		<div
			ref={containerRef}
			className="fixed-wrapper-container"
			style={{
				position: 'relative',
			}}
		>
			{/* Regular position (non-fixed) */}
			{!isFixed && (
				<div
					ref={contentRef}
					className={cn('fixed-wrapper-element', className)}
				>
					{children}
				</div>
			)}

			{/* Placeholder element to maintain height when fixed */}
			{isFixed && !disabled && (
				<div 
					style={{ 
						height: `${dimensions.height}px`,
						width: `${dimensions.width}px`, 
						visibility: 'hidden' 
					}}
					aria-hidden="true"
				></div>
			)}

			{/* Fixed position */}
			{isFixed && !disabled && (
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ 
							duration: 0.3,
							ease: transitionTimingFunction === 'ease-out' ? 'easeOut' : 'easeInOut'
						}}
						className={cn('fixed-wrapper-element--fixed', className)}
						style={{
							position: 'fixed',
							top: offsetTop,
							right: dimensions.right - 10 + offsetRight,
							width: dimensions.width > 0 ? dimensions.width : 'auto',
							zIndex: zIndex,
						}}
					>
						{children}
					</motion.div>
				</AnimatePresence>
			)}
		</div>
	);
}

'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/core/utils/cn';
import { ProgressTimelineItem } from './progress-timeline-item';
import ScrollableContainer from '../../layout/scrollable-container';

export interface TimelineItem {
	id: string;
	title: string;
	date: string;
}

interface ProgressTimelineProps {
	title?: string;
	subtitle?: string;
	items: TimelineItem[];
	borderColor?: string;
	markerColor?: string;
	className?: string;
	header?: ReactNode;
	scrollbarColor?: string;
	scrollbarWidth?: string;
	scrollbarHeight?: string;
	trackColor?: string;
	trackClassName?: string;
}

export function ProgressTimeline({
	title = 'Current progress overview',
	subtitle = '+30% this month',
	items = [],
	borderColor = 'border-yellow-500 dark:border-yellow-600',
	markerColor,
	className,
	header,
	scrollbarColor,
	scrollbarWidth,
	scrollbarHeight,
	trackColor,
	trackClassName,
}: ProgressTimelineProps) {
	const defaultHeader = (
		<div className="px-6 pt-6 pb-2">
			{header ? (
				header
			) : (
				<div>
					<h3 className="text-lg font-medium text-foreground dark:text-foreground">
						{title}
					</h3>
					<p className="text-sm text-success-500 dark:text-success-500">
						{subtitle}
					</p>
				</div>
			)}
		</div>
	);
	
	return (
		<div
			className={cn(
				'bg-card dark:bg-card rounded-lg overflow-hidden shadow-sm border border-border dark:border-border h-full',
				className,
			)}
		>
			<ScrollableContainer
				header={defaultHeader}
				contentClassName="px-6"
				alwaysShowScrollbar={true}
				scrollbarColor={scrollbarColor}
				scrollbarWidth={scrollbarWidth}
				scrollbarHeight={scrollbarHeight}
				trackColor={trackColor}
				trackClassName={trackClassName}
			>
				<div className="relative">
					{items.map((item, index) => (
						<div key={item.id} className="relative">
							<ProgressTimelineItem {...item} markerColor={markerColor} />
							{index < items.length - 1 && (
								<div
									className={cn(
										'absolute w-0.5',
										borderColor.replace(/border-/g, 'bg-'),
									)}
									style={{
										left: '11px',
										top: '28px',
										bottom: '0px',
									}}
								/>
							)}
						</div>
					))}

					{items.length === 0 && (
						<div className="py-8 text-center text-muted-foreground dark:text-muted-foreground">
							<p>No progress items to display</p>
						</div>
					)}
				</div>
			</ScrollableContainer>
		</div>
	);
}

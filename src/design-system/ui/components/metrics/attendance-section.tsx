'use client';

import React, { useState } from 'react';
import { Users, X } from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { AttendanceChart } from './attendance-chart';
import { AttendanceStat } from './attendance-stat';
import { TitleLarge } from '@/design-system/ui/base';

interface AttendanceSectionProps {
	title?: string;
	subtitle?: string;
	subtitleValue?: string;
	data?: number[];
	labels?: string[];
	className?: string;
}

export function AttendanceSection({
	title = 'Attendance',
	subtitle = 'missed this week sessions',
	subtitleValue = '3',
	data = [100, 20, 100, 45, 70, 35],
	labels = [
		'Brand employer strategy',
		'Team cohesion',
		'Time management',
		'Conflict management',
		'Brand employer strategy',
		'Communication',
	],
	className,
}: AttendanceSectionProps) {
	const [isChartExpanded, setIsChartExpanded] = useState(false);
	return (
		<div
			className={cn(
				'bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6',
				className,
			)}
		>
			{' '}
			<div className="flex flex-col lg:flex-row">
				{/* Left side - Attendance info */}
				<div
					className={cn(`lg:w-1/3 mb-6 lg:mb-0 pr-6`, isChartExpanded ? 'hidden' : '')}
				>
					<div className="mb-4">
						<TitleLarge className="text-lg font-bold text-foreground dark:text-foreground">
							{title}
						</TitleLarge>
						<p className="text-text-700 text-md ">
							<span className="text-blue-400">{subtitleValue} </span>
							{subtitle}
						</p>
					</div>{' '}
					<div className="flex flex-col gap-4">
						<div className="flex flex-row items-end justify-start gap-4">
							<AttendanceStat
								icon={<Users className="w-5 h-5 text-primary-foreground" />}
								label="Online"
								value="12 Employees"
								percentage={80}
								barColor="bg-green-500 dark:bg-green-500"
							/>
							<div />
						</div>
						<div className="flex flex-row items-end justify-start gap-4">
							<AttendanceStat
								icon={
									<Users className="w-5 h-5 text-primary-foreground dark:text-primary-foreground" />
								}
								label="Inactive"
								value="2 Employees"
								percentage={15}
								barColor="bg-red-500 dark:bg-red-500"
							/>

							<AttendanceStat
								icon={
									<X className="w-5 h-5 text-primary-foreground dark:text-primary-foreground" />
								}
								label="Absence"
								value="5 %"
								percentage={5}
								barColor="bg-yellow-500 dark:bg-yellow-500"
							/>
						</div>
					</div>
				</div>

				{/* Right side - Chart */}
				<AttendanceChart
					data={data}
					labels={labels}
					// className={isChartExpanded ? 'lg:w-full' : ''}
          isExpanded={isChartExpanded}
          setIsExpanded={() => setIsChartExpanded(!isChartExpanded)}
				/>
			</div>
		</div>
	);
}

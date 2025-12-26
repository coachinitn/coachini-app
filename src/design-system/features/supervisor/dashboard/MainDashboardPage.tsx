'use client';

import { useState, useEffect, useMemo } from 'react';
import { Users, Calendar, Star, ArrowRight, Maximize2 } from 'lucide-react';
import { PageHeader } from '@/design-system/ui/components/page-header/page-header';
import {
	ProgressBar,
	AttendanceSection,
	ProgressTimeline,
	TimelineItem,
	CoachingProgramCard,
	CoachingProgram,
	AffirmationCard,
} from '@/design-system/ui/components/metrics';
import { mockMetrics, MetricData } from './mock-data';
import SuggestionCard from '../../../ui/components/metrics/suggestion-card';
import MetricCardsDisplay from './MetricCardsDisplay';

import ProgramTable, {
	Program,
	SubProgram,
} from '../../../ui/components/table/ProgramTable';
import { sampleMembers } from '../themes/tabs/purchased-tab-details';
import { Card, CardContent, CardHeader } from '../../../ui/base/card';
import { Button } from '../../../ui/base/button';
import {
	mockAttendanceData,
	mockPrograms,
	mockSessionsData,
} from '../../../../lib/database/dummy-data';
import { cn, responsive } from '../../../../core/utils';
import ProgramsOverview, {
	ProgramOverviewData,
} from '../../../ui/components/table/ProgramsOverview';
import { NavHeader } from '../../../ui/components/navbar/nav-wrapper';
import NavigationWrapper from '../../../ui/layout/navigation-wrapper';
import SectionWrapper from '../../../ui/layout/section-wrapper';
import ScrollableContainer from '../../../ui/layout/scrollable-container';
export default function MainDashboardPageSupervisor() {
	const [isChartExpanded, setIsChartExpanded] = useState(false);

	// Normalized metrics structure using an object with IDs as keys
	const [metricsMap, setMetricsMap] = useState<Record<string, MetricData>>({});
	const [isLoading, setIsLoading] = useState(true);

	// Deep merge helper for nested objects
	const deepMerge = <T extends Record<string, any>>(
		target: T,
		source: Partial<T>,
	): T => {
		const output = { ...target };

		for (const key in source) {
			if (source.hasOwnProperty(key)) {
				if (
					source[key] &&
					typeof source[key] === 'object' &&
					!Array.isArray(source[key]) &&
					target[key] &&
					typeof target[key] === 'object'
				) {
					// If both are objects (but not arrays), recursively merge
					output[key] = deepMerge(target[key], source[key]);
				} else {
					// Otherwise, just replace the value
					output[key] = source[key] as any;
				}
			}
		}

		return output;
	};

	// Helper function to update a single metric with proper deep merging of nested objects
	const updateSingleMetric = (
		metricId: string,
		updatedData: Partial<MetricData>,
	) => {
		setMetricsMap((prev) => {
			if (!prev[metricId]) return prev; // Safeguard if metric doesn't exist

			return {
				...prev,
				[metricId]: deepMerge(prev[metricId], updatedData),
			};
		});
	};

	// Ordered list of metrics we want to display
	const metricOrder = ['employees', 'attendance', 'satisfaction'];

	// Get ordered metrics list from the normalized structure
	const orderedMetrics = useMemo(() => {
		return metricOrder.map((id) => metricsMap[id]).filter(Boolean);
	}, [metricsMap, metricOrder]);

	// Simulate fetching metrics with a delay
	useEffect(() => {
		const fetchMetrics = async () => {
			setIsLoading(true);
			try {
				// Simulate API call delay
				await new Promise((resolve) => setTimeout(resolve, 1500));

				// Convert array to normalized object with IDs as keys
				const normalizedMetrics = mockMetrics.reduce<
					Record<string, MetricData>
				>((acc, metric) => {
					acc[metric.id] = metric;
					return acc;
				}, {});

				// Set the metrics from mock data
				setMetricsMap(normalizedMetrics);
			} catch (error) {
				console.error('Error fetching metrics:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMetrics();
	}, []);

	// Simulate a WebSocket or real-time update every 10 seconds for the 'employees' metric
	useEffect(() => {
		if (isLoading) return;

		const employeesUpdateInterval = setInterval(() => {
			// Simulate different kinds of updates to test deep merging
			const updateType: number = Math.floor(Math.random() * 3);
			const newOnlineCount = Math.floor(Math.random() * 15);

			switch (updateType) {
				case 0:
					// Update just the value
					updateSingleMetric('employees', {
						value: String(10),
						secondaryDisplay: {
							value: String(newOnlineCount),
						},
					});
					console.log(
						'Updated employees metric with just new count:',
						newOnlineCount,
					);
					break;
				case 1:
					// Update value and change positive status
					updateSingleMetric('employees', {
						secondaryDisplay: {
							value: String(newOnlineCount),
							positive: newOnlineCount > 7, // Positive if more than half are online
						},
					});
					console.log(
						'Updated employees metric count and status:',
						newOnlineCount,
					);
					break;
				case 2:
					// Update multiple nested properties
					updateSingleMetric('employees', {
						secondaryDisplay: {
							value: String(newOnlineCount),
							// label: `active now`,
							// type: 'status'
						},
					});
					console.log(
						'Updated employees metric with multiple properties:',
						newOnlineCount,
					);
					break;
			}
		}, 10000); // Update every 10 seconds

		return () => clearInterval(employeesUpdateInterval);
	}, [isLoading]);

	// Dummy data for ProgramsOverview - replace with actual data fetching and transformation logic
	const programsOverviewData: ProgramOverviewData[] = [
		{
			id: '1',
			sessionName: 'Prévention des Risques Psychosociaux',
			members: sampleMembers.slice(0, 3),
			attendance: 92,
			completion: 75,
			sessionImage:
				'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
		},
		{
			id: '2',
			sessionName: 'Gestion du Stress au Travail',
			members: sampleMembers.slice(2, 5),
			attendance: 88,
			completion: 60,
		},
		{
			id: '3',
			sessionName: "Leadership et Management d'Équipe",
			members: sampleMembers.slice(1, 4),
			attendance: 95,
			completion: 85,
			sessionImage:
				'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80',
		},
		{
			id: '4',
			sessionName: 'Gestion du Stress au Travail',
			members: sampleMembers.slice(2, 5),
			attendance: 88,
			completion: 60,
		},
		{
			id: '5',
			sessionName: 'Gestion du Stress au Travail',
			members: sampleMembers.slice(2, 5),
			attendance: 88,
			completion: 60,
		},
		{
			id: '6',
			sessionName: 'Gestion du Stress au Travail',
			members: sampleMembers.slice(2, 5),
			attendance: 88,
			completion: 60,
		},
		{
			id: '7',
			sessionName: 'Gestion du Stress au Travail',
			members: sampleMembers.slice(2, 5),
			attendance: 88,
			completion: 60,
		},
		{
			id: '8',
			sessionName: 'Gestion du Stress au Travail',
			members: sampleMembers.slice(2, 5),
			attendance: 88,
			completion: 60,
		},
	];

	const handleProgramOverviewClick = (program: ProgramOverviewData) => {
		console.log('Program Overview Clicked:', program.sessionName);
	};

	const handleProgramClick = (program: CoachingProgram) => {
		console.log('Program clicked:', program.title);
	};

	return (
		<NavigationWrapper>
			{/* Metrics Section */}
			<SectionWrapper>
				<div
					className={cn(
						'flex flex-col w-full gap-4',
						responsive('md:flex-col lg:flex-row'),
					)}
				>
					<MetricCardsDisplay
						isLoading={isLoading}
						orderedMetrics={orderedMetrics}
					/>
					<AffirmationCard
						title="Affirmation"
						message="The challenge you\'re facing is making you stronger."
					/>
				</div>
				{/* Main Dashboard Content - Masonry Layout */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Left Content - Column 1 & 2 */}
					<div className="flex flex-col gap-6 lg:col-span-2">
						{/* Programs Overview Table */}
						<div className="p-6 overflow-hidden bg-white rounded-lg shadow-sm">
							<div className="flex items-center justify-between mb-4">
								<div>
									<h3 className="text-lg font-medium">Programs</h3>
									<p className="text-sm text-green-500">2 done this month</p>
								</div>
							</div>
							<div className="h-[320px]">
								<ScrollableContainer className="h-full" contentClassName="h-full">
									<ProgramsOverview
										programs={programsOverviewData}
										onRowClick={handleProgramOverviewClick}
									/>
								</ScrollableContainer>
							</div>
						</div>

						{/* Attendance Section */}
						<AttendanceSection data={mockAttendanceData} />
					</div>

					{/* Right Column Content - Stacked Vertically */}
					<div className="flex flex-col gap-6 lg:col-span-1">
						{/* Suggested Coaching Program Card */}
						<SuggestionCard
							title="Suggested coaching program"
							program="Prévention des Risques Psychosociaux"
							imageSrc="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
							onClick={() => console.log('Coaching program clicked')}
						/>
						{/* Current Progress Overview */}
						<ProgressTimeline items={mockSessionsData} />
					</div>
				</div>
			</SectionWrapper>
		</NavigationWrapper>
	);
}

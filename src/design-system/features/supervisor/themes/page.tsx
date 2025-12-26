'use client';
import React from 'react';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/design-system/ui/base/tabs';

import { toast } from 'sonner';
import TabNavigation, {
	TabItem,
	useTabNavigation,
} from '../../../ui/layout/content-tab-navigation';
import CourseCard from '../../../ui/layout/content-tab-navigation/CourseCard';
import EmployeeTable, {
	Employee,
} from '../../../ui/components/table/EmployeeTable';
import { useScrollLock } from 'usehooks-ts';
import { ContentLayout } from '../../../ui';
import { Button } from '@/design-system/ui/base/button';
import { Filter } from 'lucide-react';
import PurchasedTabDetailsSupervisor, {
	sampleEmployees,
} from './tabs/purchased-tab-details';
import {
	PurchasedTabSupervisor,
	sampleMembers,
	TabHeader,
} from './tabs/purchased-tab';
import {
	FilterComponent,
	FilterOption,
	FilterTag,
	RatingFilter,
	StatusFilter,
} from '../../../ui/components/filter';
import AvailableTab from './tabs/available-tab';
import { useFilter } from '@/core/hooks/useFilter';
import NavigationWrapper from '../../../ui/layout/navigation-wrapper';
import SectionWrapper from '../../../ui/layout/section-wrapper';
import PageTabNavigation from '../../../ui/layout/page-tab-navigation';

const ThemesPageSupervisor = () => {
	const {
		filters,
		activeFilterId,
		hasActiveFilters,
		setActiveFilterId,
		updateFilter,
		removeFilter,
		resetFilters,
		getFilterValues,
	} = useFilter({
		// Using a scope for themes-specific filters
		scope: 'themes',
		// Enable URL synchronization for bookmark/sharing support
		searchParamsEnabled: true,
		onFilterChange: (filters) => {
			console.log('Theme filters changed:', filters);
		},
	});

	// Get typed filter values
	const selectedDates = getFilterValues<Date>('date');
	const selectedRatings = getFilterValues<number>('rating');
	const selectedStatuses = getFilterValues<string>('status');
	const selectedThemeTypes = getFilterValues<string>('themeType');

	// Handler functions for each filter type
	const handleDateFilterChange = (dates: Date[]) => {
		updateFilter('date', dates);
		console.log('Date filter changed:', dates);
	};

	const handleRatingChange = (ratings: number[]) => {
		updateFilter('rating', ratings);
		console.log('Rating filter changed:', ratings);
	};

	const handleStatusChange = (statuses: string[]) => {
		updateFilter('status', statuses);
		console.log('Status filter changed:', statuses);
	};

	const handleFilter = () => {
		toast('Filter button clicked');
	};
	const courseTabItems: TabItem[] = [
		{
			id: 'available',
			label: 'Available',
			// description:
			// 'Find the perfect fit: Browse our curated selection of coaching solutions.',
			// header: (
			// 	<div className="flex flex-col gap-2">
			// 		<FilterComponent options={filterOptions} onReset={resetFilters} />
			// 		{/* Display filter tags */}
			// 		{hasActiveFilters && (
			// 			<div className="flex flex-wrap gap-2 ">
			// 				{/* Date filter tags */}
			// 				{selectedDates.map((date, index) => (
			// 					<FilterTag
			// 						key={`date-${index}`}
			// 						label={date.toLocaleDateString()}
			// 						onRemove={() => removeFilter('date', date)}
			// 					/>
			// 				))}

			// 				{/* Status filter tags */}
			// 				{selectedStatuses.map((status) => (
			// 					<FilterTag
			// 						key={`status-${status}`}
			// 						label={status}
			// 						onRemove={() => removeFilter('status', status)}
			// 					/>
			// 				))}

			// 				{/* Rating filter tags */}
			// 				{selectedRatings.map((rating) => (
			// 					<FilterTag
			// 						key={`rating-${rating}`}
			// 						label={`${rating} stars`}
			// 						onRemove={() => removeFilter('rating', rating)}
			// 					/>
			// 				))}

			// 				{/* Theme type filter tags */}
			// 				{selectedThemeTypes.map((type) => (
			// 					<FilterTag
			// 						key={`themeType-${type}`}
			// 						label={type}
			// 						onRemove={() => removeFilter('themeType', type)}
			// 					/>
			// 				))}
			// 			</div>
			// 		)}
			// 	</div>
			// ),
			content: <AvailableTab />,
			// content: <div></div>,
		},
		{
			id: 'purchased',
			label: 'Purchased',
			content: <PurchasedTabSupervisor />,
			// header: <TabHeader />,
			// content: <div></div>,
		},
		{
			id: 'saved',
			label: 'Saved',
			content: <div></div>,
		},
	];


	
	const tabs: TabItem[] = [
		{
			id: 'coaches',
			label: 'Coaches',
			content: (
					 <TabNavigation
						tabs={courseTabItems}
						onFilter={handleFilter}
						buildPanel={{
							enabled: true,
							title: 'Build your program',
							buildButtonText: 'Build',
							emptyMessage: 'Add courses to build your program',
						}}
					/>
			),
		},
		{
			id: 'business',
			label: 'Business',
			content: <h1>HELLO</h1>,
		},
	];
	

	return (
		<NavigationWrapper>
			<SectionWrapper className="py-0">
				<div className="relative h-[calc(100vh-10rem)] overflow-hidden">
					{/* <TabNavigation
						tabs={courseTabItems}
						onFilter={handleFilter}
						buildPanel={{
							enabled: true,
							title: 'Build your program',
							buildButtonText: 'Build',
							emptyMessage: 'Add courses to build your program',
						}}
					/> */}
 <TabNavigation
						tabs={courseTabItems}
						onFilter={handleFilter}
						buildPanel={{
							enabled: true,
							title: 'Build your program',
							buildButtonText: 'Build',
							emptyMessage: 'Add courses to build your program',
						}}
					/>
					{/* <PageTabNavigation tabs={tabs} /> */}
				</div>
			</SectionWrapper>
		</NavigationWrapper>
	);
};

export default ThemesPageSupervisor;

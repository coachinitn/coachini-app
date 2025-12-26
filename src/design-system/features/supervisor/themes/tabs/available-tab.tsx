import React, { useState } from 'react';
import { toast } from '../../../../ui/base/sonner';
import { useTabNavigation } from '../../../../ui/layout/content-tab-navigation';
import { courseTabs } from './mock.data';
import ScrollableContainer from '../../../../ui/layout/scrollable-container';
import { Button } from '../../../../ui/base/button';
import { ArrowRight, Facebook, Send, ShoppingCart } from 'lucide-react';
import { IconButton } from '../../../../ui/base/IconButton';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ContentCard } from '../../../../ui/components/content-card';

function AvailableTab() {
	// Sample data for themes
	const themesData = [
		{
			id: '1',
			category: 'Team management / Cohesion',
			title: 'Team management / Cohesion',
			description:
				'The art of expressing oneself with confidence and kindness quick-win stand not beforehand downloaded.',
			bookmarked: true,
			requestCount: 12,
			requestLabel: 'Requested this theme',
			users: [
				{ id: '1', avatar: '/placeholder.svg?height=32&width=32' },
				{ id: '2', avatar: '/placeholder.svg?height=32&width=32' },
			],
		},
		{
			id: '2',
			category: 'Employer brand strategy',
			title: 'Employer brand strategy',
			description:
				'The art of expressing oneself with confidence and kindness quick-win stand not beforehand downloaded.',
			bookmarked: true,
			requestCount: 12,
			requestLabel: 'Requested this theme',
			users: [{ id: '1', avatar: '/placeholder.svg?height=32&width=32' }],
		},
		{
			id: '3',
			category: 'Effective communication',
			title: 'Effective communication',
			description: "Serenity and zen at work: Yes, it's possible !",
			bookmarked: true,
			requestCount: 12,
			requestLabel: 'Requested this theme',
			users: [
				{ id: '1', avatar: '/placeholder.svg?height=32&width=32' },
				{ id: '2', avatar: '/placeholder.svg?height=32&width=32' },
				{ id: '3', avatar: '/placeholder.svg?height=32&width=32' },
			],
			image: '/placeholder.svg?height=200&width=400',
		},
		{
			id: '4',
			category: 'Team management',
			title: 'Team management',
			description: "Serenity and zen at work: Yes, it's possible !",
			bookmarked: false,
			requestCount: 12,
			requestLabel: 'Requested this theme',
			users: [
				{ id: '1', avatar: '/placeholder.svg?height=32&width=32' },
				{ id: '2', avatar: '/placeholder.svg?height=32&width=32' },
				{ id: '3', avatar: '/placeholder.svg?height=32&width=32' },
			],
			image: '/placeholder.svg?height=200&width=400',
		},
		{
			id: '5',
			category: 'Team management / Cohesion',
			title: 'Team management / Cohesion',
			description:
				'The art of expressing oneself with confidence and kindness quick-win stand not beforehand downloaded.',
			bookmarked: true,
			requestCount: 12,
			requestLabel: 'Requested this theme',
			users: [
				{ id: '1', avatar: '/placeholder.svg?height=32&width=32' },
				{ id: '2', avatar: '/placeholder.svg?height=32&width=32' },
			],
		},
		{
			id: '6',
			category: 'Employer brand strategy',
			title: 'Employer brand strategy',
			description:
				'The art of expressing oneself with confidence and kindness quick-win stand not beforehand downloaded.',
			bookmarked: true,
			requestCount: 12,
			requestLabel: 'Requested this theme',
			users: [{ id: '1', avatar: '/placeholder.svg?height=32&width=32' }],
		},
		{
			id: '7',
			category: 'Effective communication',
			title: 'Effective communication',
			description: "Serenity and zen at work: Yes, it's possible !",
			bookmarked: true,
			requestCount: 12,
			requestLabel: 'Requested this theme',
			users: [
				{ id: '1', avatar: '/placeholder.svg?height=32&width=32' },
				{ id: '2', avatar: '/placeholder.svg?height=32&width=32' },
				{ id: '3', avatar: '/placeholder.svg?height=32&width=32' },
			],
			// image: '/placeholder.svg?height=200&width=400',
		},
		{
			id: '8',
			title: 'Team management',
			bookmarked: false,
			requestCount: 12,
			requestLabel: 'Requested this theme',
			users: [
				{ id: '1', avatar: '/placeholder.svg?height=32&width=32' },
				{ id: '2', avatar: '/placeholder.svg?height=32&width=32' },
				{ id: '3', avatar: '/placeholder.svg?height=32&width=32' },
			],
			// image: '/placeholder.svg?height=200&width=400',
		},
		{
			id: '9',
			category: 'Team management / Cohesion',
			title: 'Team management / Cohesion',
			description:
				'The art of exprehand downloaded.',
			bookmarked: true,
			requestCount: 12,
			requestLabel: 'Requested this theme',
			users: [
				{ id: '1', avatar: '/placeholder.svg?height=32&width=32' },
				{ id: '2', avatar: '/placeholder.svg?height=32&width=32' },
			],
		},
		{
			id: '9',
			title: 'Team management / Cohesion',
	
			bookmarked: true,
			requestCount: 12,
			requestLabel: 'Requested this theme',
			users: [
				{ id: '1', avatar: '/placeholder.svg?height=32&width=32' },
				{ id: '2', avatar: '/placeholder.svg?height=32&width=32' },
			],
		},
	];

	const { addToBuildPanel, buildPanelEnabled } = useTabNavigation();

	const handleSave = (courseId: string) => {
		toast.success('Course saved to your collection');
	};

	const handleViewDetails = (courseId: string) => {
		toast.info(`Viewing details for course ${courseId}`);
	};

	const [isLoading, setIsLoading] = useState(false);

	const handleLoadingDemo = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	};
	const handleBookmarkToggle = (id: string) => {
		console.log(`Toggle bookmark for theme ${id}`);
	};
	return (
		<ScrollableContainer alwaysShowScrollbar>
			<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1200: 3 , 1700: 4 }}>
				<Masonry gutter="16px" >
					{themesData.map((theme) => (
						<ContentCard
						className='w-full'
						key={theme.id}
						title={theme.title}
						subtitle={theme.category}
						description={theme.description}
						image={theme.image}
						bookmarked={theme.bookmarked}
						members={theme.users}
						// requestCount={showRequests ? theme.requestCount : undefined}
						// requestLabel={showRequests ? theme.requestLabel : undefined}
						onBookmark={() => handleBookmarkToggle(theme.id)}
						onViewDetails={() => handleViewDetails(theme.id)}
						onMemberClick={() => console.log('Add member')}
						actionLabel="View Details"
						renderCustomFooter={() => (
							<div className="flex items-center justify-between w-full">
								<div className="flex -space-x-2">
									{theme.users.map((user) => (
										<img
											key={user.id}
											src={user.avatar || '/placeholder.svg'}
											alt="User"
											className="w-8 h-8 border-2 border-white rounded-full"
										/>
									))}
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										className="px-4 text-blue-600 border-blue-200 rounded-full hover:bg-blue-50"
										onClick={() => handleViewDetails(theme.id)}
									>
										View Details
									</Button>
									<Button
										variant="outline"
										className="text-blue-600 border-blue-200 rounded-full hover:bg-blue-50"
										onClick={() => addToBuildPanel(theme)}
									>
										<ShoppingCart className="w-4 h-4" />
									</Button>
								</div>
							</div>
						)}
					/>
				))}
				</Masonry>
			</ResponsiveMasonry>
		</ScrollableContainer>
	);
}

export default AvailableTab;

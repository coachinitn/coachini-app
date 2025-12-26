'use client';
import React, { useState } from 'react';
import { Button } from '@/design-system/ui/base/button';
import { Filter, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import TeamTable from './TeamTable';
import  { Team } from '../../../../ui/layout/team-card/TeamCard';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import ScrollableContainer from '../../../../ui/layout/scrollable-container';
import { ContentCard } from '../../../../ui/components/content-card';
import { useTabNavigation } from '../../../../ui/layout/content-tab-navigation';
import { TeamCard } from '../../../../ui/components/team-card';

export const TeamsTabHeader = () => {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
      <div className="flex items-center space-x-4">
        <h3 className="text-lg font-semibold">My Teams</h3>
        <span className="text-sm text-gray-500">5 teams</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
    </div>
  );
};

export const SupervisorTeamsTab = () => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);

  // const handleViewDetails = (team: Team) => {
  //   setSelectedTeam(team);
  //   setShowDetails(true);
  //   // In a real implementation, you would use router.push here
  //   toast.info(`Viewing details for team ${team.name}`);
  // };

  const handleViewDetails = (courseId: string) => {
		toast.info(`Viewing details for course ${courseId}`);
	};

  const handleBack = () => {
    setShowDetails(false);
    setSelectedTeam(null);
  };



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
			<ResponsiveMasonry
				columnsCountBreakPoints={{ 350: 1, 750: 2, 1200: 3, 1700: 4 }}
			>
				<Masonry gutter="16px">
					<TeamCard
						name={'My Team'}
						program="Team description goes here"
						employeeCount={5}
						// members={themesData[0].users}
						onViewDetails={() => handleViewDetails(themesData[0].id)}
					/>
					{themesData.map((theme) => (
						<ContentCard
							className="w-full"
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
};


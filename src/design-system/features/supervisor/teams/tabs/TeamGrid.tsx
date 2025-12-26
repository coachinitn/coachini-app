'use client';
import React from 'react';
import TeamCard, { Team } from '@/design-system/ui/layout/team-card/TeamCard';
import { useTabNavigation } from '@/design-system/ui/layout/content-tab-navigation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Sample teams data
const sampleTeams: Team[] = [
  {
    id: '1',
    name: 'Marketing Team',
    description: 'Responsible for all marketing activities and campaigns',
    department: 'Marketing',
    membersCount: 8,
    members: [
      { id: '1', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=1', role: 'Team Lead' },
      { id: '2', name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2', role: 'Content Writer' },
      { id: '3', name: 'Carol Williams', avatar: 'https://i.pravatar.cc/150?img=3', role: 'Social Media Specialist' },
    ],
    isSaved: true,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070',
  },
  {
    id: '2',
    name: 'Product Development',
    description: 'Designs and develops our product offerings',
    department: 'Engineering',
    membersCount: 12,
    members: [
      { id: '4', name: 'David Brown', avatar: 'https://i.pravatar.cc/150?img=4', role: 'Lead Developer' },
      { id: '5', name: 'Eve Davis', avatar: 'https://i.pravatar.cc/150?img=5', role: 'Product Manager' },
      { id: '6', name: 'Frank Miller', avatar: 'https://i.pravatar.cc/150?img=6', role: 'UX Designer' },
    ],
    isSaved: false,
    imageUrl: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1974',
  },
  {
    id: '3',
    name: 'Customer Support',
    description: 'Provides assistance and support to our customers',
    department: 'Operations',
    membersCount: 6,
    members: [
      { id: '7', name: 'Grace Lee', avatar: 'https://i.pravatar.cc/150?img=7', role: 'Support Manager' },
      { id: '8', name: 'Harry Wilson', avatar: 'https://i.pravatar.cc/150?img=8', role: 'Support Specialist' },
    ],
    isSaved: true,
    imageUrl: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=1974',
  },
  {
    id: '4',
    name: 'Finance Department',
    description: 'Manages financial planning and accounting',
    department: 'Finance',
    membersCount: 5,
    members: [
      { id: '9', name: 'Irene Thomas', avatar: 'https://i.pravatar.cc/150?img=9', role: 'Financial Analyst' },
      { id: '10', name: 'Jack Moore', avatar: 'https://i.pravatar.cc/150?img=10', role: 'Accountant' },
    ],
    isSaved: false,
    imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1974',
  },
  {
    id: '5',
    name: 'HR & Recruiting',
    description: 'Handles talent acquisition and employee relations',
    department: 'Human Resources',
    membersCount: 4,
    members: [
      { id: '11', name: 'Kate Anderson', avatar: 'https://i.pravatar.cc/150?img=11', role: 'HR Manager' },
      { id: '12', name: 'Leo Jackson', avatar: 'https://i.pravatar.cc/150?img=12', role: 'Recruiter' },
    ],
    isSaved: true,
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974',
  }
];

interface TeamGridProps {
  teams?: Team[];
  type?: 'all' | 'saved' | 'my';
}

const TeamGrid: React.FC<TeamGridProps> = ({
  teams = sampleTeams,
  type = 'all',
}) => {
  const { addToBuildPanel, buildPanelEnabled } = useTabNavigation();
  // const router = useRouter();

  const displayTeams = React.useMemo(() => {
    if (type === 'saved') {
      return teams.filter(team => team.isSaved);
    } else if (type === 'my') {
      // For demo purposes, assume the first 3 teams are "my teams"
      return teams.slice(0, 3);
    }
    return teams;
  }, [teams, type]);

  const handleSave = (teamId: string) => {
    toast.success('Team saved to your collection');
  };

  const handleViewDetails = (teamId: string) => {
    // In a real implementation, you would use router here
    // router.push(`/supervisor/teams/${teamId}`);
    toast.info(`Viewing details for team ${teamId}`);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {displayTeams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onSave={() => handleSave(team.id)}
          onViewDetails={() => handleViewDetails(team.id)}
          onAddToProgram={
            buildPanelEnabled ? () => addToBuildPanel({ id: team.id, title: team.name }) : undefined
          }
        />
      ))}
    </div>
  );
};

export default TeamGrid;

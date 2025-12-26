'use client';
import React from 'react';
import { Button } from '@/design-system/ui/base/button';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';
import TeamTable from './TeamTable';
import { Team } from '../../../../ui/layout/team-card/TeamCard';
import { mockEmployees } from '../../../../../lib/database/dummy-data';
import ScrollableContainer from '../../../../ui/layout/scrollable-container';
import EmployeeTable from '../../../../ui/components/table/EmployeeTable';

export const EmployeesTabHeader = () => {
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

export const SupervisorEmployeesTab = () => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);

  const handleViewDetails = (team: Team) => {
    setSelectedTeam(team);
    setShowDetails(true);
    // In a real implementation, you would use router.push here
    toast.info(`Viewing details for team ${team.name}`);
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedTeam(null);
  };

  return (
		// <div className="overflow-auto h-[300px]">
		<ScrollableContainer>
			<EmployeeTable employees={mockEmployees} onEdit={() => {}} />
		</ScrollableContainer>

		// </div>
	);
};

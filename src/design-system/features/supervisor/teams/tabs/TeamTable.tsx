'use client';
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableDivider,
} from '@/design-system/ui/components/table/Table';
import { Team } from '@/design-system/ui/layout/team-card/TeamCard';
import { Button } from '@/design-system/ui/base/button';
import { AvatarGroup } from '@/design-system/ui/components/avatar-group';
import { Avatar } from '@/design-system/ui/base/avatar';
import { Eye, Users } from 'lucide-react';

// Sample data
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
  }
];

interface TeamTableProps {
  type?: 'all' | 'saved' | 'my';
  onViewDetails?: (team: Team) => void;
  compact?: boolean;
}

const TeamTable: React.FC<TeamTableProps> = ({
  type = 'my',
  onViewDetails,
  compact = false,
}) => {
  const teams = React.useMemo(() => {
    if (type === 'saved') {
      return sampleTeams.filter(team => team.isSaved);
    } else if (type === 'my') {
      // For demo purposes, assume the first 3 teams are "my teams"
      return sampleTeams.slice(0, 3);
    }
    return sampleTeams;
  }, [type]);

  return (
    <Table compact={compact}>
      <TableHeader>
        <TableRow withDivider={true}>
          <TableHead className="w-[300px]">TEAM</TableHead>
          <TableHead>DEPARTMENT</TableHead>
          <TableHead>MEMBERS</TableHead>
          <TableHead>TEAM LEAD</TableHead>
          <TableHead className="text-right">ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team, index) => (
          <React.Fragment key={team.id}>
            <TableRow
              withDivider={true}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className={compact ? 'h-8 w-8' : 'h-10 w-10'}>
                    {team.imageUrl ? (
                      <img
                        src={team.imageUrl}
                        alt={team.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-white bg-blue-500">
                        {team.name.charAt(0)}
                      </div>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium">{team.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-[200px]">
                      {team.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{team.department}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{team.membersCount}</span>
                </div>
              </TableCell>
              <TableCell>
                {team.members.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <img
                        src={team.members[0].avatar}
                        alt={team.members[0].name}
                        className="object-cover w-full h-full"
                      />
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{team.members[0].name}</div>
                      <div className="text-xs text-gray-500">{team.members[0].role}</div>
                    </div>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                {onViewDetails && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 rounded-full"
                    onClick={() => onViewDetails(team)}
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                )}
              </TableCell>
            </TableRow>
            {index < teams.length - 1 && !true && <TableDivider />}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default TeamTable;

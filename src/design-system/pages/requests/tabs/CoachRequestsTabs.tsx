'use client';

import React from 'react';
import CoachRequestsTable from '../components/CoachRequestsTable';
import { CoachRequest } from '../types';
import TabNavigation, { TabItem } from '../../../ui/layout/content-tab-navigation';

interface CoachRequestsTabsProps {
  requests: CoachRequest[];
}

const CoachRequestsTabs: React.FC<CoachRequestsTabsProps> = ({ requests }) => {
  // Helper function to filter coach requests by status
  const filterCoachRequestsByStatus = (requests: CoachRequest[], status: string): CoachRequest[] => {
    switch (status) {
      case 'requests':
        return requests;
      case 'accepted':
        return requests.filter(r => r.status === 'accepted');
      case 'rejected':
        return requests.filter(r => r.status === 'rejected');
      case 'pending':
        return requests.filter(r => r.status === 'pending');
      default:
        return requests;
    }
  };

  // Coach content tabs
  const coachTabItems: TabItem[] = [
    {
      id: 'requests',
      label: 'Requests',
      content: (
        <CoachRequestsTable
          requests={filterCoachRequestsByStatus(requests, 'requests')}
        />
      ),
    },
    {
      id: 'accepted',
      label: 'Accepted',
      content: (
        <CoachRequestsTable
          requests={filterCoachRequestsByStatus(requests, 'accepted')}
        />
      ),
    },
    {
      id: 'rejected',
      label: 'Rejected',
      content: (
        <CoachRequestsTable
          requests={filterCoachRequestsByStatus(requests, 'rejected')}
        />
      ),
    },
    {
      id: 'pending',
      label: 'Pending',
      content: (
        <CoachRequestsTable
          requests={filterCoachRequestsByStatus(requests, 'pending')}
        />
      ),
    },
  ];

  return <TabNavigation tabs={coachTabItems} />;
};

export default CoachRequestsTabs;

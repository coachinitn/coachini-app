'use client';

import React from 'react';
import TabNavigation, {  TabItem } from '../../../ui/layout/content-tab-navigation';
import BusinessRequestsTable from '../components/BusinessRequestsTable';
import { BusinessRequest } from '../types';

interface BusinessRequestsTabsProps {
  requests: BusinessRequest[];
}

const BusinessRequestsTabs: React.FC<BusinessRequestsTabsProps> = ({ requests }) => {
  // Helper function to filter business requests by status
  const filterBusinessRequestsByStatus = (requests: BusinessRequest[], status: string): BusinessRequest[] => {
    switch (status) {
      case 'requests':
        return requests;
      case 'deal-won':
        return requests.filter(r => r.dealProgress === 'deal-won');
      case 'deal-lost':
        return requests.filter(r => r.dealProgress === 'deal-lost');
      case 'demo-requests':
        return requests.filter(r => r.demoRequests);
      case 'build-requests':
        return requests.filter(r => r.buildRequests);
      default:
        return requests;
    }
  };

  // Business content tabs
  const businessTabItems: TabItem[] = [
    {
      id: 'requests',
      label: 'Requests',
      content: (
        <BusinessRequestsTable
          requests={filterBusinessRequestsByStatus(requests, 'requests')}
          variant="default"
        />
      ),
    },
    {
      id: 'deal-won',
      label: 'Deal Won',
      content: (
        <BusinessRequestsTable
          requests={filterBusinessRequestsByStatus(requests, 'deal-won')}
          variant="deal-status"
        />
      ),
    },
    {
      id: 'deal-lost',
      label: 'Deal Lost',
      content: (
        <BusinessRequestsTable
          requests={filterBusinessRequestsByStatus(requests, 'deal-lost')}
          variant="deal-status"
        />
      ),
    },
    {
      id: 'demo-requests',
      label: 'Demo Requests',
      content: (
        <BusinessRequestsTable
          requests={filterBusinessRequestsByStatus(requests, 'demo-requests')}
          variant="demo-build"
        />
      ),
    },
    {
      id: 'build-requests',
      label: 'Build Requests',
      content: (
        <BusinessRequestsTable
          requests={filterBusinessRequestsByStatus(requests, 'build-requests')}
          variant="demo-build"
        />
      ),
    },
  ];

  return <TabNavigation tabs={businessTabItems} />;
};

export default BusinessRequestsTabs;

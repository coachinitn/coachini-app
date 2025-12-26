'use client';

import React from 'react';
import CoachAccountsTableNew from '../components/CoachAccountsTableNew';
import { CoachAccount } from '../types';
import TabNavigation, { TabItem } from '../../../ui/layout/content-tab-navigation';

interface CoachAccountsTabsNewProps {
  accounts: CoachAccount[];
}

const CoachAccountsTabsNew: React.FC<CoachAccountsTabsNewProps> = ({ accounts }) => {
  // Helper function to filter coach accounts by status
  const filterCoachAccountsByStatus = (accounts: CoachAccount[], status: string): CoachAccount[] => {
    switch (status) {
      case 'accepted':
        return accounts.filter(a => a.status === 'accepted');
      case 'created':
        return accounts.filter(a => a.status === 'created');
      case 'deleted':
        return accounts.filter(a => a.status === 'deleted');
      default:
        return accounts;
    }
  };

  // Coach content tabs
  const coachTabItems: TabItem[] = [
    {
      id: 'accepted',
      label: 'Accepted Accounts',
      content: (
        <CoachAccountsTableNew
          accounts={filterCoachAccountsByStatus(accounts, 'accepted')}
          variant="accepted"
        />
      ),
    },
    {
      id: 'created',
      label: 'Created Accounts',
      content: (
        <CoachAccountsTableNew
          accounts={filterCoachAccountsByStatus(accounts, 'created')}
          variant="created"
        />
      ),
    },
    {
      id: 'deleted',
      label: 'Deleted Accounts',
      content: (
        <CoachAccountsTableNew
          accounts={filterCoachAccountsByStatus(accounts, 'deleted')}
          variant="deleted"
        />
      ),
    },
  ];

  return <TabNavigation tabs={coachTabItems} />;
};

export default CoachAccountsTabsNew;

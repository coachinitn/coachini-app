'use client';

import React from 'react';
import BusinessAccountsTable from '../components/BusinessAccountsTable';
import { BusinessAccount } from '../types';
import TabNavigation, { TabItem } from '../../../ui/layout/content-tab-navigation';

interface BusinessAccountsTabsProps {
  accounts: BusinessAccount[];
}

const BusinessAccountsTabs: React.FC<BusinessAccountsTabsProps> = ({ accounts }) => {
  // Helper function to filter business accounts by status
  const filterBusinessAccountsByStatus = (accounts: BusinessAccount[], status: string): BusinessAccount[] => {
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

  // Business content tabs
  const businessTabItems: TabItem[] = [
    {
      id: 'accepted',
      label: 'Accepted Accounts',
      content: (
        <BusinessAccountsTable
          accounts={filterBusinessAccountsByStatus(accounts, 'accepted')}
          variant="accepted"
        />
      ),
    },
    {
      id: 'created',
      label: 'Created Accounts',
      content: (
        <BusinessAccountsTable
          accounts={filterBusinessAccountsByStatus(accounts, 'created')}
          variant="created"
        />
      ),
    },
    {
      id: 'deleted',
      label: 'Deleted Accounts',
      content: (
        <BusinessAccountsTable
          accounts={filterBusinessAccountsByStatus(accounts, 'deleted')}
          variant="deleted"
        />
      ),
    },
  ];

  return <TabNavigation tabs={businessTabItems} />;
};

export default BusinessAccountsTabs;

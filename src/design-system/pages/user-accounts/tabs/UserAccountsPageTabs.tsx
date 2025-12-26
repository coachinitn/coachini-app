'use client';

import React from 'react';
import { TabItem } from '../../../ui/layout/content-tab-navigation';
import CoachAccountsTabs from './CoachAccountsTabs';
import BusinessAccountsTabs from './BusinessAccountsTabs';
import { CoachAccount, BusinessAccount } from '../types';

interface UserAccountsPageTabsProps {
  coachAccounts: CoachAccount[];
  businessAccounts: BusinessAccount[];
}

const UserAccountsPageTabs = ({
  coachAccounts,
  businessAccounts,
}: UserAccountsPageTabsProps): TabItem[] => {
  // Main page tabs (PageTabNavigation level)
  const tabs: TabItem[] = [
    {
      id: 'coaches',
      label: 'Coaches',
      content: <CoachAccountsTabs accounts={coachAccounts} />,
    },
    {
      id: 'business',
      label: 'Business',
      content: <BusinessAccountsTabs accounts={businessAccounts} />,
    },
  ];

  return tabs;
};

export default UserAccountsPageTabs;

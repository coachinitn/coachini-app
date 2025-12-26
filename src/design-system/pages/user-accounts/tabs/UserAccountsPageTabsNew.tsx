'use client';

import React from 'react';
import { TabItem } from '../../../ui/layout/content-tab-navigation';
import CoachAccountsTabsNew from './CoachAccountsTabsNew';
import BusinessAccountsTabs from './BusinessAccountsTabs';
import { CoachAccount, BusinessAccount } from '../types';

interface UserAccountsPageTabsNewProps {
  coachAccounts: CoachAccount[];
  businessAccounts: BusinessAccount[];
}

const UserAccountsPageTabsNew = ({
  coachAccounts,
  businessAccounts,
}: UserAccountsPageTabsNewProps): TabItem[] => {
  // Main page tabs (PageTabNavigation level)
  const tabs: TabItem[] = [
    {
      id: 'coaches',
      label: 'Coaches',
      content: <CoachAccountsTabsNew accounts={coachAccounts} />,
    },
    {
      id: 'business',
      label: 'Business',
      content: <BusinessAccountsTabs accounts={businessAccounts} />,
    },
  ];

  return tabs;
};

export default UserAccountsPageTabsNew;

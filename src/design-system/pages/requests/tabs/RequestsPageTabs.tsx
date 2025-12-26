'use client';

import React from 'react';
import { TabItem } from '../../../ui/layout/content-tab-navigation';
import CoachRequestsTabs from './CoachRequestsTabs';
import BusinessRequestsTabs from './BusinessRequestsTabs';
import { CoachRequest, BusinessRequest } from '../types';

interface RequestsPageTabsProps {
  coachRequests: CoachRequest[];
  businessRequests: BusinessRequest[];
}

const RequestsPageTabs = ({
  coachRequests,
  businessRequests,
}: RequestsPageTabsProps): TabItem[] => {
  // Main page tabs (PageTabNavigation level)
  const tabs: TabItem[] = [
    {
      id: 'coaches',
      label: 'Coaches',
      content: <CoachRequestsTabs requests={coachRequests} />,
    },
    {
      id: 'business',
      label: 'Business',
      content: <BusinessRequestsTabs requests={businessRequests} />,
    },
  ];

  return tabs;
};

export default RequestsPageTabs;

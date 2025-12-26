'use client';

import React from 'react';
import { UserAccountsStats } from '../types';
import { MetricCard } from '../../../ui';
import {
  TotalRequestsIcon,
  CoachRequestsIcon,
  BusinessRequestsIcon,
  RequestsAcceptedIcon
} from '../../../icons';

interface UserAccountsStatsHeaderProps {
  stats: UserAccountsStats;
  className?: string;
}

const UserAccountsStatsHeader: React.FC<UserAccountsStatsHeaderProps> = ({
  stats,
  className = '',
}) => {
  return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-[34px] ${className}`}>
          {/* Total Requests */}
          <MetricCard
              title='Total Requests'
              value={stats.total}
              displayType='number'
              secondaryDisplay={{
                  value: Math.abs(stats.changeFromLastMonth),
                  label: `since 04/04/24`,
                  type: 'trend',
                  positive: stats.changeFromLastMonth > 0,
                  unit: '%'
              }}
              icon={<TotalRequestsIcon className='w-6 h-6 text-blue-600' />}
              iconClassName='bg-blue-50'
          />

          {/* Coaches Requests */}
          <MetricCard
              title='Coaches Requests'
              value={stats.coaches}
              displayType='number'
              secondaryDisplay={{
                  value: Math.abs(stats.changeFromLastMonth),
                  label: `since 04/04/24`,
                  type: 'trend',
                  positive: stats.changeFromLastMonth > 0,
                  unit: '%'
              }}
              icon={<CoachRequestsIcon className='w-6 h-6 text-green-600' />}
              iconClassName='bg-green-50'
          />

          {/* Business Requests */}
          <MetricCard
              title='Business Requests'
              value={stats.business}
              displayType='number'
              secondaryDisplay={{
                  value: Math.abs(stats.changeFromLastMonth),
                  label: `since 04/04/24`,
                  type: 'trend',
                  positive: stats.changeFromLastMonth > 0
              }}
              unit='%'
              icon={<BusinessRequestsIcon className='w-6 h-6 text-yellow-600' />}
              iconClassName='bg-yellow-50'
          />

          {/* Requests Accepted */}
          <MetricCard
              title='Requests Accepted'
              value={stats.accepted}
              displayType='number'
              secondaryDisplay={{
                  value: '2',
                  label: 'Connected',
                  type: 'status',
                  positive: true
              }}
              icon={<RequestsAcceptedIcon className='w-6 h-6 text-purple-600' />}
              iconClassName='bg-purple-50'
          />
      </div>
  );
};

export default UserAccountsStatsHeader;

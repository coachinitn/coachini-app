'use client';

import React from 'react';
import { RequestsStats } from '../types';
import { MetricCard } from '../../../ui';
import {
  TotalRequestsIcon,
  CoachRequestsIcon,
  BusinessRequestsIcon,
  RequestsAcceptedIcon
} from '../../../icons';

interface RequestsStatsHeaderProps {
  stats: RequestsStats;
  className?: string;
}

const RequestsStatsHeader: React.FC<RequestsStatsHeaderProps> = ({
  stats,
  className = '',
}) => {
  return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ${className}`}>
          {/* Total Requests */}
          <MetricCard
              title='Total Requests'
              value={stats.total}
              displayType='number'
              secondaryDisplay={{
                  value: Math.abs(stats.changeFromLastMonth),
                  label: `since 01/07/25`,
                  type: 'trend',
                  positive: stats.changeFromLastMonth > 0,
                  unit: '%'
              }}
              icon={<TotalRequestsIcon className='w-[26px] h-[26px] text-primary-900' />}
              iconClassName='bg-primary-50'
          />

          {/* Coaches Requests */}
          <MetricCard
              title='Coaches Requests'
              value={stats.coaches}
              displayType='number'
              secondaryDisplay={{
                  value: Math.abs(stats.changeFromLastMonth),
                  label: `since 01/07/25`,
                  type: 'trend',
                  positive: stats.changeFromLastMonth > 0,
                  unit: '%'
              }}
              icon={<CoachRequestsIcon className='w-[24px] h-[24px] text-tertiary-900' />}
              iconClassName='bg-tertiary-100'
          />

          {/* Business Requests */}
          <MetricCard
              title='Business Requests'
              value={stats.business}
              displayType='number'
              secondaryDisplay={{
                  value: Math.abs(stats.changeFromLastMonth),
                  label: `since 01/07/25`,
                  type: 'trend',
                  positive: stats.changeFromLastMonth > 0,
                  unit: '%'
              }}
              icon={<BusinessRequestsIcon className='w-[26px] h-[26px] text-secondary-900' />}
              iconClassName='bg-secondary-300'
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
              icon={<RequestsAcceptedIcon className='w-[32px] h-[32px] text-primary-900' />}
              iconClassName='bg-primary-50'
          />
      </div>
  );
};

export default RequestsStatsHeader;

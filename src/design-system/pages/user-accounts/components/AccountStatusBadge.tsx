'use client';

import React from 'react';
import { Badge } from '@/design-system/ui/base/badge';
import { AccountStatus } from '../types';
import { cn } from '@/core/utils';

interface AccountStatusBadgeProps {
  status: AccountStatus;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const AccountStatusBadge: React.FC<AccountStatusBadgeProps> = ({
  status,
  size = 'md',
  onClick,
  className,
}) => {
  const getStatusConfig = (status: AccountStatus) => {
    switch (status) {
      case 'accepted':
        return {
          label: 'Accepted',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 hover:bg-green-200',
        };
      case 'created':
        return {
          label: 'Created',
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        };
      case 'deleted':
        return {
          label: 'Deleted',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 hover:bg-red-200',
        };
      case 'pending':
        return {
          label: 'Pending',
          variant: 'outline' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        };
      case 'suspended':
        return {
          label: 'Suspended',
          variant: 'destructive' as const,
          className: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
        };
      case 'active':
        return {
          label: 'Active',
          variant: 'default' as const,
          className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
        };
      default:
        return {
          label: status,
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        };
    }
  };

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-base px-4 py-2';
      case 'md':
      default:
        return 'text-sm px-3 py-1.5';
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);

  return (
    <Badge
      variant={config.variant}
      className={cn(
        config.className,
        sizeClasses,
        onClick && 'cursor-pointer transition-colors',
        className
      )}
      onClick={onClick}
    >
      {config.label}
    </Badge>
  );
};

export default AccountStatusBadge;

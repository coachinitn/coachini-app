import React from 'react';
import { cn } from '@/core/utils';
import { RequestStatus, DealProgress } from '../types';

interface RequestStatusBadgeProps {
  status: RequestStatus | DealProgress;
  className?: string;
  variant?: 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({
  status,
  className,
  variant = 'filled',
  size = 'md',
  onClick,
}) => {
  const getStatusStyles = (
    status: RequestStatus | DealProgress,
    variant: 'filled' | 'outline',
  ) => {
    const styles = {
      // Request statuses
      pending:
        variant === 'filled'
          ? 'bg-orange-100 text-orange-600 border-orange-200'
          : 'bg-white text-orange-600 border border-orange-400',
      accepted:
        variant === 'filled'
          ? 'bg-green-100 text-green-600 border-green-200'
          : 'bg-white text-green-600 border border-green-500',
      rejected:
        variant === 'filled'
          ? 'bg-red-100 text-red-600 border-red-200'
          : 'bg-white text-red-600 border border-red-500',
      'on-hold':
        variant === 'filled'
          ? 'bg-blue-100 text-blue-600 border-blue-200'
          : 'bg-white text-blue-600 border border-blue-500',
      
      // Deal progress statuses
      'deal-won':
        variant === 'filled'
          ? 'bg-green-100 text-green-600 border-green-200'
          : 'bg-white text-green-600 border border-green-500',
      'deal-lost':
        variant === 'filled'
          ? 'bg-red-100 text-red-600 border-red-200'
          : 'bg-white text-red-600 border border-red-500',
      
      // Call statuses
      'call-made':
        variant === 'filled'
          ? 'bg-blue-100 text-blue-600 border-blue-200'
          : 'bg-white text-blue-600 border border-blue-500',
      'call-not-made':
        variant === 'filled'
          ? 'bg-gray-100 text-gray-600 border-gray-200'
          : 'bg-white text-gray-600 border border-gray-400',
    };

    return styles[status] || styles.pending;
  };

  const getStatusLabel = (status: RequestStatus | DealProgress) => {
    const labels = {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      'on-hold': 'On Hold',
      'deal-won': 'Deal Won',
      'deal-lost': 'Deal Lost',
      'call-made': 'Call Made',
      'call-not-made': 'Call Not Made',
    };

    return labels[status] || status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        getStatusStyles(status, variant),
        sizeClasses[size],
        onClick && 'cursor-pointer hover:opacity-80',
        className,
      )}
      onClick={onClick}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default RequestStatusBadge;

'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/design-system/ui/base/button';
import { Eye } from 'lucide-react';
import { BusinessRequest } from '../types';
import { useBusinessRequestActions } from '../context/RequestActionsContext';
import RequestStatusBadge from './RequestStatusBadge';
import { cn } from '@/core/utils';
import { DataTable } from '../../../ui/components/data-table/data-table';

interface BusinessRequestsTableProps {
  requests: BusinessRequest[];
  variant?: 'default' | 'deal-status' | 'demo-build';
  className?: string;
}

const BusinessRequestsTable: React.FC<BusinessRequestsTableProps> = ({
  requests,
  variant = 'default',
  className,
}) => {
  // Get actions from context - no prop drilling!
  const {
    onView,
    onStatusChange,
    onDealProgressChange,
    onCallStatusChange,
    isLoading,
    hasError,
  } = useBusinessRequestActions();
  const baseColumns: ColumnDef<BusinessRequest>[] = [
    {
      accessorKey: 'user.name',
      header: 'User',
      cell: ({ row }) => {
        const request = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{request.user.name}</span>
            <span className="text-sm text-gray-500">{request.date}</span>
            <span className="text-sm text-gray-500">{request.time}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'userInformations',
      header: 'User Informations',
      cell: ({ row }) => {
        const request = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-sm text-gray-900">{request.user.email}</span>
            <span className="text-sm text-gray-500">{request.user.phone}</span>
            <span className="text-sm text-gray-500">{request.user.role}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'companyDetails',
      header: 'Company Details',
      cell: ({ row }) => {
        const request = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{request.companyDetails.name}</span>
            <span className="text-sm text-gray-500">{request.companyDetails.code}</span>
            <span className="text-sm text-gray-500">{request.companyDetails.industry}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'note',
      header: 'Note',
      cell: ({ row }) => {
        const note = row.getValue('note') as string;
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-600 line-clamp-3">{note}</p>
          </div>
        );
      },
    },
  ];

  // Add variant-specific columns
  const columns = [...baseColumns];

  if (variant === 'default' || variant === 'demo-build') {
    // Add Call State and Deal Progress columns for default and demo-build variants
    columns.push(
      {
        accessorKey: 'callStatus',
        header: 'Call State',
        cell: ({ row }) => {
          const request = row.original;
          return (
            <div className="flex flex-col gap-1">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  request.callStatus === 'call-made'
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                )}
                onClick={() => onCallStatusChange(request.id, 'call-made')}
              >
                Call Made
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  request.callStatus === 'call-not-made'
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                )}
                onClick={() => onCallStatusChange(request.id, 'call-not-made')}
              >
                Call Not Made
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: 'dealProgress',
        header: 'Deal Progress',
        cell: ({ row }) => {
          const request = row.original;
          return (
            <div className="flex flex-col gap-1">
              <RequestStatusBadge
                status="deal-won"
                size="sm"
                onClick={() => onDealProgressChange(request.id, 'deal-won')}
                variant={request.dealProgress === 'deal-won' ? 'filled' : 'outline'}
              />
              <RequestStatusBadge
                status="pending"
                size="sm"
                onClick={() => onDealProgressChange(request.id, 'pending')}
                variant={request.dealProgress === 'pending' ? 'filled' : 'outline'}
              />
              <RequestStatusBadge
                status="on-hold"
                size="sm"
                onClick={() => onDealProgressChange(request.id, 'on-hold')}
                variant={request.dealProgress === 'on-hold' ? 'filled' : 'outline'}
              />
              <RequestStatusBadge
                status="deal-lost"
                size="sm"
                onClick={() => onDealProgressChange(request.id, 'deal-lost')}
                variant={request.dealProgress === 'deal-lost' ? 'filled' : 'outline'}
              />
            </div>
          );
        },
      }
    );
  } else if (variant === 'deal-status') {
    // Add Deal Progress and Date columns for deal status variants
    columns.push(
      {
        accessorKey: 'dealProgress',
        header: 'Deal Progress',
        cell: ({ row }) => {
          const request = row.original;
          return (
            <div className="flex flex-col gap-1">
              <RequestStatusBadge
                status="deal-won"
                size="sm"
                onClick={() => onDealProgressChange(request.id, 'deal-won')}
                variant={request.dealProgress === 'deal-won' ? 'filled' : 'outline'}
              />
              <RequestStatusBadge
                status="pending"
                size="sm"
                onClick={() => onDealProgressChange(request.id, 'pending')}
                variant={request.dealProgress === 'pending' ? 'filled' : 'outline'}
              />
              <RequestStatusBadge
                status="on-hold"
                size="sm"
                onClick={() => onDealProgressChange(request.id, 'on-hold')}
                variant={request.dealProgress === 'on-hold' ? 'filled' : 'outline'}
              />
              <RequestStatusBadge
                status="deal-lost"
                size="sm"
                onClick={() => onDealProgressChange(request.id, 'deal-lost')}
                variant={request.dealProgress === 'deal-lost' ? 'filled' : 'outline'}
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => {
          const request = row.original;
          const statusText = request.dealProgress === 'deal-won' ? 'Deal won on :' : 'Deal lost on :';
          return (
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">{statusText}</span>
              <span className="text-sm font-medium">{request.date}</span>
              <span className="text-sm text-gray-500">{request.time}</span>
            </div>
          );
        },
      }
    );
  }

  // Add Actions column (always last)
  columns.push({
    accessorKey: 'actions',
    header: variant === 'demo-build' ? 'Deal Progress' : 'Actions',
    cell: ({ row }) => {
      const request = row.original;

      if (variant === 'demo-build') {
        return (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => onView(request)}
            >
              Details
            </Button>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(request)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <RequestStatusBadge
            status={request.status}
            size="sm"
            onClick={() => onStatusChange(request.id, request.status)}
          />
        </div>
      );
    },
  });

  return (
    <div className={cn('space-y-4', className)}>
      <DataTable
        columns={columns}
        data={requests}
        searchKey="user.name"
        searchPlaceholder="Search business requests..."
        showSearch={false}
        showPagination={true}
        pageSize={10}
        className="border-0"
      />
    </div>
  );
};

export default BusinessRequestsTable;

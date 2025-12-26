'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/design-system/ui/base/button';
import { FileText, Eye } from 'lucide-react';
import { BusinessAccount } from '../types';
import { useBusinessAccountActions } from '../context/UserAccountActionsContext';
import AccountStatusBadge from './AccountStatusBadge';
import { cn } from '@/core/utils';
import { DataTable } from '../../../ui/components/data-table/data-table';

interface BusinessAccountsTableProps {
  accounts: BusinessAccount[];
  variant?: 'accepted' | 'created' | 'deleted';
  className?: string;
}

const BusinessAccountsTable: React.FC<BusinessAccountsTableProps> = ({
  accounts,
  variant = 'accepted',
  className,
}) => {
  // Get actions from context - no prop drilling!
  const {
    onView,
    onStatusChange,
    onDealStatusChange,
    onCreateAccount,
    onDelete,
  } = useBusinessAccountActions();

  const columns: ColumnDef<BusinessAccount>[] = [
    {
      accessorKey: 'user.name',
      header: 'User',
      cell: ({ row }) => {
        const account = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{account.user.name}</span>
            <span className="text-sm text-gray-500">{account.date}</span>
            <span className="text-sm text-gray-500">{account.time}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'userInformations',
      header: 'User Informations',
      cell: ({ row }) => {
        const account = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{account.userInformations.email}</span>
            <span className="text-sm text-gray-500">{account.userInformations.phone}</span>
            <span className="text-sm text-gray-500">{account.userInformations.role}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'companyDetails',
      header: 'Company Details',
      cell: ({ row }) => {
        const account = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{account.companyDetails.name}</span>
            <span className="text-sm text-gray-500">{account.companyDetails.code}</span>
            <span className="text-sm text-gray-500">{account.companyDetails.industry}</span>
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

  // Add different action columns based on variant
  if (variant === 'accepted') {
    columns.push({
      accessorKey: 'actions',
      header: 'Account Creation',
      cell: ({ row }) => {
        const account = row.original;
        return (
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm text-gray-600">Deal won on :</span>
            <span className="text-sm text-gray-500">{account.accountCreation || account.date}</span>
            <span className="text-sm text-gray-500">{account.time}</span>
          </div>
        );
      },
    });
    
    columns.push({
      accessorKey: 'dealStatus',
      header: 'Deal Status',
      cell: ({ row }) => {
        const account = row.original;
        return (
          <div className="flex items-center">
            <AccountStatusBadge
              status={account.dealStatus as any}
              size="sm"
            />
          </div>
        );
      },
    });
  } else if (variant === 'created') {
    columns.push({
      accessorKey: 'actions',
      header: 'Account Creation',
      cell: ({ row }) => {
        const account = row.original;
        return (
          <div className="flex flex-col items-start gap-2">
            <Button
              size="sm"
              onClick={() => onCreateAccount(account)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Account
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(account.id)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Delete Account
            </Button>
          </div>
        );
      },
    });
    
    columns.push({
      accessorKey: 'dealStatus',
      header: 'Deal Status',
      cell: ({ row }) => {
        const account = row.original;
        return (
          <div className="flex items-center">
            <AccountStatusBadge
              status={account.dealStatus as any}
              size="sm"
            />
          </div>
        );
      },
    });
  } else if (variant === 'deleted') {
    columns.push({
      accessorKey: 'actions',
      header: 'Delete Account',
      cell: ({ row }) => {
        const account = row.original;
        return (
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(account.id)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Delete Account
            </Button>
          </div>
        );
      },
    });
    
    columns.push({
      accessorKey: 'status',
      header: 'Account Status',
      cell: ({ row }) => {
        const account = row.original;
        return (
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm text-gray-600">Account deleted on :</span>
            <span className="text-sm text-gray-500">{account.deletedAt ? new Date(account.deletedAt).toLocaleDateString() : account.date}</span>
            <span className="text-sm text-gray-500">{account.time}</span>
          </div>
        );
      },
    });
  }

  return (
    <div className={cn('space-y-4', className)}>
      <DataTable
        columns={columns}
        data={accounts}
        searchKey="user.name"
        searchPlaceholder="Search business accounts..."
      />
    </div>
  );
};

export default BusinessAccountsTable;

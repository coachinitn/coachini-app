'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/design-system/ui/base/button';
import { FileText, Eye } from 'lucide-react';
import { CoachRequest } from '../types';
import { useCoachRequestActions } from '../context/RequestActionsContext';
import RequestStatusBadge from './RequestStatusBadge';
import { cn } from '@/core/utils';
import { DataTable } from '../../../ui/components/data-table/data-table';

interface CoachRequestsTableProps {
  requests: CoachRequest[];
  className?: string;
}

const CoachRequestsTable: React.FC<CoachRequestsTableProps> = ({
  requests,
  className,
}) => {
  // Get actions from context - no prop drilling!
  const {
    onView,
    onStatusChange,
    onFileDownload,
  } = useCoachRequestActions();
  const columns: ColumnDef<CoachRequest>[] = [
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
    {
      accessorKey: 'files',
      header: 'Files',
      cell: ({ row }) => {
        const request = row.original;
        const hasFiles = request.files && request.files.length > 0;
        return (
          <div className="flex items-center">
            {hasFiles ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => request.files?.[0] && onFileDownload(request.files[0].id, request.files[0].name)}
              >
                <FileText className="w-4 h-4 mr-1" />
                PDF
              </Button>
            ) : (
              <span className="text-sm text-gray-400">No files</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Actions',
      cell: ({ row }) => {
        const request = row.original;
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
    },
  ];

  return (
    <div className={cn(className)}>
      <DataTable
        columns={columns}
        data={requests}
        searchKey="user.name"
        searchPlaceholder="Search coach requests..."
        showSearch={false}
        showPagination={false}
        pageSize={10}
        className="border-0"
      />
    </div>
  );
};

export default CoachRequestsTable;

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/design-system/ui/base/dropdown-menu';
import { Button } from '@/design-system/ui/base/button';
import { ChevronDown } from 'lucide-react';
import { RequestStatus } from '../types';
import RequestStatusBadge from './RequestStatusBadge';

interface RequestStatusDropdownProps {
  currentStatus: RequestStatus;
  onStatusChange: (newStatus: RequestStatus) => void;
  disabled?: boolean;
}

const RequestStatusDropdown: React.FC<RequestStatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
}) => {
  const statusOptions: RequestStatus[] = [
    'pending',
    'accepted',
    'rejected',
    'on-hold',
    'deal-won',
    'deal-lost',
  ];

  const handleStatusChange = (newStatus: RequestStatus) => {
    if (newStatus !== currentStatus) {
      onStatusChange(newStatus);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={disabled}
          className="h-auto p-1"
        >
          <RequestStatusBadge status={currentStatus} size="sm" />
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {statusOptions.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            className="cursor-pointer"
          >
            <RequestStatusBadge status={status} size="sm" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RequestStatusDropdown;

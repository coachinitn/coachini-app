'use client';

import React from 'react';
import { CoachAccount } from '../types';
import { useCoachAccountActions } from '../context/UserAccountActionsContext';
import { cn } from '@/core/utils';
import CoachUserAccountsTableNew, { CoachUserAccount } from '../../../ui/components/table/CoachUserAccountsTableNew';

interface CoachAccountsTableNewProps {
  accounts: CoachAccount[];
  variant?: 'accepted' | 'created' | 'deleted';
  className?: string;
}

const CoachAccountsTableNew: React.FC<CoachAccountsTableNewProps> = ({
  accounts,
  variant = 'accepted',
  className,
}) => {
  // Get actions from context - no prop drilling!
  const {
    onView,
    onStatusChange,
    onFileDownload,
    onCreateAccount,
    onDelete,
  } = useCoachAccountActions();

  // Convert CoachAccount[] to CoachUserAccount[]
  const convertedAccounts: CoachUserAccount[] = accounts.map((account) => ({
    id: account.id,
    user: {
      name: account.user.name,
      date: account.date,
      time: account.time || '',
    },
    userInformations: {
      email: account.userInformations.email,
      phone: account.userInformations.phone,
      role: account.userInformations.role || '',
    },
    details: {
      platform: account.companyDetails.name,
      experience: account.companyDetails.industry,
      expertise: account.companyDetails.code,
    },
    note: account.note,
    hasFiles: account.files ? account.files.length > 0 : false,
    accountStatus: mapAccountStatus(account.status),
    dealStatus: mapDealStatus(variant),
    createdDate: new Date(account.createdAt).toLocaleDateString(),
    createdTime: new Date(account.createdAt).toLocaleTimeString(),
  }));

  // Helper function to map account status
  function mapAccountStatus(status: string): 'account created' | 'coach accepted' | 'account deleted' {
    switch (status) {
      case 'accepted':
        return 'coach accepted';
      case 'created':
        return 'account created';
      case 'deleted':
        return 'account deleted';
      default:
        return 'account created';
    }
  }

  // Helper function to map deal status based on variant
  function mapDealStatus(variant: string): 'created' | 'accepted' | 'deleted' {
    switch (variant) {
      case 'accepted':
        return 'accepted';
      case 'created':
        return 'created';
      case 'deleted':
        return 'deleted';
      default:
        return 'created';
    }
  }

  // Handle account creation
  const handleCreateAccount = (account: CoachUserAccount) => {
    const originalAccount = accounts.find(a => a.id === account.id);
    if (originalAccount) {
      onCreateAccount(originalAccount);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = (account: CoachUserAccount) => {
    onDelete(account.id);
  };

  // Handle file viewing
  const handleViewFiles = (account: CoachUserAccount) => {
    const originalAccount = accounts.find(a => a.id === account.id);
    if (originalAccount && originalAccount.files && originalAccount.files.length > 0) {
      const file = originalAccount.files[0];
      onFileDownload(file.id, file.name);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <CoachUserAccountsTableNew
        accounts={convertedAccounts}
        variant={variant}
        onCreateAccount={handleCreateAccount}
        onDeleteAccount={handleDeleteAccount}
        onViewFiles={handleViewFiles}
      />
    </div>
  );
};

export default CoachAccountsTableNew;

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { UserAccount, CoachAccount, BusinessAccount, AccountStatus } from '../types';

// Generic action types that can be extended
export interface UserAccountActionHandlers {
  // Core actions
  onView: (account: UserAccount) => void;
  onEdit: (account: UserAccount) => void;
  onDelete: (accountId: string) => void;
  onCreateAccount: (account: UserAccount) => void;
  
  // Status actions
  onStatusChange: (accountId: string, newStatus: AccountStatus) => void;
  
  // Business-specific actions
  onDealStatusChange?: (accountId: string, newStatus: 'deal-won' | 'pending' | 'on-hold' | 'deal-lost') => void;
  
  // Coach-specific actions
  onFileDownload?: (fileId: string, fileName: string) => void;
  
  // Generic action for extensibility
  onCustomAction?: (actionType: string, accountId: string, payload?: any) => void;
}

// Context for sharing actions across components
const UserAccountActionsContext = createContext<UserAccountActionHandlers | null>(null);

// Provider component
interface UserAccountActionsProviderProps {
  children: ReactNode;
  customActions: UserAccountActionHandlers;
}

export const UserAccountActionsProvider: React.FC<UserAccountActionsProviderProps> = ({
  children,
  customActions,
}) => {
  return (
    <UserAccountActionsContext.Provider value={customActions}>
      {children}
    </UserAccountActionsContext.Provider>
  );
};

// Generic hook for any account actions
export const useUserAccountActions = (): UserAccountActionHandlers => {
  const context = useContext(UserAccountActionsContext);
  if (!context) {
    throw new Error('useUserAccountActions must be used within a UserAccountActionsProvider');
  }
  return context;
};

// Specialized hook for business account actions
export const useBusinessAccountActions = () => {
  const actions = useUserAccountActions();
  
  return {
    onView: (account: BusinessAccount) => actions.onView(account),
    onEdit: (account: BusinessAccount) => actions.onEdit(account),
    onDelete: actions.onDelete,
    onCreateAccount: (account: BusinessAccount) => actions.onCreateAccount(account),
    onStatusChange: actions.onStatusChange,
    onDealStatusChange: actions.onDealStatusChange || (() => {}),
    onCustomAction: actions.onCustomAction || (() => {}),
  };
};

// Specialized hook for coach account actions
export const useCoachAccountActions = () => {
  const actions = useUserAccountActions();
  
  return {
    onView: (account: CoachAccount) => actions.onView(account),
    onEdit: (account: CoachAccount) => actions.onEdit(account),
    onDelete: actions.onDelete,
    onCreateAccount: (account: CoachAccount) => actions.onCreateAccount(account),
    onStatusChange: actions.onStatusChange,
    onFileDownload: actions.onFileDownload || (() => {}),
    onCustomAction: actions.onCustomAction || (() => {}),
  };
};

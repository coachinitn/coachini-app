/**
 * Types for the admin user accounts management system
 */

export type AccountType = 'coach' | 'business';

export type AccountStatus =
  | 'accepted'
  | 'created'
  | 'deleted'
  | 'pending'
  | 'suspended'
  | 'active';

export interface UserInformation {
  name: string;
  email: string;
  phone: string;
  role?: string;
  avatarUrl?: string;
}

export interface CompanyDetails {
  name: string;
  code: string;
  industry: string;
  size?: string;
  website?: string;
}

export interface AccountBase {
  id: string;
  user: UserInformation;
  userInformations: UserInformation; // For compatibility with existing patterns
  companyDetails: CompanyDetails;
  note: string;
  date: string;
  time?: string;
  status: AccountStatus;
  type: AccountType;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CoachAccount extends AccountBase {
  type: 'coach';
  dealStatus?: 'deal-won' | 'pending' | 'on-hold' | 'deal-lost';
  files?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export interface BusinessAccount extends AccountBase {
  type: 'business';
  dealStatus: 'deal-won' | 'pending' | 'on-hold' | 'deal-lost';
  accountCreation?: string;
  demoRequests?: boolean;
  buildRequests?: boolean;
}

export type UserAccount = CoachAccount | BusinessAccount;

export interface UserAccountsStats {
  total: number;
  coaches: number;
  business: number;
  accepted: number;
  changeFromLastMonth: number;
}

export interface AccountFilters {
  status?: AccountStatus[];
  type?: AccountType[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  searchQuery?: string;
}

export interface AccountTableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface AccountActions {
  onStatusChange: (accountId: string, newStatus: AccountStatus) => void;
  onViewDetails: (account: UserAccount) => void;
  onEdit: (account: UserAccount) => void;
  onDelete: (accountId: string) => void;
  onCreateAccount: (account: UserAccount) => void;
  onExport: (accounts: UserAccount[]) => void;
}

export interface BusinessAccountActions {
  onStatusChange: (accountId: string, newStatus: AccountStatus) => void;
  onDealStatusChange: (accountId: string, newStatus: 'deal-won' | 'pending' | 'on-hold' | 'deal-lost') => void;
  onViewDetails: (account: BusinessAccount) => void;
  onEdit: (account: BusinessAccount) => void;
  onDelete: (accountId: string) => void;
  onCreateAccount: (account: BusinessAccount) => void;
}

export interface CoachAccountActions {
  onStatusChange: (accountId: string, newStatus: AccountStatus) => void;
  onViewDetails: (account: CoachAccount) => void;
  onEdit: (account: CoachAccount) => void;
  onDelete: (accountId: string) => void;
  onCreateAccount: (account: CoachAccount) => void;
  onFileDownload: (fileId: string, fileName: string) => void;
}

// Tab content types for different account views
export type AccountTabType = 'accepted' | 'created' | 'deleted';

export interface AccountTabContent {
  id: AccountTabType;
  label: string;
  accounts: UserAccount[];
}

// Action button types for tables
export type AccountActionType = 'create' | 'delete' | 'view' | 'edit';

export interface AccountActionButton {
  type: AccountActionType;
  label: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary';
  onClick: () => void;
}

/**
 * Types for the admin requests management system
 */

export type RequestType = 'coach' | 'business';

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'on-hold'
  | 'deal-won'
  | 'deal-lost'
  | 'call-made'
  | 'call-not-made';

export type DealProgress =
  | 'deal-won'
  | 'pending'
  | 'on-hold'
  | 'deal-lost';

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

export interface RequestBase {
  id: string;
  user: UserInformation;
  userInformations: UserInformation; // For compatibility with existing patterns
  companyDetails: CompanyDetails;
  note: string;
  date: string;
  time?: string;
  status: RequestStatus;
  type: RequestType;
  createdAt: string;
  updatedAt: string;
}

export interface CoachRequest extends RequestBase {
  type: 'coach';
  dealProgress?: DealProgress;
  callStatus?: 'call-made' | 'call-not-made';
  files?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export interface BusinessRequest extends RequestBase {
  type: 'business';
  dealProgress: DealProgress;
  callStatus?: 'call-made' | 'call-not-made';
  demoRequests?: boolean;
  buildRequests?: boolean;
}

export type Request = CoachRequest | BusinessRequest;

export interface RequestsStats {
  total: number;
  coaches: number;
  business: number;
  accepted: number;
  changeFromLastMonth: number;
}

export interface RequestFilters {
  status?: RequestStatus[];
  type?: RequestType[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  searchQuery?: string;
}

export interface RequestTableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface RequestActions {
  onStatusChange: (requestId: string, newStatus: RequestStatus) => void;
  onViewDetails: (request: Request) => void;
  onEdit: (request: Request) => void;
  onDelete: (requestId: string) => void;
  onExport: (requests: Request[]) => void;
}

export interface BusinessRequestActions {
  onStatusChange: (requestId: string, newStatus: RequestStatus) => void;
  onDealProgressChange: (requestId: string, newProgress: DealProgress) => void;
  onCallStatusChange: (requestId: string, newCallStatus: 'call-made' | 'call-not-made') => void;
  onViewDetails: (request: BusinessRequest) => void;
  onEdit: (request: BusinessRequest) => void;
  onDelete: (requestId: string) => void;
}

export interface CoachRequestActions {
  onStatusChange: (requestId: string, newStatus: RequestStatus) => void;
  onViewDetails: (request: CoachRequest) => void;
  onEdit: (request: CoachRequest) => void;
  onDelete: (requestId: string) => void;
  onFileDownload: (fileId: string, fileName: string) => void;
}

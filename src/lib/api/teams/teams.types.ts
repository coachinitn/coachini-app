/**
 * Teams API Types
 *
 * TypeScript interfaces for team-related operations
 */

export interface Team {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  memberCount: number;
  employeeCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  settings?: TeamSettings;
}

export interface TeamSettings {
  visibility?: 'private' | 'public';
  allowInvitations?: boolean;
  maxMembers?: number;
  requireApproval?: boolean;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'manager' | 'member' | 'viewer';
  joinedAt: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Employee {
  id: string;
  teamId: string;
  employeeId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  startDate?: string;
  status: 'active' | 'inactive' | 'on_leave';
  joinedAt: string;
}

export interface TeamCreateDto {
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
  settings?: Partial<TeamSettings>;
}

export interface TeamUpdateDto {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'archived';
  settings?: Partial<TeamSettings>;
}

export interface TeamMemberDto {
  userId: string;
  role?: 'owner' | 'manager' | 'member' | 'viewer';
}

/**
 * Teams React Query Layer
 *
 * React Query mutations and queries for team operations
 */

import { TeamsService } from './teams-service';
import type {
  TeamCreateDto,
  TeamUpdateDto,
  TeamMemberDto
} from './teams.types';

export const teamsQueries = {
  /**
   * Mutation for creating a new team
   */
  createTeam: () => ({
    mutationFn: (data: TeamCreateDto) => TeamsService.createTeam(data)
  }),

  /**
   * Mutation for updating a team
   */
  updateTeam: () => ({
    mutationFn: (params: { id: string; data: TeamUpdateDto }) =>
      TeamsService.updateTeam(params.id, params.data)
  }),

  /**
   * Mutation for deleting a team
   */
  deleteTeam: () => ({
    mutationFn: (id: string) => TeamsService.deleteTeam(id)
  }),

  /**
   * Mutation for adding a team member
   */
  addTeamMember: () => ({
    mutationFn: (params: { teamId: string; data: TeamMemberDto }) =>
      TeamsService.addTeamMember(params.teamId, params.data)
  }),

  /**
   * Mutation for removing a team member
   */
  removeTeamMember: () => ({
    mutationFn: (params: { teamId: string; memberId: string }) =>
      TeamsService.removeTeamMember(params.teamId, params.memberId)
  }),

  /**
   * Mutation for updating team member role
   */
  updateTeamMemberRole: () => ({
    mutationFn: (params: { teamId: string; memberId: string; role: string }) =>
      TeamsService.updateTeamMemberRole(params.teamId, params.memberId, params.role)
  }),

  /**
   * Mutation for adding a team employee
   */
  addTeamEmployee: () => ({
    mutationFn: (params: {
      teamId: string;
      data: { employeeId: string; role?: string; startDate?: string };
    }) => TeamsService.addTeamEmployee(params.teamId, params.data)
  }),

  /**
   * Mutation for removing a team employee
   */
  removeTeamEmployee: () => ({
    mutationFn: (params: { teamId: string; employeeId: string }) =>
      TeamsService.removeTeamEmployee(params.teamId, params.employeeId)
  }),

  /**
   * Query for getting all teams
   */
  getAllTeams: (page: number = 1, limit: number = 20, filters?: any) => ({
    queryKey: ['teams', 'list', { page, limit, ...filters }],
    queryFn: () => TeamsService.getAllTeams(page, limit, filters)
  }),

  /**
   * Query for getting a specific team
   */
  getTeamById: (id: string) => ({
    queryKey: ['teams', id],
    queryFn: () => TeamsService.getTeamById(id)
  }),

  /**
   * Query for getting team members
   */
  getTeamMembers: (teamId: string, page: number = 1, limit: number = 20) => ({
    queryKey: ['teams', teamId, 'members', { page, limit }],
    queryFn: () => TeamsService.getTeamMembers(teamId, page, limit)
  }),

  /**
   * Query for getting team employees
   */
  getTeamEmployees: (teamId: string, page: number = 1, limit: number = 20) => ({
    queryKey: ['teams', teamId, 'employees', { page, limit }],
    queryFn: () => TeamsService.getTeamEmployees(teamId, page, limit)
  })
};

/**
 * Error handling utilities
 */
export const getTeamErrorMessage = (error: any): string => {
  return TeamsService.handleTeamError(error);
};

export const getTeamErrorKey = (error: any): string => {
  return TeamsService.handleTeamError(error);
};

/**
 * Team validation utilities
 */
export const teamsValidation = {
  validateTeamName: (name: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Team name is required');
    } else if (name.trim().length < 2) {
      errors.push('Team name must be at least 2 characters');
    } else if (name.trim().length > 100) {
      errors.push('Team name must not exceed 100 characters');
    }

    return { isValid: errors.length === 0, errors };
  },

  validateTeamDescription: (description?: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (description && description.trim().length > 500) {
      errors.push('Team description must not exceed 500 characters');
    }

    return { isValid: errors.length === 0, errors };
  }
};

/**
 * Query keys for React Query cache management
 */
export const teamsQueryKeys = {
  all: ['teams'] as const,
  lists: () => [...teamsQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...teamsQueryKeys.lists(), { filters }] as const,
  details: () => [...teamsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...teamsQueryKeys.details(), id] as const,
  members: (teamId: string) => [...teamsQueryKeys.detail(teamId), 'members'] as const,
  employees: (teamId: string) => [...teamsQueryKeys.detail(teamId), 'employees'] as const
} as const;

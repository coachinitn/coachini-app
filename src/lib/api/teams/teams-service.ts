/**
 * Teams API Service
 *
 * Handles team management, memberships, and employee operations
 */

import { apiRequest } from '@/lib/api-client';
import { TEAMS_ERROR_CODE_TO_I18N_MAP } from '@/lib/api/teams/error-codes';
import type {
  Team,
  TeamMember,
  Employee,
  TeamCreateDto,
  TeamUpdateDto,
  TeamMemberDto
} from './teams.types';

export class TeamsService {
  private static readonly BASE_PATH = '/teams';

  /**
   * Create a new team
   */
  static async createTeam(data: TeamCreateDto): Promise<Team> {
    return apiRequest<Team>(`${this.BASE_PATH}`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Get all teams
   */
  static async getAllTeams(
    page: number = 1,
    limit: number = 20,
    filters?: {
      search?: string;
      status?: string;
      createdBy?: string;
    }
  ): Promise<{
    data: Team[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.createdBy && { createdBy: filters.createdBy })
    });

    return apiRequest(`${this.BASE_PATH}?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Get a specific team by ID
   */
  static async getTeamById(id: string): Promise<Team> {
    return apiRequest<Team>(`${this.BASE_PATH}/${id}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Update a team
   */
  static async updateTeam(id: string, data: TeamUpdateDto): Promise<Team> {
    return apiRequest<Team>(`${this.BASE_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Delete a team
   */
  static async deleteTeam(id: string): Promise<void> {
    return apiRequest<void>(`${this.BASE_PATH}/${id}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }

  /**
   * Get team members
   */
  static async getTeamMembers(
    teamId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: TeamMember[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    return apiRequest(`${this.BASE_PATH}/${teamId}/members?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Add a member to team
   */
  static async addTeamMember(teamId: string, data: TeamMemberDto): Promise<TeamMember> {
    return apiRequest<TeamMember>(`${this.BASE_PATH}/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Remove a member from team
   */
  static async removeTeamMember(teamId: string, memberId: string): Promise<void> {
    return apiRequest<void>(`${this.BASE_PATH}/${teamId}/members/${memberId}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }

  /**
   * Update team member role
   */
  static async updateTeamMemberRole(
    teamId: string,
    memberId: string,
    role: string
  ): Promise<TeamMember> {
    return apiRequest<TeamMember>(`${this.BASE_PATH}/${teamId}/members/${memberId}`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
      requireAuth: true
    });
  }

  /**
   * Get team employees
   */
  static async getTeamEmployees(
    teamId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: Employee[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    return apiRequest(`${this.BASE_PATH}/${teamId}/employees?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  }

  /**
   * Add an employee to team
   */
  static async addTeamEmployee(
    teamId: string,
    data: {
      employeeId: string;
      role?: string;
      startDate?: string;
    }
  ): Promise<Employee> {
    return apiRequest<Employee>(`${this.BASE_PATH}/${teamId}/employees`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true
    });
  }

  /**
   * Remove an employee from team
   */
  static async removeTeamEmployee(teamId: string, employeeId: string): Promise<void> {
    return apiRequest<void>(`${this.BASE_PATH}/${teamId}/employees/${employeeId}`, {
      method: 'DELETE',
      requireAuth: true
    });
  }

  /**
   * Handle API errors
   */
  static handleTeamError(error: any): string {
    if (!error.statusCode) {
      return 'errors.network';
    }

    if (error.errorCode) {
      const i18nKey = this.mapErrorCodeToI18n(error.errorCode);
      if (i18nKey) return i18nKey;
    }

    const messageMapping = this.mapErrorMessage(error.message);
    if (messageMapping) return messageMapping;

    switch (error.statusCode) {
      case 400:
        return 'errors.invalidTeamData';
      case 401:
        return 'errors.unauthorized';
      case 403:
        return 'errors.forbidden';
      case 404:
        return 'errors.teamNotFound';
      case 409:
        return 'errors.teamConflict';
      case 422:
        return 'errors.validationFailed';
      case 500:
        return 'errors.teamProcessingFailed';
      default:
        return 'errors.unexpected';
    }
  }

  private static mapErrorCodeToI18n(errorCode: string): string | null {
    return TEAMS_ERROR_CODE_TO_I18N_MAP[errorCode] || null;
  }

  private static mapErrorMessage(message: string): string | null {
    if (!message || typeof message !== 'string') return null;

    const messageLower = message.toLowerCase();

    if (messageLower.includes('not found') || messageLower.includes('does not exist')) {
      if (messageLower.includes('team')) {
        return 'errors.teamNotFound';
      }
      if (messageLower.includes('member')) {
        return 'errors.memberNotFound';
      }
      if (messageLower.includes('employee')) {
        return 'errors.employeeNotFound';
      }
    }

    if (messageLower.includes('already exists') || messageLower.includes('already assigned')) {
      if (messageLower.includes('member')) {
        return 'errors.memberAlreadyExists';
      }
      if (messageLower.includes('employee')) {
        return 'errors.employeeAlreadyAssigned';
      }
    }

    if (messageLower.includes('permission') || messageLower.includes('denied')) {
      return 'errors.teamPermissionDenied';
    }

    return null;
  }
}

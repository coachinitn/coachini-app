/**
 * Teams API Module
 *
 * Clean exports for team management functionality
 */

export { TeamsService } from './teams-service';

export {
  teamsQueries,
  getTeamErrorMessage,
  getTeamErrorKey,
  teamsValidation,
  teamsQueryKeys
} from './teams-queries';

export type {
  Team,
  TeamSettings,
  TeamMember,
  Employee,
  TeamCreateDto,
  TeamUpdateDto,
  TeamMemberDto
} from './teams.types';

/**
 * Programs API Module
 *
 * Clean exports for program management functionality
 */

export { ProgramsService } from './programs-service';

export {
  programsQueries,
  getProgramErrorMessage,
  getProgramErrorKey,
  programsValidation,
  programsQueryKeys
} from './programs-queries';

export type {
  Program,
  ProgramModule,
  ProgramLesson,
  ProgramEnrollment,
  ProgramCreateDto,
  ProgramUpdateDto
} from './programs.types';

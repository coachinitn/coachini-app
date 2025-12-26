// Base table components
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableDivider,
} from './Table';

// Specialized table components
export { default as DocumentTable } from './DocumentTable';
export { default as EmployeeTable } from './EmployeeTable';
export { default as SessionTable } from './SessionTable';
export { default as FileTable } from './FileTable';
export { default as ProgramTable } from './ProgramTable';
export { default as SuperProgramTable } from './SuperProgramTable';

// New user account table components
export { default as CoachUserAccountsTableNew } from './CoachUserAccountsTableNew';

// Additional components
export { default as StatusBadge } from './StatusBadge';
export { default as ProgressBar } from './ProgressBar';
export { default as StarRating } from './StarRating';
export { default as AvatarGroup } from './AvatarGroup';

// Types
export type { Document } from './DocumentTable';
export type { Employee } from './EmployeeTable';
export type { Session } from './SessionTable';
export type { FileItem } from './FileTable';
export type { Program, SubProgram } from './ProgramTable';
export type { CoachUserAccount } from './CoachUserAccountsTableNew';
export type { Member } from './AvatarGroup';

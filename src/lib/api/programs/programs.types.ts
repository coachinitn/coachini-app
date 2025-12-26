/**
 * Programs API Types
 *
 * TypeScript interfaces for program operations
 */

export interface ProgramModule {
  id: string;
  programId: string;
  title: string;
  description?: string;
  order: number;
  duration?: number;
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramLesson {
  id: string;
  programId: string;
  moduleId: string;
  title: string;
  description?: string;
  content?: string;
  duration?: number;
  order: number;
  attachmentIds?: string[];
  completionRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: 'draft' | 'published' | 'archived';
  isPublic: boolean;
  moduleCount: number;
  lessonCount: number;
  enrollmentCount: number;
  duration?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  coverImageId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ProgramEnrollment {
  id: string;
  programId: string;
  userId: string;
  status: 'active' | 'completed' | 'paused' | 'dropped';
  enrolledAt: string;
  completedAt?: string;
  completionPercentage: number;
  lastAccessedAt?: string;
}

export interface ProgramCreateDto {
  title: string;
  description?: string;
  category?: string;
  status?: 'draft' | 'published';
  isPublic?: boolean;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  coverImageId?: string;
}

export interface ProgramUpdateDto {
  title?: string;
  description?: string;
  category?: string;
  isPublic?: boolean;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  coverImageId?: string;
}

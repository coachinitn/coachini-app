/**
 * Sprints API Types
 *
 * TypeScript interfaces for sprint operations
 */

export interface SprintGoal {
  id: string;
  sprintId: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  metric: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface SprintMetrics {
  sprintId: string;
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  failedGoals: number;
  completionRate: number;
  overallProgress: number;
  averageGoalProgress: number;
  goalsByPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface Sprint {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  goal?: string;
  startDate: string;
  endDate: string;
  duration: number;
  daysRemaining: number;
  progress: number;
  goalCount: number;
  completedGoalCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface SprintCreateDto {
  title: string;
  description?: string;
  goal?: string;
  startDate: string;
  endDate: string;
}

export interface SprintUpdateDto {
  title?: string;
  description?: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
}

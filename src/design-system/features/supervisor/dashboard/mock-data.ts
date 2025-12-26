// Metric data types and mock data for development and testing

import { MetricSecondaryDisplay } from "../../../ui"

/**
 * Metric data interface for consistent API structure
 */
export interface MetricData {
  id: string
  title: string
  value: string | number
  displayType: 'number' | 'ratio' | 'rating' | 'percentage'
  unit?: string
  secondaryDisplay?: {
    value: string | number
    label?: string
    type?: 'trend' | 'info' | 'status'
    positive?: boolean
    date?: string
    unit?: string
  }
  // Icon properties
  iconName?: string
  iconColor?: string
  iconBgColor?: string
}

/**
 * Mock metrics data for testing and development
 * 
 * Note: Values should be raw (just numbers), not formatted strings
 */
export const mockMetrics: MetricData[] = [
  {
    id: 'employees',
    title: 'Linked employees',
    value: '15',
    displayType: 'number',
    unit: 'Employees',    secondaryDisplay: {
      value: '12',
      label: 'online',
      type: 'status',
      positive: true
    },
    iconName: 'Users',
    iconColor: 'text-coachini-blue',
    iconBgColor: 'bg-blue-50'
  },
  {
    id: 'attendance',
    title: 'Attendance rate',
    value: '80',
    displayType: 'percentage',    secondaryDisplay: {
      value: '3',
      label: 'since last month',
      type: 'trend',
      positive: false,
      unit: '%'
    },
    iconName: 'Calendar',
    iconColor: 'text-green-500',
    iconBgColor: 'bg-green-50'
  },
  {
    id: 'satisfaction',
    title: 'Satisfaction rating',
    value: '4.2',
    unit: '/5',
    displayType: 'rating',    secondaryDisplay: {
      value: '80',
      label: 'rated',
      type: 'status',
      positive: true,
      unit: '%'
    },
    iconName: 'Star',
    iconColor: 'text-yellow-500',
    iconBgColor: 'bg-yellow-50'
  },  {
    id: 'completion',
    title: 'Program completion',
    value: '46',
    displayType: 'percentage',
    secondaryDisplay: {
      value: '43',
      date: '04/04/25',
      type: 'info'
    },
    iconName: 'CheckCircle',
    iconColor: 'text-purple-500',
    iconBgColor: 'bg-purple-50'
  }
];

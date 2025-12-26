import { Request, CoachRequest, BusinessRequest, RequestsStats } from '../types';

export const mockCoachRequests: CoachRequest[] = [
  {
    id: '1',
    type: 'coach',
    user: {
      name: 'Adela Parkson',
      email: 'Adela@simmmple.com',
      phone: '+216 24 457 654',
      role: 'HR Manager',
    },
    userInformations: {
      name: 'Adela Parkson',
      email: 'Adela@simmmple.com',
      phone: '+216 24 457 654',
      role: 'HR Manager',
    },
    companyDetails: {
      name: 'GOMYCODE',
      code: '51-200',
      industry: 'Education',
      size: '51-200 employees',
    },
    note: 'Office Ipsum you must be muted. Sorry pants angel comes picture back-end.Office Ipsum you must be muted. Office Ipsum you must be muted. Sorry pants angel comes picture back-end be muted.',
    date: '31/7/2025',
    time: '7:30 PM',
    status: 'accepted',
    dealProgress: 'deal-won',
    createdAt: '2024-04-24T19:30:00Z',
    updatedAt: '2024-04-25T10:15:00Z',
    files: [
      {
        id: 'file1',
        name: 'resume.pdf',
        url: '/files/resume.pdf',
        type: 'application/pdf',
      },
    ],
  },
];

export const mockBusinessRequests: BusinessRequest[] = [
  {
    id: '5',
    type: 'business',
    user: {
      name: 'Michael Chen',
      email: 'michael.chen@enterprise.com',
      phone: '+65 6123 4567',
      role: 'CEO',
    },
    userInformations: {
      name: 'Michael Chen',
      email: 'michael.chen@enterprise.com',
      phone: '+65 6123 4567',
      role: 'CEO',
    },
    companyDetails: {
      name: 'Enterprise Solutions',
      code: '501-1000',
      industry: 'Consulting',
      size: '501-1000 employees',
    },
    note: 'Interested in comprehensive coaching program for senior leadership team.',
    date: '3/8/2025',
    time: '3:00 PM',
    status: 'accepted',
    dealProgress: 'deal-won',
    callStatus: 'call-made',
    demoRequests: true,
    buildRequests: false,
    createdAt: '2024-04-21T15:00:00Z',
    updatedAt: '2024-04-25T09:45:00Z',
  },
];

export const mockAllRequests: Request[] = [
  ...mockCoachRequests,
  ...mockBusinessRequests,
];

export const mockRequestsStats: RequestsStats = {
  total: 2,
  coaches: 1,
  business: 1,
  accepted: 2,
  changeFromLastMonth: 100, // +100% since 04/04/24 (from 0 to 2)
};

'use client';
import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/design-system/ui/base/tabs';

import { toast } from 'sonner';
import EmployeeTable, {
  Employee,
} from '../../../../ui/components/table/EmployeeTable';
import { useTabNavigation } from '../../../../ui/layout/content-tab-navigation';
import CourseCard from '../../../../ui/layout/content-tab-navigation/CourseCard';
import SessionTable, { Session } from '../../../../ui/components/table/SessionTable';
import ProgramTable, { Program } from '../../../../ui/components/table/ProgramTable';

export const sampleEmployees: Employee[] = [
  {
    id: '1',
    name: 'Adela Parkson',
    email: 'adela@example.com',
    role: {
      title: 'Manager',
      department: 'Organization',
    },
    status: 'online',
    currentTheme: 'Stratégie de marque',
    nextSession: '14/06/21',
    progress: 60,
    satisfaction: 4,
  },
  {
    id: '2',
    name: 'Esthera Jackson',
    email: 'esthera@example.com',
    role: {
      title: 'Programmer',
      department: 'Developer',
    },
    status: 'offline',
    currentTheme: 'Stratégie de marque',
    nextSession: '14/06/21',
    progress: 60,
    satisfaction: 4,
  },
  {
    id: '3',
    name: 'Esthera Jackson',
    email: 'esthera@example.com',
    role: {
      title: 'Programmer',
      department: 'Developer',
    },
    status: 'offline',
    currentTheme: 'Stratégie de marque',
    nextSession: '14/06/21',
    progress: 60,
    satisfaction: 4,
  },
  {
    id: '4',
    name: 'Esthera Jackson',
    email: 'esthera@example.com',
    role: {
      title: 'Manager',
      department: 'Organization',
    },
    status: 'online',
    currentTheme: 'Stratégie de marque',
    nextSession: '14/06/21',
    progress: 60,
    satisfaction: 4,
  },
];

export const sampleMembers = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Carol Williams',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'David Brown',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',
    name: 'Eve Davis',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '6',
    name: 'Frank Miller',
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
  },
];

const samplePrograms: Program[] = [
  {
    id: '1',
    name: 'programme leadership',
    members: sampleMembers.slice(0, 5),
    startDate: '14/06/21',
    completion: { current: 6, total: 10 },
    attendance: 90,
    satisfaction: 4,
    isExpanded: false,
    subPrograms: [
      {
        id: '2',
        name: 'Stratégie de marque employeur',
        members: sampleMembers.slice(0, 5),
        startDate: '14/06/21',
        completion: { current: 6, total: 10 },
        attendance: 90,
        satisfaction: 4,
      },
      {
        id: '3',
        name: "Gestion / Cohésion d'équipe",
        members: sampleMembers.slice(0, 5),
        startDate: '14/06/21',
        completion: { current: 6, total: 10 },
        attendance: 90,
        satisfaction: 4,
      },
      {
        id: '4',
        name: 'Gestion du temps et productivité',
        members: sampleMembers.slice(0, 5),
        startDate: '14/06/21',
        completion: { current: 6, total: 10 },
        attendance: 90,
        satisfaction: 4,
      },
    ],
  },
  {
    id: '5',
    name: 'programme name',
    members: sampleMembers.slice(0, 5),
    startDate: '14/06/21',
    completion: { current: 6, total: 10 },
    attendance: 90,
    satisfaction: 4,
    isExpanded: false,
    subPrograms: [
      {
        id: '6',
        name: 'Sub-programme 1',
        members: sampleMembers.slice(0, 3),
        startDate: '14/06/21',
        completion: { current: 4, total: 10 },
        attendance: 85,
        satisfaction: 3,
      },
      {
        id: '7',
        name: 'Sub-programme 2',
        members: sampleMembers.slice(2, 5),
        startDate: '15/06/21',
        completion: { current: 7, total: 10 },
        attendance: 92,
        satisfaction: 5,
      },
    ],
  },
];

const PurchasedTabSupervisor = ({
	programs,
}: {
	programs?: Employee[] | undefined;
}) => {
	const handleEditEmployee = (employee: Employee) => {
		toast(`Editing ${employee.name}`);
	};

	return (
		<div className="">
			<ProgramTable programs={samplePrograms} onActionClick={() => {}} />
		</div>
	);
};

const TabHeader = ({
	programs,
}: {
	programs?: Employee[] | undefined;
}) => {
	const handleEditEmployee = (employee: Employee) => {
		toast(`Editing ${employee.name}`);
	};

	return (
		<div className="p-4 bg-red-300 rounded-md">
			<h1>Filter Here</h1>
		</div>
	);
};


export {PurchasedTabSupervisor, TabHeader};

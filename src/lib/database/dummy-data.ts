import { Employee } from "../../design-system/ui/components/table/EmployeeTable";
import { Program } from "../../design-system/ui/components/table/ProgramTable";
import { Session } from '../../design-system/ui/components/table/SessionTable';
import { Document } from '../../design-system/ui/components/table/DocumentTable';
import { FileItem } from "../../design-system/ui/components/table/FileTable";

export const mockEmployees: Employee[] = [
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
	{
		id: '6',
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
	{
		id: '7',
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
	{
		id: '8',
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
	{
		id: '9',
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

// Sample members for sessions and programs
export const mockMembers = [
	{
		id: '1',
		name: 'Alice Johnson',
		avatarUrl: 'https://i.pravatar.cc/150?img=1',
	},
	{ id: '2', name: 'Bob Smith', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
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
	{ id: '5', name: 'Eve Davis', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
	{
		id: '6',
		name: 'Frank Miller',
		avatarUrl: 'https://i.pravatar.cc/150?img=6',
	},
];

// Sample data for sessions
export const mockSessions: Session[] = [
	{
		id: '1',
		name: 'name of the session 1',
		members: mockMembers.slice(0, 4),
		startDate: '14/06/21',
		status: 'completed',
		attendance: 90,
		satisfaction: 4,
	},
	{
		id: '2',
		name: 'name of the session 2',
		members: mockMembers.slice(0, 4),
		startDate: '14/06/21',
		status: 'completed',
		attendance: 90,
		satisfaction: 4,
	},
	{
		id: '3',
		name: 'name of the session 3',
		members: mockMembers,
		startDate: '14/06/21',
		status: 'completed',
		attendance: 100,
		satisfaction: 4,
	},
	{
		id: '4',
		name: 'name of the session 4',
		members: mockMembers,
		startDate: '14/06/21',
		status: 'completed',
		attendance: 100,
		satisfaction: 4,
	},
	{
		id: '5',
		name: 'name of the session 5',
		members: mockMembers,
		startDate: '14/06/21',
		status: 'completed',
		attendance: 100,
		satisfaction: 4,
	},
	{
		id: '6',
		name: 'name of the session 6',
		members: [],
		startDate: '14/06/21',
		status: 'scheduled',
		attendance: 0,
		satisfaction: 0,
	},
];

// Sample data for programs - now restructured with main program and subprograms
export const mockPrograms: Program[] = [
	{
		id: '1',
		name: 'programme leadership',
		members: mockMembers.slice(0, 5),
		startDate: '14/06/21',
		completion: { current: 6, total: 10 },
		attendance: 90,
		satisfaction: 4,
		isExpanded: false,
		subPrograms: [
			{
				id: '2',
				name: 'Stratégie de marque employeur',
				members: mockMembers.slice(0, 5),
				startDate: '14/06/21',
				completion: { current: 6, total: 10 },
				attendance: 90,
				satisfaction: 4,
			},
			{
				id: '3',
				name: "Gestion / Cohésion d'équipe",
				members: mockMembers.slice(0, 5),
				startDate: '14/06/21',
				completion: { current: 6, total: 10 },
				attendance: 90,
				satisfaction: 4,
			},
			{
				id: '4',
				name: 'Gestion du temps et productivité',
				members: mockMembers.slice(0, 5),
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
		members: mockMembers.slice(0, 5),
		startDate: '14/06/21',
		completion: { current: 6, total: 10 },
		attendance: 90,
		satisfaction: 4,
		isExpanded: false,
		subPrograms: [
			{
				id: '6',
				name: 'Sub-programme 1',
				members: mockMembers.slice(0, 3),
				startDate: '14/06/21',
				completion: { current: 4, total: 10 },
				attendance: 85,
				satisfaction: 3,
			},
			{
				id: '7',
				name: 'Sub-programme 2',
				members: mockMembers.slice(2, 5),
				startDate: '15/06/21',
				completion: { current: 7, total: 10 },
				attendance: 92,
				satisfaction: 5,
			},
		],
	},
];

// Sample data for documents
export const mockDocuments: Document[] = [
	{
		id: '1',
		name: 'Stratégie de marque',
		owner: {
			name: 'Adela Parkson',
			email: 'Adela@simmmple.com',
			avatarUrl: 'https://i.pravatar.cc/150?img=1',
		},
		role: 'Manager',
		date: '14/06/21',
		fileType: 'pdf',
	},
	{
		id: '2',
		name: 'Stratégie de marque',
		owner: {
			name: 'Theresa Webb',
			email: 'deanna.curtis@example.com',
			avatarUrl: 'https://i.pravatar.cc/150?img=2',
		},
		role: 'coach',
		date: '14/06/21',
		fileType: 'pdf',
	},
	{
		id: '3',
		name: 'Stratégie de marque',
		owner: {
			name: 'Robert Fox',
			email: 'bill.sanders@example.com',
			avatarUrl: 'https://i.pravatar.cc/150?img=3',
		},
		role: 'coach',
		date: '14/06/21',
		fileType: 'pdf',
	},
];

// Sample data for files - fixing the fileType property
export const mockFiles: FileItem[] = [
	{
		id: '1',
		name: 'theme',
		type: 'folder',
		fileType: 'docx',
		size: '4MB',
		date: '14/06/25',
		members: mockMembers.slice(0, 5),
		isExpandable: true,
		isExpanded: false,
		children: [
			{
				id: '2',
				name: 'file name',
				type: 'file',
				fileType: 'docx',
				size: '4MB',
				date: '14/06/25',
				members: mockMembers.slice(0, 5),
			},
			{
				id: '3',
				name: 'file name',
				type: 'file',
				fileType: 'docx',
				size: '4MB',
				date: '14/06/25',
				members: mockMembers.slice(0, 5),
			},
			{
				id: '4',
				name: 'form name',
				type: 'form',
				date: '14/06/25',
				members: mockMembers.slice(0, 5),
			},
		],
	},
	{
		id: '5',
		name: 'theme',
		type: 'folder',
		fileType: 'docx',
		size: '4MB',
		date: '14/06/25',
		members: mockMembers.slice(0, 5),
		isExpandable: true,
		isExpanded: false,
	},
	{
		id: '6',
		name: 'theme',
		type: 'folder',
		fileType: 'docx',
		size: '4MB',
		date: '14/06/25',
		members: mockMembers.slice(0, 5),
		isExpandable: true,
		isExpanded: false,
	},
];

// Adding sample completed sessions for the purchased tab
export const mockPurchasedSessions: Session[] = [
	{
		id: 'p1',
		name: 'Employer brand strategy',
		members: mockMembers.slice(0, 4),
		startDate: '25/05/24',
		startTime: '10:00 AM',
		status: 'completed',
		attendance: 95,
		satisfaction: 5,
		isHighlighted: true,
	},
	{
		id: 'p2',
		name: 'Team cohesion workshop',
		members: mockMembers.slice(1, 5),
		startDate: '18/05/24',
		startTime: '2:00 PM',
		status: 'completed',
		attendance: 90,
		satisfaction: 4,
	},
	{
		id: 'p3',
		name: 'Communication skills',
		members: mockMembers.slice(0, 3),
		startDate: '10/05/24',
		startTime: '9:30 AM',
		status: 'scheduled',
		attendance: 0,
		satisfaction: 0,
	},
];

export const mockSessionsData = [
	{
		id: '1',
		title: 'Individual session title',
		date: '22 DEC 7:20 PM',
	},
	{
		id: '2',
		title: 'Group session title',
		date: '21 DEC 11:21 PM',
	},
	{
		id: '3',
		title: 'Individual session title',
		date: '21 DEC 9:28 PM',
	},
	{
		id: '4',
		title: 'Individual session title',
		date: '20 DEC 3:52 PM',
	},
	{
		id: '5',
		title: 'In Office Group session title',
		date: '19 DEC 11:35 PM',
	},
	{
		id: '6',
		title: 'Individual session title',
		date: '19 DEC 9:28 PM',
	},
	{
		id: '7',
		title: 'Individual session title',
		date: '18 DEC 3:52 PM',
	},
	{
		id: '8',
		title: 'In Office Group session title',
		date: '17 DEC 11:35 PM',
	},
	{
		id: '9',
		title: 'Individual session title',
		date: '17 DEC 9:28 PM',
	},
	{
		id: '10',
		title: 'Individual session title',
		date: '16 DEC 3:52 PM',
	},
	{
		id: '11',
		title: 'In Office Group session title',
		date: '15 DEC 11:35 PM',
	},
	{
		id: '12',
		title: 'Individual session title',
		date: '15 DEC 9:28 PM',
	},
	{
		id: '13',
		title: 'Individual session title',
		date: '14 DEC 3:52 PM',
	},
	{
		id: '14',
		title: 'In Office Group session title',
		date: '13 DEC 11:35 PM',
	},
	{
		id: '15',
		title: 'Individual session title',
		date: '13 DEC 9:28 PM',
	},
];

export const mpckSampleMembers = [
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



// Attendance chart data
export const mockAttendanceData = [90, 20, 90, 45, 70, 35];

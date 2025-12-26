"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/ui/base/card';
import DocumentTable, { Document } from '@/design-system/ui/components/table/DocumentTable';
import EmployeeTable, { Employee } from '@/design-system/ui/components/table/EmployeeTable';
import SessionTable, { Session } from '@/design-system/ui/components/table/SessionTable';
import FileTable, { FileItem } from '@/design-system/ui/components/table/FileTable';
import ProgramTable, { Program, SubProgram } from '@/design-system/ui/components/table/ProgramTable';
import SuperProgramTable from '@/design-system/ui/components/table/SuperProgramTable';
import { Member } from '@/design-system/ui/components/table/AvatarGroup';

// Sample data for DocumentTable
const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'Project Proposal 2024',
    owner: {
      name: 'John Smith',
      email: 'john.smith@company.com',
      avatarUrl: undefined
    },
    role: 'Project Manager',
    date: '2024-01-15',
    fileType: 'pdf'
  },
  {
    id: '2',
    name: 'Meeting Notes Q1',
    owner: {
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      avatarUrl: undefined
    },
    role: 'Team Lead',
    date: '2024-01-10',
    fileType: 'docx'
  },
  {
    id: '3',
    name: 'Budget Analysis',
    owner: {
      name: 'Mike Wilson',
      email: 'mike.w@company.com',
      avatarUrl: undefined
    },
    role: 'Financial Analyst',
    date: '2024-01-08',
    fileType: 'xlsx'
  }
];

// Sample data for EmployeeTable
const sampleEmployees: Employee[] = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@company.com',
    avatarUrl: undefined,
    role: {
      title: 'Senior Developer',
      department: 'Engineering'
    },
    status: 'online',
    currentTheme: 'Leadership Skills',
    nextSession: '2024-01-20 14:00',
    progress: 75,
    satisfaction: 4.5,
    isHighlighted: true
  },
  {
    id: '2',
    name: 'Emma Davis',
    email: 'emma.davis@company.com',
    avatarUrl: undefined,
    role: {
      title: 'UX Designer',
      department: 'Design'
    },
    status: 'away',
    currentTheme: 'Creative Thinking',
    nextSession: '2024-01-21 10:00',
    progress: 60,
    satisfaction: 4.2
  },
  {
    id: '3',
    name: 'James Thompson',
    email: 'james.t@company.com',
    avatarUrl: undefined,
    role: {
      title: 'Product Manager',
      department: 'Product'
    },
    status: 'busy',
    currentTheme: 'Strategic Planning',
    nextSession: '2024-01-22 15:30',
    progress: 90,
    satisfaction: 4.8
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa.chen@company.com',
    avatarUrl: undefined,
    role: {
      title: 'Marketing Specialist',
      department: 'Marketing'
    },
    status: 'offline',
    currentTheme: 'Communication',
    nextSession: '2024-01-23 11:00',
    progress: 45,
    satisfaction: 4.0
  }
];

// Sample data for SessionTable
const sampleMembers: Member[] = [
  { id: '1', name: 'Alex Rodriguez', avatarUrl: undefined },
  { id: '2', name: 'Emma Davis', avatarUrl: undefined },
  { id: '3', name: 'James Thompson', avatarUrl: undefined }
];

const sampleSessions: Session[] = [
  {
    id: '1',
    name: 'Leadership Workshop',
    members: sampleMembers,
    startDate: '2024-01-20',
    startTime: '14:00',
    status: 'scheduled',
    attendance: 85,
    satisfaction: 4.3,
    isHighlighted: true
  },
  {
    id: '2',
    name: 'Team Building Session',
    members: sampleMembers.slice(0, 2),
    startDate: '2024-01-18',
    startTime: '10:00',
    status: 'completed',
    attendance: 92,
    satisfaction: 4.7
  },
  {
    id: '3',
    name: 'Creative Thinking Workshop',
    members: sampleMembers,
    startDate: '2024-01-25',
    startTime: '16:00',
    status: 'scheduled',
    attendance: 0,
    satisfaction: 0
  },
  {
    id: '4',
    name: 'Cancelled Session',
    members: sampleMembers.slice(1),
    startDate: '2024-01-15',
    startTime: '09:00',
    status: 'canceled',
    attendance: 0,
    satisfaction: 0
  }
];

// Sample data for FileTable
const sampleFileItems: FileItem[] = [
  {
    id: '1',
    name: 'Project Documents',
    type: 'folder',
    date: '2024-01-20',
    members: sampleMembers,
    isExpandable: true,
    isExpanded: false,
    children: [
      {
        id: '1-1',
        name: 'project-proposal.pdf',
        type: 'file',
        fileType: 'pdf',
        size: '2.3 MB',
        date: '2024-01-18',
        members: sampleMembers.slice(0, 2)
      },
      {
        id: '1-2',
        name: 'budget-analysis.xlsx',
        type: 'file',
        fileType: 'xlsx',
        size: '1.8 MB',
        date: '2024-01-19'
      }
    ]
  },
  {
    id: '2',
    name: 'meeting-notes.docx',
    type: 'file',
    fileType: 'docx',
    size: '0.5 MB',
    date: '2024-01-17',
    members: sampleMembers.slice(1, 3)
  },
  {
    id: '3',
    name: 'Forms',
    type: 'folder',
    date: '2024-01-15',
    isExpandable: true,
    isExpanded: false,
    children: [
      {
        id: '3-1',
        name: 'feedback-form',
        type: 'form',
        date: '2024-01-14'
      }
    ]
  }
];

// Sample data for ProgramTable
const sampleSubPrograms: SubProgram[] = [
  {
    id: 'sub1',
    name: 'Team Leadership',
    members: sampleMembers.slice(0, 2),
    startDate: '2024-01-22',
    startTime: '09:00',
    completion: { current: 3, total: 5 },
    attendance: 85,
    satisfaction: 4.2,
    colorScheme: 'blue'
  },
  {
    id: 'sub2',
    name: 'Strategic Planning',
    members: sampleMembers.slice(1, 3),
    startDate: '2024-01-25',
    startTime: '14:00',
    completion: { current: 2, total: 4 },
    attendance: 92,
    satisfaction: 4.5,
    colorScheme: 'green'
  }
];

const samplePrograms: Program[] = [
  {
    id: '1',
    name: 'Leadership Development',
    members: sampleMembers,
    startDate: '2024-01-20',
    startTime: '10:00',
    completion: { current: 5, total: 8 },
    attendance: 88,
    satisfaction: 4.3,
    colorScheme: 'amber',
    isExpanded: false,
    subPrograms: sampleSubPrograms
  },
  {
    id: '2',
    name: 'Technical Skills',
    members: sampleMembers.slice(0, 2),
    startDate: '2024-01-25',
    completion: { current: 0, total: 6 },
    attendance: 0,
    satisfaction: 0,
    colorScheme: 'blue'
  },
  {
    id: '3',
    name: 'Communication Skills',
    members: sampleMembers,
    startDate: '2024-01-15',
    completion: { current: 4, total: 4 },
    attendance: 95,
    satisfaction: 4.7,
    colorScheme: 'green'
  }
];

export default function TableTestPage() {
  const handleEmployeeEdit = (employee: Employee) => {
    console.log('Edit employee:', employee);
  };

  const handleSessionAction = (session: Session) => {
    console.log('Session action:', session);
  };

  const handleFileAction = (actionType: string, file: FileItem) => {
    console.log('File action:', actionType, file);
  };

  const handleProgramAction = (program: Program | SubProgram, isMainProgram: boolean) => {
    console.log('Program action:', program, 'isMainProgram:', isMainProgram);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Table Components Test</h1>
        <p className="text-gray-600">
          This page demonstrates all the table components from the design system with various configurations and sample data.
        </p>
      </div>

      {/* DocumentTable Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Document Table</CardTitle>
          <p className="text-sm text-gray-600">Basic document table with owner information, roles, and file types.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Default Layout</h3>
              <DocumentTable documents={sampleDocuments} />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Compact Layout</h3>
              <DocumentTable documents={sampleDocuments} compact />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EmployeeTable Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Table</CardTitle>
          <p className="text-sm text-gray-600">Employee table with status indicators, progress bars, and satisfaction ratings.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Default Variant</h3>
              <EmployeeTable 
                employees={sampleEmployees} 
                onEdit={handleEmployeeEdit}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Minimal Variant</h3>
              <EmployeeTable 
                employees={sampleEmployees} 
                variant="minimal"
                onEdit={handleEmployeeEdit}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Detailed Variant (Compact)</h3>
              <EmployeeTable 
                employees={sampleEmployees} 
                variant="detailed"
                compact
                onEdit={handleEmployeeEdit}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Without Dividers</h3>
              <EmployeeTable 
                employees={sampleEmployees} 
                showDividers={false}
                onEdit={handleEmployeeEdit}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SessionTable Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Session Table</CardTitle>
          <p className="text-sm text-gray-600">Session table with member avatars, status badges, and attendance metrics.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Default Layout</h3>
              <SessionTable 
                sessions={sampleSessions}
                onActionClick={handleSessionAction}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Minimal Variant</h3>
              <SessionTable 
                sessions={sampleSessions}
                variant="minimal"
                onActionClick={handleSessionAction}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Compact Layout</h3>
              <SessionTable 
                sessions={sampleSessions}
                compact
                onActionClick={handleSessionAction}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Without Dividers</h3>
              <SessionTable 
                sessions={sampleSessions}
                showDividers={false}
                onActionClick={handleSessionAction}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FileTable Examples */}
      <Card>
        <CardHeader>
          <CardTitle>File Table</CardTitle>
          <p className="text-sm text-gray-600">File table with expandable folders, context menus, and file type icons.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Default Layout</h3>
              <FileTable 
                files={sampleFileItems}
                onActionClick={handleFileAction}
                showHeader
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Compact Layout</h3>
              <FileTable 
                files={sampleFileItems}
                onActionClick={handleFileAction}
                compact
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ProgramTable Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Program Table</CardTitle>
          <p className="text-sm text-gray-600">Program table with expandable sub-programs, progress tracking, and satisfaction ratings.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Default Layout</h3>
              <ProgramTable 
                programs={samplePrograms}
                onActionClick={handleProgramAction}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Minimal Variant</h3>
              <ProgramTable 
                programs={samplePrograms}
                variant="minimal"
                onActionClick={handleProgramAction}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Detailed Variant (Compact)</h3>
              <ProgramTable 
                programs={samplePrograms}
                variant="detailed"
                compact
                onActionClick={handleProgramAction}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Without Dividers</h3>
              <ProgramTable 
                programs={samplePrograms}
                showDividers={false}
                onActionClick={handleProgramAction}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SuperProgramTable Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Super Program Table (DataTable-based)</CardTitle>
          <p className="text-sm text-gray-600">Advanced program table built with DataTable and TanStack Table for enhanced functionality.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Default Layout</h3>
              <SuperProgramTable 
                programs={samplePrograms}
                onActionClick={handleProgramAction}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Minimal Variant</h3>
              <SuperProgramTable 
                programs={samplePrograms}
                variant="minimal"
                onActionClick={handleProgramAction}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Compact Layout</h3>
              <SuperProgramTable 
                programs={samplePrograms}
                compact
                onActionClick={handleProgramAction}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Table Features */}
      <Card>
        <CardHeader>
          <CardTitle>Table Features Demo</CardTitle>
          <p className="text-sm text-gray-600">Demonstration of various table features and styling options.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p><strong>Table Components demonstrated:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>DocumentTable:</strong> Document management with owner info and file types</li>
                <li><strong>EmployeeTable:</strong> Employee management with status, progress, and satisfaction</li>
                <li><strong>SessionTable:</strong> Session tracking with member avatars and attendance</li>
                <li><strong>FileTable:</strong> File explorer with expandable folders and context menus</li>
                <li><strong>ProgramTable:</strong> Program management with sub-programs and completion tracking</li>
                <li><strong>SuperProgramTable:</strong> Advanced program table built with DataTable</li>
              </ul>
              <p><strong>Features demonstrated:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Compact and default layouts</li>
                <li>Status badges and indicators</li>
                <li>Progress bars and star ratings</li>
                <li>Avatar groups and individual avatars</li>
                <li>Highlighted rows and hover effects</li>
                <li>Edit actions and dropdown menus</li>
                <li>Expandable rows and sub-items</li>
                <li>Context menus for file actions</li>
                <li>Responsive design (hidden columns on mobile)</li>
                <li>Various table styling variants (minimal, detailed, etc.)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

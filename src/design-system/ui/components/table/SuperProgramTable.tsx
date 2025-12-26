'use client';

import React, { useState } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ChevronDown, ChevronRight, MoreVertical } from 'lucide-react';
import { DataTable } from '@/design-system/ui/components/data-table/data-table';
import { Button } from '@/design-system/ui/base/button';
import { cn } from '@/core/utils/cn';
import AvatarGroup from '@/design-system/ui/components/table/AvatarGroup';
import ProgressBar from '@/design-system/ui/components/table/ProgressBar';
import StarRating from '@/design-system/ui/components/table/StarRating';
import { Program, SubProgram } from '@/design-system/ui/components/table/ProgramTable';

interface SuperProgramTableProps {
  programs: Program[];
  onActionClick?: (program: Program | SubProgram, isMainProgram: boolean) => void;
  compact?: boolean;
  variant?: 'default' | 'minimal' | 'detailed';
}

// Flatten programs and sub-programs for the data table
interface FlattenedProgram extends Program {
  isSubProgram?: boolean;
  parentId?: string;
  level: number;
}

const getIconColorClass = (colorScheme?: string) => {
  switch (colorScheme) {
    case 'amber':
      return 'bg-amber-500';
    case 'green':
      return 'bg-green-500';
    case 'blue':
      return 'bg-blue-500';
    case 'red':
      return 'bg-red-500';
    case 'purple':
      return 'bg-purple-500';
    default:
      return 'bg-amber-50';
  }
};

const SuperProgramTable: React.FC<SuperProgramTableProps> = ({
  programs,
  onActionClick,
  compact = false,
  variant = 'default',
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // Flatten the data structure for the data table
  const flattenedData: FlattenedProgram[] = React.useMemo(() => {
    const result: FlattenedProgram[] = [];
    
    programs.forEach((program) => {
      // Add main program
      result.push({
        ...program,
        level: 0,
        isSubProgram: false,
      });

      // Add sub-programs if expanded
      if (expandedIds.has(program.id) && program.subPrograms) {
        program.subPrograms.forEach((subProgram) => {
          result.push({
            ...subProgram,
            level: 1,
            isSubProgram: true,
            parentId: program.id,
          } as FlattenedProgram);
        });
      }
    });

    return result;
  }, [programs, expandedIds]);

  const columns: ColumnDef<FlattenedProgram>[] = [
    {
      accessorKey: 'name',
      header: 'PROGRAMMES',
      cell: ({ row }) => {
        const program = row.original;
        const hasSubPrograms = !program.isSubProgram && program.subPrograms && program.subPrograms.length > 0;
        const isExpanded = expandedIds.has(program.id);

        return (
          <div className="flex items-center gap-3" style={{ paddingLeft: `${program.level * 40}px` }}>
            {hasSubPrograms && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto"
                onClick={() => toggleExpanded(program.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </Button>
            )}
            <div
              className={cn(
                'h-10 w-10 rounded',
                getIconColorClass(program.colorScheme),
              )}
            />
            <div>
              <span className="font-medium">{program.name}</span>
              {program.startTime && variant === 'detailed' && (
                <div className="text-xs text-gray-500 mt-1">
                  {program.startTime}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    ...(variant !== 'minimal' ? [{
      accessorKey: 'members',
      header: 'MEMBERS',
      cell: ({ row }: { row: Row<FlattenedProgram> }) => {
        const program = row.original;
        return (
          <AvatarGroup
            members={program.members}
            size={compact ? 'sm' : 'md'}
          />
        );
      },
    }] : []),
    {
      accessorKey: 'startDate',
      header: 'START DATE',
      cell: ({ row }) => row.original.startDate,
    },
    {
      accessorKey: 'completion',
      header: 'COMPLETION',
      cell: ({ row }) => {
        const program = row.original;
        return (
          <div className="flex items-center gap-1">
            <ProgressBar
              value={program.completion.current}
              max={program.completion.total}
              showLabel={false}
              size={compact ? 'sm' : 'md'}
              color={program.colorScheme || 'green'}
            />
            <span className="ml-2 text-sm whitespace-nowrap">
              {program.completion.current}/{program.completion.total} theme
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'attendance',
      header: 'ATTENDANCE',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.attendance}%</span>
      ),
    },
    {
      accessorKey: 'satisfaction',
      header: 'SATISFACTION',
      cell: ({ row }) => (
        <StarRating
          rating={row.original.satisfaction}
          starSize={compact ? 'sm' : 'md'}
        />
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const program = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick && onActionClick(program, !program.isSubProgram);
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={flattenedData}
      showSearch={false}
      showPagination={false}
      showColumnToggle={false}
      className={cn(
        compact && 'text-sm',
        '[&_table]:table-fixed [&_table_th:first-child]:w-1/4 [&_table_th:nth-child(2)]:w-1/6 [&_table_th:nth-child(3)]:w-1/6 [&_table_th:nth-child(4)]:w-1/4 [&_table_th:nth-child(5)]:w-1/8 [&_table_th:nth-child(6)]:w-1/8 [&_table_th:last-child]:w-10'
      )}
    />
  );
};

export default SuperProgramTable;
import React from 'react';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	TableDivider,
} from './Table';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import StarRating from './StarRating';
import { Avatar } from '@/design-system/ui/base/avatar';
import { Button } from '@/design-system/ui/base/button';
import { Edit } from 'lucide-react';

export interface Employee {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
	role: {
		title: string;
		department: string;
	};
	status: 'online' | 'offline' | 'away' | 'busy';
	currentTheme: string;
	nextSession: string;
	progress: number;
	satisfaction: number;
	isHighlighted?: boolean;
}

interface EmployeeTableProps {
	employees: Employee[] | [] | undefined;
	onEdit?: (employee: Employee) => void;
	showDividers?: boolean;
	compact?: boolean;
	variant?: 'default' | 'minimal' | 'detailed';
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
	employees,
	onEdit,
	showDividers = true,
	compact = false,
	variant = 'default',
}) => {
	return (
		<Table compact={compact}>
			<TableHeader className="bg-white">
				<TableRow withDivider={showDividers}>
					<TableHead
						className={variant === 'detailed' ? 'w-[250px]' : 'w-[300px]'}
					>
						EMPLOYEE
					</TableHead>
					<TableHead>FUNCTION</TableHead>
					<TableHead>STATUS</TableHead>
					{variant !== 'minimal' && <TableHead>CURRENT THEME</TableHead>}
					<TableHead>NEXT SESSION</TableHead>
					<TableHead>PROGRESS</TableHead>
					<TableHead>SATISFACTION</TableHead>
					<TableHead className="text-right"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{employees?.map((employee, index) => (
					<React.Fragment key={employee.id}>
						<TableRow
							withDivider={showDividers}
							highlight={employee.isHighlighted}
						>
							<TableCell className="font-medium">
								<div className="flex items-center gap-3">
									<Avatar className={compact ? 'h-8 w-8' : 'h-10 w-10'}>
										{employee.avatarUrl ? (
											<img
												src={employee.avatarUrl}
												alt={employee.name}
												className="object-cover w-full h-full"
											/>
										) : (
											<div className="flex items-center justify-center w-full h-full text-white bg-blue-500">
												{employee.name.charAt(0)}
											</div>
										)}
									</Avatar>
									<div>
										<div className="font-medium">{employee.name}</div>
										<div className="text-sm text-gray-500">
											{employee.email}
										</div>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="font-medium">{employee.role.title}</div>
								<div className="text-sm text-gray-500">
									{employee.role.department}
								</div>
							</TableCell>
							<TableCell>
								<StatusBadge status={employee.status} />
							</TableCell>
							{variant !== 'minimal' && (
								<TableCell>{employee.currentTheme}</TableCell>
							)}
							<TableCell>{employee.nextSession}</TableCell>
							<TableCell>
								<ProgressBar
									value={employee.progress}
									showLabel={variant !== 'minimal'}
									className={compact ? 'max-w-[120px]' : ''}
								/>
							</TableCell>
							<TableCell>
								<StarRating
									rating={employee.satisfaction}
									starSize={compact ? 'sm' : 'md'}
								/>
							</TableCell>
							<TableCell className="text-right">
								{onEdit && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onEdit(employee)}
									>
										<span className="text-blue-500">Edit</span>
									</Button>
								)}
							</TableCell>
						</TableRow>
						{index < (employees?.length ?? 0) - 1 && !showDividers && <TableDivider />}
					</React.Fragment>
				))}
			</TableBody>
		</Table>
	);
};

export default EmployeeTable;

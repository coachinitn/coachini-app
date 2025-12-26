import React, { useState } from 'react';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	TableDivider,
} from './Table';
import StarRating from './StarRating';
import AvatarGroup, { Member } from './AvatarGroup';
import ProgressBar from './ProgressBar';
import { Button } from '@/design-system/ui/base/button';
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { cn } from '@/core/utils';

export interface SubProgram {
	id: string;
	name: string;
	members: Member[];
	startDate: string;
	startTime?: string;
	completion: {
		current: number;
		total: number;
	};
	attendance: number;
	satisfaction: number;
	colorScheme?: 'amber' | 'green' | 'blue' | 'red' | 'purple';
}

export interface Program {
	id: string;
	name: string;
	members: Member[];
	startDate: string;
	startTime?: string;
	completion: {
		current: number;
		total: number;
	};
	attendance: number;
	satisfaction: number;
	isExpanded?: boolean;
	subPrograms?: SubProgram[];
	colorScheme?: 'amber' | 'green' | 'blue' | 'red' | 'purple';
}

interface ProgramTableProps {
	programs: Program[];
	onActionClick?: (
		program: Program | SubProgram,
		isMainProgram: boolean,
	) => void;
	showDividers?: boolean;
	compact?: boolean;
	variant?: 'default' | 'minimal' | 'detailed';
}

const ProgramTable: React.FC<ProgramTableProps> = ({
	programs: initialPrograms,
	onActionClick,
	showDividers = true,
	compact = false,
	variant = 'default',
}) => {
	const [programs, setPrograms] = useState(initialPrograms);

	const toggleExpand = (id: string) => {
		setPrograms(
			programs.map((program) =>
				program.id === id
					? { ...program, isExpanded: !program.isExpanded }
					: program,
			),
		);
	};

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

	return (
		<Table compact={compact}>
			<TableHeader>
				<TableRow withDivider={showDividers}>
					<TableHead className="w-1/4">PROGRAMMES</TableHead>
					{variant !== 'minimal' && <TableHead>MEMBERS</TableHead>}
					<TableHead>START DATE</TableHead>
					<TableHead>COMPLETION</TableHead>
					<TableHead>ATTENDANCE</TableHead>
					<TableHead>SATISFACTION</TableHead>
					<TableHead className="w-10"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{programs.map((program) => (
					<React.Fragment key={program.id}>
						<TableRow
							isExpandable={
								program.subPrograms && program.subPrograms.length > 0
							}
							onClick={() =>
								program.subPrograms &&
								program.subPrograms.length > 0 &&
								toggleExpand(program.id)
							}
							className={cn(
								program.subPrograms &&
									program.subPrograms.length > 0 &&
									'cursor-pointer hover:bg-gray-50',
								!showDividers && 'border-b-0',
							)}
							withDivider={showDividers}
						>
							<TableCell>
								<div className="flex items-center gap-3">
									{program.subPrograms &&
										program.subPrograms.length > 0 &&
										(program.isExpanded ? (
											<ChevronDown className="h-5 w-5 text-gray-500" />
										) : (
											<ChevronUp className="h-5 w-5 text-gray-500" />
										))}
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
							</TableCell>
							{variant !== 'minimal' && (
								<TableCell>
									<AvatarGroup
										members={program.members}
										size={compact ? 'sm' : 'md'}
									/>
								</TableCell>
							)}
							<TableCell>{program.startDate}</TableCell>
							<TableCell>
								<div className="flex items-center gap-1">
									<ProgressBar
										value={program.completion.current}
										max={program.completion.total}
										showLabel={false}
										size={compact ? 'sm' : 'md'}
										color={program.colorScheme || 'green'}
									/>
									<span className="ml-2 text-sm whitespace-nowrap">
										{program.completion.current}/{program.completion.total}{' '}
										theme
									</span>
								</div>
							</TableCell>
							<TableCell>
								<span className="font-medium">{program.attendance}%</span>
							</TableCell>
							<TableCell>
								<StarRating
									rating={program.satisfaction}
									starSize={compact ? 'sm' : 'md'}
								/>
							</TableCell>
							<TableCell>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-gray-500"
									onClick={(e) => {
										e.stopPropagation();
										onActionClick && onActionClick(program, true);
									}}
								>
									<MoreVertical className="h-4 w-4" />
								</Button>
							</TableCell>
						</TableRow>

						{!showDividers && !program.isExpanded && <TableDivider />}

						{program.isExpanded &&
							program.subPrograms &&
							program.subPrograms.length > 0 && (
								<>
									{program.subPrograms.map((subProgram, index) => (
										<React.Fragment key={subProgram.id}>
											<TableRow
												key={subProgram.id}
												className="bg-gray-50/50"
												isSubRow
												withDivider={
													showDividers &&
													index !== program.subPrograms!.length - 1
												}
											>
												<TableCell>
													<div className="flex items-center gap-3 pl-10">
														<div
															className={cn(
																'h-10 w-10 rounded',
																getIconColorClass(
																	subProgram.colorScheme || program.colorScheme,
																),
															)}
														/>
														<span>{subProgram.name}</span>
													</div>
												</TableCell>
												{variant !== 'minimal' && (
													<TableCell>
														<AvatarGroup
															members={subProgram.members}
															size={compact ? 'sm' : 'md'}
														/>
													</TableCell>
												)}
												<TableCell>{subProgram.startDate}</TableCell>
												<TableCell>
													<div className="flex items-center gap-1">
														<ProgressBar
															value={subProgram.completion.current}
															max={subProgram.completion.total}
															showLabel={false}
															size={compact ? 'sm' : 'md'}
															color={
																subProgram.colorScheme ||
																program.colorScheme ||
																'green'
															}
														/>
														<span className="ml-2 text-sm whitespace-nowrap">
															{subProgram.completion.current}/
															{subProgram.completion.total} theme
														</span>
													</div>
												</TableCell>
												<TableCell>
													<span className="font-medium">
														{subProgram.attendance}%
													</span>
												</TableCell>
												<TableCell>
													<StarRating
														rating={subProgram.satisfaction}
														starSize={compact ? 'sm' : 'md'}
													/>
												</TableCell>
												<TableCell>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-gray-500"
														onClick={(e) => {
															e.stopPropagation();
															onActionClick && onActionClick(subProgram, false);
														}}
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</TableCell>
											</TableRow>
											{!showDividers &&
												index === program.subPrograms!.length - 1 && (
													<TableDivider />
												)}
										</React.Fragment>
									))}
								</>
							)}
					</React.Fragment>
				))}
			</TableBody>
		</Table>
	);
};

export default ProgramTable;

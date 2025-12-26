import React from 'react';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from './Table';
import AvatarGroup, { Member } from './AvatarGroup'; // Assuming Member type can be reused
import ProgressBar from './ProgressBar';

// Define the shape of the data for each row in the ProgramsOverview table
export interface ProgramOverviewData {
	id: string;
	sessionName: string; // e.g., "Prévention des Risques Psychosociaux"
	members: Member[]; // Reusing Member type from AvatarGroup
	attendance: number; // Percentage, e.g., 85
	completion: number; // Percentage, e.g., 60
	sessionImage?: string; // Optional: URL for a session image/icon
}

interface ProgramsOverviewProps {
	programs: ProgramOverviewData[];
	onRowClick?: (program: ProgramOverviewData) => void; // Optional: for handling row clicks
}

const ProgramsOverview: React.FC<ProgramsOverviewProps> = ({
	programs,
	onRowClick,
}) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-2/5">THEMES</TableHead>
					<TableHead className="w-1/5">MEMBERS</TableHead>
					<TableHead className="w-1/5 text-center">ATTENDANCE</TableHead>
					<TableHead className="w-1/5 text-center">COMPLETION</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{programs.map((program) => (
					<TableRow
						key={program.id}
						onClick={() => onRowClick && onRowClick(program)}
						className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
					>
						<TableCell>
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-[24px] h-[24px] text-gray-500 bg-secondary-900 rounded">
									{/* Placeholder or initials */}								</div>

								<div>
									<span className="font-medium">{program.sessionName}</span>
									{/* Additional details can be added here if needed */}
								</div>
							</div>
						</TableCell>
						<TableCell>
							<AvatarGroup members={program.members} size="sm" />
						</TableCell>
						<TableCell className="text-center">
							<span className="font-medium">{program.attendance}%</span>
						</TableCell>
						<TableCell>
							<ProgressBar
								value={program.completion}
								showLabel
								// showLabel={variant !== 'minimal'}
								// className={compact ? 'max-w-[120px]' : ''}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default ProgramsOverview;

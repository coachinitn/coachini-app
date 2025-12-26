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
import StarRating from './StarRating';
import AvatarGroup, { Member } from './AvatarGroup';
import { Button } from '@/design-system/ui/base/button';
import { MoreVertical } from 'lucide-react';

export interface Session {
	id: string;
	name: string;
	members: Member[];
	startDate: string;
	startTime?: string;
	status: 'completed' | 'scheduled' | 'canceled' | 'in-progress';
	attendance: number;
	satisfaction: number;
	isHighlighted?: boolean;
}

interface SessionTableProps {
	sessions: Session[];
	onActionClick?: (session: Session) => void;
	showDividers?: boolean;
	compact?: boolean;
	variant?: 'default' | 'minimal';
}

const SessionTable: React.FC<SessionTableProps> = ({
	sessions,
	onActionClick,
	showDividers = true,
	compact = false,
	variant = 'default',
}) => {
	return (
		<Table compact={compact}>
			<TableHeader>
				<TableRow withDivider={showDividers}>
					<TableHead className="w-1/4">THEME</TableHead>
					{variant !== 'minimal' && <TableHead>MEMBERS</TableHead>}
					<TableHead>START DATE</TableHead>
					<TableHead>STATUS</TableHead>
					<TableHead>ATTENDANCE</TableHead>
					<TableHead>SATISFACTION</TableHead>
					<TableHead className="w-10"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{sessions.map((session, index) => (
					<React.Fragment key={session.id}>
						<TableRow
							withDivider={showDividers}
							highlight={session.isHighlighted}
						>
							<TableCell>
								<div className="flex items-center gap-3">
									<div className="h-10 w-10 bg-amber-50 rounded" />
									<div>
										<span className="font-medium">{session.name}</span>
										{session.startTime && variant !== 'minimal' && (
											<div className="text-xs text-gray-500 mt-1">
												{session.startTime}
											</div>
										)}
									</div>
								</div>
							</TableCell>
							{variant !== 'minimal' && (
								<TableCell>
									<AvatarGroup
										members={session.members}
										size={compact ? 'sm' : 'md'}
									/>
								</TableCell>
							)}
							<TableCell>
								<div>
									{session.startDate}
									{session.startTime && variant === 'minimal' && (
										<div className="text-xs text-gray-500">
											{session.startTime}
										</div>
									)}
								</div>
							</TableCell>
							<TableCell>
								<StatusBadge status={session.status} />
							</TableCell>
							<TableCell>
								<span className="font-medium">{session.attendance}%</span>
							</TableCell>
							<TableCell>
								<StarRating
									rating={session.satisfaction}
									starSize={compact ? 'sm' : 'md'}
								/>
							</TableCell>
							<TableCell>
								{onActionClick && (
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-gray-500"
										onClick={() => onActionClick(session)}
									>
										<MoreVertical className="h-4 w-4" />
									</Button>
								)}
							</TableCell>
						</TableRow>
						{index < sessions.length - 1 && !showDividers && <TableDivider />}
					</React.Fragment>
				))}
			</TableBody>
		</Table>
	);
};

export default SessionTable;

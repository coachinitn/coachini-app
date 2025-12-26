import React from 'react';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from './Table';
import { Button } from '@/design-system/ui/base/button';
import { FileText } from 'lucide-react';
import { cn } from '@/core/utils';

export interface CoachUserAccount {
	id: string;
	user: {
		name: string;
		date: string;
		time: string;
	};
	userInformations: {
		email: string;
		phone: string;
		role: string;
	};
	details: {
		platform: string;
		experience: string;
		expertise: string;
	};
	note: string;
	hasFiles: boolean;
	accountStatus: 'account created' | 'coach accepted' | 'account deleted';
	dealStatus: 'created' | 'accepted' | 'deleted';
	createdDate: string;
	createdTime: string;
}

interface CoachUserAccountsTableNewProps {
	accounts: CoachUserAccount[];
	variant?: 'accepted' | 'created' | 'deleted';
	onCreateAccount?: (account: CoachUserAccount) => void;
	onDeleteAccount?: (account: CoachUserAccount) => void;
	onViewFiles?: (account: CoachUserAccount) => void;
	className?: string;
}

const CoachUserAccountsTableNew: React.FC<CoachUserAccountsTableNewProps> = ({
	accounts,
	variant = 'accepted',
	onCreateAccount,
	onDeleteAccount,
	onViewFiles,
	className,
}) => {
	return (
		<div className={cn("w-full", className)}>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-xs font-medium text-gray-500 uppercase">
							User
						</TableHead>
						<TableHead className="text-xs font-medium text-gray-500 uppercase">
							User Informations
						</TableHead>
						<TableHead className="text-xs font-medium text-gray-500 uppercase">
							Details
						</TableHead>
						<TableHead className="text-xs font-medium text-gray-500 uppercase">
							Note
						</TableHead>
						<TableHead className="text-xs font-medium text-gray-500 uppercase text-center">
							Files
						</TableHead>
						{variant === 'accepted' && (
							<TableHead className="text-xs font-medium text-gray-500 uppercase text-center">
								Account Creation
							</TableHead>
						)}
						{(variant === 'created' || variant === 'deleted') && (
							<TableHead className="text-xs font-medium text-gray-500 uppercase text-center">
								Actions
							</TableHead>
						)}
						<TableHead className="text-xs font-medium text-gray-500 uppercase">
							Account Status
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{accounts.map((account) => (
						<TableRow 
							key={account.id}
							className={cn(
								"hover:bg-gray-50/50",
								variant === 'deleted' && "opacity-60"
							)}
						>
							{/* User */}
							<TableCell>
								<div className="flex flex-col gap-1">
									<span className={cn(
										"font-medium text-gray-900",
										variant === 'deleted' && "line-through"
									)}>
										{account.user.name}
									</span>
									<span className={cn(
										"text-sm text-gray-500",
										variant === 'deleted' && "line-through"
									)}>
										{account.user.date}
									</span>
									<span className={cn(
										"text-sm text-gray-500",
										variant === 'deleted' && "line-through"
									)}>
										{account.user.time}
									</span>
								</div>
							</TableCell>

							{/* User Informations */}
							<TableCell>
								<div className="flex flex-col gap-1">
									<span className={cn(
										"text-sm text-gray-900",
										variant === 'deleted' && "line-through"
									)}>
										{account.userInformations.email}
									</span>
									<span className={cn(
										"text-sm text-gray-500",
										variant === 'deleted' && "line-through"
									)}>
										{account.userInformations.phone}
									</span>
									<span className={cn(
										"text-sm text-gray-500",
										variant === 'deleted' && "line-through"
									)}>
										{account.userInformations.role}
									</span>
								</div>
							</TableCell>

							{/* Details */}
							<TableCell>
								<div className="flex flex-col gap-1">
									<span className={cn(
										"text-sm text-gray-900 underline cursor-pointer hover:text-blue-600",
										variant === 'deleted' && "line-through"
									)}>
										{account.details.platform}
									</span>
									<span className={cn(
										"text-sm text-gray-500",
										variant === 'deleted' && "line-through"
									)}>
										{account.details.experience}
									</span>
									<span className={cn(
										"text-sm text-gray-500",
										variant === 'deleted' && "line-through"
									)}>
										{account.details.expertise}
									</span>
								</div>
							</TableCell>

							{/* Note */}
							<TableCell>
								<div className={cn(
									"text-sm text-gray-600 max-w-xs",
									variant === 'deleted' && "line-through"
								)}>
									{account.note}
								</div>
							</TableCell>

							{/* Files */}
							<TableCell centerContent>
								{account.hasFiles ? (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onViewFiles?.(account)}
										className="p-0 h-auto hover:bg-transparent"
									>
										<div className="flex items-center justify-center w-12 h-16 bg-red-50 rounded border border-red-200 hover:bg-red-100 transition-colors">
											<FileText className="w-6 h-6 text-red-500" />
										</div>
									</Button>
								) : (
									<span className="text-sm text-gray-400">No files</span>
								)}
							</TableCell>

							{/* Account Creation / Actions Column */}
							{variant === 'accepted' && (
								<TableCell centerContent>
									<div className="flex flex-col items-center gap-1">
										<span className="text-sm text-gray-600">Coach accepted</span>
										<span className="text-sm text-gray-500">{account.createdDate}</span>
										<span className="text-sm text-gray-500">{account.createdTime}</span>
									</div>
								</TableCell>
							)}

							{variant === 'created' && (
								<TableCell centerContent>
									<div className="flex flex-col gap-3 items-center">
										<Button
											onClick={() => onCreateAccount?.(account)}
											size="sm"
											className="bg-blue-600 hover:bg-blue-700 text-white px-6"
										>
											Create Account
										</Button>
										<Button
											onClick={() => onDeleteAccount?.(account)}
											variant="outline"
											size="sm"
											className="text-red-600 border-red-600 hover:bg-red-50 px-6"
										>
											Delete Account
										</Button>
									</div>
								</TableCell>
							)}

							{variant === 'deleted' && (
								<TableCell centerContent>
									<div className="flex flex-col items-center gap-1">
										<span className="text-sm text-gray-600">Account deleted on:</span>
										<span className="text-sm text-gray-500">{account.createdDate}</span>
										<span className="text-sm text-gray-500">{account.createdTime}</span>
									</div>
								</TableCell>
							)}

							{/* Account Status */}
							<TableCell>
								<div className="flex flex-col gap-1">
									<span className={cn(
										"text-sm font-medium text-gray-900",
										variant === 'deleted' && "line-through"
									)}>
										{account.accountStatus}
									</span>
									<span className={cn(
										"text-sm text-gray-500",
										variant === 'deleted' && "line-through"
									)}>
										{account.createdDate}
									</span>
									<span className={cn(
										"text-sm text-gray-500",
										variant === 'deleted' && "line-through"
									)}>
										{account.createdTime}
									</span>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default CoachUserAccountsTableNew;

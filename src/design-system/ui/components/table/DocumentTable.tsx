import React from 'react';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from './Table';
import { Avatar } from '@/design-system/ui/base/avatar';
import { FileText } from 'lucide-react';
import { cn } from '@/core/utils';

export interface Document {
	id: string;
	name: string;
	owner: {
		name: string;
		email: string;
		avatarUrl?: string;
	};
	role: string;
	date: string;
	fileType?: 'pdf' | 'docx' | 'xlsx' | 'other';
}

interface DocumentTableProps {
	documents: Document[];
	compact?: boolean;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
	documents,
	compact = false,
}) => {
	const getFileIcon = (fileType?: string) => {
		switch (fileType) {
			case 'pdf':
				return (
					<div className="flex items-center justify-center w-10 h-12 bg-red-50 rounded">
						<FileText className="h-6 w-6 text-red-500" />
					</div>
				);
			case 'docx':
				return (
					<div className="flex items-center justify-center w-10 h-12 bg-blue-50 rounded">
						<FileText className="h-6 w-6 text-blue-500" />
					</div>
				);
			default:
				return (
					<div className="flex items-center justify-center w-10 h-12 bg-gray-50 rounded">
						<FileText className="h-6 w-6 text-gray-500" />
					</div>
				);
		}
	};

	return (
		<Table compact={compact}>
			<TableHeader>
				<TableRow>
					<TableHead className="text-blue-300">Owner</TableHead>
					<TableHead className="text-blue-300">Role</TableHead>
					<TableHead className="text-blue-300">Document Name</TableHead>
					<TableHead className="text-blue-300">Date</TableHead>
					<TableHead className="text-blue-300">Files</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{documents.map((document) => (
					<TableRow key={document.id}>
						<TableCell>
							<div className="flex items-center gap-3">
								<Avatar
									className={cn(
										'h-12 w-12',
										document.owner.avatarUrl ? '' : 'bg-blue-100',
									)}
								>
									{document.owner.avatarUrl ? (
										<img
											src={document.owner.avatarUrl}
											alt={document.owner.name}
											className="object-cover w-full h-full"
										/>
									) : (
										<div className="flex items-center justify-center w-full h-full text-lg text-blue-500 font-medium">
											{document.owner.name.charAt(0)}
										</div>
									)}
								</Avatar>
								<div>
									<div className="font-medium">{document.owner.name}</div>
									<div className="text-sm text-blue-300">
										{document.owner.email}
									</div>
								</div>
							</div>
						</TableCell>
						<TableCell>{document.role}</TableCell>
						<TableCell>{document.name}</TableCell>
						<TableCell>{document.date}</TableCell>
						<TableCell>{getFileIcon(document.fileType)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default DocumentTable;

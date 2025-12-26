import React from 'react';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
	TableDivider,
} from './Table';
import {
	Folder,
	FileText,
	ChevronDown,
	ChevronUp,
	Download,
	Edit,
	Share,
	MoreVertical,
} from 'lucide-react';
import AvatarGroup, { Member } from './AvatarGroup';
import { Button } from '@/design-system/ui/base/button';
import { cn } from '@/core/utils';
import {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
} from '@/design-system/ui/base/context-menu';
import { Tooltip } from '@/design-system/ui/base/tooltip';

export interface FileItem {
	id: string;
	name: string;
	type: 'file' | 'folder' | 'form';
	fileType?: 'pdf' | 'docx' | 'xlsx';
	size?: string;
	date: string;
	members?: Member[];
	isExpandable?: boolean;
	isExpanded?: boolean;
	children?: FileItem[];
}

interface FileTableProps {
	files: FileItem[];
	onActionClick?: (actionType: string, file: FileItem) => void;
	compact?: boolean;
	showHeader?: boolean;
}

const FileTable: React.FC<FileTableProps> = ({
	files: initialFiles,
	onActionClick,
	compact = false,
	showHeader = false,
}) => {
	const [files, setFiles] = React.useState(initialFiles);

	const toggleExpand = (id: string) => {
		setFiles(
			files.map((file) =>
				file.id === id ? { ...file, isExpanded: !file.isExpanded } : file,
			),
		);
	};

	const getFileIcon = (file: FileItem) => {
		if (file.type === 'folder') {
			return (
				<div className="flex items-center justify-center w-10 h-10 bg-amber-50 rounded">
					<Folder className="h-6 w-6 text-amber-500" />
				</div>
			);
		} else if (file.type === 'form') {
			return (
				<div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded">
					<FileText className="h-6 w-6 text-gray-500" />
				</div>
			);
		} else {
			switch (file.fileType) {
				case 'pdf':
					return (
						<div className="flex items-center justify-center w-10 h-10 bg-red-50 rounded">
							<FileText className="h-6 w-6 text-red-500" />
						</div>
					);
				case 'docx':
					return (
						<div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded">
							<FileText className="h-6 w-6 text-blue-500" />
						</div>
					);
				default:
					return (
						<div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded">
							<FileText className="h-6 w-6 text-gray-500" />
						</div>
					);
			}
		}
	};

	const handleAction = (
		actionType: string,
		file: FileItem,
		e?: React.MouseEvent,
	) => {
		if (e) e.stopPropagation();
		onActionClick && onActionClick(actionType, file);
	};

	const ActionButton = ({
		icon,
		actionType,
		file,
		tooltipText,
	}: {
		icon: React.ReactNode;
		actionType: string;
		file: FileItem;
		tooltipText: string;
	}) => (
		<div>
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 text-gray-400 hover:text-gray-600"
				onClick={(e) => handleAction(actionType, file, e)}
			>
				{icon}
			</Button>
		</div>
	);

	return (
		<Table compact={compact}>
			{showHeader && (
				<TableHeader>
					<TableRow withDivider={false}>
						<TableCell>Name</TableCell>
						<TableCell>Type</TableCell>
						<TableCell>Size</TableCell>
						<TableCell>Date</TableCell>
						<TableCell>Members</TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHeader>
			)}
			<TableBody>
				{files.map((file) => (
					<React.Fragment key={file.id}>
						<TableRow
							isExpandable={file.isExpandable}
							onClick={() => file.isExpandable && toggleExpand(file.id)}
							className={cn(
								file.isExpandable && 'cursor-pointer hover:bg-gray-50',
							)}
							withDivider={false}
						>
							<TableCell>
								<div className="flex items-center gap-3">
									{file.isExpandable &&
										(file.isExpanded ? (
											<ChevronDown className="h-5 w-5 text-gray-500" />
										) : (
											<ChevronUp className="h-5 w-5 text-gray-500" />
										))}
									{getFileIcon(file)}
									<div className="font-medium">{file.name}</div>
								</div>
							</TableCell>
							<TableCell>{file.fileType || file.type}</TableCell>
							<TableCell>{file.size || '-'}</TableCell>
							<TableCell>{file.date}</TableCell>
							<TableCell>
								{file.members && (
									<AvatarGroup members={file.members} size="sm" />
								)}
							</TableCell>
							<TableCell>
								<div className="flex justify-end">
									<ActionButton
										icon={<Download className="h-4 w-4" />}
										actionType="download"
										file={file}
										tooltipText="Download"
									/>
								</div>
							</TableCell>
						</TableRow>

						<TableDivider />

						{file.isExpanded && file.children && file.children.length > 0 && (
							<>
								{file.children.map((childFile) => (
									<React.Fragment key={childFile.id}>
										<TableRow
											className="bg-gray-50/50"
											isSubRow
											withDivider={false}
										>
											<TableCell>
												<div className="flex items-center gap-3 pl-10">
													{getFileIcon(childFile)}
													<div className="font-medium">{childFile.name}</div>
												</div>
											</TableCell>
											<TableCell>
												{childFile.fileType || childFile.type}
											</TableCell>
											<TableCell>{childFile.size || '-'}</TableCell>
											<TableCell>{childFile.date}</TableCell>
											<TableCell>
												{childFile.members && (
													<AvatarGroup members={childFile.members} size="sm" />
												)}
											</TableCell>
											<TableCell>
												<ContextMenu>
													<ContextMenuTrigger asChild>
														<div className="flex space-x-2 justify-end">
															<ActionButton
																icon={<Download className="h-4 w-4" />}
																actionType="download"
																file={childFile}
																tooltipText="Download"
															/>
															<ActionButton
																icon={<Edit className="h-4 w-4" />}
																actionType="edit"
																file={childFile}
																tooltipText="Edit"
															/>
															<ActionButton
																icon={<Share className="h-4 w-4" />}
																actionType="share"
																file={childFile}
																tooltipText="Share"
															/>
															<ActionButton
																icon={<MoreVertical className="h-4 w-4" />}
																actionType="more"
																file={childFile}
																tooltipText="More options"
															/>
														</div>
													</ContextMenuTrigger>
													<ContextMenuContent className="w-48">
														<ContextMenuItem
															onClick={() =>
																handleAction('download', childFile)
															}
														>
															<Download className="h-4 w-4 mr-2" />
															<span>Download</span>
														</ContextMenuItem>
														<ContextMenuItem
															onClick={() => handleAction('edit', childFile)}
														>
															<Edit className="h-4 w-4 mr-2" />
															<span>Edit</span>
														</ContextMenuItem>
														<ContextMenuItem
															onClick={() => handleAction('share', childFile)}
														>
															<Share className="h-4 w-4 mr-2" />
															<span>Share</span>
														</ContextMenuItem>
														<ContextMenuItem
															onClick={() => handleAction('delete', childFile)}
														>
															<span className="text-red-500">Delete</span>
														</ContextMenuItem>
													</ContextMenuContent>
												</ContextMenu>
											</TableCell>
										</TableRow>
										<TableDivider />
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

export default FileTable;

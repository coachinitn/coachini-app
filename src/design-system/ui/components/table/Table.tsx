import React from 'react';
import { cn } from '@/core/utils';
import { Separator } from '@/design-system/ui/base/separator';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
	children: React.ReactNode;
	compact?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
	({ className, children, compact = false, ...props }, ref) => {
		return (
				<table
					ref={ref}
					className={cn(
						'w-full caption-bottom text-sm',
						compact && 'border-collapse',
						className,
					)}
					{...props}
				>
					{children}
				</table>
		);
	},
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead
		ref={ref}
		className={cn('sticky top-0 z-10 border-b border-gray-200 bg-white', className)}
		{...props}
	/>
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		className={cn('[&_tr:last-child]:border-0', className)}
		{...props}
	/>
));
TableBody.displayName = 'TableBody';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
	isExpandable?: boolean;
	isSubRow?: boolean;
	withDivider?: boolean;
	highlight?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
	(
		{
			className,
			isExpandable = false,
			isSubRow = false,
			withDivider = true,
			highlight = false,
			...props
		},
		ref,
	) => (
		<tr
			ref={ref}
			className={cn(
				withDivider ? 'border-b border-gray-200' : '',
				isSubRow ? 'bg-gray-50/50' : '',
				highlight ? 'bg-blue-50/20' : '',
				'transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50',
				isExpandable && 'cursor-pointer',
				className,
			)}
			{...props}
		/>
	),
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement> & { hideOnMobile?: boolean }
>(({ className, hideOnMobile, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			'h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0',
			hideOnMobile && 'hidden md:table-cell',
			className,
		)}
		{...props}
	/>
));
TableHead.displayName = 'TableHead';

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
	hideOnMobile?: boolean;
	centerContent?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
	({ className, hideOnMobile, centerContent, ...props }, ref) => (
		<td
			ref={ref}
			className={cn(
				'p-4 align-middle [&:has([role=checkbox])]:pr-0',
				hideOnMobile && 'hidden md:table-cell',
				centerContent && 'text-center',
				className,
			)}
			{...props}
		/>
	),
);
TableCell.displayName = 'TableCell';

const TableDivider: React.FC = () => (
	<tr>
		<td colSpan={100} className="p-0">
			<Separator className="w-full h-px bg-gray-200" />
		</td>
	</tr>
);
TableDivider.displayName = 'TableDivider';

export {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	TableDivider,
};

/**
 * Admin Navigation Configuration
 *
 * Navigation items for supervisors and administrators
 */

import { Role, Permission } from '../../redux/features/user/slice';
import { NavigationItem } from '../config';
import { UsersIcon, ReportsIcon, RequestsIcon, ProfileIcon } from '@/design-system/icons/layout';

export const adminNavigation: NavigationItem[] = [
	// {
	// 	name: 'Reports',
	// 	href: '/dashboard/reports',
	// 	icon: '/icons/requests-icon.svg',
	// 	allowedRoles: [Role.SUPERVISOR, Role.ADMIN],
	// 	// requiredPermissions: [Permission.VIEW_REQUESTS],
	// 	description: 'Manage user requests',
	// 	fallbackPath: '/dashboard',
	// 	subPaths: [
	// 		// ✅ OPTIMAL: Use wildcards for broad coverage
	// 		'/dashboard/reports/*',    // Covers all direct sub-routes
	// 		'/dashboard/reports/**',   // Covers all nested routes

	// 		// ✅ Specific routes if needed (these are now redundant with wildcards above)
	// 		// '/dashboard/requests/pending',
	// 		// '/dashboard/requests/approved',
	// 		// '/dashboard/requests/rejected',
	// 		// '/dashboard/requests/archived',
	// 	],
	// 	showInNavigation: true,
	// },
	{
		name: 'Users',
		href: '/dashboard/users',
		icon: UsersIcon,
		allowedRoles: [Role.ADMIN],
		// requiredPermissions: [Permission.MANAGE_SYSTEM],
		description: 'Users',
		fallbackPath: '/dashboard',
		subPaths: [],
		showInNavigation: true,
		order: 3, // Global order - appears 3rd for all roles
		roleSpecificOrder: {
			[Role.ADMIN]: 3, // For ADMIN role, appears 4th instead
			[Role.SUPERVISOR]: 2, // For SUPERVISOR role, appears 2nd
		},
	},
	{
		name: 'Reports',
		href: '/dashboard/reports',
		icon: ReportsIcon,
		allowedRoles: [Role.SUPERVISOR, Role.ADMIN],
		// requiredPermissions: [Permission.VIEW_REPORTS],
		description: 'View reports and analytics',
		fallbackPath: '/dashboard',
		subPaths: [
			'/dashboard/reports/analytics',
			'/dashboard/reports/export',
			'/dashboard/reports/custom',
			'/dashboard/reports/scheduled',
		],
		showInNavigation: true,
		order: 3, // Appears first by default
		roleSpecificOrder: {
			[Role.ADMIN]: 5, // For ADMIN, appears 2nd
		},
	},
	{
		name: 'Requests',
		href: '/dashboard/requests',
		icon: RequestsIcon,
		allowedRoles: [Role.SUPERVISOR, Role.ADMIN],
		// requiredPermissions: [Permission.VIEW_REQUESTS],
		description: 'Manage user requests',
		fallbackPath: '/dashboard',
		// subPaths: [
		// 	// ✅ OPTIMAL: Use wildcards for comprehensive coverage
		// 	'/dashboard/requests/*', // All direct sub-routes (pending, approved, etc.)
		// 	'/dashboard/requests/**', // All nested routes (details, edit, etc.)
		// ],
		showInNavigation: true,
	},
	{
		name: 'User Accounts',
		href: '/dashboard/user-acc',
		icon: RequestsIcon,
		allowedRoles: [Role.ADMIN],
		// requiredPermissions: [Permission.MANAGE_ACCOUNTS],
		description: 'Manage user accounts',
		fallbackPath: '/dashboard',
		subPaths: [
			'/dashboard/user-acc/create',
			'/dashboard/user-acc/edit',
			'/dashboard/user-acc/bulk-import',
			'/dashboard/user-acc/export',
		],
		showInNavigation: true,
	},
	// Hidden admin routes (accessible via direct URL only)
	{
		name: 'API Documentation',
		href: '/dashboard/api-docs',
		icon: '/icons/api-icon.svg',
		allowedRoles: [Role.ADMIN],
		requiredPermissions: [Permission.MANAGE_SYSTEM],
		description: 'API documentation (admin only)',
		fallbackPath: '/dashboard',
		showInNavigation: false,
	},
	{
		name: 'System Settings',
		href: '/dashboard/admin/settings',
		icon: '/icons/settings-icon.svg',
		allowedRoles: [Role.ADMIN],
		requiredPermissions: [Permission.MANAGE_SYSTEM],
		description: 'System configuration and settings',
		fallbackPath: '/dashboard',
		showInNavigation: false,
		subPaths: [
			'/dashboard/admin/settings/users',
			'/dashboard/admin/settings/system',
			'/dashboard/admin/settings/security',
			'/dashboard/admin/settings/integrations',
		],
	},
	{
		name: 'System Logs',
		href: '/dashboard/admin/logs',
		icon: '/icons/logs-icon.svg',
		allowedRoles: [Role.ADMIN],
		requiredPermissions: [Permission.VIEW_LOGS],
		description: 'System logs and audit trail',
		fallbackPath: '/dashboard',
		showInNavigation: false,
		subPaths: [
			'/dashboard/admin/logs/access',
			'/dashboard/admin/logs/errors',
			'/dashboard/admin/logs/security',
		],
	},

	// Hidden request sub-pages
	{
		name: 'Request Details',
		href: '/dashboard/requests/details',
		icon: RequestsIcon,
		allowedRoles: [Role.SUPERVISOR, Role.ADMIN],
		requiredPermissions: [Permission.VIEW_REQUESTS],
		description: 'View request details',
		fallbackPath: '/dashboard/requests',
		showInNavigation: false,
	},
	{
		name: 'Bulk Request Actions',
		href: '/dashboard/requests/bulk',
		icon: RequestsIcon,
		allowedRoles: [Role.ADMIN],
		requiredPermissions: [Permission.MANAGE_REQUESTS],
		description: 'Bulk request management',
		fallbackPath: '/dashboard/requests',
		showInNavigation: false,
	},
];

export default adminNavigation;

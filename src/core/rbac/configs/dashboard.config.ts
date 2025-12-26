/**
 * Dashboard Navigation Configuration
 * 
 * Core dashboard and profile related navigation items
 */

import { Role, Permission } from '../../redux/features/user/slice';
import { NavigationItem } from '../config';
import { HomeIcon, ProfileIcon } from '@/design-system/icons/layout';

export const dashboardNavigation: NavigationItem[] = [
	{
		name: 'Dashboard',
		href: '/dashboard',
		icon: HomeIcon,
		allowedRoles: [
			Role.USER,
			Role.COACHEE,
			Role.COACH,
			Role.SUPERVISOR,
			Role.ADMIN,
		],
		requiredPermissions: [Permission.VIEW_DASHBOARD],
		description: 'Main dashboard overview',
		fallbackPath: '/auth/login',
		order:1,
		exactMatch: true,
		showInNavigation: true,
	},
	{
		name: 'Profile',
		href: '/dashboard/profile',
		icon: ProfileIcon,
		allowedRoles: [
			Role.USER,
			Role.COACHEE,
			Role.COACH,
			Role.SUPERVISOR,
			Role.ADMIN,
		],
		// requiredPermissions: [Permission.VIEW_PROFILE],
		description: 'User profile settings',
		fallbackPath: '/dashboard',
		exactMatch: true,
		showInNavigation: true,
		order: 4,
	},

	// Hidden profile sub-pages
	{
		name: 'Edit Profile',
		href: '/dashboard/profile/edit',
		icon: ProfileIcon,
		allowedRoles: [
			Role.USER,
			Role.COACHEE,
			Role.COACH,
			Role.SUPERVISOR,
			Role.ADMIN,
		],
		requiredPermissions: [Permission.EDIT_PROFILE],
		description: 'Edit user profile',
		fallbackPath: '/dashboard/profile',
		showInNavigation: false,
	},
	{
		name: 'Profile Settings',
		href: '/dashboard/profile/settings',
		icon: ProfileIcon,
		allowedRoles: [
			Role.USER,
			Role.COACHEE,
			Role.COACH,
			Role.SUPERVISOR,
			Role.ADMIN,
		],
		requiredPermissions: [Permission.EDIT_PROFILE],
		description: 'Profile settings and preferences',
		fallbackPath: '/dashboard/profile',
		showInNavigation: false,
	},
];

export default dashboardNavigation;

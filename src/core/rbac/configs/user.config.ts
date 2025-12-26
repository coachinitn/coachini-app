/**
 * User-Level Navigation Configuration
 * 
 * Navigation items for regular users, coaches, and coachees
 */

import { Role, Permission } from '../../redux/features/user/slice';
import { NavigationItem } from '../config';
import { DiscoveryIcon, PlusIcon } from '@/design-system/icons/layout';

export const userNavigation: NavigationItem[] = [
  {
    name: 'Themes',
    href: '/dashboard/themes',
    icon: DiscoveryIcon,
    allowedRoles: [Role.COACHEE, Role.COACH, Role.SUPERVISOR, Role.ADMIN],
    // requiredPermissions: [Permission.VIEW_THEMES],
    description: 'Browse and manage themes',
    fallbackPath: '/dashboard',
    subPaths: [
      '/dashboard/themes/create', 
      '/dashboard/themes/edit',
      '/dashboard/themes/browse',
      '/dashboard/themes/my-themes'
    ],
    order:2,
    showInNavigation: true,
  },
  {
    name: 'Teams',
    href: '/dashboard/teams',
    icon: PlusIcon,
    allowedRoles: [Role.COACH, Role.SUPERVISOR, Role.ADMIN],
    requiredPermissions: [Permission.VIEW_TEAMS],
    description: 'Manage teams and members',
    fallbackPath: '/dashboard',
    subPaths: [
      '/dashboard/teams/create', 
      '/dashboard/teams/edit',
      '/dashboard/teams/members',
      '/dashboard/teams/settings'
    ],
  },
  
  // Hidden theme sub-pages
  {
    name: 'Create Theme',
    href: '/dashboard/themes/create',
    icon: DiscoveryIcon,
    allowedRoles: [Role.COACH, Role.SUPERVISOR, Role.ADMIN],
    requiredPermissions: [Permission.CREATE_THEMES],
    description: 'Create new theme',
    fallbackPath: '/dashboard/themes',
    showInNavigation: false,
  },
  {
    name: 'Edit Theme',
    href: '/dashboard/themes/edit',
    icon: DiscoveryIcon,
    allowedRoles: [Role.COACH, Role.SUPERVISOR, Role.ADMIN],
    requiredPermissions: [Permission.EDIT_THEMES],
    description: 'Edit existing theme',
    fallbackPath: '/dashboard/themes',
    showInNavigation: false,
  },
  
  // Hidden team sub-pages
  {
    name: 'Create Team',
    href: '/dashboard/teams/create',
    icon: PlusIcon,
    allowedRoles: [Role.COACH, Role.SUPERVISOR, Role.ADMIN],
    requiredPermissions: [Permission.CREATE_TEAMS],
    description: 'Create new team',
    fallbackPath: '/dashboard/teams',
    showInNavigation: false,
  },
  {
    name: 'Team Settings',
    href: '/dashboard/teams/settings',
    icon: PlusIcon,
    allowedRoles: [Role.COACH, Role.SUPERVISOR, Role.ADMIN],
    requiredPermissions: [Permission.MANAGE_TEAMS],
    description: 'Team settings and configuration',
    fallbackPath: '/dashboard/teams',
    showInNavigation: false,
  },
];

export default userNavigation;

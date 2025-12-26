/**
 * RBAC Configuration Index
 * 
 * Combines all feature-based navigation configurations into a unified config
 */

import { NavigationItem } from '../config';
import dashboardNavigation from './dashboard.config';
import userNavigation from './user.config';
import adminNavigation from './admin.config';

/**
 * Combined navigation configuration from all feature modules
 * This maintains the single source of truth while organizing by features
 */
export const navigationConfig: NavigationItem[] = [
  ...dashboardNavigation,
  ...userNavigation,
  ...adminNavigation,
];

/**
 * Feature-specific navigation exports for targeted filtering
 */
export const navigationByFeature = {
  dashboard: dashboardNavigation,
  user: userNavigation,
  admin: adminNavigation,
};

/**
 * Get navigation items by feature
 */
export const getNavigationByFeature = (feature: keyof typeof navigationByFeature): NavigationItem[] => {
  return navigationByFeature[feature] || [];
};

/**
 * Get all visible navigation items (excludes hidden routes)
 */
export const getVisibleNavigationConfig = (): NavigationItem[] => {
  return navigationConfig.filter(item => item.showInNavigation !== false);
};

/**
 * Get all hidden navigation items (routes that are protected but not shown)
 */
export const getHiddenNavigationConfig = (): NavigationItem[] => {
  return navigationConfig.filter(item => item.showInNavigation === false);
};

/**
 * Navigation statistics
 */
export const getNavigationStats = () => {
  const total = navigationConfig.length;
  const visible = getVisibleNavigationConfig().length;
  const hidden = getHiddenNavigationConfig().length;
  
  return {
    total,
    visible,
    hidden,
    byFeature: {
      dashboard: dashboardNavigation.length,
      user: userNavigation.length,
      admin: adminNavigation.length,
    },
  };
};

// Re-export individual configs for direct access
export { dashboardNavigation, userNavigation, adminNavigation };

export default navigationConfig;

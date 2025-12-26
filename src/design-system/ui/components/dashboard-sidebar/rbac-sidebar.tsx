/**
 * RBAC-Enhanced Dashboard Sidebar
 *
 * Sidebar component with role-based navigation filtering
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { cn } from '@/core/utils/cn';
import { AnimationStyle } from './types';
import { TitleMedium } from '@/design-system/ui/base';
import { Icon } from '@/design-system/ui/components/icon';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationItems, useRBAC } from '@/core/rbac/hooks';
import { NavigationItem } from '@/core/rbac/config';

export interface RBACDashboardSidebarProps {
  className?: string;
  animationStyle?: AnimationStyle;
  children?: React.ReactNode;
  showRoleIndicator?: boolean;
  showPermissionCount?: boolean;
  developmentMode?: boolean; // Show basic navigation when no roles are set
}

export function RBACDashboardSidebar({
  className,
  animationStyle = 'center-outward',
  children,
  showRoleIndicator = false,
  showPermissionCount = false,
  developmentMode = false,
}: RBACDashboardSidebarProps) {
  const pathname = usePathname();

  // Get filtered navigation items based on user's roles and permissions
  const filteredNavigationItems = useNavigationItems();
  const { userRoles } = useRBAC();

  // Track if this is the first render to prevent animation restart
  const [isFirstRender, setIsFirstRender] = React.useState(true);

  React.useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, [isFirstRender]);

  // In development mode, show basic navigation when no roles are set
  const navigationItems = React.useMemo(() => {
    if (developmentMode && process.env.NODE_ENV === 'development' && userRoles.length === 0) {
      // Show basic navigation items for development
      return [
        {
          name: 'Dashboard',
          href: '/dashboard',
          icon: '/icons/layout/home-icon.svg',
          allowedRoles: [],
          description: 'Main dashboard (dev mode)',
        },
        {
          name: 'Profile',
          href: '/dashboard/profile',
          icon: '/icons/layout/profile-icon.svg',
          allowedRoles: [],
          description: 'User profile (dev mode)',
        },
      ] as NavigationItem[];
    }
    return filteredNavigationItems;
  }, [developmentMode, userRoles.length, filteredNavigationItems]);

  // Update activePathname when pathname changes to trigger animation
  useEffect(() => {
    // This effect can be used for animations if needed
  }, [pathname]);

  // Define animation variants for the sidebar
  const sidebarVariants = {
    hidden: { opacity: 0.95, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.15,
        staggerChildren: 0.05,
      },
    },
  };

  // Animation variants for sidebar items
  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.15 },
    },
  };

  // Badge component for navigation items
  const NavigationBadge: React.FC<{ item: NavigationItem }> = ({ item }) => {
    if (!item.badge && !item.isNew) return null;

    return (
      <div className="ml-auto flex items-center gap-1">
        {item.isNew && (
          <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            New
          </span>
        )}
        {item.badge && (
          <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {item.badge}
          </span>
        )}
      </div>
    );
  };

  return (
    <motion.div
      layout // Prevent restart on re-render
      initial={isFirstRender ? "hidden" : false} // Skip initial animation after first render
      animate="visible"
      variants={sidebarVariants}
      className={cn(
        'sticky top-0 left-0 h-screen w-[210px] shrink-0 flex-col bg-card border-r border-border dark:border-border overflow-y-auto',
        'hidden lg:flex',
        className,
      )}
    >
      {/* Logo Section */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center">
          <div className="flex items-center w-[143px] h-[47px] shrink-0">
            <Image
              src={'/icons/layout/C-Logo-Big.svg'}
              alt={`Coachini Logo`}
              width={143}
              height={47}
            />
          </div>
        </Link>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="h-px mx-6 bg-border dark:bg-border"
      />

      {/* Navigation Section */}
      <div className="py-6 shrink-0 flex-1">
        <nav>
          <ul className="space-y-[20px]">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <motion.li
                  key={item.name}
                  layout // Prevent restart on re-render
                  variants={itemVariants}
                  className="py-[2px] group/sidebarItem"
                >
                  <Link href={item.href} title={item.description}>
                    <motion.div
                      layout // Prevent restart on re-render
                      className={cn(
                        'flex items-center gap-4 px-6 py-1 relative rounded-md',
                        isActive
                          ? 'text-primary dark:text-primary'
                          : 'text-muted-foreground dark:text-muted-foreground dark:hover:text-foreground group-hover/sidebarItem:text-foreground/70',
                      )}
                    >
                      <div className={cn('flex items-center gap-4 flex-1')}>
                        <Icon
                          icon={item.icon}
                          alt={`${item.name} icon`}
                          isActive={isActive}
                          className={cn(
                            'w-[24px] h-[24px]',
                            !isActive &&
                              'group-hover/sidebarItem:text-foreground/70',
                          )}
                          activeClassName="text-primary-900 dark:text-primary-500"
                          inactiveClassName="text-muted-foreground"
                        />

                        <TitleMedium
                          className={cn(
                            isActive
                              ? 'text-foreground'
                              : 'text-muted-foreground group-hover/sidebarItem:text-foreground/70',
                          )}
                        >
                          {item.name}
                        </TitleMedium>
                      </div>

                      {/* Navigation badges */}
                      <NavigationBadge item={item} />

                      {/* Active indicator */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={
                              animationStyle === 'top-to-bottom'
                                ? { top: 0, bottom: '100%', opacity: 0 }
                                : animationStyle === 'bottom-to-top'
                                  ? { top: '100%', bottom: 0, opacity: 0 }
                                  : { top: '50%', bottom: '50%', opacity: 0 }
                            }
                            animate={{
                              top: 0,
                              bottom: 0,
                              opacity: 1
                            }}
                            exit={
                              animationStyle === 'top-to-bottom'
                                ? { bottom: 0, top: '100%', opacity: 0 }
                                : animationStyle === 'bottom-to-top'
                                  ? { bottom: '100%', top: 0, opacity: 0 }
                                  : { top: '50%', bottom: '50%', opacity: 0 }
                            }
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="absolute right-0 w-1 rounded-[25px] bg-primary-900 dark:bg-primary-500"
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer Section */}
      {(showRoleIndicator || showPermissionCount) && (
        <div className="p-4 border-t border-border">
          <RoleIndicator
            showRole={showRoleIndicator}
            showPermissionCount={showPermissionCount}
          />
        </div>
      )}

      {/* Custom children */}
      {children}
    </motion.div>
  );
}

// ==================== ROLE INDICATOR COMPONENT ====================

interface RoleIndicatorProps {
  showRole: boolean;
  showPermissionCount: boolean;
}

const RoleIndicator: React.FC<RoleIndicatorProps> = ({
  showRole,
  showPermissionCount
}) => {
  const { currentRole, allPermissions } = useRBAC();

  if (!showRole && !showPermissionCount) return null;

  return (
    <div className="text-xs text-muted-foreground space-y-1">
      {showRole && currentRole && (
        <div className="flex items-center justify-between">
          <span>Role:</span>
          <span className="font-medium capitalize">{currentRole}</span>
        </div>
      )}
      {showPermissionCount && (
        <div className="flex items-center justify-between">
          <span>Permissions:</span>
          <span className="font-medium">{allPermissions?.length + 5 || 0}</span>
        </div>
      )}
    </div>
  );
};

// ==================== EXPORT ====================

export default RBACDashboardSidebar;

"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { TitleSmall, HeadlineMedium, Navbar } from "@/design-system/ui"
import { cn } from "@/core/utils"

interface PageConfig {
  title: string
  breadcrumb: string
  searchPlaceholder?: string
  searchScope?: string
}

// Page-specific configuration mapping
const PAGE_CONFIGS: Record<string, PageConfig> = {
    '/dashboard': {
        title: 'Dashboard',
        breadcrumb: 'HOME',
        searchPlaceholder: 'Search dashboard...',
        searchScope: 'dashboard'
    },
    '/dashboard/themes': {
        title: 'Themes',
        breadcrumb: 'Dashboard / Themes',
        searchPlaceholder: 'Search themes...',
        searchScope: 'themes'
    },
    '/dashboard/requests': {
        title: 'Requests',
        breadcrumb: 'Dashboard / Requests',
        searchPlaceholder: 'Search requests...',
        searchScope: 'requests'
    },
    '/dashboard/user-acc': {
        title: 'User Accounts',
        breadcrumb: 'Dashboard / User Accounts',
        searchPlaceholder: 'Search users...',
        searchScope: 'users'
    },
    '/dashboard/profile': {
        title: 'Profile',
        breadcrumb: 'Dashboard / Profile',
        searchPlaceholder: 'Search profile...',
        searchScope: 'profile'
    },
    '/dashboard/teams': {
        title: 'Teams',
        breadcrumb: 'Dashboard / Teams',
        searchPlaceholder: 'Search teams...',
        searchScope: 'teams'
    }
};

// Default fallback configuration
const DEFAULT_CONFIG: PageConfig = {
  title: 'Dashboard',
  breadcrumb: 'DASHBOARD',
  searchPlaceholder: 'Search...',
  searchScope: 'general'
}

export function DynamicNavHeader() {
  const pathname = usePathname()
  
  // Get page configuration based on current path
  const getPageConfig = (): PageConfig => {
    // Try exact match first
    if (PAGE_CONFIGS[pathname]) {
      return PAGE_CONFIGS[pathname]
    }
    
    // Try partial matches for nested routes
    const matchingPath = Object.keys(PAGE_CONFIGS).find(path => 
      pathname.startsWith(path) && path !== '/dashboard'
    )
    
    if (matchingPath) {
      return PAGE_CONFIGS[matchingPath]
    }
    
    return DEFAULT_CONFIG
  }

  const config = getPageConfig()

  return (
      <nav aria-label='Page Navigation' className='sticky top-0 left-0 z-30 flex shadow-small bg-background'>
          <div
              className={cn('flex items-center justify-center w-full gap-[15px] bg-background', 'px-[30px] py-[30px]')}>
              <div className='relative w-full z-10'>
                  <div className='flex flex-col gap-[12px] sm:flex-row sm:items-center sm:justify-between capitalize'>
                      <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          key={pathname} // Re-animate when path changes
                      >
                          <TitleSmall className='text-foreground-emphasis'>{config.breadcrumb}</TitleSmall>
                          <HeadlineMedium className='font-medium'>{config.title}</HeadlineMedium>
                      </motion.div>

                      {/* Pass search context to Navbar */}
                      <Navbar searchPlaceholder={config.searchPlaceholder} searchScope={config.searchScope} />
                  </div>
              </div>
          </div>
      </nav>
  );
}

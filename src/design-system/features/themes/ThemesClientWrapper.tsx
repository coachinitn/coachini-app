'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import ThemesPageSupervisor from '../supervisor/themes/page';
import { AccessDenied } from '@/core/rbac/components';
// import { useParams } from 'next/navigation'; // Available when needed for i18n

interface ServerData {
  timestamp: string;
  locale: string;
  // themes?: Theme[]; // Add this when you have actual theme data
}

export default function ThemesClientWrapper({
  serverData
}: {
  serverData?: ServerData | null
}) {
  const { data: session, status } = useSession();

  // Example: Use serverData (remove this in production)
  if (process.env.NODE_ENV === 'development' && serverData) {
    console.log('🔄 ISR Server data received:', serverData);
  }

  // // Show loading while session is being fetched
  // if (status === 'loading') {
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  // // Check if user is authenticated
  // if (status === 'unauthenticated' || !session?.user) {
  //   return (
  //     <AccessDenied
  //       title="Authentication Required"
  //       message="You need to be logged in to access the themes management page."
  //       showCurrentRole={false}
  //     />
  //   );
  // }

  // // Get user roles from session
  // const userRoles = session.user.roles || [];

  // // Check if user has admin, supervisor, or technician role
  // const hasThemesAccess = userRoles.includes('admin') ||
  //                        userRoles.includes('supervisor') ||
  //                        userRoles.includes('technician');

  // if (!hasThemesAccess) {
  //   return (
  //     <AccessDenied
  //       title="Themes Management"
  //       message="You need admin, supervisor, or technician privileges to access the themes management page."
  //       showCurrentRole={true}
  //     />
  //   );
  // }

  // User has access - render the themes page
  return <ThemesPageSupervisor />;
} 
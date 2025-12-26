'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import RBACRequestsPage from '../../../../design-system/pages/requests/page';

export default function RequestsClientWrapper() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  return <RBACRequestsPage />;
}
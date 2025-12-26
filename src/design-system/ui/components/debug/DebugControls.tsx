'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Role } from '@/core/redux/features/user/slice';

export function DebugControls() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: session, status } = useSession();

  // Extract user data from session
  const isAuthenticated = status === 'authenticated' && !!session;
  const userRoles = session?.user?.roles?.map(role => role as Role) || [];

  const setupTestUser = () => {
    console.warn('Test user setup is disabled in session-based RBAC');
    // TODO: Implement session-based test user setup if needed
  };

  const addAdminRole = () => {
    console.warn('Role manipulation is disabled in session-based RBAC');
    // TODO: Implement session-based role assignment if needed
  };

  const addSupervisorRole = () => {
    console.warn('Role manipulation is disabled in session-based RBAC');
    // TODO: Implement session-based role assignment if needed
  };

  const addUserRole = () => {
    console.warn('Role manipulation is disabled in session-based RBAC');
    // TODO: Implement session-based role assignment if needed
  };

  const resetRoles = () => {
    console.warn('Role manipulation is disabled in session-based RBAC');
    // TODO: Implement session-based role reset if needed
  };

  if (!isExpanded) {
    return (
      <div className="mb-6">
        <button 
          onClick={() => setIsExpanded(true)}
          className="text-sm font-medium text-primary hover:underline"
        >
          Show Debug Controls
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 p-3 border border-border rounded-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Debug Controls</h3>
        <button 
          onClick={() => setIsExpanded(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Hide
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <button
          onClick={setupTestUser}
          className="w-full py-1.5 px-2 text-xs bg-destructive text-destructive-foreground rounded"
        >
          Setup Test User
        </button>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground mb-1">Roles</h4>
        <div className="flex flex-wrap gap-1 mb-2">
          {userRoles.map(role => (
            <span key={role} className="px-2 py-0.5 text-xs bg-secondary rounded-full">{role}</span>
          ))}
          {userRoles.length === 0 && (
            <span className="px-2 py-0.5 text-xs bg-secondary/50 text-muted-foreground rounded-full">No roles</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={addAdminRole}
            className="py-1 px-2 text-xs bg-secondary text-secondary-foreground rounded"
          >
            Add Admin
          </button>
          <button
            onClick={addSupervisorRole}
            className="py-1 px-2 text-xs bg-secondary text-secondary-foreground rounded"
          >
            Add Supervisor
          </button>
          <button
            onClick={addUserRole}
            className="py-1 px-2 text-xs bg-secondary text-secondary-foreground rounded"
          >
            Add User
          </button>
          <button
            onClick={resetRoles}
            className="py-1 px-2 text-xs bg-destructive text-destructive-foreground rounded"
          >
            Reset Roles
          </button>
        </div>
      </div>
    </div>
  );
} 
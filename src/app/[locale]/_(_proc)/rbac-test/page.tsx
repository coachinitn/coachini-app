'use client';

import { useRBAC } from '@/core/rbac/hooks';
import { useAuth } from '@/core/auth/hooks';
import { Permission, Role } from '@/core/redux/features/user/slice';

export default function RBACTestPage() {
  const { 
    currentRole, 
    userRoles, 
    isLoading,
    checkPermission, 
    checkAnyRoleHasPermission,
    isAdmin,
    isSupervisorOrHigher 
  } = useRBAC();
  
  const { session, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="p-8">Loading RBAC data...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">RBAC System Test - Session Based</h1>
      
      {/* Authentication Status */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <div className="space-y-2">
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>User ID:</strong> {session?.user?.id || 'N/A'}</p>
          <p><strong>Email:</strong> {session?.user?.email || 'N/A'}</p>
          <p><strong>Name:</strong> {session?.user?.name || 'N/A'}</p>
        </div>
      </div>

      {/* Role Information */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Role Information (From Session)</h2>
        <div className="space-y-2">
          <p><strong>Current Role:</strong> {currentRole || 'None'}</p>
          <p><strong>All Roles:</strong> {userRoles.length > 0 ? userRoles.join(', ') : 'None'}</p>
          <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
          <p><strong>Is Supervisor or Higher:</strong> {isSupervisorOrHigher ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Permission Tests */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Permission Tests</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Dashboard Permissions</h3>
            <ul className="space-y-1 text-sm">
              <li>View Dashboard: {checkPermission(Permission.VIEW_DASHBOARD) ? '✅' : '❌'}</li>
              <li>View Analytics: {checkPermission(Permission.VIEW_ANALYTICS) ? '✅' : '❌'}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">User Management</h3>
            <ul className="space-y-1 text-sm">
              <li>Manage Users: {checkPermission(Permission.MANAGE_USERS) ? '✅' : '❌'}</li>
              <li>Create Users: {checkPermission(Permission.CREATE_USERS) ? '✅' : '❌'}</li>
              <li>Delete Users: {checkPermission(Permission.DELETE_USERS) ? '✅' : '❌'}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Content Management</h3>
            <ul className="space-y-1 text-sm">
              <li>Manage Content: {checkPermission(Permission.MANAGE_CONTENT) ? '✅' : '❌'}</li>
              <li>Create Content: {checkPermission(Permission.CREATE_CONTENT) ? '✅' : '❌'}</li>
              <li>Edit Content: {checkPermission(Permission.EDIT_CONTENT) ? '✅' : '❌'}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">System Permissions</h3>
            <ul className="space-y-1 text-sm">
              <li>Manage System: {checkPermission(Permission.MANAGE_SYSTEM) ? '✅' : '❌'}</li>
              <li>View Logs: {checkPermission(Permission.VIEW_LOGS) ? '✅' : '❌'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Raw Session Data */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Raw Session Data</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      {/* Migration Status */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-green-800">✅ Migration Complete</h2>
        <p className="text-green-700">
          RBAC system successfully migrated from Redux to NextAuth session-based architecture.
          All role and permission data now comes directly from the authenticated session.
        </p>
      </div>
    </div>
  );
}

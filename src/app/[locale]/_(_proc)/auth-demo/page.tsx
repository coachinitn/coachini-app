'use client';

import { useAuth, useRoleGuard, usePermissionGuard } from '@/core/auth/hooks';
import { RoleGuard, PermissionGuard, AuthGuard } from '@/design-system/ui/layout/auth/ProtectedRoute';
import { useSession } from 'next-auth/react';

export default function AuthDemoPage() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout,
    hasRole,
    hasPermission,
    isAdmin,
    isCoach,
    isStudent 
  } = useAuth();
  
  const { data: session } = useSession();
  const adminGuard = useRoleGuard(['admin']);
  const coachGuard = useRoleGuard(['coach', 'admin']);
  const readPermissionGuard = usePermissionGuard(['read']);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading authentication state...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            NextAuth.js + RBAC Demo
          </h1>
          
          {/* Authentication Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Authentication Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${isAuthenticated ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="font-medium">
                  {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
                </div>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <div className="font-medium">Loading: {isLoading ? 'Yes' : 'No'}</div>
              </div>
              <div className="p-4 bg-purple-100 rounded-lg">
                <div className="font-medium">Session: {session ? 'Active' : 'None'}</div>
              </div>
            </div>
          </div>

          {/* User Information */}
          {isAuthenticated && user && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                User Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Username:</strong> {user.username || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Email Verified:</strong> {user.isEmailVerified ? 'Yes' : 'No'}</p>
                    <p><strong>Last Login:</strong> {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Role Checks */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Role-Based Access Control
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${isAdmin ? 'bg-green-100' : 'bg-gray-100'}`}>
                <div className="font-medium">
                  Admin Access: {isAdmin ? '✅' : '❌'}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${isCoach ? 'bg-green-100' : 'bg-gray-100'}`}>
                <div className="font-medium">
                  Coach Access: {isCoach ? '✅' : '❌'}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${isStudent ? 'bg-green-100' : 'bg-gray-100'}`}>
                <div className="font-medium">
                  Student Access: {isStudent ? '✅' : '❌'}
                </div>
              </div>
            </div>
          </div>

          {/* Roles and Permissions */}
          {isAuthenticated && user && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Current Roles & Permissions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Roles:</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.roles?.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {role}
                      </span>
                    )) || <span className="text-gray-500">No roles assigned</span>}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Permissions:</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions?.slice(0, 6).map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {permission}
                      </span>
                    )) || <span className="text-gray-500">No permissions assigned</span>}
                    {user.permissions && user.permissions.length > 6 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{user.permissions.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Protected Content Examples */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Protected Content Examples
            </h2>
            <div className="space-y-4">
              {/* Auth Guard */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Authentication Required:</h3>
                <AuthGuard fallback={<p className="text-red-600">Please log in to see this content.</p>}>
                  <p className="text-green-600">✅ You are authenticated and can see this content!</p>
                </AuthGuard>
              </div>

              {/* Role Guard - Admin */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Admin Only Content:</h3>
                <RoleGuard 
                  allowedRoles={['admin']} 
                  fallback={<p className="text-red-600">Admin access required.</p>}
                >
                  <p className="text-green-600">✅ Admin content - You have admin privileges!</p>
                </RoleGuard>
              </div>

              {/* Role Guard - Coach */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Coach or Admin Content:</h3>
                <RoleGuard 
                  allowedRoles={['coach', 'admin']} 
                  fallback={<p className="text-red-600">Coach or Admin access required.</p>}
                >
                  <p className="text-green-600">✅ Coach content - You have coach or admin privileges!</p>
                </RoleGuard>
              </div>

              {/* Permission Guard */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Read Permission Required:</h3>
                <PermissionGuard 
                  requiredPermissions={['read']} 
                  fallback={<p className="text-red-600">Read permission required.</p>}
                >
                  <p className="text-green-600">✅ You have read permission!</p>
                </PermissionGuard>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            {!isAuthenticated ? (
              <a
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Login
              </a>
            ) : (
              <>
                <a
                  href="/auth-dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go to Dashboard
                </a>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAuth } from '@/core/auth/hooks';
import ProtectedRoute from '@/design-system/ui/layout/auth/ProtectedRoute';

export default function AuthDashboardPage() {
  const { user, logout, syncUserData } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const handleLogout = async () => {
    await logout();
  };

  const handleSyncUserData = async () => {
    setIsSyncing(true);
    setSyncMessage('');

    try {
      const result = await syncUserData();
      if (result.success) {
        setSyncMessage('✅ User data synced successfully!');
      } else {
        setSyncMessage(`❌ Sync failed: ${result.error}`);
      }
    } catch (error: any) {
      setSyncMessage(`❌ Sync failed: ${error.message}`);
    } finally {
      setIsSyncing(false);
      // Clear message after 3 seconds
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Authentication Dashboard
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    User Information
                  </h2>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Username:</strong> {user?.username || 'N/A'}</p>
                    <p><strong>Email Verified:</strong> {user?.isEmailVerified ? 'Yes' : 'No'}</p>
                    <p><strong>Last Login:</strong> {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>

                {/* Roles & Permissions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Roles & Permissions
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Roles:</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user?.roles?.map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700">Permissions:</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user?.permissions?.slice(0, 5).map((permission) => (
                          <span
                            key={permission}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {permission}
                          </span>
                        ))}
                        {user?.permissions && user.permissions.length > 5 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{user.permissions.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Data - Removed for now */}

              {/* Sync Status */}
              {syncMessage && (
                <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-800">{syncMessage}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={handleSyncUserData}
                  disabled={isSyncing}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSyncing ? '⏳ Syncing...' : '🔄 Sync User Data'}
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

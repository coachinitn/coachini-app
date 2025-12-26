'use client';

import { useAppDispatch, useAppSelector } from '@/core/redux/hooks';
import { 
  selectSettings, 
  updateSetting, 
  setDeviceInfo, 
  selectDeviceInfo 
} from '@/core/redux/features/appConfig/slice';
import { 
  selectUser, 
  loginSuccess, 
  logout 
} from '@/core/redux/features/user/slice';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ReduxClientPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const deviceInfo = useAppSelector(selectDeviceInfo);
  const userState = useAppSelector(selectUser);
  
  const [username, setUsername] = useState('');

  // Handle login
  const handleLogin = () => {
    if (username.trim()) {
      dispatch(loginSuccess({
        user: {
          id: '1',
          email: `${username.toLowerCase()}@example.com`,
          name: username,
          avatar: undefined,
        },
        token: 'mock-jwt-token',
      }));
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Toggle notification settings
  const toggleNotifications = () => {
    dispatch(updateSetting({
      notificationsEnabled: !settings.notificationsEnabled,
    }));
  };

  // Toggle analytics settings
  const toggleAnalytics = () => {
    dispatch(updateSetting({
      analyticsEnabled: !settings.analyticsEnabled,
    }));
  };

  // Theme is handled by next-themes, not Redux

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* App Settings Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">App Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            <button 
              onClick={toggleNotifications}
              className={`px-3 py-1 rounded ${
                settings.notificationsEnabled 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              {settings.notificationsEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Analytics</span>
            <button 
              onClick={toggleAnalytics}
              className={`px-3 py-1 rounded ${
                settings.analyticsEnabled 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              {settings.analyticsEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          
          <div className="space-y-2">
            <div>Theme</div>
            <p className="text-sm text-muted-foreground">
              Theme is handled by next-themes, not Redux state.
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <h3 className="font-medium mb-2">Device Information</h3>
          <div className="text-sm space-y-1 text-muted-foreground">
            <div>Device: {deviceInfo.isMobile ? 'Mobile' : 'Desktop'}</div>
            <div>Screen Size: {deviceInfo.screenSize.toUpperCase()}</div>
            <div>Online Status: {deviceInfo.isOnline ? 'Online' : 'Offline'}</div>
          </div>
        </div>
      </div>
      
      {/* User Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">User Account</h2>
        
        {userState.isAuthenticated ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {userState.user?.avatar && (
                <Image 
                  src={userState.user.avatar} 
                  alt={userState.user.name || 'User'} 
                  className="rounded-full"
                  width={64}
                  height={64}
                />
              )}
              <div>
                <div className="font-medium text-lg">{userState.user?.name}</div>
                <div className="text-muted-foreground">{userState.user?.email}</div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full mt-4 bg-destructive text-destructive-foreground px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-background"
                placeholder="Enter your username"
              />
            </div>
            
            <button
              onClick={handleLogin}
              disabled={!username.trim()}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded disabled:opacity-50"
            >
              Login
            </button>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t">
          <h3 className="font-medium mb-2">Redux State</h3>
          <div className="text-sm space-y-1 text-muted-foreground">
            <div>Authentication: {userState.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
            <div>Loading: {userState.loading ? 'True' : 'False'}</div>
            {userState.error && <div className="text-destructive">Error: {userState.error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

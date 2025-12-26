'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { 
  selectSettings, 
  selectDeviceInfo, 
  updateSetting,
  setDeviceInfo,
  AppSettings,
  DeviceInfo
} from '../features/appConfig/slice';
import {
  selectUser,
  selectUserData,
  loginSuccess,
  logout,
  updateUser,
  UserData
} from '../features/user/slice';

/**
 * Hook for app settings
 * Provides access to app settings and methods to update them
 * 
 * @example
 * const { settings, updateSettings, updateTheme } = useAppSettings();
 * 
 * // Update theme
 * updateTheme('dark');
 * 
 * // Update multiple settings
 * updateSettings({ notificationsEnabled: true, language: 'en' });
 */
export function useAppSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    dispatch(updateSetting(newSettings));
  }, [dispatch]);
  
  // Theme and language are handled by next-themes and next-intl
  // updateTheme, updateLanguage, and toggleRTL methods removed
  
  const toggleNotifications = useCallback(() => {
    dispatch(updateSetting({ 
      notificationsEnabled: !settings.notificationsEnabled 
    }));
  }, [dispatch, settings.notificationsEnabled]);
  
  const toggleAnalytics = useCallback(() => {
    dispatch(updateSetting({ 
      analyticsEnabled: !settings.analyticsEnabled 
    }));
  }, [dispatch, settings.analyticsEnabled]);
  
  return {
    settings,
    updateSettings,
    toggleNotifications,
    toggleAnalytics
  };
}

/**
 * Hook for device information
 * Provides access to device info and methods to update it
 * 
 * @example
 * const { deviceInfo, updateDeviceInfo } = useDeviceInfo();
 * 
 * // Check if device is mobile
 * if (deviceInfo.isMobile) {
 *   // Do something for mobile devices
 * }
 */
export function useDeviceInfo() {
  const dispatch = useAppDispatch();
  const deviceInfo = useAppSelector(selectDeviceInfo);
  
  const updateDeviceInfo = useCallback((info: Partial<DeviceInfo>) => {
    dispatch(setDeviceInfo(info));
  }, [dispatch]);
  
  return {
    deviceInfo,
    updateDeviceInfo,
  };
}

// Redux useAuth hook removed - use NextAuth useAuth from @/core/auth/hooks instead

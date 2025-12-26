import { createSlice, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from '../../store';

// Define app settings types
export interface AppSettings {
  notificationsEnabled: boolean;
  analyticsEnabled: boolean;
  // Removed theme and language - handled by next-themes and next-intl
  // theme: 'light' | 'dark' | 'system';
  // language: string;
  // isRTL: boolean;
}

// Define device info types
export interface DeviceInfo {
  isMobile: boolean;
  isOnline: boolean;
  screenSize: 'sm' | 'md' | 'lg' | 'xl';
}

// Define the app config state
export interface AppConfigState {
  settings: AppSettings;
  deviceInfo: DeviceInfo;
  isInitialized: boolean;
}

// Default settings
const defaultSettings: AppSettings = {
  notificationsEnabled: true,
  analyticsEnabled: true,
  // Theme and language handled by next-themes and next-intl
};

// Default device info
const defaultDeviceInfo: DeviceInfo = {
  isMobile: false,
  isOnline: true,
  screenSize: 'lg',
};

// Initial state
const initialState: AppConfigState = {
  settings: defaultSettings,
  deviceInfo: defaultDeviceInfo,
  isInitialized: false,
};

// Create the slice
export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    // Update settings
    updateSetting: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    // Update device info
    setDeviceInfo: (state, action: PayloadAction<Partial<DeviceInfo>>) => {
      state.deviceInfo = { ...state.deviceInfo, ...action.payload };
    },
    
    // Initialize app
    initialize: (state) => {
      state.isInitialized = true;
    },
    
    // Reset settings
    resetSettings: (state) => {
      state.settings = defaultSettings;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      // Handle HYDRATE action for SSR
      if (action.payload && action.payload.appConfig) {
        return {
          ...state,
          ...action.payload.appConfig,
        };
      }
      return state;
    });
  },
});

// Export actions
export const { 
  updateSetting, 
  setDeviceInfo, 
  initialize, 
  resetSettings 
} = appConfigSlice.actions;

// Export selectors
export const selectSettings = (state: AppState) => state.appConfig.settings;
export const selectDeviceInfo = (state: AppState) => state.appConfig.deviceInfo;
export const selectIsInitialized = (state: AppState) => state.appConfig.isInitialized;

// Export reducer
export default appConfigSlice.reducer;

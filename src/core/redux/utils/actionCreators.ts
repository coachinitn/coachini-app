import { getStore } from '../store';
import { 
  updateSetting, 
  setDeviceInfo, 
  initialize, 
  resetSettings,
  AppSettings,
  DeviceInfo
} from '../features/appConfig/slice';
import {
  setLoading,
  setError,
  loginSuccess,
  updateUser,
  logout,
  setUserRoles,
  switchRole,
  UserData,
  Role
} from '../features/user/slice';

/**
 * App settings actions
 * Provides simplified methods to update app settings
 */
export const appActions = {
  /**
   * Update app settings
   * @param settings Partial settings to update
   */
  updateSettings: (settings: Partial<AppSettings>) => {
    getStore().dispatch(updateSetting(settings));
  },

  /**
   * Update a single setting
   * @param key Setting key
   * @param value Setting value
   */
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    getStore().dispatch(updateSetting({ [key]: value } as Partial<AppSettings>));
  },

  // RTL mode is handled by next-intl, not Redux
  // setRTL and toggleRTL methods removed

  /**
   * Update device information
   * @param info Partial device info to update
   */
  updateDeviceInfo: (info: Partial<DeviceInfo>) => {
    getStore().dispatch(setDeviceInfo(info));
  },

  /**
   * Initialize the app
   */
  initialize: () => {
    getStore().dispatch(initialize());
  },

  /**
   * Reset settings to defaults
   */
  resetSettings: () => {
    getStore().dispatch(resetSettings());
  },
};

/**
 * User actions
 * Provides simplified methods to update user state
 */
export const userActions = {
  /**
   * Set loading state
   * @param isLoading Loading state
   */
  setLoading: (isLoading: boolean) => {
    getStore().dispatch(setLoading(isLoading));
  },

  /**
   * Set error message
   * @param error Error message or null
   */
  setError: (error: string | null) => {
    getStore().dispatch(setError(error));
  },

  /**
   * Login user
   * @param userData User data
   * @param token Authentication token
   */
  login: (userData: UserData, token: string) => {
    getStore().dispatch(loginSuccess({ user: userData, token }));
  },

  /**
   * Update user data
   * @param userData Partial user data to update
   */
  updateUserData: (userData: Partial<UserData>) => {
    getStore().dispatch(updateUser(userData));
  },

  /**
   * Logout user
   */
  logout: () => {
    getStore().dispatch(logout());
  },

  /**
   * Update user roles
   * @param roles Array of user roles
   */
  updateRoles: (roles: Role[]) => {
    getStore().dispatch(setUserRoles(roles));
  },
  
  /**
   * Switch current active role
   * @param role Role to switch to
   */
  switchRole: (role: Role) => {
    getStore().dispatch(switchRole(role));
  },

  /**
   * Add a role to user's roles if not already present
   * @param role Role to add
   */
  addRole: (role: Role) => {
    const userState = getStore().getState().user;

    // Check if user exists
    if (!userState.user) {
      console.warn('Cannot add role: No user is currently logged in');
      return;
    }

    const currentRoles = userState.user.roles || [];

    // Only add if role doesn't already exist
    if (!currentRoles.includes(role)) {
      const newRoles = [...currentRoles, role];
      getStore().dispatch(setUserRoles(newRoles));
    }
  },

  /**
   * Remove a role from user's roles
   * @param role Role to remove
   */
  removeRole: (role: Role) => {
    const userState = getStore().getState().user;

    // Check if user exists
    if (!userState.user) {
      console.warn('Cannot remove role: No user is currently logged in');
      return;
    }

    const currentRoles = userState.user.roles || [];
    const newRoles = currentRoles.filter(r => r !== role);
    getStore().dispatch(setUserRoles(newRoles));
  },

  /**
   * Add multiple roles to user's roles, avoiding duplicates
   * @param roles Array of roles to add
   */
  addRoles: (roles: Role[]) => {
    const userState = getStore().getState().user;

    // Check if user exists
    if (!userState.user) {
      console.warn('Cannot add roles: No user is currently logged in');
      return;
    }

    const currentRoles = userState.user.roles || [];
    const uniqueNewRoles = roles.filter(role => !currentRoles.includes(role));

    if (uniqueNewRoles.length > 0) {
      const newRoles = [...currentRoles, ...uniqueNewRoles];
      getStore().dispatch(setUserRoles(newRoles));
    }
  },

  /**
   * Set roles ensuring user exists and handling empty arrays properly
   * @param roles Array of roles to set
   */
  setRoles: (roles: Role[]) => {
    const userState = getStore().getState().user;

    // Check if user exists
    if (!userState.user) {
      console.warn('Cannot set roles: No user is currently logged in');
      return;
    }

    // Ensure roles is a valid array
    const validRoles = Array.isArray(roles) ? roles : [];
    getStore().dispatch(setUserRoles(validRoles));
  },
};

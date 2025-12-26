import { getStore } from '../store';
import { AppState } from '../store';
import { 
  selectSettings, 
  selectDeviceInfo, 
  selectIsInitialized 
} from '../features/appConfig/slice';
import {
  selectUser,
  selectIsAuthenticated,
  selectUserData,
  selectUserLoading,
  selectUserError,
  selectUserRoles,
  selectCurrentRole,
  Role
} from '../features/user/slice';

/**
 * Provides direct access to the current Redux state
 * This is useful for accessing state outside of React components
 *
 * @example
 * // Get the current user
 * const user = getState().user;
 *
 * // Check if user is authenticated
 * const isAuthenticated = getState().user.isAuthenticated;
 */
export const getState = (): AppState => getStore().getState();

/**
 * App settings state accessors
 * Provides direct access to app settings state
 */
export const appState = {
  /**
   * Get all app settings
   */
  getSettings: () => selectSettings(getState()),
  
  /**
   * Get a specific setting by key
   */
  getSetting: <K extends keyof ReturnType<typeof selectSettings>>(key: K) => 
    selectSettings(getState())[key],
  
  /**
   * Get device information
   */
  getDeviceInfo: () => selectDeviceInfo(getState()),
  
  /**
   * Check if app is initialized
   */
  isInitialized: () => selectIsInitialized(getState()),

  // RTL is handled by next-intl, not Redux
  // isRTL method removed
};

/**
 * User state accessors
 * Provides direct access to user state
 */
export const userState = {
  /**
   * Get full user state
   */
  getUser: () => selectUser(getState()),
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => selectIsAuthenticated(getState()),
  
  /**
   * Get user data (null if not authenticated)
   */
  getUserData: () => selectUserData(getState()),
  
  /**
   * Check if user state is loading
   */
  isLoading: () => selectUserLoading(getState()),
  
  /**
   * Get user error message (null if no error)
   */
  getError: () => selectUserError(getState()),
  
  /**
   * Get user roles
   */
  getRoles: () => selectUserRoles(getState()),
  
  /**
   * Get current active role
   */
  getCurrentRole: () => selectCurrentRole(getState()),
  
  /**
   * Check if user has a specific role
   */
  hasRole: (role: Role) => {
    const roles = selectUserRoles(getState());
    return roles.includes(role);
  },
  
  /**
   * Check if user can access content requiring specific roles
   */
  canAccess: (requiredRoles: Role[]) => {
    const currentRole = selectCurrentRole(getState());
    if (!currentRole || requiredRoles.length === 0) return false;
    return requiredRoles.includes(currentRole);
  },
};

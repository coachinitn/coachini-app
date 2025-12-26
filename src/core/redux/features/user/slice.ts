import { createSlice, PayloadAction, AnyAction, createSelector } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from '../../store';

// Define role types
export enum Role {
  USER = 'user',
  COACH = 'coach',
  COACHEE = 'coachee',
  SUPERVISOR = 'supervisor',
  ADMIN = 'admin',
}

// Define permission types with hierarchical structure
export enum Permission {
	// Dashboard permissions
	VIEW_DASHBOARD = 'view:dashboard',
	VIEW_ANALYTICS = 'view:analytics',

	// Profile permissions
	EDIT_PROFILE = 'edit:profile',
	VIEW_PROFILE = 'view:profile',

	// User management permissions
	MANAGE_USERS = 'manage:users',
	CREATE_USERS = 'create:users',
	DELETE_USERS = 'delete:users',
	EDIT_USERS = 'edit:users',
	VIEW_USERS = 'view:users',

	// Content management permissions
	MANAGE_CONTENT = 'manage:content',
	CREATE_CONTENT = 'create:content',
	EDIT_CONTENT = 'edit:content',
	DELETE_CONTENT = 'delete:content',
	VIEW_CONTENT = 'view:content',

	// Request management permissions
	MANAGE_REQUESTS = 'manage:requests',
	APPROVE_REQUESTS = 'approve:requests',
	CREATE_REQUESTS = 'create:requests',
	EDIT_REQUESTS = 'edit:requests',
	DELETE_REQUESTS = 'delete:requests',
	VIEW_REQUESTS = 'view:requests',

	// Account management permissions
	MANAGE_ACCOUNTS = 'manage:accounts',
	CREATE_ACCOUNTS = 'create:accounts',
	DELETE_ACCOUNTS = 'delete:accounts',
	VIEW_ACCOUNTS = 'view:accounts',

	// Team management permissions
	MANAGE_TEAMS = 'manage:teams',
	CREATE_TEAMS = 'create:teams',
	EDIT_TEAMS = 'edit:teams',
	DELETE_TEAMS = 'delete:teams',
	VIEW_TEAMS = 'view:teams',

	// Theme management permissions
	MANAGE_THEMES = 'manage:themes',
	CREATE_THEMES = 'create:themes',
	EDIT_THEMES = 'edit:themes',
	DELETE_THEMES = 'delete:themes',
	VIEW_THEMES = 'view:themes',
	PURCHASE_THEMES = 'purchase:themes',

	// Report permissions
	VIEW_REPORTS = 'view:reports',
	EXPORT_REPORTS = 'export:reports',

	// System permissions
	MANAGE_SYSTEM = 'manage:system',
	VIEW_LOGS = 'view:logs',
}

// Role to permissions mapping with comprehensive permissions
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
  ],
  [Role.COACHEE]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_THEMES,
    Permission.PURCHASE_THEMES,
    Permission.VIEW_TEAMS,
    Permission.CREATE_REQUESTS,
  ],
  [Role.COACH]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_THEMES,
    Permission.MANAGE_THEMES,
    Permission.VIEW_TEAMS,
    Permission.MANAGE_TEAMS,
    Permission.VIEW_REQUESTS,
    Permission.EDIT_REQUESTS,
    Permission.VIEW_REPORTS,
  ],
  [Role.SUPERVISOR]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_THEMES,
    Permission.MANAGE_THEMES,
    Permission.VIEW_TEAMS,
    Permission.MANAGE_TEAMS,
    Permission.VIEW_REQUESTS,
    Permission.MANAGE_REQUESTS,
    Permission.APPROVE_REQUESTS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_USERS,
  ],
  [Role.ADMIN]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.MANAGE_USERS,
    Permission.MANAGE_CONTENT,
    Permission.MANAGE_THEMES,
    Permission.MANAGE_TEAMS,
    Permission.MANAGE_REQUESTS,
    Permission.MANAGE_ACCOUNTS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.MANAGE_SYSTEM,
    Permission.VIEW_LOGS,
  ],
};

// Define user data types
export interface UserData {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  roles?: Role[];
  // Add more user fields as needed
}

// Define the auth state structure
export interface UserState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  currentRole: Role | null;
}

// Initial state
const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  currentRole: null,
};

// Create the slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Login success
    loginSuccess: (
      state,
      action: PayloadAction<{ user: UserData; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      
      // Initialize roles array if not present
      if (!state.user.roles) {
        state.user.roles = [];
      }
      
      // Set default role if user has roles
      if (state.user.roles.length > 0) {
        state.currentRole = state.user.roles[0];
      } else {
        state.currentRole = null;
      }
    },

    // Update user data
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Set user roles
    setUserRoles: (state, action: PayloadAction<Role[]>) => {
      // Handle case where user is null (no existing user)
      if (!state.user) {
        // Cannot set roles for non-existent user
        return;
      }

      // Ensure we have a valid roles array
      const newRoles = Array.isArray(action.payload) ? action.payload : [];
      
      // Update user roles with proper immutable update
      state.user.roles = newRoles;
      
      // Handle current role logic
      if (newRoles.length === 0) {
        // If no roles provided, clear current role
        state.currentRole = null;
      } else if (!state.currentRole || !newRoles.includes(state.currentRole)) {
        // If current role is not in new roles list or is null, set to first role
        state.currentRole = newRoles[0];
      }
      // If current role is already in the new roles list, keep it unchanged
    },

    // Switch current active role
    switchRole: (state, action: PayloadAction<Role>) => {
      // Only switch if user has this role
      if (state.user?.roles?.includes(action.payload)) {
        state.currentRole = action.payload;
      }
    },

    // Logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      // Handle HYDRATE action for SSR
      if (action.payload && action.payload.user) {
        return {
          ...state,
          ...action.payload.user,
        };
      }
      return state;
    });
  },
});

// Export actions
export const {
  setLoading,
  setError,
  loginSuccess,
  updateUser,
  setUserRoles,
  switchRole,
  logout
} = userSlice.actions;

// Basic selectors
export const selectUser = (state: AppState) => state.user;
export const selectIsAuthenticated = (state: AppState) => state.user.isAuthenticated;
export const selectUserData = (state: AppState) => state.user.user;
export const selectUserLoading = (state: AppState) => state.user.loading;
export const selectUserError = (state: AppState) => state.user.error;
export const selectCurrentRole = (state: AppState) => state.user.currentRole;

// Memoized selectors to prevent unnecessary re-renders
export const selectUserRoles = createSelector(
  [selectUserData],
  (userData) => userData?.roles || []
);

// Permission-related selectors with memoization
export const selectUserPermissions = createSelector(
  [selectCurrentRole],
  (currentRole) => {
    if (!currentRole) return [];
    return rolePermissions[currentRole] || [];
  }
);

export const selectHasPermission = (permission: Permission) =>
  createSelector(
    [selectUserPermissions],
    (permissions) => permissions.includes(permission)
  );

// Export reducer
export default userSlice.reducer;

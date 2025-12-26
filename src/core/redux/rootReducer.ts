import { combineReducers } from '@reduxjs/toolkit';
import appConfigReducer from './features/appConfig/slice';
import userReducer from './features/user/slice';

// Combine all reducers into a single root reducer
export const rootReducer = combineReducers({
  appConfig: appConfigReducer,
  user: userReducer,
  // Add more reducers here as needed
});

// Export the RootState type
export type RootState = ReturnType<typeof rootReducer>;

import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';
import { persistedReducer } from './persistConfig';

// Create the store with middleware and support for Redux DevTools
export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore redux-persist actions in middleware serializable check
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
};

// Create store instance - will be created per request on server, singleton on client
let store: ReturnType<typeof makeStore> | undefined;

export const getStore = () => {
  // Always create a new store on server
  if (typeof window === 'undefined') {
    return makeStore();
  }

  // Create store only once on client
  if (!store) {
    store = makeStore();
  }

  return store;
};

// Types
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Create a wrapper with the store
export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: process.env.NODE_ENV !== 'production',
});

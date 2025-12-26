import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default: localStorage
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { rootReducer } from './rootReducer';

// Create a noop storage for SSR that maintains consistent behavior
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Create storage that's safe for SSR
const createPersistStorage = () => {
  if (typeof window === 'undefined') {
    return createNoopStorage();
  }

  try {
    return createWebStorage('local');
  } catch (error) {
    console.warn('localStorage not available, using noop storage:', error);
    return createNoopStorage();
  }
};

const persistStorage = createPersistStorage();

// Redux Persist configuration
const persistConfig = {
  key: 'root', // Key for the persisted data in storage
  storage: persistStorage, // Use SSR-safe storage
  whitelist: ['user', 'appConfig'], // Only persist these reducers
  // blacklist: [], // Don't persist these reducers
};

// Create a persisted reducer
export const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Example usage of storage system with encryption
 * This file is for demonstration purposes only
 */
import { 
  createStorage, 
  createSecureStorage, 
  createBalancedStorage,
  COOKIE_KEYS,
  LOCAL_STORAGE_KEYS,
  SECURE_COOKIE_OPTIONS
} from './index';

// Define types for our stored data for type safety
interface UserSettings {
  email?: string;
  name?: string;
  preferences?: {
    notifications?: boolean;
    [key: string]: any;
  };
  fontSize?: string;
  colorScheme?: string;
  [key: string]: any;
}

/**
 * Example: Using storage with no encryption
 */
async function standardStorageExample() {
  // Create standard storage with no encryption
  const storage = createStorage();
  
  // Store data in cookies (not encrypted)
  await storage.cookies.set(COOKIE_KEYS.THEME, 'dark');
  
  // Store data in localStorage (not encrypted)
  await storage.local.set<UserSettings>(LOCAL_STORAGE_KEYS.USER_SETTINGS, { 
    fontSize: 'medium',
    colorScheme: 'system'
  });
  
  // Retrieve data
  const themeResult = await storage.cookies.get<string>(COOKIE_KEYS.THEME);
  const settingsResult = await storage.local.get<UserSettings>(LOCAL_STORAGE_KEYS.USER_SETTINGS);
  
  if (themeResult.success && settingsResult.success) {
    console.log('Theme:', themeResult.value);
    console.log('Settings:', settingsResult.value);
  }
}

/**
 * Example: Using secure storage with full encryption
 */
async function secureStorageExample() {
  // Create secure storage with encryption for everything
  const secureStorage = createSecureStorage();
  
  // All data is automatically encrypted
  await secureStorage.cookies.set(COOKIE_KEYS.AUTH_TOKEN, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', SECURE_COOKIE_OPTIONS);
  await secureStorage.local.set<UserSettings>(LOCAL_STORAGE_KEYS.USER_SETTINGS, {
    email: 'user@example.com',
    preferences: { notifications: true }
  });
  
  // Data is automatically decrypted when retrieved
  const tokenResult = await secureStorage.cookies.get<string>(COOKIE_KEYS.AUTH_TOKEN);
  const userDataResult = await secureStorage.local.get<UserSettings>(LOCAL_STORAGE_KEYS.USER_SETTINGS);
  
  if (tokenResult.success) {
    // Token was automatically decrypted
    console.log('Auth token available:', !!tokenResult.value);
  }
  
  if (userDataResult.success && userDataResult.value) {
    // User data was automatically decrypted
    console.log('User email:', userDataResult.value.email);
  }
}

/**
 * Example: Using balanced storage with selective encryption
 */
async function balancedStorageExample() {
  // Create balanced storage that only encrypts sensitive data
  const balancedStorage = createBalancedStorage();
  
  // This will be encrypted (contains 'token' in the key)
  await balancedStorage.cookies.set(COOKIE_KEYS.AUTH_TOKEN, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  
  // This will not be encrypted (no sensitive patterns in key)
  await balancedStorage.cookies.set(COOKIE_KEYS.THEME, 'light');
  
  // This will be encrypted (contains 'user' in the key)
  await balancedStorage.local.set<UserSettings>(LOCAL_STORAGE_KEYS.USER_SETTINGS, {
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  // This will not be encrypted (no sensitive patterns)
  await balancedStorage.local.set(LOCAL_STORAGE_KEYS.LAST_VISIT, new Date().toISOString());
  
  // Force encryption for a specific item regardless of key pattern
  await balancedStorage.local.set('app_metrics', { usage: 'high', features: ['dashboard', 'reports'] }, undefined, true);
  
  // Prevent encryption for a specific item even if key matches sensitive pattern
  await balancedStorage.local.set('public_user_count', 42, undefined, false);
}

/**
 * Example: Custom encryption options
 */
async function customEncryptionExample() {
  // Create storage with custom encryption options
  const customStorage = createStorage(undefined, {
    enabled: true,
    pbkdf2Iterations: 5000, // Lower iterations for better performance
    cacheDecryptedValues: true,
    // Custom function to determine what to encrypt
    shouldEncryptKey: (key: string) => {
      // Only encrypt auth tokens and nothing else
      return key === COOKIE_KEYS.AUTH_TOKEN || key === COOKIE_KEYS.REFRESH_TOKEN;
    },
    // Custom encryption key
    encryptionKey: 'my-custom-app-encryption-key'
  });
  
  // Use custom storage
  await customStorage.cookies.set(COOKIE_KEYS.AUTH_TOKEN, 'secret-token'); // Will be encrypted
  await customStorage.cookies.set(COOKIE_KEYS.THEME, 'dark'); // Won't be encrypted
}

/**
 * Example: Usage in a Next.js API route
 */
async function serverSideExample(req: any, res: any) {
  // Create storage with the request context for server-side cookies
  const storage = createBalancedStorage({ req, res });
  
  // Set a cookie that will be included in the response
  await storage.cookies.set(COOKIE_KEYS.AUTH_TOKEN, 'new-auth-token', SECURE_COOKIE_OPTIONS);
  
  // Read an encrypted cookie from the request
  const userIdResult = await storage.cookies.get<string>(COOKIE_KEYS.USER_ID);
  
  if (userIdResult.success && userIdResult.value) {
    // Use the decrypted user ID
    return { userId: userIdResult.value };
  }
  
  return { error: 'Not authenticated' };
}

// These examples would be used in real components/pages
export {
  standardStorageExample,
  secureStorageExample,
  balancedStorageExample,
  customEncryptionExample,
  serverSideExample
}; 
/**
 * Storage utilities for SyncBase Client
 */

/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if sessionStorage is available
 */
export function isSessionStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    
    const test = '__sessionStorage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safe localStorage wrapper
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isLocalStorageAvailable()) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (!isLocalStorageAvailable()) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (!isLocalStorageAvailable()) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear: (): boolean => {
    if (!isLocalStorageAvailable()) return false;
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Safe sessionStorage wrapper
 */
export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (!isSessionStorageAvailable()) return null;
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (!isSessionStorageAvailable()) return false;
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (!isSessionStorageAvailable()) return false;
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear: (): boolean => {
    if (!isSessionStorageAvailable()) return false;
    try {
      sessionStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * JSON localStorage wrapper
 */
export const jsonLocalStorage = {
  getItem: <T>(key: string): T | null => {
    const value = safeLocalStorage.getItem(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  setItem: <T>(key: string, value: T): boolean => {
    try {
      const serialized = JSON.stringify(value);
      return safeLocalStorage.setItem(key, serialized);
    } catch {
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    return safeLocalStorage.removeItem(key);
  },

  clear: (): boolean => {
    return safeLocalStorage.clear();
  }
};

/**
 * JSON sessionStorage wrapper
 */
export const jsonSessionStorage = {
  getItem: <T>(key: string): T | null => {
    const value = safeSessionStorage.getItem(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  setItem: <T>(key: string, value: T): boolean => {
    try {
      const serialized = JSON.stringify(value);
      return safeSessionStorage.setItem(key, serialized);
    } catch {
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    return safeSessionStorage.removeItem(key);
  },

  clear: (): boolean => {
    return safeSessionStorage.clear();
  }
};

/**
 * Get storage size in bytes
 */
export function getStorageSize(storage: Storage): number {
  let total = 0;
  
  try {
    for (const key in storage) {
      if (storage.hasOwnProperty(key)) {
        const value = storage.getItem(key);
        if (value) {
          total += key.length + value.length;
        }
      }
    }
  } catch {
    return 0;
  }
  
  return total;
}

/**
 * Get localStorage size
 */
export function getLocalStorageSize(): number {
  if (!isLocalStorageAvailable()) return 0;
  return getStorageSize(localStorage);
}

/**
 * Get sessionStorage size
 */
export function getSessionStorageSize(): number {
  if (!isSessionStorageAvailable()) return 0;
  return getStorageSize(sessionStorage);
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get storage quota information
 */
export async function getStorageQuota(): Promise<{
  usage: number;
  quota: number;
  available: number;
  usagePercentage: number;
} | null> {
  if (typeof navigator === 'undefined' || !('storage' in navigator) || !('estimate' in navigator.storage)) {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const available = quota - usage;
    const usagePercentage = quota > 0 ? (usage / quota) * 100 : 0;

    return {
      usage,
      quota,
      available,
      usagePercentage
    };
  } catch {
    return null;
  }
}

/**
 * Clear all SyncBase related storage
 */
export async function clearSyncBaseStorage(): Promise<{
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
}> {
  const results = {
    localStorage: false,
    sessionStorage: false,
    indexedDB: false
  };

  // Clear localStorage items with syncbase prefix
  if (isLocalStorageAvailable()) {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('syncbase-')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      results.localStorage = true;
    } catch {
      results.localStorage = false;
    }
  }

  // Clear sessionStorage items with syncbase prefix
  if (isSessionStorageAvailable()) {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('syncbase-')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      results.sessionStorage = true;
    } catch {
      results.sessionStorage = false;
    }
  }

  // Clear IndexedDB databases with syncbase prefix
  if (isIndexedDBAvailable()) {
    try {
      // Note: This is a simplified approach. In a real implementation,
      // you might want to enumerate databases and delete specific ones
      const dbNames = ['syncbase-cache', 'syncbase-offline'];
      
      for (const dbName of dbNames) {
        try {
          await new Promise<void>((resolve, reject) => {
            const deleteRequest = indexedDB.deleteDatabase(dbName);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
            deleteRequest.onblocked = () => {
              console.warn(`Database ${dbName} deletion blocked`);
              resolve(); // Consider it successful even if blocked
            };
          });
        } catch {
          // Ignore individual database deletion errors
        }
      }
      
      results.indexedDB = true;
    } catch {
      results.indexedDB = false;
    }
  }

  return results;
}

/**
 * Check storage health and availability
 */
export async function checkStorageHealth(): Promise<{
  localStorage: {
    available: boolean;
    size: number;
    sizeFormatted: string;
  };
  sessionStorage: {
    available: boolean;
    size: number;
    sizeFormatted: string;
  };
  indexedDB: {
    available: boolean;
  };
  quota: {
    usage: number;
    quota: number;
    available: number;
    usagePercentage: number;
    usageFormatted: string;
    quotaFormatted: string;
    availableFormatted: string;
  } | null;
}> {
  const localStorageSize = getLocalStorageSize();
  const sessionStorageSize = getSessionStorageSize();
  const quota = await getStorageQuota();

  return {
    localStorage: {
      available: isLocalStorageAvailable(),
      size: localStorageSize,
      sizeFormatted: formatBytes(localStorageSize)
    },
    sessionStorage: {
      available: isSessionStorageAvailable(),
      size: sessionStorageSize,
      sizeFormatted: formatBytes(sessionStorageSize)
    },
    indexedDB: {
      available: isIndexedDBAvailable()
    },
    quota: quota ? {
      ...quota,
      usageFormatted: formatBytes(quota.usage),
      quotaFormatted: formatBytes(quota.quota),
      availableFormatted: formatBytes(quota.available)
    } : null
  };
}

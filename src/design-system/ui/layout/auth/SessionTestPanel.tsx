'use client';

import { useState } from 'react';
import { useSessionValidation } from './SessionMonitor';
import { useAuth } from '@/core/auth/hooks';
import { SECURITY_CONFIG } from '@/core/auth/config/security';

/**
 * Development utility component for testing session revocation detection
 * Add this component to any page to test session validation manually
 * 
 * Usage:
 * ```tsx
 * import { SessionTestPanel } from '@/design-system/ui/layout/auth/SessionTestPanel';
 * 
 * export default function TestPage() {
 *   return (
 *     <div>
 *       <h1>Your Page Content</h1>
 *       {process.env.NODE_ENV === 'development' && <SessionTestPanel />}
 *     </div>
 *   );
 * }
 * ```
 */
export function SessionTestPanel() {
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState<string>('');
  const { validateSession } = useSessionValidation();
  const { user, isAuthenticated } = useAuth();

  const handleValidateSession = async (bypassCache: boolean = false) => {
    setIsValidating(true);
    try {
      const isValid = await validateSession(bypassCache);
      const timestamp = new Date().toLocaleTimeString();
      setLastValidation(`${timestamp}: ${isValid ? 'Valid' : 'Invalid'} (cache bypass: ${bypassCache})`);
    } catch (error) {
      const timestamp = new Date().toLocaleTimeString();
      setLastValidation(`${timestamp}: Error - ${error}`);
    } finally {
      setIsValidating(false);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Session Test Panel</h3>
      
      <div className="text-xs text-gray-600 mb-3">
        <div>Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
        <div>User: {user?.email || 'None'}</div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="font-medium">Security Config:</div>
          <div>Page Refresh: {SECURITY_CONFIG.validateOnPageRefresh ? 'Enabled' : 'Disabled'}</div>
          <div>Page Focus: {SECURITY_CONFIG.validateOnPageFocus ? 'Enabled' : 'Disabled'}</div>
          <div>Monitor Interval: {SECURITY_CONFIG.monitorInterval / 1000}s</div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => handleValidateSession(false)}
          disabled={isValidating}
          className="w-full px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isValidating ? 'Validating...' : 'Validate Session (with cache)'}
        </button>
        
        <button
          onClick={() => handleValidateSession(true)}
          disabled={isValidating}
          className="w-full px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isValidating ? 'Validating...' : 'Validate Session (bypass cache)'}
        </button>
      </div>

      {lastValidation && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
          <div className="font-medium text-gray-700">Last Validation:</div>
          <div className="text-gray-600">{lastValidation}</div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <div className="font-medium">Test Instructions:</div>
        <ol className="list-decimal list-inside space-y-1 mt-1">
          <li>Click "Validate Session (bypass cache)" - should show "Valid"</li>
          <li>Go to backend and revoke your session</li>
          <li><strong>Test 1:</strong> Refresh the page - should logout immediately (if enabled)</li>
          <li><strong>Test 2:</strong> Switch tabs, then come back - should logout immediately (if enabled)</li>
          <li><strong>Test 3:</strong> Click "Validate Session (bypass cache)" - should logout immediately</li>
        </ol>
        <div className="mt-2 p-2 bg-blue-50 rounded text-blue-700">
          <strong>Enhanced Logout:</strong> The logout now calls backend first for proper session revocation.
        </div>
      </div>
    </div>
  );
}

export default SessionTestPanel;

'use client';

import { useEffect, ReactNode } from 'react';
import { useAppDispatch } from '../hooks';
import { updateSetting } from '../features/appConfig/slice';

/**
 * Type for server-side state that can be passed to client components
 */
export interface ServerState {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  isRTL?: boolean;
  userRoles?: any;
  currentRole?: any;
  [key: string]: any;
}

/**
 * Hook to initialize Redux state from server data
 * Use this in client components that receive server data
 *
 * @param serverState Server state object
 *
 * @example
 * // In a client component
 * export function MyClientComponent({ serverState }: { serverState: ServerState }) {
 *   useServerState(serverState);
 *   // Rest of component...
 * }
 */
export function useServerState(serverState: ServerState) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Update app settings from server state
    if (serverState.theme || serverState.language || serverState.isRTL !== undefined) {
      // Theme and language are handled by next-themes and next-intl
      // No Redux settings to update from server state
    }
  }, [serverState, dispatch]);
}

/**
 * Component to initialize Redux state from server data
 *
 * @example
 * // In a server component
 * export default async function ServerComponent() {
 *   const theme = cookies().get('theme')?.value || 'system';
 *   const language = headers().get('accept-language')?.split(',')[0] || 'en';
 *
 *   return (
 *     <ServerStateProvider serverState={{ theme, language }}>
 *       <ClientComponent />
 *     </ServerStateProvider>
 *   );
 * }
 */
export function ServerStateProvider({
  children,
  serverState
}: {
  children: ReactNode;
  serverState: ServerState;
}) {
  useServerState(serverState);

  return <>{children}</>;
}

// Server-side utilities have been moved to serverUtils.server.ts

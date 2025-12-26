import { cookies } from 'next/headers';
import { siteConfig } from '@/core/config/siteConfig';

/**
 * Type for server-side state that can be passed to client components
 */
import { Role } from '../features/user/slice'; // Assuming Role enum is here

export interface ServerState {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  isRTL?: boolean;
  userRoles?: Role[]; // More specific type
  currentRole?: Role | null; // More specific type
  [key: string]: any;
}

/**
 * Helper to get server-side state
 * Use this in server components to prepare state for client components
 * 
 * @example
 * // In a server component
 * export default async function ServerComponent() {
 *   const serverState = await getServerState();
 *   
 *   return (
 *     <ClientComponent serverState={serverState} />
 *   );
 * }
 */
export async function getServerState(): Promise<ServerState> {
  // This function must be called from a server component
  if (typeof window !== 'undefined') {
    console.warn('getServerState should only be called from server components');
    return {};
  }
  
  try {
    // Get theme from cookies
    const cookiesStore = await cookies();
    const theme = (cookiesStore.get('theme')?.value as 'light' | 'dark' | 'system') || 'system';
    
    // Get language from cookies or headers
    const lang = cookiesStore.get('NEXT_LOCALE')?.value || 'fr';
    
    // Determine if the language is RTL
    const isRTL = siteConfig.rtlLanguages.includes(lang);

    // Attempt to get user roles and current role from cookies
    // IMPORTANT: This is a placeholder. The actual cookie names and parsing
    // logic will depend on your authentication system.
    // Ensure these cookies are set securely (e.g., HttpOnly if possible, though roles might be needed client-side too).
    let userRoles: Role[] | undefined = undefined;
    let currentRole: Role | null = null;

    const userRolesCookie = cookiesStore.get('user-roles')?.value;
    if (userRolesCookie) {
      try {
        // Assuming user-roles cookie stores a JSON array of role strings
        const parsedRoles = JSON.parse(userRolesCookie) as string[];
        // Validate and map to Role enum if necessary
        userRoles = parsedRoles.filter(r => Object.values(Role).includes(r as Role)) as Role[];
      } catch (e) {
        console.error('Error parsing user-roles cookie:', e);
      }
    }

    const currentRoleCookie = cookiesStore.get('current-role')?.value;
    if (currentRoleCookie && Object.values(Role).includes(currentRoleCookie as Role)) {
      currentRole = currentRoleCookie as Role;
    } else if (userRoles && userRoles.length > 0) {
      // Fallback to the first role in the list if current-role is not set or invalid
      // Or use getHighestRole if you prefer that logic server-side
      currentRole = userRoles[0];
    }
    
    return {
      theme,
      language: lang,
      isRTL,
      userRoles,
      currentRole,
      // Add more server-side state as needed
    };
  } catch (error) {
    console.error('Error getting server state:', error);
    return {};
  }
}

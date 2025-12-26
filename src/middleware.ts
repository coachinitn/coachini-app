import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/core/i18n/navigation";
import {
  isPublicRoute as isPublicRouteConfig,
  getRequiredAccess,
  canUserAccessPath
} from "@/core/auth/config/routes";


/**
 * Check if a path is protected (requires authentication)
 * Uses centralized route configuration with enterprise security model
 */
function isProtectedRoute(pathname: string): boolean {
  const { requireAuth } = getRequiredAccess(pathname);
  return requireAuth;
}

/**
 * Check if a path is public (doesn't require authentication)
 * Uses centralized route configuration
 */
function isPublicRoute(pathname: string): boolean {
  return isPublicRouteConfig(pathname);
}

/**
 * Check if user has required role for the route
 * Uses centralized route configuration
 */
function hasRequiredRole(userRoles: string[], pathname: string): boolean {
  return canUserAccessPath(pathname, userRoles);
}

/**
 * Create redirect URL with callback parameter
 */
function createLoginRedirect(request: NextRequest): NextResponse {
  const loginUrl = new URL('/auth/login', request.url);

  // Add the current URL as a callback parameter
  const callbackUrl = request.nextUrl.pathname + request.nextUrl.search;
  loginUrl.searchParams.set('callbackUrl', callbackUrl);

  return NextResponse.redirect(loginUrl);
}

/**
 * Enhanced middleware with authentication and i18n support
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle API route security first
  if (pathname.startsWith('/api/')) {
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const accept = request.headers.get('accept') || '';

    // Detect direct browser navigation (user typing URL in address bar)
    const isDirectBrowserAccess =
      accept.includes('text/html') && // Browser requesting HTML
      !referer.includes(request.nextUrl.origin) && // Not from our app
      !userAgent.includes('Next.js'); // Not internal Next.js request

    if (isDirectBrowserAccess) {
      // Explicitly block sensitive endpoints first
      const blockedEndpoints = [
        '/api/',
        '/api/auth/session',    // Contains user session data
        '/api/proxy',           // Internal proxy routes
        '/api/auth/csrf',       // CSRF tokens should be fetched by app, not users
      ];

      // Check if endpoint is explicitly blocked
      const isBlocked = blockedEndpoints.some(endpoint =>
        pathname.startsWith(endpoint)
      );

      if (isBlocked) {
        return new NextResponse(
          `Access Denied\n\n`,
          {
            status: 403,
            headers: {
              'Content-Type': 'text/plain',
              'X-Robots-Tag': 'noindex, nofollow',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            }
          }
        );
      }

      // Allow specific NextAuth endpoints that users might legitimately access
      const allowedForBrowser = [
        '',
        // '/api/auth/signin',
        // '/api/auth/signout',
        // '/api/auth/error',
        // '/api/auth/providers',
        // '/api/auth/callback', // OAuth callbacks
      ];

      const isAllowed = allowedForBrowser.some(endpoint =>
        pathname.startsWith(endpoint)
      );

      if (!isAllowed) {
        return new NextResponse(
          `API Endpoint Access Blocked`,
          {
            status: 403,
            headers: {
              'Content-Type': 'text/plain',
              'X-Robots-Tag': 'noindex, nofollow',
            }
          }
        );
      }
    }

    // Allow the API request to proceed
    return NextResponse.next();
  }

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Handle i18n first
  const intlResponse = createMiddleware(routing)(request);

  // If i18n middleware wants to redirect, let it handle that first
  if (intlResponse && (intlResponse.status === 307 || intlResponse.status === 302)) {
    return intlResponse;
  }

  // Skip auth for public routes
  if (isPublicRoute(pathname)) {
    return intlResponse || NextResponse.next();
  }

  // Check if route requires authentication
  if (isProtectedRoute(pathname)) {
    try {
      // Get the token from the request
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });

      // If no token, redirect to login with callback
      if (!token) {
        return createLoginRedirect(request);
      }

      // Check for token errors (revoked, refresh failed, etc.)
      if (token.error === "RefreshAccessTokenError" || token.error === "TokenRevokedError") {
        return createLoginRedirect(request);
      }

      // Check if token is expired (but only if no error is present)
      if (!token.error && token.accessTokenExpires && Date.now() >= token.accessTokenExpires) {
        return createLoginRedirect(request);
      }

      // If token has empty/null values (indicating revocation), redirect
      if (!token.accessToken || !token.refreshToken ||
          token.accessToken === "" || token.refreshToken === "") {
        return createLoginRedirect(request);
      }

      // Check role-based access
      const userRoles = (token.roles as string[]) || [];
      if (!hasRequiredRole(userRoles, pathname)) {
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }

      // Add user context to headers for server components
      const response = intlResponse || NextResponse.next();
      if (response instanceof NextResponse) {
        response.headers.set('x-user-id', token.id as string);
        response.headers.set('x-user-roles', JSON.stringify(userRoles));
        response.headers.set('x-user-email', token.email as string);
      }

      return response;

    } catch (error) {
      console.error('Middleware auth error:', error);
      // On error, redirect to login
      return createLoginRedirect(request);
    }
  }

  // For routes that don't require protection, return the i18n response or continue
  return intlResponse || NextResponse.next();
}

export const config = {
  // Match all pathnames including API routes for security checks
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};

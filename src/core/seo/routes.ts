/**
 * SEO-specific route configuration
 * Combines authentication routes with technical/infrastructure routes for SEO purposes
 */

import { 
  ROUTE_CONFIG, 
  getAllProtectedRoutes, 
  getPublicRoutesForSEO 
} from '@/core/auth/config/routes';

/**
 * Technical routes that should be blocked from search engines
 * These are infrastructure/system routes not related to authentication
 */
export const SEO_BLOCKED_ROUTES = [
  // API endpoints
  '/api/*',
  
  // Next.js internal files
  '/_next/*',
  
  // Static assets (if served through app)
  '/assets/*',
  
  // Error pages
  '/error',
  '/*/404',
  '/*/500',
  '/*/403',
  '/*/401',
  '/*/400',
  
  // CDN and external service routes
  '/cdn-cgi/*',
  
  // Development/debugging routes
  '/_vercel/*',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  
  // Temporary or testing routes
  '/test/*',
  '/debug/*',
];

/**
 * Get all routes that should be blocked in robots.txt
 * Combines authentication-protected routes with technical SEO blocks
 */
export function getAllBlockedRoutes(): string[] {
  const authProtectedRoutes = getAllProtectedRoutes();
  
  // Add dashboard explicitly since it's temporarily public for testing
  const dashboardRoutes = ['/dashboard/*'];
  
  return [
    ...authProtectedRoutes.map(route => route.endsWith('/') ? `${route}*` : `${route}/*`),
    ...dashboardRoutes,
    ...SEO_BLOCKED_ROUTES,
  ];
}

/**
 * Get public routes that should be included in sitemap
 * Uses auth config but filters out routes that shouldn't be in sitemap
 */
export function getPublicRoutesForSitemap(): string[] {
  return getPublicRoutesForSEO();
}

/**
 * Check if a route should be included in sitemap
 */
export function shouldIncludeInSitemap(pathname: string): boolean {
  const publicRoutes = getPublicRoutesForSitemap();
  const blockedRoutes = getAllBlockedRoutes();
  
  // Check if it's in public routes
  const isPublic = publicRoutes.some(route => {
    if (route === '/' && pathname === '/') return true;
    return pathname.startsWith(route + '/') || pathname === route;
  });
  
  // Check if it's blocked
  const isBlocked = blockedRoutes.some(route => {
    const routePattern = route.replace('*', '');
    if (route.endsWith('*')) {
      return pathname.startsWith(routePattern);
    }
    return pathname === route;
  });
  
  return isPublic && !isBlocked;
}

/**
 * Get route priority for sitemap
 * Higher priority for more important pages
 */
export function getRoutePriority(pathname: string): number {
  // Homepage gets highest priority
  if (pathname === '/') return 1.0;

  // Main pages get high priority
  if (['/about', '/contact'].includes(pathname)) return 0.9;

  // Blog listing gets high priority
  if (pathname === '/blog') return 0.9;

  // Legal pages get medium priority
  if (['/privacy', '/terms', '/privacy-policy', '/terms-of-service', '/cookie-policy'].includes(pathname)) return 0.7;

  // Blog posts get medium-high priority
  if (pathname.startsWith('/blog/')) return 0.8;

  // Other pages get standard priority
  return 0.8;
}

/**
 * Get change frequency for sitemap
 */
export function getChangeFrequency(pathname: string): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  // Homepage changes frequently
  if (pathname === '/') return 'daily';

  // Blog listing changes frequently
  if (pathname === '/blog') return 'daily';

  // Changelog listing changes frequently
  if (pathname === '/changelog') return 'weekly';

  // Legal pages change rarely
  if (['/privacy', '/terms', '/privacy-policy', '/terms-of-service', '/cookie-policy'].includes(pathname)) return 'yearly';

  // Blog posts change occasionally
  if (pathname.startsWith('/blog/')) return 'monthly';

  // Changelog entries rarely change after publication
  if (pathname.startsWith('/changelog/')) return 'yearly';

  // About page changes occasionally
  if (pathname === '/about') return 'monthly';

  // Most pages change weekly
  return 'weekly';
}

/**
 * Development helper: Log SEO route configuration
 */
export function logSEORouteConfig() {
  if (process.env.NODE_ENV === 'development') {
    console.group('🔍 SEO Route Configuration');
    console.log('Public routes for sitemap:', getPublicRoutesForSitemap());
    console.log('Blocked routes for robots.txt:', getAllBlockedRoutes());
    console.log('SEO-specific blocked routes:', SEO_BLOCKED_ROUTES);
    console.groupEnd();
  }
}

import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { siteConfig } from '../config/siteConfig';
import { LOCALE_PREFIX } from "./i18n-config";

/**
 * Routing configuration for internationalized routes
 * Used by both the middleware and navigation components
 */
export const routing = defineRouting({
  locales: siteConfig.supportedLocales as any,
  defaultLocale: siteConfig.defaultLocale as any,
  localeDetection: false,
  localePrefix: LOCALE_PREFIX,
});

/**
 * Internationalized navigation utilities
 * These are wrappers around Next.js navigation components that respect the i18n configuration
 */
export const { 
  Link, 
  redirect, 
  usePathname, 
  useRouter, 
  getPathname 
} = createNavigation(routing);

/**
 * Configuration values for internationalization
 */

/** Languages that use right-to-left text direction */
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ps', 'dv'];

/** Supported locales in the application */
export const SUPPORTED_LOCALES = ["fr","en"];

/** Default locale when no locale matches */
export const DEFAULT_LOCALE = "fr";

/** Locale prefix strategy for URLs */
export const LOCALE_PREFIX = "as-needed" as const; // "as-needed" | "always" | "never"

import { Translations } from './generated-types';
import { siteConfig } from '../config/siteConfig';
import BUNDLED_TRANSLATIONS from './generated';

/**
 * Loads translation messages for a specific locale with fallback handling
 * This uses pre-bundled translations which are compatible with Edge Runtime
 * 
 * @param locale The locale code to load translations for
 * @returns Translation data object
 */
export async function loadMessages(locale: string): Promise<Translations> {
  // Try to use pre-bundled translations (works in all environments including Edge)
  if (BUNDLED_TRANSLATIONS && BUNDLED_TRANSLATIONS[locale]) {
    return BUNDLED_TRANSLATIONS[locale];
  }
  
  // If bundled translations aren't available for this locale, try fallback locale
  if (locale !== siteConfig.defaultLocale && BUNDLED_TRANSLATIONS && BUNDLED_TRANSLATIONS[siteConfig.defaultLocale]) {
    console.warn(`No bundled translations for ${locale}, falling back to ${siteConfig.defaultLocale}`);
    return BUNDLED_TRANSLATIONS[siteConfig.defaultLocale];
  }
  
  // Return empty object as last resort if no translations are available
  console.error(`No translations available for ${locale}`);
  return {} as Translations;
}




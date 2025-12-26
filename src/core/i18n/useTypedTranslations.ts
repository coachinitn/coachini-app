import { useTranslations } from 'next-intl';
import type { Translations, TranslationNamespace } from './generated-types';
import type { RichTextChunks } from '@/design-system/ui/base/Text/text-formatting/richTextFormatters';

/**
 * Helper types for typed translations
 */
type TranslationValues<Namespace extends string> = 
  Namespace extends `pages.${infer Page}` ? 
    Page extends keyof Translations['pages'] ? Translations['pages'][Page] : never :
  Namespace extends `components.${infer Component}` ? 
    Component extends keyof Translations['components'] ? Translations['components'][Component] : never :
  Namespace extends `common.${infer Common}` ? 
    Common extends keyof Translations['common'] ? Translations['common'][Common] : never :
  never;

/** Extract direct keys from a type */
type ExtractKeys<T> = T extends object ? keyof T : never;

/** Extract nested keys from a type with dot notation */
type ExtractNestedKeys<T, Prefix extends string = ""> = 
  T extends object 
    ? {
        [K in keyof T]: K extends string 
          ? T[K] extends object
            ? ExtractNestedKeys<T[K], `${Prefix}${K}.`> | `${Prefix}${K}`
            : `${Prefix}${K}`
          : never
      }[keyof T]
    : never;

/**
 * A type-safe wrapper around next-intl's useTranslations hook
 * Provides TypeScript autocompletion based on your translation structure
 * 
 * @param namespace The translation namespace to use (e.g. 'pages.index')
 * @returns A type-safe translation function with autocomplete
 * 
 * @example
 * const t = useTypedTranslations('pages.index');
 * t('title') // provides autocomplete for all keys in pages.index
 */
export function useTypedTranslations<N extends TranslationNamespace>(namespace: N) {
  // Get the base translator from next-intl
  // This will work in both client and server components
  // as long as they're wrapped in NextIntlClientProvider
  const translator = useTranslations(namespace);
  
  // Return with enhanced type information
  return translator as unknown as {
    (key: ExtractKeys<TranslationValues<N>> | ExtractNestedKeys<TranslationValues<N>>): string;
    rich(key: ExtractKeys<TranslationValues<N>> | ExtractNestedKeys<TranslationValues<N>>, options?: Record<string, (chunks: RichTextChunks) => React.ReactNode>): React.ReactNode;
    raw(key: ExtractKeys<TranslationValues<N>> | ExtractNestedKeys<TranslationValues<N>>, options?: Record<string, unknown>): Record<string, unknown>;
  };
} 
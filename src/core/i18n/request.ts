import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./navigation";
import { loadMessages } from "./loadMessages";

/**
 * next-intl request configuration for server components
 * Loads messages from the nested directory structure for the requested locale
 * Falls back to default locale if requested locale is not supported
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});

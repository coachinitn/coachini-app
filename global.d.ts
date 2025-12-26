import { Translations } from "./src/core/i18n/generated-types";

declare global {
  // Use type safe message keys with `next-intl`
  type IntlMessages = Translations;
}

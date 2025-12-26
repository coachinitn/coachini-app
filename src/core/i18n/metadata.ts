import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const APP_NAME = "Coachini";

/**
 * Helper to generate consistent metadata with the site name prefix
 * 
 * @param locale Language code
 * @param namespace Translation namespace (e.g., "pages.dashboard")
 * @param titlePath Path to title in translation (e.g., "metadata.title")
 * @param descriptionPath Path to description in translation (e.g., "metadata.description")
 * @param options Additional metadata options
 * @returns Metadata object with consistent title format
 */
export async function generatePageMetadata({
  locale,
  namespace,
  titlePath = "metadata.title",
  descriptionPath = "metadata.description",
  options = {}
}: {
  locale: string;
  namespace: string;
  titlePath?: string;
  descriptionPath?: string;
  options?: Partial<Metadata>;
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace
  });

  return {
    title: `${APP_NAME} - ${t(titlePath)}`,
    description: t(descriptionPath),
    ...options
  };
} 
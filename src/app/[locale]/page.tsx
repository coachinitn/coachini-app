import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Server-side redirect to login page
  redirect(`/${locale}/auth/login`);
}

// Generate static params for all supported locales
// export function generateStaticParams() {
//   return siteConfig.supportedLocales.map((locale) => ({ locale }));
// }


import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import ReduxClientPage from "./client-page";

export default async function ReduxDemoPage() {
  return (
    <div className="container p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Redux Demo with SSR</h1>
      <p className="mb-6 text-muted-foreground">
        This page demonstrates Redux state management with Next.js App Router and SSR support.
      </p>

      <Suspense fallback={<div className="p-4 border rounded">Loading Redux state...</div>}>
        <ReduxClientPage />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  // Await the params object to get the locale
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common.metadata" });

  return {
    title: `Redux Demo - ${t("title")}`,
  };
}

import React from 'react';
import { getTranslations } from 'next-intl/server';
import RBACReports from '../../../../design-system/features';
import { siteConfig } from '@/core/config/siteConfig';

export default async function ProfilePageRoute({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
	});

	return <RBACReports />;

}

export function generateStaticParams() {
  return siteConfig.supportedLocales.map((locale) => ({ locale }));
}
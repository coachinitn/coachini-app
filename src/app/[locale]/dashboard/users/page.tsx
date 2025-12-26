import React from 'react';
import { getTranslations } from 'next-intl/server';
import RBACUsers from '../../../../design-system/features';
import { siteConfig } from '@/core/config/siteConfig';

// Force dynamic rendering for user profile data
// export const dynamic = 'force-dynamic';

export default async function ProfilePageRoute({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
	});

	return <RBACUsers />;
}

export function generateStaticParams() {
  return siteConfig.supportedLocales.map((locale) => ({ locale }));
}
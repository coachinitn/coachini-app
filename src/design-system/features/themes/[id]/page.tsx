import React from 'react';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata';
import { getTranslations } from 'next-intl/server';
import { H1 } from '@/design-system/ui/base/Text';
import ThemeDetailsPage from '@/design-system/features/supervisor/themes/theme-details/ThemeDetailsPage';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return generatePageMetadata({
		locale,
		namespace: 'pages.dashboard',
		titlePath: 'navigation.profile',
	});
}

export default async function ThemeDetails({
	params,
}: {
	params: Promise<{ locale: string; id: string }>;
}) {
	const { locale, id } = await params;
	const t = await getTranslations({
		locale,
		namespace: 'pages.dashboard',
	});

	return <ThemeDetailsPage params={{ id }} />
}

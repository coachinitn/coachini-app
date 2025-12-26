import React from 'react';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata';
import { getTranslations } from 'next-intl/server';
import RBACTeamsPage from '../../../../design-system/features';

export const dynamic = 'force-dynamic';

export default async function TeamsPageRoute({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
	});

	return <RBACTeamsPage />;
}

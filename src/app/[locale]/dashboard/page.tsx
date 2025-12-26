import React from 'react';
import { getTranslations } from 'next-intl/server';
import DashboardClientContent from '../../../../design-system/features';


export const dynamic = 'force-dynamic';

export default async function DashboardPageRoute({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params; 
	return (
			<DashboardClientContent />
		);
}

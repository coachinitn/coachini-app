import React from 'react';
import RequestsClientWrapper from './RequestsClientWrapper';

// Force dynamic rendering for user-specific request data
export const dynamic = 'force-dynamic';

export default async function RequestsPageRoute({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	await params; 
	return <RequestsClientWrapper />;
}

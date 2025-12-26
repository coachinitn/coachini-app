import React from 'react';
import ThemesClientWrapper from './ThemesClientWrapper';

export default async function ThemesPageRoute({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	// Params are handled client-side via useParams() in the wrapper
	await params; // Ensure params are resolved for Next.js

	// No server-side state needed - use NextAuth session directly in client
	return <ThemesClientWrapper />;
}

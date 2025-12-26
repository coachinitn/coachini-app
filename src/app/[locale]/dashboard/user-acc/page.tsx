import React from 'react';
import RequestsClientWrapper from './RequestsClientWrapper';

export const dynamic = 'force-dynamic';

export default async function UserAccPageRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params; // Ensure params are resolved for Next.js

  return <RequestsClientWrapper />;
}

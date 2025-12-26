import React, { Suspense } from 'react';
import FilterHookExample from '@/design-system/ui/__examples__';
import { ContentLayout } from '@/design-system/ui';

// Loading component for Suspense fallback
function FilterHookLoading() {
  return (
    <div className="p-6 space-y-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        <div className="space-y-6">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function FilterHookDemoPage() {
  return (
    <ContentLayout>
      <Suspense fallback={<FilterHookLoading />}>
        <FilterHookExample />
      </Suspense>
    </ContentLayout>
  );
}
'use client';

import React from 'react';
import Link from 'next/link';
import ContentLayout from '@/design-system/ui/layout/content-layout';
import { Button } from '../../../../../design-system/ui/base/button';

export default function ContentLayoutScrollDemoPage() {
  const [isFullHeight, setIsFullHeight] = React.useState(false);
  const [isScrollLocked, setIsScrollLocked] = React.useState(false);
  const [addLongContent, setAddLongContent] = React.useState(false);
  
  return (
    <>
      <ContentLayout paddingY className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">ContentLayout Scroll Lock Demo</h1>
        <p className="mb-8 text-lg">
          This page demonstrates the ContentLayout component with scroll locking ability.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <Button 
            onClick={() => setIsFullHeight(!isFullHeight)} 
            variant={isFullHeight ? "default" : "outline"}
          >
            {isFullHeight ? "Disable Full Height" : "Enable Full Height"}
          </Button>
          
          <Button 
            onClick={() => setIsScrollLocked(!isScrollLocked)} 
            variant={isScrollLocked ? "default" : "outline"}
            disabled={!isFullHeight}
          >
            {isScrollLocked ? "Disable Scroll Lock" : "Enable Scroll Lock"}
          </Button>
          
          <Button 
            onClick={() => setAddLongContent(!addLongContent)} 
            variant={addLongContent ? "default" : "outline"}
          >
            {addLongContent ? "Remove Long Content" : "Add Long Content"}
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/content-layout-demo">Go to ContentLayout Demo</Link>
          </Button>
        </div>
        
        <div className="p-4 mb-4 rounded-lg bg-muted">
          <h2 className="mb-2 font-semibold">Current Settings:</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>Full Height: <span className="px-2 py-1 font-mono rounded bg-background">{isFullHeight ? 'true' : 'false'}</span></li>
            <li>Scroll Lock: <span className="px-2 py-1 font-mono rounded bg-background">{isScrollLocked ? 'true' : 'false'}</span></li>
            <li>Long Content: <span className="px-2 py-1 font-mono rounded bg-background">{addLongContent ? 'true' : 'false'}</span></li>
          </ul>
        </div>
      </ContentLayout>
      
      <ContentLayout 
        fullHeight={isFullHeight}
        preventScroll={true}
        centered
        paddingX
        paddingY
        withBackground
        bordered
        rounded
        withShadow
        className="overflow-auto"
      >
        <h2 className="mb-4 text-2xl font-bold">Scrollable Content Area</h2>
        <p className="mb-4">
          This content is inside a ContentLayout with <code>fullHeight={'{'}isFullHeight{'}'}</code> and <code>preventScroll={'{'}isScrollLocked{'}'}</code>.
        </p>
        <p className="mb-4">
          When <code>preventScroll</code> is enabled, the body of the page will not scroll, but this container will still be scrollable.
        </p>
        <p className="mb-4">
          This is useful for modal-like experiences where you want to keep the user focused on a specific area without the body scrolling underneath.
        </p>
        
        {addLongContent && (
          <div className="space-y-4">
            <hr className="my-6" />
            <h3 className="text-xl font-semibold">Long Content Added</h3>
            <p>Scroll within this container to see the scroll lock in action.</p>
            
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="p-4 border rounded bg-background">
                <h4 className="mb-2 font-medium">Section {i + 1}</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam 
                  eget felis eget urna ultrices fermentum. Donec sed odio dui. 
                  Donec ullamcorper nulla non metus auctor fringilla.
                </p>
              </div>
            ))}
          </div>
        )}
      </ContentLayout>
    </>
  );
}

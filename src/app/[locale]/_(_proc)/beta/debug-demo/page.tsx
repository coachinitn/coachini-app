'use client';

import React from 'react';
import { cn, typography } from '@/core/utils';

export default function DebugDemoPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className={cn(typography('h1'), 'mb-8')}>Debug Features Demo</h1>
      
      <div className="grid grid-cols-1 gap-8 mb-10 md:grid-cols-2">
        <div className="p-6 border rounded-lg" data-debug-outline="Main Content Box">
          <h2 className={cn(typography('h2'), 'mb-4')}>Font Size Tooltips</h2>
          <p className="mb-4">
            Hover over any text element on this page to see its font properties when the 
            <strong> Font Size Tooltips</strong> option is enabled in the configuration sidebar.
          </p>
          
          <div className="space-y-4">
            <p className={cn(typography('p'), 'mb-2')}>This is a paragraph with standard typography</p>
            <p className={cn(typography('lead'), 'mb-2')}>This is a lead paragraph</p>
            <p className={cn(typography('large'), 'mb-2')}>This is large text</p>
            <p className={cn(typography('small'), 'mb-2')}>This is small text</p>
            <p className={cn(typography('muted'), 'mb-2')}>This is muted text</p>
          </div>
          
          <div className="mt-6 space-y-3">
            <p className="text-xs">Extra Small (xs) Text</p>
            <p className="text-sm">Small (sm) Text</p>
            <p className="text-base">Base Text</p>
            <p className="text-lg">Large (lg) Text</p>
            <p className="text-xl">Extra Large (xl) Text</p>
            <p className="text-2xl">2XL Text</p>
            <p className="text-3xl">3XL Text</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg" data-debug-outline="_">
            <h2 className={cn(typography('h2'), 'mb-4')}>Div Outlines</h2>
            <p className="mb-4">
              Elements with the <code className="px-1 py-0.5 bg-gray-100 rounded">data-debug-outline</code> attribute 
              will be highlighted with a dashed outline when the <strong>Div Outlines</strong> option is enabled.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded bg-blue-50" data-debug-outline="Blue Box">
                <p className="font-medium">Blue Box</p>
                <p className="text-sm">This has an outline attribute</p>
              </div>
              
              <div className="p-4 rounded bg-green-50" data-debug-outline="Green Box">
                <p className="font-medium">Green Box</p>
                <p className="text-sm">This also has an outline</p>
              </div>
              
              <div className="p-4 rounded bg-yellow-50" data-debug-outline="Yellow Box">
                <p className="font-medium">Yellow Box</p>
                <p className="text-sm">Hover to see the name</p>
              </div>
              
              <div className="p-4 rounded bg-purple-50" data-debug-outline="Purple Box">
                <p className="font-medium">Purple Box</p>
                <p className="text-sm">Shows name on hover</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 border rounded-lg" data-debug-outline="Nested Elements Demo">
            <h2 className={cn(typography('h3'), 'mb-4')}>Nested Elements</h2>
            <div className="p-4 rounded bg-gray-50" data-debug-outline="Parent">
              <p className="mb-2">Parent Element</p>
              <div className="p-3 bg-gray-100 rounded" data-debug-outline="Child 1">
                <p className="mb-2">Child Element 1</p>
                <div className="p-2 bg-gray-200 rounded" data-debug-outline="Grandchild">
                  <p>Grandchild Element</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 mt-8 border rounded-lg" data-debug-outline="Instructions Box">
        <h2 className={cn(typography('h2'), 'mb-4')}>How to Use</h2>
        <div className="space-y-4">
          <p>
            1. Open the configuration sidebar by clicking the gear icon on the right edge of the screen.
          </p>
          <p>
            2. Under <strong>Debug Tools</strong>, toggle the options you want to enable:
          </p>
          <ul className="ml-4 space-y-2 list-disc list-inside">
            <li><strong>Font Size Tooltips</strong>: Hover over any text to see font size, weight, and line height</li>
            <li><strong>Div Outlines</strong>: Elements with <code className="px-1 py-0.5 bg-gray-100 rounded">data-debug-outline</code> attribute will be highlighted</li>
          </ul>
          <p>
            3. The settings are saved in localStorage and will persist between page refreshes.
          </p>
        </div>
      </div>
    </div>
  );
} 
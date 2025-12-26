'use client';

import React, { useState } from 'react';
import ScrollableContainer from '@/design-system/ui/layout/scrollable-container';

// Sample data for demonstration
const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    title: `Item ${i + 1}`,
    content: `This is the content for item ${i + 1}. It can be any React node.`
  }));
};

export default function ScrollableContainerDemo() {
  const [items] = useState(generateItems(50));
  const [scrollbarColor, setScrollbarColor] = useState('bg-blue-500');
  const [trackColor, setTrackColor] = useState('bg-slate-200 dark:bg-slate-800');
  const [scrollbarWidth, setScrollbarWidth] = useState('w-2');
  const [alwaysShowScrollbar, setAlwaysShowScrollbar] = useState(true);

  // Predefined color options
  const colorOptions = [
    { label: 'Blue', thumb: 'bg-blue-500', track: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Red', thumb: 'bg-red-500', track: 'bg-red-100 dark:bg-red-900/30' },
    { label: 'Green', thumb: 'bg-green-500', track: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Purple', thumb: 'bg-purple-500', track: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Yellow', thumb: 'bg-yellow-500', track: 'bg-yellow-100 dark:bg-yellow-900/30' },
  ];

  // Width options
  const widthOptions = [
    { label: 'XS', value: 'w-1' },
    { label: 'S', value: 'w-1.5' },
    { label: 'M', value: 'w-2' },
    { label: 'L', value: 'w-3' },
    { label: 'XL', value: 'w-4' },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ScrollableContainer Demo</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Customization Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="font-medium mb-2">Scrollbar Color</h3>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.label}
                  className={`px-3 py-1 rounded border ${scrollbarColor === option.thumb ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                  onClick={() => {
                    setScrollbarColor(option.thumb);
                    setTrackColor(option.track);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${option.thumb}`}></div>
                    <span>{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Scrollbar Width</h3>
            <div className="flex flex-wrap gap-2">
              {widthOptions.map((option) => (
                <button
                  key={option.label}
                  className={`px-3 py-1 rounded border ${scrollbarWidth === option.value ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                  onClick={() => setScrollbarWidth(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Scrollbar Visibility</h3>
            <button
              className={`px-3 py-1 rounded border ${alwaysShowScrollbar ? 'bg-primary text-white' : ''}`}
              onClick={() => setAlwaysShowScrollbar(!alwaysShowScrollbar)}
            >
              {alwaysShowScrollbar ? 'Always Show' : 'Auto Hide'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Basic Usage</h2>
          <p className="text-muted-foreground mb-4">
            A simple ScrollableContainer with customizable scrollbar.
          </p>
          
          <div className="border rounded-lg h-[500px] overflow-hidden">
            <ScrollableContainer
              scrollbarColor={scrollbarColor}
              trackColor={trackColor}
              scrollbarWidth={scrollbarWidth}
              alwaysShowScrollbar={alwaysShowScrollbar}
              header={
                <div className="p-4 border-b bg-muted/50">
                  <h3 className="font-medium">List Header</h3>
                </div>
              }
              footer={
                <div className="p-4 border-t bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground">Showing {items.length} items</p>
                </div>
              }
            >
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.content}</p>
                  </div>
                ))}
              </div>
            </ScrollableContainer>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Card Example</h2>
          <p className="text-muted-foreground mb-4">
            ScrollableContainer used in a card layout.
          </p>
          
          <div className="border rounded-lg shadow-sm h-[500px] overflow-hidden bg-card">
            <ScrollableContainer
              scrollbarColor={scrollbarColor}
              trackColor={trackColor}
              scrollbarWidth={scrollbarWidth}
              alwaysShowScrollbar={alwaysShowScrollbar}
              header={
                <div className="p-6 border-b">
                  <h3 className="text-2xl font-bold">News Feed</h3>
                  <p className="text-muted-foreground">Latest updates and articles</p>
                </div>
              }
            >
              <div className="p-6 space-y-6">
                {items.slice(0, 15).map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 shadow-sm hover:shadow transition-shadow">
                    <h4 className="text-lg font-semibold mb-2">
                      {item.title} - Breaking News
                    </h4>
                    <p className="text-muted-foreground">
                      {item.content} Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">5 minutes ago</span>
                      <button className="text-sm text-primary hover:underline">Read more</button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollableContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 
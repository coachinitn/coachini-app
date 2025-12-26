'use client';

import React, { useState } from 'react';
import { ContentLayout } from '@/design-system/ui/layout/content-layout';
import { cn } from '@/core/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/ui/base/tabs';

export default function ContentLayoutDemoPage() {
  const [padding, setPadding] = useState<'sm' | 'md' | 'lg' | 'xl' | 'none'>('md');
  const [maxWidthSize, setMaxWidthSize] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'>('lg');
  const [fullHeight, setFullHeight] = useState(false);
  const [withBackground, setWithBackground] = useState(false);
  const [bordered, setBordered] = useState(false);
  const [rounded, setRounded] = useState(false);
  const [withShadow, setWithShadow] = useState(false);

  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Content Layout Component</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        A flexible container component for page content with consistent spacing and styling.
      </p>

      <div className="grid gap-4 p-4 mb-8 border rounded-lg bg-muted/20">
        <h2 className="mb-2 text-xl font-medium">Controls</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <label className="block mb-1 text-sm font-medium">Padding Size</label>
            <select 
              value={padding}
              onChange={(e) => setPadding(e.target.value as any)}
              className="w-full p-2 border rounded bg-background"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Max Width</label>
            <select 
              value={maxWidthSize}
              onChange={(e) => setMaxWidthSize(e.target.value as any)}
              className="w-full p-2 border rounded bg-background"
            >
              <option value="sm">Small (640px)</option>
              <option value="md">Medium (768px)</option>
              <option value="lg">Large (1024px)</option>
              <option value="xl">Extra Large (1280px)</option>
              <option value="2xl">2XL (1536px)</option>
              <option value="full">Full Width</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Options</label>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="fullHeight" 
                checked={fullHeight}
                onChange={() => setFullHeight(!fullHeight)}
                className="mr-2"
              />
              <label htmlFor="fullHeight">Full Height (100vh)</label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="withBackground" 
                checked={withBackground}
                onChange={() => setWithBackground(!withBackground)}
                className="mr-2"
              />
              <label htmlFor="withBackground">Background</label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="bordered" 
                checked={bordered}
                onChange={() => setBordered(!bordered)}
                className="mr-2"
              />
              <label htmlFor="bordered">Border</label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="rounded" 
                checked={rounded}
                onChange={() => setRounded(!rounded)}
                className="mr-2"
              />
              <label htmlFor="rounded">Rounded</label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="withShadow" 
                checked={withShadow}
                onChange={() => setWithShadow(!withShadow)}
                className="mr-2"
              />
              <label htmlFor="withShadow">Shadow</label>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-medium">Live Demo</h2>

      <Tabs defaultValue="preview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="relative">
          <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800 grid place-items-center min-h-[400px]">
            <ContentLayout
              paddingSize={padding}
              maxWidthSize={maxWidthSize}
              withBackground={withBackground}
              bordered={bordered}
              rounded={rounded}
              withShadow={withShadow}
              className={cn(
                "min-h-[200px]",
                withBackground ? "text-card-foreground" : "text-primary",
                fullHeight && "h-full"
              )}
            >
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <h3 className="text-xl font-medium">Content Layout</h3>
                <p>This is a content layout with your selected options</p>
                <ul className="mt-4 space-y-1 text-sm list-disc list-inside">
                  <li>Padding Size: {padding}</li>
                  <li>Max Width: {maxWidthSize}</li>
                  <li>Background: {withBackground ? 'Yes' : 'No'}</li>
                  <li>Border: {bordered ? 'Yes' : 'No'}</li>
                  <li>Rounded: {rounded ? 'Yes' : 'No'}</li>
                  <li>Shadow: {withShadow ? 'Yes' : 'No'}</li>
                  <li>Full Height: {fullHeight ? 'Yes' : 'No'}</li>
                </ul>
              </div>
            </ContentLayout>
          </div>
        </TabsContent>
        
        <TabsContent value="code">
          <pre className="p-4 overflow-x-auto text-sm text-gray-100 bg-gray-900 rounded-lg">
{`import { ContentLayout } from '@/design-system/ui/layouts/content-layout';

// Basic usage
<ContentLayout>
  <h1>Your content here</h1>
  <p>This is a standard content layout with default settings</p>
</ContentLayout>

// Custom configuration
<ContentLayout
  paddingSize="${padding}"
  maxWidthSize="${maxWidthSize}"
  withBackground={${withBackground}}
  bordered={${bordered}}
  rounded={${rounded}}
  withShadow={${withShadow}}
  className="your-custom-classes"
>
  <h1>Your content here</h1>
  <p>This is a content layout with custom configuration</p>
</ContentLayout>`}
          </pre>
        </TabsContent>
      </Tabs>

      <h2 className="mb-4 text-xl font-medium">Common Use Cases</h2>
      
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <div className="p-4 border rounded-lg">
          <h3 className="mb-2 text-lg font-medium">Basic Page Content</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Wrap your main page content for consistent padding and max-width constraints.
          </p>
          <pre className="p-3 text-xs text-gray-100 bg-gray-900 rounded-lg">
{`<ContentLayout>
  <h1>Page Title</h1>
  <p>Your page content goes here...</p>
</ContentLayout>`}
          </pre>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="mb-2 text-lg font-medium">Card-style Container</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create a card-style container with background, border, and shadow.
          </p>
          <pre className="p-3 text-xs text-gray-100 bg-gray-900 rounded-lg">
{`<ContentLayout
  paddingSize="md"
  maxWidthSize="md"
  withBackground
  bordered
  rounded
  withShadow
>
  <h2>Card Title</h2>
  <p>Card content...</p>
</ContentLayout>`}
          </pre>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="mb-2 text-lg font-medium">Full-width Section</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create a full-width section for hero areas or feature sections.
          </p>
          <pre className="p-3 text-xs text-gray-100 bg-gray-900 rounded-lg">
{`<ContentLayout
  paddingSize="lg"
  maxWidthSize="full"
  withBackground
>
  <h1>Hero Section</h1>
  <p>Your hero content...</p>
</ContentLayout>`}
          </pre>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="mb-2 text-lg font-medium">Nested Layouts</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create nested layouts for complex page structures.
          </p>
          <pre className="p-3 text-xs text-gray-100 bg-gray-900 rounded-lg">
{`<ContentLayout maxWidthSize="xl">
  <h1>Page Title</h1>
  
  <ContentLayout 
    paddingY
    paddingX={false}
    withBackground
    rounded
  >
    <h2>Section Title</h2>
    <p>Section content...</p>
  </ContentLayout>
</ContentLayout>`}
          </pre>
        </div>
      </div>
      
      <h2 className="mb-4 text-xl font-medium">API Reference</h2>
      
      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left border">Prop</th>
              <th className="p-2 text-left border">Type</th>
              <th className="p-2 text-left border">Default</th>
              <th className="p-2 text-left border">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">children</td>
              <td className="p-2 border">ReactNode</td>
              <td className="p-2 border">-</td>
              <td className="p-2 border">The content to be rendered inside the layout</td>
            </tr>
            <tr>
              <td className="p-2 border">className</td>
              <td className="p-2 border">string</td>
              <td className="p-2 border">undefined</td>
              <td className="p-2 border">Additional CSS classes to apply</td>
            </tr>
            <tr>
              <td className="p-2 border">maxWidth</td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">true</td>
              <td className="p-2 border">Whether to use the maximum width constraint</td>
            </tr>
            <tr>
              <td className="p-2 border">maxWidthSize</td>
              <td className="p-2 border">sm | md | lg | xl | 2xl | full</td>
              <td className="p-2 border">lg</td>
              <td className="p-2 border">The maximum width for the container</td>
            </tr>
            <tr>
              <td className="p-2 border">centered</td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">true</td>
              <td className="p-2 border">Whether to center the content horizontally</td>
            </tr>
            <tr>
              <td className="p-2 border">paddingX</td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">true</td>
              <td className="p-2 border">Apply horizontal padding</td>
            </tr>
            <tr>
              <td className="p-2 border">paddingY</td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">true</td>
              <td className="p-2 border">Apply vertical padding</td>
            </tr>
            <tr>
              <td className="p-2 border">paddingSize</td>
              <td className="p-2 border">sm | md | lg | xl | none</td>
              <td className="p-2 border">md</td>
              <td className="p-2 border">Override the default padding size</td>
            </tr>
            <tr>
              <td className="p-2 border">asChild</td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">false</td>
              <td className="p-2 border">Whether to use Radix's Slot for composition</td>
            </tr>
            <tr>
              <td className="p-2 border">bordered</td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">false</td>
              <td className="p-2 border">Whether to add a border around the content</td>
            </tr>
            <tr>
              <td className="p-2 border">withBackground</td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">false</td>
              <td className="p-2 border">Whether to add a background color</td>
            </tr>
            <tr>
              <td className="p-2 border">rounded</td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">false</td>
              <td className="p-2 border">Whether to add rounded corners</td>
            </tr>
            <tr>
              <td className="p-2 border">withShadow</td>
              <td className="p-2 border">boolean</td>
              <td className="p-2 border">false</td>
              <td className="p-2 border">Whether to add a shadow</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

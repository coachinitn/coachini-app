import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Direct Colors Test',
};

export default function DirectColorsTestPage() {
  return (
    <div className="p-8 space-y-12">
      <h1 className="text-2xl font-bold">Direct Color Variables Test</h1>
      <p className="text-lg">
        This page demonstrates using CSS variables directly from colors.css
      </p>

      <section>
        <h2 className="mb-4 text-xl font-bold">Primary Colors from CSS Variables</h2>
        <div className="grid grid-cols-11 gap-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
            <div key={shade} className="text-center">
              <div
                className="h-20 mb-2 rounded-md"
                style={{ 
                  backgroundColor: `var(--primary-${shade})`,
                  aspectRatio: '1/1'
                }}
              />
              <span className="text-xs">{shade}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Primary Colors from Tailwind</h2>
        <div className="grid grid-cols-11 gap-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
            <div key={shade} className="text-center">
              <div
                className={`bg-primary-${shade} h-20 rounded-md mb-2`}
                style={{ aspectRatio: '1/1' }}
              />
              <span className="text-xs">{shade}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Success Colors from CSS Variables</h2>
        <div className="grid grid-cols-11 gap-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
            <div key={shade} className="text-center">
              <div
                className="h-20 mb-2 rounded-md"
                style={{ 
                  backgroundColor: `var(--success-${shade})`,
                  aspectRatio: '1/1'
                }}
              />
              <span className="text-xs">{shade}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Semantic Colors</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded" style={{ backgroundColor: 'var(--background-default)' }}>
            Background Default
          </div>
          <div className="p-4 rounded" style={{ backgroundColor: 'var(--background-muted)' }}>
            Background Muted
          </div>
          <div className="p-4 rounded" style={{ backgroundColor: 'var(--background-subtle)' }}>
            Background Subtle
          </div>
          <div className="p-4 rounded" style={{ backgroundColor: 'var(--background-emphasis)' }}>
            Background Emphasis
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Direct vs Tailwind Usage Comparison</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="mb-2 font-medium">Direct CSS Variables</h3>
            <div className="space-y-2">
              <div style={{ color: 'var(--primary-500)' }}>Text using var(--primary-500)</div>
              <div style={{ color: 'var(--success-500)' }}>Text using var(--success-500)</div>
              <div style={{ color: 'var(--error-500)' }}>Text using var(--error-500)</div>
              <div className="p-2" style={{ backgroundColor: 'var(--primary-100)' }}>
                Background using var(--primary-100)
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Tailwind Classes</h3>
            <div className="space-y-2">
              <div className="text-primary-500">Text using text-primary-500</div>
              <div className="text-success-500">Text using text-success-500</div>
              <div className="text-error-500">Text using text-error-500</div>
              <div className="p-2 bg-primary-100">
                Background using bg-primary-100
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
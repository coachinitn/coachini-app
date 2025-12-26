import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Color Test',
};

export default function ColorTestPage() {
  return (
    <div className="p-8 space-y-12">
      <h1 className="text-2xl font-bold">Color Palette Test</h1>

      <section>
        <h2 className="text-xl font-bold mb-4">Primary Colors</h2>
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
        <h2 className="text-xl font-bold mb-4">Gray Colors</h2>
        <div className="grid grid-cols-11 gap-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
            <div key={shade} className="text-center">
              <div
                className={`bg-gray-${shade} h-20 rounded-md mb-2`}
                style={{ aspectRatio: '1/1' }}
              />
              <span className="text-xs">{shade}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Success Colors</h2>
        <div className="grid grid-cols-11 gap-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
            <div key={shade} className="text-center">
              <div
                className={`bg-success-${shade} h-20 rounded-md mb-2`}
                style={{ aspectRatio: '1/1' }}
              />
              <span className="text-xs">{shade}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Error Colors</h2>
        <div className="grid grid-cols-11 gap-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
            <div key={shade} className="text-center">
              <div
                className={`bg-error-${shade} h-20 rounded-md mb-2`}
                style={{ aspectRatio: '1/1' }}
              />
              <span className="text-xs">{shade}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Text Colors</h2>
        <div className="grid grid-cols-1 gap-4">
          <p className="text-primary">text-primary</p>
          <p className="text-primary-500">text-primary-500</p>
          <p className="text-success-500">text-success-500</p>
          <p className="text-error-500">text-error-500</p>
          <p className="text-gray-500">text-gray-500</p>
        </div>
      </section>
    </div>
  );
} 
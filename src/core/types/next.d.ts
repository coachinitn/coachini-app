import { Metadata } from 'next';

// Augment the Next.js types to make params a Promise-like object
declare module 'next' {
  export interface PageProps {
    params: Promise<{
      [key: string]: string;
    }>;
    searchParams?: { [key: string]: string | string[] | undefined };
  }
} 
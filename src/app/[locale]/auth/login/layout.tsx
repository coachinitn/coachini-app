import type { Metadata } from 'next';
import { siteConfig } from '@/core/config/siteConfig';

export const metadata: Metadata = {
  title: 'Login | Coachini',
  description: 'Sign in to your Coachini account to access your coaching dashboard and connect with professional coaches.',
  keywords: [
    'login',
    'sign in',
    'coaching platform',
    'professional coaching',
    'coachini',
    'coaching dashboard',
    'coach access',
    'personal development',
    'professional development'
  ],
  openGraph: {
    title: 'Login | Coachini',
    description: 'Sign in to your Coachini account to access your coaching dashboard and connect with professional coaches.',
    url: `${siteConfig.url}/auth/login`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/images/og/login-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Coachini Login - Professional Coaching Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login | Coachini',
    description: 'Sign in to your Coachini account to access your coaching dashboard and connect with professional coaches.',
    images: [`${siteConfig.url}/images/og/login-og.jpg`],
    creator: '@coachini',
    site: '@coachini',
  },
  robots: {
    index: false, 
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `${siteConfig.url}/auth/login`,
    languages: {
      'en-US': `${siteConfig.url}/en/auth/login`,
      'fr-FR': `${siteConfig.url}/fr/auth/login`,
    },
  },
 
};

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return children;
}

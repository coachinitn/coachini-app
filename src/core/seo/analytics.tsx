/**
 * Modern Analytics Component
 * Replaces the legacy gtag.js approach with a clean, TypeScript-ready component
 */

'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Analytics configuration
interface AnalyticsConfig {
  googleAnalyticsId?: string;
  enabled: boolean;
  debug: boolean;
}

// Get analytics configuration from environment
const getAnalyticsConfig = (): AnalyticsConfig => ({
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  enabled: process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  debug: process.env.NODE_ENV === 'development',
});

// Google Analytics types
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date | object,
      config?: object
    ) => void;
    dataLayer: any[];
  }
}

/**
 * Google Analytics Component
 * Handles Google Analytics 4 integration with proper TypeScript support
 */
export function GoogleAnalytics() {
  const config = getAnalyticsConfig();
  const pathname = usePathname();

  // Track page views on route changes
  useEffect(() => {
    if (config.enabled && config.googleAnalyticsId) {
      window.gtag?.('config', config.googleAnalyticsId, {
        page_path: pathname,
      });
      
      if (config.debug) {
        console.log('📊 GA4 Page View:', pathname);
      }
    }
  }, [pathname, config.enabled, config.googleAnalyticsId, config.debug]);

  // Don't render anything if analytics is disabled
  if (!config.enabled || !config.googleAnalyticsId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`}
        strategy="afterInteractive"
      />
      
      {/* Google Analytics Configuration */}
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${config.googleAnalyticsId}', {
              page_path: window.location.pathname,
              ${config.debug ? 'debug_mode: true,' : ''}
            });
          `,
        }}
      />
    </>
  );
}

/**
 * Analytics Event Tracking Utilities
 */

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent): void {
  const config = getAnalyticsConfig();
  
  if (!config.enabled || !window.gtag) {
    if (config.debug) {
      console.log('📊 GA4 Event (Debug):', event);
    }
    return;
  }

  window.gtag('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    ...event.custom_parameters,
  });

  if (config.debug) {
    console.log('📊 GA4 Event Tracked:', event);
  }
}

/**
 * Track page view manually (useful for SPA navigation)
 */
export function trackPageView(path: string, title?: string): void {
  const config = getAnalyticsConfig();
  
  if (!config.enabled || !config.googleAnalyticsId || !window.gtag) {
    if (config.debug) {
      console.log('📊 GA4 Page View (Debug):', { path, title });
    }
    return;
  }

  window.gtag('config', config.googleAnalyticsId, {
    page_path: path,
    page_title: title,
  });

  if (config.debug) {
    console.log('📊 GA4 Page View Tracked:', { path, title });
  }
}

/**
 * Track user engagement events
 */
export const trackEngagement = {
  // Track when user clicks a CTA button
  ctaClick: (buttonName: string, location: string) => {
    trackEvent({
      action: 'cta_click',
      category: 'engagement',
      label: buttonName,
      custom_parameters: { location },
    });
  },

  // Track form submissions
  formSubmit: (formName: string, success: boolean = true) => {
    trackEvent({
      action: 'form_submit',
      category: 'engagement',
      label: formName,
      custom_parameters: { success },
    });
  },

  // Track user registration
  userRegister: (method: string = 'email') => {
    trackEvent({
      action: 'sign_up',
      category: 'user',
      label: method,
    });
  },

  // Track user login
  userLogin: (method: string = 'email') => {
    trackEvent({
      action: 'login',
      category: 'user',
      label: method,
    });
  },

  // Track coaching session booking
  sessionBook: (coachId: string, sessionType: string) => {
    trackEvent({
      action: 'session_book',
      category: 'coaching',
      label: sessionType,
      custom_parameters: { coach_id: coachId },
    });
  },

  // Track search usage
  search: (query: string, results: number) => {
    trackEvent({
      action: 'search',
      category: 'engagement',
      label: query,
      value: results,
    });
  },

  // Track file downloads
  download: (fileName: string, fileType: string) => {
    trackEvent({
      action: 'file_download',
      category: 'engagement',
      label: fileName,
      custom_parameters: { file_type: fileType },
    });
  },
};

/**
 * Track business-specific events for Coachini
 */
export const trackCoachini = {
  // Track when someone views a coach profile
  coachProfileView: (coachId: string, coachName: string) => {
    trackEvent({
      action: 'coach_profile_view',
      category: 'coaching',
      label: coachName,
      custom_parameters: { coach_id: coachId },
    });
  },

  // Track when someone starts the coaching application process
  coachApplicationStart: () => {
    trackEvent({
      action: 'coach_application_start',
      category: 'coaching',
      label: 'application_form',
    });
  },

  // Track pricing page interactions
  pricingView: (plan: string) => {
    trackEvent({
      action: 'pricing_view',
      category: 'business',
      label: plan,
    });
  },

  // Track contact form usage
  contactFormSubmit: (inquiryType: string) => {
    trackEvent({
      action: 'contact_form_submit',
      category: 'lead_generation',
      label: inquiryType,
    });
  },
};

/**
 * Analytics Provider Component
 * Wraps the app with analytics tracking
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GoogleAnalytics />
    </>
  );
}

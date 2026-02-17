'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_MEASUREMENT_ID = process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'];
const ANALYTICS_CONSENT_KEY = 'slowspot_analytics_consent';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check for analytics consent
    const consent = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    if (consent === 'granted') {
      setHasConsent(true);
    }

    // Listen for consent changes
    const handleConsentChange = (event: CustomEvent<{ analytics: boolean }>) => {
      if (event.detail.analytics) {
        setHasConsent(true);
        localStorage.setItem(ANALYTICS_CONSENT_KEY, 'granted');
      } else {
        setHasConsent(false);
        localStorage.setItem(ANALYTICS_CONSENT_KEY, 'denied');
      }
    };

    window.addEventListener('cookieConsentChange', handleConsentChange as EventListener);
    return () => {
      window.removeEventListener('cookieConsentChange', handleConsentChange as EventListener);
    };
  }, []);

  // Don't render if no GA ID or no consent
  if (!GA_MEASUREMENT_ID || !hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}

// Helper function to track events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Helper function to track page views (for SPA navigation)
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

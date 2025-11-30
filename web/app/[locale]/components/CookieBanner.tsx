'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const COOKIE_CONSENT_KEY = 'slowspot_cookie_consent';

export function CookieBanner() {
  const t = useTranslations('cookieBanner');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-inner">
        <p className="cookie-banner-text">
          {t('message')}
        </p>
        <div className="cookie-banner-actions">
          <Link href="/privacy" className="cookie-banner-link">
            {t('learnMore')}
          </Link>
          <button onClick={handleAccept} className="cookie-banner-btn">
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}

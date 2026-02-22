'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const COOKIE_CONSENT_KEY = 'slowspot_cookie_consent';
const ANALYTICS_CONSENT_KEY = 'slowspot_analytics_consent';

export function CookieBanner() {
  const t = useTranslations('cookieBanner');
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const dispatchConsentEvent = (analytics: boolean) => {
    const event = new CustomEvent('cookieConsentChange', {
      detail: { analytics }
    });
    window.dispatchEvent(event);
  };

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'all');
    localStorage.setItem(ANALYTICS_CONSENT_KEY, 'granted');
    dispatchConsentEvent(true);
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'necessary');
    localStorage.setItem(ANALYTICS_CONSENT_KEY, 'denied');
    dispatchConsentEvent(false);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, analyticsEnabled ? 'all' : 'necessary');
    localStorage.setItem(ANALYTICS_CONSENT_KEY, analyticsEnabled ? 'granted' : 'denied');
    dispatchConsentEvent(analyticsEnabled);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-inner">
        {!showDetails ? (
          <>
            <p className="cookie-banner-text">
              {t('message')}
            </p>
            <div className="cookie-banner-actions">
              <button
                onClick={() => setShowDetails(true)}
                className="cookie-banner-link"
              >
                {t('customize')}
              </button>
              <button
                onClick={handleAcceptNecessary}
                className="cookie-banner-btn cookie-banner-btn-secondary"
              >
                {t('necessaryOnly')}
              </button>
              <button
                onClick={handleAcceptAll}
                className="cookie-banner-btn"
              >
                {t('acceptAll')}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="cookie-banner-text cookie-banner-text-small">
              {t('customizeDescription')}
            </p>

            <div className="cookie-preferences">
              {/* Necessary cookies - always on */}
              <div className="cookie-preference-item">
                <div className="cookie-preference-header">
                  <span className="cookie-preference-label">{t('necessaryCookies')}</span>
                  <span className="cookie-preference-badge cookie-preference-badge-required">
                    {t('required')}
                  </span>
                </div>
                <p className="cookie-preference-description">
                  {t('necessaryDescription')}
                </p>
              </div>

              {/* Analytics cookies - optional */}
              <div className="cookie-preference-item">
                <div className="cookie-preference-header">
                  <span className="cookie-preference-label">{t('analyticsCookies')}</span>
                  <label className="cookie-toggle">
                    <input
                      type="checkbox"
                      checked={analyticsEnabled}
                      onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    />
                    <span className="cookie-toggle-slider"></span>
                  </label>
                </div>
                <p className="cookie-preference-description">
                  {t('analyticsDescription')}
                </p>
              </div>
            </div>

            <div className="cookie-banner-actions">
              <Link href="/privacy" className="cookie-banner-link">
                {t('learnMore')}
              </Link>
              <button
                onClick={() => setShowDetails(false)}
                className="cookie-banner-btn cookie-banner-btn-secondary"
              >
                {t('back')}
              </button>
              <button
                onClick={handleSavePreferences}
                className="cookie-banner-btn"
              >
                {t('savePreferences')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

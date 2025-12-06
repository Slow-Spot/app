'use client';

import { useTranslations } from 'next-intl';
import HeaderWithControls from '../components/HeaderWithControls';
import SubpageFooter from '../components/SubpageFooter';
import { appConfig } from '../../config/app.config';

interface FaqItem {
  question: string;
  answer: string;
}

export default function Support() {
  const t = useTranslations('supportPage');

  // Get FAQ items using raw() method
  const faqItems = t.raw('faq.items') as FaqItem[];

  return (
    <main className="subpage subpage-with-header">
      <HeaderWithControls variant="solid" />

      <article className="subpage-content">
        <h1 className="subpage-title">{t('title')}</h1>
        <p className="subpage-subtitle">{t('subtitle')}</p>

        {/* Contact Card */}
        <div className="subpage-contact-box">
          <h2 className="subpage-contact-title">{t('contact.title')}</h2>
          <div className="subpage-contact-content">
            <div className="subpage-contact-item">
              <div className="subpage-contact-icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="subpage-contact-label">{t('contact.email')}</p>
                <a href="mailto:contact@slowspot.me" className="subpage-contact-link">
                  contact@slowspot.me
                </a>
              </div>
            </div>
            <p className="subpage-contact-note">{t('contact.responseTime')}</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="subpage-faq-section">
          <h2 className="subpage-section-title">{t('faq.title')}</h2>

          <div className="subpage-faq-list">
            {faqItems.map((item, i) => (
              <div key={i} className="subpage-faq-item">
                <h3 className="subpage-faq-question">{item.question}</h3>
                <p className="subpage-faq-answer">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="subpage-feedback-box">
          <h2 className="subpage-feedback-title">{t('feedback.title')}</h2>
          <p className="subpage-feedback-text">{t('feedback.text')}</p>
          <a href="mailto:contact@slowspot.me?subject=Feedback" className="subpage-feedback-button">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {t('feedback.button')}
          </a>
        </div>

        {/* App Info */}
        <div className="subpage-app-info">
          <h2 className="subpage-app-info-title">{t('appInfo.title')}</h2>
          <div className="subpage-app-info-grid">
            <div className="subpage-app-info-card">
              <p className="subpage-app-info-label">{t('appInfo.version')}</p>
              <p className="subpage-app-info-value">{appConfig.version}</p>
            </div>
            <div className="subpage-app-info-card">
              <p className="subpage-app-info-label">{t('appInfo.platform')}</p>
              <p className="subpage-app-info-value">{t('appInfo.platformValue')}</p>
            </div>
          </div>
        </div>
      </article>

      <SubpageFooter />
    </main>
  );
}

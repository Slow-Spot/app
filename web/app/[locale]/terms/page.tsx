'use client';

import { useTranslations } from 'next-intl';
import HeaderWithControls from '../components/HeaderWithControls';
import SubpageFooter from '../components/SubpageFooter';

export default function TermsOfService() {
  const t = useTranslations('termsPage');

  // Get summary items array
  const summaryItems = t.raw('summary.items') as string[];

  return (
    <main className="subpage subpage-with-header">
      <HeaderWithControls variant="solid" />

      <article className="subpage-content">
        <h1 className="subpage-title">{t('title')}</h1>
        <p className="subpage-subtitle">{t('lastUpdated')}</p>

        {/* Summary Box */}
        <div className="subpage-highlight-box">
          <h2 className="subpage-highlight-title">{t('summary.title')}</h2>
          <ul className="subpage-highlight-list">
            {summaryItems.map((item, i) => (
              <li key={i} className="subpage-highlight-item">
                <span className="subpage-check">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="subpage-prose">
          {/* Acceptance */}
          <h2>{t('sections.acceptance.title')}</h2>
          <p>{t('sections.acceptance.content')}</p>

          {/* Description of Service */}
          <h2>{t('sections.service.title')}</h2>
          <p>{t('sections.service.content')}</p>

          {/* Eligibility */}
          <h2>{t('sections.eligibility.title')}</h2>
          <p>{t('sections.eligibility.content')}</p>

          {/* License */}
          <h2>{t('sections.license.title')}</h2>
          <p>{t('sections.license.content')}</p>

          {/* User Content */}
          <h2>{t('sections.yourContent.title')}</h2>
          <p>{t('sections.yourContent.content')}</p>

          {/* Intellectual Property */}
          <h2>{t('sections.intellectual.title')}</h2>
          <p>{t('sections.intellectual.content')}</p>

          {/* Health Disclaimer */}
          <h2>{t('sections.health.title')}</h2>
          <div className="subpage-warning-box">
            <p className="subpage-warning-title">{t('sections.health.warning')}</p>
            <p className="subpage-warning-text">{t('sections.health.content')}</p>
          </div>

          {/* Disclaimer of Warranties */}
          <h2>{t('sections.disclaimer.title')}</h2>
          <p>{t('sections.disclaimer.content')}</p>

          {/* Limitation of Liability */}
          <h2>{t('sections.liability.title')}</h2>
          <p>{t('sections.liability.content')}</p>

          {/* Indemnification */}
          <h2>{t('sections.indemnification.title')}</h2>
          <p>{t('sections.indemnification.content')}</p>

          {/* Termination */}
          <h2>{t('sections.termination.title')}</h2>
          <p>{t('sections.termination.content')}</p>

          {/* Changes */}
          <h2>{t('sections.changes.title')}</h2>
          <p>{t('sections.changes.content')}</p>

          {/* Governing Law */}
          <h2>{t('sections.governing.title')}</h2>
          <p>{t('sections.governing.content')}</p>

          {/* Severability */}
          <h2>{t('sections.severability.title')}</h2>
          <p>{t('sections.severability.content')}</p>

          {/* Entire Agreement */}
          <h2>{t('sections.entire.title')}</h2>
          <p>{t('sections.entire.content')}</p>

          {/* Contact */}
          <h2>{t('sections.contact.title')}</h2>
          <p>{t('sections.contact.content')}</p>
          <ul>
            <li>
              <strong>{t('sections.contact.email')}</strong>{' '}
              <a href="mailto:contact@slowspot.me">contact@slowspot.me</a>
            </li>
            <li>
              <strong>{t('sections.contact.website')}</strong>{' '}
              <a href="https://slowspot.me">https://slowspot.me</a>
            </li>
          </ul>
        </div>
      </article>

      <SubpageFooter />
    </main>
  );
}

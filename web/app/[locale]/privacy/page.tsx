'use client';

import { useTranslations } from 'next-intl';
import HeaderWithControls from '../components/HeaderWithControls';
import SubpageFooter from '../components/SubpageFooter';

export default function PrivacyPolicy() {
  const t = useTranslations('privacyPage');

  // Get arrays using raw() method
  const summaryItems = t.raw('summary.items') as string[];
  const localStorageItems = t.raw('sections.localStorage.items') as string[];

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
          {/* Our Promise */}
          <h2>{t('sections.core.title')}</h2>
          <p>{t('sections.core.content')}</p>

          {/* What We Collect */}
          <h2>{t('sections.whatWeCollect.title')}</h2>
          <p>{t('sections.whatWeCollect.content')}</p>

          {/* Local Storage */}
          <h2>{t('sections.localStorage.title')}</h2>
          <p>{t('sections.localStorage.intro')}</p>
          <ul>
            {localStorageItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>
            <em>{t('sections.localStorage.note')}</em>
          </p>

          {/* Permissions */}
          <h2>{t('sections.permissions.title')}</h2>
          <p>{t('sections.permissions.content')}</p>

          {/* Third Party */}
          <h2>{t('sections.thirdParty.title')}</h2>
          <p>{t('sections.thirdParty.content')}</p>

          {/* No Tracking */}
          <h2>{t('sections.noTracking.title')}</h2>
          <p>{t('sections.noTracking.content')}</p>

          {/* Children */}
          <h2>{t('sections.children.title')}</h2>
          <p>{t('sections.children.content')}</p>

          {/* International Compliance */}
          <h2>{t('sections.international.title')}</h2>
          <p>{t('sections.international.content')}</p>

          {/* Your Rights */}
          <h2>{t('sections.yourRights.title')}</h2>
          <p>{t('sections.yourRights.content')}</p>

          {/* Security */}
          <h2>{t('sections.security.title')}</h2>
          <p>{t('sections.security.content')}</p>

          {/* Changes */}
          <h2>{t('sections.changes.title')}</h2>
          <p>{t('sections.changes.content')}</p>

          {/* Legal Basis */}
          <h2>{t('sections.legal.title')}</h2>
          <p>{t('sections.legal.content')}</p>

          {/* Contact */}
          <h2>{t('sections.contact.title')}</h2>
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

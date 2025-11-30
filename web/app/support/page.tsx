'use client';

import Link from 'next/link';
import LanguageSwitcher from '../i18n/LanguageSwitcher';

export default function Support() {
  return (
    <main className="subpage">
      {/* Language/Theme Controls */}
      <LanguageSwitcher />

      {/* Header */}
      <header className="subpage-header">
        <div className="subpage-header-inner">
          <Link href="/" className="subpage-brand">
            <span className="font-light">Slow</span> <span className="subpage-brand-accent">Spot</span>
          </Link>
          <nav className="subpage-nav">
            <Link href="/privacy" className="subpage-nav-link">Privacy</Link>
            <Link href="/terms" className="subpage-nav-link">Terms</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <article className="subpage-content">
        <h1 className="subpage-title">Support</h1>
        <p className="subpage-subtitle">We&apos;re here to help you with your meditation journey.</p>

        {/* Contact Card */}
        <div className="subpage-contact-box">
          <h2 className="subpage-contact-title">Contact Us</h2>
          <div className="subpage-contact-content">
            <div className="subpage-contact-item">
              <div className="subpage-contact-icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="subpage-contact-label">Email</p>
                <a href="mailto:support@slowspot.me" className="subpage-contact-link">
                  support@slowspot.me
                </a>
              </div>
            </div>
            <p className="subpage-contact-note">
              Response time: We aim to respond within 48 hours.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="subpage-faq-section">
          <h2 className="subpage-section-title">Frequently Asked Questions</h2>

          <div className="subpage-faq-list">
            <div className="subpage-faq-item">
              <h3 className="subpage-faq-question">How do I get started with meditation?</h3>
              <p className="subpage-faq-answer">
                Simply open the app and tap the &quot;Medytuj&quot; (Meditate) button on the home screen.
                Choose a preset session or create your own custom session. The app will guide
                you through the meditation with optional bells and ambient sounds.
              </p>
            </div>

            <div className="subpage-faq-item">
              <h3 className="subpage-faq-question">Does the app work offline?</h3>
              <p className="subpage-faq-answer">
                Yes! Slow Spot is designed to work 100% offline. All meditation sessions,
                sounds, and features are available without an internet connection. Your data
                is stored locally on your device.
              </p>
            </div>

            <div className="subpage-faq-item">
              <h3 className="subpage-faq-question">How do I set up meditation reminders?</h3>
              <p className="subpage-faq-answer">
                Go to your Profile screen and tap &quot;Schedule Reminder&quot;. You can choose your
                preferred time for daily meditation reminders. The app will request calendar
                permission to create these reminders.
              </p>
            </div>

            <div className="subpage-faq-item">
              <h3 className="subpage-faq-question">Can I create custom meditation sessions?</h3>
              <p className="subpage-faq-answer">
                Yes! Tap the &quot;+&quot; button in the Meditation screen to create a custom session.
                You can customize the duration, ambient sounds, interval bells, and more.
              </p>
            </div>

            <div className="subpage-faq-item">
              <h3 className="subpage-faq-question">How do I change the app language?</h3>
              <p className="subpage-faq-answer">
                Go to Settings and find the Language section. Slow Spot supports English,
                Polish, Spanish, German, French, and Hindi.
              </p>
            </div>

            <div className="subpage-faq-item">
              <h3 className="subpage-faq-question">How do I delete my data?</h3>
              <p className="subpage-faq-answer">
                Go to Settings {`>`} Data & Privacy {`>`} &quot;Clear Data&quot; to delete all your local data.
                Alternatively, uninstalling the app will remove all data from your device.
                Since we don&apos;t store any data on servers, there&apos;s nothing else to delete.
              </p>
            </div>

            <div className="subpage-faq-item">
              <h3 className="subpage-faq-question">Is my data private?</h3>
              <p className="subpage-faq-answer">
                Absolutely. Slow Spot doesn&apos;t collect, transmit, or store any of your personal
                data on external servers. All your meditation history, preferences, and progress
                remain on your device only. Read our{' '}
                <Link href="/privacy" className="subpage-inline-link">Privacy Policy</Link>{' '}
                for more details.
              </p>
            </div>

            <div className="subpage-faq-item">
              <h3 className="subpage-faq-question">The app is not working properly. What should I do?</h3>
              <p className="subpage-faq-answer">
                Try these steps: 1) Close and reopen the app, 2) Restart your device,
                3) Make sure you have the latest version from App Store or Google Play.
                If the problem persists, please contact us at support@slowspot.me with
                details about the issue.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="subpage-feedback-box">
          <h2 className="subpage-feedback-title">Feedback & Suggestions</h2>
          <p className="subpage-feedback-text">
            We love hearing from our users! If you have suggestions for new features,
            improvements, or just want to share your meditation experience, please reach out:
          </p>
          <a href="mailto:feedback@slowspot.me" className="subpage-feedback-button">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Feedback
          </a>
        </div>

        {/* App Info */}
        <div className="subpage-app-info">
          <h2 className="subpage-app-info-title">App Information</h2>
          <div className="subpage-app-info-grid">
            <div className="subpage-app-info-card">
              <p className="subpage-app-info-label">Version</p>
              <p className="subpage-app-info-value">1.0.0</p>
            </div>
            <div className="subpage-app-info-card">
              <p className="subpage-app-info-label">Platform</p>
              <p className="subpage-app-info-value">iOS & Android</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="subpage-footer">
          <p className="subpage-footer-brand">
            <span className="font-light">Slow</span> <span className="subpage-brand-accent font-semibold">Spot</span>
          </p>
          <p className="subpage-footer-tagline">Mindfulness. Simplicity. Privacy.</p>
          <div className="subpage-footer-links">
            <Link href="/privacy" className="subpage-footer-link">Privacy Policy</Link>
            <span className="subpage-footer-separator">•</span>
            <Link href="/terms" className="subpage-footer-link">Terms of Service</Link>
          </div>
        </div>
      </article>
    </main>
  );
}

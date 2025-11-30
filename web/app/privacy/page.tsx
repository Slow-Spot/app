'use client';

import Link from 'next/link';
import LanguageSwitcher from '../i18n/LanguageSwitcher';

export default function PrivacyPolicy() {
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
            <Link href="/terms" className="subpage-nav-link">Terms</Link>
            <Link href="/support" className="subpage-nav-link">Support</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <article className="subpage-content">
        <h1 className="subpage-title">Privacy Policy</h1>
        <p className="subpage-subtitle">Last Updated: November 27, 2024</p>

        {/* Summary Box */}
        <div className="subpage-highlight-box">
          <h2 className="subpage-highlight-title">Summary (TL;DR)</h2>
          <ul className="subpage-highlight-list">
            <li className="subpage-highlight-item"><span className="subpage-check">✓</span> Your data stays on your device</li>
            <li className="subpage-highlight-item"><span className="subpage-check">✓</span> No accounts, no sign-in, no tracking</li>
            <li className="subpage-highlight-item"><span className="subpage-check">✓</span> No analytics, no ads, no third-party services</li>
            <li className="subpage-highlight-item"><span className="subpage-check">✓</span> Optional calendar permission for reminders only</li>
            <li className="subpage-highlight-item"><span className="subpage-check">✓</span> Delete anytime by uninstalling the app</li>
            <li className="subpage-highlight-item"><span className="subpage-check">✓</span> 100% offline compatible</li>
          </ul>
        </div>

        <div className="subpage-prose">
          <h2>Introduction</h2>
          <p>
            Slow Spot (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy
            explains how our mobile meditation application handles your information.
          </p>

          <h2>Our Privacy Philosophy</h2>
          <p>
            <strong>Simple Truth:</strong> Your data stays on your device. We don&apos;t collect, transmit, or store any of
            your personal information on external servers.
          </p>
          <p>
            Slow Spot is designed to operate <strong>100% offline</strong>. All your meditation sessions,
            preferences, and personal data remain private and stored locally on your device.
          </p>

          <h2>Information We Do NOT Collect</h2>
          <p>We want to be crystal clear about what we DON&apos;T do:</p>
          <ul>
            <li>We do NOT collect your name, email, or any personal identifiers</li>
            <li>We do NOT track your location</li>
            <li>We do NOT collect your meditation intentions or personal notes</li>
            <li>We do NOT use analytics or tracking services</li>
            <li>We do NOT share your data with third parties</li>
            <li>We do NOT transmit any data to external servers</li>
            <li>We do NOT use cookies or similar tracking technologies</li>
            <li>We do NOT serve advertisements</li>
          </ul>

          <h2>Information Stored Locally on Your Device</h2>
          <p>The following information is stored <strong>ONLY</strong> on your device using secure local storage:</p>

          <h3>1. User Preferences</h3>
          <ul>
            <li><strong>Language selection</strong> (English, Polish, Spanish, German, French, Hindi)</li>
            <li><strong>Theme preference</strong> (Light, Dark, or System)</li>
            <li><strong>Purpose:</strong> To provide a personalized experience</li>
          </ul>

          <h3>2. Meditation Session History</h3>
          <ul>
            <li><strong>Session duration</strong> and <strong>completion date</strong></li>
            <li><strong>Session type</strong> (e.g., Morning Awakening, Loving Kindness)</li>
            <li><strong>Custom session configurations</strong> (if you create custom sessions)</li>
            <li><strong>Purpose:</strong> To track your meditation progress and maintain streaks</li>
          </ul>

          <h3>3. Progress Statistics</h3>
          <ul>
            <li><strong>Total sessions completed</strong></li>
            <li><strong>Total minutes meditated</strong></li>
            <li><strong>Current and longest meditation streaks</strong></li>
            <li><strong>Achievement progress</strong> (e.g., &quot;10 sessions completed&quot; badge)</li>
            <li><strong>Purpose:</strong> To motivate and celebrate your meditation journey</li>
          </ul>

          <h3>4. Calendar Events (Optional)</h3>
          <ul>
            <li><strong>Meditation reminders</strong> (if you enable calendar integration)</li>
            <li><strong>Stored in:</strong> Your device&apos;s native calendar app</li>
            <li><strong>Purpose:</strong> To help you maintain a consistent meditation practice</li>
          </ul>

          <h2>Permissions We Request</h2>

          <h3>Required Permissions</h3>
          <p><strong>None.</strong> The app works without any required permissions.</p>

          <h3>Optional Permissions</h3>
          <p>The following permissions are <strong>optional</strong> and only used if you choose to enable specific features:</p>

          <h4>Calendar Access</h4>
          <ul>
            <li><strong>Why:</strong> To schedule meditation reminders in your device&apos;s calendar</li>
            <li><strong>When:</strong> Only when you tap &quot;Schedule Reminder&quot; in the Profile screen</li>
            <li><strong>What:</strong> Creates recurring meditation reminders at your chosen time</li>
            <li><strong>You can:</strong> Disable this anytime by deleting the calendar events or denying permission</li>
          </ul>

          <h2>How Your Data is Protected</h2>

          <h3>Local Storage Only</h3>
          <p>All data is stored using your device&apos;s secure local storage.</p>

          <h3>No Network Transmission</h3>
          <p>The app operates in <strong>airplane mode compatible</strong> fashion. Your meditation data never leaves your device.</p>

          <h3>No Account Required</h3>
          <p>You don&apos;t need to create an account, provide an email, or sign in. Start meditating immediately.</p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Slow Spot does not collect any data from anyone, including children under 13 (or 16 in the EU).
            The app is family-friendly and suitable for all ages.
          </p>

          <h2>Your Rights</h2>

          <h3>Right to Access</h3>
          <p>All your data is visible within the app:</p>
          <ul>
            <li>View your meditation history in the <strong>Profile</strong> screen</li>
            <li>View your statistics and progress in the <strong>Profile</strong> screen</li>
            <li>View your custom sessions in the <strong>Meditation</strong> screen</li>
          </ul>

          <h3>Right to Delete</h3>
          <p>You can delete your data at any time:</p>
          <ul>
            <li><strong>Individual sessions:</strong> Long-press a custom session and select &quot;Delete&quot;</li>
            <li><strong>All app data:</strong> Use &quot;Clear Data&quot; in Settings or uninstall the app</li>
          </ul>
          <p>There is no &quot;account&quot; to delete because we don&apos;t store your data anywhere except your device.</p>

          <h2>Third-Party Services</h2>

          <h3>We Do NOT Use:</h3>
          <ul>
            <li>Analytics services (no Google Analytics, Firebase Analytics, etc.)</li>
            <li>Advertising networks</li>
            <li>Social media SDKs</li>
            <li>Cloud storage services</li>
            <li>Backend servers or APIs</li>
          </ul>

          <h3>Audio Content Sources:</h3>
          <p>
            The meditation bells and ambient sounds included in the app are sourced from royalty-free,
            Creative Commons (CC0) licensed content. These services do NOT have access to your app
            usage or personal data.
          </p>

          <h2>Legal Compliance</h2>
          <p>This Privacy Policy complies with:</p>
          <ul>
            <li><strong>GDPR</strong> (General Data Protection Regulation - EU)</li>
            <li><strong>CCPA</strong> (California Consumer Privacy Act - USA)</li>
            <li><strong>COPPA</strong> (Children&apos;s Online Privacy Protection Act - USA)</li>
            <li><strong>Apple App Store Review Guidelines</strong></li>
            <li><strong>Google Play Store Developer Policy</strong></li>
          </ul>

          <h2>Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. When we do:</p>
          <ul>
            <li>We&apos;ll update the &quot;Last Updated&quot; date at the top</li>
            <li>We&apos;ll notify you via an in-app message for major changes</li>
          </ul>

          <h2>Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@slowspot.me">privacy@slowspot.me</a></li>
            <li><strong>Website:</strong> <a href="https://slowspot.me">https://slowspot.me</a></li>
          </ul>
          <p><strong>Response Time:</strong> We aim to respond to all privacy inquiries within 48 hours.</p>

          <h2>Your Trust</h2>
          <p>
            We built Slow Spot with privacy as a core principle, not an afterthought. Your meditation
            practice is personal and sacred. We will never compromise your privacy for profit or analytics.
          </p>
          <p>
            <strong>Thank you for trusting Slow Spot with your meditation journey.</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="subpage-footer">
          <p className="subpage-footer-brand">
            <span className="font-light">Slow</span> <span className="subpage-brand-accent font-semibold">Spot</span>
          </p>
          <p className="subpage-footer-tagline">Mindfulness. Simplicity. Privacy.</p>
          <p className="subpage-footer-tagline mt-2">Version 1.0.0</p>
        </div>
      </article>
    </main>
  );
}

'use client';

import Link from 'next/link';
import LanguageSwitcher from '../i18n/LanguageSwitcher';

export default function TermsOfService() {
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
            <Link href="/support" className="subpage-nav-link">Support</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <article className="subpage-content">
        <h1 className="subpage-title">Terms of Service</h1>
        <p className="subpage-subtitle">Last Updated: November 27, 2024</p>

        {/* Summary Box */}
        <div className="subpage-highlight-box">
          <h2 className="subpage-highlight-title">Quick Summary</h2>
          <ul className="subpage-highlight-list">
            <li className="subpage-highlight-item"><span className="subpage-check">✓</span> Free to use for personal meditation practice</li>
            <li className="subpage-highlight-item"><span className="subpage-check">✓</span> No account required</li>
            <li className="subpage-highlight-item"><span className="subpage-check">✓</span> Your content stays on your device</li>
            <li className="subpage-highlight-item"><span className="subpage-check">✓</span> Use responsibly and at your own discretion</li>
            <li className="subpage-highlight-item"><span className="subpage-check">✓</span> Not a substitute for professional medical advice</li>
          </ul>
        </div>

        <div className="subpage-prose">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By downloading, installing, or using the Slow Spot mobile application (&quot;App&quot;), you agree
            to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms,
            please do not use the App.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Slow Spot is a meditation and mindfulness application that provides:
          </p>
          <ul>
            <li>Guided and unguided meditation sessions</li>
            <li>Ambient sounds for relaxation</li>
            <li>Progress tracking and statistics</li>
            <li>Customizable meditation timer</li>
            <li>Inspirational quotes and wisdom teachings</li>
            <li>Meditation reminders (optional)</li>
          </ul>
          <p>
            The App operates entirely offline and does not require an internet connection or user account.
          </p>

          <h2>3. License to Use</h2>
          <p>
            Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable
            license to use the App for your personal, non-commercial meditation practice.
          </p>
          <p>You may NOT:</p>
          <ul>
            <li>Copy, modify, or distribute the App</li>
            <li>Reverse engineer, decompile, or disassemble the App</li>
            <li>Use the App for any commercial purpose without permission</li>
            <li>Remove any copyright or proprietary notices</li>
            <li>Transfer the license to another person</li>
          </ul>

          <h2>4. User Content</h2>
          <p>
            Any content you create within the App (custom sessions, personal notes, etc.) remains
            yours and is stored only on your device. We do not access, collect, or store your
            personal content.
          </p>

          <h2>5. Health Disclaimer</h2>
          <div className="subpage-warning-box">
            <p className="subpage-warning-title">Important Health Information</p>
            <p className="subpage-warning-text">
              Slow Spot is designed for general wellness and relaxation purposes only. The App is
              NOT intended to:
            </p>
            <ul className="subpage-warning-list">
              <li>Diagnose, treat, cure, or prevent any disease or health condition</li>
              <li>Replace professional medical advice, diagnosis, or treatment</li>
              <li>Substitute for therapy, counseling, or mental health treatment</li>
            </ul>
          </div>
          <p>
            If you have any medical conditions, mental health concerns, or are taking medication,
            please consult with a qualified healthcare provider before using meditation practices.
          </p>
          <p>
            If you experience discomfort, anxiety, or any adverse effects during meditation,
            stop immediately and consult a healthcare professional.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            The App, including all content, features, and functionality (including but not limited
            to text, graphics, logos, audio clips, and software), is owned by Slow Spot and is
            protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            Audio content (meditation bells, ambient sounds) is sourced from royalty-free,
            Creative Commons licensed sources and used in accordance with their respective licenses.
          </p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>
            THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>Implied warranties of merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement</li>
            <li>Accuracy or reliability of content</li>
          </ul>
          <p>
            We do not warrant that the App will be uninterrupted, error-free, or free of viruses
            or other harmful components.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SLOW SPOT AND ITS DEVELOPERS SHALL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
            INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>Loss of profits, data, or goodwill</li>
            <li>Service interruption or device damage</li>
            <li>Personal injury or emotional distress</li>
            <li>Any other intangible losses</li>
          </ul>
          <p>
            Our total liability for any claims arising from use of the App shall not exceed the
            amount you paid for the App (if any).
          </p>

          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Slow Spot, its developers, and affiliates
            from any claims, damages, losses, or expenses arising from your use of the App or
            violation of these Terms.
          </p>

          <h2>10. Modifications to the App</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the App at any time without
            notice. We may also update these Terms from time to time. Continued use of the App
            after changes constitutes acceptance of the modified Terms.
          </p>

          <h2>11. Termination</h2>
          <p>
            You may stop using the App at any time by uninstalling it from your device. We may
            terminate or suspend your access to the App at our sole discretion, without notice,
            for conduct that we believe violates these Terms or is harmful to other users or us.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Poland,
            without regard to its conflict of law provisions. Any disputes arising from these Terms
            or use of the App shall be resolved in the courts of Poland.
          </p>

          <h2>13. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision
            shall be limited or eliminated to the minimum extent necessary, and the remaining
            provisions shall remain in full force and effect.
          </p>

          <h2>14. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between
            you and Slow Spot regarding your use of the App.
          </p>

          <h2>15. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:legal@slowspot.me">legal@slowspot.me</a></li>
            <li><strong>Website:</strong> <a href="https://slowspot.me">https://slowspot.me</a></li>
          </ul>

          <h2>16. App Store Terms</h2>
          <p>
            If you downloaded the App from the Apple App Store or Google Play Store, you also
            agree to their respective terms of service. In case of conflict between these Terms
            and the app store terms, the app store terms shall prevail for issues related to
            app distribution.
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

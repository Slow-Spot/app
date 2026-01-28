import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = 'https://slowspot.me';
const siteName = 'Slow Spot';
const siteDescription =
  'Discover inner peace with Slow Spot - the minimalist meditation app. No account required, 100% offline, complete privacy. Start your mindfulness journey today with guided sessions, ambient sounds, and progress tracking.';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#667eea' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Slow Spot - Meditation Made Simple | Free Mindfulness App',
    template: '%s | Slow Spot',
  },
  description: siteDescription,
  keywords: [
    'meditation app',
    'mindfulness',
    'meditation timer',
    'guided meditation',
    'relaxation',
    'stress relief',
    'mental health',
    'wellness app',
    'breathing exercises',
    'sleep meditation',
    'anxiety relief',
    'meditation for beginners',
    'daily meditation',
    'meditation practice',
    'zen',
    'calm',
    'focus',
    'offline meditation app',
    'privacy-first app',
    'no login meditation',
  ],
  authors: [{ name: 'Slow Spot Team', url: siteUrl }],
  creator: 'Slow Spot',
  publisher: 'Slow Spot',
  applicationName: 'Slow Spot',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'Health & Fitness',

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'icon', url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },

  // Manifest
  manifest: '/manifest.json',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['pl_PL', 'de_DE', 'es_ES', 'fr_FR', 'hi_IN', 'zh_CN'],
    url: siteUrl,
    siteName: siteName,
    title: 'Slow Spot - Meditation Made Simple',
    description: siteDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Slow Spot - Meditation App',
        type: 'image/png',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Slow Spot - Meditation Made Simple',
    description: 'Free meditation app with complete privacy. No account, 100% offline.',
    images: ['/og-image.png'],
    creator: '@slowspotapp',
    site: '@slowspotapp',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification
  verification: {
    google: 'google-site-verification-code',
  },

  // App Links
  appLinks: {
    ios: {
      app_store_id: '6757082765',
      url: 'https://apps.apple.com/app/slow-spot-calm-meditate/id6757082765',
    },
    android: {
      package: 'com.slowspot.app',
      url: 'https://play.google.com/store/apps/details?id=com.slowspot.app',
    },
    web: {
      url: siteUrl,
      should_fallback: true,
    },
  },

  // Alternates
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-US': `${siteUrl}/en`,
      'pl-PL': `${siteUrl}/pl`,
      'de-DE': `${siteUrl}/de`,
      'es-ES': `${siteUrl}/es`,
      'fr-FR': `${siteUrl}/fr`,
      'hi-IN': `${siteUrl}/hi`,
      'zh-CN': `${siteUrl}/zh`,
    },
  },

  // Other
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Slow Spot',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#667eea',
    'msapplication-config': '/browserconfig.xml',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      publisher: { '@id': `${siteUrl}/#organization` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon-512.png`,
        width: 512,
        height: 512,
      },
      sameAs: ['https://twitter.com/slowspotapp'],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Slow Spot',
      description: siteDescription,
      applicationCategory: 'HealthApplication',
      operatingSystem: ['iOS', 'Android'],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Guided meditation sessions',
        'Customizable timer',
        'Ambient sounds',
        'Progress tracking',
        '100% offline functionality',
        'No account required',
        'Complete privacy',
        'Multi-language support',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Slow Spot free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Slow Spot is completely free to download and use. There are no hidden fees, subscriptions, or in-app purchases.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Slow Spot require an internet connection?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No, Slow Spot works 100% offline. All meditation sessions, sounds, and features are available without an internet connection.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is my data private with Slow Spot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes, Slow Spot is designed with privacy as a core principle. All your data stays on your device. We don't collect, transmit, or store any personal information.",
          },
        },
      ],
    },
  ],
};

type Props = {
  children: React.ReactNode;
};

// Inline script to prevent FOUC (Flash of Unstyled Content)
// This script runs before CSS is parsed and sets the correct theme class
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.add(isDark ? 'dark' : 'light');
    document.documentElement.classList.remove(isDark ? 'light' : 'dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme detection script - must run before CSS to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

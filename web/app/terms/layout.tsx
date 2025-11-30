import { Metadata } from 'next'

const siteUrl = 'https://slowspot.me'

export const metadata: Metadata = {
  title: 'Terms of Service - Usage Guidelines',
  description: 'Slow Spot Terms of Service: Free to use for personal meditation. No account required. Your content stays on your device. Health disclaimer included.',
  keywords: [
    'terms of service',
    'terms and conditions',
    'meditation app terms',
    'user agreement',
    'license agreement',
    'health disclaimer',
  ],
  openGraph: {
    title: 'Terms of Service | Slow Spot',
    description: 'Free meditation app for personal use. No account required. Your content stays private.',
    url: `${siteUrl}/terms`,
    type: 'website',
  },
  twitter: {
    title: 'Terms of Service | Slow Spot',
    description: 'Free meditation app for personal use. No account required.',
  },
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

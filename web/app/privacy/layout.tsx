import { Metadata } from 'next'

const siteUrl = 'https://slowspot.me'

export const metadata: Metadata = {
  title: 'Privacy Policy - Your Data Stays Private',
  description: 'Slow Spot Privacy Policy: Your meditation data stays on your device. No accounts, no tracking, no analytics. 100% offline, complete privacy. GDPR & CCPA compliant.',
  keywords: [
    'privacy policy',
    'meditation app privacy',
    'data protection',
    'GDPR compliant',
    'CCPA compliant',
    'no tracking',
    'offline app',
    'private meditation app',
  ],
  openGraph: {
    title: 'Privacy Policy | Slow Spot',
    description: 'Your meditation data stays on your device. No accounts, no tracking, no analytics.',
    url: `${siteUrl}/privacy`,
    type: 'website',
  },
  twitter: {
    title: 'Privacy Policy | Slow Spot',
    description: 'Your meditation data stays on your device. No accounts, no tracking.',
  },
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

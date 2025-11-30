import { Metadata } from 'next'

const siteUrl = 'https://slowspot.me'

export const metadata: Metadata = {
  title: 'Support & FAQ - Get Help with Meditation',
  description: 'Get help with Slow Spot meditation app. FAQ, troubleshooting, feature guides. Contact us at support@slowspot.me. Response within 48 hours.',
  keywords: [
    'meditation app support',
    'slow spot help',
    'FAQ',
    'meditation app FAQ',
    'troubleshooting',
    'customer support',
    'contact us',
    'meditation guide',
  ],
  openGraph: {
    title: 'Support & FAQ | Slow Spot',
    description: 'Get help with Slow Spot. FAQ, troubleshooting, and contact information.',
    url: `${siteUrl}/support`,
    type: 'website',
  },
  twitter: {
    title: 'Support & FAQ | Slow Spot',
    description: 'Get help with Slow Spot meditation app. FAQ and contact info.',
  },
  alternates: {
    canonical: `${siteUrl}/support`,
  },
}

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

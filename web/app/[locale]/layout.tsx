import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { CookieBanner } from './components/CookieBanner';
import { GoogleAnalytics } from '../components/GoogleAnalytics';
import '../globals.css';

const isValidLocale = (s: string): s is Locale =>
  (routing.locales as readonly string[]).includes(s);

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Walidacja locale - type predicate zaweza typ po sprawdzeniu
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
      <CookieBanner />
      <GoogleAnalytics />
    </NextIntlClientProvider>
  );
}

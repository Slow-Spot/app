'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n/routing';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check localStorage first for saved preference
    const savedLocale = localStorage.getItem('preferred-locale') as Locale | null;
    if (savedLocale && locales.includes(savedLocale)) {
      router.replace(`/${savedLocale}`);
      return;
    }

    // Detect browser language
    const browserLang = navigator.language.split('-')[0] as Locale;
    const targetLocale = locales.includes(browserLang) ? browserLang : 'en';

    router.replace(`/${targetLocale}`);
  }, [router]);

  // Show loading state while detecting language
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(139, 92, 246, 0.3)',
        borderTopColor: '#8B5CF6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

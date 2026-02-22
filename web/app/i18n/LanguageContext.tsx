'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { i18nConfig } from './config';
import type { Locale } from './config';
import { loadTranslation, getTranslation } from './translations';
import type { Translations } from './translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Get locale from localStorage or browser
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return i18nConfig.defaultLocale;
  }

  // Check localStorage first
  const savedLocale = localStorage.getItem('locale') as Locale | null;
  if (savedLocale && i18nConfig.locales.includes(savedLocale)) {
    return savedLocale;
  }

  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlLocale = urlParams.get('lang') as Locale | null;
  if (urlLocale && i18nConfig.locales.includes(urlLocale)) {
    return urlLocale;
  }

  // Check browser language
  const browserLang = navigator.language.split('-')[0] as Locale;
  if (i18nConfig.locales.includes(browserLang)) {
    return browserLang;
  }

  return i18nConfig.defaultLocale;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(i18nConfig.defaultLocale);
  const [translations, setTranslations] = useState<Translations>(getTranslation(i18nConfig.defaultLocale));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize locale on mount
  useEffect(() => {
    const initialLocale = getInitialLocale();
    setLocaleState(initialLocale);
    loadTranslation(initialLocale).then((t) => {
      setTranslations(t);
      setIsLoading(false);
    });
  }, []);

  const setLocale = (newLocale: Locale) => {
    setIsLoading(true);
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);

    // Update URL parameter
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLocale);
    window.history.replaceState({}, '', url);

    // Update html lang attribute
    document.documentElement.lang = newLocale;

    // Load translations
    loadTranslation(newLocale).then((t) => {
      setTranslations(t);
      setIsLoading(false);
    });
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

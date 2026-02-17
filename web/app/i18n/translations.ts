import { Locale } from './config';

// Import all translation files
import en from './locales/en.json';

// Translation type based on English translations
export type Translations = typeof en;

// Store for translations
const translations: Partial<Record<Locale, Translations>> = {
  en,
};

// Load translation function
export async function loadTranslation(locale: Locale): Promise<Translations> {
  if (translations[locale]) {
    return translations[locale]!;
  }

  try {
    // Dynamically import the translation file
    const translation = await import(`./locales/${locale}.json`);
    translations[locale] = translation.default;
    return translation.default;
  } catch (error) {
    // Fallback do angielskiego - brak dostepnego tlumaczenia dla locale
    void error;
    return en;
  }
}

// Get translation synchronously (for already loaded translations)
export function getTranslation(locale: Locale): Translations {
  return translations[locale] || en;
}

// Helper to get nested translation values
export function getNestedTranslation(obj: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
  return typeof result === 'string' ? result : '';
}

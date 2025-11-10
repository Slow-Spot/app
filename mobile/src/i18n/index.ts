import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import pl from './locales/pl.json';
import es from './locales/es.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import hi from './locales/hi.json';

const resources = {
  en: { translation: en },
  pl: { translation: pl },
  es: { translation: es },
  de: { translation: de },
  fr: { translation: fr },
  hi: { translation: hi },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGE_STORAGE_KEY } from '../screens/SettingsScreen';

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

// Initialize with system language first
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

// Load saved language preference asynchronously
(async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && savedLanguage !== i18n.language) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error('Failed to load language preference:', error);
  }
})();

export default i18n;

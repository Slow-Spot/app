import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LANGUAGE_STORAGE_KEY = 'user_language_preference';
export const THEME_STORAGE_KEY = 'user_theme_preference';

export type ThemeMode = 'light' | 'dark' | 'system';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polski' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'hi', name: 'हिन्दी' },
];

interface SettingsScreenProps {
  isDark: boolean;
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ isDark, themeMode, onThemeChange }) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const styles = createStyles(isDark);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {t('settings.title')}
        </Text>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.language')}
          </Text>
          <View style={styles.languageButtons}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  i18n.language === lang.code && styles.languageButtonActive,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    i18n.language === lang.code && styles.languageButtonTextActive,
                  ]}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.theme')}
          </Text>
          <View style={styles.themeButtons}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                themeMode === 'light' && styles.themeButtonActive,
              ]}
              onPress={() => onThemeChange('light')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  themeMode === 'light' && styles.themeButtonTextActive,
                ]}
              >
                {t('settings.light') || 'Light'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                themeMode === 'dark' && styles.themeButtonActive,
              ]}
              onPress={() => onThemeChange('dark')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  themeMode === 'dark' && styles.themeButtonTextActive,
                ]}
              >
                {t('settings.dark') || 'Dark'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                themeMode === 'system' && styles.themeButtonActive,
              ]}
              onPress={() => onThemeChange('system')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  themeMode === 'system' && styles.themeButtonTextActive,
                ]}
              >
                {t('settings.system') || 'System'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.section, styles.aboutSection]}>
          <Text style={styles.sectionTitle}>
            {t('settings.about')}
          </Text>
          <View style={styles.aboutContainer}>
            <Text style={styles.appName}>
              {t('app.name')}
            </Text>
            <Text style={styles.appTagline}>
              {t('app.tagline')}
            </Text>
            <Text style={styles.appVersion}>
              Version 1.0.0
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    },
    container: {
      flex: 1,
      padding: 24,
      gap: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: '400',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      paddingTop: 16,
      marginBottom: 8,
    },
    section: {
      gap: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '500',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    languageButtons: {
      gap: 8,
    },
    languageButton: {
      padding: 16,
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      borderWidth: 1,
      borderColor: isDarkMode ? '#3A3A3C' : '#E5E5EA',
      borderRadius: 8,
      justifyContent: 'flex-start',
    },
    languageButtonActive: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
    },
    languageButtonText: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    languageButtonTextActive: {
      color: '#FFFFFF',
    },
    themeButtons: {
      gap: 8,
    },
    themeButton: {
      padding: 16,
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      borderWidth: 1,
      borderColor: isDarkMode ? '#3A3A3C' : '#E5E5EA',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    themeButtonActive: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
    },
    themeButtonText: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    themeButtonTextActive: {
      color: '#FFFFFF',
    },
    aboutSection: {
      marginTop: 24,
    },
    aboutContainer: {
      padding: 16,
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      gap: 8,
      borderWidth: 1,
      borderColor: isDarkMode ? '#3A3A3C' : '#E5E5EA',
      borderRadius: 8,
    },
    appName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    appTagline: {
      fontSize: 14,
      color: isDarkMode ? '#8E8E93' : '#8E8E93',
    },
    appVersion: {
      fontSize: 12,
      color: isDarkMode ? '#8E8E93' : '#8E8E93',
      marginTop: 8,
    },
  });

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LANGUAGE_STORAGE_KEY = 'user_language_preference';
export const THEME_STORAGE_KEY = 'user_theme_preference';

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
  onToggleDark: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ isDark, onToggleDark }) => {
  const { t, i18n } = useTranslation();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const styles = createStyles(isDarkMode);

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

        {/* Theme Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.theme')}
          </Text>
          <View style={styles.themeToggleContainer}>
            <Text style={styles.themeText}>
              {isDark ? t('settings.dark') : t('settings.light')}
            </Text>
            <Switch
              value={isDark}
              onValueChange={onToggleDark}
              trackColor={{ false: '#767577', true: '#0A84FF' }}
              thumbColor={isDark ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor="#3E3E3E"
            />
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
    themeToggleContainer: {
      flexDirection: 'row',
      padding: 16,
      backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      borderWidth: 1,
      borderColor: isDarkMode ? '#3A3A3C' : '#E5E5EA',
      borderRadius: 8,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    themeText: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
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

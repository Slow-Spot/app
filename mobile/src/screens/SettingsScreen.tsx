import { logger } from '../utils/logger';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import theme, { gradients } from '../theme';
import { exportAllData, clearAllData } from '../services/storage';
import { clearAllCustomSessions } from '../services/customSessionStorage';
import { clearProgress } from '../services/progressTracker';
import { clearAllQuoteHistory } from '../services/quoteHistory';

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
  onNavigateToProfile?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isDark,
  themeMode,
  onThemeChange,
  onNavigateToProfile
}) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    } catch (error) {
      logger.error('Failed to save language preference:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const payload = await exportAllData();
      await Share.share({ message: payload, title: 'Slow Spot backup (JSON)' });
    } catch (error) {
      logger.error('Failed to export data:', error);
      Alert.alert('Export failed', 'Could not export your data. Please try again.');
    }
  };

  const handleClearData = async () => {
    Alert.alert(
      t('settings.clearDataTitle', 'Clear local data?'),
      t('settings.clearDataBody', 'This removes your sessions, progress, reminders, and preferences from this device.'),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('common.confirm', 'Confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all([
                clearAllData(),
                clearAllCustomSessions(),
                clearProgress(),
                clearAllQuoteHistory(),
                AsyncStorage.removeItem('@wellbeing_assessments'),
                AsyncStorage.removeItem('@slow_spot_reminder_settings'),
                AsyncStorage.removeItem('@slow_spot_calendar_id'),
                AsyncStorage.removeItem('@custom_sessions'),
              ]);

              Alert.alert(
                t('settings.dataCleared', 'Local data cleared'),
                t('settings.dataClearedBody', 'You can rebuild your preferences and sessions anytime. No data leaves this device.')
              );
            } catch (error) {
              logger.error('Failed to clear data:', error);
              Alert.alert('Error', 'Could not clear all local data.');
            }
          },
        },
      ]
    );
  };

  return (
    <GradientBackground gradient={gradients.screen.home} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {t('settings.title')}
        </Text>

        {/* Profile Navigation */}
        {onNavigateToProfile && (
          <GradientCard gradient={gradients.card.lightCard} style={styles.section}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={onNavigateToProfile}
              accessibilityLabel={t('settings.viewProfile') || 'View Profile'}
              accessibilityRole="button"
            >
              <View style={styles.profileButtonContent}>
                <Ionicons
                  name="person-circle"
                  size={32}
                  color={theme.colors.accent.blue[600]}
                />
                <View style={styles.profileButtonText}>
                  <Text style={styles.profileButtonTitle}>
                    {t('settings.viewProfile') || 'View Profile'}
                  </Text>
                  <Text style={styles.profileButtonSubtitle}>
                    {t('settings.viewProfileDescription') || 'See your progress and statistics'}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={theme.colors.text.tertiary}
              />
            </TouchableOpacity>
          </GradientCard>
        )}

        {/* Language Selection */}
        <GradientCard gradient={gradients.card.lightCard} style={styles.section}>
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
        </GradientCard>

        {/* Theme Selection */}
        <GradientCard gradient={gradients.card.lightCard} style={styles.section}>
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
        </GradientCard>

        {/* Data & Privacy */}
        <GradientCard gradient={gradients.card.lightCard} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.dataPrivacy', 'Data & Privacy')}
          </Text>
          <Text style={styles.helperText}>
            {t(
              'settings.dataPrivacyDescription',
              'All data stays on this device. No cloud sync or analytics are used.'
            )}
          </Text>
          <View style={styles.dataButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.exportButton]}
              onPress={handleExportData}
              accessibilityRole="button"
            >
              <Text style={styles.actionButtonText}>
                {t('settings.exportData', 'Export data (JSON)')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={handleClearData}
              accessibilityRole="button"
            >
              <Text style={styles.actionButtonText}>
                {t('settings.clearData', 'Clear local data')}
              </Text>
            </TouchableOpacity>
          </View>
        </GradientCard>

        {/* About Section */}
        <GradientCard gradient={gradients.card.lightCard} style={styles.section}>
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
        </GradientCard>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.layout.screenPadding,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    color: theme.colors.text.primary,
    paddingTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  languageButtons: {
    gap: theme.spacing.sm,
  },
  languageButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'flex-start',
  },
  languageButtonActive: {
    backgroundColor: theme.colors.accent.blue[600],
    borderColor: theme.colors.accent.blue[600],
  },
  languageButtonText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeights.regular,
  },
  languageButtonTextActive: {
    color: theme.colors.neutral.white,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  helperText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: 20,
  },
  dataButtons: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  actionButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportButton: {
    backgroundColor: theme.colors.accent.blue[600],
  },
  dangerButton: {
    backgroundColor: '#d9534f',
  },
  actionButtonText: {
    color: theme.colors.neutral.white,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  themeButtons: {
    gap: theme.spacing.sm,
  },
  themeButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeButtonActive: {
    backgroundColor: theme.colors.accent.blue[600],
    borderColor: theme.colors.accent.blue[600],
  },
  themeButtonText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeights.regular,
  },
  themeButtonTextActive: {
    color: theme.colors.neutral.white,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  aboutContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.tertiary,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  appName: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
  },
  appTagline: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  appVersion: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.sm,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
  },
  profileButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  profileButtonText: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  profileButtonTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
  },
  profileButtonSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
});

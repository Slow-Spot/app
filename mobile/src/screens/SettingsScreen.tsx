/**
 * SettingsScreen
 *
 * Beautiful settings screen with consistent app styling.
 * Uses white cards with icon boxes and mint accents.
 */

import { logger } from '../utils/logger';
import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import { exportAllData, clearAllData } from '../services/storage';
import { clearAllCustomSessions } from '../services/customSessionStorage';
import { clearProgress } from '../services/progressTracker';
import { clearAllQuoteHistory } from '../services/quoteHistory';
import { userPreferences } from '../services/userPreferences';

export const LANGUAGE_STORAGE_KEY = 'user_language_preference';
export const THEME_STORAGE_KEY = 'user_theme_preference';

export type ThemeMode = 'light' | 'dark' | 'system';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

const THEME_OPTIONS = [
  { mode: 'light' as ThemeMode, icon: 'sunny' as const, labelKey: 'settings.light' },
  { mode: 'dark' as ThemeMode, icon: 'moon' as const, labelKey: 'settings.dark' },
  { mode: 'system' as ThemeMode, icon: 'phone-portrait' as const, labelKey: 'settings.system' },
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
  onNavigateToProfile,
}) => {
  const { t, i18n } = useTranslation();
  const [skipInstructions, setSkipInstructions] = useState(false);

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      const skip = await userPreferences.shouldSkipPreSessionInstructions();
      setSkipInstructions(skip);
    };
    loadPreferences();
  }, []);

  // Get theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    cardTitle: { color: colors.text.primary },
    cardDescription: { color: colors.text.secondary },
    cardShadow: isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
    iconBoxBg: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
    iconBoxBgBlue: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
    iconBoxBgRed: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
    optionBg: isDark ? colors.neutral.charcoal[200] : colors.neutral.lightGray[50],
    optionBorder: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[200],
    optionText: { color: colors.text.primary },
    optionSelectedBg: colors.accent.mint[500],
    optionSelectedText: { color: colors.neutral.white },
    switchTrackFalse: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[300],
    switchTrackTrue: colors.accent.mint[400],
    switchThumbFalse: isDark ? colors.neutral.gray[400] : colors.neutral.white,
    switchThumbTrue: colors.neutral.white,
  }), [colors, isDark]);

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    } catch (error) {
      logger.error('Failed to save language preference:', error);
    }
  };

  const handleSkipInstructionsChange = async (value: boolean) => {
    try {
      setSkipInstructions(value);
      await userPreferences.setSkipPreSessionInstructions(value);
    } catch (error) {
      logger.error('Failed to save skip instructions preference:', error);
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
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, dynamicStyles.title]}>
          {t('settings.title')}
        </Text>

        {/* Profile Card */}
        {onNavigateToProfile && (
          <GradientCard
            gradient={themeGradients.card.whiteCard}
            style={[styles.card, dynamicStyles.cardShadow]}
            onPress={onNavigateToProfile}
            isDark={isDark}
          >
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBgBlue }]}>
                <Ionicons name="person" size={24} color={colors.accent.blue[500]} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                  {t('settings.viewProfile', 'Zobacz Profil')}
                </Text>
                <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                  {t('settings.viewProfileDescription', 'Zobacz swój postęp i statystyki')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.text.tertiary} />
            </View>
          </GradientCard>
        )}

        {/* Language Selection Card */}
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
              <Ionicons name="globe" size={24} color={colors.accent.mint[500]} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.language', 'Język')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.languageDescription', 'Wybierz język aplikacji')}
              </Text>
            </View>
          </View>
          <View style={styles.optionsGrid}>
            {LANGUAGES.map((lang) => {
              const isSelected = i18n.language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: isSelected ? dynamicStyles.optionSelectedBg : dynamicStyles.optionBg,
                      borderColor: isSelected ? colors.accent.mint[500] : dynamicStyles.optionBorder,
                    },
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionFlag}>{lang.flag}</Text>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected ? dynamicStyles.optionSelectedText : dynamicStyles.optionText,
                    ]}
                  >
                    {lang.name}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color={colors.neutral.white} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </GradientCard>

        {/* Theme Selection Card */}
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
              <Ionicons name="color-palette" size={24} color={colors.accent.mint[500]} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.theme', 'Motyw')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.themeDescription', 'Dostosuj wygląd aplikacji')}
              </Text>
            </View>
          </View>
          <View style={styles.themeOptions}>
            {THEME_OPTIONS.map((option) => {
              const isSelected = themeMode === option.mode;
              return (
                <TouchableOpacity
                  key={option.mode}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: isSelected ? dynamicStyles.optionSelectedBg : dynamicStyles.optionBg,
                      borderColor: isSelected ? colors.accent.mint[500] : dynamicStyles.optionBorder,
                    },
                  ]}
                  onPress={() => onThemeChange(option.mode)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={isSelected ? colors.neutral.white : colors.text.secondary}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      isSelected ? dynamicStyles.optionSelectedText : dynamicStyles.optionText,
                    ]}
                  >
                    {t(option.labelKey, option.mode)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </GradientCard>

        {/* Meditation Preferences Card */}
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
              <Ionicons name="leaf" size={24} color={colors.accent.mint[500]} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.meditation', 'Medytacja')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.meditationDescription', 'Preferencje sesji medytacyjnych')}
              </Text>
            </View>
          </View>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[
                styles.switchRow,
                {
                  backgroundColor: dynamicStyles.optionBg,
                  borderColor: dynamicStyles.optionBorder,
                },
              ]}
              onPress={() => handleSkipInstructionsChange(!skipInstructions)}
              activeOpacity={0.8}
            >
              <View style={styles.switchContent}>
                <Ionicons
                  name="flash"
                  size={20}
                  color={skipInstructions ? colors.accent.mint[500] : colors.text.tertiary}
                />
                <View style={styles.switchTextContainer}>
                  <Text style={[styles.switchLabel, dynamicStyles.optionText]}>
                    {t('settings.skipInstructions', 'Pomijaj instrukcje')}
                  </Text>
                  <Text style={[styles.switchDescription, dynamicStyles.cardDescription]}>
                    {t('settings.skipInstructionsDescription', 'Dla doświadczonych medytujących')}
                  </Text>
                </View>
              </View>
              <Switch
                value={skipInstructions}
                onValueChange={handleSkipInstructionsChange}
                trackColor={{
                  false: dynamicStyles.switchTrackFalse,
                  true: dynamicStyles.switchTrackTrue,
                }}
                thumbColor={skipInstructions ? dynamicStyles.switchThumbTrue : dynamicStyles.switchThumbFalse}
                ios_backgroundColor={dynamicStyles.switchTrackFalse}
              />
            </TouchableOpacity>
          </View>
        </GradientCard>

        {/* Data & Privacy Card */}
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
              <Ionicons name="shield-checkmark" size={24} color={colors.accent.mint[500]} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.dataPrivacy', 'Dane i Prywatność')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.dataPrivacyDescription', 'Wszystkie dane pozostają na tym urządzeniu')}
              </Text>
            </View>
          </View>
          <View style={styles.dataButtons}>
            <TouchableOpacity
              style={[styles.dataButton, { backgroundColor: colors.accent.blue[500] }]}
              onPress={handleExportData}
              activeOpacity={0.8}
            >
              <Ionicons name="download" size={20} color={colors.neutral.white} />
              <Text style={styles.dataButtonText}>
                {t('settings.exportData', 'Eksportuj dane')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dataButton, styles.dangerButton]}
              onPress={handleClearData}
              activeOpacity={0.8}
            >
              <Ionicons name="trash" size={20} color={colors.neutral.white} />
              <Text style={styles.dataButtonText}>
                {t('settings.clearData', 'Wyczyść dane')}
              </Text>
            </TouchableOpacity>
          </View>
        </GradientCard>

        {/* About Card */}
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
              <Ionicons name="information-circle" size={24} color={colors.accent.mint[500]} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.about', 'O aplikacji')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('app.name')} • v1.0.0
              </Text>
            </View>
          </View>
          <View style={[styles.aboutContent, { backgroundColor: dynamicStyles.optionBg }]}>
            <Text style={[styles.aboutTagline, dynamicStyles.cardDescription]}>
              {t('app.tagline')}
            </Text>
            <View style={styles.aboutFeatures}>
              <View style={styles.aboutFeature}>
                <Ionicons name="checkmark-circle" size={16} color={colors.accent.mint[500]} />
                <Text style={[styles.aboutFeatureText, dynamicStyles.cardDescription]}>
                  {t('settings.featureOffline', 'Działa offline')}
                </Text>
              </View>
              <View style={styles.aboutFeature}>
                <Ionicons name="checkmark-circle" size={16} color={colors.accent.mint[500]} />
                <Text style={[styles.aboutFeatureText, dynamicStyles.cardDescription]}>
                  {t('settings.featurePrivacy', 'Bez reklam i śledzenia')}
                </Text>
              </View>
              <View style={styles.aboutFeature}>
                <Ionicons name="checkmark-circle" size={16} color={colors.accent.mint[500]} />
                <Text style={[styles.aboutFeatureText, dynamicStyles.cardDescription]}>
                  {t('settings.featureLocal', 'Dane na urządzeniu')}
                </Text>
              </View>
            </View>
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
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  card: {
    // padding handled by GradientCard
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.xs,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.xs,
  },
  // Language options
  optionsGrid: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    gap: theme.spacing.sm,
  },
  optionFlag: {
    fontSize: 20,
  },
  optionText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
  },
  // Theme options
  themeOptions: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    gap: theme.spacing.xs,
  },
  themeOptionText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: '600',
  },
  // Switch
  switchContainer: {
    marginTop: theme.spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
  },
  switchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.sm,
  },
  switchTextContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
  },
  switchDescription: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 2,
  },
  // Data buttons
  dataButtons: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  dataButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.xs,
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  dataButtonText: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
  },
  // About section
  aboutContent: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  aboutTagline: {
    fontSize: theme.typography.fontSizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  aboutFeatures: {
    gap: theme.spacing.sm,
  },
  aboutFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  aboutFeatureText: {
    fontSize: theme.typography.fontSizes.sm,
  },
});

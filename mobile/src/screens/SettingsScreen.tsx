/**
 * SettingsScreen
 *
 * Beautiful settings screen with consistent app styling.
 * Uses white cards with icon boxes and mint accents.
 */

import { logger } from '../utils/logger';
import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Linking,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Paths, Directory } from 'expo-file-system';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { screenElementAnimation } from '../utils/animations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import { AppModal, AppModalButton } from '../components/AppModal';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import Constants from 'expo-constants';
import { brandColors, primaryColor, featureColorPalettes, semanticColors, getFeatureIconColors } from '../theme/colors';
import { exportAllData, clearAllData, resetOnboarding } from '../services/storage';
import { clearAllSessions } from '../services/customSessionStorage';
import { clearProgress } from '../services/progressTracker';
import { clearAllQuoteHistory } from '../services/quoteHistory';
import { usePersonalization } from '../contexts/PersonalizationContext';

export const LANGUAGE_STORAGE_KEY = 'user_language_preference';
export const THEME_STORAGE_KEY = 'user_theme_preference';
export const CUSTOM_SOUNDS_STORAGE_KEY = '@slow_spot_custom_sounds';

export type ThemeMode = 'light' | 'dark' | 'system';

/** Custom sound configuration for user-selected audio files */
export interface CustomSoundsConfig {
  /** Custom bell/chime sound file URI */
  customBellUri?: string;
  customBellName?: string;
  /** Custom ambient sounds URIs */
  customAmbientUris: {
    nature?: { uri: string; name: string };
    ocean?: { uri: string; name: string };
    forest?: { uri: string; name: string };
    rain?: { uri: string; name: string };
    fire?: { uri: string; name: string };
    wind?: { uri: string; name: string };
    custom?: { uri: string; name: string };
  };
}

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

// Easter egg confetti colors
const CONFETTI_COLORS = [
  '#7C3AED', '#A855F7', '#C084FC', // purples
  '#3B82F6', '#60A5FA', '#93C5FD', // blues
  '#10B981', '#34D399', '#6EE7B7', // greens
  '#F59E0B', '#FBBF24', '#FCD34D', // ambers
  '#EC4899', '#F472B6', '#F9A8D4', // pinks
];

// Easter egg confetti particle component
const EasterEggConfetti = React.memo<{
  delay: number;
  color: string;
  startX: number;
}>(({ delay, color, startX }) => {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 50, {
        duration: 2500 + Math.random() * 1000,
        easing: Easing.out(Easing.quad),
      })
    );
    translateX.value = withDelay(
      delay,
      withTiming(startX + (Math.random() - 0.5) * 150, {
        duration: 2500,
        easing: Easing.inOut(Easing.ease),
      })
    );
    rotate.value = withDelay(
      delay,
      withTiming(Math.random() * 720 - 360, {
        duration: 2500,
        easing: Easing.linear,
      })
    );
    scale.value = withDelay(
      delay,
      withTiming(0.3, {
        duration: 2500,
        easing: Easing.out(Easing.quad),
      })
    );
    opacity.value = withDelay(
      delay + 1800,
      withTiming(0, { duration: 700 })
    );
  }, []);

  const particleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: 12,
          height: 12,
          borderRadius: 3,
          backgroundColor: color,
        },
        particleStyle,
      ]}
    />
  );
});

interface SettingsScreenProps {
  isDark: boolean;
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  onNavigateToProfile?: () => void;
  onNavigateToPersonalization?: () => void;
  onRestartOnboarding?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isDark,
  themeMode,
  onThemeChange,
  onNavigateToProfile,
  onNavigateToPersonalization,
  onRestartOnboarding,
}) => {
  const { t, i18n } = useTranslation();
  const {
    currentTheme,
    settings,
    systemSettings,
    effectiveAnimationsEnabled,
    effectiveFontScale,
    setHighContrastMode,
    setLargerTextMode,
    setFollowSystemReduceMotion,
    setFollowSystemFontSize,
  } = usePersonalization();

  // Modal states
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [showDataClearedModal, setShowDataClearedModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [showClearErrorModal, setShowClearErrorModal] = useState(false);

  // Easter egg state - tap 7 times on About section for confetti!
  const [easterEggTaps, setEasterEggTaps] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const easterEggTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const EASTER_EGG_TAPS_REQUIRED = 7;

  // Generate confetti particles when triggered
  const confettiParticles = useMemo(() => {
    if (!showConfetti) return [];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 300,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      startX: Math.random() * SCREEN_WIDTH,
    }));
  }, [showConfetti]);

  // Handle Easter egg tap
  const handleEasterEggTap = useCallback(() => {
    // Clear previous timeout
    if (easterEggTimeoutRef.current) {
      clearTimeout(easterEggTimeoutRef.current);
    }

    const newTaps = easterEggTaps + 1;
    setEasterEggTaps(newTaps);

    // Subtle haptic feedback for each tap
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (newTaps >= EASTER_EGG_TAPS_REQUIRED) {
      // Trigger confetti!
      setShowConfetti(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEasterEggTaps(0);

      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 3500);
    } else {
      // Reset taps after 2 seconds of inactivity
      easterEggTimeoutRef.current = setTimeout(() => {
        setEasterEggTaps(0);
      }, 2000);
    }
  }, [easterEggTaps]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (easterEggTimeoutRef.current) {
        clearTimeout(easterEggTimeoutRef.current);
      }
    };
  }, []);

  // Custom sounds state
  const [customSounds, setCustomSounds] = useState<CustomSoundsConfig>({
    customAmbientUris: {},
  });
  const [isLoadingSound, setIsLoadingSound] = useState(false);

  // Load custom sounds from storage on mount
  React.useEffect(() => {
    const loadCustomSounds = async () => {
      try {
        const data = await AsyncStorage.getItem(CUSTOM_SOUNDS_STORAGE_KEY);
        if (data) {
          setCustomSounds(JSON.parse(data));
        }
      } catch (error) {
        logger.error('Failed to load custom sounds:', error);
      }
    };
    loadCustomSounds();
  }, []);

  // Save custom sounds to storage
  const saveCustomSounds = async (newConfig: CustomSoundsConfig) => {
    try {
      await AsyncStorage.setItem(CUSTOM_SOUNDS_STORAGE_KEY, JSON.stringify(newConfig));
      setCustomSounds(newConfig);
    } catch (error) {
      logger.error('Failed to save custom sounds:', error);
    }
  };

  // Handle picking a custom sound file
  const handlePickSound = useCallback(async (type: 'bell' | 'ambient', ambientKey?: string) => {
    try {
      setIsLoadingSound(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) {
        setIsLoadingSound(false);
        return;
      }

      const asset = result.assets[0];

      // Copy file to permanent location using new expo-file-system API
      const soundsDir = new Directory(Paths.document, 'custom_sounds');
      await soundsDir.create();

      const fileName = `${type}_${ambientKey || 'bell'}_${Date.now()}.${asset.name.split('.').pop()}`;
      const destUri = `${soundsDir.uri}${fileName}`;

      // Copy from source to destination
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const reader = new FileReader();

      await new Promise<void>((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            // For simplicity, store the URI directly - expo-document-picker already copies to cache
            resolve();
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Update config - use the cached URI from DocumentPicker
      const newConfig = { ...customSounds };
      if (type === 'bell') {
        newConfig.customBellUri = asset.uri;
        newConfig.customBellName = asset.name;
      } else if (ambientKey) {
        newConfig.customAmbientUris = {
          ...newConfig.customAmbientUris,
          [ambientKey]: { uri: asset.uri, name: asset.name },
        };
      }

      await saveCustomSounds(newConfig);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      logger.error('Failed to pick sound:', error);
      Alert.alert(
        t('settings.soundPickError', 'Error'),
        t('settings.soundPickErrorBody', 'Could not load the selected audio file.')
      );
    } finally {
      setIsLoadingSound(false);
    }
  }, [customSounds, t]);

  // Handle removing a custom sound
  const handleRemoveSound = useCallback(async (type: 'bell' | 'ambient', ambientKey?: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const newConfig = { ...customSounds };

      if (type === 'bell') {
        newConfig.customBellUri = undefined;
        newConfig.customBellName = undefined;
      } else if (ambientKey) {
        newConfig.customAmbientUris = {
          ...newConfig.customAmbientUris,
          [ambientKey]: undefined,
        };
      }

      await saveCustomSounds(newConfig);
    } catch (error) {
      logger.error('Failed to remove sound:', error);
    }
  }, [customSounds]);

  // Get theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);
  const featureColors = useMemo(() => getFeatureIconColors(isDark), [isDark]);

  // Dynamic styles based on theme - using brand/primary colors for consistency
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
    // Icon box backgrounds - using feature color palettes for beautiful, consistent look
    iconBoxBgPurple: isDark ? `${currentTheme.primary}33` : `${currentTheme.primary}1A`,
    iconBoxBgBlue: isDark ? `rgba(${featureColorPalettes.indigo.rgb}, 0.2)` : `rgba(${featureColorPalettes.indigo.rgb}, 0.1)`,
    iconBoxBgRed: isDark ? `rgba(${featureColorPalettes.rose.rgb}, 0.2)` : `rgba(${featureColorPalettes.rose.rgb}, 0.1)`,
    iconBoxBgGreen: isDark ? `rgba(${featureColorPalettes.emerald.rgb}, 0.2)` : `rgba(${featureColorPalettes.emerald.rgb}, 0.1)`,
    iconBoxBgAmber: isDark ? `rgba(${featureColorPalettes.amber.rgb}, 0.2)` : `rgba(${featureColorPalettes.amber.rgb}, 0.1)`,
    iconBoxBgTeal: isDark ? `rgba(${featureColorPalettes.teal.rgb}, 0.2)` : `rgba(${featureColorPalettes.teal.rgb}, 0.1)`,
    // Option styling - using primary/brand colors
    optionBg: isDark ? colors.neutral.charcoal[200] : colors.neutral.lightGray[50],
    optionBorder: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[200],
    optionText: { color: colors.text.primary },
    optionSelectedBg: isDark ? `${currentTheme.primary}40` : `${currentTheme.primary}26`,
    optionSelectedBorder: isDark ? `${currentTheme.primary}66` : `${currentTheme.primary}4D`,
    optionSelectedText: { color: currentTheme.primary },
    // Icon colors for different sections
    iconPurple: isDark ? featureColorPalettes.violet.darkIcon : featureColorPalettes.violet.lightIcon,
    iconBlue: isDark ? featureColorPalettes.indigo.darkIcon : featureColorPalettes.indigo.lightIcon,
    iconGreen: isDark ? featureColorPalettes.emerald.darkIcon : featureColorPalettes.emerald.lightIcon,
    iconAmber: isDark ? featureColorPalettes.amber.darkIcon : featureColorPalettes.amber.lightIcon,
    iconTeal: isDark ? featureColorPalettes.teal.darkIcon : featureColorPalettes.teal.lightIcon,
    iconRose: isDark ? featureColorPalettes.rose.darkIcon : featureColorPalettes.rose.lightIcon,
    // For legal section
    iconBoxBg: isDark ? primaryColor.transparent[20] : primaryColor.transparent[10],
    chevronColor: isDark ? colors.neutral.gray[400] : colors.neutral.gray[500],
    // For scientific sources section
    iconBoxBgCyan: isDark ? `rgba(${featureColorPalettes.teal.rgb}, 0.25)` : `rgba(${featureColorPalettes.teal.rgb}, 0.12)`,
    iconCyan: isDark ? featureColorPalettes.teal.darkIcon : featureColorPalettes.teal.lightIcon,
  }), [colors, isDark, featureColors]);

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
      setShowExportErrorModal(true);
    }
  };

  const handleClearData = () => {
    setShowClearDataModal(true);
  };

  const confirmClearData = async () => {
    try {
      await Promise.all([
        clearAllData(),
        clearAllSessions(),
        clearProgress(),
        clearAllQuoteHistory(),
        AsyncStorage.removeItem('@wellbeing_assessments'),
        AsyncStorage.removeItem('@slow_spot_reminder_settings'),
        AsyncStorage.removeItem('@slow_spot_calendar_id'),
        AsyncStorage.removeItem('@custom_sessions'),
      ]);
      setShowDataClearedModal(true);
    } catch (error) {
      logger.error('Failed to clear data:', error);
      setShowClearErrorModal(true);
    }
  };

  const handleRestartOnboarding = () => {
    setShowOnboardingModal(true);
  };

  const confirmRestartOnboarding = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await resetOnboarding();
      // Call the callback to show onboarding immediately
      onRestartOnboarding?.();
    } catch (error) {
      logger.error('Failed to restart onboarding:', error);
    }
  };

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text
          entering={effectiveAnimationsEnabled ? screenElementAnimation(0) : undefined}
          style={[styles.title, dynamicStyles.title]}
        >
          {t('settings.title')}
        </Animated.Text>

        {/* Profile Card */}
        {onNavigateToProfile && (
          <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(1) : undefined}>
          <GradientCard
            gradient={themeGradients.card.whiteCard}
            style={[styles.card, dynamicStyles.cardShadow]}
            onPress={onNavigateToProfile}
            isDark={isDark}
          >
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
                <Ionicons name="person" size={24} color={currentTheme.primary} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                  {t('settings.viewProfile', 'View Profile')}
                </Text>
                <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                  {t('settings.viewProfileDescription', 'View your progress and statistics')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.text.tertiary} />
            </View>
          </GradientCard>
          </Animated.View>
        )}

        {/* Personalization Card */}
        {onNavigateToPersonalization && (
          <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(2) : undefined}>
          <GradientCard
            gradient={themeGradients.card.whiteCard}
            style={[styles.card, dynamicStyles.cardShadow]}
            onPress={onNavigateToPersonalization}
            isDark={isDark}
          >
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
                <Ionicons name="color-wand" size={24} color={currentTheme.primary} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                  {t('settings.personalization', 'Personalization')}
                </Text>
                <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                  {t('settings.personalizationDescription', 'Customize app colors')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.text.tertiary} />
            </View>
          </GradientCard>
          </Animated.View>
        )}

        {/* Custom Sounds Card */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(3) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="musical-notes" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.customSounds', 'Custom Sounds')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.customSoundsDescription', 'Use your own audio files')}
              </Text>
            </View>
          </View>
          <View style={styles.customSoundsSection}>
            {/* Custom Bell Sound */}
            <View style={[styles.soundItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={styles.soundItemInfo}>
                <Ionicons name="notifications" size={20} color={currentTheme.primary} />
                <View style={styles.soundItemText}>
                  <Text style={[styles.soundItemTitle, dynamicStyles.cardTitle]}>
                    {t('settings.customBell', 'Session Bell')}
                  </Text>
                  <Text style={[styles.soundItemDesc, dynamicStyles.cardDescription]} numberOfLines={1}>
                    {customSounds.customBellName || t('settings.defaultSound', 'Default')}
                  </Text>
                </View>
              </View>
              <View style={styles.soundItemActions}>
                {customSounds.customBellUri && (
                  <TouchableOpacity
                    onPress={() => handleRemoveSound('bell')}
                    style={styles.soundActionButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={22} color={semanticColors.error.default} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handlePickSound('bell')}
                  style={[styles.soundPickButton, { backgroundColor: `${currentTheme.primary}20` }]}
                  disabled={isLoadingSound}
                >
                  <Ionicons name="folder-open" size={18} color={currentTheme.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Custom Ambient Sound */}
            <View style={[styles.soundItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={styles.soundItemInfo}>
                <Ionicons name="musical-note" size={20} color={currentTheme.primary} />
                <View style={styles.soundItemText}>
                  <Text style={[styles.soundItemTitle, dynamicStyles.cardTitle]}>
                    {t('settings.customAmbient', 'Custom Ambient')}
                  </Text>
                  <Text style={[styles.soundItemDesc, dynamicStyles.cardDescription]} numberOfLines={1}>
                    {customSounds.customAmbientUris.custom?.name || t('settings.notSet', 'Not set')}
                  </Text>
                </View>
              </View>
              <View style={styles.soundItemActions}>
                {customSounds.customAmbientUris.custom && (
                  <TouchableOpacity
                    onPress={() => handleRemoveSound('ambient', 'custom')}
                    style={styles.soundActionButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={22} color={semanticColors.error.default} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handlePickSound('ambient', 'custom')}
                  style={[styles.soundPickButton, { backgroundColor: `${currentTheme.primary}20` }]}
                  disabled={isLoadingSound}
                >
                  <Ionicons name="folder-open" size={18} color={currentTheme.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.soundHintText, dynamicStyles.cardDescription]}>
              {t('settings.customSoundsHint', 'Select audio files from your device. Supported formats: MP3, WAV, M4A.')}
            </Text>
          </View>
        </GradientCard>
        </Animated.View>

        {/* Language Selection Card */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(4) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="globe" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.language', 'Language')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.languageDescription', 'Choose app language')}
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
                      borderColor: isSelected ? dynamicStyles.optionSelectedBorder : dynamicStyles.optionBorder,
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
                    <Ionicons name="checkmark-circle" size={18} color={currentTheme.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </GradientCard>
        </Animated.View>

        {/* Theme Selection Card */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(5) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="color-palette" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.theme', 'Theme')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.themeDescription', 'Customize app appearance')}
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
                      borderColor: isSelected ? dynamicStyles.optionSelectedBorder : dynamicStyles.optionBorder,
                    },
                  ]}
                  onPress={() => onThemeChange(option.mode)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={isSelected ? currentTheme.primary : colors.text.secondary}
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
        </Animated.View>

        {/* Accessibility Card */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(6) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="accessibility" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.accessibility')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.accessibilityDescription')}
              </Text>
            </View>
          </View>
          <View style={styles.accessibilityOptions}>
            {/* Follow System Reduce Motion */}
            <View style={[styles.accessibilityOption, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={styles.accessibilityOptionContent}>
                <Ionicons name="flash-off" size={20} color={currentTheme.primary} />
                <View style={styles.accessibilityOptionText}>
                  <Text style={[styles.accessibilityOptionTitle, dynamicStyles.cardTitle]}>
                    {t('settings.followSystemReduceMotion', 'Follow System Reduce Motion')}
                  </Text>
                  <Text style={[styles.accessibilityOptionDesc, dynamicStyles.cardDescription]}>
                    {t('settings.followSystemReduceMotionDescription', 'Respect device accessibility setting for reduced motion')}
                    {systemSettings.reduceMotionEnabled && (
                      <Text style={{ color: currentTheme.primary, fontWeight: '600' }}>
                        {' '}({t('settings.systemEnabled', 'System: ON')})
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.followSystemReduceMotion}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFollowSystemReduceMotion(value);
                }}
                trackColor={{ false: colors.neutral.gray[300], true: `${currentTheme.primary}80` }}
                thumbColor={settings.followSystemReduceMotion ? currentTheme.primary : colors.neutral.white}
              />
            </View>
            {/* Follow System Font Size */}
            <View style={[styles.accessibilityOption, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={styles.accessibilityOptionContent}>
                <Ionicons name="resize" size={20} color={currentTheme.primary} />
                <View style={styles.accessibilityOptionText}>
                  <Text style={[styles.accessibilityOptionTitle, dynamicStyles.cardTitle]}>
                    {t('settings.followSystemFontSize', 'Follow System Font Size')}
                  </Text>
                  <Text style={[styles.accessibilityOptionDesc, dynamicStyles.cardDescription]}>
                    {t('settings.followSystemFontSizeDescription', 'Scale text according to device settings')}
                    {systemSettings.systemFontScale !== 1 && (
                      <Text style={{ color: currentTheme.primary, fontWeight: '600' }}>
                        {' '}({t('settings.systemScale', 'Scale')}: {(systemSettings.systemFontScale * 100).toFixed(0)}%)
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.followSystemFontSize}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFollowSystemFontSize(value);
                }}
                trackColor={{ false: colors.neutral.gray[300], true: `${currentTheme.primary}80` }}
                thumbColor={settings.followSystemFontSize ? currentTheme.primary : colors.neutral.white}
              />
            </View>
            {/* High Contrast Mode */}
            <View style={[styles.accessibilityOption, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={styles.accessibilityOptionContent}>
                <Ionicons name="contrast" size={20} color={currentTheme.primary} />
                <View style={styles.accessibilityOptionText}>
                  <Text style={[styles.accessibilityOptionTitle, dynamicStyles.cardTitle]}>
                    {t('settings.highContrastMode')}
                  </Text>
                  <Text style={[styles.accessibilityOptionDesc, dynamicStyles.cardDescription]}>
                    {t('settings.highContrastModeDescription')}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.highContrastMode}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setHighContrastMode(value);
                }}
                trackColor={{ false: colors.neutral.gray[300], true: `${currentTheme.primary}80` }}
                thumbColor={settings.highContrastMode ? currentTheme.primary : colors.neutral.white}
              />
            </View>
            {/* Larger Text Mode */}
            <View style={[styles.accessibilityOption, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={styles.accessibilityOptionContent}>
                <Ionicons name="text" size={20} color={currentTheme.primary} />
                <View style={styles.accessibilityOptionText}>
                  <Text style={[styles.accessibilityOptionTitle, dynamicStyles.cardTitle]}>
                    {t('settings.largerTextMode')}
                  </Text>
                  <Text style={[styles.accessibilityOptionDesc, dynamicStyles.cardDescription]}>
                    {t('settings.largerTextModeDescription')}
                    {effectiveFontScale !== 1 && (
                      <Text style={{ color: currentTheme.primary, fontWeight: '600' }}>
                        {' '}({t('settings.effectiveScale', 'Effective')}: {(effectiveFontScale * 100).toFixed(0)}%)
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.largerTextMode}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setLargerTextMode(value);
                }}
                trackColor={{ false: colors.neutral.gray[300], true: `${currentTheme.primary}80` }}
                thumbColor={settings.largerTextMode ? currentTheme.primary : colors.neutral.white}
              />
            </View>
          </View>
        </GradientCard>
        </Animated.View>

        {/* System Info Card */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(7) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="phone-portrait" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.systemInfo', 'System Information')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.systemInfoDescription', 'Detected device settings')}
              </Text>
            </View>
          </View>
          <View style={styles.systemInfoGrid}>
            <View style={[styles.systemInfoItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={[styles.systemInfoIconBox, { backgroundColor: `${currentTheme.primary}15` }]}>
                <Ionicons name="time-outline" size={20} color={currentTheme.primary} />
              </View>
              <View style={styles.systemInfoText}>
                <Text style={[styles.systemInfoLabel, dynamicStyles.cardDescription]}>
                  {t('settings.timezone', 'Timezone')}
                </Text>
                <Text style={[styles.systemInfoValue, dynamicStyles.cardTitle]}>
                  {systemSettings.timezoneAbbreviation}
                </Text>
              </View>
            </View>
            <View style={[styles.systemInfoItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={[styles.systemInfoIconBox, { backgroundColor: `${currentTheme.primary}15` }]}>
                <Ionicons name="globe-outline" size={20} color={currentTheme.primary} />
              </View>
              <View style={styles.systemInfoText}>
                <Text style={[styles.systemInfoLabel, dynamicStyles.cardDescription]}>
                  {t('settings.region', 'Region')}
                </Text>
                <Text style={[styles.systemInfoValue, dynamicStyles.cardTitle]}>
                  {systemSettings.regionCode || systemSettings.languageCode.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={[styles.systemInfoItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={[styles.systemInfoIconBox, { backgroundColor: `${currentTheme.primary}15` }]}>
                <Ionicons name="thermometer-outline" size={20} color={currentTheme.primary} />
              </View>
              <View style={styles.systemInfoText}>
                <Text style={[styles.systemInfoLabel, dynamicStyles.cardDescription]}>
                  {t('settings.temperatureUnit', 'Temperature')}
                </Text>
                <Text style={[styles.systemInfoValue, dynamicStyles.cardTitle]}>
                  {systemSettings.temperatureUnit === 'celsius' ? '°C' : '°F'}
                </Text>
              </View>
            </View>
            <View style={[styles.systemInfoItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={[styles.systemInfoIconBox, { backgroundColor: `${currentTheme.primary}15` }]}>
                <Ionicons name="resize-outline" size={20} color={currentTheme.primary} />
              </View>
              <View style={styles.systemInfoText}>
                <Text style={[styles.systemInfoLabel, dynamicStyles.cardDescription]}>
                  {t('settings.measurementSystem', 'Units')}
                </Text>
                <Text style={[styles.systemInfoValue, dynamicStyles.cardTitle]}>
                  {systemSettings.measurementSystem === 'metric' ? t('settings.metric', 'Metric') : t('settings.imperial', 'Imperial')}
                </Text>
              </View>
            </View>
            <View style={[styles.systemInfoItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={[styles.systemInfoIconBox, { backgroundColor: `${currentTheme.primary}15` }]}>
                <Ionicons name="alarm-outline" size={20} color={currentTheme.primary} />
              </View>
              <View style={styles.systemInfoText}>
                <Text style={[styles.systemInfoLabel, dynamicStyles.cardDescription]}>
                  {t('settings.timeFormat', 'Time Format')}
                </Text>
                <Text style={[styles.systemInfoValue, dynamicStyles.cardTitle]}>
                  {systemSettings.uses24HourClock ? '24h' : '12h'}
                </Text>
              </View>
            </View>
            {systemSettings.isRTL && (
              <View style={[styles.systemInfoItem, { backgroundColor: dynamicStyles.optionBg }]}>
                <View style={[styles.systemInfoIconBox, { backgroundColor: `${currentTheme.primary}15` }]}>
                  <Ionicons name="swap-horizontal-outline" size={20} color={currentTheme.primary} />
                </View>
                <View style={styles.systemInfoText}>
                  <Text style={[styles.systemInfoLabel, dynamicStyles.cardDescription]}>
                    {t('settings.textDirection', 'Text Direction')}
                  </Text>
                  <Text style={[styles.systemInfoValue, dynamicStyles.cardTitle]}>
                    RTL
                  </Text>
                </View>
              </View>
            )}
          </View>
        </GradientCard>
        </Animated.View>

        {/* Data & Privacy Card */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(8) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="shield-checkmark" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.dataPrivacy', 'Data & Privacy')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.dataPrivacyDescription', 'All data stays on this device')}
              </Text>
            </View>
          </View>
          <View style={styles.dataButtons}>
            <TouchableOpacity
              style={[styles.dataButton, { backgroundColor: `${currentTheme.primary}15` }]}
              onPress={handleExportData}
              activeOpacity={0.7}
            >
              <Ionicons name="download" size={20} color={currentTheme.primary} />
              <Text style={[styles.dataButtonText, { color: currentTheme.primary }]}>
                {t('settings.exportData', 'Export data')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dataButton, { backgroundColor: `${semanticColors.error.default}12` }]}
              onPress={handleClearData}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={20} color={semanticColors.error.default} />
              <Text style={[styles.dataButtonText, { color: semanticColors.error.default }]}>
                {t('settings.clearData', 'Clear data')}
              </Text>
            </TouchableOpacity>
          </View>
        </GradientCard>
        </Animated.View>

        {/* Legal & Support Card - Required for App Store / Google Play */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(9) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
              <Ionicons name="document-text" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.legalTitle', 'Legal information')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('settings.legalDescription', 'Terms, privacy policy and support')}
              </Text>
            </View>
          </View>
          <View style={styles.legalLinks}>
            <TouchableOpacity
              style={[styles.legalLink, { backgroundColor: dynamicStyles.optionBg }]}
              onPress={() => {
                const locale = i18n.language === 'pl' ? 'pl' : 'en';
                Linking.openURL(`https://slowspot.me/${locale}/privacy`);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.legalLinkContent}>
                <Ionicons name="shield-checkmark" size={20} color={currentTheme.primary} />
                <Text style={[styles.legalLinkText, dynamicStyles.cardTitle]}>
                  {t('settings.privacyPolicy', 'Privacy policy')}
                </Text>
              </View>
              <Ionicons name="open-outline" size={18} color={dynamicStyles.chevronColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.legalLink, { backgroundColor: dynamicStyles.optionBg }]}
              onPress={() => {
                const locale = i18n.language === 'pl' ? 'pl' : 'en';
                Linking.openURL(`https://slowspot.me/${locale}/terms`);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.legalLinkContent}>
                <Ionicons name="document" size={20} color={currentTheme.primary} />
                <Text style={[styles.legalLinkText, dynamicStyles.cardTitle]}>
                  {t('settings.termsOfService', 'Terms of Service')}
                </Text>
              </View>
              <Ionicons name="open-outline" size={18} color={dynamicStyles.chevronColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.legalLink, { backgroundColor: dynamicStyles.optionBg }]}
              onPress={() => {
                const locale = i18n.language === 'pl' ? 'pl' : 'en';
                Linking.openURL(`https://slowspot.me/${locale}/support`);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.legalLinkContent}>
                <Ionicons name="help-circle" size={20} color={currentTheme.primary} />
                <Text style={[styles.legalLinkText, dynamicStyles.cardTitle]}>
                  {t('settings.support', 'Support')}
                </Text>
              </View>
              <Ionicons name="open-outline" size={18} color={dynamicStyles.chevronColor} />
            </TouchableOpacity>
          </View>
        </GradientCard>
        </Animated.View>

        {/* About Card - At the very bottom */}
        <Animated.View entering={effectiveAnimationsEnabled ? screenElementAnimation(10) : undefined}>
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          {/* Easter egg: tap 7 times for confetti! */}
          <TouchableOpacity
            onPress={handleEasterEggTap}
            activeOpacity={1}
            style={styles.cardRow}
          >
            <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
              <Ionicons name="information-circle" size={24} color={currentTheme.primary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {t('settings.about', 'About the app')}
              </Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                {t('app.name')} • v{Constants.expoConfig?.version || '1.0.0'}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.aboutContent, { backgroundColor: dynamicStyles.optionBg }]}>
            <Text style={[styles.aboutTagline, dynamicStyles.cardDescription]}>
              {t('app.tagline')}
            </Text>
            <View style={styles.aboutFeatures}>
              <View style={styles.aboutFeature}>
                <Ionicons name="checkmark-circle" size={16} color={currentTheme.primary} />
                <Text style={[styles.aboutFeatureText, dynamicStyles.cardDescription]}>
                  {t('settings.featureOffline', 'Works offline')}
                </Text>
              </View>
              <View style={styles.aboutFeature}>
                <Ionicons name="checkmark-circle" size={16} color={currentTheme.primary} />
                <Text style={[styles.aboutFeatureText, dynamicStyles.cardDescription]}>
                  {t('settings.featurePrivacy', 'No ads or tracking')}
                </Text>
              </View>
              <View style={styles.aboutFeature}>
                <Ionicons name="checkmark-circle" size={16} color={currentTheme.primary} />
                <Text style={[styles.aboutFeatureText, dynamicStyles.cardDescription]}>
                  {t('settings.featureLocal', 'Data on device')}
                </Text>
              </View>
            </View>
          </View>
          {/* Restart Onboarding button */}
          <TouchableOpacity
            style={[styles.restartOnboardingButton, { backgroundColor: dynamicStyles.optionBg }]}
            onPress={handleRestartOnboarding}
            activeOpacity={0.7}
          >
            <View style={styles.legalLinkContent}>
              <Ionicons name="refresh" size={20} color={currentTheme.primary} />
              <Text style={[styles.legalLinkText, dynamicStyles.cardTitle]}>
                {t('settings.restartOnboarding', 'Restart onboarding')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={dynamicStyles.chevronColor} />
          </TouchableOpacity>
        </GradientCard>
        </Animated.View>
      </ScrollView>

      {/* Restart Onboarding Modal */}
      <AppModal
        visible={showOnboardingModal}
        title={t('settings.restartOnboardingTitle', 'Restart onboarding?')}
        message={t('settings.restartOnboardingBody', 'You will see the welcome screen again.')}
        icon="refresh"
        buttons={[
          { text: t('common.cancel', 'Cancel'), style: 'cancel' },
          { text: t('common.confirm', 'Confirm'), onPress: confirmRestartOnboarding },
        ]}
        onDismiss={() => setShowOnboardingModal(false)}
      />

      {/* Clear Data Confirmation Modal */}
      <AppModal
        visible={showClearDataModal}
        title={t('settings.clearDataTitle', 'Clear local data?')}
        message={t('settings.clearDataBody', 'This will remove all sessions, progress, reminders and preferences from this device.')}
        icon="trash"
        iconColor={semanticColors.error.default}
        buttons={[
          { text: t('common.cancel', 'Cancel'), style: 'cancel' },
          { text: t('common.confirm', 'Confirm'), style: 'destructive', onPress: confirmClearData },
        ]}
        onDismiss={() => setShowClearDataModal(false)}
      />

      {/* Data Cleared Success Modal */}
      <AppModal
        visible={showDataClearedModal}
        title={t('settings.dataCleared', 'Local data cleared')}
        message={t('settings.dataClearedBody', 'You can rebuild your preferences and sessions at any time. No data has left this device.')}
        icon="checkmark-circle"
        buttons={[{ text: 'OK' }]}
        onDismiss={() => setShowDataClearedModal(false)}
      />

      {/* Export Error Modal */}
      <AppModal
        visible={showExportErrorModal}
        title={t('settings.exportFailed', 'Export failed')}
        message={t('settings.exportFailedBody', 'Unable to export data. Please try again.')}
        icon="warning"
        iconColor={semanticColors.error.default}
        buttons={[{ text: 'OK' }]}
        onDismiss={() => setShowExportErrorModal(false)}
      />

      {/* Clear Error Modal */}
      <AppModal
        visible={showClearErrorModal}
        title={t('settings.clearError', 'Error')}
        message={t('settings.clearErrorBody', 'Unable to clear all local data.')}
        icon="warning"
        iconColor={semanticColors.error.default}
        buttons={[{ text: 'OK' }]}
        onDismiss={() => setShowClearErrorModal(false)}
      />

      {/* Easter egg confetti overlay */}
      {showConfetti && (
        <View style={styles.confettiContainer} pointerEvents="none">
          {confettiParticles.map((particle) => (
            <EasterEggConfetti
              key={particle.id}
              delay={particle.delay}
              color={particle.color}
              startX={particle.startX}
            />
          ))}
        </View>
      )}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    overflow: 'hidden',
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
    backgroundColor: semanticColors.error.default,
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
  // Legal links section
  legalLinks: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  legalLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  legalLinkText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '500',
  },
  // Restart onboarding button
  restartOnboardingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
  },
  // Scientific sources section
  scienceIntro: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  scienceIntroText: {
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  sourcesList: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  sourceItem: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  sourceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  sourceIcon: {
    marginTop: 2,
  },
  sourceTitleContainer: {
    flex: 1,
  },
  sourceTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.normal * theme.typography.fontSizes.sm,
  },
  sourceAuthors: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 4,
  },
  sourceContent: {
    marginTop: 2,
    marginLeft: 26,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  sourceDescription: {
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
  },
  // Accessibility options section
  accessibilityOptions: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  accessibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  accessibilityOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.sm,
  },
  accessibilityOptionText: {
    flex: 1,
  },
  accessibilityOptionTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '500',
  },
  accessibilityOptionDesc: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 2,
  },
  // System Info section
  systemInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  systemInfoItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  systemInfoIconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  systemInfoText: {
    flex: 1,
    gap: 2,
  },
  systemInfoLabel: {
    fontSize: theme.typography.fontSizes.xs,
    opacity: 0.7,
  },
  systemInfoValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
  },
  // Custom sounds section
  customSoundsSection: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  soundItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.sm,
  },
  soundItemText: {
    flex: 1,
  },
  soundItemTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '500',
  },
  soundItemDesc: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 2,
  },
  soundItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  soundActionButton: {
    padding: 2,
  },
  soundPickButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  soundHintText: {
    fontSize: theme.typography.fontSizes.xs,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
});

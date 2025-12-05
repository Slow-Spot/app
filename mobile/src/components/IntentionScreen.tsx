// ══════════════════════════════════════════════════════════════
// Intention Screen Component
// Simple, elegant pre-meditation intention setting screen
// With optional breathing exercise modal
// ══════════════════════════════════════════════════════════════

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { GradientBackground } from './GradientBackground';
import { GradientButton } from './GradientButton';
import { GradientCard } from './GradientCard';
import { MeditationIntroGuide } from './MeditationIntroGuide';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import { brandColors, backgrounds } from '../theme/colors';
import { userPreferences } from '../services/userPreferences';
import { usePersonalization } from '../contexts/PersonalizationContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface IntentionScreenProps {
  onBegin: (intention: string) => void;
  isDark?: boolean;
  sessionName?: string;
}

// ══════════════════════════════════════════════════════════════
// Animated Breathing Circle Component
// ══════════════════════════════════════════════════════════════

interface AnimatedBreathingCircleProps {
  isRunning: boolean;
  pattern: 'box' | '4-7-8' | 'equal' | 'calm';
  isDark?: boolean;
  hapticEnabled?: boolean;
}

const AnimatedBreathingCircle: React.FC<AnimatedBreathingCircleProps> = ({
  isRunning,
  pattern,
  isDark,
  hapticEnabled = true,
}) => {
  const { t } = useTranslation();
  const { currentTheme, settings } = usePersonalization();

  // Use component prop or fall back to global settings
  const isHapticEnabled = hapticEnabled && settings.hapticEnabled;
  const scale = useSharedValue(1);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const lastPhaseRef = useRef<string>('');

  // Haptic feedback for breathing phase transitions
  const triggerBreathingHaptic = (phase: string) => {
    if (!isHapticEnabled) return;

    // Only trigger if phase actually changed
    if (phase === lastPhaseRef.current) return;
    lastPhaseRef.current = phase;

    switch (phase) {
      case 'inhale':
        // Gentle rising haptic for inhale
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'hold':
      case 'rest':
        // Soft haptic for hold phases
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        break;
      case 'exhale':
        // Medium haptic for exhale
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
    }
  };

  useEffect(() => {
    if (isRunning) {
      const patternConfig = {
        'box': {
          phases: ['inhale', 'hold', 'exhale', 'rest'] as const,
          durations: [4000, 4000, 4000, 4000],
        },
        '4-7-8': {
          phases: ['inhale', 'hold', 'exhale'] as const,
          durations: [4000, 7000, 8000],
        },
        'equal': {
          phases: ['inhale', 'exhale'] as const,
          durations: [4000, 4000],
        },
        'calm': {
          phases: ['inhale', 'exhale'] as const,
          durations: [2000, 2000], // Fast breathing for energy
        },
      };

      const config = patternConfig[pattern] || patternConfig['equal'];

      let phaseIndex = 0;
      let timeoutId: NodeJS.Timeout;

      const animatePhase = (phase: typeof config.phases[number], duration: number) => {
        if (phase === 'inhale') {
          scale.value = withTiming(1.5, { duration, easing: Easing.inOut(Easing.ease) });
        } else if (phase === 'exhale') {
          scale.value = withTiming(1, { duration, easing: Easing.inOut(Easing.ease) });
        }
      };

      const scheduleNextPhase = () => {
        const currentPhase = config.phases[phaseIndex];
        const currentPhaseDuration = config.durations[phaseIndex];

        setBreathingPhase(currentPhase);
        triggerBreathingHaptic(currentPhase);
        animatePhase(currentPhase, currentPhaseDuration);

        timeoutId = setTimeout(() => {
          phaseIndex = (phaseIndex + 1) % config.phases.length;
          scheduleNextPhase();
        }, currentPhaseDuration);
      };

      scheduleNextPhase();

      return () => clearTimeout(timeoutId);
    } else {
      scale.value = withTiming(1, { duration: 500 });
      setBreathingPhase('inhale');
      lastPhaseRef.current = '';
    }
  }, [isRunning, pattern, isHapticEnabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getPhaseText = () => {
    switch (breathingPhase) {
      case 'inhale':
        return t('intention.breathing.inhale', 'Inhale');
      case 'hold':
        return t('intention.breathing.hold', 'Hold');
      case 'exhale':
        return t('intention.breathing.exhale', 'Exhale');
      case 'rest':
        return t('intention.breathing.hold', 'Hold');
      default:
        return t('intention.breathing.breathe', 'Breathe');
    }
  };

  return (
    <View style={breathingStyles.breathingContainer}>
      <Reanimated.View style={[breathingStyles.breathingCircleWrapper, animatedStyle]}>
        <View style={[
          breathingStyles.breathingCircle,
          { borderColor: currentTheme.primary }
        ]} />
      </Reanimated.View>
      {isRunning && (
        <Text style={[
          breathingStyles.breathingText,
          { color: currentTheme.primary }
        ]}>
          {getPhaseText()}
        </Text>
      )}
    </View>
  );
};

const breathingStyles = StyleSheet.create({
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginVertical: theme.spacing.lg,
  },
  breathingCircleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 3,
  },
  breathingText: {
    position: 'absolute',
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
});

// ══════════════════════════════════════════════════════════════
// Main IntentionScreen Component
// ══════════════════════════════════════════════════════════════

export const IntentionScreen: React.FC<IntentionScreenProps> = ({
  onBegin,
  isDark = false,
  sessionName,
}) => {
  const { t } = useTranslation();
  const { currentTheme } = usePersonalization();
  const [intention, setIntention] = useState('');
  const [skipForever, setSkipForever] = useState(false);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingTime, setBreathingTime] = useState(60); // 1 minute default
  const [selectedPattern, setSelectedPattern] = useState<'box' | '4-7-8' | 'equal' | 'calm'>('box');
  const [showIntroGuideModal, setShowIntroGuideModal] = useState(false);

  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    subtitle: { color: colors.text.secondary },
    inputLabel: { color: colors.text.secondary },
    textInput: {
      borderColor: isDark ? colors.neutral.charcoal[100] : theme.colors.border.default,
      color: colors.text.primary,
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    },
    cardBg: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
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
    iconBoxBg: isDark ? `${currentTheme.primary}40` : `${currentTheme.primary}26`,
    checkboxColor: currentTheme.primary,
    skipText: { color: colors.text.secondary },
    modalBg: isDark ? colors.neutral.charcoal[300] : colors.neutral.white,
  }), [colors, isDark, currentTheme]);

  // Breathing timer
  useEffect(() => {
    if (!breathingActive) return;

    const interval = setInterval(() => {
      setBreathingTime((prev) => {
        if (prev <= 1) {
          setBreathingActive(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingActive]);

  const handleBegin = async () => {
    if (skipForever) {
      await userPreferences.setSkipIntentionScreen(true);
    }
    onBegin(intention.trim());
  };

  const handleSkipPress = async () => {
    if (skipForever) {
      await userPreferences.setSkipIntentionScreen(true);
    }
    onBegin('');
  };

  const handleOpenBreathing = () => {
    setShowBreathingModal(true);
    setBreathingTime(60);
    setBreathingActive(false);
  };

  const handleCloseBreathing = () => {
    setShowBreathingModal(false);
    setBreathingActive(false);
    setBreathingTime(60);
  };

  const handleStartBreathing = () => {
    setBreathingActive(true);
  };

  const handleStopBreathing = () => {
    setBreathingActive(false);
    setBreathingTime(60);
  };

  // Get time-based greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    // Debug: Log the hour to verify timezone
    console.log('[IntentionScreen] Current hour:', hour, 'Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);

    if (hour >= 5 && hour < 12) return t('intention.greeting.morning', 'Good Morning');
    if (hour >= 12 && hour < 17) return t('intention.greeting.afternoon', 'Good Afternoon');
    if (hour >= 17 && hour < 21) return t('intention.greeting.evening', 'Good Evening');
    return t('intention.greeting.night', 'Good Night');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const breathingPatterns = [
    {
      id: 'box' as const,
      name: t('intention.breathing.patterns.box', 'For Stress'),
      description: t('intention.breathing.patterns.boxDesc', 'Box 4-4-4-4 • Calms and focuses the mind'),
      icon: 'shield-checkmark' as const,
    },
    {
      id: '4-7-8' as const,
      name: t('intention.breathing.patterns.478', 'For Peace'),
      description: t('intention.breathing.patterns.478Desc', '4-7-8 • Deep relaxation before sleep'),
      icon: 'moon' as const,
    },
    {
      id: 'equal' as const,
      name: t('intention.breathing.patterns.equal', 'For Beginners'),
      description: t('intention.breathing.patterns.equalDesc', '4-4 • Simple pattern for beginners'),
      icon: 'leaf' as const,
    },
    {
      id: 'calm' as const,
      name: t('intention.breathing.patterns.calm', 'For Energy'),
      description: t('intention.breathing.patterns.calmDesc', '4-4 fast • Energizes and boosts'),
      icon: 'flash' as const,
    },
  ];

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      {/* Introduction to Meditation Modal */}
      <Modal
        visible={showIntroGuideModal}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowIntroGuideModal(false)}
      >
        <MeditationIntroGuide
          onClose={() => setShowIntroGuideModal(false)}
          isDark={isDark}
        />
      </Modal>

      {/* Breathing Exercise Modal */}
      <Modal
        visible={showBreathingModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseBreathing}
      >
        <View style={modalStyles.overlay}>
          <View style={[modalStyles.content, { backgroundColor: dynamicStyles.modalBg }]}>
            {/* Header */}
            <View style={modalStyles.header}>
              <TouchableOpacity
                onPress={handleCloseBreathing}
                style={modalStyles.closeButton}
                accessibilityRole="button"
                accessibilityLabel={t('common.close', 'Close')}
              >
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={[modalStyles.title, { color: colors.text.primary }]}>
                {t('intention.breathing.title', 'Breathing Exercise')}
              </Text>
              <Text style={[modalStyles.subtitle, { color: colors.text.secondary }]}>
                {t('intention.breathing.subtitle', 'Prepare for meditation')}
              </Text>
            </View>

            {/* Pattern Selection */}
            {!breathingActive && (
              <View style={modalStyles.patternsContainer}>
                <Text style={[modalStyles.sectionTitle, { color: colors.text.secondary }]}>
                  {t('intention.breathing.choosePattern', 'Choose pattern:')}
                </Text>
                {breathingPatterns.map((pattern) => (
                  <TouchableOpacity
                    key={pattern.id}
                    style={[
                      modalStyles.patternCard,
                      {
                        backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.gray[50],
                        borderWidth: 1.5,
                        borderColor: selectedPattern === pattern.id
                          ? currentTheme.primary
                          : isDark ? colors.neutral.charcoal[100] : colors.neutral.gray[200],
                      },
                      selectedPattern === pattern.id && {
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setSelectedPattern(pattern.id)}
                    accessibilityRole="radio"
                    accessibilityLabel={pattern.name}
                    accessibilityHint={pattern.description}
                    accessibilityState={{ selected: selectedPattern === pattern.id }}
                  >
                    <View style={[
                      modalStyles.patternIcon,
                      { backgroundColor: selectedPattern === pattern.id ? currentTheme.primary : dynamicStyles.iconBoxBg }
                    ]}>
                      <Ionicons
                        name={pattern.icon}
                        size={20}
                        color={selectedPattern === pattern.id ? colors.neutral.white : currentTheme.primary}
                      />
                    </View>
                    <View style={modalStyles.patternInfo}>
                      <Text style={[modalStyles.patternName, { color: colors.text.primary }]}>
                        {pattern.name}
                      </Text>
                      <Text style={[modalStyles.patternDesc, { color: colors.text.secondary }]}>
                        {pattern.description}
                      </Text>
                    </View>
                    {selectedPattern === pattern.id && (
                      <Ionicons name="checkmark-circle" size={24} color={currentTheme.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Breathing Animation - only show when active */}
            {breathingActive && (
              <AnimatedBreathingCircle
                isRunning={breathingActive}
                pattern={selectedPattern}
                isDark={isDark}
              />
            )}

            {/* Timer */}
            {breathingActive && (
              <Text style={[modalStyles.timer, { color: currentTheme.primary }]}>
                {formatTime(breathingTime)}
              </Text>
            )}

            {/* Actions */}
            <View style={modalStyles.actions}>
              {!breathingActive ? (
                <GradientButton
                  title={t('intention.breathing.start', 'Start')}
                  onPress={handleStartBreathing}
                  gradient={themeGradients.button.primary}
                  style={modalStyles.actionButton}
                />
              ) : (
                <TouchableOpacity
                  style={[modalStyles.stopButton, { backgroundColor: isDark ? colors.neutral.charcoal[100] : colors.neutral.gray[100] }]}
                  onPress={handleStopBreathing}
                >
                  <Text style={[modalStyles.stopButtonText, { color: colors.text.primary }]}>
                    {t('intention.breathing.stop', 'Stop')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.scrollWrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconCircle, { backgroundColor: dynamicStyles.iconBoxBg }]}>
              <Ionicons name="leaf" size={32} color={currentTheme.primary} />
            </View>
            <Text style={[styles.greeting, dynamicStyles.subtitle]}>{getTimeGreeting()}</Text>
            <Text style={[styles.title, dynamicStyles.title]}>
              {t('intention.title', 'Set Your Intention')}
            </Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
              {t('intention.subtitle', 'What would you like to cultivate in this session?')}
            </Text>
          </View>

          {/* Quick Links Section */}
          <View style={styles.quickLinksContainer}>
            {/* Introduction to Meditation Button */}
            <TouchableOpacity
              style={[styles.breathingButton, { backgroundColor: dynamicStyles.iconBoxBg }]}
              onPress={() => setShowIntroGuideModal(true)}
            >
              <View style={[styles.breathingButtonIcon, { backgroundColor: currentTheme.primary }]}>
                <Ionicons name="sparkles" size={20} color={colors.neutral.white} />
              </View>
              <View style={styles.breathingButtonText}>
                <Text style={[styles.breathingButtonTitle, { color: colors.text.primary }]}>
                  {t('introGuide.title', 'Introduction to Meditation')}
                </Text>
                <Text style={[styles.breathingButtonSubtitle, { color: colors.text.secondary }]}>
                  {t('introGuide.subtitle', 'Learn the basics of mindfulness')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </TouchableOpacity>

          </View>

          {/* Intention Input Card */}
          <GradientCard
            gradient={themeGradients.card.whiteCard}
            style={[styles.card, dynamicStyles.cardShadow]}
            isDark={isDark}
          >
            <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
              {t('intention.inputLabel', 'Your Intention (Optional)')}
            </Text>
            <TextInput
              style={[styles.textInput, dynamicStyles.textInput]}
              placeholder={t('intention.placeholder', 'e.g. "Stay present with my breath"')}
              placeholderTextColor={isDark ? colors.text.tertiary : theme.colors.text.tertiary}
              value={intention}
              onChangeText={setIntention}
              multiline
              maxLength={200}
            />
            <Text style={[styles.charCount, dynamicStyles.subtitle]}>
              {intention.length}/200
            </Text>
          </GradientCard>

          {/* Skip forever checkbox */}
          <TouchableOpacity
            onPress={() => setSkipForever(!skipForever)}
            style={styles.skipCheckbox}
            accessibilityRole="checkbox"
            accessibilityLabel={t('intention.skipForever', 'Do not show this screen before meditation')}
            accessibilityState={{ checked: skipForever }}
          >
            <Ionicons
              name={skipForever ? 'checkbox' : 'square-outline'}
              size={22}
              color={dynamicStyles.checkboxColor}
            />
            <Text style={[styles.skipCheckboxText, dynamicStyles.skipText]}>
              {t('intention.skipForever', 'Do not show this screen before meditation')}
            </Text>
          </TouchableOpacity>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <GradientButton
              title={t('intention.begin', 'Begin Meditation')}
              onPress={handleBegin}
              gradient={themeGradients.button.primary}
              style={styles.primaryButton}
            />
            <TouchableOpacity
              onPress={handleSkipPress}
              style={styles.skipButton}
              accessibilityRole="button"
              accessibilityLabel={t('intention.skip', 'Skip')}
              accessibilityHint={t('accessibility.skipIntentionHint', 'Skips intention setting and starts meditation')}
            >
              <Text style={[styles.skipButtonText, dynamicStyles.skipText]}>
                {t('intention.skip', 'Skip')}
              </Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

// ══════════════════════════════════════════════════════════════
// Modal Styles
// ══════════════════════════════════════════════════════════════

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: backgrounds.overlay,
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.lg,
    maxHeight: '90%',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.sm,
  },
  patternsContainer: {
    marginBottom: theme.spacing.md,
  },
  patternCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  patternIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternInfo: {
    flex: 1,
  },
  patternName: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    marginBottom: 2,
  },
  patternDesc: {
    fontSize: theme.typography.fontSizes.xs,
  },
  timer: {
    fontSize: 48,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  actions: {
    gap: theme.spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
  stopButton: {
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  stopButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
});

// ══════════════════════════════════════════════════════════════
// Main Styles
// ══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollWrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  greeting: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: theme.typography.fontSizes.md * 1.5,
  },
  // Quick Links Container
  quickLinksContainer: {
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  // Breathing Exercise Button
  breathingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
  },
  breathingButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingButtonText: {
    flex: 1,
  },
  breathingButtonTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    marginBottom: 2,
  },
  breathingButtonSubtitle: {
    fontSize: theme.typography.fontSizes.xs,
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: theme.typography.fontSizes.xs,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  skipCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  skipCheckboxText: {
    fontSize: theme.typography.fontSizes.sm,
    flex: 1,
  },
  buttonContainer: {
    gap: theme.spacing.sm,
  },
  primaryButton: {
    width: '100%',
  },
  skipButton: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    textDecorationLine: 'underline',
  },
});

export default IntentionScreen;

import { logger } from '../utils/logger';
// ══════════════════════════════════════════════════════════════
// Pre-Session Instructions Component
// Ultra-Modern Design Following CelebrationScreen Patterns
// ══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Animated, TextInput, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PreSessionInstruction, ChecklistItem } from '../types/instructions';
import { GradientBackground } from './GradientBackground';
import { GradientCard } from './GradientCard';
import { GradientButton } from './GradientButton';
import theme, { gradients, getThemeColors, getThemeGradients } from '../theme';
import { brandColors, primaryColor, featureColorPalettes, neutralColors, backgrounds } from '../theme/colors';
import { userPreferences } from '../services/userPreferences';
import { usePersonalization } from '../contexts/PersonalizationContext';

// ══════════════════════════════════════════════════════════════
// Icon Mapping Helper
// ══════════════════════════════════════════════════════════════

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = brandColors.purple.primary }) => {
  const iconMap: Record<string, string> = {
    // Physical setup icons
    chair: 'chair',
    spa: 'spa',
    'praying-hands': 'praying-hands',
    eye: 'eye',
    bed: 'bed',
    walking: 'walking',
    thermometer: 'thermometer-half',
    anchor: 'anchor',
    heart: 'heart',
    smile: 'smile',
    water: 'water',
    mountain: 'mountain',
    bullseye: 'bullseye',
    // UI icons
    sunrise: 'sun',
    target: 'bullseye',
    lightbulb: 'lightbulb',
    clipboard: 'clipboard-list',
    wind: 'wind',
    sparkles: 'star',
  };

  const fontAwesomeName = iconMap[name] || 'question-circle';

  return <FontAwesome5 name={fontAwesomeName} size={size} color={color} solid />;
};

// ══════════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════════

interface PreSessionInstructionsProps {
  instruction: PreSessionInstruction;
  onComplete: (intention: string) => void;
  onSkip: () => void;
  isDark?: boolean;
}

export const PreSessionInstructions: React.FC<PreSessionInstructionsProps> = ({
  instruction,
  onComplete,
  onSkip,
  isDark = false,
}) => {
  const { t } = useTranslation();
  const { currentTheme } = usePersonalization();
  const insets = useSafeAreaInsets();

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Dynamic styles based on theme - using primary brand color for consistency with app
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    subtitle: { color: colors.text.secondary },
    cardTitle: { color: colors.text.primary },
    cardDescription: { color: colors.text.secondary },
    listBullet: { color: currentTheme.primary },
    listText: { color: colors.text.secondary },
    skipButtonText: { color: colors.text.secondary },
    inputLabel: { color: colors.text.secondary },
    textInput: {
      borderColor: isDark ? colors.neutral.charcoal[100] : theme.colors.border.default,
      color: colors.text.primary,
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    },
    timerText: { color: currentTheme.primary },
    breathingText: { color: currentTheme.primary },
    checklistTitle: { color: colors.text.primary },
    checklistDescription: { color: colors.text.secondary },
    optionalBadge: { color: colors.text.tertiary },
    skipCheckboxContainer: {
      backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)',
    },
    skipCheckboxTitle: { color: isDark ? colors.neutral.white : '#1a1a2e' },
    skipCheckboxNote: { color: isDark ? colors.text.secondary : '#6b7280' },
    // Card shadow for consistency with HomeScreen
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
    cardBg: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    // Icon box backgrounds - using primary color palette
    iconBoxBg: isDark ? `${currentTheme.primary}40` : `${currentTheme.primary}26`,
    iconBoxBgCompleted: currentTheme.primary,
    // Icon colors
    iconColor: currentTheme.primary,
    iconColorCompleted: colors.neutral.white,
    // Checkbox and progress colors
    checkboxColor: currentTheme.primary,
    checkboxColorUnchecked: isDark ? `${currentTheme.primary}CC` : `${currentTheme.primary}40`,
    progressActiveColor: currentTheme.primary,
  }), [colors, isDark, currentTheme]);
  const [currentStep, setCurrentStep] = useState<'overview' | 'setup' | 'breathing' | 'intention'>('overview');
  const [setupChecklist, setSetupChecklist] = useState<ChecklistItem[]>([]);
  const [breathingPrepComplete, setBreathingPrepComplete] = useState(false);
  const [userIntention, setUserIntention] = useState('');
  const [alwaysSkip, setAlwaysSkip] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Initialize checklist from physical setup steps
    const checklist: ChecklistItem[] = instruction.physicalSetup.map((step) => ({
      id: step.order.toString(),
      text: step.title,
      completed: false,
      required: !step.isOptional,
    }));
    setSetupChecklist(checklist);
  }, [instruction]);

  const handleChecklistToggle = (id: string) => {
    setSetupChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const allRequiredComplete = setupChecklist
    .filter((item) => item.required)
    .every((item) => item.completed);

  const handleContinueToSession = async () => {
    if (alwaysSkip) {
      await userPreferences.setSkipPreSessionInstructions(true);
    }
    onComplete(userIntention);
  };

  const toggleAlwaysSkip = () => {
    setAlwaysSkip(!alwaysSkip);
  };

  // Handle skip with "don't show again" option
  const handleSkipPress = () => {
    setShowSkipModal(true);
  };

  const handleSkipConfirm = async () => {
    if (dontShowAgain) {
      await userPreferences.setSkipPreSessionInstructions(true);
    }
    setShowSkipModal(false);
    // Skip to intention step so user can still set their intention
    setCurrentStep('intention');
  };

  const handleSkipCancel = () => {
    setShowSkipModal(false);
    setDontShowAgain(false);
  };

  // Get time-based greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('instructions.timeOfDay.morning');
    if (hour < 17) return t('instructions.timeOfDay.afternoon');
    if (hour < 22) return t('instructions.timeOfDay.evening');
    return t('instructions.timeOfDay.night');
  };

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      {/* Skip Confirmation Modal */}
      <Modal
        visible={showSkipModal}
        transparent
        animationType="fade"
        onRequestClose={handleSkipCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: dynamicStyles.cardBg }]}>
            <View style={[styles.modalIconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
              <Ionicons name="rocket" size={28} color={dynamicStyles.iconColor} />
            </View>
            <Text style={[styles.modalTitle, dynamicStyles.cardTitle]}>
              {t('instructions.skipModal.title', 'Go to meditation')}
            </Text>
            <Text style={[styles.modalDescription, dynamicStyles.cardDescription]}>
              {t('instructions.skipModal.description', 'You can skip the preparation and start meditation right away.')}
            </Text>

            {/* Don't show again checkbox */}
            <TouchableOpacity
              onPress={() => setDontShowAgain(!dontShowAgain)}
              style={styles.modalCheckbox}
            >
              <Ionicons
                name={dontShowAgain ? 'checkbox' : 'square-outline'}
                size={24}
                color={dynamicStyles.checkboxColor}
              />
              <Text style={[styles.modalCheckboxText, dynamicStyles.cardDescription]}>
                {t('instructions.skipModal.dontShowAgain', "Don't show this introduction anymore")}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleSkipCancel}
                style={[styles.modalButton, styles.modalButtonSecondary]}
              >
                <Text style={[styles.modalButtonText, dynamicStyles.skipButtonText]}>
                  {t('common.cancel', 'Cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSkipConfirm}
                style={styles.modalButton}
              >
                <LinearGradient
                  colors={currentTheme.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonTextPrimary}>
                    {t('instructions.skipModal.startMeditation', 'Begin')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 20) + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, dynamicStyles.title]}>{t(`instructions.${instruction.id}.title`)}</Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>{t(`instructions.${instruction.id}.subtitle`)}</Text>
        </View>

        {/* Progress Indicator */}
        <StepProgress currentStep={currentStep} t={t} isDark={isDark} />

        {/* Content based on current step */}
        {currentStep === 'overview' && (
          <OverviewStep
            instruction={instruction}
            timeGreeting={getTimeGreeting()}
            onNext={() => setCurrentStep('setup')}
            onSkip={handleSkipPress}
            t={t}
            isDark={isDark}
            themeGradients={themeGradients}
            dynamicStyles={dynamicStyles}
          />
        )}

        {currentStep === 'setup' && (
          <PhysicalSetupStep
            instructionId={instruction.id}
            setup={instruction.physicalSetup}
            checklist={setupChecklist}
            onToggle={handleChecklistToggle}
            onNext={() => setCurrentStep(instruction.breathingPrep ? 'breathing' : 'intention')}
            onSkip={handleSkipPress}
            canContinue={allRequiredComplete}
            t={t}
            isDark={isDark}
            themeGradients={themeGradients}
            dynamicStyles={dynamicStyles}
          />
        )}

        {currentStep === 'breathing' && instruction.breathingPrep && (
          <BreathingPrepStep
            instructionId={instruction.id}
            breathingPrep={instruction.breathingPrep}
            onComplete={() => {
              setBreathingPrepComplete(true);
              setCurrentStep('intention');
            }}
            onSkipStep={() => setCurrentStep('intention')}
            onSkipAll={handleSkipPress}
            t={t}
            isDark={isDark}
            themeGradients={themeGradients}
            dynamicStyles={dynamicStyles}
          />
        )}

        {currentStep === 'intention' && (
          <IntentionStep
            instructionId={instruction.id}
            mentalPrep={instruction.mentalPreparation}
            sessionTips={instruction.sessionTips}
            intention={userIntention}
            onIntentionChange={setUserIntention}
            onBegin={handleContinueToSession}
            alwaysSkip={alwaysSkip}
            onToggleSkip={toggleAlwaysSkip}
            t={t}
            isDark={isDark}
            themeGradients={themeGradients}
            dynamicStyles={dynamicStyles}
          />
        )}
      </ScrollView>
    </GradientBackground>
  );
};

// ══════════════════════════════════════════════════════════════
// Step 1: Overview
// ══════════════════════════════════════════════════════════════

interface OverviewStepProps {
  instruction: PreSessionInstruction;
  timeGreeting: string;
  onNext: () => void;
  onSkip: () => void;
  t: any;
  isDark?: boolean;
  themeGradients: any;
  dynamicStyles: any;
}

const OverviewStep: React.FC<OverviewStepProps> = ({ instruction, timeGreeting, onNext, onSkip, t, isDark, themeGradients, dynamicStyles }) => {
  return (
    <View style={styles.stepContainer}>
      {/* Time of Day Insight */}
      <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.card, dynamicStyles.cardShadow]} isDark={isDark}>
        <View style={styles.cardRow}>
          <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
            <Icon name="sunrise" size={24} color={dynamicStyles.iconColor} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>{timeGreeting}</Text>
            <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
              {t('instructions.preparation.greeting', {
                technique: instruction.technique.replace('_', ' '),
              }) || `You're about to practice ${instruction.technique.replace('_', ' ')}. Let's prepare mindfully.`}
            </Text>
          </View>
        </View>
      </GradientCard>

      {/* Mental Preparation */}
      <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.card, dynamicStyles.cardShadow]} isDark={isDark}>
        <View style={styles.cardRow}>
          <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
            <Icon name="target" size={24} color={dynamicStyles.iconColor} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
              {t('instructions.preparation.focusToday') || 'Your Focus Today'}
            </Text>
            <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
              {t(`instructions.${instruction.id}.intention`)}
            </Text>
          </View>
        </View>
      </GradientCard>

      {/* Common Challenges */}
      <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.card, dynamicStyles.cardShadow]} isDark={isDark}>
        <View style={styles.cardRow}>
          <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
            <Icon name="lightbulb" size={24} color={dynamicStyles.iconColor} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
              {t('instructions.preparation.remember') || 'Remember'}
            </Text>
            <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
              {t('instructions.preparation.reminders') || 'Some reminders to keep in mind:'}
            </Text>
            {[1, 2, 3].map((num) => {
              const challengeText = t(`instructions.${instruction.id}.challenges.${num}`, { defaultValue: '' });
              if (!challengeText) return null;
              return (
                <View key={num} style={styles.listItem}>
                  <Text style={[styles.listBullet, dynamicStyles.listBullet]}>•</Text>
                  <Text style={[styles.listText, dynamicStyles.listText]}>{challengeText}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </GradientCard>

      {/* Actions */}
      <View style={styles.buttonContainer}>
        <GradientButton
          title={t('instructions.preparation.prepareMySpace') || 'Prepare My Space'}
          onPress={onNext}
          gradient={themeGradients.button.primary}
          style={styles.primaryButton}
        />
        <Pressable onPress={onSkip} style={styles.skipButton}>
          <Text style={[styles.skipButtonText, dynamicStyles.skipButtonText]}>
            {t('instructions.preparation.skip') || 'Skip'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// Step 2: Physical Setup Checklist
// ══════════════════════════════════════════════════════════════

interface PhysicalSetupStepProps {
  instructionId: string;
  setup: PreSessionInstruction['physicalSetup'];
  checklist: ChecklistItem[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onSkip: () => void;
  canContinue: boolean;
  t: any;
  isDark?: boolean;
  themeGradients: any;
  dynamicStyles: any;
}

const PhysicalSetupStep: React.FC<PhysicalSetupStepProps> = ({
  instructionId,
  setup,
  checklist,
  onToggle,
  onNext,
  onSkip,
  canContinue,
  t,
  isDark,
  themeGradients,
  dynamicStyles,
}) => {
  return (
    <View style={styles.stepContainer}>
      <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.card, dynamicStyles.cardShadow]} isDark={isDark}>
        <View style={styles.cardRow}>
          <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
            <Icon name="clipboard" size={24} color={dynamicStyles.iconColor} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
              {t('instructions.preparation.physicalSetup') || 'Physical Setup'}
            </Text>
            <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
              {t('instructions.preparation.checkOffItems') || 'Check off each item as you set up your meditation space:'}
            </Text>
          </View>
        </View>
      </GradientCard>

      {setup.map((step) => {
        const checklistItem = checklist.find((item) => item.id === step.order.toString());
        const isCompleted = checklistItem?.completed || false;

        // Fetch translations using instruction ID and step order
        const stepNum = step.order;
        const title = t(`instructions.${instructionId}.physicalSetup.${stepNum}.title`);
        const description = t(`instructions.${instructionId}.physicalSetup.${stepNum}.description`);

        return (
          <ChecklistItemCard
            key={step.order}
            icon={step.icon}
            title={title}
            description={description}
            isOptional={step.isOptional}
            isCompleted={isCompleted}
            onToggle={() => onToggle(step.order.toString())}
            t={t}
            isDark={isDark}
            themeGradients={themeGradients}
            dynamicStyles={dynamicStyles}
          />
        );
      })}

      <View style={styles.buttonContainer}>
        <GradientButton
          title={
            canContinue
              ? t('instructions.preparation.continue') || 'Continue'
              : t('instructions.preparation.completeRequired') || 'Complete Required Steps'
          }
          onPress={onNext}
          gradient={canContinue ? themeGradients.button.primary : themeGradients.button.disabled}
          style={styles.primaryButton}
          disabled={!canContinue}
        />
        <Pressable onPress={onSkip} style={styles.skipButton}>
          <Text style={[styles.skipButtonText, dynamicStyles.skipButtonText]}>
            {t('instructions.preparation.skipAll') || 'Skip preparation'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// Step 3: Breathing Preparation Exercise
// ══════════════════════════════════════════════════════════════

interface BreathingPrepStepProps {
  instructionId: string;
  breathingPrep: NonNullable<PreSessionInstruction['breathingPrep']>;
  onComplete: () => void;
  onSkipStep: () => void;
  onSkipAll: () => void;
  t: any;
  isDark?: boolean;
  themeGradients: any;
  dynamicStyles: any;
}

const BreathingPrepStep: React.FC<BreathingPrepStepProps> = ({
  instructionId,
  breathingPrep,
  onComplete,
  onSkipStep,
  onSkipAll,
  t,
  isDark,
  themeGradients,
  dynamicStyles,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(breathingPrep.duration);
  const [isCompleted, setIsCompleted] = useState(false);

  // Handle timer countdown
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Call onComplete when timer finishes (separate effect to avoid setState during render)
  useEffect(() => {
    if (isCompleted) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  const handleStart = () => {
    setIsRunning(true);
  };

  return (
    <View style={styles.stepContainer}>
      <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.card, dynamicStyles.cardShadow]} isDark={isDark}>
        <View style={styles.cardRow}>
          <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
            <Icon name="wind" size={24} color={dynamicStyles.iconColor} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
              {t('instructions.preparation.breathingExercise') || 'Quick Breathing Exercise'}
            </Text>
            <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>{t(`instructions.${instructionId}.breathingPrep.instruction`)}</Text>
          </View>
        </View>
      </GradientCard>

      {/* Animated Breathing Circle */}
      <AnimatedBreathingCircle
        isRunning={isRunning}
        pattern={breathingPrep.pattern}
        t={t}
        isDark={isDark}
        dynamicStyles={dynamicStyles}
      />

      {/* Timer */}
      {isRunning && (
        <Text style={[styles.timerText, dynamicStyles.timerText]}>
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </Text>
      )}

      {/* Actions */}
      {!isRunning ? (
        <View style={styles.buttonContainer}>
          <GradientButton
            title={t('instructions.preparation.startBreathing') || 'Start Breathing Prep'}
            onPress={handleStart}
            gradient={themeGradients.button.primary}
            style={styles.primaryButton}
          />
          <View style={styles.skipButtonsRow}>
            <Pressable onPress={onSkipStep} style={styles.skipButton}>
              <Text style={[styles.skipButtonText, dynamicStyles.skipButtonText]}>
                {t('instructions.preparation.skipStep') || 'Skip step'}
              </Text>
            </Pressable>
            <Text style={[styles.skipDivider, dynamicStyles.skipButtonText]}>•</Text>
            <Pressable onPress={onSkipAll} style={styles.skipButton}>
              <Text style={[styles.skipButtonText, dynamicStyles.skipButtonText]}>
                {t('instructions.preparation.skipAll') || 'Skip all'}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable onPress={onComplete} style={styles.skipButton}>
          <Text style={[styles.skipButtonText, dynamicStyles.skipButtonText]}>
            {t('instructions.preparation.finishEarly') || 'Finish Early'}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// Step 4: Set Intention
// ══════════════════════════════════════════════════════════════

interface IntentionStepProps {
  instructionId: string;
  mentalPrep: PreSessionInstruction['mentalPreparation'];
  sessionTips: string[];
  intention: string;
  onIntentionChange: (text: string) => void;
  onBegin: () => void;
  alwaysSkip: boolean;
  onToggleSkip: () => void;
  t: any;
  isDark?: boolean;
  themeGradients: any;
  dynamicStyles: any;
}

const IntentionStep: React.FC<IntentionStepProps> = ({
  instructionId,
  mentalPrep,
  sessionTips,
  intention,
  onIntentionChange,
  onBegin,
  alwaysSkip,
  onToggleSkip,
  t,
  isDark,
  themeGradients,
  dynamicStyles,
}) => {
  return (
    <View style={styles.stepContainer}>
      <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.card, dynamicStyles.cardShadow]} isDark={isDark}>
        <View style={styles.cardRow}>
          <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
            <Icon name="target" size={24} color={dynamicStyles.iconColor} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
              {t('instructions.preparation.setIntention') || 'Set Your Intention'}
            </Text>
            <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
              {t('instructions.preparation.intentionPrompt') || 'What would you like to cultivate in this session?'}
            </Text>
          </View>
        </View>
      </GradientCard>

      {/* Intention Input */}
      <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.card, dynamicStyles.cardShadow]} isDark={isDark}>
        <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
          {t('instructions.preparation.yourIntention') || 'Your Intention (Optional)'}
        </Text>
        <TextInput
          style={[styles.textInput, dynamicStyles.textInput]}
          placeholder={t('instructions.preparation.intentionPlaceholder') || 'e.g., "Stay present with my breath"'}
          placeholderTextColor={theme.colors.text.tertiary}
          value={intention}
          onChangeText={onIntentionChange}
          multiline
        />
      </GradientCard>

      {/* Session Tips */}
      <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.card, dynamicStyles.cardShadow]} isDark={isDark}>
        <View style={styles.cardRow}>
          <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
            <Icon name="sparkles" size={24} color={dynamicStyles.iconColor} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
              {t('instructions.preparation.duringSession') || 'During Your Session'}
            </Text>
            <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
              {t('instructions.preparation.keepInMind') || 'Keep these tips in mind:'}
            </Text>
            {[1, 2, 3, 4].map((num) => {
              const tipText = t(`instructions.${instructionId}.sessionTips.${num}`, { defaultValue: '' });
              if (!tipText) return null;
              return (
                <View key={num} style={styles.listItem}>
                  <Text style={[styles.listBullet, dynamicStyles.listBullet]}>•</Text>
                  <Text style={[styles.listText, dynamicStyles.listText]}>{tipText}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </GradientCard>

      {/* Skip Instructions Checkbox */}
      <TouchableOpacity
        onPress={onToggleSkip}
        style={[{
          padding: 16,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }, dynamicStyles.skipCheckboxContainer]}
      >
        <Ionicons
          name={alwaysSkip ? 'checkbox' : 'square-outline'}
          size={24}
          color={dynamicStyles.checkboxColor}
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={[{ fontSize: 14, fontWeight: '600' }, dynamicStyles.skipCheckboxTitle]}>
            {t('instructions.preparation.alwaysSkipInstructions')}
          </Text>
          <Text style={[{ fontSize: 12, marginTop: 4 }, dynamicStyles.skipCheckboxNote]}>
            {t('instructions.preparation.skipInstructionsNote')}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Begin Button */}
      <GradientButton
        title={t('instructions.preparation.beginMeditation') || 'Begin Meditation'}
        onPress={onBegin}
        gradient={themeGradients.button.primary}
        style={[styles.primaryButton, styles.beginButton]}
      />
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// Reusable Components
// ══════════════════════════════════════════════════════════════

const ChecklistItemCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  isOptional: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  t: any;
  isDark?: boolean;
  themeGradients: any;
  dynamicStyles: any;
}> = ({ icon, title, description, isOptional, isCompleted, onToggle, t, isDark, themeGradients, dynamicStyles }) => {
  return (
    <Pressable onPress={onToggle}>
      <GradientCard
        gradient={themeGradients.card.whiteCard}
        style={[styles.checklistCard, dynamicStyles.cardShadow, isCompleted && styles.checklistCardCompleted]}
        isDark={isDark}
      >
        <View style={styles.cardRow}>
          <View style={[
            styles.iconBox,
            { backgroundColor: isCompleted
              ? dynamicStyles.iconBoxBgCompleted
              : dynamicStyles.iconBoxBg
            }
          ]}>
            <Icon name={icon} size={22} color={isCompleted ? dynamicStyles.iconColorCompleted : dynamicStyles.iconColor} />
          </View>
          <View style={styles.cardTextContainer}>
            <View style={styles.checklistTitleRow}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {title}
              </Text>
              {isOptional && (
                <Text style={[styles.optionalBadge, dynamicStyles.optionalBadge]}>
                  {t('instructions.preparation.optional') || '(optional)'}
                </Text>
              )}
            </View>
            <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
              {description}
            </Text>
          </View>
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
            size={28}
            color={isCompleted ? dynamicStyles.checkboxColor : dynamicStyles.checkboxColorUnchecked}
          />
        </View>
      </GradientCard>
    </Pressable>
  );
};

const AnimatedBreathingCircle: React.FC<{
  isRunning: boolean;
  pattern: 'box' | '4-7-8' | 'equal' | 'calm';
  t: any;
  isDark?: boolean;
  dynamicStyles: any;
}> = ({ isRunning, pattern, t, isDark, dynamicStyles }) => {
  const scale = useSharedValue(1);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');

  useEffect(() => {
    if (isRunning) {
      // Define phase durations in milliseconds for each pattern
      const patternConfig = {
        'box': {
          phases: ['inhale', 'hold', 'exhale', 'rest'] as const,
          durations: [4000, 4000, 4000, 4000], // 4s each = 16s total
        },
        '4-7-8': {
          phases: ['inhale', 'hold', 'exhale'] as const,
          durations: [4000, 7000, 8000], // 4s-7s-8s = 19s total
        },
        'equal': {
          phases: ['inhale', 'exhale'] as const,
          durations: [4000, 4000], // 4s each = 8s total
        },
        'calm': {
          phases: ['inhale', 'exhale'] as const,
          durations: [4000, 4000], // 4s each = 8s total
        },
      };

      const config = patternConfig[pattern] || patternConfig['equal'];

      // Cycle through breathing phases with correct durations
      let phaseIndex = 0;
      let timeoutId: NodeJS.Timeout;

      const animatePhase = (phase: typeof config.phases[number], duration: number) => {
        // Animate based on phase: grow on inhale, shrink on exhale, hold on hold/rest
        if (phase === 'inhale') {
          scale.value = withTiming(1.5, { duration, easing: Easing.inOut(Easing.ease) });
        } else if (phase === 'exhale') {
          scale.value = withTiming(1, { duration, easing: Easing.inOut(Easing.ease) });
        }
        // For 'hold' and 'rest', keep current scale (don't animate)
      };

      const scheduleNextPhase = () => {
        const currentPhase = config.phases[phaseIndex];
        const currentPhaseDuration = config.durations[phaseIndex];

        // Set the phase text
        setBreathingPhase(currentPhase);

        // Animate the circle
        animatePhase(currentPhase, currentPhaseDuration);

        // Schedule next phase
        timeoutId = setTimeout(() => {
          phaseIndex = (phaseIndex + 1) % config.phases.length;
          scheduleNextPhase();
        }, currentPhaseDuration);
      };

      // Start the cycle
      scheduleNextPhase();

      return () => clearTimeout(timeoutId);
    } else {
      scale.value = withTiming(1, { duration: 500 });
      setBreathingPhase('inhale');
    }
  }, [isRunning, pattern]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getPhaseText = () => {
    switch (breathingPhase) {
      case 'inhale':
        return t('meditation.breatheIn', 'Breathe in');
      case 'hold':
        return t('instructions.breathingPrep.hold', 'Hold');
      case 'exhale':
        return t('meditation.breatheOut', 'Breathe out');
      case 'rest':
        return t('instructions.breathingPrep.hold', 'Hold');
      default:
        return t('instructions.breathingPrep.breathe', 'Breathe');
    }
  };

  return (
    <View style={styles.breathingContainer}>
      <Reanimated.View style={[styles.breathingCircleWrapper, animatedStyle]}>
        <View style={styles.breathingCircle} />
      </Reanimated.View>
      {isRunning && (
        <Text style={[styles.breathingText, dynamicStyles.breathingText]}>
          {getPhaseText()}
        </Text>
      )}
    </View>
  );
};

const StepProgress: React.FC<{ currentStep: string; t: any; isDark?: boolean }> = ({ currentStep, t, isDark }) => {
  const { currentTheme } = usePersonalization();
  const steps = ['overview', 'setup', 'breathing', 'intention'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <View style={styles.progressContainer}>
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;

        return (
          <React.Fragment key={step}>
            {/* Modern step dot with glow effect */}
            <View style={styles.progressDotWrapper}>
              {/* Glow ring for active step */}
              {isActive && (
                <View style={[
                  styles.progressDotGlow,
                  { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)' }
                ]} />
              )}
              <LinearGradient
                colors={
                  isComplete || isActive
                    ? currentTheme.gradient
                    : isDark
                      ? ['#3A3A4A', '#2A2A3A']
                      : [neutralColors.gray[200], neutralColors.gray[300]]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.progressDot,
                  isActive && styles.progressDotCurrent,
                ]}
              >
                {isComplete && (
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                )}
              </LinearGradient>
            </View>
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <View style={styles.progressLineWrapper}>
                <View
                  style={[
                    styles.progressLine,
                    { backgroundColor: isDark ? '#2A2A3A' : neutralColors.gray[200] },
                  ]}
                />
                {/* Filled portion of line for completed steps */}
                <LinearGradient
                  colors={currentTheme.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressLineFilled,
                    { width: isComplete ? '100%' : '0%' },
                  ]}
                />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

// ══════════════════════════════════════════════════════════════
// Styles
// ══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeights.medium,
  },
  stepContainer: {
    gap: theme.spacing.sm,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  iconLarge: {
    fontSize: 32,
  },
  iconMedium: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.xs,
  },
  listItem: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  listBullet: {
    color: '#8B5CF6',
    fontWeight: theme.typography.fontWeights.semiBold,
    fontSize: theme.typography.fontSizes.md,
  },
  listText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
    flex: 1,
  },
  buttonContainer: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  primaryButton: {
    width: '100%',
  },
  beginButton: {
    marginTop: theme.spacing.lg,
  },
  skipButton: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
    textDecorationLine: 'underline',
  },
  checklistCard: {
    padding: theme.spacing.md,
  },
  checklistCardCompleted: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  checklistContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checklistLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.sm,
  },
  checklistText: {
    flex: 1,
  },
  checklistTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  checklistTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
  },
  checklistTitleCompleted: {
    color: theme.colors.neutral.white,
  },
  checklistDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxs,
  },
  checklistDescriptionCompleted: {
    color: theme.colors.neutral.white,
    opacity: 0.9,
  },
  optionalBadge: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
  },
  optionalBadgeCompleted: {
    color: theme.colors.neutral.white,
    opacity: 0.8,
  },
  inputLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
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
    borderColor: '#8B5CF6',
  },
  breathingText: {
    position: 'absolute',
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: '#8B5CF6',
  },
  timerText: {
    fontSize: 48,
    fontWeight: theme.typography.fontWeights.bold,
    color: '#8B5CF6',
    marginVertical: theme.spacing.md,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  progressDotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  progressDotGlow: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotCurrent: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  progressLineWrapper: {
    width: 60,
    height: 3,
    marginHorizontal: 4,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 1.5,
  },
  progressLine: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1.5,
  },
  progressLineFilled: {
    position: 'absolute',
    height: '100%',
    borderRadius: 1.5,
  },
  // Skip buttons row for multiple skip options
  skipButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  skipDivider: {
    marginHorizontal: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.sm,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: backgrounds.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  modalDescription: {
    fontSize: theme.typography.fontSizes.sm,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
    marginBottom: theme.spacing.lg,
  },
  modalCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  modalCheckboxText: {
    fontSize: theme.typography.fontSizes.sm,
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  modalButtonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
  },
  modalButtonTextPrimary: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
    color: neutralColors.white,
  },
});

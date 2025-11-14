// ══════════════════════════════════════════════════════════════
// Pre-Session Instructions Component
// Ultra-Modern Design Following CelebrationScreen Patterns
// ══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Animated, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { PreSessionInstruction, ChecklistItem } from '../types/instructions';
import { GradientBackground } from './GradientBackground';
import { GradientCard } from './GradientCard';
import { GradientButton } from './GradientButton';
import theme, { gradients } from '../theme';

// ══════════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════════

interface PreSessionInstructionsProps {
  instruction: PreSessionInstruction;
  onComplete: (intention: string) => void;
  onSkip: () => void;
}

export const PreSessionInstructions: React.FC<PreSessionInstructionsProps> = ({
  instruction,
  onComplete,
  onSkip,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<'overview' | 'setup' | 'breathing' | 'intention'>('overview');
  const [setupChecklist, setSetupChecklist] = useState<ChecklistItem[]>([]);
  const [breathingPrepComplete, setBreathingPrepComplete] = useState(false);
  const [userIntention, setUserIntention] = useState('');

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

  const handleContinueToSession = () => {
    onComplete(userIntention);
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
    <GradientBackground gradient={gradients.screen.celebration} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t(`instructions.${instruction.id}.title`)}</Text>
          <Text style={styles.subtitle}>{t(`instructions.${instruction.id}.subtitle`)}</Text>
        </View>

        {/* Progress Indicator */}
        <StepProgress currentStep={currentStep} t={t} />

        {/* Content based on current step */}
        {currentStep === 'overview' && (
          <OverviewStep
            instruction={instruction}
            timeGreeting={getTimeGreeting()}
            onNext={() => setCurrentStep('setup')}
            onSkip={onSkip}
            t={t}
          />
        )}

        {currentStep === 'setup' && (
          <PhysicalSetupStep
            instructionId={instruction.id}
            setup={instruction.physicalSetup}
            checklist={setupChecklist}
            onToggle={handleChecklistToggle}
            onNext={() => setCurrentStep(instruction.breathingPrep ? 'breathing' : 'intention')}
            canContinue={allRequiredComplete}
            t={t}
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
            onSkip={() => setCurrentStep('intention')}
            t={t}
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
            t={t}
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
}

const OverviewStep: React.FC<OverviewStepProps> = ({ instruction, timeGreeting, onNext, onSkip, t }) => {
  return (
    <View style={styles.stepContainer}>
      {/* Time of Day Insight */}
      <GradientCard gradient={gradients.card.lightCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.iconLarge}>🌅</Text>
          <Text style={styles.cardTitle}>{timeGreeting}</Text>
        </View>
        <Text style={styles.cardDescription}>
          {t('instructions.preparation.greeting', {
            technique: instruction.technique.replace('_', ' '),
          }) || `You're about to practice ${instruction.technique.replace('_', ' ')}. Let's prepare mindfully.`}
        </Text>
      </GradientCard>

      {/* Mental Preparation */}
      <GradientCard gradient={gradients.card.lightCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.iconLarge}>🎯</Text>
          <Text style={styles.cardTitle}>
            {t('instructions.preparation.focusToday') || 'Your Focus Today'}
          </Text>
        </View>
        <Text style={styles.cardDescription}>
          {t(`instructions.${instruction.id}.intention`)}
        </Text>
      </GradientCard>

      {/* Common Challenges */}
      <GradientCard gradient={gradients.card.lightCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.iconLarge}>💡</Text>
          <Text style={styles.cardTitle}>
            {t('instructions.preparation.remember') || 'Remember'}
          </Text>
        </View>
        <Text style={styles.cardDescription}>
          {t('instructions.preparation.reminders') || 'Some reminders to keep in mind:'}
        </Text>
        {[1, 2, 3].map((num) => {
          const challengeText = t(`instructions.${instruction.id}.challenges.${num}`, { defaultValue: '' });
          if (!challengeText) return null;
          return (
            <View key={num} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{challengeText}</Text>
            </View>
          );
        })}
      </GradientCard>

      {/* Actions */}
      <View style={styles.buttonContainer}>
        <GradientButton
          title={t('instructions.preparation.prepareMySpace') || 'Prepare My Space'}
          onPress={onNext}
          gradient={gradients.button.primary}
          style={styles.primaryButton}
        />
        <Pressable onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>
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
  canContinue: boolean;
  t: any;
}

const PhysicalSetupStep: React.FC<PhysicalSetupStepProps> = ({
  instructionId,
  setup,
  checklist,
  onToggle,
  onNext,
  canContinue,
  t,
}) => {
  return (
    <View style={styles.stepContainer}>
      <GradientCard gradient={gradients.card.lightCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.iconLarge}>📋</Text>
          <Text style={styles.cardTitle}>
            {t('instructions.preparation.physicalSetup') || 'Physical Setup'}
          </Text>
        </View>
        <Text style={styles.cardDescription}>
          {t('instructions.preparation.checkOffItems') || 'Check off each item as you set up your meditation space:'}
        </Text>
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
          />
        );
      })}

      <GradientButton
        title={
          canContinue
            ? t('instructions.preparation.continue') || 'Continue'
            : t('instructions.preparation.completeRequired') || 'Complete Required Steps'
        }
        onPress={onNext}
        gradient={canContinue ? gradients.button.primary : gradients.button.disabled}
        style={styles.primaryButton}
        disabled={!canContinue}
      />
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
  onSkip: () => void;
  t: any;
}

const BreathingPrepStep: React.FC<BreathingPrepStepProps> = ({
  instructionId,
  breathingPrep,
  onComplete,
  onSkip,
  t,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(breathingPrep.duration);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  const handleStart = () => {
    setIsRunning(true);
  };

  return (
    <View style={styles.stepContainer}>
      <GradientCard gradient={gradients.card.lightCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.iconLarge}>🌬️</Text>
          <Text style={styles.cardTitle}>
            {t('instructions.preparation.breathingExercise') || 'Quick Breathing Exercise'}
          </Text>
        </View>
        <Text style={styles.cardDescription}>{t(`instructions.${instructionId}.breathingPrep.instruction`)}</Text>
      </GradientCard>

      {/* Animated Breathing Circle */}
      <AnimatedBreathingCircle
        isRunning={isRunning}
        pattern={breathingPrep.pattern}
        t={t}
      />

      {/* Timer */}
      {isRunning && (
        <Text style={styles.timerText}>
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </Text>
      )}

      {/* Actions */}
      {!isRunning ? (
        <View style={styles.buttonContainer}>
          <GradientButton
            title={t('instructions.preparation.startBreathing') || 'Start Breathing Prep'}
            onPress={handleStart}
            gradient={gradients.button.primary}
            style={styles.primaryButton}
          />
          <Pressable onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>
              {t('instructions.preparation.skip') || 'Skip'}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={onComplete} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>
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
  t: any;
}

const IntentionStep: React.FC<IntentionStepProps> = ({
  instructionId,
  mentalPrep,
  sessionTips,
  intention,
  onIntentionChange,
  onBegin,
  t,
}) => {
  return (
    <View style={styles.stepContainer}>
      <GradientCard gradient={gradients.card.lightCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.iconLarge}>🎯</Text>
          <Text style={styles.cardTitle}>
            {t('instructions.preparation.setIntention') || 'Set Your Intention'}
          </Text>
        </View>
        <Text style={styles.cardDescription}>
          {t('instructions.preparation.intentionPrompt') || 'What would you like to cultivate in this session?'}
        </Text>
      </GradientCard>

      {/* Intention Input */}
      <GradientCard gradient={gradients.card.lightCard} style={styles.card}>
        <Text style={styles.inputLabel}>
          {t('instructions.preparation.yourIntention') || 'Your Intention (Optional)'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={t('instructions.preparation.intentionPlaceholder') || 'e.g., "Stay present with my breath"'}
          placeholderTextColor={theme.colors.text.tertiary}
          value={intention}
          onChangeText={onIntentionChange}
          multiline
        />
      </GradientCard>

      {/* Session Tips */}
      <GradientCard gradient={gradients.card.lightCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.iconLarge}>✨</Text>
          <Text style={styles.cardTitle}>
            {t('instructions.preparation.duringSession') || 'During Your Session'}
          </Text>
        </View>
        <Text style={styles.cardDescription}>
          {t('instructions.preparation.keepInMind') || 'Keep these tips in mind:'}
        </Text>
        {[1, 2, 3, 4].map((num) => {
          const tipText = t(`instructions.${instructionId}.sessionTips.${num}`, { defaultValue: '' });
          if (!tipText) return null;
          return (
            <View key={num} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{tipText}</Text>
            </View>
          );
        })}
      </GradientCard>

      {/* Begin Button */}
      <GradientButton
        title={t('instructions.preparation.beginMeditation') || 'Begin Meditation'}
        onPress={onBegin}
        gradient={gradients.button.primary}
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
}> = ({ icon, title, description, isOptional, isCompleted, onToggle, t }) => {
  return (
    <Pressable onPress={onToggle}>
      <GradientCard
        gradient={isCompleted ? gradients.card.blueCard : gradients.card.lightCard}
        style={[styles.checklistCard, isCompleted && styles.checklistCardCompleted]}
      >
        <View style={styles.checklistContent}>
          <View style={styles.checklistLeft}>
            <Text style={styles.iconMedium}>{icon}</Text>
            <View style={styles.checklistText}>
              <View style={styles.checklistTitleRow}>
                <Text style={[styles.checklistTitle, isCompleted && styles.checklistTitleCompleted]}>
                  {title}
                </Text>
                {isOptional && (
                  <Text style={[styles.optionalBadge, isCompleted && styles.optionalBadgeCompleted]}>
                    {t('instructions.preparation.optional') || '(optional)'}
                  </Text>
                )}
              </View>
              <Text style={[styles.checklistDescription, isCompleted && styles.checklistDescriptionCompleted]}>
                {description}
              </Text>
            </View>
          </View>
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
            size={28}
            color={isCompleted ? theme.colors.neutral.white : theme.colors.accent.blue[400]}
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
}> = ({ isRunning, pattern, t }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isRunning) {
      const duration = pattern === 'box' ? 4000 : pattern === '4-7-8' ? 4000 : 4000;
      scale.value = withRepeat(
        withTiming(1.4, { duration, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 500 });
    }
  }, [isRunning, pattern]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.breathingContainer}>
      <Reanimated.View style={[styles.breathingCircleWrapper, animatedStyle]}>
        <View style={styles.breathingCircle} />
      </Reanimated.View>
      {isRunning && (
        <Text style={styles.breathingText}>
          {t('instructions.preparation.breathe') || 'Breathe'}
        </Text>
      )}
    </View>
  );
};

const StepProgress: React.FC<{ currentStep: string; t: any }> = ({ currentStep, t }) => {
  const steps = ['overview', 'setup', 'breathing', 'intention'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <View style={styles.progressContainer}>
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;

        return (
          <React.Fragment key={step}>
            <View
              style={[
                styles.progressDot,
                (isComplete || isActive) && styles.progressDotActive,
              ]}
            />
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.progressLine,
                  isComplete && styles.progressLineActive,
                ]}
              />
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
    marginBottom: theme.spacing.lg,
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
    gap: theme.spacing.md,
  },
  card: {
    padding: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  iconLarge: {
    fontSize: 32,
  },
  iconMedium: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
    flex: 1,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
  },
  listItem: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  listBullet: {
    color: theme.colors.accent.blue[600],
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
    borderColor: theme.colors.accent.blue[500],
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
    backgroundColor: `${theme.colors.accent.blue[500]}30`,
    borderWidth: 3,
    borderColor: theme.colors.accent.blue[500],
  },
  breathingText: {
    position: 'absolute',
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.accent.blue[600],
  },
  timerText: {
    fontSize: 48,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.accent.blue[600],
    marginVertical: theme.spacing.md,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.neutral.gray[300],
  },
  progressDotActive: {
    backgroundColor: theme.colors.accent.blue[500],
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.neutral.gray[300],
    marginHorizontal: theme.spacing.xxs,
  },
  progressLineActive: {
    backgroundColor: theme.colors.accent.blue[500],
  },
});

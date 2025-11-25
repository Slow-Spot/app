import { logger } from '../utils/logger';
// ══════════════════════════════════════════════════════════════
// Pre-Session Instructions Component
// Ultra-Modern Design Following CelebrationScreen Patterns
// ══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Animated, TextInput, TouchableOpacity } from 'react-native';
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

import { PreSessionInstruction, ChecklistItem } from '../types/instructions';
import { GradientBackground } from './GradientBackground';
import { GradientCard } from './GradientCard';
import { GradientButton } from './GradientButton';
import theme, { gradients } from '../theme';
import { userPreferences } from '../services/userPreferences';

// ══════════════════════════════════════════════════════════════
// Icon Mapping Helper
// ══════════════════════════════════════════════════════════════

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = theme.colors.accent.blue[600] }) => {
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
  const [alwaysSkip, setAlwaysSkip] = useState(false);

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
      await userPreferences.set('skipInstructions', true);
    }
    onComplete(userIntention);
  };

  const toggleAlwaysSkip = () => {
    setAlwaysSkip(!alwaysSkip);
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
    <GradientBackground gradient={gradients.primary.subtleBlue} style={styles.container}>
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
            alwaysSkip={alwaysSkip}
            onToggleSkip={toggleAlwaysSkip}
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
      <GradientCard gradient={gradients.card.whiteCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="sunrise" size={32} />
          <Text style={styles.cardTitle}>{timeGreeting}</Text>
        </View>
        <Text style={styles.cardDescription}>
          {t('instructions.preparation.greeting', {
            technique: instruction.technique.replace('_', ' '),
          }) || `You're about to practice ${instruction.technique.replace('_', ' ')}. Let's prepare mindfully.`}
        </Text>
      </GradientCard>

      {/* Mental Preparation */}
      <GradientCard gradient={gradients.card.whiteCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="target" size={32} />
          <Text style={styles.cardTitle}>
            {t('instructions.preparation.focusToday') || 'Your Focus Today'}
          </Text>
        </View>
        <Text style={styles.cardDescription}>
          {t(`instructions.${instruction.id}.intention`)}
        </Text>
      </GradientCard>

      {/* Common Challenges */}
      <GradientCard gradient={gradients.card.whiteCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="lightbulb" size={32} />
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
      <GradientCard gradient={gradients.card.whiteCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="clipboard" size={32} />
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
      <GradientCard gradient={gradients.card.whiteCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="wind" size={32} />
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
  alwaysSkip: boolean;
  onToggleSkip: () => void;
  t: any;
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
}) => {
  return (
    <View style={styles.stepContainer}>
      <GradientCard gradient={gradients.card.whiteCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="target" size={32} />
          <Text style={styles.cardTitle}>
            {t('instructions.preparation.setIntention') || 'Set Your Intention'}
          </Text>
        </View>
        <Text style={styles.cardDescription}>
          {t('instructions.preparation.intentionPrompt') || 'What would you like to cultivate in this session?'}
        </Text>
      </GradientCard>

      {/* Intention Input */}
      <GradientCard gradient={gradients.card.whiteCard} style={styles.card}>
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
      <GradientCard gradient={gradients.card.whiteCard} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="sparkles" size={32} />
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

      {/* Skip Instructions Checkbox */}
      <TouchableOpacity
        onPress={onToggleSkip}
        style={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 16,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Ionicons
          name={alwaysSkip ? 'checkbox' : 'square-outline'}
          size={24}
          color="#667eea"
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1a1a2e' }}>
            {t('instructions.preparation.alwaysSkipInstructions')}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            {t('instructions.preparation.skipInstructionsNote')}
          </Text>
        </View>
      </TouchableOpacity>

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
        gradient={isCompleted ? gradients.card.blueCard : gradients.card.whiteCard}
        style={[styles.checklistCard, isCompleted && styles.checklistCardCompleted]}
      >
        <View style={styles.checklistContent}>
          <View style={styles.checklistLeft}>
            <Icon name={icon} size={24} color={isCompleted ? theme.colors.neutral.white : theme.colors.accent.blue[600]} />
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
        return t('meditation.breatheIn', 'Wdech');
      case 'hold':
        return t('instructions.breathingPrep.hold', 'Trzymaj');
      case 'exhale':
        return t('meditation.breatheOut', 'Wydech');
      case 'rest':
        return t('instructions.breathingPrep.hold', 'Trzymaj');
      default:
        return t('instructions.breathingPrep.breathe', 'Oddychaj');
    }
  };

  return (
    <View style={styles.breathingContainer}>
      <Reanimated.View style={[styles.breathingCircleWrapper, animatedStyle]}>
        <View style={styles.breathingCircle} />
      </Reanimated.View>
      {isRunning && (
        <Text style={styles.breathingText}>
          {getPhaseText()}
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

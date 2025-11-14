// ══════════════════════════════════════════════════════════════
// Pre-Session Instructions Component
// Modern, Interactive, Better than Headspace
// ══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, Button, Circle } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { PreSessionInstruction, ChecklistItem } from '../types/instructions';
import { theme } from '../theme';
import { userPreferences } from '../services/userPreferences';

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

  // ══════════════════════════════════════════════════════════════
  // Render Different Steps
  // ══════════════════════════════════════════════════════════════

  return (
    <LinearGradient
      colors={['#E8F5FF', '#D4EBFF', '#C0E0FF']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <YStack style={styles.header}>
          <Text style={styles.title}>{instruction.title}</Text>
          <Text style={styles.subtitle}>{instruction.subtitle}</Text>
        </YStack>

        {/* Progress Indicator */}
        <StepProgress currentStep={currentStep} />

        {/* Content based on current step */}
        {currentStep === 'overview' && (
          <OverviewStep
            instruction={instruction}
            onNext={() => setCurrentStep('setup')}
            onSkip={onSkip}
          />
        )}

        {currentStep === 'setup' && (
          <PhysicalSetupStep
            setup={instruction.physicalSetup}
            checklist={setupChecklist}
            onToggle={handleChecklistToggle}
            onNext={() => setCurrentStep(instruction.breathingPrep ? 'breathing' : 'intention')}
            canContinue={allRequiredComplete}
          />
        )}

        {currentStep === 'breathing' && instruction.breathingPrep && (
          <BreathingPrepStep
            breathingPrep={instruction.breathingPrep}
            onComplete={() => {
              setBreathingPrepComplete(true);
              setCurrentStep('intention');
            }}
            onSkip={() => setCurrentStep('intention')}
          />
        )}

        {currentStep === 'intention' && (
          <IntentionStep
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
    </LinearGradient>
  );
};

// ══════════════════════════════════════════════════════════════
// Step 1: Overview
// ══════════════════════════════════════════════════════════════

interface OverviewStepProps {
  instruction: PreSessionInstruction;
  onNext: () => void;
  onSkip: () => void;
}

const OverviewStep: React.FC<OverviewStepProps> = ({ instruction, onNext, onSkip }) => {
  const hour = new Date().getHours();
  let timeGreeting = 'Good evening';
  if (hour < 12) timeGreeting = 'Good morning';
  else if (hour < 18) timeGreeting = 'Good afternoon';

  return (
    <YStack gap="$4">
      {/* Time of Day Insight */}
      <InstructionCard
        icon="🌅"
        title={timeGreeting}
        description={`You're about to practice ${instruction.technique.replace('_', ' ')}. Let's prepare mindfully.`}
      />

      {/* Mental Preparation */}
      <InstructionCard
        icon="🎯"
        title="Your Focus Today"
        description={instruction.mentalPreparation.intention}
      />

      {/* Common Challenges */}
      <InstructionCard
        icon="💡"
        title="Remember"
        description="Some reminders to keep in mind:"
        list={instruction.mentalPreparation.commonChallenges}
      />

      {/* Actions */}
      <XStack gap="$3" style={{ marginTop: 16 }}>
        <Button
          flex={1}
          onPress={onNext}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Prepare My Space</Text>
        </Button>
        <Button
          flex={0.3}
          onPress={onSkip}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Skip</Text>
        </Button>
      </XStack>
    </YStack>
  );
};

// ══════════════════════════════════════════════════════════════
// Step 2: Physical Setup Checklist
// ══════════════════════════════════════════════════════════════

interface PhysicalSetupStepProps {
  setup: PreSessionInstruction['physicalSetup'];
  checklist: ChecklistItem[];
  onToggle: (id: string) => void;
  onNext: () => void;
  canContinue: boolean;
}

const PhysicalSetupStep: React.FC<PhysicalSetupStepProps> = ({
  setup,
  checklist,
  onToggle,
  onNext,
  canContinue,
}) => {
  return (
    <YStack gap="$4">
      <InstructionCard
        icon="📋"
        title="Physical Setup"
        description="Check off each item as you set up your meditation space:"
      />

      {setup.map((step, index) => {
        const checklistItem = checklist.find((item) => item.id === step.order.toString());
        const isCompleted = checklistItem?.completed || false;

        return (
          <ChecklistItemCard
            key={step.order}
            icon={step.icon}
            title={step.title}
            description={step.description}
            isOptional={step.isOptional}
            isCompleted={isCompleted}
            onToggle={() => onToggle(step.order.toString())}
          />
        );
      })}

      <Button
        onPress={onNext}
        disabled={!canContinue}
        style={[styles.primaryButton, !canContinue && styles.disabledButton]}
      >
        <Text style={styles.primaryButtonText}>
          {canContinue ? 'Continue' : 'Complete Required Steps'}
        </Text>
      </Button>
    </YStack>
  );
};

// ══════════════════════════════════════════════════════════════
// Step 3: Breathing Preparation Exercise
// ══════════════════════════════════════════════════════════════

interface BreathingPrepStepProps {
  breathingPrep: NonNullable<PreSessionInstruction['breathingPrep']>;
  onComplete: () => void;
  onSkip: () => void;
}

const BreathingPrepStep: React.FC<BreathingPrepStepProps> = ({
  breathingPrep,
  onComplete,
  onSkip,
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
    <YStack gap="$4" style={{ alignItems: 'center' }}>
      <InstructionCard
        icon="🌬️"
        title="Quick Breathing Exercise"
        description={breathingPrep.instruction}
      />

      {/* Animated Breathing Circle */}
      <AnimatedBreathingCircle
        isRunning={isRunning}
        pattern={breathingPrep.pattern}
      />

      {/* Timer */}
      {isRunning && (
        <Text style={styles.timerText}>
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </Text>
      )}

      {/* Actions */}
      {!isRunning ? (
        <XStack gap="$3" style={{ width: '100%' }}>
          <Button flex={1} onPress={handleStart} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Start Breathing Prep</Text>
          </Button>
          <Button flex={0.3} onPress={onSkip} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Skip</Text>
          </Button>
        </XStack>
      ) : (
        <Button onPress={onComplete} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Finish Early</Text>
        </Button>
      )}
    </YStack>
  );
};

// ══════════════════════════════════════════════════════════════
// Step 4: Set Intention
// ══════════════════════════════════════════════════════════════

interface IntentionStepProps {
  mentalPrep: PreSessionInstruction['mentalPreparation'];
  sessionTips: string[];
  intention: string;
  onIntentionChange: (text: string) => void;
  onBegin: () => void;
}

interface IntentionStepInternalProps extends IntentionStepProps {
  alwaysSkip: boolean;
  onToggleSkip: () => void;
  t: any;
}

const IntentionStep: React.FC<IntentionStepInternalProps> = ({
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
    <YStack gap="$4">
      <InstructionCard
        icon="🎯"
        title="Set Your Intention"
        description="What would you like to cultivate in this session?"
      />

      {/* Intention Input (simplified - use TextInput in real implementation) */}
      <YStack
        style={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
          Your Intention (Optional)
        </Text>
        <Text style={{ fontSize: 16, fontStyle: 'italic', color: '#999' }}>
          {intention || 'e.g., "Stay present with my breath"'}
        </Text>
        {/* TODO: Add TextInput here */}
      </YStack>

      {/* Session Tips */}
      <InstructionCard
        icon="✨"
        title="During Your Session"
        description="Keep these tips in mind:"
        list={sessionTips}
      />

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
        <YStack flex={1}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1a1a2e' }}>
            {t('instructions.preparation.alwaysSkipInstructions')}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            {t('instructions.preparation.skipInstructionsNote')}
          </Text>
        </YStack>
      </TouchableOpacity>

      {/* Begin Button */}
      <Button onPress={onBegin} style={[styles.primaryButton, { marginTop: 16 }]}>
        <Text style={[styles.primaryButtonText, { fontSize: 18, fontWeight: '700' }]}>
          Begin Meditation
        </Text>
      </Button>
    </YStack>
  );
};

// ══════════════════════════════════════════════════════════════
// Reusable Components
// ══════════════════════════════════════════════════════════════

const InstructionCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  list?: string[];
}> = ({ icon, title, description, list }) => {
  return (
    <YStack
      style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <XStack style={{ alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 32, marginRight: 12 }}>{icon}</Text>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a2e', flex: 1 }}>
          {title}
        </Text>
      </XStack>
      <Text style={{ fontSize: 15, color: '#4a5568', lineHeight: 24, marginBottom: list ? 12 : 0 }}>
        {description}
      </Text>
      {list && list.map((item, index) => (
        <XStack key={index} style={{ marginTop: 8 }}>
          <Text style={{ color: '#667eea', marginRight: 8, fontWeight: '600' }}>•</Text>
          <Text style={{ fontSize: 14, color: '#4a5568', lineHeight: 22, flex: 1 }}>
            {item}
          </Text>
        </XStack>
      ))}
    </YStack>
  );
};

const ChecklistItemCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  isOptional: boolean;
  isCompleted: boolean;
  onToggle: () => void;
}> = ({ icon, title, description, isOptional, isCompleted, onToggle }) => {
  return (
    <YStack
      onPress={onToggle}
      style={{
        backgroundColor: isCompleted ? 'rgba(102,126,234,0.1)' : 'rgba(255,255,255,0.95)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: isCompleted ? '#667eea' : 'rgba(102,126,234,0.2)',
      }}
    >
      <XStack style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <XStack style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>{icon}</Text>
          <YStack flex={1}>
            <XStack style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1a1a2e' }}>
                {title}
              </Text>
              {isOptional && (
                <Text
                  style={{
                    fontSize: 11,
                    color: '#9ca3af',
                    marginLeft: 8,
                    fontStyle: 'italic',
                  }}
                >
                  (optional)
                </Text>
              )}
            </XStack>
            <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
              {description}
            </Text>
          </YStack>
        </XStack>
        <Ionicons
          name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={isCompleted ? '#667eea' : '#d1d5db'}
        />
      </XStack>
    </YStack>
  );
};

const AnimatedBreathingCircle: React.FC<{
  isRunning: boolean;
  pattern: 'box' | '4-7-8' | 'equal' | 'calm';
}> = ({ isRunning, pattern }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isRunning) {
      // Different patterns have different timings
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
    <YStack style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
      <Reanimated.View style={[animatedStyle]}>
        <Circle
          size={140}
          style={{
            backgroundColor: 'rgba(102,126,234,0.3)',
            borderWidth: 3,
            borderColor: '#667eea',
          }}
        />
      </Reanimated.View>
      {isRunning && (
        <Text
          style={{
            position: 'absolute',
            fontSize: 18,
            fontWeight: '600',
            color: '#667eea',
          }}
        >
          Breathe
        </Text>
      )}
    </YStack>
  );
};

const StepProgress: React.FC<{ currentStep: string }> = ({ currentStep }) => {
  const steps = ['overview', 'setup', 'breathing', 'intention'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <XStack style={{ justifyContent: 'space-between', marginVertical: 24, paddingHorizontal: 20 }}>
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;

        return (
          <React.Fragment key={step}>
            <Circle
              size={12}
              style={{
                backgroundColor: isComplete || isActive ? '#667eea' : '#e5e7eb',
              }}
            />
            {index < steps.length - 1 && (
              <YStack
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: isComplete ? '#667eea' : '#e5e7eb',
                  marginHorizontal: 4,
                  alignSelf: 'center',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </XStack>
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(102,126,234,0.3)',
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
  },
  timerText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#667eea',
    marginTop: 16,
  },
});

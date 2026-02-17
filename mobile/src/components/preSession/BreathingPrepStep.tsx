import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { TFunction } from 'i18next';
import { getThemeGradients } from '../../theme';
import { PreSessionInstruction } from '../../types/instructions';
import { GradientCard } from '../GradientCard';
import { GradientButton } from '../GradientButton';
import { Icon } from './PreSessionIcon';
import { AnimatedBreathingCircle } from './AnimatedBreathingCircle';
import { styles } from './preSessionStyles';
import type { PreSessionDynamicStyles } from './preSessionTypes';

interface BreathingPrepStepProps {
  instructionId: string;
  breathingPrep: NonNullable<PreSessionInstruction['breathingPrep']>;
  onComplete: () => void;
  onSkipStep: () => void;
  onSkipAll: () => void;
  t: TFunction;
  isDark?: boolean;
  themeGradients: ReturnType<typeof getThemeGradients>;
  dynamicStyles: PreSessionDynamicStyles;
}

export const BreathingPrepStep: React.FC<BreathingPrepStepProps> = ({
  instructionId, breathingPrep, onComplete, onSkipStep, onSkipAll, t, isDark, themeGradients, dynamicStyles,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(breathingPrep.duration);
  const [isCompleted, setIsCompleted] = useState(false);

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

      <AnimatedBreathingCircle
        isRunning={isRunning}
        pattern={breathingPrep.pattern}
        t={t}
        isDark={isDark}
        dynamicStyles={dynamicStyles}
      />

      {isRunning && (
        <Text style={[styles.timerText, dynamicStyles.timerText]}>
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </Text>
      )}

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

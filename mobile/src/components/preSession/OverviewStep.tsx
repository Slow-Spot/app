import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { TFunction } from 'i18next';
import type { getThemeGradients } from '../../theme';
import type { PreSessionInstruction } from '../../types/instructions';
import { GradientCard } from '../GradientCard';
import { GradientButton } from '../GradientButton';
import { Icon } from './PreSessionIcon';
import { styles } from './preSessionStyles';
import type { PreSessionDynamicStyles } from './preSessionTypes';

interface OverviewStepProps {
  instruction: PreSessionInstruction;
  timeGreeting: string;
  onNext: () => void;
  onSkip: () => void;
  t: TFunction;
  isDark?: boolean;
  themeGradients: ReturnType<typeof getThemeGradients>;
  dynamicStyles: PreSessionDynamicStyles;
}

export const OverviewStep: React.FC<OverviewStepProps> = ({
  instruction, timeGreeting, onNext, onSkip, t, isDark, themeGradients, dynamicStyles,
}) => {
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

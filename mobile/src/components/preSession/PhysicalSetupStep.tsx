import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { TFunction } from 'i18next';
import type { getThemeGradients } from '../../theme';
import type { PreSessionInstruction, ChecklistItem } from '../../types/instructions';
import { GradientCard } from '../GradientCard';
import { GradientButton } from '../GradientButton';
import { Icon } from './PreSessionIcon';
import { ChecklistItemCard } from './ChecklistItemCard';
import { styles } from './preSessionStyles';
import type { PreSessionDynamicStyles } from './preSessionTypes';

interface PhysicalSetupStepProps {
  instructionId: string;
  setup: PreSessionInstruction['physicalSetup'];
  checklist: ChecklistItem[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onSkip: () => void;
  canContinue: boolean;
  t: TFunction;
  isDark?: boolean;
  themeGradients: ReturnType<typeof getThemeGradients>;
  dynamicStyles: PreSessionDynamicStyles;
}

export const PhysicalSetupStep: React.FC<PhysicalSetupStepProps> = ({
  instructionId, setup, checklist, onToggle, onNext, onSkip, canContinue, t, isDark, themeGradients, dynamicStyles,
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

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TFunction } from 'i18next';
import theme, { getThemeGradients } from '../../theme';
import { PreSessionInstruction } from '../../types/instructions';
import { GradientCard } from '../GradientCard';
import { GradientButton } from '../GradientButton';
import { Icon } from './PreSessionIcon';
import { styles } from './preSessionStyles';
import type { PreSessionDynamicStyles } from './preSessionTypes';

interface IntentionStepProps {
  instructionId: string;
  mentalPrep: PreSessionInstruction['mentalPreparation'];
  sessionTips: string[];
  intention: string;
  onIntentionChange: (text: string) => void;
  onBegin: () => void;
  alwaysSkip: boolean;
  onToggleSkip: () => void;
  t: TFunction;
  isDark?: boolean;
  themeGradients: ReturnType<typeof getThemeGradients>;
  dynamicStyles: PreSessionDynamicStyles;
}

export const IntentionStep: React.FC<IntentionStepProps> = ({
  instructionId, mentalPrep, sessionTips, intention, onIntentionChange, onBegin, alwaysSkip, onToggleSkip,
  t, isDark, themeGradients, dynamicStyles,
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

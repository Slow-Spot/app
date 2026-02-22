import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PreSessionInstruction, ChecklistItem } from '../../types/instructions';
import { GradientBackground } from '../GradientBackground';
import theme, { getThemeColors, getThemeGradients } from '../../theme';
import { userPreferences } from '../../services/userPreferences';
import { usePersonalization } from '../../contexts/PersonalizationContext';

import { OverviewStep } from './OverviewStep';
import { PhysicalSetupStep } from './PhysicalSetupStep';
import { BreathingPrepStep } from './BreathingPrepStep';
import { IntentionStep } from './IntentionStep';
import { StepProgress } from './StepProgress';
import { styles } from './preSessionStyles';
import type { PreSessionDynamicStyles } from './preSessionTypes';

interface PreSessionInstructionsProps {
  instruction: PreSessionInstruction;
  onComplete: (intention: string) => void;
  onSkip: () => void;
  isDark?: boolean;
}

export const PreSessionInstructions: React.FC<PreSessionInstructionsProps> = ({
  instruction,
  onComplete,
  onSkip: _onSkip,
  isDark = false,
}) => {
  const { t } = useTranslation();
  const { currentTheme } = usePersonalization();
  const insets = useSafeAreaInsets();

  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  const dynamicStyles: PreSessionDynamicStyles = useMemo(() => ({
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
    iconBoxBg: isDark ? `${currentTheme.primary}40` : `${currentTheme.primary}26`,
    iconBoxBgCompleted: currentTheme.primary,
    iconColor: currentTheme.primary,
    iconColorCompleted: colors.neutral.white,
    checkboxColor: currentTheme.primary,
    checkboxColorUnchecked: isDark ? `${currentTheme.primary}CC` : `${currentTheme.primary}40`,
    progressActiveColor: currentTheme.primary,
  }), [colors, isDark, currentTheme]);

  const [currentStep, setCurrentStep] = useState<'overview' | 'setup' | 'breathing' | 'intention'>('overview');
  const [setupChecklist, setSetupChecklist] = useState<ChecklistItem[]>([]);
  const [_breathingPrepComplete, setBreathingPrepComplete] = useState(false);
  const [userIntention, setUserIntention] = useState('');
  const [alwaysSkip, setAlwaysSkip] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
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

  const handleSkipPress = () => {
    setShowSkipModal(true);
  };

  const handleSkipConfirm = async () => {
    if (dontShowAgain) {
      await userPreferences.setSkipPreSessionInstructions(true);
    }
    setShowSkipModal(false);
    setCurrentStep('intention');
  };

  const handleSkipCancel = () => {
    setShowSkipModal(false);
    setDontShowAgain(false);
  };

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
                  colors={[...currentTheme.gradient]}
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
        <View style={styles.header}>
          <Text style={[styles.title, dynamicStyles.title]}>{t(`instructions.${instruction.id}.title`)}</Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>{t(`instructions.${instruction.id}.subtitle`)}</Text>
        </View>

        <StepProgress currentStep={currentStep} t={t} isDark={isDark} />

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

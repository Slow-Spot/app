import { logger } from '../utils/logger';
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TextInput, Pressable, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import { GradientButton } from '../components/GradientButton';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import { brandColors, primaryColor, featureColorPalettes } from '../theme/colors';
import {
  saveCustomSession,
  updateCustomSession,
  CustomSessionConfig,
  BreathingPattern,
  CustomBreathingPattern
} from '../services/customSessionStorage';
import { usePersonalization } from '../contexts/PersonalizationContext';

// Re-export types for external use
export type { CustomSessionConfig, BreathingPattern, CustomBreathingPattern };

interface CustomSessionBuilderScreenProps {
  isDark?: boolean;
  onStartSession: (config: CustomSessionConfig) => void;
  onBack: () => void;
  editSessionId?: string;
  initialConfig?: CustomSessionConfig;
}

const DURATION_PRESETS = [5, 10, 15, 20, 30, 45];

export const CustomSessionBuilderScreen: React.FC<CustomSessionBuilderScreenProps> = ({
  isDark = false,
  onStartSession,
  onBack,
  editSessionId,
  initialConfig,
}) => {
  const { t } = useTranslation();
  const { currentTheme } = usePersonalization();

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Feature color palettes for beautiful icons
  const iconColors = useMemo(() => ({
    purple: {
      bg: isDark ? `rgba(${featureColorPalettes.violet.rgb}, 0.2)` : `rgba(${featureColorPalettes.violet.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.violet.darkIcon : featureColorPalettes.violet.lightIcon,
    },
    emerald: {
      bg: isDark ? `rgba(${featureColorPalettes.emerald.rgb}, 0.2)` : `rgba(${featureColorPalettes.emerald.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.emerald.darkIcon : featureColorPalettes.emerald.lightIcon,
    },
    teal: {
      bg: isDark ? `rgba(${featureColorPalettes.teal.rgb}, 0.2)` : `rgba(${featureColorPalettes.teal.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.teal.darkIcon : featureColorPalettes.teal.lightIcon,
    },
    amber: {
      bg: isDark ? `rgba(${featureColorPalettes.amber.rgb}, 0.2)` : `rgba(${featureColorPalettes.amber.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.amber.darkIcon : featureColorPalettes.amber.lightIcon,
    },
    indigo: {
      bg: isDark ? `rgba(${featureColorPalettes.indigo.rgb}, 0.2)` : `rgba(${featureColorPalettes.indigo.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.indigo.darkIcon : featureColorPalettes.indigo.lightIcon,
    },
    rose: {
      bg: isDark ? `rgba(${featureColorPalettes.rose.rgb}, 0.2)` : `rgba(${featureColorPalettes.rose.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.rose.darkIcon : featureColorPalettes.rose.lightIcon,
    },
    sky: {
      bg: isDark ? `rgba(${featureColorPalettes.sky.rgb}, 0.2)` : `rgba(${featureColorPalettes.sky.rgb}, 0.1)`,
      icon: isDark ? featureColorPalettes.sky.darkIcon : featureColorPalettes.sky.lightIcon,
    },
  }), [isDark]);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    subtitle: { color: colors.text.secondary },
    backIcon: colors.text.primary,
    sectionTitle: { color: colors.text.primary },
    sectionDescription: { color: colors.text.secondary },
    label: { color: colors.text.secondary },
    textInput: {
      borderColor: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[300],
      color: colors.text.primary,
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    },
    optionBg: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    optionBorder: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[200],
    optionSelectedBg: isDark ? `${currentTheme.primary}40` : `${currentTheme.primary}26`,
    optionSelectedBorder: currentTheme.primary,
    switchTrackFalse: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[300],
    switchTrackTrue: currentTheme.primary,
    quickStartText: { color: colors.text.secondary },
  }), [colors, isDark, currentTheme]);

  // Session configuration state - simplified
  const [durationMinutes, setDurationMinutes] = useState(initialConfig?.durationMinutes || 15);
  const [ambientSound, setAmbientSound] = useState<CustomSessionConfig['ambientSound']>(
    initialConfig?.ambientSound || 'silence'
  );
  const [intervalBellEnabled, setIntervalBellEnabled] = useState(initialConfig?.intervalBellEnabled ?? false);
  const [intervalBellMinutes, setIntervalBellMinutes] = useState(initialConfig?.intervalBellMinutes ?? 5);
  const [wakeUpChimeEnabled, setWakeUpChimeEnabled] = useState(initialConfig?.wakeUpChimeEnabled ?? true);
  const [vibrationEnabled, setVibrationEnabled] = useState(initialConfig?.vibrationEnabled ?? true);
  const [breathingPattern, setBreathingPattern] = useState<BreathingPattern>(initialConfig?.breathingPattern || 'none');
  const [sessionName, setSessionName] = useState(initialConfig?.name || '');
  const [hideCountdown, setHideCountdown] = useState(initialConfig?.hideCountdown ?? false);

  // Local editing state
  const [localEditSessionId, setLocalEditSessionId] = useState<string | number | undefined>(editSessionId);

  // Audio preview
  const [chimeSound, setChimeSound] = useState<AudioPlayer | null>(null);

  useEffect(() => {
    loadAudio();

    return () => {
      if (chimeSound) {
        chimeSound.release();
      }
    };
  }, []);

  const loadAudio = async () => {
    try {
      const player = createAudioPlayer(
        require('../../assets/sounds/meditation-bell.mp3')
      );
      setChimeSound(player);
    } catch (error) {
      logger.error('Error loading audio:', error);
    }
  };

  const ambientSoundOptions = [
    { id: 'silence', icon: 'volume-mute-outline' as const, label: t('custom.sounds.silence'), color: iconColors.purple },
    { id: 'nature', icon: 'leaf-outline' as const, label: t('custom.sounds.nature'), color: iconColors.emerald },
    { id: 'ocean', icon: 'water-outline' as const, label: t('custom.sounds.ocean'), color: iconColors.sky },
    { id: 'forest', icon: 'flower-outline' as const, label: t('custom.sounds.forest'), color: iconColors.teal },
    { id: '432hz', icon: 'musical-notes-outline' as const, label: t('custom.sounds.432hz'), color: iconColors.indigo },
    { id: '528hz', icon: 'radio-outline' as const, label: t('custom.sounds.528hz'), color: iconColors.rose },
  ];

  // Breathing pattern options with scientific descriptions
  const breathingPatternOptions: Array<{
    id: BreathingPattern;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    description: string;
    timing: string;
    color: { bg: string; icon: string };
  }> = [
    {
      id: 'none',
      icon: 'pause-outline',
      label: t('custom.breathing.none', 'Bez instrukcji'),
      description: t('custom.breathing.noneDesc', 'Medytuj bez wzorca oddechowego'),
      timing: '',
      color: iconColors.purple,
    },
    {
      id: 'box',
      icon: 'square-outline',
      label: t('custom.breathing.box', 'Box Breathing'),
      description: t('custom.breathing.boxDesc', 'Aktywuje układ przywspółczulny, redukuje kortyzol'),
      timing: '4-4-4-4',
      color: iconColors.emerald,
    },
    {
      id: '4-7-8',
      icon: 'moon-outline',
      label: t('custom.breathing.478', '4-7-8'),
      description: t('custom.breathing.478Desc', 'Naturalny środek uspokajający dla układu nerwowego'),
      timing: '4-7-8',
      color: iconColors.indigo,
    },
    {
      id: 'equal',
      icon: 'swap-horizontal-outline',
      label: t('custom.breathing.equal', 'Equal Breathing'),
      description: t('custom.breathing.equalDesc', 'Równoważy układ nerwowy, zwiększa skupienie'),
      timing: '4-4',
      color: iconColors.teal,
    },
    {
      id: 'calm',
      icon: 'water-outline',
      label: t('custom.breathing.calm', 'Calm Breathing'),
      description: t('custom.breathing.calmDesc', 'Dłuższy wydech aktywuje reakcję relaksacyjną'),
      timing: '4-6',
      color: iconColors.sky,
    },
  ];

  const getCurrentConfig = (): CustomSessionConfig => ({
    durationMinutes,
    ambientSound,
    intervalBellEnabled,
    intervalBellMinutes,
    wakeUpChimeEnabled,
    voiceGuidanceEnabled: false,
    vibrationEnabled,
    breathingPattern,
    name: sessionName || undefined,
    hideCountdown,
  });

  const handleStartSession = () => {
    onStartSession(getCurrentConfig());
  };

  const handleSaveSession = async () => {
    const config = getCurrentConfig();

    if (!config.name || config.name.trim().length === 0) {
      Alert.alert(
        t('custom.saveError') || 'Error',
        t('custom.sessionNameRequired') || 'Please enter a session name before saving.',
        [{ text: t('common.ok') || 'OK' }]
      );
      return;
    }

    const currentEditId = localEditSessionId || editSessionId;

    try {
      if (currentEditId) {
        await updateCustomSession(String(currentEditId), config);
        setLocalEditSessionId(undefined);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // After update, go back to list
        onBack();
      } else {
        await saveCustomSession(config);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // After save, go back to list
        onBack();
      }
    } catch (error) {
      logger.error('Error saving custom session:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t('custom.saveError') || 'Error',
        t('custom.saveFailed') || 'Failed to save session. Please try again.',
        [{ text: t('common.ok') || 'OK' }]
      );
    }
  };

  // Render icon box with consistent styling - rounded corners (not circle) to match app style
  const renderIconBox = (iconName: keyof typeof Ionicons.glyphMap, colorSet: { bg: string; icon: string }, size: number = 44) => (
    <View style={[styles.iconBox, { backgroundColor: colorSet.bg, width: size, height: size, borderRadius: 12 }]}>
      <Ionicons name={iconName} size={size * 0.5} color={colorSet.icon} />
    </View>
  );

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={dynamicStyles.backIcon} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={[styles.title, dynamicStyles.title]}>{t('custom.title')}</Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>{t('custom.subtitle')}</Text>
          </View>
        </View>

        {/* Session Name */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section} isDark={isDark}>
          <View style={styles.sectionHeader}>
            {renderIconBox('create-outline', iconColors.indigo)}
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.sessionName')}</Text>
              <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>
                {t('custom.sessionNameHint') || 'Optional - for saving'}
              </Text>
            </View>
          </View>
          <TextInput
            style={[styles.textInput, dynamicStyles.textInput]}
            placeholder={t('custom.sessionNamePlaceholder')}
            value={sessionName}
            onChangeText={setSessionName}
            placeholderTextColor={colors.text.tertiary}
          />
        </GradientCard>

        {/* Duration Selection - Grid with custom input */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section} isDark={isDark}>
          <View style={styles.sectionHeader}>
            {renderIconBox('time-outline', iconColors.amber)}
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.duration')}</Text>
              <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>{t('custom.durationDescription')}</Text>
            </View>
          </View>

          <View style={styles.durationGrid}>
            {DURATION_PRESETS.map((minutes) => {
              const isActive = durationMinutes === minutes;
              return (
                <Pressable
                  key={minutes}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setDurationMinutes(minutes);
                  }}
                  style={[
                    styles.durationButton,
                    {
                      backgroundColor: isActive ? dynamicStyles.optionSelectedBg : dynamicStyles.optionBg,
                      borderColor: isActive ? dynamicStyles.optionSelectedBorder : dynamicStyles.optionBorder,
                    }
                  ]}
                >
                  <Text style={[
                    styles.durationValue,
                    { color: isActive ? currentTheme.primary : colors.text.primary }
                  ]}>
                    {minutes}
                  </Text>
                  <Text style={[
                    styles.durationLabel,
                    { color: isActive ? currentTheme.primary : colors.text.secondary }
                  ]}>
                    {t('custom.min')}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Custom duration input */}
          <View style={styles.customDurationRow}>
            <Text style={[styles.customDurationLabel, { color: colors.text.secondary }]}>
              {t('custom.customDuration')}
            </Text>
            <View style={styles.customDurationInputContainer}>
              <TextInput
                style={[styles.customDurationInput, dynamicStyles.textInput]}
                keyboardType="numeric"
                value={String(durationMinutes)}
                onChangeText={(text) => {
                  const num = parseInt(text, 10);
                  if (!isNaN(num) && num > 0 && num <= 180) {
                    setDurationMinutes(num);
                  } else if (text === '') {
                    setDurationMinutes(1);
                  }
                }}
                maxLength={3}
                selectTextOnFocus
              />
              <Text style={[styles.customDurationUnit, { color: colors.text.secondary }]}>
                {t('custom.min')}
              </Text>
            </View>
          </View>
        </GradientCard>

        {/* Ambient Sound Selection - Clean grid */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section} isDark={isDark}>
          <View style={styles.sectionHeader}>
            {renderIconBox('musical-notes-outline', iconColors.rose)}
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.ambientSound')}</Text>
              <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>{t('custom.ambientDescription')}</Text>
            </View>
          </View>

          <View style={styles.soundGrid}>
            {ambientSoundOptions.map((option) => {
              const isActive = ambientSound === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setAmbientSound(option.id as CustomSessionConfig['ambientSound']);
                  }}
                  style={[
                    styles.soundOption,
                    {
                      backgroundColor: isActive ? dynamicStyles.optionSelectedBg : dynamicStyles.optionBg,
                      borderColor: isActive ? dynamicStyles.optionSelectedBorder : dynamicStyles.optionBorder,
                    }
                  ]}
                >
                  <View style={[styles.soundIconBox, { backgroundColor: option.color.bg }]}>
                    <Ionicons name={option.icon} size={22} color={isActive ? currentTheme.primary : option.color.icon} />
                  </View>
                  <Text style={[
                    styles.soundLabel,
                    { color: isActive ? currentTheme.primary : colors.text.primary }
                  ]} numberOfLines={1}>
                    {option.label}
                  </Text>
                  {isActive && (
                    <View style={[styles.selectedIndicator, { backgroundColor: currentTheme.primary }]}>
                      <Ionicons name="checkmark" size={10} color="white" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </GradientCard>

        {/* Bell Settings - Combined */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section} isDark={isDark}>
          <View style={styles.sectionHeader}>
            {renderIconBox('notifications-outline', iconColors.teal)}
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.bells')}</Text>
              <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>
                {t('custom.bellsDescription')}
              </Text>
            </View>
          </View>

          {/* Wake-up chime */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: colors.text.primary }]}>{t('custom.wakeUpChime')}</Text>
              <Text style={[styles.toggleHint, { color: colors.text.tertiary }]}>{t('custom.wakeUpChimeHint')}</Text>
            </View>
            <Switch
              value={wakeUpChimeEnabled}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setWakeUpChimeEnabled(value);
              }}
              trackColor={{
                false: dynamicStyles.switchTrackFalse,
                true: dynamicStyles.switchTrackTrue,
              }}
              thumbColor={colors.neutral.white}
            />
          </View>

          <View style={styles.divider} />

          {/* Vibration */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: colors.text.primary }]}>{t('custom.vibration')}</Text>
              <Text style={[styles.toggleHint, { color: colors.text.tertiary }]}>{t('custom.vibrationHint')}</Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setVibrationEnabled(value);
              }}
              trackColor={{
                false: dynamicStyles.switchTrackFalse,
                true: dynamicStyles.switchTrackTrue,
              }}
              thumbColor={colors.neutral.white}
            />
          </View>

          <View style={styles.divider} />

          {/* Hide countdown timer */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: colors.text.primary }]}>{t('custom.hideCountdown')}</Text>
              <Text style={[styles.toggleHint, { color: colors.text.tertiary }]}>{t('custom.hideCountdownHint')}</Text>
            </View>
            <Switch
              value={hideCountdown}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setHideCountdown(value);
              }}
              trackColor={{
                false: dynamicStyles.switchTrackFalse,
                true: dynamicStyles.switchTrackTrue,
              }}
              thumbColor={colors.neutral.white}
            />
          </View>

          <View style={styles.divider} />

          {/* Interval bell */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleLabel, { color: colors.text.primary }]}>{t('custom.intervalBell')}</Text>
              <Text style={[styles.toggleHint, { color: colors.text.tertiary }]}>{t('custom.intervalBellHint')}</Text>
            </View>
            <Switch
              value={intervalBellEnabled}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIntervalBellEnabled(value);
              }}
              trackColor={{
                false: dynamicStyles.switchTrackFalse,
                true: dynamicStyles.switchTrackTrue,
              }}
              thumbColor={colors.neutral.white}
            />
          </View>

          {intervalBellEnabled && (
            <>
              <View style={styles.intervalOptions}>
                {[3, 5, 10].map((minutes) => {
                  const isActive = intervalBellMinutes === minutes;
                  const isDisabled = minutes >= durationMinutes;
                  return (
                    <Pressable
                      key={minutes}
                      onPress={() => {
                        if (!isDisabled) {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setIntervalBellMinutes(minutes);
                        }
                      }}
                      style={[
                        styles.intervalButton,
                        {
                          backgroundColor: isActive ? dynamicStyles.optionSelectedBg : dynamicStyles.optionBg,
                          borderColor: isActive ? dynamicStyles.optionSelectedBorder : dynamicStyles.optionBorder,
                          opacity: isDisabled ? 0.4 : 1,
                        }
                      ]}
                    >
                      <Text style={[
                        styles.intervalText,
                        { color: isActive ? currentTheme.primary : colors.text.primary }
                      ]}>
                        {minutes} {t('custom.min')}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Custom interval input */}
              <View style={styles.customIntervalRow}>
                <Text style={[styles.customDurationLabel, { color: colors.text.secondary }]}>
                  {t('custom.customInterval')}
                </Text>
                <View style={styles.customDurationInputContainer}>
                  <TextInput
                    style={[
                      styles.customDurationInput,
                      dynamicStyles.textInput,
                      intervalBellMinutes >= durationMinutes && { borderColor: '#EF4444' }
                    ]}
                    keyboardType="numeric"
                    value={String(intervalBellMinutes)}
                    onChangeText={(text) => {
                      const num = parseInt(text, 10);
                      if (!isNaN(num) && num > 0) {
                        setIntervalBellMinutes(num);
                      } else if (text === '') {
                        setIntervalBellMinutes(1);
                      }
                    }}
                    maxLength={3}
                    selectTextOnFocus
                  />
                  <Text style={[styles.customDurationUnit, { color: colors.text.secondary }]}>
                    {t('custom.min')}
                  </Text>
                </View>
              </View>

              {/* Validation warning */}
              {intervalBellMinutes >= durationMinutes && (
                <Text style={styles.intervalWarning}>
                  {t('custom.intervalWarning') || 'Interwał musi być krótszy niż czas sesji'}
                </Text>
              )}
            </>
          )}
        </GradientCard>

        {/* Breathing Pattern Selection */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section} isDark={isDark}>
          <View style={styles.sectionHeader}>
            {renderIconBox('pulse-outline', iconColors.emerald)}
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                {t('custom.breathingTitle', 'Wzorzec oddechowy')}
              </Text>
              <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>
                {t('custom.breathingDescription', 'Wybierz technikę wspieraną badaniami naukowymi')}
              </Text>
            </View>
          </View>

          <View style={styles.breathingGrid}>
            {breathingPatternOptions.map((option) => {
              const isActive = breathingPattern === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setBreathingPattern(option.id);
                  }}
                  style={[
                    styles.breathingOption,
                    {
                      backgroundColor: isActive ? dynamicStyles.optionSelectedBg : dynamicStyles.optionBg,
                      borderColor: isActive ? dynamicStyles.optionSelectedBorder : dynamicStyles.optionBorder,
                    }
                  ]}
                >
                  <View style={styles.breathingOptionHeader}>
                    <View style={[styles.breathingIconBox, { backgroundColor: option.color.bg }]}>
                      <Ionicons name={option.icon} size={20} color={isActive ? currentTheme.primary : option.color.icon} />
                    </View>
                    <View style={styles.breathingOptionTitleContainer}>
                      <Text style={[
                        styles.breathingOptionLabel,
                        { color: isActive ? currentTheme.primary : colors.text.primary }
                      ]} numberOfLines={1}>
                        {option.label}
                      </Text>
                      {option.timing && (
                        <Text style={[
                          styles.breathingTiming,
                          { color: isActive ? currentTheme.primary : colors.text.secondary }
                        ]}>
                          {option.timing}
                        </Text>
                      )}
                    </View>
                    {isActive && (
                      <View style={[styles.selectedIndicator, { backgroundColor: currentTheme.primary }]}>
                        <Ionicons name="checkmark" size={10} color="white" />
                      </View>
                    )}
                  </View>
                  <Text style={[
                    styles.breathingOptionDesc,
                    { color: colors.text.tertiary }
                  ]} numberOfLines={2}>
                    {option.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </GradientCard>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <GradientButton
            title={t('custom.startSession')}
            onPress={handleStartSession}
            gradient={themeGradients.button.primary}
            style={styles.actionButton}
          />

          {sessionName.trim().length > 0 && (
            <Pressable onPress={handleSaveSession} style={styles.saveButton}>
              <Ionicons name="bookmark-outline" size={18} color={currentTheme.primary} />
              <Text style={[styles.saveButtonText, { color: currentTheme.primary }]}>
                {(editSessionId || localEditSessionId) ? t('custom.updateSession') : t('custom.saveSession')}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  backButton: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionHeaderText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: theme.typography.fontSizes.sm,
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
  },
  // Duration grid
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  durationButton: {
    width: '31%',
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationValue: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  durationLabel: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 2,
  },
  // Custom duration row
  customDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  customDurationLabel: {
    fontSize: theme.typography.fontSizes.sm,
    marginRight: theme.spacing.sm,
  },
  customDurationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customDurationInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    textAlign: 'center',
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    paddingHorizontal: theme.spacing.sm,
  },
  customDurationUnit: {
    fontSize: theme.typography.fontSizes.sm,
    marginLeft: theme.spacing.xs,
  },
  // Sound grid
  soundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  soundOption: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    position: 'relative',
  },
  soundIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12, // Rounded square to match app icon style
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  soundLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Toggle rows
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  toggleInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  toggleLabel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
  toggleHint: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: theme.spacing.sm,
  },
  intervalOptions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  intervalButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
  },
  intervalText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  customIntervalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  intervalWarning: {
    color: '#EF4444',
    fontSize: theme.typography.fontSizes.xs,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  // Breathing pattern styles
  breathingGrid: {
    gap: theme.spacing.sm,
  },
  breathingOption: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    padding: theme.spacing.md,
  },
  breathingOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  breathingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingOptionTitleContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  breathingOptionLabel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  breathingTiming: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    marginTop: 1,
  },
  breathingOptionDesc: {
    fontSize: theme.typography.fontSizes.xs,
    marginLeft: 36 + theme.spacing.sm, // Align with title
    lineHeight: 16,
  },
  // Buttons
  buttonContainer: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
  },
  saveButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

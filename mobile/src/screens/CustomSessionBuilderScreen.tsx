import { logger } from '../utils/logger';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TextInput, Pressable, Animated, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import { GradientButton } from '../components/GradientButton';
import theme, { gradients, getThemeColors, getThemeGradients } from '../theme';
import { saveCustomSession, updateCustomSession, getAllCustomSessions, deleteCustomSession, SavedCustomSession } from '../services/customSessionStorage';

export interface CustomSessionConfig {
  durationMinutes: number;
  ambientSound: 'nature' | 'silence' | '432hz' | '528hz' | 'ocean' | 'forest';
  intervalBellEnabled: boolean;
  intervalBellMinutes: number;
  wakeUpChimeEnabled: boolean;
  voiceGuidanceEnabled: boolean;
  name?: string;
}

interface CustomSessionBuilderScreenProps {
  isDark?: boolean;
  onStartSession: (config: CustomSessionConfig) => void;
  onBack: () => void;
  editSessionId?: string; // If provided, we're editing an existing session
  initialConfig?: CustomSessionConfig; // Initial values when editing
}

const DURATION_PRESETS = [5, 10, 15, 20, 30];
const INTERVAL_PRESETS = [3, 5, 10];

export const CustomSessionBuilderScreen: React.FC<CustomSessionBuilderScreenProps> = ({
  isDark = false,
  onStartSession,
  onBack,
  editSessionId,
  initialConfig,
}) => {
  const { t } = useTranslation();

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Dynamic styles based on theme - using mint accent for consistency
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    subtitle: { color: colors.text.secondary },
    backIcon: colors.text.primary,
    sectionTitle: { color: colors.text.primary },
    sectionDescription: { color: colors.text.secondary },
    label: { color: colors.text.secondary },
    currentValue: { color: colors.accent.mint[600] },
    textInput: {
      borderColor: isDark ? colors.neutral.charcoal[100] : theme.colors.border.default,
      color: colors.text.primary,
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    },
    durationInput: {
      borderColor: isDark ? colors.neutral.charcoal[100] : theme.colors.border.default,
      color: colors.text.primary,
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    },
    presetButtonInactive: {
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
      borderColor: isDark ? colors.neutral.charcoal[100] : theme.colors.border.light,
    },
    presetButtonText: { color: colors.text.secondary },
    ambientOptionInactive: {
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
      borderColor: isDark ? colors.neutral.charcoal[100] : theme.colors.border.light,
    },
    ambientOptionText: { color: colors.text.secondary },
    ambientIconColor: colors.text.primary,
    intervalOptionsContainer: {
      borderTopColor: isDark ? colors.neutral.charcoal[100] : theme.colors.border.light,
    },
    smallPresetButtonInactive: {
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
      borderColor: isDark ? colors.neutral.charcoal[100] : theme.colors.border.light,
    },
    smallPresetButtonText: { color: colors.text.secondary },
    quickStartText: { color: colors.text.secondary },
    savedSessionsTitle: { color: colors.text.primary },
    savedSessionsIconColor: colors.accent.mint[500],
    switchTrackColorFalse: isDark ? colors.neutral.charcoal[100] : theme.colors.neutral.gray[200],
    switchTrackColorTrue: colors.accent.mint[500],
  }), [colors, isDark]);

  // Session configuration state - initialize with initialConfig if editing
  const [durationMinutes, setDurationMinutes] = useState(initialConfig?.durationMinutes || 15);
  const [customDuration, setCustomDuration] = useState('');
  const [ambientSound, setAmbientSound] = useState<CustomSessionConfig['ambientSound']>(
    initialConfig?.ambientSound || 'nature'
  );
  const [intervalBellEnabled, setIntervalBellEnabled] = useState(initialConfig?.intervalBellEnabled || false);
  const [intervalBellMinutes, setIntervalBellMinutes] = useState(initialConfig?.intervalBellMinutes || 5);
  const [customInterval, setCustomInterval] = useState('');
  const [wakeUpChimeEnabled, setWakeUpChimeEnabled] = useState(
    initialConfig?.wakeUpChimeEnabled !== undefined ? initialConfig.wakeUpChimeEnabled : false
  );
  const [voiceGuidanceEnabled, setVoiceGuidanceEnabled] = useState(initialConfig?.voiceGuidanceEnabled || false);
  const [sessionName, setSessionName] = useState(initialConfig?.name || '');

  // Local editing state for quick edits from saved sessions list
  const [localEditSessionId, setLocalEditSessionId] = useState<string | number | undefined>(editSessionId);

  // Saved sessions state
  const [savedSessions, setSavedSessions] = useState<SavedCustomSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Audio preview
  const [chimeSound, setChimeSound] = useState<Audio.Sound | null>(null);

  // Load audio on mount
  useEffect(() => {
    loadSavedSessions();
    loadAudio();

    return () => {
      // Cleanup audio on unmount
      if (chimeSound) {
        chimeSound.unloadAsync();
      }
    };
  }, []);

  const loadAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/meditation-bell.mp3')
      );
      setChimeSound(sound);
    } catch (error) {
      logger.error('Error loading audio:', error);
    }
  };

  const loadSavedSessions = async () => {
    try {
      setLoadingSessions(true);
      const sessions = await getAllCustomSessions();
      setSavedSessions(sessions);
    } catch (error) {
      logger.error('Error loading saved sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const ambientSoundOptions = [
    { id: 'silence', icon: 'volume-mute', label: t('custom.ambientSilence') },
    { id: 'nature', icon: 'leaf', label: t('custom.ambientNature') },
    { id: 'ocean', icon: 'water', label: t('custom.ambientOcean') },
    { id: 'forest', icon: 'flower', label: t('custom.ambientForest') },
    { id: '432hz', icon: 'radio', label: t('custom.ambient432hz') },
    { id: '528hz', icon: 'musical-notes', label: t('custom.ambient528hz') },
  ] as const;

  // Helper function to get translated ambient sound label
  const getAmbientSoundLabel = (soundId: string | undefined): string => {
    if (!soundId) return t('custom.ambientSilence');
    const option = ambientSoundOptions.find(opt => opt.id === soundId);
    return option?.label || t('custom.ambientSilence');
  };

  const getCurrentConfig = (): CustomSessionConfig => {
    return {
      durationMinutes,
      ambientSound,
      intervalBellEnabled,
      intervalBellMinutes,
      wakeUpChimeEnabled,
      voiceGuidanceEnabled,
      name: sessionName || undefined,
    };
  };

  const handleStartSession = () => {
    onStartSession(getCurrentConfig());
  };

  const handleSaveSession = async () => {
    const config = getCurrentConfig();

    // Validate session name
    if (!config.name || config.name.trim().length === 0) {
      Alert.alert(
        t('custom.saveError') || 'Error',
        t('custom.sessionNameRequired') || 'Please enter a session name before saving.',
        [{ text: t('common.ok') || 'OK' }]
      );
      return;
    }

    // Use localEditSessionId if available (from quick edit), otherwise use editSessionId prop
    const currentEditId = localEditSessionId || editSessionId;

    try {
      if (currentEditId) {
        // Update existing session
        await updateCustomSession(String(currentEditId), config);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Reload sessions list to show updated session
        await loadSavedSessions();

        // Clear edit mode
        setLocalEditSessionId(undefined);

        Alert.alert(
          t('custom.saveSuccess') || 'Success',
          t('custom.sessionUpdated') || 'Your session has been updated successfully!',
          [
            {
              text: t('common.ok') || 'OK',
              onPress: () => {
                // Reset form to default state
                setSessionName('');
                setDurationMinutes(15);
                setAmbientSound('nature');
                setIntervalBellEnabled(false);
                setWakeUpChimeEnabled(true);
              },
            },
          ]
        );
      } else {
        // Save new session
        await saveCustomSession(config);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Reload sessions list to show new session
        await loadSavedSessions();

        Alert.alert(
          t('custom.saveSuccess') || 'Success',
          t('custom.sessionSaved') || 'Your session has been saved successfully!',
          [
            {
              text: t('custom.startNow') || 'Start Now',
              onPress: () => onStartSession(config),
            },
            {
              text: t('custom.backToList') || 'Back to List',
              onPress: onBack,
              style: 'cancel',
            },
          ]
        );
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

  const handleSaveAndStart = async () => {
    const config = getCurrentConfig();

    // If no name, just start without saving
    if (!config.name || config.name.trim().length === 0) {
      onStartSession(config);
      return;
    }

    try {
      if (!editSessionId) {
        // Only save if it's a new session (not editing)
        await saveCustomSession(config);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onStartSession(config);
    } catch (error) {
      logger.error('Error saving custom session:', error);
      // Still start the session even if save failed
      onStartSession(config);
    }
  };

  const handleCustomDurationChange = (text: string) => {
    setCustomDuration(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 120) {
      setDurationMinutes(parsed);
    }
  };

  const handleCustomIntervalChange = (text: string) => {
    setCustomInterval(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 60) {
      setIntervalBellMinutes(parsed);
    }
  };

  const playPreviewSound = async () => {
    if (chimeSound) {
      try {
        await chimeSound.replayAsync();
      } catch (error) {
        logger.error('Error playing preview sound:', error);
      }
    }
  };

  const handleEditSavedSession = (session: SavedCustomSession) => {
    // Load the session data into the form
    setDurationMinutes(session.config.durationMinutes);
    setAmbientSound(session.config.ambientSound);
    setIntervalBellEnabled(session.config.intervalBellEnabled);
    setIntervalBellMinutes(session.config.intervalBellMinutes);
    setWakeUpChimeEnabled(session.config.wakeUpChimeEnabled);
    setVoiceGuidanceEnabled(session.config.voiceGuidanceEnabled);
    setSessionName(session.title);

    // Set edit mode with session ID
    setLocalEditSessionId(session.id);
  };

  const handleDeleteSavedSession = async (session: SavedCustomSession) => {
    Alert.alert(
      t('custom.deleteConfirmTitle') || 'Delete Session',
      t('custom.deleteConfirmMessage', { name: session.title }) || `Are you sure you want to delete "${session.title}"?`,
      [
        {
          text: t('common.cancel') || 'Cancel',
          style: 'cancel',
        },
        {
          text: t('custom.delete') || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCustomSession(String(session.id));
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              // Reload the sessions list
              await loadSavedSessions();
            } catch (error) {
              logger.error('Error deleting session:', error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert(
                t('custom.deleteError') || 'Error',
                t('custom.deleteFailed') || 'Failed to delete session. Please try again.',
                [{ text: t('common.ok') || 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  const handleLongPressSavedSession = (session: SavedCustomSession) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      session.title,
      t('custom.sessionOptions') || 'What would you like to do?',
      [
        {
          text: t('custom.editSession') || 'Edit',
          onPress: () => handleEditSavedSession(session),
        },
        {
          text: t('custom.deleteSession') || 'Delete',
          onPress: () => handleDeleteSavedSession(session),
          style: 'destructive',
        },
        {
          text: t('common.cancel') || 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

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

        {/* My Saved Sessions */}
        {savedSessions.length > 0 && (
          <GradientCard gradient={themeGradients.card.lightCard} style={styles.savedSessionsSection}>
            <View style={styles.savedSessionsHeader}>
              <Ionicons name="bookmark" size={24} color={dynamicStyles.savedSessionsIconColor} />
              <Text style={[styles.savedSessionsTitle, dynamicStyles.savedSessionsTitle]}>
                {t('custom.mySavedSessions')}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.savedSessionsScroll}
            >
              {savedSessions.map((session) => (
                <Pressable
                  key={session.id}
                  onPress={() => onStartSession(session.config)}
                  onLongPress={() => handleLongPressSavedSession(session)}
                  style={styles.savedSessionCard}
                >
                  <LinearGradient
                    colors={themeGradients.card.mintCard.colors}
                    start={themeGradients.card.mintCard.start}
                    end={themeGradients.card.mintCard.end}
                    style={styles.savedSessionGradient}
                  >
                    {/* Header with title and star */}
                    <View style={styles.savedSessionHeader}>
                      <Text style={[styles.savedSessionName, { color: colors.text.primary }]} numberOfLines={1}>
                        {session.title}
                      </Text>
                      <Ionicons name="star" size={16} color={colors.accent.mint[500]} />
                    </View>
                    {/* Duration and sound info */}
                    <Text style={[styles.savedSessionDescription, { color: colors.text.secondary }]} numberOfLines={1}>
                      {session.config.durationMinutes} {t('custom.min')} · {getAmbientSoundLabel(session.config.ambientSound)}
                    </Text>
                    {/* Start button */}
                    <View style={[styles.savedSessionStartBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)' }]}>
                      <Ionicons name="play" size={12} color={colors.text.primary} />
                      <Text style={[styles.savedSessionStartText, { color: colors.text.primary }]}>Start</Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              ))}
            </ScrollView>
          </GradientCard>
        )}

        {/* Session Name (Optional) */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.sessionName')}</Text>
          <TextInput
            style={[styles.textInput, dynamicStyles.textInput]}
            placeholder={t('custom.sessionNamePlaceholder')}
            value={sessionName}
            onChangeText={setSessionName}
            placeholderTextColor={colors.text.tertiary}
          />
        </GradientCard>

        {/* Duration Selection */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.duration')}</Text>
          <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>{t('custom.durationDescription')}</Text>

          <View style={styles.durationPresets}>
            {DURATION_PRESETS.map((minutes) => {
              const isActive = durationMinutes === minutes;
              return (
                <Pressable
                  key={minutes}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setDurationMinutes(minutes);
                    setCustomDuration('');
                  }}
                  style={styles.presetButtonContainer}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={themeGradients.button.success.colors}
                      start={themeGradients.button.success.start}
                      end={themeGradients.button.success.end}
                      style={styles.presetButton}
                    >
                      <Text style={styles.presetButtonTextActive}>
                        {minutes} {t('custom.min')}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.presetButtonInactive, dynamicStyles.presetButtonInactive]}>
                      <Text style={[styles.presetButtonText, dynamicStyles.presetButtonText]}>
                        {minutes} {t('custom.min')}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.customDurationRow}>
            <Text style={[styles.label, dynamicStyles.label]}>{t('custom.customDuration')}</Text>
            <TextInput
              style={[styles.durationInput, dynamicStyles.durationInput]}
              placeholder="0"
              value={customDuration}
              onChangeText={handleCustomDurationChange}
              keyboardType="number-pad"
              maxLength={3}
              placeholderTextColor={colors.text.tertiary}
            />
            <Text style={[styles.label, dynamicStyles.label]}>{t('custom.min')}</Text>
          </View>

          <Text style={[styles.currentValue, dynamicStyles.currentValue]}>
            {t('custom.selected')}: {durationMinutes} {t('custom.min')}
          </Text>
        </GradientCard>

        {/* Ambient Sound Selection */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.ambientSound')}</Text>
          <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>{t('custom.ambientDescription')}</Text>

          <View style={styles.ambientGrid}>
            {ambientSoundOptions.map((option) => {
              const isActive = ambientSound === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setAmbientSound(option.id as CustomSessionConfig['ambientSound']);
                    playPreviewSound();
                  }}
                  style={styles.ambientOptionContainer}
                >
                  {isActive ? (
                    <View style={[
                      styles.ambientOptionActive,
                      {
                        backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
                        borderColor: colors.accent.mint[500],
                      }
                    ]}>
                      <Ionicons
                        name={option.icon}
                        size={32}
                        color={colors.accent.mint[500]}
                      />
                      <Text style={[styles.ambientOptionTextActive, { color: colors.accent.mint[600] }]}>
                        {option.label}
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.ambientOptionInactive, dynamicStyles.ambientOptionInactive]}>
                      <Ionicons
                        name={option.icon}
                        size={32}
                        color={dynamicStyles.ambientIconColor}
                      />
                      <Text style={[styles.ambientOptionText, dynamicStyles.ambientOptionText]}>
                        {option.label}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </GradientCard>

        {/* Interval Bell */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.intervalBell')}</Text>
              <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>
                {t('custom.intervalBellDescription')}
              </Text>
            </View>
            <Switch
              value={intervalBellEnabled}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIntervalBellEnabled(value);
              }}
              trackColor={{
                false: dynamicStyles.switchTrackColorFalse,
                true: dynamicStyles.switchTrackColorTrue,
              }}
              thumbColor={colors.neutral.white}
            />
          </View>

          {intervalBellEnabled && (
            <View style={[styles.intervalOptions, dynamicStyles.intervalOptionsContainer]}>
              <Text style={[styles.label, dynamicStyles.label]}>{t('custom.intervalEvery')}</Text>
              <View style={styles.intervalPresets}>
                {INTERVAL_PRESETS.map((minutes) => {
                  const isActive = intervalBellMinutes === minutes && !customInterval;
                  return (
                    <Pressable
                      key={minutes}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setIntervalBellMinutes(minutes);
                        setCustomInterval('');
                      }}
                      style={styles.smallPresetButtonContainer}
                    >
                      {isActive ? (
                        <LinearGradient
                          colors={themeGradients.button.secondary.colors}
                          start={themeGradients.button.secondary.start}
                          end={themeGradients.button.secondary.end}
                          style={styles.smallPresetButton}
                        >
                          <Text style={styles.smallPresetButtonTextActive}>
                            {minutes} {t('custom.min')}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View style={[styles.smallPresetButtonInactive, dynamicStyles.smallPresetButtonInactive]}>
                          <Text style={[styles.smallPresetButtonText, dynamicStyles.smallPresetButtonText]}>
                            {minutes} {t('custom.min')}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.customIntervalRow}>
                <Text style={[styles.label, dynamicStyles.label]}>{t('custom.customInterval')}</Text>
                <TextInput
                  style={[styles.durationInput, dynamicStyles.durationInput]}
                  placeholder="0"
                  value={customInterval}
                  onChangeText={handleCustomIntervalChange}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholderTextColor={colors.text.tertiary}
                />
                <Text style={[styles.label, dynamicStyles.label]}>{t('custom.min')}</Text>
              </View>
            </View>
          )}
        </GradientCard>

        {/* Wake-up Chime */}
        <GradientCard gradient={themeGradients.card.lightCard} style={styles.section}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('custom.wakeUpChime')}</Text>
              <Text style={[styles.sectionDescription, dynamicStyles.sectionDescription]}>
                {t('custom.wakeUpChimeDescription')}
              </Text>
            </View>
            <Switch
              value={wakeUpChimeEnabled}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setWakeUpChimeEnabled(value);
              }}
              trackColor={{
                false: dynamicStyles.switchTrackColorFalse,
                true: dynamicStyles.switchTrackColorTrue,
              }}
              thumbColor={colors.neutral.white}
            />
          </View>
        </GradientCard>

        {/* Voice Guidance - COMMENTED OUT - NOT IMPLEMENTED YET */}
        {/* <GradientCard gradient={gradients.card.lightCard} style={styles.section}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.sectionTitle}>{t('custom.voiceGuidance')}</Text>
              <Text style={styles.sectionDescription}>
                {t('custom.voiceGuidanceDescription')}
              </Text>
            </View>
            <Switch
              value={voiceGuidanceEnabled}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setVoiceGuidanceEnabled(value);
              }}
              trackColor={{
                false: theme.colors.neutral.gray[200],
                true: theme.colors.accent.blue[500],
              }}
              thumbColor={theme.colors.neutral.white}
            />
          </View>
        </GradientCard> */}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {(editSessionId || localEditSessionId) ? (
            // When editing, show Update button
            <GradientButton
              title={t('custom.updateSession') || 'Update Session'}
              onPress={handleSaveSession}
              gradient={themeGradients.button.success}
              style={styles.actionButton}
            />
          ) : (
            // When creating new, show Save and Save & Start buttons
            <>
              <GradientButton
                title={t('custom.saveSession') || 'Save Session'}
                onPress={handleSaveSession}
                gradient={themeGradients.button.secondary}
                style={styles.actionButton}
              />
              <GradientButton
                title={t('custom.saveAndStart') || 'Save & Start'}
                onPress={handleSaveAndStart}
                gradient={themeGradients.button.success}
                style={styles.actionButton}
              />
            </>
          )}
        </View>

        {/* Quick Start Button (without saving) */}
        <Pressable onPress={handleStartSession} style={styles.quickStartButton}>
          <Text style={[styles.quickStartText, dynamicStyles.quickStartText]}>
            {t('custom.startWithoutSaving') || 'Start without saving'}
          </Text>
        </Pressable>
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
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
  },
  durationPresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  presetButtonContainer: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  presetButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetButtonInactive: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetButtonText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  presetButtonTextActive: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.white,
    fontWeight: theme.typography.fontWeights.bold,
  },
  customDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
  },
  durationInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    width: 80,
    textAlign: 'center',
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  currentValue: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.accent.mint[600],
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  ambientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  ambientOptionContainer: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  ambientOption: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
  ambientOptionActive: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderWidth: 2,
    borderRadius: theme.borderRadius.xl,
  },
  ambientOptionInactive: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.xl,
  },
  ambientOptionText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.fontWeights.medium,
  },
  ambientOptionTextActive: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral.white,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.fontWeights.bold,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  intervalOptions: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  intervalPresets: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  smallPresetButtonContainer: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  smallPresetButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallPresetButtonInactive: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallPresetButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  smallPresetButtonTextActive: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral.white,
    fontWeight: theme.typography.fontWeights.bold,
  },
  customIntervalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  quickStartButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  quickStartText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    textDecorationLine: 'underline',
  },
  savedSessionsSection: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  savedSessionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  savedSessionsTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
  },
  savedSessionsScroll: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  savedSessionCard: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    width: 140,
    ...theme.shadows.sm,
  },
  savedSessionGradient: {
    padding: theme.spacing.md,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  savedSessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  savedSessionName: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold,
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  savedSessionDescription: {
    fontSize: theme.typography.fontSizes.xs,
    marginBottom: theme.spacing.sm,
  },
  savedSessionStartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xxs,
  },
  savedSessionStartText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
});

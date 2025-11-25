import { logger } from '../utils/logger';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Alert, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SessionCard } from '../components/SessionCard';
import { MeditationTimer } from '../components/MeditationTimer';
import { PreSessionInstructions } from '../components/PreSessionInstructions';
import { CelebrationScreen } from '../components/CelebrationScreen';
import { GradientBackground } from '../components/GradientBackground';
import { api, MeditationSession } from '../services/api';
import { audioEngine } from '../services/audio';
import { saveSessionCompletion } from '../services/progressTracker';
import { getInstructionForSession } from '../data/instructions';
import { getAllCustomSessions, deleteCustomSession, SavedCustomSession } from '../services/customSessionStorage';
import { ChimePoint } from '../types/customSession';
import { CustomSessionConfig } from './CustomSessionBuilderScreen';
import theme, { gradients } from '../theme';
import * as Haptics from 'expo-haptics';
import { ActiveMeditationState } from '../../App';

type FlowState = 'list' | 'instructions' | 'meditation' | 'celebration';

interface MeditationScreenProps {
  onEditSession?: (sessionId: string, sessionConfig: CustomSessionConfig) => void;
  activeMeditationState: ActiveMeditationState | null;
  onMeditationStateChange: (state: ActiveMeditationState | null) => void;
}

// Helper function to generate chime points from custom session config
const getChimePointsFromSession = (session: MeditationSession | SavedCustomSession): ChimePoint[] => {
  const customSession = session as SavedCustomSession;

  // Check if it's a custom session with interval bells enabled
  if (!customSession.isCustom || !customSession.config?.intervalBellEnabled) {
    return [];
  }

  const { intervalBellMinutes, durationMinutes } = customSession.config;
  const chimePoints: ChimePoint[] = [];

  // Generate chime points at each interval
  for (let minutes = intervalBellMinutes; minutes < durationMinutes; minutes += intervalBellMinutes) {
    chimePoints.push({
      timeInSeconds: minutes * 60,
      label: `${minutes} min`,
    });
  }

  return chimePoints;
};

export const MeditationScreen: React.FC<MeditationScreenProps> = ({
  onEditSession,
  activeMeditationState,
  onMeditationStateChange
}) => {
  const { t, i18n } = useTranslation();
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | SavedCustomSession | null>(null);
  const [flowState, setFlowState] = useState<FlowState>('list');
  const [userIntention, setUserIntention] = useState('');
  const [sessionMood, setSessionMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>();

  useEffect(() => {
    loadSessions();
  }, [i18n.language]);

  // Cleanup audio when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      // Stop and cleanup audio to prevent background playback
      audioEngine.stopAll().catch((error) => {
        logger.error('Failed to stop audio on unmount:', error);
      });
      audioEngine.cleanup().catch((error) => {
        logger.error('Failed to cleanup audio on unmount:', error);
      });
    };
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);

      // Load preset sessions from API
      const presetSessions = await api.sessions.getAll(i18n.language);

      // Load custom sessions from storage
      const customSessions = await getAllCustomSessions();

      // Combine sessions: custom first, then preset
      const allSessions = [...customSessions, ...presetSessions];

      setSessions(allSessions);
    } catch (error) {
      logger.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async (session: MeditationSession) => {
    setSelectedSession(session);
    setFlowState('instructions');
  };

  const handleLongPressSession = (session: MeditationSession) => {
    // Check if it's a custom session
    const customSession = session as SavedCustomSession;
    if (!customSession.isCustom) {
      return; // Only handle custom sessions
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      customSession.title,
      t('custom.sessionOptions') || 'What would you like to do?',
      [
        {
          text: t('custom.editSession') || 'Edit',
          onPress: () => handleEditSession(customSession),
        },
        {
          text: t('custom.deleteSession') || 'Delete',
          onPress: () => handleDeleteSession(customSession),
          style: 'destructive',
        },
        {
          text: t('common.cancel') || 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleEditSession = (session: SavedCustomSession) => {
    if (!onEditSession) {
      logger.warn('onEditSession prop not provided');
      return;
    }

    // Use the existing config from the custom session
    onEditSession(session.id as string, session.config);
  };

  const handleDeleteSession = async (session: SavedCustomSession) => {
    Alert.alert(
      t('custom.deleteConfirmTitle') || 'Delete Session',
      t('custom.deleteConfirmMessage') || `Are you sure you want to delete "${session.title}"?`,
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
              // Reload sessions
              await loadSessions();
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

  const handleInstructionsComplete = async (intention: string) => {
    setUserIntention(intention);
    setFlowState('meditation');

    if (!selectedSession) return;

    // Set active meditation state to prevent accidental navigation
    onMeditationStateChange({
      session: selectedSession,
      flowState: 'meditation',
      userIntention: intention,
      startedAt: Date.now(),
    });

    try {
      // Load audio tracks if available - with graceful error handling
      if (selectedSession.voiceUrl) {
        logger.log('Loading voice track:', selectedSession.voiceUrl);
        await audioEngine.loadTrack('voice', String(selectedSession.voiceUrl), 0.8);
      }

      // Only load ambient if URL is provided and not 'silence'
      if (selectedSession.ambientUrl && selectedSession.ambientUrl !== 'silence') {
        logger.log('Loading ambient track:', selectedSession.ambientUrl);
        await audioEngine.loadTrack('ambient', String(selectedSession.ambientUrl), 0.4);
      } else {
        logger.log('Skipping ambient track (silence mode or no URL)');
      }

      if (selectedSession.chimeUrl) {
        logger.log('Loading chime track:', selectedSession.chimeUrl);
        await audioEngine.loadTrack('chime', String(selectedSession.chimeUrl), 0.6);
      }

      // Start with chime, then fade in ambient
      if (selectedSession.chimeUrl) {
        await audioEngine.play('chime');
      }
      if (selectedSession.ambientUrl && selectedSession.ambientUrl !== 'silence') {
        await audioEngine.fadeIn('ambient', 3000, 0.4);
      }
      if (selectedSession.voiceUrl) {
        setTimeout(() => audioEngine.play('voice'), 5000);
      }
    } catch (error) {
      logger.error('Failed to start audio:', error);
      logger.warn('Session will continue in silent mode');
      // Don't prevent session from starting - just log the error
    }
  };

  const handleSkipInstructions = () => {
    setFlowState('list');
    setSelectedSession(null);
  };

  const handleAudioToggle = async (enabled: boolean) => {
    try {
      // Control ambient sound when audio is toggled
      if (enabled) {
        // Fade in ambient if it was loaded
        if (selectedSession?.ambientUrl && selectedSession.ambientUrl !== 'silence') {
          await audioEngine.fadeIn('ambient', 1500, 0.4);
        }
      } else {
        // Fade out ambient when muted
        await audioEngine.fadeOut('ambient', 1500);
      }
    } catch (error) {
      logger.error('Failed to toggle audio:', error);
    }
  };

  const handleComplete = async () => {
    try {
      // Play ending chime with haptic feedback
      if (selectedSession?.chimeUrl) {
        await audioEngine.play('chime');
        // Strong haptic feedback to signal session completion
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        // If no chime sound, still provide haptic feedback as fallback
        // This is crucial for silent/vibration-only mode (e.g., in metro/crowded places)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Fade out all tracks
      await audioEngine.fadeOut('voice', 2000);
      await audioEngine.fadeOut('ambient', 3000);

      // Move to celebration screen
      setTimeout(() => {
        setFlowState('celebration');
      }, 3000);
    } catch (error) {
      logger.error('Failed to complete session:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await audioEngine.stopAll();
      await audioEngine.cleanup();
      // Clear active meditation state
      onMeditationStateChange(null);
      setFlowState('list');
      setSelectedSession(null);
    } catch (error) {
      logger.error('Failed to cancel session:', error);
    }
  };

  const handleCelebrationContinue = async (mood?: 1 | 2 | 3 | 4 | 5) => {
    try {
      // Save session completion with mood for progress tracking
      if (selectedSession) {
        await saveSessionCompletion(
          selectedSession.id,
          selectedSession.title,
          selectedSession.durationSeconds,
          selectedSession.languageCode,
          mood
        );
      }

      await audioEngine.cleanup();
      // Clear active meditation state
      onMeditationStateChange(null);
      setFlowState('list');
      setSelectedSession(null);
      setUserIntention('');
      setSessionMood(undefined);
    } catch (error) {
      logger.error('Failed to cleanup after celebration:', error);
    }
  };

  // FlatList optimization - Memoized render functions
  const renderItem = useCallback(
    ({ item }: { item: MeditationSession }) => {
      const customSession = item as SavedCustomSession;
      return (
        <SessionCard
          session={item}
          onPress={() => handleStartSession(item)}
          onLongPress={customSession.isCustom ? () => handleLongPressSession(item) : undefined}
          isCustom={customSession.isCustom || false}
        />
      );
    },
    []
  );

  const keyExtractor = useCallback((item: MeditationSession) => item.id.toString(), []);

  const renderListHeader = useCallback(
    () => {
      const customCount = sessions.filter((s) => (s as SavedCustomSession).isCustom).length;
      return (
        <View style={styles.header}>
          <Text style={styles.title}>{t('meditation.title')}</Text>
          <Text style={styles.subtitle}>{t('meditation.subtitle')}</Text>
          {customCount > 0 && (
            <View style={styles.customBadge}>
              <Ionicons name="star" size={16} color={theme.colors.accent.blue[600]} />
              <Text style={styles.customBadgeText}>
                {customCount} {customCount === 1 ? t('custom.customSession') || 'custom session' : t('custom.customSessions') || 'custom sessions'}
              </Text>
            </View>
          )}
        </View>
      );
    },
    [t, sessions]
  );

  const renderListEmpty = useCallback(
    () => (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.accent.blue[500]} />
      </View>
    ),
    []
  );

  // Show pre-session instructions
  if (flowState === 'instructions' && selectedSession) {
    const instruction = getInstructionForSession(
      selectedSession.level,
      'breath_awareness' // Default technique, can be mapped from session type
    );

    return (
      <View style={{ flex: 1 }}>
        <PreSessionInstructions
          instruction={instruction}
          onComplete={handleInstructionsComplete}
          onSkip={handleSkipInstructions}
        />
      </View>
    );
  }

  // Show meditation timer
  if (flowState === 'meditation' && selectedSession) {
    const chimePoints = getChimePointsFromSession(selectedSession);

    // Get ambient sound name for display
    const getAmbientSoundName = () => {
      if (!selectedSession.ambientUrl) return t('custom.ambientSilence');

      // Check if it's a custom session with config
      if ('config' in selectedSession && selectedSession.config) {
        const sound = selectedSession.config.ambientSound;
        const key = `custom.ambient${sound.charAt(0).toUpperCase() + sound.slice(1)}`;
        return t(key);
      }

      // For non-custom sessions, check the URL or return generic name
      return selectedSession.ambientUrl ? t('custom.ambientNature') : t('custom.ambientSilence');
    };

    return (
      <GradientBackground gradient={gradients.primary.subtleBlue} style={styles.container}>
        <MeditationTimer
          totalSeconds={selectedSession.durationSeconds}
          onComplete={handleComplete}
          onCancel={handleCancel}
          chimePoints={chimePoints}
          onAudioToggle={handleAudioToggle}
          ambientSoundName={getAmbientSoundName()}
        />
      </GradientBackground>
    );
  }

  // Show celebration screen
  if (flowState === 'celebration' && selectedSession) {
    return (
      <CelebrationScreen
        durationMinutes={Math.ceil(selectedSession.durationSeconds / 60)}
        sessionTitle={selectedSession.title}
        onContinue={handleCelebrationContinue}
      />
    );
  }

  // Default: show session list
  return (
    <GradientBackground gradient={gradients.screen.home} style={styles.container}>
      <FlatList
        data={loading ? [] : sessions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={loading ? renderListEmpty : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={true}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxxl,
    flexGrow: 1,
  },
  header: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.regular,
    color: theme.colors.text.secondary,
  },
  customBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  customBadgeText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.accent.blue[600],
    fontWeight: theme.typography.fontWeights.medium,
  },
  loader: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  separator: {
    height: theme.spacing.md,
  },
});

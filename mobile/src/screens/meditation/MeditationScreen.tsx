import { logger } from '../../utils/logger';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { screenElementAnimation } from '../../utils/animations';
import { SessionCard } from '../../components/SessionCard';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { MeditationTimer } from '../../components/MeditationTimer';
import { IntentionScreen } from '../../components/IntentionScreen';
import { CelebrationScreen } from '../../components/CelebrationScreen';
import { GradientBackground } from '../../components/GradientBackground';
import { ResponsiveContainer } from '../../components/ResponsiveContainer';
import { SessionCardSkeleton } from '../../components/SkeletonLoader';
import { ErrorBanner, useErrorBanner } from '../../components/ErrorBanner';
import type { MeditationSession } from '../../services/api';
import { audioEngine } from '../../services/audio';
import { saveSessionCompletion } from '../../services/progressTracker';
import type { CustomSession} from '../../services/customSessionStorage';
import { getAllSessions, deleteSession, initializeDefaultSession, getCustomAmbientUri, getCustomBellUri, createSessionFromConfig } from '../../services/customSessionStorage';
import { userPreferences } from '../../services/userPreferences';
import theme, { getThemeColors, getThemeGradients, getCardStyles } from '../../theme';
import { getSectionColors } from '../../theme/colors';
import * as Haptics from 'expo-haptics';
import { usePersonalization } from '../../contexts/PersonalizationContext';

import { SessionActionModal } from './SessionActionModal';
import { styles } from './meditationScreenStyles';
import type {
  FlowState,
  MeditationScreenProps} from './meditationHelpers';
import {
  getChimePointsFromSession,
  getSessionHaptics,
  getBreathingHaptics,
  getIntervalBellHaptics,
  getAmbientSoundName,
  getBreathingPattern,
  getCustomBreathing,
  getHideTimer,
} from './meditationHelpers';

export const MeditationScreen: React.FC<MeditationScreenProps> = ({
  isDark = false,
  onEditSession,
  onNavigateToCustom,
  activeMeditationState: _activeMeditationState,
  onMeditationStateChange,
  pendingSessionConfig,
  onClearPendingSession
}) => {
  const { t, i18n } = useTranslation();
  const { currentTheme, settings } = usePersonalization();
  const errorBanner = useErrorBanner();

  const numColumns = 1;

  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);
  const _sectionColors = useMemo(() => getSectionColors(isDark), [isDark]);
  const globalCardStyles = useMemo(() => getCardStyles(isDark), [isDark]);

  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    subtitle: { color: colors.text.secondary },
    customBadgeText: { color: currentTheme.primary },
    customBadgeIconColor: currentTheme.primary,
    loaderColor: currentTheme.primary,
    mainCardShadow: {
      ...globalCardStyles.primaryCta,
      shadowColor: currentTheme.gradient[0],
    },
  }), [colors, isDark, currentTheme, globalCardStyles]);

  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | CustomSession | null>(null);
  const [flowState, setFlowState] = useState<FlowState>('list');
  const [activeCustomChimeUri, setActiveCustomChimeUri] = useState<string | undefined>(undefined);
  const [userIntention, setUserIntention] = useState('');
  const [_sessionMood, setSessionMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>();
  const [actionModalSession, setActionModalSession] = useState<CustomSession | null>(null);

  const selectedSessionRef = useRef<MeditationSession | CustomSession | null>(null);
  selectedSessionRef.current = selectedSession;

  useEffect(() => {
    loadSessions();
  }, [i18n.language]);

  useEffect(() => {
    if (pendingSessionConfig) {
      const tempSession = createSessionFromConfig(pendingSessionConfig, `temp-${Date.now()}`);
      setSelectedSession(tempSession);
      setFlowState('intention');
      onClearPendingSession?.();
    }
  }, [pendingSessionConfig, onClearPendingSession]);

  useEffect(() => {
    if (flowState === 'list') {
      loadSessions();
    }
  }, [flowState]);

  useEffect(() => {
    return () => {
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
      await initializeDefaultSession();
      const customSessions = await getAllSessions();
      setSessions(customSessions);
    } catch (error) {
      logger.error('Failed to load sessions:', error);
      errorBanner.showError(
        t('meditation.loadError') || 'Failed to load sessions. Please try again.',
        loadSessions
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async (session: MeditationSession) => {
    setSelectedSession(session);
    const skipIntention = await userPreferences.shouldSkipIntentionScreen();
    if (skipIntention) {
      setFlowState('meditation');
      handleIntentionComplete('');
    } else {
      setFlowState('intention');
    }
  };

  const closeActionModal = () => {
    setActionModalSession(null);
  };

  const handleEditSession = (session: CustomSession) => {
    if (!onEditSession) {
      logger.warn('onEditSession prop not provided');
      return;
    }
    onEditSession(String(session.id), session.config);
  };

  const handleDeleteSession = async (session: CustomSession) => {
    Alert.alert(
      t('custom.deleteConfirmTitle') || 'Delete Session',
      t('custom.deleteConfirmMessage') || `Are you sure you want to delete "${session.title}"?`,
      [
        { text: t('common.cancel') || 'Cancel', style: 'cancel' },
        {
          text: t('custom.delete') || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSession(String(session.id));
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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

  const handleIntentionComplete = async (intention: string) => {
    setUserIntention(intention);
    setFlowState('meditation');

    if (!selectedSession) return;

    onMeditationStateChange({
      session: selectedSession,
      flowState: 'meditation',
      userIntention: intention,
      startedAt: Date.now(),
    });

    try {
      if (selectedSession.voiceUrl) {
        logger.log('Loading voice track:', selectedSession.voiceUrl);
        await audioEngine.loadTrack('voice', selectedSession.voiceUrl, 0.8);
      }

      let ambientUrl: string | number | undefined = selectedSession.ambientUrl;
      const customSession = selectedSession as CustomSession;

      if (customSession.isCustom && customSession.config?.ambientSound) {
        const customAmbientUri = await getCustomAmbientUri(customSession.config.ambientSound);
        if (customAmbientUri) {
          logger.log('Using custom ambient sound from settings');
          ambientUrl = customAmbientUri;
        } else if (customSession.config.ambientSound === 'custom') {
          logger.warn('Custom ambient selected but no custom sound configured in settings');
          ambientUrl = undefined;
        }
      }

      if (ambientUrl && ambientUrl !== 'silence') {
        logger.log('Loading ambient track:', typeof ambientUrl === 'string' ? ambientUrl.substring(0, 50) : ambientUrl);
        await audioEngine.loadTrack('ambient', ambientUrl, 0.4);
      } else {
        logger.log('Skipping ambient track (silence mode or no URL)');
      }

      let chimeUrl: string | number | undefined = selectedSession.chimeUrl;
      const customBellUri = await getCustomBellUri();
      if (customBellUri && selectedSession.chimeUrl) {
        logger.log('Using custom bell sound from settings');
        chimeUrl = customBellUri;
      }
      setActiveCustomChimeUri(customBellUri);

      if (chimeUrl) {
        logger.log('Loading chime track:', typeof chimeUrl === 'string' ? chimeUrl.substring(0, 50) : chimeUrl);
        await audioEngine.loadTrack('chime', chimeUrl, 0.6);
      }

      if (chimeUrl) {
        await audioEngine.play('chime');
      }
      if (ambientUrl && ambientUrl !== 'silence') {
        await audioEngine.fadeIn('ambient', 3000, 0.4);
      }
      if (selectedSession.voiceUrl) {
        setTimeout(() => audioEngine.play('voice'), 5000);
      }
    } catch (error) {
      logger.error('Failed to start audio:', error);
      logger.warn('Session will continue in silent mode');
      errorBanner.showWarning(
        t('meditation.audioError') || 'Audio could not be loaded. Session will continue in silent mode.'
      );
    }
  };

  const handleAudioToggle = async (enabled: boolean) => {
    try {
      const customSession = selectedSession as CustomSession;
      const hasAmbientFromSession = selectedSession?.ambientUrl && selectedSession.ambientUrl !== 'silence';
      const hasCustomAmbient = customSession?.isCustom && customSession.config?.ambientSound && customSession.config.ambientSound !== 'silence';
      const hasAmbient = hasAmbientFromSession || hasCustomAmbient;

      if (enabled) {
        if (hasAmbient) {
          await audioEngine.fadeIn('ambient', 1500, 0.4);
        }
      } else {
        await audioEngine.setVolume('ambient', 0);
        await audioEngine.pause('ambient');
        await audioEngine.setVolume('chime', 0);
        await audioEngine.pause('chime');
      }
    } catch (error) {
      logger.error('Failed to toggle audio:', error);
    }
  };

  const handleComplete = useCallback(async () => {
    try {
      const session = selectedSessionRef.current;
      const sessionHapticsEnabled = getSessionHaptics(session) && settings.hapticEnabled;

      if (session?.chimeUrl) {
        await audioEngine.setVolume('chime', 0.6);
        await audioEngine.play('chime');
        if (sessionHapticsEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else if (sessionHapticsEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      await audioEngine.fadeOut('voice', 2000);
      await audioEngine.fadeOut('ambient', 3000);

      setTimeout(() => {
        setFlowState('celebration');
      }, 3000);
    } catch (error) {
      logger.error('Failed to complete session:', error);
    }
  }, [settings.hapticEnabled]);

  const handleCancel = useCallback(async () => {
    try {
      await audioEngine.stopAll();
      await audioEngine.cleanup();
      onMeditationStateChange(null);
      setFlowState('list');
      setSelectedSession(null);
      setActiveCustomChimeUri(undefined);
    } catch (error) {
      logger.error('Failed to cancel session:', error);
    }
  }, [onMeditationStateChange]);

  const handleCelebrationContinue = async (mood?: 1 | 2 | 3 | 4 | 5, notes?: string) => {
    try {
      if (selectedSession) {
        await saveSessionCompletion(
          selectedSession.id,
          selectedSession.title,
          selectedSession.durationSeconds,
          selectedSession.languageCode,
          mood,
          notes,
          userIntention
        );
      }

      await audioEngine.cleanup();
      onMeditationStateChange(null);
      setFlowState('list');
      setSelectedSession(null);
      setUserIntention('');
      setSessionMood(undefined);
      setActiveCustomChimeUri(undefined);
    } catch (error) {
      logger.error('Failed to cleanup after celebration:', error);
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: MeditationSession; index: number }) => {
      const customSession = item as CustomSession;
      return (
        <SessionCard
          session={item}
          onPress={() => handleStartSession(item)}
          onEdit={customSession.isCustom ? () => handleEditSession(customSession) : undefined}
          onDelete={customSession.isCustom ? () => handleDeleteSession(customSession) : undefined}
          isCustom={customSession.isCustom || false}
          isDark={isDark}
          animationIndex={index}
        />
      );
    },
    [isDark]
  );

  const keyExtractor = useCallback((item: MeditationSession) => item.id.toString(), []);

  const renderListHeader = useCallback(
    () => {
      return (
        <View style={styles.header}>
          <Animated.View
            entering={settings.animationsEnabled ? screenElementAnimation(0) : undefined}
          >
            <Text style={[styles.title, dynamicStyles.title]}>{t('meditation.title')}</Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>{t('meditation.subtitle')}</Text>
          </Animated.View>

          <Animated.View
            entering={settings.animationsEnabled ? screenElementAnimation(1) : undefined}
            style={styles.mainCardContainer}
          >
            <AnimatedPressable
              onPress={onNavigateToCustom ?? (() => {})}
              style={[styles.mainCard, dynamicStyles.mainCardShadow]}
              pressScale={0.98}
              hapticType="medium"
              accessibilityLabel={t('meditation.createSession')}
            >
              <LinearGradient
                colors={[...currentTheme.gradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainCardGradient}
              >
                <View style={styles.mainCardContent}>
                  <View style={styles.mainCardTextSection}>
                    <Text style={styles.mainCardLabel}>
                      {t('meditation.customize', 'Customize')}
                    </Text>
                    <Text style={styles.mainCardTitle}>
                      {t('meditation.createSession', 'Create Session')}
                    </Text>
                    <View style={styles.mainCardCta}>
                      <Text style={styles.mainCardCtaText}>
                        {t('meditation.createSessionDesc', 'Adjust time, sounds and intervals')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.mainCardIconSection}>
                    <View style={styles.iconRingsContainer}>
                      <View style={[styles.iconRing, styles.iconRing1]} />
                      <View style={[styles.iconRing, styles.iconRing2]} />
                      <View style={styles.mainCardIconBg}>
                        <Ionicons name="add" size={32} color="rgba(255,255,255,0.95)" />
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>

          {sessions.length > 0 && (
            <Animated.View
              entering={settings.animationsEnabled ? screenElementAnimation(2) : undefined}
              style={styles.sessionsHeader}
            >
              <Text style={[styles.sessionsHeaderText, { color: colors.text.secondary }]}>
                {t('meditation.yourSessions', 'Your Sessions')}
              </Text>
              <Text style={[styles.sessionsHeaderHint, { color: colors.text.tertiary }]}>
                {t('custom.swipeToEdit', 'Swipe left to edit')}
              </Text>
            </Animated.View>
          )}
        </View>
      );
    },
    [t, sessions, dynamicStyles, colors, onNavigateToCustom, currentTheme, settings.animationsEnabled]
  );

  const renderListEmpty = useCallback(
    () => {
      if (loading) {
        return (
          <View style={styles.skeletonContainer}>
            <SessionCardSkeleton />
            <SessionCardSkeleton style={{ marginTop: theme.spacing.lg }} />
            <SessionCardSkeleton style={{ marginTop: theme.spacing.lg }} />
          </View>
        );
      }

      return (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={64} color={colors.text.secondary} />
          <Text style={[styles.emptyStateTitle, { color: colors.text.primary }]}>
            {t('meditation.noSessions') || 'No Sessions'}
          </Text>
          <Text style={[styles.emptyStateSubtitle, { color: colors.text.secondary }]}>
            {t('meditation.noSessionsDesc') || 'Create your first custom meditation session'}
          </Text>
        </View>
      );
    },
    [loading, colors, t]
  );

  // Flow state conditional renders
  if (flowState === 'intention' && selectedSession) {
    return (
      <IntentionScreen
        onBegin={handleIntentionComplete}
        isDark={isDark}
        sessionName={selectedSession.title}
      />
    );
  }

  if (flowState === 'meditation' && selectedSession) {
    const chimePoints = getChimePointsFromSession(selectedSession);

    return (
      <GradientBackground gradient={themeGradients.primary.clean} style={styles.container}>
        <MeditationTimer
          totalSeconds={selectedSession.durationSeconds}
          onComplete={handleComplete}
          onCancel={handleCancel}
          chimePoints={chimePoints}
          onAudioToggle={handleAudioToggle}
          ambientSoundName={getAmbientSoundName(selectedSession, t)}
          isDark={isDark}
          breathingPattern={getBreathingPattern(selectedSession)}
          customBreathing={getCustomBreathing(selectedSession)}
          hideTimer={getHideTimer(selectedSession)}
          customChimeUri={activeCustomChimeUri}
          sessionHaptics={getSessionHaptics(selectedSession)}
          breathingHaptics={getBreathingHaptics(selectedSession)}
          intervalBellHaptics={getIntervalBellHaptics(selectedSession)}
          zenMode={settings.zenMode}
        />
      </GradientBackground>
    );
  }

  if (flowState === 'celebration' && selectedSession) {
    return (
      <CelebrationScreen
        durationMinutes={Math.ceil(selectedSession.durationSeconds / 60)}
        sessionTitle={selectedSession.title}
        userIntention={userIntention}
        onContinue={handleCelebrationContinue}
        isDark={isDark}
      />
    );
  }

  // Default: show session list
  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <ErrorBanner
        visible={errorBanner.visible}
        message={errorBanner.message}
        type={errorBanner.type}
        onDismiss={errorBanner.dismiss}
        onRetry={errorBanner.onRetry}
      />
      <ResponsiveContainer style={styles.responsiveWrapper}>
        <FlatList
          key={`sessions-${numColumns}`}
          data={sessions}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderListEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          initialNumToRender={5}
          maxToRenderPerBatch={3}
          windowSize={5}
          removeClippedSubviews={false}
          ItemSeparatorComponent={numColumns === 1 ? () => <View style={styles.separator} /> : undefined}
        />
      </ResponsiveContainer>

      <SessionActionModal
        session={actionModalSession}
        isDark={isDark}
        colors={colors}
        themeGradients={themeGradients}
        themePrimary={currentTheme.primary}
        t={t}
        onClose={closeActionModal}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
      />
    </GradientBackground>
  );
};

import { logger } from '../utils/logger';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { screenElementAnimation } from '../utils/animations';
import { SessionCard } from '../components/SessionCard';
import { GradientButton } from '../components/GradientButton';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { BlurView } from 'expo-blur';
import { MeditationTimer } from '../components/MeditationTimer';
import { IntentionScreen } from '../components/IntentionScreen';
import { CelebrationScreen } from '../components/CelebrationScreen';
import { GradientBackground } from '../components/GradientBackground';
import { api, MeditationSession } from '../services/api';
import { audioEngine } from '../services/audio';
import { saveSessionCompletion } from '../services/progressTracker';
import { getAllSessions, deleteSession, CustomSession, BreathingPattern, BreathingTiming, initializeDefaultSession } from '../services/customSessionStorage';
import { userPreferences } from '../services/userPreferences';
import { ChimePoint } from '../types/customSession';
import theme, { getThemeColors, getThemeGradients, getCardStyles } from '../theme';
import { brandColors, primaryColor, getSectionColors } from '../theme/colors';
import * as Haptics from 'expo-haptics';
import { ActiveMeditationState } from '../../App';
import { usePersonalization } from '../contexts/PersonalizationContext';

type FlowState = 'list' | 'intention' | 'meditation' | 'celebration';

interface MeditationScreenProps {
  isDark?: boolean;
  onEditSession?: (sessionId: string, sessionConfig: CustomSession['config']) => void;
  onNavigateToCustom?: () => void;
  activeMeditationState: ActiveMeditationState | null;
  onMeditationStateChange: (state: ActiveMeditationState | null) => void;
}

// Helper function to generate chime points from custom session config
const getChimePointsFromSession = (session: MeditationSession | CustomSession): ChimePoint[] => {
  const customSession = session as CustomSession;

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
  isDark = false,
  onEditSession,
  onNavigateToCustom,
  activeMeditationState,
  onMeditationStateChange
}) => {
  const { t, i18n } = useTranslation();
  const { currentTheme, settings } = usePersonalization();

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);
  const sectionColors = useMemo(() => getSectionColors(isDark), [isDark]);
  const globalCardStyles = useMemo(() => getCardStyles(isDark), [isDark]);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    subtitle: { color: colors.text.secondary },
    customBadgeText: { color: currentTheme.primary },
    customBadgeIconColor: currentTheme.primary,
    loaderColor: currentTheme.primary,
    // Main CTA card shadow - uses global primaryCta style with dynamic shadow color from currentTheme
    mainCardShadow: {
      ...globalCardStyles.primaryCta,
      shadowColor: currentTheme.gradient[0], // Use theme gradient color for glow effect
    },
    // Secondary card styles now come from global cardStyles.secondary (used by SessionCard)
  }), [colors, isDark, currentTheme, globalCardStyles]);
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | CustomSession | null>(null);
  const [flowState, setFlowState] = useState<FlowState>('list');
  const [userIntention, setUserIntention] = useState('');
  const [sessionMood, setSessionMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>();
  const [actionModalSession, setActionModalSession] = useState<CustomSession | null>(null);

  useEffect(() => {
    loadSessions();
  }, [i18n.language]);

  // Refresh sessions when returning to list view (e.g., after saving a session)
  useEffect(() => {
    if (flowState === 'list') {
      loadSessions();
    }
  }, [flowState]);

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

      // Ensure default session exists on first launch
      await initializeDefaultSession();

      // Load all custom sessions from storage
      const customSessions = await getAllSessions();

      setSessions(customSessions);
    } catch (error) {
      logger.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async (session: MeditationSession) => {
    setSelectedSession(session);

    // Check if user wants to skip intention screen (set permanently via checkbox)
    const skipIntention = await userPreferences.shouldSkipIntentionScreen();
    if (skipIntention) {
      // Skip intention screen and go directly to meditation
      setFlowState('meditation');
      // Start audio immediately since we're skipping intention screen
      handleIntentionComplete('');
    } else {
      setFlowState('intention');
    }
  };

  const handleLongPressSession = (session: MeditationSession) => {
    // Check if it's a custom session
    const customSession = session as CustomSession;
    if (!customSession.isCustom) {
      return; // Only handle custom sessions
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActionModalSession(customSession);
  };

  const closeActionModal = () => {
    setActionModalSession(null);
  };

  const handleEditSession = (session: CustomSession) => {
    if (!onEditSession) {
      logger.warn('onEditSession prop not provided');
      return;
    }

    // Use the existing config from the custom session
    onEditSession(session.id, session.config);
  };

  const handleDeleteSession = async (session: CustomSession) => {
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
              await deleteSession(session.id);
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

  const handleIntentionComplete = async (intention: string) => {
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
        await audioEngine.loadTrack('voice', selectedSession.voiceUrl, 0.8);
      }

      // Only load ambient if URL is provided and not 'silence'
      if (selectedSession.ambientUrl && selectedSession.ambientUrl !== 'silence') {
        logger.log('Loading ambient track:', selectedSession.ambientUrl);
        await audioEngine.loadTrack('ambient', selectedSession.ambientUrl, 0.4);
      } else {
        logger.log('Skipping ambient track (silence mode or no URL)');
      }

      if (selectedSession.chimeUrl) {
        logger.log('Loading chime track:', selectedSession.chimeUrl);
        await audioEngine.loadTrack('chime', selectedSession.chimeUrl, 0.6);
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
      const sessionHapticsEnabled = getSessionHaptics() && settings.hapticEnabled;

      // Play ending chime with haptic feedback
      if (selectedSession?.chimeUrl) {
        await audioEngine.play('chime');
        // Strong haptic feedback to signal session completion (if enabled)
        if (sessionHapticsEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else if (sessionHapticsEnabled) {
        // If no chime sound but session haptics is enabled, provide haptic feedback as fallback
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

  const handleCelebrationContinue = async (mood?: 1 | 2 | 3 | 4 | 5, notes?: string) => {
    try {
      // Save session completion with mood, notes, and intention for progress tracking
      if (selectedSession) {
        await saveSessionCompletion(
          selectedSession.id,
          selectedSession.title,
          selectedSession.durationSeconds,
          selectedSession.languageCode,
          mood,
          notes,
          userIntention // Pass the user's intention from pre-session
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
          {/* Hero title section */}
          <Animated.View
            entering={settings.animationsEnabled ? screenElementAnimation(0) : undefined}
          >
            <Text style={[styles.title, dynamicStyles.title]}>{t('meditation.title')}</Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>{t('meditation.subtitle')}</Text>
          </Animated.View>

          {/* Main CTA Card - Headspace style */}
          <Animated.View
            entering={settings.animationsEnabled ? screenElementAnimation(1) : undefined}
            style={styles.mainCardContainer}
          >
            <AnimatedPressable
              onPress={onNavigateToCustom}
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
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={dynamicStyles.loaderColor} />
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
    [loading, dynamicStyles, colors, t]
  );

  // Helper functions to extract settings from custom session config

  const getSessionHaptics = (): boolean => {
    if (selectedSession && 'config' in selectedSession) {
      return selectedSession.config?.haptics?.session ?? true;
    }
    return true;
  };

  const getBreathingHaptics = (): boolean => {
    if (selectedSession && 'config' in selectedSession) {
      return selectedSession.config?.haptics?.breathing ?? true;
    }
    return true;
  };

  const getIntervalBellHaptics = (): boolean => {
    if (selectedSession && 'config' in selectedSession) {
      return selectedSession.config?.haptics?.intervalBell ?? true;
    }
    return true;
  };

  const getAmbientSoundName = (): string => {
    if (!selectedSession?.ambientUrl) return t('custom.ambientSilence');

    if ('config' in selectedSession && selectedSession.config) {
      const sound = selectedSession.config.ambientSound;
      const key = `custom.ambient${sound.charAt(0).toUpperCase() + sound.slice(1)}`;
      return t(key);
    }

    return selectedSession.ambientUrl ? t('custom.ambientNature') : t('custom.ambientSilence');
  };

  const getBreathingPattern = (): BreathingPattern => {
    if (selectedSession && 'config' in selectedSession && selectedSession.config?.breathingPattern) {
      return selectedSession.config.breathingPattern;
    }
    return 'box';
  };

  const getCustomBreathing = (): BreathingTiming | undefined => {
    if (selectedSession && 'config' in selectedSession && selectedSession.config?.customBreathing) {
      return selectedSession.config.customBreathing;
    }
    return undefined;
  };

  const getHideTimer = (): boolean => {
    if (selectedSession && 'config' in selectedSession && selectedSession.config?.hideTimer !== undefined) {
      return selectedSession.config.hideTimer;
    }
    return false;
  };

  // Show intention screen before meditation
  if (flowState === 'intention' && selectedSession) {
    return (
      <IntentionScreen
        onBegin={handleIntentionComplete}
        isDark={isDark}
        sessionName={selectedSession.title}
      />
    );
  }

  // Show meditation timer
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
          ambientSoundName={getAmbientSoundName()}
          isDark={isDark}
          breathingPattern={getBreathingPattern()}
          customBreathing={getCustomBreathing()}
          hideTimer={getHideTimer()}
          sessionHaptics={getSessionHaptics()}
          breathingHaptics={getBreathingHaptics()}
          intervalBellHaptics={getIntervalBellHaptics()}
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
        userIntention={userIntention}
        onContinue={handleCelebrationContinue}
        isDark={isDark}
      />
    );
  }

  // Default: show session list
  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Session Action Modal */}
      <Modal
        visible={actionModalSession !== null}
        transparent
        animationType="fade"
        onRequestClose={closeActionModal}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeActionModal}
          />
          <View style={[
            styles.modalContainer,
            { backgroundColor: isDark ? colors.neutral.charcoal[100] : colors.neutral.white }
          ]}>
            {/* Session title */}
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconCircle, { backgroundColor: isDark ? `${currentTheme.primary}40` : `${currentTheme.primary}26` }]}>
                <Ionicons name="leaf" size={28} color={currentTheme.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                {actionModalSession?.title}
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.text.secondary }]}>
                {t('custom.sessionOptions') || 'What would you like to do?'}
              </Text>
            </View>

            {/* Action buttons */}
            <View style={styles.modalActions}>
              <GradientButton
                title={t('custom.editSession') || 'Edit session'}
                gradient={themeGradients.button.primary}
                onPress={() => {
                  if (actionModalSession) {
                    closeActionModal();
                    handleEditSession(actionModalSession);
                  }
                }}
                style={styles.modalButton}
                size="lg"
                icon={<Ionicons name="pencil" size={20} color="#fff" />}
              />

              <TouchableOpacity
                style={[
                  styles.modalDeleteButton,
                  { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)' }
                ]}
                onPress={() => {
                  if (actionModalSession) {
                    closeActionModal();
                    handleDeleteSession(actionModalSession);
                  }
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text style={styles.modalDeleteButtonText}>
                  {t('custom.deleteSession') || 'Delete session'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalCancelButton,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                ]}
                onPress={closeActionModal}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalCancelButtonText, { color: colors.text.secondary }]}>
                  {t('common.cancel') || 'Cancel'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    letterSpacing: -1,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.regular,
  },

  // Main CTA Card - Headspace style
  mainCardContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  mainCard: {
    // borderRadius, overflow, and shadows come from globalCardStyles.primaryCta via dynamicStyles.mainCardShadow
  },
  mainCardGradient: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  mainCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainCardTextSection: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  mainCardLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainCardTitle: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.neutral.white,
    marginBottom: theme.spacing.sm,
  },
  mainCardCta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainCardCtaText: {
    fontSize: theme.typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mainCardIconSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingsContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconRing1: {
    width: 72,
    height: 72,
  },
  iconRing2: {
    width: 84,
    height: 84,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  mainCardIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sessions header
  sessionsHeader: {
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionsHeaderText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sessionsHeaderHint: {
    fontSize: theme.typography.fontSizes.xs,
  },

  loader: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  separator: {
    height: theme.spacing.lg, // Increased for shadow space (24px instead of 16px)
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyStateTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 12,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  modalSubtitle: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
  },
  modalActions: {
    gap: theme.spacing.md,
  },
  modalButton: {
    width: '100%',
  },
  modalDeleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  modalDeleteButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: '#EF4444',
  },
  modalCancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  modalCancelButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

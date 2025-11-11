import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SessionCard } from '../components/SessionCard';
import { MeditationTimer } from '../components/MeditationTimer';
import { PreparationScreen } from '../components/PreparationScreen';
import { CelebrationScreen } from '../components/CelebrationScreen';
import { GradientBackground } from '../components/GradientBackground';
import { api, MeditationSession } from '../services/api';
import { audioEngine } from '../services/audio';
import { saveSessionCompletion } from '../services/progressTracker';
import theme, { gradients } from '../theme';

type FlowState = 'list' | 'preparation' | 'meditation' | 'celebration';

export const MeditationScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [flowState, setFlowState] = useState<FlowState>('list');

  useEffect(() => {
    loadSessions();
  }, [i18n.language]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await api.sessions.getAll(i18n.language);
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = (session: MeditationSession) => {
    setSelectedSession(session);
    setFlowState('preparation');
  };

  const handleReadyToStart = async () => {
    if (!selectedSession) return;

    setFlowState('meditation');

    try {
      // Load audio tracks if available
      if (selectedSession.voiceUrl) {
        await audioEngine.loadTrack('voice', selectedSession.voiceUrl, 0.8);
      }
      if (selectedSession.ambientUrl) {
        await audioEngine.loadTrack('ambient', selectedSession.ambientUrl, 0.4);
      }
      if (selectedSession.chimeUrl) {
        await audioEngine.loadTrack('chime', selectedSession.chimeUrl, 0.6);
      }

      // Start with chime, then fade in ambient
      if (selectedSession.chimeUrl) {
        await audioEngine.play('chime');
      }
      if (selectedSession.ambientUrl) {
        await audioEngine.fadeIn('ambient', 3000);
      }
      if (selectedSession.voiceUrl) {
        setTimeout(() => audioEngine.play('voice'), 5000);
      }
    } catch (error) {
      console.error('Failed to start audio:', error);
    }
  };

  const handleComplete = async () => {
    try {
      // Save session completion for progress tracking
      if (selectedSession) {
        await saveSessionCompletion(
          selectedSession.id,
          selectedSession.title,
          selectedSession.durationSeconds,
          selectedSession.languageCode
        );
      }

      // Play ending chime
      if (selectedSession?.chimeUrl) {
        await audioEngine.play('chime');
      }

      // Fade out all tracks
      await audioEngine.fadeOut('voice', 2000);
      await audioEngine.fadeOut('ambient', 3000);

      // Move to celebration screen
      setTimeout(() => {
        setFlowState('celebration');
      }, 3000);
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await audioEngine.stopAll();
      await audioEngine.cleanup();
      setFlowState('list');
      setSelectedSession(null);
    } catch (error) {
      console.error('Failed to cancel session:', error);
    }
  };

  const handleCelebrationContinue = async () => {
    try {
      await audioEngine.cleanup();
      setFlowState('list');
      setSelectedSession(null);
    } catch (error) {
      console.error('Failed to cleanup after celebration:', error);
    }
  };

  // Show preparation screen
  if (flowState === 'preparation' && selectedSession) {
    return <PreparationScreen onReady={handleReadyToStart} />;
  }

  // Show meditation timer
  if (flowState === 'meditation' && selectedSession) {
    return (
      <GradientBackground gradient={gradients.screen.timer} style={styles.container}>
        <MeditationTimer
          totalSeconds={selectedSession.durationSeconds}
          onComplete={handleComplete}
          onCancel={handleCancel}
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('meditation.title')}</Text>
          <Text style={styles.subtitle}>{t('meditation.subtitle')}</Text>
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={theme.colors.accent.blue[500]} />
          </View>
        ) : (
          <View style={styles.sessionsList}>
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onPress={() => handleStartSession(session)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    // Removed flex: 1 to allow proper scrolling
  },
  scrollContent: {
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxxl,
    flexGrow: 1,
  },
  header: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
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
  loader: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  sessionsList: {
    gap: theme.spacing.md,
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SessionCard } from '../components/SessionCard';
import { MeditationTimer } from '../components/MeditationTimer';
import { api, MeditationSession } from '../services/api';
import { audioEngine } from '../services/audio';
import { saveSessionCompletion } from '../services/progressTracker';

export const MeditationScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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

  const handleStartSession = async (session: MeditationSession) => {
    setSelectedSession(session);
    setIsActive(true);

    try {
      // Load audio tracks if available
      if (session.voiceUrl) {
        await audioEngine.loadTrack('voice', session.voiceUrl, 0.8);
      }
      if (session.ambientUrl) {
        await audioEngine.loadTrack('ambient', session.ambientUrl, 0.4);
      }
      if (session.chimeUrl) {
        await audioEngine.loadTrack('chime', session.chimeUrl, 0.6);
      }

      // Start with chime, then fade in ambient
      if (session.chimeUrl) {
        await audioEngine.play('chime');
      }
      if (session.ambientUrl) {
        await audioEngine.fadeIn('ambient', 3000);
      }
      if (session.voiceUrl) {
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

      // Cleanup
      setTimeout(async () => {
        await audioEngine.cleanup();
        setIsActive(false);
        setSelectedSession(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await audioEngine.stopAll();
      await audioEngine.cleanup();
      setIsActive(false);
      setSelectedSession(null);
    } catch (error) {
      console.error('Failed to cancel session:', error);
    }
  };

  if (isActive && selectedSession) {
    return (
      <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
        <MeditationTimer
          totalSeconds={selectedSession.durationSeconds}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
          {t('meditation.title')}
        </Text>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={isDark ? '#0A84FF' : '#007AFF'} />
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightBg: {
    backgroundColor: '#FFFFFF',
  },
  darkBg: {
    backgroundColor: '#1A1A1A',
  },
  content: {
    padding: 24,
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    paddingTop: 16,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  loader: {
    padding: 32,
    alignItems: 'center',
  },
  sessionsList: {
    gap: 16,
  },
});

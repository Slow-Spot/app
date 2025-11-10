import React, { useEffect, useState } from 'react';
import { YStack, H2, ScrollView, Spinner } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { SessionCard } from '../components/SessionCard';
import { MeditationTimer } from '../components/MeditationTimer';
import { api, MeditationSession } from '../services/api';
import { audioEngine } from '../services/audio';

export const MeditationScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isActive, setIsActive] = useState(false);

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
      <YStack flex={1} backgroundColor="$background">
        <MeditationTimer
          totalSeconds={selectedSession.durationSeconds}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </YStack>
    );
  }

  return (
    <ScrollView>
      <YStack flex={1} padding="$6" gap="$6" backgroundColor="$background">
        <H2 size="$8" fontWeight="400" color="$color" paddingTop="$4">
          {t('meditation.title')}
        </H2>

        {loading ? (
          <YStack alignItems="center" padding="$8">
            <Spinner size="large" color="$primary" />
          </YStack>
        ) : (
          <YStack gap="$4">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onPress={() => handleStartSession(session)}
              />
            ))}
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
};

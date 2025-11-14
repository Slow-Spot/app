import React, { useEffect, useState } from 'react';
import { YStack, H2, ScrollView, Spinner } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { SessionCard } from '../components/SessionCard';
import { MeditationTimer } from '../components/MeditationTimer';
import { PreSessionInstructions } from '../components/PreSessionInstructions';
import { api, MeditationSession } from '../services/api';
import { audioEngine } from '../services/audio';
import { saveSessionCompletion } from '../services/progressTracker';
import { getInstructionForSession } from '../data/instructions';

export const MeditationScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [userIntention, setUserIntention] = useState('');

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

  const handleSelectSession = (session: MeditationSession) => {
    setSelectedSession(session);
    setShowInstructions(true);
  };

  const handleInstructionsComplete = async (intention: string) => {
    setUserIntention(intention);
    setShowInstructions(false);
    setIsActive(true);

    if (!selectedSession) return;

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

  const handleSkipInstructions = () => {
    setShowInstructions(false);
    setSelectedSession(null);
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

  // Show Pre-Session Instructions
  if (showInstructions && selectedSession) {
    const instruction = getInstructionForSession(
      selectedSession.level,
      'breath_awareness' // Default technique, can be mapped from session type
    );

    return (
      <YStack flex={1}>
        <PreSessionInstructions
          instruction={instruction}
          onComplete={handleInstructionsComplete}
          onSkip={handleSkipInstructions}
        />
      </YStack>
    );
  }

  // Show Meditation Timer (active session)
  if (isActive && selectedSession) {
    return (
      <YStack flex={1} background="$background">
        <MeditationTimer
          totalSeconds={selectedSession.durationSeconds}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </YStack>
    );
  }

  // Show Session List
  return (
    <ScrollView>
      <YStack flex={1} p="$6" gap="$6" background="$background">
        <H2 size="$8" fontWeight="400" color="$color" pt="$4">
          {t('meditation.title')}
        </H2>

        {loading ? (
          <YStack p="$8" style={{ alignItems: 'center' }}>
            <Spinner size="large" color={"$primary" as any} />
          </YStack>
        ) : (
          <YStack gap="$4">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onPress={() => handleSelectSession(session)}
              />
            ))}
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
};

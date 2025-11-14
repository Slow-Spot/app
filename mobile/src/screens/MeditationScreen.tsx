import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SessionCard } from '../components/SessionCard';
import { SessionFilters, FilterOptions } from '../components/SessionFilters';
import { MeditationTimer } from '../components/MeditationTimer';
import { PreSessionInstructions } from '../components/PreSessionInstructions';
import { CelebrationScreen } from '../components/CelebrationScreen';
import { GradientBackground } from '../components/GradientBackground';
import { api, MeditationSession } from '../services/api';
import { audioEngine } from '../services/audio';
import { saveSessionCompletion } from '../services/progressTracker';
import { getInstructionForSession } from '../data/instructions';
import { userPreferences } from '../services/userPreferences';
import theme, { gradients } from '../theme';

type FlowState = 'list' | 'instructions' | 'meditation' | 'celebration';

export const MeditationScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [allSessions, setAllSessions] = useState<MeditationSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [flowState, setFlowState] = useState<FlowState>('list');
  const [userIntention, setUserIntention] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
  });

  useEffect(() => {
    loadSessions();
  }, [i18n.language]);

  useEffect(() => {
    applyFilters();
  }, [allSessions, filters]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await api.sessions.getAll(i18n.language);
      setAllSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allSessions];

    // Filter by category
    if (filters.category !== 'all') {
      if (filters.category === 'traditional') {
        filtered = filtered.filter((s) => s.cultureTag === 'traditional');
      } else if (filters.category === 'occasion') {
        if (filters.occasion) {
          filtered = filtered.filter((s) => s.cultureTag === `occasion_${filters.occasion}`);
        } else {
          filtered = filtered.filter((s) => s.cultureTag?.startsWith('occasion_'));
        }
      } else if (filters.category === 'cultural') {
        if (filters.culture) {
          filtered = filtered.filter((s) => s.cultureTag === filters.culture);
        } else {
          filtered = filtered.filter(
            (s) =>
              s.cultureTag &&
              !s.cultureTag.startsWith('occasion_') &&
              s.cultureTag !== 'traditional'
          );
        }
      }
    }

    // Filter by level
    if (filters.level) {
      filtered = filtered.filter((s) => s.level === filters.level);
    }

    setFilteredSessions(filtered);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleStartSession = async (session: MeditationSession) => {
    setSelectedSession(session);

    // Check if user wants to skip instructions
    const shouldSkip = await userPreferences.shouldSkipInstructions();
    if (shouldSkip) {
      setFlowState('meditation');
      await handleInstructionsComplete('');
    } else {
      setFlowState('instructions');
    }
  };

  const handleInstructionsComplete = async (intention: string) => {
    setUserIntention(intention);
    setFlowState('meditation');

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
    setFlowState('list');
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
      setUserIntention('');
    } catch (error) {
      console.error('Failed to cleanup after celebration:', error);
    }
  };

  // ✨ FlatList optimization - Memoized render functions
  const renderItem = useCallback(
    ({ item }: { item: MeditationSession }) => (
      <SessionCard session={item} onPress={() => handleStartSession(item)} />
    ),
    []
  );

  const keyExtractor = useCallback((item: MeditationSession) => item.id, []);

  const renderListHeader = useCallback(
    () => (
      <>
        <View style={styles.header}>
          <Text style={styles.title}>{t('meditation.title')}</Text>
          <Text style={styles.subtitle}>{t('meditation.subtitle')}</Text>
        </View>
        <SessionFilters filters={filters} onFiltersChange={handleFiltersChange} />
      </>
    ),
    [t, filters]
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
      <FlatList
        data={loading ? [] : filteredSessions}
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
  loader: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  separator: {
    height: theme.spacing.md,
  },
});

import React, { useEffect, useState } from 'react';
import { YStack, XStack, H2, H3, Text, Button, Spinner, ScrollView, Card } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { QuoteCard } from '../components/QuoteCard';
import { api, Quote } from '../services/api';
import { getUniqueRandomQuote } from '../services/quoteHistory';
import { getProgressStats, ProgressStats } from '../services/progressTracker';

interface HomeScreenProps {
  onNavigateToMeditation: () => void;
  onNavigateToQuotes: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToMeditation,
  onNavigateToQuotes,
}) => {
  const { t, i18n } = useTranslation();
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProgressStats | null>(null);

  useEffect(() => {
    loadDailyQuote();
    loadProgress();
  }, [i18n.language]);

  const loadProgress = async () => {
    try {
      const progressStats = await getProgressStats();
      setStats(progressStats);
    } catch (error) {
      console.error('Failed to load progress stats:', error);
    }
  };

  const loadDailyQuote = async () => {
    try {
      setLoading(true);
      // Use unique random quote to prevent repetition
      const allQuotes = await api.quotes.getAll(i18n.language);
      if (allQuotes.length > 0) {
        const quote = await getUniqueRandomQuote(allQuotes, i18n.language);
        setDailyQuote(quote);
      }
    } catch (error) {
      console.error('Failed to load daily quote:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <YStack flex={1} p="$6" gap="$6" background="$background">
        {/* Welcome */}
        <YStack gap="$2" ai="center" pt="$8">
          <H2 size="$9" fontWeight="300" color="$color">
            {t('app.name')}
          </H2>
          <H2 size="$5" fontWeight="300" color="$placeholderColor">
            {t('app.tagline')}
          </H2>
        </YStack>

        {/* Progress Stats */}
        {stats && stats.totalSessions > 0 && (
          <Card p="$4" background="$backgroundHover" borderRadius="$4">
            <YStack gap="$3">
              <H3 size="$6" fontWeight="500" color="$color">
                {t('home.progress') || 'Your Progress'}
              </H3>
              <XStack gap="$4" jc="space-around">
                <YStack ai="center" gap="$1">
                  <Text fontSize={32} fontWeight="700" color="$primary">
                    {stats.currentStreak}
                  </Text>
                  <Text fontSize="$3" color="$placeholderColor">
                    🔥 {t('home.dayStreak') || 'day streak'}
                  </Text>
                </YStack>
                <YStack ai="center" gap="$1">
                  <Text fontSize={32} fontWeight="700" color="$primary">
                    {stats.totalMinutes}
                  </Text>
                  <Text fontSize="$3" color="$placeholderColor">
                    ⏱️ {t('home.totalMinutes') || 'total min'}
                  </Text>
                </YStack>
                <YStack ai="center" gap="$1">
                  <Text fontSize={32} fontWeight="700" color="$primary">
                    {stats.totalSessions}
                  </Text>
                  <Text fontSize="$3" color="$placeholderColor">
                    ✅ {t('home.sessions') || 'sessions'}
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </Card>
        )}

        {/* Daily Quote */}
        <YStack gap="$3">
          <H2 size="$6" fontWeight="400" color="$color">
            {t('home.dailyQuote')}
          </H2>
          {loading ? (
            <YStack ai="center" p="$8">
              <Spinner size="large" color="$primary" />
            </YStack>
          ) : dailyQuote ? (
            <QuoteCard quote={dailyQuote} />
          ) : null}
        </YStack>

        {/* Actions */}
        <YStack gap="$4" mt="$4">
          <Button
            size="$5"
            background="$primary"
            color="$background"
            borderRadius="$lg"
            fontSize="$6"
            fontWeight="500"
            onPress={onNavigateToMeditation}
          >
            {t('home.startMeditation')}
          </Button>

          <Button
            size="$5"
            background="$backgroundPress"
            color="$color"
            borderRadius="$lg"
            fontSize="$6"
            fontWeight="500"
            borderWidth={1}
            borderColor="$borderColor"
            onPress={onNavigateToQuotes}
          >
            {t('home.exploreSessions')}
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

import React, { useEffect, useState } from 'react';
import { YStack, H2, Button, Spinner, ScrollView } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { QuoteCard } from '../components/QuoteCard';
import { api, Quote } from '../services/api';

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

  useEffect(() => {
    loadDailyQuote();
  }, [i18n.language]);

  const loadDailyQuote = async () => {
    try {
      setLoading(true);
      const quote = await api.quotes.getRandom(i18n.language);
      setDailyQuote(quote);
    } catch (error) {
      console.error('Failed to load daily quote:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <YStack flex={1} padding="$6" gap="$6" backgroundColor="$background">
        {/* Welcome */}
        <YStack gap="$2" alignItems="center" paddingTop="$8">
          <H2 size="$9" fontWeight="300" color="$color">
            {t('app.name')}
          </H2>
          <H2 size="$5" fontWeight="300" color="$placeholderColor">
            {t('app.tagline')}
          </H2>
        </YStack>

        {/* Daily Quote */}
        <YStack gap="$3">
          <H2 size="$6" fontWeight="400" color="$color">
            {t('home.dailyQuote')}
          </H2>
          {loading ? (
            <YStack alignItems="center" padding="$8">
              <Spinner size="large" color="$primary" />
            </YStack>
          ) : dailyQuote ? (
            <QuoteCard quote={dailyQuote} />
          ) : null}
        </YStack>

        {/* Actions */}
        <YStack gap="$4" marginTop="$4">
          <Button
            size="$5"
            backgroundColor="$primary"
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
            backgroundColor="$backgroundPress"
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

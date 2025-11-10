import React, { useEffect, useState } from 'react';
import { YStack, XStack, H2, Button, ScrollView, Spinner } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { QuoteCard } from '../components/QuoteCard';
import { api, Quote } from '../services/api';

export const QuotesScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, [i18n.language]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const data = await api.quotes.getAll(i18n.language);
      setQuotes(data);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRandomQuote = async () => {
    try {
      const quote = await api.quotes.getRandom(i18n.language);
      setQuotes([quote]);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Failed to load random quote:', error);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  return (
    <ScrollView>
      <YStack flex={1} padding="$6" gap="$6" backgroundColor="$background">
        <H2 size="$8" fontWeight="400" color="$color" paddingTop="$4">
          {t('quotes.title')}
        </H2>

        {loading ? (
          <YStack alignItems="center" padding="$8">
            <Spinner size="large" color="$primary" />
          </YStack>
        ) : quotes.length > 0 ? (
          <>
            <QuoteCard quote={quotes[currentIndex]} />

            {/* Navigation */}
            <XStack gap="$3" justifyContent="center">
              <Button
                size="$4"
                backgroundColor="$backgroundPress"
                color="$color"
                borderRadius="$round"
                flex={1}
                maxWidth={120}
                onPress={handlePrevious}
                disabled={quotes.length <= 1}
              >
                {t('quotes.previous')}
              </Button>

              <Button
                size="$4"
                backgroundColor="$primary"
                color="$background"
                borderRadius="$round"
                flex={1}
                maxWidth={120}
                onPress={loadRandomQuote}
              >
                {t('quotes.random')}
              </Button>

              <Button
                size="$4"
                backgroundColor="$backgroundPress"
                color="$color"
                borderRadius="$round"
                flex={1}
                maxWidth={120}
                onPress={handleNext}
                disabled={quotes.length <= 1}
              >
                {t('quotes.next')}
              </Button>
            </XStack>
          </>
        ) : null}
      </YStack>
    </ScrollView>
  );
};

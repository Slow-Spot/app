import React, { useEffect, useState } from 'react';
import { YStack, XStack, H2, Button, ScrollView, Spinner } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { QuoteCard } from '../components/QuoteCard';
import { api, Quote } from '../services/api';
import { getUniqueRandomQuote, markQuoteAsShown } from '../services/quoteHistory';

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
      // Use unique random quote to prevent repetition
      const allQuotes = await api.quotes.getAll(i18n.language);
      if (allQuotes.length === 0) return;

      const quote = await getUniqueRandomQuote(allQuotes, i18n.language);

      // Update the current quote display
      const quoteIndex = quotes.findIndex(q => q.id === quote.id);
      if (quoteIndex >= 0) {
        setCurrentIndex(quoteIndex);
      } else {
        // Quote not in current list, reload all quotes
        setQuotes(allQuotes);
        setCurrentIndex(allQuotes.findIndex(q => q.id === quote.id));
      }
    } catch (error) {
      console.error('Failed to load random quote:', error);
    }
  };

  const handleNext = async () => {
    const nextIndex = (currentIndex + 1) % quotes.length;
    setCurrentIndex(nextIndex);

    // Mark the new quote as shown
    if (quotes[nextIndex]) {
      await markQuoteAsShown(i18n.language, quotes[nextIndex].id);
    }
  };

  const handlePrevious = async () => {
    const prevIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    setCurrentIndex(prevIndex);

    // Mark the new quote as shown
    if (quotes[prevIndex]) {
      await markQuoteAsShown(i18n.language, quotes[prevIndex].id);
    }
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

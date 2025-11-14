import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { QuoteCard } from '../components/QuoteCard';
import { api, Quote } from '../services/api';
import { getUniqueRandomQuote, markQuoteAsShown } from '../services/quoteHistory';

export const QuotesScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
    <ScrollView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
          {t('quotes.title')}
        </Text>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={isDark ? '#0A84FF' : '#007AFF'} />
          </View>
        ) : quotes.length > 0 ? (
          <>
            <QuoteCard quote={quotes[currentIndex]} />

            {/* Navigation */}
            <View style={styles.navigation}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  isDark ? styles.darkNavButton : styles.lightNavButton,
                  quotes.length <= 1 && styles.disabledButton
                ]}
                onPress={handlePrevious}
                disabled={quotes.length <= 1}
              >
                <Text style={[styles.navButtonText, isDark ? styles.darkText : styles.lightText]}>
                  {t('quotes.previous')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.randomButton, isDark ? styles.darkPrimaryButton : styles.lightPrimaryButton]}
                onPress={loadRandomQuote}
              >
                <Text style={styles.primaryButtonText}>
                  {t('quotes.random')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navButton,
                  isDark ? styles.darkNavButton : styles.lightNavButton,
                  quotes.length <= 1 && styles.disabledButton
                ]}
                onPress={handleNext}
                disabled={quotes.length <= 1}
              >
                <Text style={[styles.navButtonText, isDark ? styles.darkText : styles.lightText]}>
                  {t('quotes.next')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
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
    flex: 1,
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
  navigation: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  navButton: {
    flex: 1,
    width: 120,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  lightNavButton: {
    backgroundColor: '#F2F2F7',
  },
  darkNavButton: {
    backgroundColor: '#2C2C2E',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  randomButton: {
    flex: 1,
    width: 120,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  lightPrimaryButton: {
    backgroundColor: '#007AFF',
  },
  darkPrimaryButton: {
    backgroundColor: '#0A84FF',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

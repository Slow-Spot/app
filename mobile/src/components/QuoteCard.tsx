import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Quote } from '../services/api';

interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
      {/* Card Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.quoteText, isDark ? styles.darkText : styles.lightText]}>
            "{quote.text}"
          </Text>
          {quote.author && (
            <Text style={[styles.authorText, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
              — {quote.author}
            </Text>
          )}
        </View>
      </View>

      {/* Card Footer */}
      {(quote.category || quote.cultureTag) && (
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            {quote.category && (
              <Text style={[styles.categoryText, isDark ? styles.darkText : styles.lightText]}>
                {quote.category}
              </Text>
            )}
            {quote.cultureTag && (
              <Text style={[styles.cultureTagText, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
                {quote.cultureTag}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
  },
  darkCard: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  header: {
    padding: 16,
  },
  headerContent: {
    gap: 8,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 24,
    fontWeight: '300',
    textAlign: 'center',
  },
  authorText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightPlaceholder: {
    color: '#8E8E93',
  },
  darkPlaceholder: {
    color: '#8E8E93',
  },
  footer: {
    padding: 16,
    paddingTop: 0,
  },
  footerContent: {
    gap: 4,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
  },
  cultureTagText: {
    fontSize: 14,
  },
});

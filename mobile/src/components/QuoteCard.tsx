import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Quote } from '../services/api';
import theme from '../theme';

interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { i18n } = useTranslation();

  const userLanguage = i18n.language;
  const isOriginalLanguage = quote.originalLanguage === userLanguage;

  // Get the translation for user's language, or fallback to English
  const translation = quote.translations?.[userLanguage] || quote.translations?.en || quote.text;

  // Show original + transliteration + translation only if quote is in different language
  const showOriginal = !isOriginalLanguage && quote.originalLanguage !== 'en';

  return (
    <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
      {/* Card Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Original text in original script (if different language) */}
          {showOriginal && (
            <>
              <Text style={[styles.originalText, isDark ? styles.darkText : styles.lightText]}>
                "{quote.text}"
              </Text>

              {/* Transliteration (romanization) */}
              {quote.textTransliteration && (
                <Text style={[styles.transliterationText, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
                  {quote.textTransliteration}
                </Text>
              )}

              {/* Divider */}
              <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />
            </>
          )}

          {/* Translation or main text */}
          <Text style={[styles.quoteText, isDark ? styles.darkText : styles.lightText]}>
            "{translation}"
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
              <View style={[styles.badge, isDark ? styles.darkBadge : styles.lightBadge]}>
                <Text style={[styles.badgeText, isDark ? styles.darkText : styles.lightText]}>
                  {quote.category}
                </Text>
              </View>
            )}
            {quote.cultureTag && (
              <View style={[styles.badge, isDark ? styles.darkBadge : styles.lightBadge]}>
                <Text style={[styles.badgeText, isDark ? styles.darkText : styles.lightText]}>
                  {quote.cultureTag}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0,
    // Enhanced shadow for better depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lightCard: {
    backgroundColor: theme.colors.neutral.white,
    borderColor: 'transparent',
  },
  darkCard: {
    backgroundColor: theme.colors.neutral.charcoal[200],
    borderColor: theme.colors.neutral.charcoal[100],
  },
  header: {
    padding: theme.spacing.md,
  },
  headerContent: {
    gap: 12,
    alignItems: 'center',
  },
  originalText: {
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 32,
    opacity: 0.9,
  },
  transliterationText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  divider: {
    width: 60,
    height: 1,
    marginVertical: 8,
  },
  lightDivider: {
    backgroundColor: '#E5E5E5',
  },
  darkDivider: {
    backgroundColor: '#3A3A3C',
  },
  quoteText: {
    fontSize: 22,
    fontWeight: theme.typography.fontWeights.light,
    textAlign: 'center',
    lineHeight: 32,
  },
  authorText: {
    fontSize: theme.typography.fontSizes.md,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  lightText: {
    color: theme.colors.text.primary,
  },
  darkText: {
    color: theme.colors.neutral.white,
  },
  lightPlaceholder: {
    color: theme.colors.text.secondary,
  },
  darkPlaceholder: {
    color: theme.colors.text.secondary,
  },
  footer: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  footerContent: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  lightBadge: {
    backgroundColor: theme.colors.neutral.lightGray[100],
  },
  darkBadge: {
    backgroundColor: theme.colors.neutral.charcoal[100],
  },
  badgeText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    textTransform: 'capitalize',
  },
});

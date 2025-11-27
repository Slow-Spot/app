/**
 * CelebrationScreen Component
 *
 * Beautiful post-meditation celebration screen with mood tracking and notes.
 * Follows the app's consistent design language with white cards, mint accents,
 * and shadows matching HomeScreen and PreSessionInstructions.
 */

import { logger } from '../utils/logger';
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'expo-linear-gradient';
import { GradientBackground } from './GradientBackground';
import { GradientCard } from './GradientCard';
import { GradientButton } from './GradientButton';
import { api, Quote } from '../services/api';
import theme, { getThemeColors, getThemeGradients } from '../theme';

interface CelebrationScreenProps {
  durationMinutes: number;
  sessionTitle: string;
  onContinue: (mood?: MoodRating, notes?: string) => void;
  isDark?: boolean;
}

type MoodRating = 1 | 2 | 3 | 4 | 5;

const moodEmojis: Record<MoodRating, string> = {
  1: '😔',
  2: '😐',
  3: '🙂',
  4: '😊',
  5: '😄',
};

const moodLabels: Record<MoodRating, { en: string; pl: string }> = {
  1: { en: 'Difficult', pl: 'Trudno' },
  2: { en: 'Okay', pl: 'W porządku' },
  3: { en: 'Good', pl: 'Dobrze' },
  4: { en: 'Great', pl: 'Świetnie' },
  5: { en: 'Excellent', pl: 'Wspaniale' },
};

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  durationMinutes,
  sessionTitle,
  onContinue,
  isDark = false,
}) => {
  const { t, i18n } = useTranslation();

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Dynamic styles based on theme - matching PreSessionInstructions
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    subtitle: { color: colors.text.secondary },
    cardTitle: { color: colors.text.primary },
    cardDescription: { color: colors.text.secondary },
    cardShadow: isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
    statValue: { color: colors.text.primary },
    statLabel: { color: colors.text.secondary },
    moodCircle: {
      backgroundColor: isDark ? 'rgba(80, 80, 90, 0.6)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark ? 'rgba(120, 120, 130, 0.8)' : colors.neutral.lightGray[200],
    },
    moodCircleSelected: {
      backgroundColor: isDark ? `${colors.accent.mint[600]}40` : `${theme.colors.accent.mint[100]}`,
      borderColor: colors.accent.mint[500],
    },
    moodLabel: { color: colors.text.secondary },
    moodLabelSelected: { color: colors.accent.mint[600] },
    inputBg: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    inputBorder: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[200],
    inputText: { color: colors.text.primary },
    inputPlaceholder: isDark ? colors.neutral.gray[500] : theme.colors.neutral.gray[400],
    quoteText: { color: colors.text.primary },
    quoteAuthor: { color: colors.text.secondary },
    iconBoxBg: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
  }), [colors, isDark]);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null);
  const [notes, setNotes] = useState('');
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadQuote();

    // Animate checkmark entrance
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Fade in content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadQuote = async () => {
    try {
      setLoading(true);
      const randomQuote = await api.quotes.getRandom(i18n.language);
      setQuote(randomQuote);
    } catch (error) {
      logger.error('Failed to load quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood: MoodRating) => {
    setSelectedMood(mood);
  };

  const handleContinue = () => {
    onContinue(selectedMood || undefined, notes || undefined);
  };

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with checkmark and congratulations */}
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <Animated.View
              style={[
                styles.checkmarkContainer,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <LinearGradient
                colors={[theme.colors.accent.mint[400], theme.colors.accent.mint[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.checkmarkCircle}
              >
                <Ionicons
                  name="checkmark"
                  size={36}
                  color={theme.colors.neutral.white}
                />
              </LinearGradient>
            </Animated.View>
            <Text style={[styles.title, dynamicStyles.title]}>
              {t('meditation.wellDone', 'Świetna robota!')}
            </Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
              {t('meditation.completedSession', 'Ukończyłeś sesję medytacji')}
            </Text>
          </Animated.View>

          {/* Session Stats Card */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <GradientCard
              gradient={themeGradients.card.whiteCard}
              style={[styles.card, dynamicStyles.cardShadow]}
              isDark={isDark}
            >
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
                  <Ionicons name="stats-chart" size={24} color={colors.accent.mint[500]} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                    {t('meditation.sessionDetails', 'Szczegóły sesji')}
                  </Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, dynamicStyles.statValue]}>
                        {sessionTitle}
                      </Text>
                      <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                        {t('meditation.session', 'Sesja')}
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, dynamicStyles.statValue]}>
                        {t('meditation.minutes', { count: durationMinutes })}
                      </Text>
                      <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                        {t('meditation.duration', 'Czas trwania')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </GradientCard>
          </Animated.View>

          {/* Mood Rating Card */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <GradientCard
              gradient={themeGradients.card.whiteCard}
              style={[styles.card, dynamicStyles.cardShadow]}
              isDark={isDark}
            >
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
                  <Ionicons name="heart" size={24} color={colors.accent.mint[500]} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                    {t('meditation.howDoYouFeel', 'Jak się czujesz?')}
                  </Text>
                  <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                    {t('meditation.moodDescription', 'Oceń swoje samopoczucie po sesji')}
                  </Text>
                </View>
              </View>
              <View style={styles.moodOptions}>
                {([1, 2, 3, 4, 5] as MoodRating[]).map((mood) => (
                  <TouchableOpacity
                    key={mood}
                    style={styles.moodOption}
                    onPress={() => handleMoodSelect(mood)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.moodCircle,
                        dynamicStyles.moodCircle,
                        selectedMood === mood && [styles.moodCircleSelected, dynamicStyles.moodCircleSelected],
                      ]}
                    >
                      <Text style={styles.moodEmoji}>{moodEmojis[mood]}</Text>
                    </View>
                    <Text
                      style={[
                        styles.moodLabel,
                        dynamicStyles.moodLabel,
                        selectedMood === mood && [styles.moodLabelSelected, dynamicStyles.moodLabelSelected],
                      ]}
                    >
                      {moodLabels[mood][i18n.language as 'en' | 'pl'] || moodLabels[mood].en}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GradientCard>
          </Animated.View>

          {/* Notes Card */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <GradientCard
              gradient={themeGradients.card.whiteCard}
              style={[styles.card, dynamicStyles.cardShadow]}
              isDark={isDark}
            >
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
                  <Ionicons name="create" size={24} color={colors.accent.mint[500]} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                    {t('meditation.sessionNotes', 'Notatki z sesji')}
                  </Text>
                  <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                    {t('meditation.notesOptional', 'Zapisz swoje przemyślenia (opcjonalnie)')}
                  </Text>
                </View>
              </View>
              <TextInput
                style={[
                  styles.notesInput,
                  {
                    backgroundColor: dynamicStyles.inputBg,
                    borderColor: dynamicStyles.inputBorder,
                    color: dynamicStyles.inputText.color,
                  },
                ]}
                placeholder={t('meditation.notesPlaceholder', 'Jak się czujesz? Jakie masz przemyślenia?')}
                placeholderTextColor={dynamicStyles.inputPlaceholder}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                maxLength={500}
                textAlignVertical="top"
              />
            </GradientCard>
          </Animated.View>

          {/* Inspirational Quote Card */}
          {!loading && quote && quote.text && (
            <Animated.View style={{ opacity: fadeAnim }}>
              <GradientCard
                gradient={themeGradients.card.whiteCard}
                style={[styles.card, dynamicStyles.cardShadow]}
                isDark={isDark}
              >
                <View style={styles.cardRow}>
                  <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
                    <Ionicons name="sparkles" size={24} color={colors.accent.mint[500]} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                      {t('meditation.inspiration', 'Inspiracja')}
                    </Text>
                  </View>
                </View>
                <View style={styles.quoteContent}>
                  <Text style={[styles.quoteText, dynamicStyles.quoteText]}>
                    "{quote.text}"
                  </Text>
                  {quote.author && (
                    <Text style={[styles.quoteAuthor, dynamicStyles.quoteAuthor]}>
                      — {quote.author}
                    </Text>
                  )}
                </View>
              </GradientCard>
            </Animated.View>
          )}

          {/* Continue Button */}
          <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
            <GradientButton
              title={t('meditation.continue', 'Kontynuuj')}
              gradient={themeGradients.button.success}
              onPress={handleContinue}
              size="lg"
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  checkmarkContainer: {
    marginBottom: theme.spacing.md,
    ...theme.shadows.lg,
  },
  checkmarkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeights.medium,
  },
  card: {
    // padding handled by GradientCard
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.xs,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.xs,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.neutral.lightGray[200],
    marginHorizontal: theme.spacing.md,
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
  },
  moodOption: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  moodCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    ...theme.shadows.sm,
  },
  moodCircleSelected: {
    borderWidth: 3,
    ...theme.shadows.md,
  },
  moodEmoji: {
    fontSize: 26,
  },
  moodLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: '500',
    textAlign: 'center',
  },
  moodLabelSelected: {
    fontWeight: '600',
  },
  notesInput: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.sm,
    minHeight: 100,
    marginTop: theme.spacing.md,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  quoteContent: {
    marginTop: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent.mint[400],
  },
  quoteText: {
    fontSize: theme.typography.fontSizes.sm,
    fontStyle: 'italic',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
    marginBottom: theme.spacing.sm,
  },
  quoteAuthor: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
  },
});

export default CelebrationScreen;
